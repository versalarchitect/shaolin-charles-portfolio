import type { ReactNode } from 'react'

type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'punctuation' | 'plain'

interface Token {
  type: TokenType
  text: string
}

const OPACITY: Record<TokenType, string> = {
  keyword: 'text-foreground/90 font-semibold',
  string: 'text-foreground/60',
  comment: 'text-foreground/35 italic',
  number: 'text-foreground/70',
  punctuation: 'text-foreground/50',
  plain: 'text-foreground/80',
}

const JS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|default|new|this|class|extends|import|export|from|as|async|await|try|catch|finally|throw|typeof|instanceof|in|of|void|delete|yield|static|get|set|type|interface|enum|implements|declare|readonly|abstract|override|satisfies)\b/g
const SQL_KEYWORDS = /\b(SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|TRIGGER|FUNCTION|RETURNS|LANGUAGE|AS|BEGIN|END|IF|ELSE|THEN|CASE|WHEN|AND|OR|NOT|NULL|IS|IN|EXISTS|BETWEEN|LIKE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|SET|VALUES|DEFAULT|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|CONSTRAINT|CASCADE|ENABLE|ROW|LEVEL|SECURITY|POLICY|USING|WITH|FOR|TRUE|FALSE|INT|INTEGER|TEXT|UUID|BOOLEAN|JSONB|TIMESTAMPTZ|NUMERIC|SERIAL|BIGINT|VARCHAR|CHAR|FLOAT|DOUBLE|DECIMAL|DATE|TIME|TIMESTAMP|INTERVAL|NOT|STORED|GENERATED|ALWAYS|COALESCE|NOW)\b/gi
const SHELL_KEYWORDS = /\b(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|find|sed|awk|curl|wget|git|npm|npx|bun|pnpm|yarn|node|python|pip|docker|export|source|sudo|chmod|chown|kill|ps|top)\b/g

function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = []
  let remaining = code

  const patterns: Array<{ regex: RegExp; type: TokenType }> = []

  if (language === 'sql') {
    patterns.push(
      { regex: /^--[^\n]*/, type: 'comment' },
      { regex: /^\/\*[\s\S]*?\*\//, type: 'comment' },
      { regex: /^'(?:[^'\\]|\\.)*'/, type: 'string' },
      { regex: SQL_KEYWORDS, type: 'keyword' },
      { regex: /^\d+(?:\.\d+)?/, type: 'number' },
      { regex: /^[(){}[\];,.:=<>!+\-*/%|&~^@#$?]/, type: 'punctuation' },
    )
  } else if (['typescript', 'ts', 'javascript', 'js', 'tsx', 'jsx'].includes(language)) {
    patterns.push(
      { regex: /^\/\/[^\n]*/, type: 'comment' },
      { regex: /^\/\*[\s\S]*?\*\//, type: 'comment' },
      { regex: /^`(?:[^`\\]|\\.)*`/, type: 'string' },
      { regex: /^"(?:[^"\\]|\\.)*"/, type: 'string' },
      { regex: /^'(?:[^'\\]|\\.)*'/, type: 'string' },
      { regex: JS_KEYWORDS, type: 'keyword' },
      { regex: /^\d+(?:\.\d+)?/, type: 'number' },
      { regex: /^[(){}[\];,.:=<>!+\-*/%|&~^@#$?]/, type: 'punctuation' },
    )
  } else if (['shell', 'bash', 'sh', 'zsh'].includes(language)) {
    patterns.push(
      { regex: /^#[^\n]*/, type: 'comment' },
      { regex: /^"(?:[^"\\]|\\.)*"/, type: 'string' },
      { regex: /^'(?:[^'\\]|\\.)*'/, type: 'string' },
      { regex: SHELL_KEYWORDS, type: 'keyword' },
      { regex: /^\d+(?:\.\d+)?/, type: 'number' },
      { regex: /^[(){}[\];,.:=<>!+\-*/%|&~^@#$?]/, type: 'punctuation' },
    )
  } else if (language === 'json') {
    patterns.push(
      { regex: /^"(?:[^"\\]|\\.)*"\s*:/, type: 'keyword' },
      { regex: /^"(?:[^"\\]|\\.)*"/, type: 'string' },
      { regex: /^\b(true|false|null)\b/, type: 'keyword' },
      { regex: /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, type: 'number' },
      { regex: /^[{}[\],:.]/, type: 'punctuation' },
    )
  } else if (['markdown', 'md'].includes(language)) {
    patterns.push(
      { regex: /^#{1,6}\s+[^\n]*/, type: 'keyword' },
      { regex: /^\*\*[^*]+\*\*/, type: 'keyword' },
      { regex: /^`[^`]+`/, type: 'string' },
      { regex: /^- /, type: 'punctuation' },
      { regex: /^\[([^\]]*)\]\([^)]*\)/, type: 'string' },
    )
  } else {
    return [{ type: 'plain', text: code }]
  }

  while (remaining.length > 0) {
    let matched = false

    for (const { regex, type } of patterns) {
      const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags.replace('g', '') : regex.flags)
      const match = remaining.match(re)
      if (match && match.index === 0) {
        tokens.push({ type, text: match[0] })
        remaining = remaining.slice(match[0].length)
        matched = true
        break
      }
    }

    if (!matched) {
      const nextSpecial = remaining.slice(1).search(/[/"'`#\d(){}[\];,.:=<>!+\-*/%|&~^@#$?]/)
      if (nextSpecial === -1) {
        tokens.push({ type: 'plain', text: remaining })
        remaining = ''
      } else {
        tokens.push({ type: 'plain', text: remaining.slice(0, nextSpecial + 1) })
        remaining = remaining.slice(nextSpecial + 1)
      }
    }
  }

  return tokens
}

export function highlightCode(code: string, language: string): ReactNode[] {
  if (!language || language === 'text') {
    return [code]
  }

  const tokens = tokenize(code, language)
  return tokens.map((token, i) => (
    <span key={i} className={OPACITY[token.type]}>{token.text}</span>
  ))
}
