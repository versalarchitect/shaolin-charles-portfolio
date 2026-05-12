import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Course Data (for simulation input)
// ---------------------------------------------------------------------------

export interface SimulationCourseData {
  modules: Array<{
    id: string;
    title: string;
    slug: string;
    order_index: number;
  }>;
  lessons: Array<{
    id: string;
    module_id: string;
    title: string;
    description: string;
    slug: string;
    order_index: number;
  }>;
  blocks: Array<{
    id: string;
    lesson_id: string;
    order_index: number;
    heading: string | null;
    markdown: string;
    depends_on_facts: string[];
    status: string;
  }>;
  facts: Array<{
    id: string;
    statement: string;
    category: string;
    confidence: number;
  }>;
}

export async function fetchSimulationCourseData(): Promise<SimulationCourseData> {
  const [
    { data: modules, error: modErr },
    { data: lessons, error: lesErr },
    { data: blocks, error: blkErr },
    { data: facts, error: factErr },
  ] = await Promise.all([
    supabase
      .from('course_modules')
      .select('id, title, slug, order_index')
      .order('order_index', { ascending: true }),
    supabase
      .from('lessons')
      .select('id, module_id, title, description, slug, order_index')
      .order('order_index', { ascending: true }),
    supabase
      .from('content_blocks')
      .select('id, lesson_id, order_index, heading, markdown, depends_on_facts, status')
      .order('order_index', { ascending: true }),
    supabase
      .from('knowledge_facts')
      .select('id, statement, category, confidence')
      .is('superseded_by', null),
  ]);

  if (modErr) throw new Error(`Failed to load modules: ${modErr.message}`);
  if (lesErr) throw new Error(`Failed to load lessons: ${lesErr.message}`);
  if (blkErr) throw new Error(`Failed to load content blocks: ${blkErr.message}`);
  if (factErr) throw new Error(`Failed to load knowledge facts: ${factErr.message}`);

  return {
    modules: (modules ?? []) as SimulationCourseData['modules'],
    lessons: (lessons ?? []) as SimulationCourseData['lessons'],
    blocks: (blocks ?? []) as SimulationCourseData['blocks'],
    facts: (facts ?? []) as SimulationCourseData['facts'],
  };
}

// ---------------------------------------------------------------------------
// Simulation Runs (CRUD)
// ---------------------------------------------------------------------------

export interface SimulationRunRow {
  id: string;
  user_email: string;
  persona_level: string;
  persona_name: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  config: Record<string, unknown>;
  report: unknown | null;
  stats: Record<string, unknown> | null;
  error: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export async function createSimulationRun(
  email: string,
  personaLevel: string,
  personaName: string,
  config: Record<string, unknown>,
): Promise<string> {
  const { data, error } = await supabase
    .from('simulation_runs')
    .insert({
      user_email: email,
      persona_level: personaLevel,
      persona_name: personaName,
      config,
      status: 'running',
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create simulation run: ${error.message}`);
  return (data as { id: string }).id;
}

export async function updateSimulationRun(
  id: string,
  updates: Partial<Pick<SimulationRunRow, 'status' | 'stats' | 'error'>>,
): Promise<void> {
  const { error } = await supabase.from('simulation_runs').update(updates).eq('id', id);

  if (error) throw new Error(`Failed to update simulation run: ${error.message}`);
}

export async function completeSimulationRun(
  id: string,
  report: unknown,
  stats: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase
    .from('simulation_runs')
    .update({
      status: 'completed',
      report,
      stats,
      completed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to complete simulation run: ${error.message}`);
}

export async function cancelSimulationRun(id: string): Promise<void> {
  const { error } = await supabase
    .from('simulation_runs')
    .update({
      status: 'cancelled',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to cancel simulation run: ${error.message}`);
}

export async function fetchSimulationHistory(limit = 20): Promise<SimulationRunRow[]> {
  const { data, error } = await supabase
    .from('simulation_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch simulation history: ${error.message}`);
  return (data ?? []) as SimulationRunRow[];
}

export async function fetchSimulationReport(id: string): Promise<unknown | null> {
  const { data, error } = await supabase
    .from('simulation_runs')
    .select('report')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch simulation report: ${error.message}`);
  return (data as { report: unknown })?.report ?? null;
}

// ---------------------------------------------------------------------------
// Ollama Health Check
// ---------------------------------------------------------------------------

export type OllamaStatus = 'checking' | 'available' | 'unavailable';

export interface OllamaHealthResult {
  status: OllamaStatus;
  models: string[];
  error?: string;
}

export async function checkOllamaHealth(): Promise<OllamaHealthResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('/api/ollama/api/tags', {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { status: 'unavailable', models: [], error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const models = (data.models ?? []).map((m: { name: string }) => m.name);

    return { status: 'available', models };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('502')) {
      return { status: 'unavailable', models: [], error: 'Ollama is not running. Start it with: ollama serve' };
    }

    return { status: 'unavailable', models: [], error: message };
  }
}
