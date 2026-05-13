export type DiffLineType = 'same' | 'added' | 'removed'

export interface DiffLine {
  type: DiffLineType
  content: string
  oldLineNo?: number
  newLineNo?: number
}

export function computeLineDiff(before: string, after: string): DiffLine[] {
  const oldLines = before.split('\n')
  const newLines = after.split('\n')
  const m = oldLines.length
  const n = newLines.length

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const result: DiffLine[] = []
  let i = m
  let j = n

  const stack: DiffLine[] = []
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: 'same', content: oldLines[i - 1], oldLineNo: i, newLineNo: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'added', content: newLines[j - 1], newLineNo: j })
      j--
    } else {
      stack.push({ type: 'removed', content: oldLines[i - 1], oldLineNo: i })
      i--
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop()!)
  }

  return result
}
