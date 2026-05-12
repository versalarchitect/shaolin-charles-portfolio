import type { SimulationReport, BlockReport, LessonReport, ModuleReport } from './simulator.js';

function stars(n: number, max = 5): string {
  return '★'.repeat(Math.round(n)) + '☆'.repeat(max - Math.round(n));
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${seconds}s`;
}

function blockSection(block: BlockReport): string {
  const f = block.feedback;
  const lines = [
    `#### ${block.heading ?? 'Untitled Block'} (${block.word_count} words)`,
    '',
    `| Metric | Score |`,
    `|--------|-------|`,
    `| Clarity | ${stars(f.clarity)} ${f.clarity}/5 |`,
    `| Accuracy | ${stars(f.accuracy)} ${f.accuracy}/5 |`,
    `| Completeness | ${stars(f.completeness)} ${f.completeness}/5 |`,
    `| Engagement | ${stars(f.engagement)} ${f.engagement}/5 |`,
    `| Difficulty | ${stars(f.difficulty)} ${f.difficulty}/5 |`,
    '',
    `> ${f.reaction}`,
    '',
  ];

  if (f.confusion_points.length > 0) {
    lines.push('**Confusion points:**');
    for (const point of f.confusion_points) lines.push(`- ${point}`);
    lines.push('');
  }

  if (f.questions.length > 0) {
    lines.push('**Questions:**');
    for (const q of f.questions) lines.push(`- ${q}`);
    lines.push('');
  }

  if (f.suggestions.length > 0) {
    lines.push('**Suggestions:**');
    for (const s of f.suggestions) lines.push(`- ${s}`);
    lines.push('');
  }

  return lines.join('\n');
}

function lessonSection(lesson: LessonReport): string {
  const f = lesson.feedback;
  const lines = [
    `### ${lesson.title}`,
    '',
    `**Overall:** ${stars(f.overall_rating)} ${f.overall_rating}/5 | **Flow:** ${stars(f.flow_rating)} ${f.flow_rating}/5 | **Recommend:** ${f.would_recommend ? 'Yes' : 'No'}`,
    '',
    `> ${f.summary}`,
    '',
    `**Key takeaways:** ${f.key_takeaways.join('; ')}`,
    '',
    `**Strongest block:** ${f.strongest_block}`,
    `**Weakest block:** ${f.weakest_block}`,
    '',
  ];

  if (f.gaps.length > 0) {
    lines.push('**Gaps:**');
    for (const gap of f.gaps) lines.push(`- ${gap}`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  for (const block of lesson.blocks) {
    lines.push(blockSection(block));
  }

  return lines.join('\n');
}

function moduleSection(mod: ModuleReport): string {
  const avgRating = mod.lessons.length > 0
    ? mod.lessons.reduce((sum, l) => sum + l.feedback.overall_rating, 0) / mod.lessons.length
    : 0;

  const lines = [
    `## Module: ${mod.title}`,
    '',
    `**Lessons:** ${mod.lessons.length} | **Average rating:** ${stars(avgRating)} ${avgRating.toFixed(1)}/5`,
    '',
  ];

  for (const lesson of mod.lessons) {
    lines.push(lessonSection(lesson));
  }

  return lines.join('\n');
}

export function generateMarkdownReport(report: SimulationReport): string {
  const cf = report.course_feedback;

  const lines = [
    `# Student Simulation Report`,
    '',
    `**Date:** ${new Date(report.timestamp).toLocaleDateString('en-US', { dateStyle: 'full' })}`,
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
  ];

  if (cf.recommended_order_changes.length > 0) {
    lines.push('### Recommended Reordering');
    lines.push('');
    for (const change of cf.recommended_order_changes) lines.push(`- ${change}`);
    lines.push('');
  }

  lines.push(`### Final Thoughts`);
  lines.push('');
  lines.push(`> ${cf.final_thoughts}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const mod of report.modules) {
    lines.push(moduleSection(mod));
  }

  return lines.join('\n');
}
