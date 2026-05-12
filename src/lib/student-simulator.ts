import type { SimulationCourseData } from './simulation-api';

export type PersonaLevel = 'beginner' | 'intermediate' | 'advanced';

export interface StudentPersona {
  name: string;
  level: PersonaLevel;
  background: string;
  goals: string;
  systemPrompt: string;
}

const PERSONAS: Record<PersonaLevel, StudentPersona> = {
  beginner: {
    name: 'Alex',
    level: 'beginner',
    background:
      'A college student studying computer science who has written Python scripts but has never used an LLM API or built AI-powered applications.',
    goals:
      'Wants to understand what Claude is, how to call it from code, and build a first chatbot project.',
    systemPrompt:
      'You are Alex, a beginner CS student reading an online course about Claude and AI development. You have basic Python knowledge but no experience with LLMs or APIs. You are curious but easily confused by jargon. You appreciate clear explanations with examples. When something is unclear, you get frustrated. When something clicks, you get excited. React authentically as this student would.',
  },
  intermediate: {
    name: 'Jordan',
    level: 'intermediate',
    background:
      'A software engineer with 3 years of experience building web apps. Has used the OpenAI API before and understands REST APIs, JSON, and async programming. New to Anthropic/Claude specifically.',
    goals:
      'Wants to learn Claude-specific features like tool use, caching, and structured outputs. Interested in migration from OpenAI.',
    systemPrompt:
      "You are Jordan, a mid-level software engineer reading an online course about Claude and AI development. You already know how LLM APIs work in general (you've used OpenAI) and you're comparing Claude's approach. You want practical, actionable information — not basics you already know. You notice when content is too shallow or when it's missing important details. You appreciate code examples and dislike hand-wavy explanations.",
  },
  advanced: {
    name: 'Morgan',
    level: 'advanced',
    background:
      'A senior AI engineer who has deployed LLM applications at scale. Deep experience with prompt engineering, RAG, fine-tuning, and multiple providers. Has read the Anthropic research papers.',
    goals:
      'Looking for nuanced details: edge cases, performance characteristics, architectural patterns, cost optimization, and things not obvious from the docs.',
    systemPrompt:
      "You are Morgan, a senior AI engineer reading an online course about Claude and AI development. You have deep expertise and are looking for insights beyond what the official docs say. You notice factual errors immediately. You value precision, nuance, and real-world production considerations. You are critical of oversimplifications and appreciate content that respects the reader's intelligence. You look for what's missing as much as what's present.",
  },
};

export function getPersona(level: PersonaLevel): StudentPersona {
  return PERSONAS[level];
}

export function listPersonas(): PersonaLevel[] {
  return Object.keys(PERSONAS) as PersonaLevel[];
}

export interface BlockFeedback {
  clarity: number;
  accuracy: number;
  completeness: number;
  engagement: number;
  difficulty: number;
  confusion_points: string[];
  questions: string[];
  suggestions: string[];
  reaction: string;
}

export interface LessonFeedback {
  overall_rating: number;
  flow_rating: number;
  key_takeaways: string[];
  gaps: string[];
  strongest_block: string;
  weakest_block: string;
  would_recommend: boolean;
  summary: string;
}

export interface CourseFeedback {
  overall_rating: number;
  readiness_rating: number;
  top_strengths: string[];
  top_weaknesses: string[];
  missing_topics: string[];
  recommended_order_changes: string[];
  nps_score: number;
  final_thoughts: string;
}

export interface BlockReport {
  block_id: string;
  heading: string | null;
  order_index: number;
  status: string;
  word_count: number;
  feedback: BlockFeedback;
}

export interface LessonReport {
  lesson_id: string;
  title: string;
  slug: string;
  block_count: number;
  blocks: BlockReport[];
  feedback: LessonFeedback;
}

export interface ModuleReport {
  module_id: string;
  title: string;
  slug: string;
  lessons: LessonReport[];
}

export interface SimulationReport {
  timestamp: string;
  persona: { name: string; level: string; background: string };
  modules: ModuleReport[];
  course_feedback: CourseFeedback;
  stats: {
    total_modules: number;
    total_lessons: number;
    total_blocks: number;
    total_words: number;
    llm_calls: number;
    duration_ms: number;
  };
}

export type SimulationStatus = 'idle' | 'loading' | 'running' | 'completed' | 'failed';

export interface SimulationProgress {
  status: SimulationStatus;
  currentModule?: string;
  currentLesson?: string;
  currentBlock?: string;
  modulesCompleted: number;
  modulesTotal: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  blocksCompleted: number;
  blocksTotal: number;
  llmCalls: number;
  logs: SimulationLog[];
  error?: string;
}

export interface SimulationLog {
  timestamp: string;
  stage: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Ollama LLM Layer
// ---------------------------------------------------------------------------

const OLLAMA_BASE = '/api/ollama/v1';

async function ollamaChat(
  systemPrompt: string,
  userPrompt: string,
  model = 'qwen2.5:7b',
): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  const jsonStr = fenced ? fenced[1].trim() : text.trim();
  return JSON.parse(jsonStr);
}

async function ollamaStructured<T>(
  systemPrompt: string,
  userPrompt: string,
  schemaHint: string,
  model?: string,
): Promise<T> {
  const fullSystem = `${systemPrompt}\n\nYou MUST respond with valid JSON only. No markdown fences, no explanation, no text before or after the JSON.\n\n${schemaHint}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const raw = await ollamaChat(fullSystem, userPrompt, model);
      return extractJson(raw) as T;
    } catch {
      if (attempt === 2) throw new Error('Failed to get valid JSON from LLM after 3 attempts');
    }
  }

  throw new Error('Unreachable');
}

const BLOCK_FEEDBACK_SCHEMA = `Return a JSON object with these fields:
- clarity: number 1-5 (how clear and understandable)
- accuracy: number 1-5 (factual correctness)
- completeness: number 1-5 (are there gaps)
- engagement: number 1-5 (how interesting)
- difficulty: number 1-5 (difficulty for this student)
- confusion_points: string[] (specific confusing parts)
- questions: string[] (questions after reading)
- suggestions: string[] (concrete improvement suggestions)
- reaction: string (1-2 sentence authentic reaction)`;

const LESSON_FEEDBACK_SCHEMA = `Return a JSON object with these fields:
- overall_rating: number 1-5
- flow_rating: number 1-5 (how well blocks flow together)
- key_takeaways: string[] (what was learned)
- gaps: string[] (missing topics)
- strongest_block: string (best block and why)
- weakest_block: string (weakest block and why)
- would_recommend: boolean
- summary: string (2-3 sentence summary)`;

const COURSE_FEEDBACK_SCHEMA = `Return a JSON object with these fields:
- overall_rating: number 1-5
- readiness_rating: number 1-5 (how prepared to use Claude)
- top_strengths: string[] (top 3 strengths)
- top_weaknesses: string[] (top 3 weaknesses)
- missing_topics: string[] (important uncovered topics)
- recommended_order_changes: string[] (reordering suggestions)
- nps_score: number 0-10 (Net Promoter Score)
- final_thoughts: string (paragraph of final thoughts)`;

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function groupBy<T>(items: T[], key: keyof T): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = String(item[key]);
    const existing = map.get(k) ?? [];
    existing.push(item);
    map.set(k, existing);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Simulation Engine
// ---------------------------------------------------------------------------

export async function runSimulation(
  courseData: SimulationCourseData,
  persona: StudentPersona,
  onProgress: (progress: SimulationProgress) => void,
  options?: { limitModules?: number; limitLessons?: number; model?: string },
  signal?: AbortSignal,
): Promise<SimulationReport> {
  const startTime = Date.now();
  let llmCalls = 0;
  const logs: SimulationLog[] = [];

  function log(stage: string, message: string) {
    logs.push({ timestamp: new Date().toISOString().slice(11, 19), stage, message });
  }

  function emitProgress(partial: Partial<SimulationProgress>) {
    onProgress({
      status: 'running',
      modulesCompleted: 0,
      modulesTotal: 0,
      lessonsCompleted: 0,
      lessonsTotal: 0,
      blocksCompleted: 0,
      blocksTotal: 0,
      llmCalls,
      logs: [...logs],
      ...partial,
    });
  }

  log('sim', `Starting simulation as ${persona.name} (${persona.level})`);
  emitProgress({ status: 'loading' });

  const lessonsByModule = groupBy(courseData.lessons, 'module_id');
  const blocksByLesson = groupBy(courseData.blocks, 'lesson_id');
  const factsById = new Map(courseData.facts.map((f) => [f.id, f]));

  const activeModules = options?.limitModules
    ? courseData.modules.slice(0, options.limitModules)
    : courseData.modules;

  let totalLessonsCount = 0;
  let totalBlocksCount = 0;
  for (const mod of activeModules) {
    let lessons = lessonsByModule.get(mod.id) ?? [];
    if (options?.limitLessons) lessons = lessons.slice(0, options.limitLessons);
    totalLessonsCount += lessons.length;
    for (const lesson of lessons) {
      totalBlocksCount += (blocksByLesson.get(lesson.id) ?? []).length;
    }
  }

  log(
    'sim',
    `Course: ${activeModules.length} modules, ${totalLessonsCount} lessons, ${totalBlocksCount} blocks`,
  );
  emitProgress({
    status: 'running',
    modulesTotal: activeModules.length,
    lessonsTotal: totalLessonsCount,
    blocksTotal: totalBlocksCount,
  });

  const moduleReports: ModuleReport[] = [];
  let modulesCompleted = 0;
  let lessonsCompleted = 0;
  let blocksCompleted = 0;
  let totalWords = 0;

  for (const mod of activeModules) {
    if (signal?.aborted) throw new Error('Simulation cancelled');

    log('module', `=== Module: ${mod.title} ===`);
    emitProgress({
      currentModule: mod.title,
      modulesCompleted,
      modulesTotal: activeModules.length,
      lessonsCompleted,
      lessonsTotal: totalLessonsCount,
      blocksCompleted,
      blocksTotal: totalBlocksCount,
    });

    let lessons = lessonsByModule.get(mod.id) ?? [];
    if (options?.limitLessons) lessons = lessons.slice(0, options.limitLessons);

    const lessonReports: LessonReport[] = [];

    for (const lesson of lessons) {
      if (signal?.aborted) throw new Error('Simulation cancelled');

      log('lesson', `--- ${lesson.title} ---`);
      emitProgress({
        currentModule: mod.title,
        currentLesson: lesson.title,
        modulesCompleted,
        modulesTotal: activeModules.length,
        lessonsCompleted,
        lessonsTotal: totalLessonsCount,
        blocksCompleted,
        blocksTotal: totalBlocksCount,
      });

      const blocks = blocksByLesson.get(lesson.id) ?? [];
      if (blocks.length === 0) {
        log('lesson', '  No content blocks — skipping');
        lessonsCompleted++;
        continue;
      }

      const blockReports: BlockReport[] = [];

      for (let i = 0; i < blocks.length; i++) {
        if (signal?.aborted) throw new Error('Simulation cancelled');

        const block = blocks[i];
        const words = wordCount(block.markdown);
        totalWords += words;

        log(
          'block',
          `  [${i + 1}/${blocks.length}] "${block.heading ?? 'Untitled'}" (${words} words)`,
        );
        emitProgress({
          currentModule: mod.title,
          currentLesson: lesson.title,
          currentBlock: block.heading ?? `Block ${i + 1}`,
          modulesCompleted,
          modulesTotal: activeModules.length,
          lessonsCompleted,
          lessonsTotal: totalLessonsCount,
          blocksCompleted,
          blocksTotal: totalBlocksCount,
        });

        let factContext = '';
        if (block.depends_on_facts?.length > 0) {
          const blockFacts = block.depends_on_facts.map((id) => factsById.get(id)).filter(Boolean);
          if (blockFacts.length > 0) {
            factContext = `\n\nThis content block is based on these verified facts:\n${blockFacts.map((f) => `- [${f!.category}] ${f!.statement} (confidence: ${f!.confidence})`).join('\n')}`;
          }
        }

        const blockPrompt = `You are reading block ${i + 1} of ${blocks.length} in the lesson "${lesson.title}".

Here is the content block:
---
${block.heading ? `## ${block.heading}\n\n` : ''}${block.markdown}
---
${factContext}

As ${persona.name} (${persona.level} level), evaluate this content block. Be specific and reference actual sentences or concepts from the content.`;

        const feedback = await ollamaStructured<BlockFeedback>(
          persona.systemPrompt,
          blockPrompt,
          BLOCK_FEEDBACK_SCHEMA,
          options?.model,
        );
        llmCalls++;

        log(
          'block',
          `    clarity=${feedback.clarity} accuracy=${feedback.accuracy} engagement=${feedback.engagement}`,
        );

        blockReports.push({
          block_id: block.id,
          heading: block.heading,
          order_index: block.order_index,
          status: block.status,
          word_count: words,
          feedback,
        });

        blocksCompleted++;
        emitProgress({
          currentModule: mod.title,
          currentLesson: lesson.title,
          modulesCompleted,
          modulesTotal: activeModules.length,
          lessonsCompleted,
          lessonsTotal: totalLessonsCount,
          blocksCompleted,
          blocksTotal: totalBlocksCount,
        });
      }

      const blockSummaries = blockReports
        .map(
          (b) =>
            `- "${b.heading ?? 'Untitled'}" (clarity: ${b.feedback.clarity}/5, accuracy: ${b.feedback.accuracy}/5): ${b.feedback.reaction}`,
        )
        .join('\n');

      const lessonPrompt = `You just finished reading the lesson "${lesson.title}": ${lesson.description}

Here's a summary of your reactions to each content block:
${blockSummaries}

Now reflect on the lesson as a whole.`;

      const lessonFeedback = await ollamaStructured<LessonFeedback>(
        persona.systemPrompt,
        lessonPrompt,
        LESSON_FEEDBACK_SCHEMA,
        options?.model,
      );
      llmCalls++;

      log(
        'lesson',
        `  Rating: ${lessonFeedback.overall_rating}/5 — ${lessonFeedback.summary.slice(0, 80)}`,
      );

      lessonReports.push({
        lesson_id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        block_count: blocks.length,
        blocks: blockReports,
        feedback: lessonFeedback,
      });

      lessonsCompleted++;
    }

    moduleReports.push({
      module_id: mod.id,
      title: mod.title,
      slug: mod.slug,
      lessons: lessonReports,
    });

    modulesCompleted++;
  }

  log('course', 'Generating final course feedback...');
  emitProgress({
    currentModule: 'Final Review',
    currentLesson: 'Course Assessment',
    modulesCompleted,
    modulesTotal: activeModules.length,
    lessonsCompleted,
    lessonsTotal: totalLessonsCount,
    blocksCompleted,
    blocksTotal: totalBlocksCount,
  });

  const courseSummary = moduleReports
    .map((mod) => {
      const lessonSummaries = mod.lessons
        .map((l) => `  - "${l.title}" (${l.feedback.overall_rating}/5): ${l.feedback.summary}`)
        .join('\n');
      return `Module: "${mod.title}"\n${lessonSummaries}`;
    })
    .join('\n\n');

  const coursePrompt = `You've completed the entire course. Here's a summary of your experience:\n\n${courseSummary}\n\nGive your final assessment of the course as a whole.`;

  const courseFeedback = await ollamaStructured<CourseFeedback>(
    persona.systemPrompt,
    coursePrompt,
    COURSE_FEEDBACK_SCHEMA,
    options?.model,
  );
  llmCalls++;

  log(
    'course',
    `Course rating: ${courseFeedback.overall_rating}/5, NPS: ${courseFeedback.nps_score}/10`,
  );

  const report: SimulationReport = {
    timestamp: new Date().toISOString(),
    persona: { name: persona.name, level: persona.level, background: persona.background },
    modules: moduleReports,
    course_feedback: courseFeedback,
    stats: {
      total_modules: moduleReports.length,
      total_lessons: moduleReports.reduce((sum, m) => sum + m.lessons.length, 0),
      total_blocks: blocksCompleted,
      total_words: totalWords,
      llm_calls: llmCalls,
      duration_ms: Date.now() - startTime,
    },
  };

  emitProgress({
    status: 'completed',
    modulesCompleted,
    modulesTotal: activeModules.length,
    lessonsCompleted,
    lessonsTotal: totalLessonsCount,
    blocksCompleted,
    blocksTotal: totalBlocksCount,
  });

  return report;
}

// ---------------------------------------------------------------------------
// Markdown Report Generator (ported from course-engine/packages/simulator)
// ---------------------------------------------------------------------------

function stars(n: number, max = 5): string {
  const filled = Math.max(0, Math.min(max, Math.round(n)));
  return '★'.repeat(filled) + '☆'.repeat(max - filled);
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${seconds}s`;
}

export function generateMarkdownReport(report: SimulationReport): string {
  const cf = report.course_feedback;
  const lines: string[] = [
    `# Student Simulation Report`,
    '',
    `**Date:** ${new Date(report.timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    `**Student:** ${report.persona.name} (${report.persona.level})`,
    `**Background:** ${report.persona.background}`,
    '',
    `## Executive Summary`,
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Overall Rating | ${stars(cf.overall_rating)} ${cf.overall_rating}/5 |`,
    `| Readiness | ${stars(cf.readiness_rating)} ${cf.readiness_rating}/5 |`,
    `| NPS Score | ${cf.nps_score}/10 |`,
    `| Modules | ${report.stats.total_modules} |`,
    `| Lessons | ${report.stats.total_lessons} |`,
    `| Content Blocks | ${report.stats.total_blocks} |`,
    `| Total Words | ${report.stats.total_words.toLocaleString()} |`,
    `| Duration | ${formatDuration(report.stats.duration_ms)} |`,
    `| LLM Calls | ${report.stats.llm_calls} |`,
    '',
    `### Top Strengths`,
    '',
    ...cf.top_strengths.map((s) => `1. ${s}`),
    '',
    `### Top Weaknesses`,
    '',
    ...cf.top_weaknesses.map((w) => `1. ${w}`),
    '',
    `### Missing Topics`,
    '',
    ...cf.missing_topics.map((t) => `- ${t}`),
    '',
    `### Final Thoughts`,
    '',
    `> ${cf.final_thoughts}`,
    '',
    '---',
    '',
  ];

  for (const mod of report.modules) {
    const avgRating =
      mod.lessons.length > 0
        ? mod.lessons.reduce((sum, l) => sum + l.feedback.overall_rating, 0) / mod.lessons.length
        : 0;

    lines.push(`## Module: ${mod.title}`);
    lines.push('');
    lines.push(
      `**Lessons:** ${mod.lessons.length} | **Average rating:** ${stars(avgRating)} ${avgRating.toFixed(1)}/5`,
    );
    lines.push('');

    for (const lesson of mod.lessons) {
      const lf = lesson.feedback;
      lines.push(`### ${lesson.title}`);
      lines.push('');
      lines.push(
        `**Overall:** ${stars(lf.overall_rating)} ${lf.overall_rating}/5 | **Flow:** ${stars(lf.flow_rating)} ${lf.flow_rating}/5 | **Recommend:** ${lf.would_recommend ? 'Yes' : 'No'}`,
      );
      lines.push('');
      lines.push(`> ${lf.summary}`);
      lines.push('');
      lines.push(`**Key takeaways:** ${lf.key_takeaways.join('; ')}`);
      lines.push('');

      if (lf.gaps.length > 0) {
        lines.push('**Gaps:**');
        for (const gap of lf.gaps) lines.push(`- ${gap}`);
        lines.push('');
      }

      lines.push('---');
      lines.push('');

      for (const block of lesson.blocks) {
        const bf = block.feedback;
        lines.push(`#### ${block.heading ?? 'Untitled Block'} (${block.word_count} words)`);
        lines.push('');
        lines.push(`| Metric | Score |`);
        lines.push(`|--------|-------|`);
        lines.push(`| Clarity | ${stars(bf.clarity)} ${bf.clarity}/5 |`);
        lines.push(`| Accuracy | ${stars(bf.accuracy)} ${bf.accuracy}/5 |`);
        lines.push(`| Completeness | ${stars(bf.completeness)} ${bf.completeness}/5 |`);
        lines.push(`| Engagement | ${stars(bf.engagement)} ${bf.engagement}/5 |`);
        lines.push(`| Difficulty | ${stars(bf.difficulty)} ${bf.difficulty}/5 |`);
        lines.push('');
        lines.push(`> ${bf.reaction}`);
        lines.push('');

        if (bf.confusion_points.length > 0) {
          lines.push('**Confusion points:**');
          for (const p of bf.confusion_points) lines.push(`- ${p}`);
          lines.push('');
        }
        if (bf.questions.length > 0) {
          lines.push('**Questions:**');
          for (const q of bf.questions) lines.push(`- ${q}`);
          lines.push('');
        }
        if (bf.suggestions.length > 0) {
          lines.push('**Suggestions:**');
          for (const s of bf.suggestions) lines.push(`- ${s}`);
          lines.push('');
        }
      }
    }
  }

  return lines.join('\n');
}
