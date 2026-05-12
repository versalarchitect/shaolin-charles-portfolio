import { useCallback, useRef, useState } from 'react';
import {
  cancelSimulationRun,
  checkOllamaHealth,
  completeSimulationRun,
  createSimulationRun,
  fetchSimulationCourseData,
  fetchSimulationHistory,
  fetchSimulationReport,
  type OllamaStatus,
  type SimulationRunRow,
  updateSimulationRun,
} from '@/lib/simulation-api';
import {
  getPersona,
  type PersonaLevel,
  runSimulation,
  type SimulationProgress,
  type SimulationReport,
} from '@/lib/student-simulator';
import { useAuth } from './use-auth';

export interface SimulationConfig {
  persona: PersonaLevel;
  limitModules?: number;
  limitLessons?: number;
  model?: string;
}

interface SimulationState {
  status: 'idle' | 'loading' | 'running' | 'completed' | 'failed';
  progress: SimulationProgress | null;
  report: SimulationReport | null;
  error: string | null;
  ollamaStatus: OllamaStatus;
  ollamaModels: string[];
  history: SimulationRunRow[];
  historyLoading: boolean;
  currentRunId: string | null;
}

const INITIAL_STATE: SimulationState = {
  status: 'idle',
  progress: null,
  report: null,
  error: null,
  ollamaStatus: 'checking',
  ollamaModels: [],
  history: [],
  historyLoading: true,
  currentRunId: null,
};

export function useStudentSimulation() {
  const { user } = useAuth();
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const refreshOllamaStatus = useCallback(async () => {
    setState((s) => ({ ...s, ollamaStatus: 'checking' }));
    const result = await checkOllamaHealth();
    setState((s) => ({
      ...s,
      ollamaStatus: result.status,
      ollamaModels: result.models,
    }));
    return result;
  }, []);

  const refreshHistory = useCallback(async () => {
    setState((s) => ({ ...s, historyLoading: true }));
    try {
      const runs = await fetchSimulationHistory();
      setState((s) => ({ ...s, history: runs, historyLoading: false }));
    } catch {
      setState((s) => ({ ...s, historyLoading: false }));
    }
  }, []);

  const start = useCallback(
    async (config: SimulationConfig) => {
      if (!user?.email) return;

      const abort = new AbortController();
      abortRef.current = abort;

      setState((s) => ({
        ...s,
        status: 'loading',
        progress: null,
        report: null,
        error: null,
        currentRunId: null,
      }));

      try {
        const persona = getPersona(config.persona);

        const courseData = await fetchSimulationCourseData();

        if (courseData.modules.length === 0) {
          throw new Error('No course modules found. Seed the course content first.');
        }

        let runId: string | null = null;
        try {
          runId = await createSimulationRun(user.email, config.persona, persona.name, {
            limitModules: config.limitModules,
            limitLessons: config.limitLessons,
            model: config.model,
          });
        } catch {
          // DB write may fail if migration not applied — continue without persistence
        }

        setState((s) => ({ ...s, status: 'running', currentRunId: runId }));

        const report = await runSimulation(
          courseData,
          persona,
          (progress) => {
            setState((s) => ({ ...s, progress }));
          },
          {
            limitModules: config.limitModules,
            limitLessons: config.limitLessons,
            model: config.model,
          },
          abort.signal,
        );

        if (runId) {
          try {
            await completeSimulationRun(
              runId,
              report,
              report.stats as unknown as Record<string, unknown>,
            );
          } catch {
            // Persist failure is non-fatal
          }
        }

        localStorage.setItem('student-sim-latest', JSON.stringify(report));

        setState((s) => ({
          ...s,
          status: 'completed',
          report,
          error: null,
        }));

        await refreshHistory();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const isCancelled = message.includes('cancelled') || abort.signal.aborted;

        if (state.currentRunId) {
          try {
            if (isCancelled) {
              await cancelSimulationRun(state.currentRunId);
            } else {
              await updateSimulationRun(state.currentRunId, {
                status: 'failed',
                error: message,
              });
            }
          } catch {
            // Non-fatal
          }
        }

        setState((s) => ({
          ...s,
          status: isCancelled ? 'idle' : 'failed',
          error: isCancelled ? null : message,
        }));
      } finally {
        abortRef.current = null;
      }
    },
    [user?.email, refreshHistory, state.currentRunId],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState((s) => ({
      ...INITIAL_STATE,
      ollamaStatus: s.ollamaStatus,
      ollamaModels: s.ollamaModels,
      history: s.history,
      historyLoading: s.historyLoading,
    }));
  }, []);

  const loadReport = useCallback(async (runId: string) => {
    try {
      const report = await fetchSimulationReport(runId);
      if (report) {
        setState((s) => ({
          ...s,
          status: 'completed',
          report: report as SimulationReport,
          currentRunId: runId,
        }));
      }
    } catch {
      // Non-fatal
    }
  }, []);

  return {
    ...state,
    start,
    cancel,
    reset,
    loadReport,
    refreshOllamaStatus,
    refreshHistory,
  };
}
