/**
 * Registry of core course concepts — single source of truth for terminology.
 * Referenced from any lesson to ensure consistent definitions.
 */

export interface Concept {
  id: string
  name: string
  definition: string
  firstIntroduced: string
  keyPoints: string[]
}

export const CONCEPTS: Record<string, Concept> = {
  spec: {
    id: 'spec',
    name: 'Specification (Spec)',
    definition: 'An execution contract between you and an agent. Not a PRD — it defines what to build, the boundaries, and how to verify the output is correct.',
    firstIntroduced: '1-5',
    keyPoints: [
      'Five sections: Goal, Constraints, Acceptance Criteria, Technical Boundaries, Out of Scope',
      'Prevents the agent from making unauthorized architectural decisions',
      'Should be verifiable — every requirement has a pass/fail test',
    ],
  },
  contextWindow: {
    id: 'contextWindow',
    name: 'Context Window',
    definition: 'The fixed-size buffer holding conversation history and file contents. When full, older information is dropped and the agent "forgets" earlier decisions.',
    firstIntroduced: '1-2',
    keyPoints: [
      'Measured in tokens, not words',
      'Includes both your prompts and the model output',
      'Exhaustion causes quality degradation before hard failure',
    ],
  },
  mcp: {
    id: 'mcp',
    name: 'Model Context Protocol (MCP)',
    definition: 'An open protocol that standardizes how AI agents communicate with external tools. JSON-RPC 2.0 over stdio or HTTP, connecting clients (agents) to servers (tool implementations).',
    firstIntroduced: '1-7',
    keyPoints: [
      'Three layers: Client (agent), Protocol (JSON-RPC), Server (your code)',
      'Universal connector — any tool that speaks MCP works with any agent that supports it',
      'Servers expose tools, resources, and prompts',
    ],
  },
  toolLadder: {
    id: 'toolLadder',
    name: 'Tool Ladder',
    definition: 'Five levels of AI assistance: paste, skill, script, agent, MCP. Each level trades convenience for capability. Match the level to the task complexity.',
    firstIntroduced: '1-3',
    keyPoints: [
      'Paste: copy output, paste into editor',
      'Skill: reusable prompt template',
      'Script: automated single-file operation',
      'Agent: multi-file, multi-step orchestration',
      'MCP: external system integration',
    ],
  },
  worktree: {
    id: 'worktree',
    name: 'Git Worktree',
    definition: 'A separate working directory linked to the same repository. Each worktree can have its own branch checked out, enabling parallel agent work without file conflicts.',
    firstIntroduced: '1-9',
    keyPoints: [
      'Separate filesystem, shared .git directory',
      'No lock contention between agents',
      'Merge back to main when work is done',
    ],
  },
  rls: {
    id: 'rls',
    name: 'Row-Level Security (RLS)',
    definition: 'Database-level access control that filters rows based on the authenticated user. Policies define who can see and modify each row, enforced by Postgres regardless of how the query arrives.',
    firstIntroduced: '2-3',
    keyPoints: [
      'Policies use auth.uid() to identify the current user',
      'USING clause filters reads, WITH CHECK clause filters writes',
      'Agents commonly forget to add RLS to new tables',
    ],
  },
  claudeMd: {
    id: 'claudeMd',
    name: 'CLAUDE.md',
    definition: 'A project-level instruction file that Claude Code reads on every invocation. Acts as persistent context — conventions, constraints, and architectural decisions the agent must follow.',
    firstIntroduced: '1-4',
    keyPoints: [
      'Read once at session start, persists across all agent actions',
      'Layer project-level and directory-level files for specificity',
      'The primary coordination protocol for multi-agent work',
    ],
  },
  agentFleet: {
    id: 'agentFleet',
    name: 'Agent Fleet',
    definition: 'Multiple AI agents working in parallel on the same codebase, each in its own git worktree. Coordinated through shared specs, CLAUDE.md, and interface contracts.',
    firstIntroduced: '3-1',
    keyPoints: [
      'Requires task decomposition into independent work units',
      'Each agent gets its own branch and worktree',
      'Coordination through shared context, not real-time communication',
    ],
  },
}

/** Get a concept definition for use in lesson content */
export function conceptDef(id: keyof typeof CONCEPTS): string {
  return CONCEPTS[id].definition
}

/** Get the key points for a concept */
export function conceptPoints(id: keyof typeof CONCEPTS): string[] {
  return CONCEPTS[id].keyPoints
}
