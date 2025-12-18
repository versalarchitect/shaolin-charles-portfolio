import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import {
  ArrowLeft,
  Calendar,
  Clock,
  ArrowRight,
  Share2,
  BookOpen,
  Copy,
  Check,
  List,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  BlurFadeIn,
  ScrollFadeIn,
  Magnetic,
  RevealOnScroll,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

// Reading Progress Bar Component
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-foreground/5">
      <motion.div
        className="h-full bg-foreground/40"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  )
}

// Code Block Component with Copy Button
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative group my-8">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {language && (
          <span className="text-xs font-mono text-foreground/40 px-2 py-1 bg-foreground/5 rounded">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-foreground/5 hover:bg-foreground/10 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy className="h-4 w-4 text-foreground/60" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      <pre className="bg-foreground/[0.03] border border-foreground/10 rounded-xl p-5 pt-12 overflow-x-auto">
        <code className="text-sm font-mono text-foreground/80 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  )
}

// Table of Contents Component
function TableOfContents({
  headings,
  activeId,
}: {
  headings: { id: string; text: string; level: number }[]
  activeId: string | null
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (headings.length === 0) return null

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/10 hover:bg-foreground/15 transition-colors"
          aria-label="Toggle table of contents"
        >
          <List className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="lg:hidden fixed bottom-20 right-6 z-40 w-64 p-4 bg-background/95 backdrop-blur-sm border border-foreground/10 rounded-xl shadow-xl"
          >
            <h4 className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-3">
              Contents
            </h4>
            <nav className="space-y-1">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={() => setIsExpanded(false)}
                  className={`block text-sm py-1.5 transition-colors ${
                    heading.level === 3 ? 'pl-4' : ''
                  } ${
                    activeId === heading.id
                      ? 'text-foreground font-medium'
                      : 'text-foreground/50 hover:text-foreground/80'
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-1/2 -translate-y-1/2 right-8 xl:right-12 w-56 z-40">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-foreground/[0.02] border border-foreground/5 rounded-xl"
        >
          <h4 className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-3">
            Contents
          </h4>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`block text-sm py-1.5 transition-all duration-200 ${
                  heading.level === 3 ? 'pl-3 text-xs' : ''
                } ${
                  activeId === heading.id
                    ? 'text-foreground font-medium translate-x-1'
                    : 'text-foreground/40 hover:text-foreground/70'
                }`}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </motion.div>
      </div>
    </>
  )
}

// Back to Top Button
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/10 hover:bg-foreground/15 transition-colors"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Blog post type
interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTime: number
  publishedAt: string
  featured?: boolean
}

// Sample blog posts data (same as in Blog.tsx - in production, this would come from a CMS/API)
const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'building-predictive-architecture',
    title: 'Building Predictive: Architecture Decisions That Scale',
    excerpt:
      'A deep dive into the architectural decisions behind Predictive, including how we handle 17 interconnected life domains, 230+ user profile fields, and real-time Monte Carlo simulations.',
    content: `
## The Challenge

When I started building Predictive, I knew the architecture decisions made early would determine whether the platform could scale to handle complex, interconnected predictions across multiple life domains.

The core challenge: how do you model relationships between 17 different life domains (career, finance, health, relationships, etc.) while maintaining sub-200ms response times and supporting 230+ user profile fields?

## Domain Modeling with Ontologies

The first major decision was to use an ontology-based architecture. Instead of flat relational tables, we built a hierarchical domain tree with weighted edges representing relationships between concepts.

\`\`\`typescript
interface DomainNode {
  id: string;
  name: string;
  parent_id: string | null;
  domain: LifeDomain;
  weight: number;
  metadata: Record<string, unknown>;
}
\`\`\`

This allows us to:
- Model inheritance patterns (e.g., "job satisfaction" inherits from "career")
- Calculate impact propagation across domains
- Support recursive queries with PostgreSQL CTEs

## Performance at Scale

Achieving sub-200ms P95 latency required several strategies:

### 1. Strategic Denormalization
We denormalize frequently-accessed data into materialized views, refreshed on a schedule. This trades storage for read performance.

### 2. React Query Caching
Client-side caching with React Query reduces redundant API calls and provides optimistic updates for better UX.

### 3. Code Splitting
The initial bundle is just 47KB. Heavy features like 3D visualizations are lazy-loaded only when needed.

## Type Safety End-to-End

One of my core principles is type safety from database to UI. We achieve this through:

- Generated TypeScript types from the PostgreSQL schema
- Zod validation at API boundaries
- Strict TypeScript configuration

\`\`\`typescript
// Types are generated, not manually maintained
import type { Database } from '@/types/database';
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
\`\`\`

## Lessons Learned

1. **Invest in data modeling early** - The ontology structure has proven flexible enough to handle new domains without schema changes.

2. **Measure everything** - We track P95 latencies, cache hit rates, and bundle sizes in CI.

3. **Type safety pays dividends** - The upfront investment in strict typing has prevented countless runtime errors.

## What's Next

We're currently working on:
- Real-time collaborative predictions
- Enhanced Monte Carlo visualization
- Mobile-native experience

Stay tuned for more deep dives into specific components of the Predictive architecture.
    `,
    category: 'Architecture',
    tags: ['React', 'TypeScript', 'Supabase', 'Performance'],
    readTime: 12,
    publishedAt: '2024-12-15',
    featured: true,
  },
  {
    id: '2',
    slug: 'nx-monorepo-at-scale',
    title: 'Nx Monorepo at Scale: Lessons from Building a Prediction Platform',
    excerpt:
      'How we structured our Nx monorepo to support multiple applications, shared libraries, and incremental builds that cut CI time by 60%.',
    content: `
## Why Monorepo?

When building Predictive, I evaluated several repository strategies. The monorepo approach with Nx won for several reasons:

1. **Shared code without package publishing** - UI components, utilities, and types are shared instantly
2. **Atomic changes** - A single PR can update the API, types, and UI together
3. **Consistent tooling** - Same linting, testing, and build configuration everywhere

## Project Structure

Our monorepo houses multiple applications and shared libraries:

\`\`\`
predictive/
├── apps/
│   ├── web/           # Main React application
│   ├── monte-carlo-api/  # Python prediction engine
│   └── mobile/        # React Native app
├── libs/
│   ├── ui/            # Shared React components
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Common utilities
└── tools/             # Custom generators and executors
\`\`\`

## Incremental Builds

The key to fast CI with Nx is understanding the project graph. Nx only rebuilds what's affected by your changes.

\`\`\`bash
# Only test affected projects
nx affected --target=test

# Build only what changed
nx affected --target=build
\`\`\`

This cut our CI time from 15 minutes to under 6 minutes - a 60% improvement.

## Computation Caching

Nx caches task outputs both locally and in CI. When you run a task that's already been computed with the same inputs, Nx replays the cached output instantly.

We use Nx Cloud for distributed caching, so cached builds are shared across the team and CI.

## Library Boundaries

One challenge with monorepos is preventing spaghetti dependencies. We use Nx's module boundary rules:

\`\`\`json
{
  "@nx/enforce-module-boundaries": [
    "error",
    {
      "depConstraints": [
        { "sourceTag": "scope:web", "onlyDependOnLibsWithTags": ["scope:shared"] },
        { "sourceTag": "scope:api", "onlyDependOnLibsWithTags": ["scope:shared"] }
      ]
    }
  ]
}
\`\`\`

## Lessons Learned

1. **Start with clear boundaries** - Define library scopes early
2. **Invest in custom generators** - Automating boilerplate saves time
3. **Cache everything** - Nx Cloud pays for itself in CI minutes saved

The monorepo approach has been transformative for development velocity while maintaining code quality.
    `,
    category: 'DevOps',
    tags: ['Nx', 'Monorepo', 'CI/CD', 'TypeScript'],
    readTime: 8,
    publishedAt: '2024-12-10',
  },
  {
    id: '3',
    slug: 'monte-carlo-simulations-web',
    title: 'Monte Carlo Simulations in the Browser: A Practical Guide',
    excerpt:
      'Implementing high-performance Monte Carlo simulations with Web Workers, shared memory, and efficient data structures for real-time predictions.',
    content: `
## What is Monte Carlo Simulation?

Monte Carlo simulation is a computational technique that uses random sampling to obtain numerical results. For Predictive, we use it to model uncertainty in life decisions.

Instead of giving users a single "you have a 73% chance of success," we show them the full distribution of possible outcomes.

## The Architecture

Our Monte Carlo engine runs in Python (FastAPI) but can also execute in the browser for simpler simulations using Web Workers.

\`\`\`python
def run_simulation(
    factors: dict[str, float],
    iterations: int = 10000
) -> SimulationResult:
    results = []
    for _ in range(iterations):
        outcome = simulate_single_run(factors)
        results.append(outcome)

    return SimulationResult(
        mean=np.mean(results),
        std=np.std(results),
        percentiles=calculate_percentiles(results)
    )
\`\`\`

## Bayesian Inference

The real power comes from combining Monte Carlo with Bayesian inference. We use likelihood ratios to update predictions based on user-provided evidence:

\`\`\`python
def calculate_likelihood_ratio(feature_value: float) -> float:
    # Features normalized to [0, 1]
    # Values > 0.5 provide positive evidence
    # Values < 0.5 provide negative evidence
    return feature_value / (1 - feature_value + 1e-10)
\`\`\`

## Historical Validation

We validated our model against historical outcomes:

| Test Case | Prediction | Actual | Correct? |
|-----------|------------|--------|----------|
| Blockbuster (2007) | 4% | Failed | ✅ |
| iPhone (2007) | 73% | Succeeded | ✅ |
| Theranos (2015) | 3% | Failed | ✅ |
| SpaceX (2015) | 69% | Succeeded | ✅ |

## Browser-Based Execution

For lightweight simulations, we run directly in the browser using Web Workers:

\`\`\`typescript
const worker = new Worker('./simulation-worker.ts');

worker.postMessage({
  type: 'RUN_SIMULATION',
  factors: userFactors,
  iterations: 5000
});

worker.onmessage = (e) => {
  if (e.data.type === 'RESULT') {
    updateUI(e.data.result);
  }
};
\`\`\`

This keeps the main thread responsive while crunching numbers.

## Performance Tips

1. **Use typed arrays** - Float64Array is much faster than regular arrays
2. **Batch updates** - Don't update the UI on every iteration
3. **Consider SharedArrayBuffer** - For parallel simulations across workers

Monte Carlo simulation brings statistical rigor to decision-making, and modern web technologies make it accessible in the browser.
    `,
    category: 'Engineering',
    tags: ['Algorithms', 'Performance', 'Python', 'Web Workers'],
    readTime: 15,
    publishedAt: '2024-12-05',
  },
  {
    id: '4',
    slug: 'supabase-row-level-security',
    title: 'Mastering Supabase Row Level Security for Multi-Tenant Apps',
    excerpt:
      'A comprehensive guide to implementing bulletproof RLS policies that scale. Real examples from a 230-field user profile system.',
    content: `
## Why Row Level Security?

Row Level Security (RLS) is PostgreSQL's built-in mechanism for controlling which rows users can access. With Supabase, RLS is your primary security layer.

Without RLS, any authenticated user could potentially access any data. With RLS, you define policies that automatically filter data based on the current user.

## Basic Patterns

### User-Owned Data

The most common pattern - users can only access their own data:

\`\`\`sql
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);
\`\`\`

### Team-Based Access

For multi-tenant apps, you often need team-based access:

\`\`\`sql
CREATE POLICY "Team members can view team data"
ON team_data FOR SELECT
USING (
  team_id IN (
    SELECT team_id FROM team_members
    WHERE user_id = auth.uid()
  )
);
\`\`\`

## Performance Considerations

RLS policies run on every query. Poorly designed policies can kill performance.

### Use Indexes

Ensure columns used in RLS policies are indexed:

\`\`\`sql
CREATE INDEX idx_team_members_user_id
ON team_members(user_id);
\`\`\`

### Avoid Expensive Subqueries

Instead of subqueries, consider using security definer functions:

\`\`\`sql
CREATE FUNCTION get_user_team_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id FROM team_members
  WHERE user_id = auth.uid()
$$;

CREATE POLICY "Team access"
ON team_data FOR SELECT
USING (team_id IN (SELECT get_user_team_ids()));
\`\`\`

## Real-World Example: 230-Field User Profiles

In Predictive, user profiles have 230+ fields. Here's how we handle RLS:

\`\`\`sql
-- Users can only see their own profile
CREATE POLICY "user_profiles_select"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "user_profiles_update"
ON user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- New users can create their profile
CREATE POLICY "user_profiles_insert"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);
\`\`\`

## Testing RLS Policies

Always test your policies! Supabase makes this easy:

\`\`\`sql
-- Test as a specific user
SET request.jwt.claim.sub = 'user-uuid-here';

-- Try to access data
SELECT * FROM user_profiles;

-- Should only return the user's own profile
\`\`\`

## Common Pitfalls

1. **Forgetting INSERT policies** - Users need to be able to create their own data
2. **Missing WITH CHECK** - UPDATE/INSERT need both USING and WITH CHECK
3. **Not enabling RLS** - Run \`ALTER TABLE ... ENABLE ROW LEVEL SECURITY\`

RLS is powerful but requires careful design. Start simple and test thoroughly.
    `,
    category: 'Security',
    tags: ['Supabase', 'PostgreSQL', 'Security', 'Database'],
    readTime: 10,
    publishedAt: '2024-11-28',
  },
  {
    id: '5',
    slug: 'webgpu-rendering-3d-worlds',
    title: 'WebGPU-First Rendering: Building Browser-Based 3D Worlds',
    excerpt:
      'How we achieved 60fps with 10M+ particles using WebGPU compute shaders, GPU-based terrain generation, and optimized render pipelines.',
    content: `
## The WebGPU Revolution

WebGPU is the next generation graphics API for the web. Unlike WebGL, it provides:

- Modern GPU architecture access
- Compute shaders for general-purpose GPU programming
- Better performance through reduced driver overhead

For World (my browser-based metaverse project), WebGPU was essential.

## GPU Compute for Particles

Rendering 10 million particles at 60fps sounds impossible. With WebGPU compute shaders, it's achievable.

\`\`\`wgsl
@compute @workgroup_size(256)
fn updateParticles(@builtin(global_invocation_id) id: vec3<u32>) {
    let index = id.x;
    if (index >= arrayLength(&particles)) {
        return;
    }

    var p = particles[index];

    // Apply physics
    p.velocity += gravity * deltaTime;
    p.position += p.velocity * deltaTime;

    // Collision detection
    if (p.position.y < 0.0) {
        p.position.y = 0.0;
        p.velocity.y *= -0.5; // Bounce
    }

    particles[index] = p;
}
\`\`\`

The key insight: particles are updated entirely on the GPU. The CPU just dispatches the compute shader and renders the results.

## Terrain Generation with Marching Cubes

For procedural terrain, we use the marching cubes algorithm - also running on the GPU:

1. Generate a 3D density field (noise functions)
2. For each cube in the grid, determine which edges intersect the isosurface
3. Generate triangles based on a lookup table

All 3 steps run in compute shaders, producing mesh data directly in GPU memory.

## Render Pipeline Optimization

WebGPU's explicit resource management allows fine-grained optimization:

\`\`\`typescript
// Create bind group layouts upfront
const bindGroupLayout = device.createBindGroupLayout({
  entries: [
    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
    { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
    { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {} }
  ]
});

// Reuse bind groups across frames
const bindGroup = device.createBindGroup({
  layout: bindGroupLayout,
  entries: [...]
});
\`\`\`

## Apple Silicon Optimization

WebGPU on Apple Silicon (via Metal) is exceptionally fast. We optimize for it:

- Use tile-based rendering hints
- Minimize render pass switches
- Leverage unified memory architecture

On M4 Max, World renders at consistent 60fps with all effects enabled.

## Results

| Metric | WebGL | WebGPU |
|--------|-------|--------|
| Particles | 100K | 10M+ |
| Terrain chunks | 16 | 256 |
| Frame time | 16ms | 8ms |

WebGPU is the future of graphics on the web. Start learning it today.
    `,
    category: 'Graphics',
    tags: ['WebGPU', 'Three.js', '3D', 'Performance'],
    readTime: 18,
    publishedAt: '2024-11-20',
  },
  {
    id: '6',
    slug: 'react-query-patterns',
    title: 'Advanced React Query Patterns for Real-Time Applications',
    excerpt:
      'Optimistic updates, infinite queries, and cache management strategies that power Predictive\'s real-time analytics dashboard.',
    content: `
## Why React Query?

React Query (TanStack Query) transforms how we think about server state. Instead of manually managing loading states, caching, and refetching, React Query handles it all.

For Predictive's real-time dashboard, React Query is essential.

## Basic Setup

\`\`\`typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});
\`\`\`

## Optimistic Updates

For the best UX, update the UI immediately before the server responds:

\`\`\`typescript
const updateProfile = useMutation({
  mutationFn: (updates) => api.updateProfile(updates),
  onMutate: async (updates) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['profile'] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['profile']);

    // Optimistically update
    queryClient.setQueryData(['profile'], (old) => ({
      ...old,
      ...updates,
    }));

    return { previous };
  },
  onError: (err, updates, context) => {
    // Rollback on error
    queryClient.setQueryData(['profile'], context.previous);
  },
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
});
\`\`\`

## Infinite Queries for Feeds

For paginated data like prediction history:

\`\`\`typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['predictions'],
  queryFn: ({ pageParam = 0 }) =>
    api.getPredictions({ offset: pageParam, limit: 20 }),
  getNextPageParam: (lastPage, pages) =>
    lastPage.hasMore ? pages.length * 20 : undefined,
});
\`\`\`

## Real-Time Updates with Subscriptions

Combine React Query with Supabase real-time:

\`\`\`typescript
useEffect(() => {
  const subscription = supabase
    .channel('predictions')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'predictions' },
      (payload) => {
        queryClient.invalidateQueries({ queryKey: ['predictions'] });
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, [queryClient]);
\`\`\`

## Prefetching for Performance

Prefetch data before the user needs it:

\`\`\`typescript
// On hover, prefetch the next page
const prefetchNextPage = () => {
  queryClient.prefetchQuery({
    queryKey: ['prediction', nextId],
    queryFn: () => api.getPrediction(nextId),
  });
};
\`\`\`

## Cache Persistence

For offline support, persist the cache:

\`\`\`typescript
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});
\`\`\`

React Query has transformed our data fetching patterns. The combination of caching, optimistic updates, and real-time sync creates a responsive, reliable experience.
    `,
    category: 'Frontend',
    tags: ['React', 'React Query', 'Caching', 'Performance'],
    readTime: 9,
    publishedAt: '2024-11-15',
  },
]

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Generate slug from heading text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Extract headings from content
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = []
  const lines = content.trim().split('\n')

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      const text = line.slice(3)
      headings.push({ id: slugify(text), text, level: 2 })
    } else if (line.startsWith('### ')) {
      const text = line.slice(4)
      headings.push({ id: slugify(text), text, level: 3 })
    }
  })

  return headings
}

// Parse and render inline formatting (code, bold, links)
function renderInlineFormatting(text: string): string {
  // Handle inline code
  let result = text.replace(
    /`([^`]+)`/g,
    '<code class="bg-foreground/10 px-1.5 py-0.5 rounded text-sm font-mono text-foreground/90">$1</code>'
  )

  // Handle bold
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')

  // Handle links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  return result
}

// Improved markdown renderer with proper table grouping and CodeBlock component
function useRenderedContent(content: string) {
  return useMemo(() => {
    const lines = content.trim().split('\n')
    const elements: React.ReactElement[] = []
    let inCodeBlock = false
    let codeContent: string[] = []
    let codeLanguage = ''
    let tableRows: { cells: string[]; isHeader: boolean }[] = []
    let inTable = false
    let elementKey = 0

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headerRow = tableRows.find((r) => r.isHeader)
        const bodyRows = tableRows.filter((r) => !r.isHeader)

        elements.push(
          <div key={`table-${elementKey++}`} className="overflow-x-auto my-8">
            <table className="w-full border-collapse text-sm">
              {headerRow && (
                <thead>
                  <tr className="border-b border-foreground/20">
                    {headerRow.cells.map((cell, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left font-semibold text-foreground"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
                  >
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-3 text-muted-foreground ${
                          cell.includes('✅') ? 'text-green-500' : ''
                        } ${cell.includes('⚠️') ? 'text-yellow-500' : ''}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableRows = []
      }
      inTable = false
    }

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.startsWith('```')) {
        if (inTable) flushTable()

        if (inCodeBlock) {
          elements.push(
            <CodeBlock
              key={`code-${elementKey++}`}
              code={codeContent.join('\n')}
              language={codeLanguage}
            />
          )
          codeContent = []
          inCodeBlock = false
          codeLanguage = ''
        } else {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim()
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      // Tables
      if (line.startsWith('|')) {
        // Skip separator lines but mark previous row as header
        if (line.includes('---')) {
          if (tableRows.length > 0) {
            tableRows[tableRows.length - 1].isHeader = true
          }
          inTable = true
          return
        }

        const cells = line
          .split('|')
          .filter((c) => c.trim())
          .map((c) => c.trim())

        tableRows.push({ cells, isHeader: false })
        inTable = true
        return
      }

      // Flush table if we're leaving table context
      if (inTable && !line.startsWith('|')) {
        flushTable()
      }

      // Headers with IDs for ToC navigation
      if (line.startsWith('## ')) {
        const text = line.slice(3)
        const id = slugify(text)
        elements.push(
          <h2
            key={`h2-${elementKey++}`}
            id={id}
            className="text-2xl font-bold mt-16 mb-6 text-foreground scroll-mt-24"
          >
            {text}
          </h2>
        )
        return
      }

      if (line.startsWith('### ')) {
        const text = line.slice(4)
        const id = slugify(text)
        elements.push(
          <h3
            key={`h3-${elementKey++}`}
            id={id}
            className="text-xl font-semibold mt-10 mb-4 text-foreground/90 scroll-mt-24"
          >
            {text}
          </h3>
        )
        return
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${elementKey++}`}
            className="border-l-2 border-foreground/20 pl-6 my-6 italic text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: renderInlineFormatting(line.slice(2)) }}
          />
        )
        return
      }

      // Unordered lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li
            key={`li-${elementKey++}`}
            className="ml-6 mb-2 text-muted-foreground/90 list-disc leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderInlineFormatting(line.slice(2)) }}
          />
        )
        return
      }

      // Ordered lists
      if (line.match(/^\d+\. /)) {
        elements.push(
          <li
            key={`oli-${elementKey++}`}
            className="ml-6 mb-2 text-muted-foreground/90 list-decimal leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: renderInlineFormatting(line.replace(/^\d+\. /, '')),
            }}
          />
        )
        return
      }

      // Empty lines
      if (line.trim() === '') {
        return
      }

      // Regular paragraphs
      elements.push(
        <p
          key={`p-${elementKey++}`}
          className="text-muted-foreground/90 leading-[1.8] mb-6 text-[17px]"
          dangerouslySetInnerHTML={{ __html: renderInlineFormatting(line) }}
        />
      )
    })

    // Flush any remaining table
    if (inTable) flushTable()

    return elements
  }, [content])
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)

  // Find the post
  const post = blogPosts.find((p) => p.slug === slug)
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug)
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null

  // Extract headings for table of contents
  const headings = useMemo(() => {
    if (!post?.content) return []
    return extractHeadings(post.content)
  }, [post?.content])

  // Render content using the hook
  const renderedContent = useRenderedContent(post?.content || '')

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  // Handle share
  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // 404 for unknown posts
  if (!post) {
    return (
      <Section id="not-found" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </Section>
    )
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        image="/og-blog.png"
        imageAlt={`${post.title} - Article by Charles Jackson`}
        keywords={post.tags.join(', ') + ', charles jackson, software engineering'}
        article={{
          publishedTime: post.publishedAt,
          author: 'Charles Jackson',
          section: post.category,
          tags: post.tags,
        }}
      />

      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Table of Contents */}
      <TableOfContents headings={headings} activeId={activeHeadingId} />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Hero Section */}
      <Section id="post-hero" className="relative pt-32 pb-16 overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Back button */}
            <BlurFadeIn delay={0}>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </BlurFadeIn>

            {/* Category & Meta */}
            <BlurFadeIn delay={0.1}>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-xs font-mono bg-foreground text-background px-3 py-1 rounded">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min read
                </span>
              </div>
            </BlurFadeIn>

            {/* Title */}
            <BlurFadeIn delay={0.2}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {post.title}
              </h1>
            </BlurFadeIn>

            {/* Excerpt */}
            <BlurFadeIn delay={0.3}>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {post.excerpt}
              </p>
            </BlurFadeIn>

            {/* Tags */}
            <BlurFadeIn delay={0.4}>
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
                    className="text-xs font-mono bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10 hover:border-foreground/20 transition-colors cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </BlurFadeIn>

            {/* Share button */}
            <BlurFadeIn delay={0.5}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-mono"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Content Section */}
      <Section id="post-content" className="py-12 lg:py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 lg:pr-72 relative z-10">
          <RevealOnScroll direction="up">
            <article className="max-w-3xl mx-auto">
              {renderedContent}
            </article>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Author Section */}
      <Section id="post-author" className="py-12 relative overflow-hidden">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-6 p-6 bg-foreground/5 border border-foreground/10 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-foreground/60" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Charles Jackson</h3>
                  <p className="text-muted-foreground text-sm">
                    Full-stack developer with 20+ years of experience. Currently building
                    Predictive.
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>

      {/* Navigation Section */}
      <Section id="post-nav" className="py-16 lg:py-24 relative overflow-hidden">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn>
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-10">
                <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider">
                  Continue Reading
                </span>
              </div>

              {/* Navigation Cards */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {/* Previous Post */}
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.slug}`}
                    className="group relative p-6 md:p-8 bg-foreground/[0.02] border border-foreground/10 rounded-2xl hover:bg-foreground/[0.04] hover:border-foreground/20 transition-all duration-300"
                  >
                    {/* Arrow indicator */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-background border border-foreground/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-left-4 transition-all duration-300">
                      <ArrowLeft className="h-3 w-3 text-foreground/60" />
                    </div>

                    <div className="flex flex-col h-full">
                      <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-3">
                        Previous
                      </span>
                      <h4 className="font-semibold text-lg leading-snug mb-3 group-hover:text-foreground transition-colors line-clamp-2">
                        {prevPost.title}
                      </h4>
                      <div className="mt-auto flex items-center gap-3 text-xs text-foreground/40">
                        <span className="px-2 py-0.5 bg-foreground/5 rounded">
                          {prevPost.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {prevPost.readTime}m
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="hidden md:block" />
                )}

                {/* Next Post */}
                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="group relative p-6 md:p-8 bg-foreground/[0.02] border border-foreground/10 rounded-2xl hover:bg-foreground/[0.04] hover:border-foreground/20 transition-all duration-300 text-right"
                  >
                    {/* Arrow indicator */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-background border border-foreground/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-right-4 transition-all duration-300">
                      <ArrowRight className="h-3 w-3 text-foreground/60" />
                    </div>

                    <div className="flex flex-col h-full">
                      <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider mb-3">
                        Next
                      </span>
                      <h4 className="font-semibold text-lg leading-snug mb-3 group-hover:text-foreground transition-colors line-clamp-2">
                        {nextPost.title}
                      </h4>
                      <div className="mt-auto flex items-center justify-end gap-3 text-xs text-foreground/40">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {nextPost.readTime}m
                        </span>
                        <span className="px-2 py-0.5 bg-foreground/5 rounded">
                          {nextPost.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-10">
                <div className="flex-1 h-px bg-foreground/10" />
                <span className="text-foreground/20">•</span>
                <div className="flex-1 h-px bg-foreground/10" />
              </div>

              {/* Back to Blog */}
              <div className="text-center">
                <Magnetic strength={0.15}>
                  <Button variant="outline" className="font-mono gap-2" asChild>
                    <Link to="/blog">
                      <ArrowLeft className="h-4 w-4" />
                      All Articles
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
