import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-4',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'AI is fast at databases but needs your judgment on structure',
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
      message: 'Database structure is hard to change later. Getting it right now matters.',
    },

    // === SPECCING A DATABASE ===
    {
      type: 'multiple-choice',
      question: 'Which element is MOST important to include in a database spec for an AI agent?',
      options: [
        'The color scheme for the database admin panel',
        'Explicit relationship types (one-to-many, many-to-many) and constraints (NOT NULL, UNIQUE, FK)',
        'The exact SQL dialect the database will use',
        'A list of all API endpoints that will query the database',
      ],
      correctIndex: 1,
      explanation: 'A good database spec covers: entities, relationships (one-to-many, many-to-many), constraints (NOT NULL, UNIQUE, CHECK, foreign keys), indexes, enums, and audit fields. The more explicit you are about relationships and constraints, the fewer assumptions the agent makes. Without them, the agent will guess — and guess wrong.',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this database spec by filling in the relationship types and constraints:',
      language: 'markdown',
      filename: 'database-spec.md',
      template: '## Database Spec: Project Management App\n\n### Relationships\n- users <-> workspaces: {{user_workspace_rel}} (junction: workspace_members)\n- workspace -> projects: {{workspace_project_rel}}\n- project -> tasks: one-to-many\n\n### Constraints\n- workspace_members: {{unique_constraint}}(user_id, workspace_id)\n- tasks.status: {{check_type}} (status IN (\'todo\',\'in_progress\',\'done\'))\n- tasks.title: NOT NULL, max 200 chars',
      blanks: [
        { id: 'user_workspace_rel', answer: 'many-to-many', alternatives: ['M:N', 'm2m'], placeholder: 'relationship type?', hint: 'Users belong to many workspaces, workspaces have many users' },
        { id: 'workspace_project_rel', answer: 'one-to-many', alternatives: ['1:N', '1:many', 'one to many'], placeholder: 'relationship type?', hint: 'A project belongs to exactly one workspace' },
        { id: 'unique_constraint', answer: 'UNIQUE', alternatives: ['unique'], placeholder: 'constraint?', hint: 'A user can only be a member of a workspace once' },
        { id: 'check_type', answer: 'CHECK', alternatives: ['check'], placeholder: 'constraint type?', hint: 'Restricts column values to a specific set' },
      ],
      explanation: 'Explicit relationship types tell the agent whether to create junction tables (many-to-many) or simple foreign keys (one-to-many). UNIQUE prevents duplicates, CHECK restricts values to valid options. Without these, the agent guesses.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Spec structure is clear!',
    },

    // === DIRECTING SCHEMA GENERATION ===
    {
      type: 'multiple-choice',
      question: 'When asking an agent to generate database migrations, what is the best approach?',
      options: [
        'Ask for the entire database schema in one migration file',
        'Break it into logical groups (users first, then projects, then comments) so FKs reference existing tables',
        'Let the agent decide the order — it knows best',
        'Generate all tables without foreign keys, then add FKs in a separate migration',
      ],
      correctIndex: 1,
      explanation: 'Break migrations into logical groups. Later migrations reference earlier tables via foreign keys, so order matters. Smaller migrations are also easier to review — auditing a 50-line file is much easier than a 200-line one. This sequencing prevents FK reference errors and gives you review checkpoints.',
    },
    {
      type: 'terminal',
      instruction: 'Create a new database migration file (a set of instructions that sets up your database tables):',
      expectedCommand: 'supabase migration new add_users_and_workspaces',
      hint: 'Use supabase migration new followed by a descriptive snake_case name',
    },
    {
      type: 'code-fill',
      instruction: 'Complete this migration to create a properly constrained workspace members junction table:',
      language: 'sql',
      filename: 'supabase/migrations/001_add_workspaces.sql',
      template: "-- Junction table: workspace members\nCREATE TABLE workspace_members (\n  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE {{ws_cascade}},\n  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,\n  role workspace_role NOT NULL DEFAULT '{{default_role}}',\n  joined_at TIMESTAMPTZ NOT NULL DEFAULT {{default_time}},\n  PRIMARY KEY (workspace_id, {{pk_col}})\n);\n\n-- Index for 'my workspaces' query\nCREATE INDEX idx_workspace_members_user ON workspace_members({{index_col}});",
      blanks: [
        { id: 'ws_cascade', answer: 'CASCADE', alternatives: ['cascade'], placeholder: 'delete behavior?', hint: 'When workspace is deleted, remove its members' },
        { id: 'default_role', answer: 'member', placeholder: 'default role?', hint: 'New users join as the lowest privilege role' },
        { id: 'default_time', answer: 'now()', alternatives: ['NOW()'], placeholder: 'default value?', hint: 'Postgres function for current timestamp' },
        { id: 'pk_col', answer: 'user_id', placeholder: 'second PK column?', hint: 'Composite PK prevents duplicate membership' },
        { id: 'index_col', answer: 'user_id', placeholder: 'which column?', hint: 'Needed for the "my workspaces" query' },
      ],
      explanation: 'A junction table needs: CASCADE on both FKs (membership is meaningless without both parent records), a composite PRIMARY KEY to prevent duplicates, a sensible default role, and an index on user_id for the "show my workspaces" query pattern.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Schema generation directed!',
    },

    // === REVIEWING MIGRATIONS ===
    {
      type: 'multiple-choice',
      question: 'Which of these is the MOST common mistake agents make in generated migrations?',
      options: [
        'Using the wrong SQL dialect',
        'Leaving columns nullable by default when they should be NOT NULL, and missing indexes on FK columns',
        'Creating too many tables at once',
        'Using incorrect column names',
      ],
      correctIndex: 1,
      explanation: 'Agents consistently: (1) leave columns nullable when they should be NOT NULL, (2) skip indexes on FK columns (Postgres does NOT auto-index FKs), (3) default to CASCADE when SET NULL or RESTRICT would be safer, (4) skip updated_at triggers, (5) use VARCHAR(255) instead of TEXT with CHECK, (6) miss UNIQUE constraints on natural keys. Always review for these patterns.',
    },
    {
      type: 'code-fill',
      instruction: 'The agent generated a broken tasks table. Fill in the missing constraints to fix it:',
      language: 'sql',
      filename: 'supabase/migrations/002_add_tasks.sql',
      template: "CREATE TABLE tasks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  title TEXT {{title_constraint}},\n  description TEXT,\n  status TEXT NOT NULL {{status_check}},\n  project_id UUID NOT NULL REFERENCES {{fk_table}}(id),\n  assigned_to UUID REFERENCES profiles(id),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  {{update_col}} TIMESTAMPTZ NOT NULL DEFAULT now()\n);",
      blanks: [
        { id: 'title_constraint', answer: 'NOT NULL', alternatives: ['not null'], placeholder: 'constraint?', hint: 'Every task must have a title' },
        { id: 'status_check', answer: "CHECK (status IN ('todo','in_progress','done'))", alternatives: ["check (status in ('todo','in_progress','done'))"], placeholder: 'validation?', hint: 'Restrict status to valid values only' },
        { id: 'fk_table', answer: 'projects', placeholder: 'parent table?', hint: 'Tasks belong to which entity?' },
        { id: 'update_col', answer: 'updated_at', alternatives: ['updatedAt'], placeholder: 'missing column?', hint: 'Track when the row was last modified' },
      ],
      explanation: 'Every required column needs NOT NULL. Status columns need CHECK constraints to prevent invalid values. FK columns need proper REFERENCES. And every table needs an updated_at column with a trigger to track modifications.',
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
      type: 'compare',
      title: 'Denormalized vs normalized data modeling',
      body: 'Agents often denormalize where normalization is needed. Spot the structural difference.',
      question: 'Which approach handles tags correctly for a blog platform?',
      correctSide: 'right',
      left: {
        label: 'Agent default (denormalized)',
        content: "CREATE TABLE posts (\n  id UUID PRIMARY KEY,\n  title TEXT NOT NULL,\n  tags TEXT[],  -- Array of strings\n  -- Problems:\n  -- No referential integrity\n  -- Can't store tag metadata\n  -- Querying 'all posts with tag X'\n  --   requires scanning every row\n  -- No canonical tag list\n);",
        language: 'sql',
      },
      right: {
        label: 'Properly normalized',
        content: "CREATE TABLE tags (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL UNIQUE,\n  color TEXT,\n  created_by UUID REFERENCES profiles(id)\n);\nCREATE TABLE post_tags (\n  post_id UUID REFERENCES posts(id)\n    ON DELETE CASCADE,\n  tag_id UUID REFERENCES tags(id)\n    ON DELETE CASCADE,\n  PRIMARY KEY (post_id, tag_id)\n);",
        language: 'sql',
      },
      explanation: 'Array columns cannot enforce that tag values exist in a canonical list (no FK). You cannot store metadata about a tag (color, description, created_by). Querying "all posts with tag X" requires scanning every row. A proper tags table + post_tags junction table solves all of these. Agents default to arrays because they look simpler.',
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

    // === INTERACTIVE DATABASE EXERCISES ===
    {
      type: 'compare',
      title: 'Agent-generated migration: spot the problems',
      body: 'Agents generate technically valid SQL that often misses structural safeguards.',
      question: 'Which migration is safer to run in production?',
      correctSide: 'right',
      left: {
        label: 'Missing safeguards',
        content: 'CREATE TABLE tasks (\n  id SERIAL PRIMARY KEY,\n  title TEXT,\n  project_id INTEGER,\n  status TEXT,\n  assigned_to TEXT\n);\n\n-- No NOT NULL constraints\n-- No FK to projects table\n-- No index on project_id\n-- status is free text, not enum',
        language: 'sql',
      },
      right: {
        label: 'Production-ready',
        content: 'CREATE TABLE tasks (\n  id SERIAL PRIMARY KEY,\n  title TEXT NOT NULL,\n  project_id INTEGER NOT NULL\n    REFERENCES projects(id) ON DELETE CASCADE,\n  status TEXT NOT NULL\n    CHECK (status IN (\'todo\',\'doing\',\'done\')),\n  assigned_to UUID REFERENCES auth.users(id)\n);\nCREATE INDEX idx_tasks_project\n  ON tasks(project_id);',
        language: 'sql',
      },
      explanation: 'The production version adds: NOT NULL to prevent empty data, FK constraint for referential integrity, CHECK constraint for valid statuses, proper UUID type for user references, and an index for query performance.',
    },
    {
      type: 'code-fill',
      instruction: 'Fix this migration by adding the missing constraints:',
      language: 'sql',
      filename: 'supabase/migrations/002_fix_tasks.sql',
      template: 'ALTER TABLE tasks\n  ALTER COLUMN title SET {{not_null}},\n  ADD CONSTRAINT fk_project\n    FOREIGN KEY (project_id) REFERENCES {{ref_table}}(id)\n    ON DELETE {{cascade_action}};',
      blanks: [
        { id: 'not_null', answer: 'NOT NULL', alternatives: ['not null'], placeholder: 'constraint?', hint: 'Prevent empty values' },
        { id: 'ref_table', answer: 'projects', placeholder: 'which table?', hint: 'The parent table for tasks' },
        { id: 'cascade_action', answer: 'CASCADE', alternatives: ['cascade'], placeholder: 'delete behavior?', hint: 'When the project is deleted, delete its tasks too' },
      ],
      explanation: 'NOT NULL prevents empty data. FOREIGN KEY ensures every task belongs to a real project. ON DELETE CASCADE automatically removes orphaned tasks when a project is deleted.',
    },
    {
      type: 'match',
      instruction: 'Match each ON DELETE behavior to the right relationship:',
      leftItems: ['CASCADE', 'SET NULL', 'RESTRICT'],
      rightItems: ['Child is meaningless without parent (task without project)', 'Child can exist independently (comment without author)', 'Deletion should be blocked if children exist (user with active orders)'],
      correctPairs: { 0: 0, 1: 1, 2: 2 },
      explanation: 'CASCADE deletes children automatically. SET NULL keeps children but removes the link. RESTRICT prevents deletion entirely. Choose based on the real-world relationship between the data.',
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'interactive-diagram',
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
      stages: [
        {
          highlightNodes: ['spec', 'generate'],
          highlightEdges: [{ from: 'spec', to: 'generate' }],
          explanation: 'You start by writing a detailed spec — entities, relationships, constraints, indexes. The agent uses this to generate a SQL migration file.',
        },
        {
          highlightNodes: ['generate', 'review'],
          highlightEdges: [{ from: 'generate', to: 'review' }],
          explanation: 'The agent produces SQL. You review it against your checklist: NOT NULL on required fields, indexes on FKs, correct CASCADE behavior, CHECK constraints on enums.',
        },
        {
          highlightNodes: ['review', 'fix'],
          highlightEdges: [{ from: 'review', to: 'fix' }],
          explanation: 'Issues found? Give surgical corrections: "Add NOT NULL to tasks.title. Add an index on project_id." Specific fixes, not full rewrites.',
        },
        {
          highlightNodes: ['fix', 'generate'],
          highlightEdges: [{ from: 'fix', to: 'generate' }],
          explanation: 'The agent regenerates only the parts you flagged. This loop repeats until the migration passes your review. Most schemas need 2-3 iterations.',
        },
        {
          highlightNodes: ['review', 'migrate'],
          highlightEdges: [{ from: 'review', to: 'migrate' }],
          explanation: 'Once the migration passes review, apply it with supabase db push. The schema is now locked in — changing it later requires a new migration and data backfill.',
        },
      ],
    },

    // === ITERATIVE REFINEMENT ===
    {
      type: 'multiple-choice',
      question: 'You find 3 issues in an agent-generated migration. What is the best correction approach?',
      options: [
        'Ask the agent to regenerate the entire migration from scratch',
        'List the exact fixes: "Add NOT NULL to tasks.title, add CHECK on status, add index on project_id"',
        'Write the corrected migration yourself without the agent',
        'Accept it as-is and fix issues later when they cause problems',
      ],
      correctIndex: 1,
      explanation: 'Surgical corrections preserve what the agent got right and only fix what it got wrong. Regenerating from scratch wastes context and may introduce new issues. Telling the agent exactly what to fix — column by column, constraint by constraint — produces the fastest, most reliable result.',
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
      instruction: 'Apply your database changes to test that they work correctly:',
      expectedCommand: 'supabase db push',
      hint: 'The Supabase CLI command that applies pending migrations to your linked database',
    },
    {
      type: 'code-fill',
      instruction: 'Choose the correct ON DELETE behavior for each foreign key relationship:',
      language: 'sql',
      filename: 'cascade-examples.sql',
      template: "-- Child data is meaningless without parent\nCREATE TABLE posts (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL REFERENCES profiles(id)\n    ON DELETE {{posts_cascade}}\n);\n\n-- Child can exist independently\nCREATE TABLE projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  workspace_id UUID REFERENCES workspaces(id)\n    ON DELETE {{projects_cascade}}\n);\n\n-- Deletion should be blocked if children exist\nCREATE TABLE tasks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  project_id UUID NOT NULL REFERENCES projects(id)\n    ON DELETE {{tasks_cascade}}\n);",
      blanks: [
        { id: 'posts_cascade', answer: 'CASCADE', alternatives: ['cascade'], placeholder: 'behavior?', hint: 'Posts are meaningless without their author' },
        { id: 'projects_cascade', answer: 'SET NULL', alternatives: ['set null', 'SET null'], placeholder: 'behavior?', hint: 'Keep projects alive but clear the workspace link' },
        { id: 'tasks_cascade', answer: 'RESTRICT', alternatives: ['restrict'], placeholder: 'behavior?', hint: 'Prevent deleting a project that still has tasks' },
      ],
      explanation: 'CASCADE deletes children automatically (posts without author are useless). SET NULL keeps children but removes the link (projects can exist without a workspace). RESTRICT prevents deletion entirely (cannot delete a project with active tasks). Choose deliberately — the agent will default to CASCADE for everything.',
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
