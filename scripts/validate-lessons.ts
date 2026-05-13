/**
 * Lesson content validation script.
 * Validates all lesson steps at build time for correctness.
 *
 * Usage: bun run scripts/validate-lessons.ts
 */

import type { LessonContent, LessonStep } from '../src/data/lessons/types'

// ANSI color helpers
const red = (s: string) => `\x1b[31m${s}\x1b[0m`
const green = (s: string) => `\x1b[32m${s}\x1b[0m`
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`

interface Issue {
  level: 'error' | 'warning'
  lessonId: string
  stepIndex: number
  stepType: string
  message: string
}

function validateStep(lessonId: string, index: number, step: LessonStep): Issue[] {
  const issues: Issue[] = []
  const make = (level: 'error' | 'warning', message: string): Issue => ({
    level,
    lessonId,
    stepIndex: index,
    stepType: step.type,
    message,
  })

  switch (step.type) {
    case 'multiple-choice': {
      const { correctIndex, options } = step
      if (correctIndex < 0 || correctIndex >= options.length) {
        issues.push(
          make('error', `correctIndex ${correctIndex} out of bounds (${options.length} options)`)
        )
      }
      break
    }
    case 'order': {
      const { correctOrder, items } = step
      const expected = Array.from({ length: items.length }, (_, i) => i).sort()
      const sorted = [...correctOrder].sort((a, b) => a - b)
      if (
        correctOrder.length !== items.length ||
        sorted.some((v, i) => v !== expected[i])
      ) {
        issues.push(
          make(
            'error',
            `correctOrder [${correctOrder.join(',')}] is not a valid permutation of [0..${items.length - 1}]`
          )
        )
      }
      break
    }
    case 'code-input': {
      if (!step.answer.trim()) {
        issues.push(make('warning', 'answer is empty'))
      }
      break
    }
    case 'diagram': {
      const nodeIds = new Set(step.diagram.nodes.map((n) => n.id))
      for (const edge of step.diagram.edges) {
        if (!nodeIds.has(edge.from)) {
          issues.push(make('error', `edge.from "${edge.from}" references unknown node`))
        }
        if (!nodeIds.has(edge.to)) {
          issues.push(make('error', `edge.to "${edge.to}" references unknown node`))
        }
      }
      break
    }
    case 'terminal': {
      if (!step.expectedCommand.trim()) {
        issues.push(make('warning', 'expectedCommand is empty'))
      }
      break
    }
    case 'checkpoint': {
      if (step.xp <= 0) {
        issues.push(make('error', `xp must be > 0, got ${step.xp}`))
      }
      break
    }
    case 'code-fill': {
      const blankIds = new Set(step.blanks.map((b) => b.id))
      const templateBlanks = [...step.template.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1])
      for (const id of templateBlanks) {
        if (!blankIds.has(id)) {
          issues.push(make('error', `template references blank "{{${id}}}" but no blank with that id exists`))
        }
      }
      for (const blank of step.blanks) {
        if (!templateBlanks.includes(blank.id)) {
          issues.push(make('warning', `blank "${blank.id}" is defined but not referenced in template`))
        }
        if (!blank.answer.trim()) {
          issues.push(make('error', `blank "${blank.id}" has empty answer`))
        }
      }
      break
    }
    case 'compare': {
      if (step.question && !step.correctSide) {
        issues.push(make('error', 'compare has question but no correctSide'))
      }
      if (step.correctSide && !step.question) {
        issues.push(make('warning', 'compare has correctSide but no question'))
      }
      break
    }
    case 'match': {
      const pairCount = Object.keys(step.correctPairs).length
      if (pairCount === 0) {
        issues.push(make('error', 'match has no correctPairs'))
      }
      for (const [left, right] of Object.entries(step.correctPairs)) {
        const li = Number(left)
        const ri = right as number
        if (li < 0 || li >= step.leftItems.length) {
          issues.push(make('error', `match correctPairs key ${li} out of bounds for ${step.leftItems.length} leftItems`))
        }
        if (ri < 0 || ri >= step.rightItems.length) {
          issues.push(make('error', `match correctPairs value ${ri} out of bounds for ${step.rightItems.length} rightItems`))
        }
      }
      break
    }
    case 'code-diff': {
      if (!step.before.trim()) issues.push(make('warning', 'code-diff before is empty'))
      if (!step.after.trim()) issues.push(make('warning', 'code-diff after is empty'))
      break
    }
    case 'interactive-diagram': {
      const nodeIds = new Set(step.diagram.nodes.map((n) => n.id))
      if (step.stages.length === 0) {
        issues.push(make('error', 'interactive-diagram has no stages'))
      }
      for (let si = 0; si < step.stages.length; si++) {
        const stage = step.stages[si]
        for (const nid of stage.highlightNodes) {
          if (!nodeIds.has(nid)) {
            issues.push(make('error', `interactive-diagram stage ${si} references unknown node "${nid}"`))
          }
        }
      }
      break
    }
    case 'prompt-lab': {
      if (step.responses.length === 0) {
        issues.push(make('error', 'prompt-lab has no responses'))
      }
      for (const r of step.responses) {
        if (r.triggerKeywords.length === 0) {
          issues.push(make('warning', 'prompt-lab response has no triggerKeywords'))
        }
      }
      break
    }
  }

  return issues
}

async function main() {
  const indexModule = await import('../src/data/lessons/index')
  const { loadLessonContent, hasLessonContent } = indexModule

  // Read the index.ts source to extract all registered lesson IDs dynamically
  const indexSource = await Bun.file('./src/data/lessons/index.ts').text()
  const knownIds = [...indexSource.matchAll(/(?:'([^']+)'|(\w+)):\s*\(\)\s*=>/g)].map(m => m[1] || m[2])

  const allIssues: Issue[] = []
  let passed = 0
  let errorCount = 0
  let warningCount = 0

  console.log(bold(`\nValidating ${knownIds.length} lessons...\n`))

  for (const id of knownIds) {
    // Check that the lesson ID resolves
    if (!hasLessonContent(id)) {
      console.log(`${red('✗')} ${id} ${red('broken import (not found in modules map)')}`)
      errorCount++
      allIssues.push({
        level: 'error',
        lessonId: id,
        stepIndex: -1,
        stepType: '',
        message: 'lesson ID does not resolve in modules map',
      })
      continue
    }

    let content: LessonContent | null
    try {
      content = await loadLessonContent(id)
    } catch (e) {
      console.log(`${red('✗')} ${id} ${red(`import failed: ${(e as Error).message}`)}`)
      errorCount++
      allIssues.push({
        level: 'error',
        lessonId: id,
        stepIndex: -1,
        stepType: '',
        message: `import failed: ${(e as Error).message}`,
      })
      continue
    }

    if (!content) {
      console.log(`${red('✗')} ${id} ${red('loaded but returned null')}`)
      errorCount++
      allIssues.push({
        level: 'error',
        lessonId: id,
        stepIndex: -1,
        stepType: '',
        message: 'loaded but returned null',
      })
      continue
    }

    const lessonIssues: Issue[] = []
    for (let i = 0; i < content.steps.length; i++) {
      const stepIssues = validateStep(id, i + 1, content.steps[i])
      lessonIssues.push(...stepIssues)
    }

    if (lessonIssues.length === 0) {
      console.log(`${green('✓')} ${id} ${dim(`(${content.steps.length} steps)`)}`)
      passed++
    } else {
      for (const issue of lessonIssues) {
        const prefix = issue.level === 'error' ? red('✗') : yellow('⚠')
        const label = issue.level === 'error' ? '' : ''
        console.log(
          `${prefix} ${issue.lessonId} step ${issue.stepIndex} (${issue.stepType}): ${issue.message}`
        )
        if (issue.level === 'error') errorCount++
        else warningCount++
      }
      // Count as passed if only warnings
      if (lessonIssues.every((i) => i.level === 'warning')) passed++
      allIssues.push(...lessonIssues)
    }
  }

  // Summary
  console.log('')
  const parts: string[] = []
  parts.push(`${passed} passed`)
  if (errorCount > 0) parts.push(red(`${errorCount} error${errorCount > 1 ? 's' : ''}`))
  if (warningCount > 0) parts.push(yellow(`${warningCount} warning${warningCount > 1 ? 's' : ''}`))
  console.log(bold(`Results: ${parts.join(', ')}`))
  console.log('')

  process.exit(errorCount > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(red(`Fatal: ${e.message}`))
  process.exit(1)
})
