export interface LessonData {
  id: string
  number: string
  title: string
  xp: number
  isCapstone: boolean
  tools: string[]
  tierName: string
}

export const ALL_LESSONS: LessonData[] = [
  {
    "id": "p1",
    "number": "P1",
    "title": "Setting Up Your Workspace",
    "xp": 10,
    "isCapstone": false,
    "tools": [
      "Node.js",
      "VS Code",
      "Git",
      "Bun"
    ],
    "tierName": "Getting Started"
  },
  {
    "id": "p2",
    "number": "P2",
    "title": "Publishing Your First Project",
    "xp": 10,
    "isCapstone": false,
    "tools": [
      "Vercel",
      "GitHub"
    ],
    "tierName": "Getting Started"
  },
  {
    "id": "p3",
    "number": "P3",
    "title": "Meeting Your AI Agent",
    "xp": 15,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "MCP"
    ],
    "tierName": "Getting Started"
  },
  {
    "id": "1-1",
    "number": "1.1",
    "title": "How AI Actually Works",
    "xp": 15,
    "isCapstone": false,
    "tools": [
      "Claude Code"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-2",
    "number": "1.2",
    "title": "Why AI Forgets (and How to Prevent It)",
    "xp": 15,
    "isCapstone": false,
    "tools": [
      "Claude Code"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-3",
    "number": "1.3",
    "title": "Choosing the Right AI Tool",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "MCP"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-4",
    "number": "1.4",
    "title": "Look Before You Leap",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-5",
    "number": "1.5",
    "title": "Writing Clear Instructions for AI",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Markdown",
      "Claude Code"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-6",
    "number": "1.6",
    "title": "When AI Gets It Wrong",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Node.js"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-7",
    "number": "1.7",
    "title": "Connecting AI to Your Tools",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "MCP",
      "Claude Code",
      "Node.js"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-8",
    "number": "1.8",
    "title": "Teaching Your AI Shortcuts",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-9",
    "number": "1.9",
    "title": "Version Control (Your Safety Net)",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Git",
      "GitHub",
      "Claude Code"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "1-10",
    "number": "1.10",
    "title": "Milestone: Your First AI-Built Tool",
    "xp": 50,
    "isCapstone": true,
    "tools": [
      "Claude Code",
      "Vercel",
      "Git"
    ],
    "tierName": "How AI Thinks"
  },
  {
    "id": "2-1",
    "number": "2.1",
    "title": "Turning Your Idea Into a Brief",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Markdown"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-2",
    "number": "2.2",
    "title": "Directing AI to Build Your App Structure",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Next.js"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-3",
    "number": "2.3",
    "title": "Adding User Accounts and Security",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Supabase"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-4",
    "number": "2.4",
    "title": "Setting Up Your Database",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Supabase",
      "SQL"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-5",
    "number": "2.5",
    "title": "Keeping AI Focused During Long Sessions",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-6",
    "number": "2.6",
    "title": "Adding Payments and Integrations",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Stripe"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-7",
    "number": "2.7",
    "title": "Getting AI Back on Track",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-8",
    "number": "2.8",
    "title": "Checking the AI's Work",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Testing"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-9",
    "number": "2.9",
    "title": "Directing the Look and Feel",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Tailwind CSS",
      "Next.js"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-10",
    "number": "2.10",
    "title": "Giving AI Focused Tasks",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-11",
    "number": "2.11",
    "title": "Going Live",
    "xp": 15,
    "isCapstone": false,
    "tools": [
      "Vercel",
      "Claude Code"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "2-12",
    "number": "2.12",
    "title": "Milestone: Ship a Complete Product",
    "xp": 75,
    "isCapstone": true,
    "tools": [
      "Claude Code",
      "Next.js",
      "Supabase",
      "Stripe",
      "Vercel"
    ],
    "tierName": "Build Your First Product"
  },
  {
    "id": "3-1",
    "number": "3.1",
    "title": "Why Multiple Agents Beat One",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-2",
    "number": "3.2",
    "title": "Shared Rules for Your AI Team",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Markdown"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-3",
    "number": "3.3",
    "title": "Giving Each Agent Its Own Workspace",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git",
      "Git Worktrees"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-4",
    "number": "3.4",
    "title": "Planning What Gets Built When",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-5",
    "number": "3.5",
    "title": "Running Your First AI Team",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git Worktrees",
      "Git"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-6",
    "number": "3.6",
    "title": "Using One Agent to Check Another",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-7",
    "number": "3.7",
    "title": "When Agents' Work Conflicts",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git",
      "Git Worktrees"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-8",
    "number": "3.8",
    "title": "Automated Quality Checks",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Vitest",
      "GitHub Actions"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-9",
    "number": "3.9",
    "title": "Building Things That Run Automatically",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Inngest",
      "Next.js"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-10",
    "number": "3.10",
    "title": "When One Agent Fails",
    "xp": 20,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git Worktrees",
      "Git"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-11",
    "number": "3.11",
    "title": "Watching Your Product in the Real World",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Vercel",
      "Sentry",
      "Claude Code"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-12",
    "number": "3.12",
    "title": "Keeping Five Agents Aligned",
    "xp": 25,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Markdown",
      "Git"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-13",
    "number": "3.13",
    "title": "Scaling Your AI Team",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Git Worktrees",
      "Git"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "3-14",
    "number": "3.14",
    "title": "Milestone: Ship a Product Built by Your AI Team",
    "xp": 100,
    "isCapstone": true,
    "tools": [
      "Claude Code",
      "Git Worktrees",
      "Next.js",
      "Supabase",
      "Vercel"
    ],
    "tierName": "Run a Team of AI Agents"
  },
  {
    "id": "4-1",
    "number": "4.1",
    "title": "Organizing Projects for AI Teams",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-2",
    "number": "4.2",
    "title": "Writing the Ultimate AI Playbook",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Markdown"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-3",
    "number": "4.3",
    "title": "Designing Work That Doesn't Overlap",
    "xp": 35,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture",
      "Git Worktrees"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-4",
    "number": "4.4",
    "title": "Judging AI's Architectural Suggestions",
    "xp": 35,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-5",
    "number": "4.5",
    "title": "Analyzing Any System Through the AI Lens",
    "xp": 35,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture",
      "Analysis"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-6",
    "number": "4.6",
    "title": "Designing Systems for AI Teams",
    "xp": 35,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-7",
    "number": "4.7",
    "title": "When to Override the AI",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Critical Thinking"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-8",
    "number": "4.8",
    "title": "Smart Constraints Make AI Faster",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-9",
    "number": "4.9",
    "title": "Your Taste Is Your Competitive Advantage",
    "xp": 35,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-10",
    "number": "4.10",
    "title": "Improve It or Rebuild It?",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Claude Code",
      "Architecture",
      "Analysis"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-11",
    "number": "4.11",
    "title": "Explaining Your AI Workflow to Others",
    "xp": 30,
    "isCapstone": false,
    "tools": [
      "Documentation",
      "Communication"
    ],
    "tierName": "Design Your Own Workflows"
  },
  {
    "id": "4-12",
    "number": "4.12",
    "title": "Milestone: Analyze and Redesign a Real System",
    "xp": 150,
    "isCapstone": true,
    "tools": [
      "Claude Code",
      "Architecture",
      "Git Worktrees",
      "Analysis"
    ],
    "tierName": "Design Your Own Workflows"
  }
]

