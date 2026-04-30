# Architecture Decision Records

This document captures the key architectural decisions for the Course Engine, an agentic system that monitors AI news sources, extracts knowledge facts, and auto-regenerates course content for the Charles Jackson.Dev agentic software engineering course.

Each decision follows the ADR format: Context, Decision, Consequences.

---

## ADR-001: Monorepo with Workspace Packages

**Status:** Accepted

**Context:** The Course Engine needs to share types, utilities, and configuration with the existing portfolio site (`charlesjackson.dev`). We considered three approaches: (a) a separate repository with published npm packages, (b) a monorepo using workspace packages, or (c) a single flat project with everything in `src/`.

**Decision:** Use a workspace-based monorepo. The Course Engine lives under `course-engine/` within the existing `charlesjackson.dev` repository. Shared types (Supabase row types, LLM response schemas) are importable across workspace boundaries. The Supabase migration at `supabase/migrations/20260429000000_course_engine.sql` coexists with any future portfolio migrations in the same `supabase/` directory.

**Consequences:**
- Atomic commits across engine code and schema changes reduce the risk of schema/code drift.
- The portfolio site's CI and the engine's pipeline share the same repository, which simplifies deployment coordination but means unrelated changes can trigger each other's workflows.
- Initial setup is slightly more complex (workspace configuration in `package.json`, path aliases) compared to a standalone repo.
- A separate repo would have forced us to version and publish shared types as npm packages, adding friction to every schema change.

---

## ADR-002: Supabase for Storage + pgvector

**Status:** Accepted

**Context:** The engine needs persistent storage for source events, knowledge facts, course content, and regeneration proposals. It also needs vector similarity search for fact deduplication and semantic matching. The portfolio site already uses a Supabase project with auth configured.

**Decision:** Reuse the existing Supabase project. All Course Engine tables (`source_events`, `knowledge_facts`, `content_blocks`, `course_modules`, `lessons`, `regeneration_proposals`, `pipeline_runs`) are created via a single migration. The `vector` extension (pgvector) is enabled for the `knowledge_facts.embedding` column with 1536 dimensions, matching OpenAI's `text-embedding-3-small` output size. The `match_knowledge_facts()` SQL function provides cosine similarity search with configurable threshold and result count.

**Consequences:**
- No new infrastructure to provision or manage. Auth, RLS, and Edge Functions are already available.
- Vector dimensions are fixed at 1536 at migration time. Switching to a different embedding model with different dimensionality (e.g., 3072 for `text-embedding-3-large`) would require a new migration to alter the column and recompute all embeddings.
- We inherit Supabase's connection pooling limits. The engine's pipeline runs are infrequent (daily batch), so this is not a concern today, but a real-time variant would need to account for connection exhaustion.
- RLS policies currently grant full access only to the `service_role` key. The admin dashboard (Phase 5) will require additional policies for authenticated users.
- We are tied to the Supabase ecosystem for database access patterns. Direct Postgres access is available as an escape hatch, but the application layer uses the Supabase JS client (`@supabase/supabase-js`).

---

## ADR-003: Two-Tier LLM Strategy

**Status:** Accepted

**Context:** The engine makes LLM calls at multiple stages: summarizing fetched content, extracting structured facts, detecting fact supersession, generating content regeneration proposals, and running quality checks. These tasks vary significantly in complexity, stakes, and call volume.

**Decision:** Use a two-tier model strategy:

| Tier | Model | Use Cases | Characteristics |
|------|-------|-----------|-----------------|
| Fast | Claude Haiku 4.5 | Content summarization, deduplication checks, source classification, format validation | High volume, low stakes, ~20x cheaper than Opus |
| Deep | Claude Opus 4.7 | Fact extraction with confidence scoring, content regeneration, quality assessment, supersession analysis | Low volume, high stakes, highest reasoning capability |

Model selection is handled by the typed LLM wrapper, which routes calls based on a `tier` parameter. Cost is tracked per call and aggregated per pipeline run in the `pipeline_runs` table.

**Consequences:**
- Estimated daily cost stays under $0.50 for a full pipeline run, compared to $5-10 if all calls used Opus.
- Haiku may miss subtle nuances in source material that Opus would catch. For example, a changelog entry that implies a deprecation without stating it explicitly might be classified as a minor update by Haiku. The extraction stage uses Opus specifically to mitigate this risk.
- The wrapper must handle different rate limits for each model tier. Haiku has higher throughput limits, which aligns with its high-volume usage.
- If Anthropic introduces a mid-tier model (between Haiku and Opus in capability and cost), the wrapper's routing logic can accommodate a third tier without architectural changes.

---

## ADR-004: Content Hash Deduplication

**Status:** Accepted

**Context:** Source monitors fetch pages on a schedule. The same page content should not create duplicate `source_events` rows on successive fetches. We needed a deduplication strategy that is fast, deterministic, and requires no external state beyond the database.

**Decision:** Compute a SHA-256 hash of the raw fetched content and store it in `source_events.content_hash`. A `UNIQUE` constraint on this column causes duplicate inserts to fail at the database level. The monitor catches the constraint violation and skips processing for that URL.

**Consequences:**
- Deduplication is simple, deterministic, and fast. No fuzzy matching or similarity thresholds to tune.
- Any change to a page -- including whitespace changes, timestamp updates in footers, or ad content changes -- produces a new hash and creates a new event. This is intentional: we want the extraction agent to evaluate whether the change is substantive, rather than silently ignoring modified pages.
- The tradeoff is a higher volume of source events for pages that change cosmetically. The extraction agent (running on Opus) will determine that no new facts exist and produce zero extractions, but we still pay the LLM cost for that evaluation. In practice, the curated URL list (ADR-006) limits this to a manageable number of pages.
- An index on `content_hash` (`idx_source_events_content_hash`) ensures dedup lookups remain fast as the table grows.

---

## ADR-005: Fact Supersession over Deletion

**Status:** Accepted

**Context:** Knowledge facts change over time. A model's context window grows, pricing changes, APIs are deprecated and replaced. We needed a strategy for handling outdated facts that preserves history and supports auditability.

**Decision:** Facts are never deleted from `knowledge_facts`. When a fact becomes outdated, the extraction agent creates a new fact and sets `superseded_by` on the old fact to point to the new one. The old fact's `valid_until` is set to the new fact's `valid_from`, creating a continuous timeline. The `trg_fact_supersession` trigger automatically flags any `content_blocks` that depend on the superseded fact by transitioning their status from `current` to `at_risk`.

**Consequences:**
- Full history is preserved. We can answer questions like "What did we believe about Claude's context window on March 15?" by querying facts valid at that date.
- Supersession can be undone by clearing `superseded_by` and `valid_until`, which is useful when a source publishes an erroneous update that is later retracted.
- The `knowledge_facts` table grows monotonically. All queries for active facts must filter `WHERE superseded_by IS NULL AND valid_until IS NULL`. The `idx_knowledge_facts_superseded` partial index ensures this filter is efficient.
- The automatic trigger means a single fact supersession can cascade to multiple content blocks simultaneously. This is the desired behavior, but it means a single bad extraction could flag many blocks as at-risk. The confidence threshold on extractions (and the review workflow in ADR-008) mitigate this risk.

---

## ADR-006: Curated URL Lists over Crawling

**Status:** Accepted

**Context:** Source monitors need to know which pages to fetch. We considered two approaches: (a) full-site crawling with relevance filtering, or (b) curated lists of specific URLs per source.

**Decision:** Each monitor maintains a curated list of URLs to fetch. For example, the Anthropic monitor tracks specific documentation pages (`docs.anthropic.com/en/docs/about-claude/models`, changelog pages, API reference pages) rather than crawling all of `docs.anthropic.com`.

**Consequences:**
- Fetching is predictable: we know exactly how many requests each pipeline run will make and can estimate LLM costs in advance.
- We are respectful of source sites. No risk of aggressive crawling that might trigger rate limiting or IP blocks.
- The engine focuses on course-relevant content rather than spending LLM tokens evaluating irrelevant pages.
- The significant tradeoff is that new pages are invisible until manually added to the URL list. If Anthropic publishes a new documentation page about a feature relevant to the course, we will not discover it until someone adds the URL. The daily briefing (Phase 4) could mitigate this by including a "check for new pages" reminder, and Phase 6's GitHub release monitor will catch new features announced via releases.
- URL lists must be maintained as source sites restructure. A URL that returns 404 should be flagged in the pipeline run logs, not silently ignored.

---

## ADR-007: Tool Use Pattern for Structured Output

**Status:** Accepted

**Context:** The extraction and regeneration agents need to return structured data (facts with categories, confidence scores, entity arrays; proposals with change types and diff summaries). We considered three approaches: (a) prompting for JSON in the response text and parsing it, (b) using Anthropic's `tool_use` feature with forced `tool_choice`, or (c) using a schema validation library on free-form output.

**Decision:** Use Anthropic's `tool_use` with `tool_choice: { type: "tool", name: "extract_facts" }` (or the appropriate tool name for each agent). The tool's `input_schema` defines the exact shape of the expected output. The model is forced to respond with a tool call, and the typed LLM wrapper validates the response against the schema before returning it to the caller.

**Consequences:**
- Output reliability is significantly higher than JSON-in-text prompting. The model is specifically trained to produce well-formed tool calls, and the API validates the schema server-side.
- Schema changes are enforced at the type level: updating the tool schema in code immediately surfaces type errors in any code that consumes the output.
- The tradeoff is slightly higher token cost. Each request includes the tool definition (schema) in addition to the prompt, adding roughly 200-500 tokens of overhead per call. For the extraction agent (Opus tier), this overhead is negligible relative to the input content. For high-volume Haiku calls, it adds up but remains well within budget.
- If a model version handles structured output differently (e.g., a future native JSON mode), the wrapper's routing layer can switch strategies per model without changing the caller's interface.

---

## ADR-008: Regeneration Proposals Require Review

**Status:** Accepted

**Context:** When the engine detects that a content block depends on a superseded fact, it can generate a regeneration proposal with updated content. The question is whether to auto-apply these changes or require human review.

**Decision:** All content changes go through a proposal workflow: `pending` -> `approved`/`rejected` -> `applied`. The `regeneration_proposals` table stores the old markdown, new markdown, diff summary, change type (`patch`, `rewrite`, or `deprecate`), and a confidence score. In Phase 3 and beyond, patches with confidence > 0.9 may be auto-applied, but this threshold starts conservatively and will be adjusted based on observed accuracy.

**Consequences:**
- Course content quality is protected. A hallucinated fact or poorly worded regeneration does not go live without human review.
- The tradeoff is more manual work in the early phases. The course author must review and approve each proposal. The admin dashboard (Phase 5) and batch operations are designed to reduce this friction.
- Trust is earned incrementally. As the engine's regeneration accuracy is validated over time (tracked via the post-apply review rate), the auto-apply confidence threshold can be lowered, gradually increasing automation.
- The `rejected` status provides training signal. Rejected proposals reveal where the regeneration agent's prompt or approach needs refinement.

---

## ADR-009: Bun as Runtime

**Status:** Accepted

**Context:** The engine consists of pipeline scripts, CLI tools, and potentially a dashboard server. The portfolio project already uses Bun as its package manager (`bun.lock` is present) and script runner. We considered using Node.js for broader ecosystem compatibility.

**Decision:** Use Bun as the primary runtime for all Course Engine scripts and services. Bun provides native TypeScript execution (no transpilation step), a built-in test runner (`bun test`), and faster cold-start times than Node.js, which matters for pipeline scripts that run once per day and exit.

**Consequences:**
- Faster iteration during development. No `tsc` compilation step, no `ts-node` configuration. Scripts run directly with `bun run`.
- The built-in test runner eliminates the need for Jest or Vitest as additional dependencies.
- Some npm packages with native Node.js addons may have compatibility issues with Bun's runtime. In practice, the engine's dependencies (Supabase JS client, Anthropic SDK, crypto for hashing) are pure JavaScript/TypeScript and work without issues.
- If the admin dashboard (Phase 5) uses Next.js, it will run on Node.js regardless. This is acceptable since the dashboard is a separate concern from the pipeline scripts.
- The team must be aware that `bun:test` and `node:test` APIs differ. Test files written for Bun's runner are not directly portable to Node.js.

---

## ADR-010: Pipeline-Based Architecture over Event-Driven

**Status:** Accepted

**Context:** The engine could process source changes in two ways: (a) a batch pipeline that runs on a schedule (cron -> fetch all sources -> extract facts -> flag stale blocks -> generate proposals), or (b) an event-driven system where each new source event triggers downstream processing in real time via webhooks or message queues.

**Decision:** Use a batch pipeline architecture. A daily cron job (7:00 AM EST, aligned with the morning briefing in Phase 4) triggers the full pipeline: fetch all monitored URLs, extract facts from new events, detect superseded facts, flag dependent content blocks, and optionally generate regeneration proposals. Each run is recorded in `pipeline_runs` with counts for events fetched, facts extracted, blocks flagged, and proposals generated.

**Consequences:**
- Debugging is straightforward. Each pipeline run is a discrete unit with a clear start, end, and status. Failed runs can be replayed by re-running the pipeline script with the same parameters.
- The batch model aligns with the natural cadence of content updates. AI documentation and changelogs update at most a few times per day. Sub-minute freshness adds complexity without value for a course that students consume over weeks.
- The tradeoff is latency. A breaking change announced at 3:00 PM will not be processed until the next morning's pipeline run. For truly urgent updates (e.g., a critical API deprecation), a manual `bun run pipeline --now` command can trigger an immediate run.
- No message queue infrastructure (Redis, RabbitMQ, SQS) is needed. This eliminates an entire category of operational concerns (queue depth monitoring, dead letter handling, consumer scaling).
- If real-time processing becomes necessary in the future, the pipeline's stages (fetch, extract, flag, propose) are modular enough to be wired into an event-driven topology without rewriting the core logic.
