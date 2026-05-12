import type { CourseModule, Lesson, ContentBlock, KnowledgeFact } from '@course-engine/core';
import { llmCall, getContentBlocksByLesson, getLLMStats, resetLLMStats, createDbClient } from '@course-engine/core';

type DbClient = ReturnType<typeof createDbClient>;
import { type StudentPersona } from './personas.js';
import {
  BlockFeedbackSchema,
  LessonFeedbackSchema,
  CourseFeedbackSchema,
  type BlockFeedback,
  type LessonFeedback,
  type CourseFeedback,
} from './schemas.js';

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
  persona: {
    name: string;
    level: string;
    background: string;
  };
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

type LogFn = (stage: string, message: string) => void;

async function loadCourseStructure(db: DbClient): Promise<{
  modules: CourseModule[];
  lessonsByModule: Map<string, Lesson[]>;
}> {
  const { data: modules, error: modErr } = await db
    .from('course_modules')
    .select('*')
    .order('order_index', { ascending: true });

  if (modErr) throw new Error(`Failed to load modules: ${modErr.message}`);

  const { data: lessons, error: lesErr } = await db
    .from('lessons')
    .select('*')
    .order('order_index', { ascending: true });

  if (lesErr) throw new Error(`Failed to load lessons: ${lesErr.message}`);

  const lessonsByModule = new Map<string, Lesson[]>();
  for (const lesson of (lessons ?? []) as Lesson[]) {
    const existing = lessonsByModule.get(lesson.module_id) ?? [];
    existing.push(lesson);
    lessonsByModule.set(lesson.module_id, existing);
  }

  return { modules: (modules ?? []) as CourseModule[], lessonsByModule };
}

async function loadFactsForBlock(
  db: DbClient,
  block: ContentBlock,
): Promise<KnowledgeFact[]> {
  if (!block.depends_on_facts || block.depends_on_facts.length === 0) return [];

  const { data, error } = await db
    .from('knowledge_facts')
    .select('*')
    .in('id', block.depends_on_facts);

  if (error) return [];
  return (data ?? []) as KnowledgeFact[];
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

async function evaluateBlock(
  persona: StudentPersona,
  block: ContentBlock,
  facts: KnowledgeFact[],
  lessonTitle: string,
  blockIndex: number,
  totalBlocks: number,
): Promise<BlockFeedback> {
  const factContext = facts.length > 0
    ? `\n\nThis content block is based on these verified facts:\n${facts.map((f) => `- [${f.category}] ${f.statement} (confidence: ${f.confidence})`).join('\n')}`
    : '';

  const prompt = `You are reading block ${blockIndex + 1} of ${totalBlocks} in the lesson "${lessonTitle}".

Here is the content block:
---
${block.heading ? `## ${block.heading}\n\n` : ''}${block.markdown}
---
${factContext}

As ${persona.name} (${persona.level} level), evaluate this content block. Consider:
- Is it clear enough for someone with your background?
- Does it seem accurate?
- Is anything missing that you'd expect?
- Is it engaging or dry?
- What's the difficulty relative to your level?

Be specific and authentic. Reference actual sentences or concepts from the content in your feedback.`;

  const result = await llmCall(prompt, BlockFeedbackSchema, {
    model: 'fast',
    systemPrompt: persona.systemPrompt,
    temperature: 0.7,
  });

  return result.data;
}

async function evaluateLesson(
  persona: StudentPersona,
  lesson: Lesson,
  blockReports: BlockReport[],
): Promise<LessonFeedback> {
  const blockSummaries = blockReports.map((b) =>
    `- "${b.heading ?? 'Untitled'}" (clarity: ${b.feedback.clarity}/5, accuracy: ${b.feedback.accuracy}/5): ${b.feedback.reaction}`
  ).join('\n');

  const prompt = `You just finished reading the lesson "${lesson.title}": ${lesson.description}

Here's a summary of your reactions to each content block:
${blockSummaries}

Now reflect on the lesson as a whole. How well did the blocks flow together? What did you learn? What was missing?`;

  const result = await llmCall(prompt, LessonFeedbackSchema, {
    model: 'fast',
    systemPrompt: persona.systemPrompt,
    temperature: 0.7,
  });

  return result.data;
}

async function evaluateCourse(
  persona: StudentPersona,
  moduleReports: ModuleReport[],
): Promise<CourseFeedback> {
  const courseSummary = moduleReports.map((mod) => {
    const lessonSummaries = mod.lessons.map((l) =>
      `  - "${l.title}" (${l.feedback.overall_rating}/5): ${l.feedback.summary}`
    ).join('\n');
    return `Module: "${mod.title}"\n${lessonSummaries}`;
  }).join('\n\n');

  const prompt = `You've completed the entire course. Here's a summary of your experience:

${courseSummary}

Give your final assessment of the course as a whole. Consider the overall learning journey, what prepared you well, and what left gaps.`;

  const result = await llmCall(prompt, CourseFeedbackSchema, {
    model: 'smart',
    systemPrompt: persona.systemPrompt,
    temperature: 0.7,
  });

  return result.data;
}

export async function runSimulation(
  db: DbClient,
  persona: StudentPersona,
  log: LogFn,
  options?: { limitModules?: number; limitLessons?: number },
): Promise<SimulationReport> {
  const startTime = Date.now();
  resetLLMStats();

  log('sim', `Starting simulation as ${persona.name} (${persona.level})`);
  log('sim', `Background: ${persona.background}`);

  const { modules, lessonsByModule } = await loadCourseStructure(db);

  const activeModules = options?.limitModules
    ? modules.slice(0, options.limitModules)
    : modules;

  log('sim', `Course: ${activeModules.length} modules, ${Array.from(lessonsByModule.values()).flat().length} total lessons`);

  const moduleReports: ModuleReport[] = [];
  let totalBlocks = 0;
  let totalWords = 0;

  for (const mod of activeModules) {
    log('module', `=== Module: ${mod.title} ===`);

    let lessons = lessonsByModule.get(mod.id) ?? [];
    if (options?.limitLessons) {
      lessons = lessons.slice(0, options.limitLessons);
    }

    const lessonReports: LessonReport[] = [];

    for (const lesson of lessons) {
      log('lesson', `--- Lesson: ${lesson.title} ---`);

      const blocks = await getContentBlocksByLesson(db, lesson.id);

      if (blocks.length === 0) {
        log('lesson', `  No content blocks — skipping`);
        continue;
      }

      log('lesson', `  ${blocks.length} content blocks`);

      const blockReports: BlockReport[] = [];

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const words = wordCount(block.markdown);
        totalWords += words;
        totalBlocks += 1;

        log('block', `  [${i + 1}/${blocks.length}] "${block.heading ?? 'Untitled'}" (${words} words, status: ${block.status})`);

        const facts = await loadFactsForBlock(db, block);
        const feedback = await evaluateBlock(persona, block, facts, lesson.title, i, blocks.length);

        log('block', `    → clarity=${feedback.clarity} accuracy=${feedback.accuracy} engagement=${feedback.engagement}`);
        if (feedback.confusion_points.length > 0) {
          log('block', `    ⚠ Confused by: ${feedback.confusion_points[0]}`);
        }

        blockReports.push({
          block_id: block.id,
          heading: block.heading ?? null,
          order_index: block.order_index,
          status: block.status,
          word_count: words,
          feedback,
        });
      }

      const lessonFeedback = await evaluateLesson(persona, lesson, blockReports);
      log('lesson', `  Lesson rating: ${lessonFeedback.overall_rating}/5 — ${lessonFeedback.summary.slice(0, 100)}`);

      lessonReports.push({
        lesson_id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        block_count: blocks.length,
        blocks: blockReports,
        feedback: lessonFeedback,
      });
    }

    moduleReports.push({
      module_id: mod.id,
      title: mod.title,
      slug: mod.slug,
      lessons: lessonReports,
    });
  }

  log('course', 'Generating final course feedback...');
  const courseFeedback = await evaluateCourse(persona, moduleReports);
  log('course', `Course rating: ${courseFeedback.overall_rating}/5, NPS: ${courseFeedback.nps_score}/10`);

  const { totalCalls } = getLLMStats();

  return {
    timestamp: new Date().toISOString(),
    persona: {
      name: persona.name,
      level: persona.level,
      background: persona.background,
    },
    modules: moduleReports,
    course_feedback: courseFeedback,
    stats: {
      total_modules: moduleReports.length,
      total_lessons: moduleReports.reduce((sum, m) => sum + m.lessons.length, 0),
      total_blocks: totalBlocks,
      total_words: totalWords,
      llm_calls: totalCalls,
      duration_ms: Date.now() - startTime,
    },
  };
}
