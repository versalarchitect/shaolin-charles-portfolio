import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-4',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Agents are fast at SQL and bad at data modeling',
      body: "Claude Code will generate a CREATE TABLE statement in seconds. It will normalize, denormalize, add indexes, and create migrations. But data modeling is about judgment calls — is this a one-to-many or many-to-many? Should this be a separate table or an enum column? Should we cascade deletes or set null? Agents optimize for \"works now\" not \"works in 6 months.\" Your job is to catch the structural decisions that will haunt you later.",
    },
    {
      type: 'info',
      title: 'Why this matters more than code quality',
      body: "You can refactor bad code cheaply. You cannot refactor a bad schema cheaply. Once a table is in production with data, changing its structure means writing migrations, backfilling data, handling edge cases, and coordinating deploys. A missing junction table discovered 3 months in means rewriting queries across your entire codebase. Catch it now, in the migration review, before any data exists.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Schema decisions are permanent decisions.',
    },

    // === SPECCING A DATABASE ===
    {
      type: 'info',
      title: 'What to include in a database spec',
      body: "A good database spec for the agent covers: entities (what are the nouns in your system), relationships (how entities connect — one-to-many, many-to-many), constraints (NOT NULL, UNIQUE, CHECK, foreign keys), indexes (which columns will be queried/filtered/joined), enums (fixed sets of values like status or role), and audit fields (created_at, updated_at, deleted_at if soft-deletes). The more explicit you are, the fewer assumptions the agent makes.",
    },
    {
      type: 'code-demo',
      title: 'Example database spec prompt',
      body: 'Structure your spec like this before directing the agent. Notice explicit relationship types and constraints.',
      language: 'markdown',
      filename: 'database-spec.md',
      code: "## Database Spec: Project Management App\n\n### Entities\n- users (from auth.users, extended with profiles)\n- workspaces (multi-tenant, users belong to many)\n- projects (belong to one workspace)\n- tasks (belong to one project, assigned to one user)\n- comments (belong to one task, authored by one user)\n\n### Relationships\n- users <-> workspaces: many-to-many (junction: workspace_members)\n- workspace -> projects: one-to-many\n- project -> tasks: one-to-many\n- task -> comments: one-to-many\n- user -> tasks: one-to-many (assignee)\n\n### Constraints\n- workspace_members: UNIQUE(user_id, workspace_id)\n- tasks.status: CHECK (status IN ('todo','in_progress','done'))\n- tasks.title: NOT NULL, max 200 chars\n- projects.slug: UNIQUE per workspace\n\n### Indexes\n- tasks: (project_id, status) for filtered lists\n- comments: (task_id, created_at) for chronological loading\n- workspace_members: (user_id) for \"my workspaces\" query\n\n### Audit\n- All tables: created_at DEFAULT now(), updated_at via trigger",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Spec structure is clear!',
    },

    // === DIRECTING SCHEMA GENERATION ===
    {
      type: 'info',
      title: 'Directing the agent to generate schema',
      body: "Give the spec to the agent and ask it to generate a migration file. Do not ask for \"the whole database\" at once — break it into logical groups. First: users and workspaces. Second: projects and tasks. Third: comments and activity. This sequencing matters because later migrations reference earlier tables via foreign keys. It also makes reviewing easier — smaller migrations are easier to audit than one 200-line file.",
    },
    {
      type: 'terminal',
      instruction: 'Create a new Supabase migration file for the users and workspaces tables:',
      expectedCommand: 'supabase migration new add_users_and_workspaces',
      hint: 'Use supabase migration new followed by a descriptive snake_case name',
    },
    {
      type: 'code-demo',
      title: 'Well-structured migration output',
      body: 'This is what a properly constrained migration looks like. Compare what the agent generates against this standard.',
      language: 'sql',
      filename: 'supabase/migrations/001_add_users_and_workspaces.sql',
      code: "-- Create enum for workspace roles\nCREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');\n\n-- Profiles table (extends auth.users)\nCREATE TABLE profiles (\n  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,\n  display_name TEXT NOT NULL,\n  avatar_url TEXT,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\n-- Workspaces\nCREATE TABLE workspaces (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  slug TEXT NOT NULL UNIQUE,\n  created_by UUID NOT NULL REFERENCES profiles(id),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\n-- Junction table: workspace members\nCREATE TABLE workspace_members (\n  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,\n  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,\n  role workspace_role NOT NULL DEFAULT 'member',\n  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  PRIMARY KEY (workspace_id, user_id)\n);\n\n-- Indexes\nCREATE INDEX idx_workspace_members_user ON workspace_members(user_id);\nCREATE INDEX idx_workspaces_slug ON workspaces(slug);\n\n-- Updated_at trigger function\nCREATE OR REPLACE FUNCTION update_updated_at()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = now();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER profiles_updated_at\n  BEFORE UPDATE ON profiles\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at();\n\nCREATE TRIGGER workspaces_updated_at\n  BEFORE UPDATE ON workspaces\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at();",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Schema generation directed!',
    },

    // === REVIEWING MIGRATIONS ===
    {
      type: 'info',
      title: 'Reviewing migrations: what agents get wrong',
      body: "Here is your review checklist for every agent-generated migration: (1) Missing NOT NULL — agents leave columns nullable by default when they should be required. (2) Missing indexes on foreign key columns — Postgres does NOT auto-index FKs, and missing indexes destroy join performance. (3) Wrong CASCADE behavior — CASCADE on delete means deleting a user deletes all their data. Sometimes you want SET NULL or RESTRICT instead. (4) No updated_at trigger. (5) VARCHAR(255) everywhere instead of TEXT with CHECK constraints. (6) Missing UNIQUE constraints on natural keys (email, slug, etc.).",
    },
    {
      type: 'code-demo',
      title: 'Spot the problems in this agent output',
      body: 'The agent generated this migration. Count the issues before reading the explanation below.',
      language: 'sql',
      filename: 'supabase/migrations/002_add_tasks.sql',
      code: "-- Agent-generated (has problems!)\nCREATE TABLE tasks (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(255),          -- Problem 1: should be NOT NULL\n  description TEXT,\n  status TEXT,                  -- Problem 2: no CHECK constraint\n  project_id INTEGER,           -- Problem 3: no FK, no NOT NULL\n  assigned_to UUID,             -- Problem 4: no FK reference\n  created_at TIMESTAMP          -- Problem 5: no DEFAULT, no NOT NULL\n);                              -- Problem 6: no index on project_id\n                                -- Problem 7: no updated_at column",
    },
    {
      type: 'multiple-choice',
      question: 'Why is a missing index on a foreign key column a serious problem?',
      options: [
        'It prevents the FK constraint from being enforced',
        'It makes JOIN queries and cascading deletes scan the entire table',
        'Postgres will reject the migration without it',
        'It causes data corruption on concurrent writes',
      ],
      correctIndex: 1,
      explanation: 'Without an index on the FK column, every JOIN, every WHERE clause filtering by that FK, and every cascading delete must do a sequential scan of the entire table. On a table with 100K+ rows, this turns millisecond queries into seconds.',
    },

    // === COMMON DATA MODELING MISTAKES ===
    {
      type: 'info',
      title: 'Data modeling mistakes agents commonly make',
      body: "Beyond constraint issues, agents make structural modeling errors: (1) Denormalization where normalization is needed — stuffing tags as a comma-separated string instead of a junction table. (2) Missing junction tables for many-to-many — using arrays of IDs instead of proper relational joins. (3) Using VARCHAR(255) everywhere — a MySQL habit that has no benefit in Postgres (use TEXT with CHECK). (4) No audit timestamps — missing created_at/updated_at on every table. (5) Integer IDs instead of UUIDs — makes multi-tenant systems and data merging painful.",
    },
    {
      type: 'multiple-choice',
      question: 'An agent stores tags as a TEXT[] array column on the posts table. Why might this be wrong?',
      options: [
        'Postgres does not support array columns',
        'You cannot query array intersections efficiently, and you lose referential integrity and tag metadata',
        'Arrays are slower to read than TEXT columns',
        'It uses too much disk space',
      ],
      correctIndex: 1,
      explanation: 'Array columns cannot enforce that tag values exist in a canonical list (no FK). You cannot store metadata about a tag (color, description, created_by). Querying "all posts with tag X" requires scanning every row. A proper tags table + post_tags junction table solves all of these.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Schema review instincts sharpened!',
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'diagram',
      title: 'Iterative Schema Refinement',
      body: 'Your workflow is a review loop. You never accept the first draft — you review, fix, and verify before migrating.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Your Spec', sublabel: 'Entities + Rules', shape: 'rounded' },
          { id: 'generate', label: 'Agent Generates', sublabel: 'SQL Migration', shape: 'rect' },
          { id: 'review', label: 'You Review', sublabel: 'Check Constraints', shape: 'diamond', highlight: true },
          { id: 'fix', label: 'Fix Issues', sublabel: 'Direct Agent', shape: 'rect' },
          { id: 'migrate', label: 'Migrate', sublabel: 'supabase db push', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'generate', label: 'prompt' },
          { from: 'generate', to: 'review', label: 'output' },
          { from: 'review', to: 'fix', label: 'issues found' },
          { from: 'fix', to: 'generate', label: 'iterate', dashed: true },
          { from: 'review', to: 'migrate', label: 'approved' },
        ],
      },
    },

    // === ITERATIVE REFINEMENT ===
    {
      type: 'info',
      title: 'Iterative refinement without starting over',
      body: "When you find issues in a migration, do not ask the agent to regenerate from scratch. That wastes context and may introduce new issues. Instead, tell it exactly what to fix: \"Add NOT NULL to tasks.title and tasks.project_id. Add a CHECK constraint on status. Add an index on project_id. Add FK references to projects(id) and profiles(id). Add created_at and updated_at with defaults.\" Surgical fixes, not rewrites.",
    },
    {
      type: 'code-input',
      instruction: 'Write the SQL to add a missing index on the tasks.project_id column:',
      placeholder: 'CREATE INDEX ...',
      answer: 'CREATE INDEX idx_tasks_project_id ON tasks(project_id);',
      hint: 'Use CREATE INDEX with a descriptive name, ON the table, with the column in parentheses',
    },

    // === MIGRATION WORKFLOW ===
    {
      type: 'terminal',
      instruction: 'Push your migrations to the local Supabase database to test them:',
      expectedCommand: 'supabase db push',
      hint: 'The Supabase CLI command that applies pending migrations to your linked database',
    },
    {
      type: 'code-demo',
      title: 'Foreign key with proper cascade',
      body: 'Choose CASCADE behavior deliberately. This example shows all three options and when to use each.',
      language: 'sql',
      filename: 'cascade-examples.sql',
      code: "-- CASCADE: Delete user → delete all their posts\n-- Use when: child data is meaningless without parent\nCREATE TABLE posts (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE\n);\n\n-- SET NULL: Delete workspace → keep projects, clear workspace_id\n-- Use when: child can exist independently\nCREATE TABLE projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL\n);\n\n-- RESTRICT: Cannot delete a project that still has tasks\n-- Use when: deletion should be blocked if children exist\nCREATE TABLE tasks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT\n);",
    },
    {
      type: 'multiple-choice',
      question: 'A user deletes their account. Their comments reference other users\' posts. What CASCADE behavior is appropriate for the comment.user_id FK?',
      options: [
        'CASCADE — delete all their comments',
        'SET NULL — keep comments but remove author reference',
        'RESTRICT — prevent account deletion if they have comments',
        'No FK — just leave orphaned records',
      ],
      correctIndex: 1,
      explanation: 'SET NULL is usually best for comments. The comment content is still valuable in context (other users can see the thread). You lose the author attribution but preserve the discussion. CASCADE would delete content others rely on. RESTRICT would trap users in the system.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Migration review workflow mastered!',
    },

    // === ORDER EXERCISE ===
    {
      type: 'order',
      instruction: 'Order the steps of a migration review from first to last:',
      items: [
        'Check CASCADE behavior on all FKs',
        'Verify all columns have appropriate NULL/NOT NULL',
        'Run supabase db push to test',
        'Confirm indexes exist on FK columns and query patterns',
        'Read the full migration file top to bottom',
        'Verify enums/CHECK constraints on status columns',
      ],
      correctOrder: [4, 1, 5, 3, 0, 2],
    },

    // === FINAL CHECKLIST ===
    {
      type: 'checklist',
      title: 'Migration review checklist:',
      items: [
        'Every required column is NOT NULL with a DEFAULT where appropriate',
        'Every FK column has an index',
        'CASCADE/SET NULL/RESTRICT is chosen deliberately, not defaulted',
        'Status/type columns use CHECK constraints or enums, not unchecked TEXT',
        'Many-to-many relationships use junction tables, not arrays',
        'All tables have created_at and updated_at with trigger',
        'UUIDs used for primary keys (not SERIAL) in multi-tenant systems',
        'UNIQUE constraints on natural keys (email, slug, etc.)',
        'Migration runs cleanly on supabase db reset',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Directing Database Design & Verifying Migrations complete! Your schemas will stand the test of time.',
    },
  ],
}

export default content
