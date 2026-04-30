# Course Engine Roadmap

> An agentic system that monitors AI news sources, extracts knowledge facts, maps them to course content, and auto-regenerates stale sections for the **Charles Jackson.Dev** agentic software engineering course.

---

## Phase 1: Foundation (Current -- Week 1)

Core infrastructure: data pipeline skeleton, source monitors, and knowledge extraction.

- [x] Repo scaffold with workspace structure (`package.json` at project root, `course-engine/` directory)
- [x] Supabase schema migration (`supabase/migrations/20260429000000_course_engine.sql`)
  - Tables: `source_events`, `knowledge_facts`, `content_blocks`, `course_modules`, `lessons`, `regeneration_proposals`, `pipeline_runs`
  - pgvector extension enabled, `match_knowledge_facts()` similarity search function
  - `flag_blocks_on_fact_supersession()` trigger for automatic staleness detection
- [x] Typed LLM wrapper (model routing, retries, structured outputs via `tool_use`, cost tracking)
- [x] Anthropic docs + changelog monitors (curated URL lists per ADR-006)
- [x] Knowledge extraction agent with supersession logic (`superseded_by` pointer, `valid_from`/`valid_until` window)
- [x] Fixture data for testing
- [x] Run first real pipeline: monitor -> extract -> store facts
  - Ollama (qwen2.5:7b) backend added for free local inference — no API key needed
  - Backfill script (`scripts/backfill-extraction.ts`) for reprocessing historical events
  - 24 source events fetched, 174 knowledge facts extracted across all categories
- [x] Verify facts in Supabase dashboard (confirm RLS policies work with service role key)
  - Facts verified: 110 model_capability, 22 pricing, 20 sdk_api, 10 best_practice, 6 deprecation, 3 pattern, 2 release, 1 breaking_change

**Dependencies:** Supabase project must have the migration applied and pgvector extension enabled.

---

## Phase 2: Course Content Mapping (Week 2)

Connect the knowledge graph to actual course content so staleness is detectable.

- [ ] Seed course structure: 3 modules, 9 lessons, ~30 content blocks
  - Module 1: Foundations of Agentic Engineering
  - Module 2: Building with LLM APIs
  - Module 3: Production Patterns & Tooling
- [ ] Tag each `content_blocks` row with its `depends_on_facts` UUID array
- [ ] Build the "staleness detector" -- when `trg_fact_supersession` fires, verify dependent blocks transition from `current` to `at_risk`
- [ ] Admin CLI: `bun run pipeline --status` shows fact count, stale blocks, recent source events
- [ ] Content block status dashboard (terminal table or minimal web page listing block statuses)

**Dependencies:** Phase 1 pipeline must produce real facts in `knowledge_facts` before content blocks can be linked.

---

## Phase 3: Regeneration Engine (Week 3)

The core value proposition: automatically propose updated content when facts change.

- [ ] Regeneration agent: takes stale block + old/new facts, produces updated markdown via Opus 4.7
- [ ] Diff viewer: side-by-side comparison of `old_markdown` vs `new_markdown` in `regeneration_proposals`
- [ ] Quality checks: factual consistency against source material, tone match with existing content, length sanity (no 10x expansion)
- [ ] Confidence thresholds: auto-apply patches with confidence > 0.9, require manual review for rewrites below 0.9
- [ ] Regeneration proposal storage in `regeneration_proposals` table with `pending` -> `approved`/`rejected` -> `applied` workflow

**Dependencies:** Phase 2 must have content blocks with fact dependencies seeded. Regeneration uses Opus 4.7 (ADR-003) -- cost tracking must be active.

---

## Phase 4: Daily Briefing (Week 3--4)

Keep the course author informed without requiring dashboard visits.

- [ ] Morning briefing generator (7:00 AM EST cron via Supabase Edge Function or external scheduler)
- [ ] Email template using Resend integration (already in Supabase ecosystem)
- [ ] TLDR format:
  - New source events since last briefing
  - Content blocks newly at-risk or stale
  - Auto-healed blocks (patches applied with confidence > 0.9)
  - Urgent items requiring manual review
- [ ] Optional Slack webhook integration for real-time alerts

**Dependencies:** Resend API key. Phase 3 must be operational for the "auto-healed" section to have content.

---

## Phase 5: Admin Dashboard (Week 4--5)

Visual management interface for non-CLI workflows.

- [ ] Next.js app with Supabase auth (reuse existing Supabase project credentials)
- [ ] Dashboard views:
  - Source health: last fetch time, error rate, events/day per source
  - Fact graph: active vs superseded facts by category, entity distribution
  - Content status: blocks by status (`current`, `at_risk`, `stale`, `regenerating`)
  - Recent regenerations: proposals with diff previews
- [ ] One-click "Apply" / "Reject" for regeneration proposals (updates `regeneration_proposals.status` and `content_blocks.markdown`)
- [ ] Batch operations: "Apply all high-confidence patches" (confidence > 0.9, change_type = `patch`)
- [ ] Pipeline run history and logs (`pipeline_runs` table with `events_fetched`, `facts_extracted`, `blocks_flagged` counts)

**Dependencies:** All prior phases. Auth requires Supabase RLS policies beyond service role (add authenticated user policies for dashboard access).

---

## Phase 6: Source Expansion (Week 5--6)

Broaden the knowledge intake beyond Anthropic's ecosystem.

- [ ] OpenAI changelog monitor (platform.openai.com/docs/changelog)
- [ ] GitHub release monitor:
  - `anthropics/claude-code`
  - `openai/openai-python`
  - `vercel/ai` (AI SDK)
  - `langchain-ai/langchainjs`
- [ ] arXiv monitor (`cs.AI`, `cs.CL` categories filtered by course-relevant keywords: agent, tool use, RAG, function calling, etc.)
- [ ] Dev signal aggregator (Hacker News front page, curated RSS feeds from AI-focused blogs)
- [ ] Pricing/model card scraper (detect pricing changes, new model releases, context window updates)

**Dependencies:** Each new source needs a curated URL list (ADR-006). Content hash dedup (ADR-004) ensures no duplicate events across sources.

---

## Phase 7: Intelligence Layer (Week 7--8)

Move from reactive fact tracking to proactive course improvement.

- [ ] Semantic similarity search for fact dedup using pgvector embeddings (`knowledge_facts.embedding` column, 1536 dimensions)
- [ ] Cross-reference graph: which facts relate to which, conflict detection (e.g., two sources report different context window sizes)
- [ ] Trend detection: "3+ sources mentioned topic X this week" surfaced in daily briefing
- [ ] Auto-suggest new course sections based on emerging topics with no existing content block coverage
- [ ] Course health score: % blocks current, average fact age, coverage gaps by category

**Dependencies:** Sufficient fact volume from Phase 6 sources. pgvector index performance may need tuning at scale (`ivfflat` or `hnsw` index selection).

---

## Phase 8: Production Hardening (Week 8--10)

Reliability, cost control, and operational confidence for unattended operation.

- [ ] Error alerting (PagerDuty or email on pipeline failures, based on `pipeline_runs.status = 'failed'`)
- [ ] Cost budgets and alerts (daily/monthly LLM spend caps, tracked through the typed LLM wrapper's cost tracking)
- [ ] Rate limiting and backpressure for source monitors (respect `robots.txt`, add jitter between fetches)
- [ ] Audit log for all regeneration decisions (who approved, when, what changed)
- [ ] Backup and restore for course content (`content_blocks` versioning beyond the `version` integer)
- [ ] Load testing with realistic data volumes (target: 500+ facts, 100+ content blocks, 50+ proposals)

**Dependencies:** All prior phases stable. Cost tracking from ADR-003 must be accurate before setting budget alerts.

---

## Future Possibilities

These are not scheduled but represent natural extensions of the system.

- **Student-facing course platform** -- serve the living course content directly to learners, with content freshness indicators
- **A/B testing regenerated content** -- compare student engagement between original and regenerated blocks
- **Community contribution pipeline** -- students submit PRs against course content, evaluated by the same quality-check agents
- **Multi-course support** -- same engine powering different knowledge domains (e.g., a DevOps course, a frontend course) with isolated fact graphs
- **Real-time streaming updates** -- WebSocket-based dashboard showing pipeline activity as it happens, replacing polling

---

## Key Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| Fact freshness | < 24h from source publication to fact extraction | `source_events.published_at` vs `knowledge_facts.created_at` |
| Content currency | > 90% of blocks in `current` status | `content_blocks.status` distribution |
| Regeneration accuracy | > 95% of applied patches require no manual correction | Post-apply review rate |
| Pipeline reliability | > 99% of scheduled runs complete successfully | `pipeline_runs.status` over rolling 30 days |
| LLM cost per run | < $0.50 average for daily pipeline | Typed LLM wrapper cost tracking |
