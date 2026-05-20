import {
  AlertTriangle,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  Microscope,
  Play,
  RotateCcw,
  Square,
  Terminal,
  User,
  XCircle,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Navigate } from '@/lib/localized-router';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { useAuth } from '@/hooks/use-auth';
import { type SimulationConfig, useStudentSimulation } from '@/hooks/use-student-simulation';
import { hasPipelineAccess } from '@/lib/pipeline-access';
import type { SimulationRunRow } from '@/lib/simulation-api';
import {
  type BlockReport,
  generateMarkdownReport,
  type LessonReport,
  type ModuleReport,
  type PersonaLevel,
  type SimulationLog,
  type SimulationReport,
} from '@/lib/student-simulator';

const EASE = [0.33, 1, 0.68, 1] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function stars(n: number, max = 5): string {
  const filled = Math.max(0, Math.min(max, Math.round(n)));
  return '★'.repeat(filled) + '☆'.repeat(max - filled);
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Ollama Banner
// ---------------------------------------------------------------------------

function OllamaBanner({ status, onRetry }: { status: string; onRetry: () => void }) {
  if (status === 'available' || status === 'checking') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-2"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-sm font-medium">Ollama is not running</span>
      </div>
      <p className="text-xs text-foreground/60 font-mono">
        Start Ollama: ollama serve
      </p>
      <button
        onClick={onRetry}
        className="text-xs text-foreground/50 hover:text-foreground/80 transition-colors font-mono underline"
      >
        Retry connection
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Persona Selector
// ---------------------------------------------------------------------------

const PERSONA_META: Record<PersonaLevel, { icon: typeof User; color: string; label: string }> = {
  beginner: { icon: User, color: 'text-green-500', label: 'Beginner' },
  intermediate: { icon: GraduationCap, color: 'text-blue-500', label: 'Intermediate' },
  advanced: { icon: Microscope, color: 'text-purple-500', label: 'Advanced' },
};

const PERSONA_INFO: Record<PersonaLevel, { name: string; desc: string }> = {
  beginner: { name: 'Alex', desc: 'CS student, new to LLMs' },
  intermediate: { name: 'Jordan', desc: 'Engineer, used OpenAI, new to Claude' },
  advanced: { name: 'Morgan', desc: 'Senior AI engineer, deep expertise' },
};

function PersonaSelector({
  selected,
  onSelect,
}: {
  selected: PersonaLevel;
  onSelect: (p: PersonaLevel) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(['beginner', 'intermediate', 'advanced'] as PersonaLevel[]).map((level) => {
        const meta = PERSONA_META[level];
        const info = PERSONA_INFO[level];
        const isActive = selected === level;
        const Icon = meta.icon;

        return (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`
              relative rounded-xl border p-4 text-left transition-all cursor-pointer
              ${
                isActive
                  ? 'border-foreground/20 bg-foreground/[0.04] ring-1 ring-foreground/10'
                  : 'border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/15 hover:bg-foreground/[0.03]'
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${meta.color}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">
                {meta.label}
              </span>
            </div>
            <p className="text-sm font-medium mb-1">{info.name}</p>
            <p className="text-xs text-foreground/50">{info.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Config Panel
// ---------------------------------------------------------------------------

function ConfigPanel({
  ollamaStatus,
  ollamaModels,
  onStart,
  onRetryOllama,
}: {
  ollamaStatus: string;
  ollamaModels: string[];
  onStart: (config: SimulationConfig) => void;
  onRetryOllama: () => void;
}) {
  const [persona, setPersona] = useState<PersonaLevel>('beginner');
  const [limitModules, setLimitModules] = useState<string>('');
  const [limitLessons, setLimitLessons] = useState<string>('');
  const [model, setModel] = useState('qwen2.5:7b');

  const canRun = ollamaStatus === 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-6"
    >
      <OllamaBanner status={ollamaStatus} onRetry={onRetryOllama} />

      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5 space-y-5">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          Select Persona
        </h2>
        <PersonaSelector selected={persona} onSelect={setPersona} />

        <div className="h-px bg-foreground/[0.06]" />

        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">Options</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase text-foreground/30 block mb-1.5">
              Limit Modules
            </label>
            <input
              type="number"
              min="1"
              placeholder="All"
              value={limitModules}
              onChange={(e) => setLimitModules(e.target.value)}
              className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2 text-sm font-mono placeholder:text-foreground/20 focus:outline-none focus:border-foreground/20"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-foreground/30 block mb-1.5">
              Limit Lessons
            </label>
            <input
              type="number"
              min="1"
              placeholder="All"
              value={limitLessons}
              onChange={(e) => setLimitLessons(e.target.value)}
              className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2 text-sm font-mono placeholder:text-foreground/20 focus:outline-none focus:border-foreground/20"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-foreground/30 block mb-1.5">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2 text-sm font-mono focus:outline-none focus:border-foreground/20"
            >
              <option value="qwen2.5:7b">qwen2.5:7b</option>
              {ollamaModels
                .filter((m) => m !== 'qwen2.5:7b')
                .map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button
          onClick={() =>
            onStart({
              persona,
              limitModules: limitModules ? parseInt(limitModules, 10) : undefined,
              limitLessons: limitLessons ? parseInt(limitLessons, 10) : undefined,
              model,
            })
          }
          disabled={!canRun}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground text-background py-3 px-6 text-sm font-mono font-medium transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Run Simulation
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Progress Panel
// ---------------------------------------------------------------------------

function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-[10px] font-mono uppercase text-foreground/30">{label}</span>
          <span className="text-[10px] font-mono text-foreground/50">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-foreground/25"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </div>
    </div>
  );
}

const STAGE_COLORS: Record<string, string> = {
  sim: 'text-foreground/50',
  module: 'text-blue-400',
  lesson: 'text-green-400',
  block: 'text-amber-400',
  course: 'text-purple-400',
  error: 'text-red-400',
};

function LogViewer({ logs }: { logs: SimulationLog[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <div className="rounded-lg border border-foreground/[0.06] bg-foreground/[0.01] max-h-48 overflow-y-auto">
      <div className="p-3 space-y-0.5">
        {logs.map((entry, i) => (
          <div key={i} className="flex gap-2 text-[11px] font-mono leading-relaxed">
            <span className="text-foreground/25 shrink-0">{entry.timestamp}</span>
            <span
              className={`shrink-0 w-14 text-right ${STAGE_COLORS[entry.stage] ?? 'text-foreground/40'}`}
            >
              [{entry.stage}]
            </span>
            <span className="text-foreground/60">{entry.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function ProgressPanel({
  progress,
  startTime,
  onCancel,
}: {
  progress: NonNullable<ReturnType<typeof useStudentSimulation>['progress']>;
  startTime: number;
  onCancel: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const blocksPerMin =
    elapsed > 10000 && progress.blocksCompleted > 0
      ? ((progress.blocksCompleted / elapsed) * 60000).toFixed(1)
      : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-foreground/40" />
            <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
              Running Simulation
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-mono text-red-500/70 hover:text-red-500 transition-colors"
          >
            <Square className="w-3 h-3" />
            Cancel
          </button>
        </div>

        {progress.currentModule && (
          <div className="text-sm text-foreground/70 font-mono">
            {progress.currentModule}
            {progress.currentLesson && <span className="text-foreground/30"> / </span>}
            {progress.currentLesson}
            {progress.currentBlock && (
              <>
                <span className="text-foreground/30"> / </span>
                <span className="text-foreground/50">{progress.currentBlock}</span>
              </>
            )}
          </div>
        )}

        <ProgressBar value={progress.blocksCompleted} max={progress.blocksTotal} label="Blocks" />
        <ProgressBar
          value={progress.lessonsCompleted}
          max={progress.lessonsTotal}
          label="Lessons"
        />
        <ProgressBar
          value={progress.modulesCompleted}
          max={progress.modulesTotal}
          label="Modules"
        />

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'LLM Calls', value: String(progress.llmCalls), icon: Zap },
            { label: 'Elapsed', value: formatDuration(elapsed), icon: Clock },
            { label: 'Blocks/min', value: blocksPerMin, icon: BookOpen },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-lg bg-foreground/[0.02] border border-foreground/[0.06] p-3"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className="w-3 h-3 text-foreground/30" />
                <span className="text-[10px] font-mono uppercase text-foreground/30">
                  {m.label}
                </span>
              </div>
              <span className="text-sm font-mono font-medium">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-foreground/40" />
          <span className="text-sm font-mono uppercase tracking-wider text-foreground/40">Log</span>
        </div>
        <LogViewer logs={progress.logs} />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Results Panel
// ---------------------------------------------------------------------------

function ScoreCard({
  label,
  value,
  max = 5,
  type = 'star',
}: {
  label: string;
  value: number;
  max?: number;
  type?: 'star' | 'number';
}) {
  return (
    <div className="rounded-lg bg-foreground/[0.02] border border-foreground/[0.06] p-3">
      <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">{label}</span>
      {type === 'star' ? (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-mono font-medium">
            {value}/{max}
          </span>
          <span className="text-foreground/30 text-xs">{stars(value, max)}</span>
        </div>
      ) : (
        <span className="text-sm font-mono font-medium">
          {value}/{max}
        </span>
      )}
    </div>
  );
}

function BlockDetail({ block }: { block: BlockReport }) {
  const [expanded, setExpanded] = useState(false);
  const f = block.feedback;

  const metrics = [
    { label: 'Clarity', value: f.clarity },
    { label: 'Accuracy', value: f.accuracy },
    { label: 'Completeness', value: f.completeness },
    { label: 'Engagement', value: f.engagement },
    { label: 'Difficulty', value: f.difficulty },
  ];

  return (
    <div className="rounded-lg border border-foreground/[0.06] bg-foreground/[0.01]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 text-left hover:bg-foreground/[0.02] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3 text-foreground/30" />
        ) : (
          <ChevronRight className="w-3 h-3 text-foreground/30" />
        )}
        <span className="text-xs font-mono font-medium flex-1">{block.heading ?? 'Untitled'}</span>
        <span className="text-[10px] font-mono text-foreground/30">{block.word_count}w</span>
        <div className="flex gap-1">
          {metrics.map((m) => (
            <span
              key={m.label}
              className={`text-[10px] font-mono ${m.value >= 4 ? 'text-green-500/70' : m.value >= 3 ? 'text-foreground/40' : 'text-red-500/70'}`}
            >
              {m.value}
            </span>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-foreground/[0.04] pt-3">
              <div className="grid grid-cols-5 gap-2">
                {metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <span className="text-[9px] font-mono uppercase text-foreground/25 block">
                      {m.label}
                    </span>
                    <div className="h-1.5 rounded-full bg-foreground/[0.06] mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-foreground/20"
                        style={{ width: `${(m.value / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-foreground/50">{m.value}/5</span>
                  </div>
                ))}
              </div>

              <blockquote className="text-xs text-foreground/60 italic border-l-2 border-foreground/10 pl-3">
                {f.reaction}
              </blockquote>

              {f.confusion_points.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">
                    Confusion
                  </span>
                  <ul className="space-y-0.5">
                    {f.confusion_points.map((p, i) => (
                      <li key={i} className="text-xs text-foreground/50 flex gap-1.5">
                        <span className="text-red-500/50 shrink-0">&bull;</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {f.suggestions.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">
                    Suggestions
                  </span>
                  <ul className="space-y-0.5">
                    {f.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-foreground/50 flex gap-1.5">
                        <span className="text-foreground/30 shrink-0">&bull;</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonSection({ lesson }: { lesson: LessonReport }) {
  const [expanded, setExpanded] = useState(false);
  const f = lesson.feedback;

  return (
    <div className="rounded-lg border border-foreground/[0.06]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-foreground/[0.02] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-foreground/30" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
        )}
        <span className="text-sm font-medium flex-1">{lesson.title}</span>
        <span className="text-xs font-mono text-foreground/40">
          {stars(f.overall_rating)} {f.overall_rating}/5
        </span>
        {f.would_recommend && <CheckCircle2 className="w-3.5 h-3.5 text-green-500/50" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-foreground/[0.04] pt-3">
              <p className="text-xs text-foreground/60 italic">{f.summary}</p>

              <div className="flex gap-4 text-xs font-mono">
                <span className="text-foreground/40">Flow: {f.flow_rating}/5</span>
                <span className="text-foreground/40">Blocks: {lesson.block_count}</span>
              </div>

              {f.key_takeaways.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">
                    Takeaways
                  </span>
                  <ul className="space-y-0.5">
                    {f.key_takeaways.map((t, i) => (
                      <li key={i} className="text-xs text-foreground/50">
                        &bull; {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {f.gaps.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">
                    Gaps
                  </span>
                  <ul className="space-y-0.5">
                    {f.gaps.map((g, i) => (
                      <li key={i} className="text-xs text-foreground/50 text-amber-500/60">
                        &bull; {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-1.5">
                {lesson.blocks.map((block) => (
                  <BlockDetail key={block.block_id} block={block} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModuleSection({ module }: { module: ModuleReport }) {
  const [expanded, setExpanded] = useState(true);
  const avgRating =
    module.lessons.length > 0
      ? module.lessons.reduce((s, l) => s + l.feedback.overall_rating, 0) / module.lessons.length
      : 0;

  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-foreground/[0.03] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-foreground/30" />
        ) : (
          <ChevronRight className="w-4 h-4 text-foreground/30" />
        )}
        <span className="font-medium flex-1">{module.title}</span>
        <span className="text-xs font-mono text-foreground/40">
          {module.lessons.length} lessons &middot; {stars(avgRating)} {avgRating.toFixed(1)}/5
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-foreground/[0.04] pt-3">
              {module.lessons.map((lesson) => (
                <LessonSection key={lesson.lesson_id} lesson={lesson} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultsPanel({ report, onReset }: { report: SimulationReport; onReset: () => void }) {
  const cf = report.course_feedback;

  function handleExportJson() {
    const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    downloadBlob(
      JSON.stringify(report, null, 2),
      `student-sim-${report.persona.level}-${ts}.json`,
      'application/json',
    );
    toast.success('JSON report downloaded');
  }

  function handleExportMarkdown() {
    const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    downloadBlob(
      generateMarkdownReport(report),
      `student-sim-${report.persona.level}-${ts}.md`,
      'text/markdown',
    );
    toast.success('Markdown report downloaded');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-4"
    >
      {/* Executive Summary */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
            Results — {report.persona.name} ({report.persona.level})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-mono text-foreground/50 hover:text-foreground/80 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> New Run
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ScoreCard label="Overall" value={cf.overall_rating} />
          <ScoreCard label="Readiness" value={cf.readiness_rating} />
          <ScoreCard label="NPS" value={cf.nps_score} max={10} type="number" />
          <div className="rounded-lg bg-foreground/[0.02] border border-foreground/[0.06] p-3">
            <span className="text-[10px] font-mono uppercase text-foreground/30 block mb-1">
              Stats
            </span>
            <span className="text-[10px] font-mono text-foreground/50 leading-relaxed block">
              {report.stats.total_blocks} blocks &middot;{' '}
              {report.stats.total_words.toLocaleString()} words
              <br />
              {report.stats.llm_calls} calls &middot; {formatDuration(report.stats.duration_ms)}
            </span>
          </div>
        </div>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
          <h3 className="text-[10px] font-mono uppercase text-foreground/30 mb-2">Strengths</h3>
          <ul className="space-y-1">
            {cf.top_strengths.map((s, i) => (
              <li key={i} className="text-xs text-foreground/60 flex gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-green-500/50 shrink-0 mt-0.5" /> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
          <h3 className="text-[10px] font-mono uppercase text-foreground/30 mb-2">Weaknesses</h3>
          <ul className="space-y-1">
            {cf.top_weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-foreground/60 flex gap-1.5">
                <XCircle className="w-3 h-3 text-red-500/50 shrink-0 mt-0.5" /> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Topics */}
      {cf.missing_topics.length > 0 && (
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
          <h3 className="text-[10px] font-mono uppercase text-foreground/30 mb-2">
            Missing Topics
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {cf.missing_topics.map((t, i) => (
              <span
                key={i}
                className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-foreground/[0.08] text-foreground/50"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Final Thoughts */}
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <h3 className="text-[10px] font-mono uppercase text-foreground/30 mb-2">Final Thoughts</h3>
        <p className="text-xs text-foreground/60 italic leading-relaxed">{cf.final_thoughts}</p>
      </div>

      {/* Module Details */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          Detailed Breakdown
        </h2>
        {report.modules.map((mod) => (
          <ModuleSection key={mod.module_id} module={mod} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-4 py-2.5 text-xs font-mono text-foreground/60 hover:text-foreground/80 hover:border-foreground/15 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export JSON
        </button>
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-2 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-4 py-2.5 text-xs font-mono text-foreground/60 hover:text-foreground/80 hover:border-foreground/15 transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          Export Markdown
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Run History
// ---------------------------------------------------------------------------

function StatusDot({ status }: { status: string }) {
  if (status === 'completed') return <span className="w-2 h-2 rounded-full bg-green-500" />;
  if (status === 'failed') return <span className="w-2 h-2 rounded-full bg-red-500" />;
  if (status === 'cancelled') return <span className="w-2 h-2 rounded-full bg-foreground/20" />;
  return <span className="w-2 h-2 rounded-full bg-foreground/40 animate-pulse" />;
}

function RunHistory({
  runs,
  loading,
  onSelect,
}: {
  runs: SimulationRunRow[];
  loading: boolean;
  onSelect: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <div className="h-4 w-32 bg-foreground/[0.06] rounded animate-pulse mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-foreground/[0.04] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (runs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4"
    >
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40 mb-3">
        Past Runs
      </h2>
      <div className="space-y-1.5">
        {runs.map((run) => {
          const stats = run.stats as Record<string, number> | null;
          const rating = (run.report as SimulationReport | null)?.course_feedback?.overall_rating;

          return (
            <button
              key={run.id}
              onClick={() => run.status === 'completed' && onSelect(run.id)}
              disabled={run.status !== 'completed'}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-foreground/[0.03] transition-colors disabled:opacity-40 disabled:cursor-default"
            >
              <StatusDot status={run.status} />
              <span
                className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-foreground/[0.08] ${
                  PERSONA_META[run.persona_level as PersonaLevel]?.color ?? 'text-foreground/40'
                }`}
              >
                {run.persona_name}
              </span>
              <span className="text-xs text-foreground/50 flex-1">{timeAgo(run.started_at)}</span>
              {stats?.duration_ms && (
                <span className="text-[10px] font-mono text-foreground/30">
                  {formatDuration(stats.duration_ms)}
                </span>
              )}
              {rating && (
                <span className="text-[10px] font-mono text-foreground/40">
                  {stars(rating)} {rating}/5
                </span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function StudentAgent() {
  const { user } = useAuth();
  const sim = useStudentSimulation();
  const [startTime] = useState(() => Date.now());
  const [runStartTime, setRunStartTime] = useState(Date.now());

  useEffect(() => {
    sim.refreshOllamaStatus();
    sim.refreshHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasPipelineAccess(user?.email)) {
    return <Navigate to="/course/dashboard" replace />;
  }

  function handleStart(config: SimulationConfig) {
    setRunStartTime(Date.now());
    sim.start(config);
  }

  return (
    <>
      <SEO
        title="Student Agent"
        description="AI-powered course feedback simulator"
        path="course/student-agent"
      />

      <div className="p-6 lg:p-8 max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-foreground/60" />
            <h1 className="text-2xl font-bold tracking-tight">Student Agent</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Simulate an AI student walking through the course to generate structured pedagogical
            feedback.
          </p>
        </div>

        {/* Main Panel */}
        {sim.status === 'idle' || sim.status === 'loading' ? (
          <ConfigPanel
            ollamaStatus={sim.ollamaStatus}
            ollamaModels={sim.ollamaModels}
            onStart={handleStart}
            onRetryOllama={sim.refreshOllamaStatus}
          />
        ) : sim.status === 'running' && sim.progress ? (
          <ProgressPanel progress={sim.progress} startTime={runStartTime} onCancel={sim.cancel} />
        ) : sim.status === 'completed' && sim.report ? (
          <ResultsPanel report={sim.report} onReset={sim.reset} />
        ) : sim.status === 'failed' ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-medium text-red-500">Simulation Failed</h2>
            </div>
            <p className="text-xs font-mono text-red-500/70">{sim.error}</p>
            <button
              onClick={sim.reset}
              className="flex items-center gap-2 text-xs font-mono text-foreground/50 hover:text-foreground/80 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Try Again
            </button>
          </motion.div>
        ) : null}

        {/* Run History */}
        <RunHistory runs={sim.history} loading={sim.historyLoading} onSelect={sim.loadReport} />
      </div>
    </>
  );
}
