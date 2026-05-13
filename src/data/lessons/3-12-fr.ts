import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-12',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Garder cinq agents IA sur la même longueur d\'onde',
      body: "Tu as cinq agents qui construisent différentes parties du même produit. Chacun doit comprendre la vision globale, les décisions d'architecture, les conventions de code, et comment sa pièce s'articule avec les autres. Mais les fenêtres de contexte sont limitées, et tout balancer dans le prompt de chaque agent est gaspilleur et confus. L'art, c'est de savoir quel contexte va où — et de le garder synchronisé à mesure que la base de code évolue pendant le travail en parallèle.",
    },
    {
      type: 'info',
      title: 'Les trois modes d\'échec d\'une mauvaise gestion du contexte',
      body: "Sans stratégie de contexte délibérée, tu obtiens : (1) Incohérence — les agents prennent des décisions contradictoires parce qu'ils partent d'hypothèses différentes. (2) Duplication — les agents construisent la même fonction utilitaire parce qu'ils ne savent pas qu'elle existe déjà. (3) Dérive — le contexte qui était vrai au démarrage des agents devient périmé quand d'autres agents modifient la base de code. Les trois sont résolubles avec de l'architecture.",
    },

    // === DIAGRAM 1: Context Architecture ===
    {
      type: 'interactive-diagram',
      title: 'Architecture de contexte en couches',
      body: "Le contexte n'est pas un document plat — il est structuré en couches. Clique pour voir comment chaque couche alimente les spécifications par agent.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'global', label: 'CLAUDE.md', sublabel: 'Conventions globales', shape: 'rounded', highlight: true },
          { id: 'contracts', label: 'Contrats d\'interface', sublabel: 'Frontières typées', shape: 'rect', highlight: true },
          { id: 'spec-auth', label: 'Spéc : Auth', sublabel: 'Agent 1 seulement', shape: 'rect' },
          { id: 'spec-api', label: 'Spéc : API', sublabel: 'Agent 2 seulement', shape: 'rect' },
          { id: 'spec-ui', label: 'Spéc : UI', sublabel: 'Agent 3 seulement', shape: 'rect' },
          { id: 'spec-pay', label: 'Spéc : Paiements', sublabel: 'Agent 4 seulement', shape: 'rect' },
        ],
        edges: [
          { from: 'global', to: 'spec-auth', dashed: true },
          { from: 'global', to: 'spec-api', dashed: true },
          { from: 'global', to: 'spec-ui', dashed: true },
          { from: 'global', to: 'spec-pay', dashed: true },
          { from: 'contracts', to: 'spec-auth' },
          { from: 'contracts', to: 'spec-api' },
          { from: 'contracts', to: 'spec-ui' },
          { from: 'contracts', to: 'spec-pay' },
        ],
      },
      stages: [
        {
          highlightNodes: ['global'],
          highlightEdges: [],
          explanation: 'CLAUDE.md est la couche globale. Il contient les règles universelles que chaque agent doit suivre : style de code, conventions de nommage, patrons de gestion d\'erreurs. Pense-le comme le guide de l\'équipe d\'ingénierie.',
        },
        {
          highlightNodes: ['global', 'contracts'],
          highlightEdges: [],
          explanation: 'Les contrats d\'interface définissent les formes exactes de données circulant entre modules. Ils sont écrits par l\'orchestrateur et sont en lecture seule pour tous les agents. Ça prévient les incompatibilités inter-agents.',
        },
        {
          highlightNodes: ['global', 'contracts', 'spec-auth', 'spec-api', 'spec-ui', 'spec-pay'],
          highlightEdges: [{ from: 'global', to: 'spec-auth' }, { from: 'global', to: 'spec-api' }, { from: 'global', to: 'spec-ui' }, { from: 'global', to: 'spec-pay' }, { from: 'contracts', to: 'spec-auth' }, { from: 'contracts', to: 'spec-api' }, { from: 'contracts', to: 'spec-ui' }, { from: 'contracts', to: 'spec-pay' }],
          explanation: 'Chaque agent lit la couche globale + les contrats + sa propre spécification de module. L\'agent de paiements ne lit jamais la spécification d\'auth. Ni plus, ni moins. Ce contexte ciblé réduit le gaspillage de tokens et la confusion.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Le contexte est structuré en couches : global, contrats, spécifications par module.',
    },

    // === FLAT VS LAYERED COMPARE ===
    {
      type: 'compare',
      title: 'CLAUDE.md plat vs architecture en couches',
      body: 'Au fur et à mesure que ta flotte grandit, un seul CLAUDE.md devient un goulot d\'étranglement. Le contexte en couches résout ce problème.',
      question: 'Quelle approche passe à l\'échelle pour 5+ agents travaillant sur différents modules ?',
      correctSide: 'right',
      left: {
        label: 'Plat (un seul fichier)',
        content: '# CLAUDE.md (racine)\n\n## Toutes les conventions\n- Auth: use bcrypt...\n- Payments: use Stripe...\n- API: use REST...\n- UI: use Tailwind...\n- Tests: use Vitest...\n\n(500+ lines, every agent reads all)',
        language: 'markdown',
      },
      right: {
        label: 'En couches (racine + modules)',
        content: '# CLAUDE.md (root — shared rules)\n- TypeScript strict, camelCase\n- Error handling: throw AppError\n\n# payments/CLAUDE.md\n- Use Stripe SDK, webhook patterns\n- Idempotent fulfillment required\n\n# auth/CLAUDE.md  \n- Supabase Auth, RLS policies\n- Session: httpOnly cookies',
        language: 'markdown',
      },
      explanation: 'Le contexte en couches signifie que chaque agent lit les règles racine (partagées) plus seulement les règles de son module (spécifiques). L\'agent de paiements ne lit jamais les conventions d\'auth. Ça économise des tokens et réduit la confusion.',
    },

    // === WHAT GOES WHERE ===
    {
      type: 'multiple-choice',
      question: 'Quel type de contenu appartient à CLAUDE.md (la couche de contexte global) ?',
      options: [
        'La logique métier spécifique aux fonctionnalités et les définitions d\'endpoints',
        'Les règles universelles : style de code, conventions de nommage, gestion d\'erreurs, patrons interdits',
        'Les contrats d\'interface et les formes de données entre modules',
        'Les assignations de tâches par agent et les frontières de propriété de fichiers',
      ],
      correctIndex: 1,
      explanation: "CLAUDE.md contient les décisions que CHAQUE agent doit respecter, peu importe ce qu'il construit. Style de code, conventions de nommage, structure de répertoires, patrons de tests, philosophie de gestion d'erreurs, et patrons interdits. Pense-le comme le guide de l'équipe d'ingénierie — des règles universelles qui créent de la cohérence dans tout le code produit par les agents.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce CLAUDE.md pour un projet multi-agents. Remplis les conventions qui assurent la cohérence entre tous les agents.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: `# Project: Team Dashboard

## Architecture
- Framework: Next.js 14 (App Router)
- Database: Prisma + PostgreSQL
- Auth: NextAuth.js with JWT sessions
- State: React Query for server state, Zustand for client state

## Conventions
- File naming: {{file_naming}}
- Exports: Named exports only (no default exports except pages)
- Error handling: All async functions return {{error_pattern}} pattern
- Testing: Colocated tests (component.test.tsx next to component.tsx)

## Patterns (ALL agents must follow)
- API responses: { data: T | null, error: string | null }
- Components: Loading skeleton → Error state → Empty state → Data state
- Database: {{db_write_rule}}
- Validation: Zod schemas for all input boundaries

## Forbidden
- No \`any\` types
- No default exports (except page.tsx and layout.tsx)
- No console.log in committed code
- No hardcoded URLs or secrets
- No modifying files outside your assigned directory`,
      blanks: [
        { id: 'file_naming', answer: 'kebab-case for files, PascalCase for components', alternatives: ['kebab-case for files, PascalCase for components', 'kebab-case files, PascalCase components'], placeholder: 'convention de nommage pour fichiers et composants', hint: 'Deux conventions : une pour les noms de fichiers (tirets), une pour les noms de composants (majuscules)' },
        { id: 'error_pattern', answer: 'Result<T, Error>', alternatives: ['Result<T, Error>', 'Result<T,Error>', 'Result type'], placeholder: 'type de retour pour les fonctions async', hint: 'Un type qui encapsule soit une valeur de succès T, soit une Error' },
        { id: 'db_write_rule', answer: 'Always use transactions for multi-table writes', alternatives: ['Always use transactions for multi-table writes', 'Use transactions for multi-table writes', 'transactions for multi-table writes'], placeholder: 'règle pour les écritures multi-tables', hint: 'Qu\'est-ce qui garantit l\'atomicité lors de l\'écriture dans plusieurs tables en même temps ?' },
      ],
      explanation: "Voici ce que chaque agent de la flotte lit. Remarque que ça porte sur COMMENT écrire du code, pas QUOI construire. Ça garantit que, peu importe quel agent écrit quelle fonctionnalité, le résultat a l'air d'avoir été écrit par une seule personne.",
    },
    {
      type: 'multiple-choice',
      question: 'Lequel de ces éléments appartient à CLAUDE.md vs une spécification par agent ?',
      options: [
        'CLAUDE.md : « Utiliser Zod pour la validation » | Spéc : « Valider email, mot de passe min 8 caractères »',
        'CLAUDE.md : « Construire le formulaire de connexion » | Spéc : « Utiliser React Query »',
        'CLAUDE.md : « Le flux d\'auth a 3 étapes » | Spéc : « Utiliser des fichiers en kebab-case »',
        'CLAUDE.md : « Les montants de paiement sont en centimes » | Spéc : « Toutes les erreurs retournent 500 »',
      ],
      correctIndex: 0,
      explanation: "CLAUDE.md contient les règles universelles (utiliser Zod pour TOUTE validation). La spécification contient les exigences précises (QUOI valider pour la tâche de cet agent en particulier). Le patron est : CLAUDE.md dit COMMENT, les spécifications disent QUOI.",
    },

    // === INTERFACE CONTRACTS ===
    {
      type: 'multiple-choice',
      question: 'Que se passe-t-il quand les agents construisent avec des hypothèses différentes sur les formes de données (sans contrats partagés) ?',
      options: [
        'Les agents négocient automatiquement un schéma partagé au runtime',
        'Les incompatibilités de types se révèlent à l\'intégration — l\'Agent A envoie { name } mais l\'Agent B attend { firstName, lastName }',
        'L\'orchestrateur détecte les incompatibilités pendant la surveillance',
        'TypeScript empêche automatiquement toutes les incompatibilités de types inter-agents',
      ],
      correctIndex: 1,
      explanation: "Les contrats d'interface sont la pièce la plus critique du contexte multi-agents. Ils définissent la forme exacte des données qui circulent entre les modules construits par différents agents. Sans eux, l'Agent A construit un objet utilisateur avec `{ name: string }` et l'Agent B s'attend à `{ firstName: string, lastName: string }` — et tu découvres l'incompatibilité au moment de l'intégration.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce fichier de contrats d\'interface. Remplis les définitions de types critiques qui préviennent les incompatibilités inter-agents.',
      language: 'typescript',
      filename: 'src/contracts/index.ts',
      template: `/**
 * INTERFACE CONTRACTS
 * Written by orchestrator. Read-only for all agents.
 * Defines every cross-module boundary.
 */

// === Auth → All Modules ===
export interface AuthUser {
  id: string
  email: string
  name: string
  role: {{auth_role_type}}
  avatarUrl: string | null
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  expiresAt: number
}

// === API → UI ===
export interface ApiResponse<T> {
  data: T | null
  error: {{error_shape}} | null
  meta?: { page: number; total: number }
}

// === Dashboard Stats (API produces, UI consumes) ===
export interface DashboardStats {
  totalProjects: number
  activeMembers: number
  velocityTrend: {{velocity_type}}
  completionRate: number   // 0-1
}`,
      blanks: [
        { id: 'auth_role_type', answer: "'admin' | 'member' | 'viewer'", alternatives: ["'admin' | 'member' | 'viewer'", '"admin" | "member" | "viewer"'], placeholder: 'type union pour les rôles', hint: 'Une union de littéraux de chaîne avec trois niveaux de rôle' },
        { id: 'error_shape', answer: '{ code: string; message: string }', alternatives: ['{ code: string; message: string }', '{code: string; message: string}'], placeholder: 'forme de l\'objet erreur', hint: 'Un objet avec un code et un message lisible, tous deux des chaînes' },
        { id: 'velocity_type', answer: 'number[]', alternatives: ['number[]', 'Array<number>'], placeholder: 'type pour les données de tendance', hint: 'Un tableau de nombres représentant les 7 derniers jours de vélocité' },
      ],
      explanation: "Ce fichier est écrit par TOI (l'orchestrateur) avant que tout agent ne commence. Chaque agent en fait l'import. AUCUN AGENT ne peut le modifier. Il définit chaque frontière entre modules — les formes de réponses API, les props des composants, les signatures de fonctions qui traversent les frontières de modules.",
    },
    {
      type: 'code-input',
      instruction: 'L\'agent UI doit afficher une carte de projet. L\'agent API doit produire les données. Écris l\'interface TypeScript pour un Project sur lequel les deux agents se baseront :',
      placeholder: 'export interface Project { ... }',
      answer: 'export interface Project { id: string; name: string; status: "active" | "completed" | "archived"; memberCount: number; updatedAt: string }',
      hint: 'Inclus id, name, status (avec union littérale), memberCount et updatedAt (chaîne ISO)',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu sais écrire des contrats d\'interface qui préviennent les incompatibilités entre agents.',
    },

    // === CODE-FILL: Module-specific CLAUDE.md ===
    {
      type: 'code-fill',
      instruction: 'Complète ce CLAUDE.md spécifique au module pour un agent de paiements. Remplis les patrons Stripe, la règle d\'idempotence et la gestion des webhooks.',
      language: 'markdown',
      filename: 'payments/CLAUDE.md',
      template: `# Payments Module Context

## SDK
- Use {{sdk_name}} for all payment operations
- Never store raw card numbers — use tokenized payment methods

## Idempotency
- Every charge/refund MUST include {{idempotency_rule}}
- Retries are safe because the key prevents duplicate charges

## Webhooks
- Verify webhook signatures using {{webhook_verify}}
- Process events idempotently (check if already handled before acting)
- Return 200 immediately, process async in background`,
      blanks: [
        { id: 'sdk_name', answer: 'Stripe SDK', alternatives: ['Stripe SDK', 'stripe', '@stripe/stripe-js', 'Stripe'], placeholder: 'quel SDK de paiement ?', hint: 'Le SDK de traitement de paiement dominant pour les applications web' },
        { id: 'idempotency_rule', answer: 'an idempotency key', alternatives: ['an idempotency key', 'idempotency key', 'Idempotency-Key header', 'a unique idempotency key', 'une clé d\'idempotence'], placeholder: 'qu\'est-ce qui empêche les doubles facturations ?', hint: 'Une clé unique envoyée avec chaque requête pour que les réessais ne créent pas de charges en double' },
        { id: 'webhook_verify', answer: 'stripe.webhooks.constructEvent', alternatives: ['stripe.webhooks.constructEvent', 'constructEvent', 'Stripe webhook signature verification', 'the webhook signing secret'], placeholder: 'comment vérifier l\'authenticité du webhook ?', hint: 'La méthode du SDK Stripe qui vérifie la signature du webhook' },
      ],
      explanation: 'Le contexte spécifique au module donne à l\'agent de paiements exactement ce dont il a besoin : choix du SDK, patrons d\'idempotence et gestion des webhooks. L\'agent d\'auth ne voit jamais ça — il a son propre contexte de module avec les patrons Supabase Auth.',
    },

    // === PER-MODULE SPECS ===
    {
      type: 'multiple-choice',
      question: 'Que doit contenir une spécification par module pour qu\'un agent puisse compléter sa tâche sans poser de questions ?',
      options: [
        'Juste les fichiers à créer — l\'agent peut déduire la logique depuis CLAUDE.md',
        'Les fichiers exacts à créer, les détails de la logique métier, les cas limites, et comment importer depuis les contrats',
        'Une copie du CLAUDE.md complet plus le fichier de contrats',
        'Seulement les contrats d\'interface pertinents pour ce module',
      ],
      correctIndex: 1,
      explanation: "Chaque agent reçoit un document de spécification propre à sa tâche. Ça inclut : les fichiers exacts à créer, les détails de la logique métier, les cas limites, et comment importer depuis le fichier de contrats. La spécification doit être autonome — un agent qui lit CLAUDE.md + contrats + sa spécification devrait avoir tout ce qu'il faut pour compléter la tâche sans poser de questions.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette spécification par module pour l\'agent API. Remplis les types de retour, les règles d\'auth et les patrons de base de données.',
      language: 'markdown',
      filename: 'specs/api-agent.md',
      template: `# API Agent Spec

## Scope
Build REST API endpoints in \`src/api/\`

## Endpoints

### GET /api/dashboard/stats
- Returns: {{stats_return_type}} (from contracts)
- Auth: Required (validate session token)
- Cache: 60 seconds (stale-while-revalidate)

### GET /api/activity?page=1&limit=20
- Returns: \`ApiResponse<ActivityItem[]>\` with meta.page, meta.total
- Auth: Required
- Filter: Only show activity from user's team
- Sort: Most recent first

### GET /api/team/members
- Returns: \`ApiResponse<TeamMember[]>\`
- Auth: Required, {{members_auth_rule}}
- Include: contributionCount (computed from last 30 days)

## Database Access
- Use Prisma client from \`src/lib/db.ts\`
- All queries filtered by {{query_filter}} from session
- Use \`select\` to only fetch needed fields (not select *)

## Error Handling
- 401 for missing/invalid auth
- 403 for insufficient role
- 404 for resource not found
- 500 with generic message (log full error server-side)`,
      blanks: [
        { id: 'stats_return_type', answer: 'ApiResponse<DashboardStats>', alternatives: ['ApiResponse<DashboardStats>', '`ApiResponse<DashboardStats>`'], placeholder: 'type de retour typé pour l\'endpoint stats', hint: 'Utilise le wrapper générique ApiResponse avec le type contrat DashboardStats' },
        { id: 'members_auth_rule', answer: 'admin or member role', alternatives: ['admin or member role', 'admin or member', 'role: admin | member'], placeholder: 'quels rôles peuvent accéder ?', hint: 'Les viewers ne devraient pas pouvoir lister les membres de l\'équipe — seuls deux rôles le peuvent' },
        { id: 'query_filter', answer: 'teamId', alternatives: ['teamId', 'team ID', 'teamId from session'], placeholder: 'qu\'est-ce qui scope toutes les requêtes ?', hint: 'Chaque requête de base de données doit être scopée à l\'équipe de l\'utilisateur courant' },
      ],
      explanation: "Remarque comment cette spécification référence les contrats pour les types de retour mais ajoute des détails spécifiques à l'API : endpoints, paramètres de requête, logique de pagination. L'agent auth n'a pas besoin de connaître la pagination. L'agent UI n'a pas besoin de connaître les requêtes de base de données. Séparation des responsabilités.",
    },

    // === KEEPING CONTEXT IN SYNC ===
    {
      type: 'multiple-choice',
      question: 'L\'Agent 1 ajoute un champ `teamId` à la session utilisateur pendant que l\'Agent 3 construit l\'UI contre les contrats originaux. Comment appelle-t-on ça ?',
      options: [
        'Un conflit de fusion — Git le détectera et le signalera automatiquement',
        'Une dérive du contexte — l\'agent UI construit contre des hypothèses périmées',
        'Une erreur de type — TypeScript empêchera la compilation',
        'Un développement parallèle normal — aucune intervention nécessaire',
      ],
      correctIndex: 1,
      explanation: "C'est une dérive du contexte : l'Agent 1 construit le module d'auth et ajoute un nouveau champ à la session, mais l'Agent 3 construit des composants UI contre les contrats originaux qui n'incluent pas `teamId`. Au moment de la fusion, le code de l'agent UI est basé sur du contexte périmé. Git ne détecte pas la dérive sémantique — seulement les conflits structurels.",
    },
    {
      type: 'interactive-diagram',
      title: 'Prévention de la dérive du contexte',
      body: 'Clique pour voir le protocole gel-pause-mise à jour-reprise pour gérer les changements de contrats en cours de vol.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'freeze', label: 'Geler les contrats', sublabel: 'Avant le lancement', shape: 'rounded', highlight: true },
          { id: 'launch', label: 'Lancer la flotte', sublabel: '4 agents', shape: 'rect' },
          { id: 'need', label: 'Changement requis ?', shape: 'diamond' },
          { id: 'pause', label: 'Pause des agents', sublabel: 'Concernés', shape: 'rect' },
          { id: 'update', label: 'Mise à jour du contrat', sublabel: 'Orchestrateur seul', shape: 'rect' },
          { id: 'resume', label: 'Reprise', sublabel: 'Rebriefage des agents', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'freeze', to: 'launch' },
          { from: 'launch', to: 'need' },
          { from: 'need', to: 'pause', label: 'oui' },
          { from: 'pause', to: 'update' },
          { from: 'update', to: 'resume' },
          { from: 'need', to: 'launch', label: 'non', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['freeze'],
          highlightEdges: [],
          explanation: 'Avant de lancer quelque agent que ce soit, les contrats sont gelés. Chaque agent démarre avec la même vérité partagée. C\'est la première étape critique.',
        },
        {
          highlightNodes: ['launch'],
          highlightEdges: [{ from: 'freeze', to: 'launch' }],
          explanation: 'La flotte est lancée. Les 4 agents construisent simultanément contre les contrats gelés. Aucun agent ne modifie le contexte partagé.',
        },
        {
          highlightNodes: ['need', 'pause', 'update', 'resume'],
          highlightEdges: [{ from: 'need', to: 'pause' }, { from: 'pause', to: 'update' }, { from: 'update', to: 'resume' }],
          explanation: 'Changement en cours de vol nécessaire ? Mets en pause les agents concernés, mets à jour le contrat (orchestrateur seul), rebriefe les agents en pause avec le changement, puis reprends. Ne laisse jamais les agents découvrir les changements par eux-mêmes.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'En cours de route, tu réalises que l\'interface DashboardStats a besoin d\'un nouveau champ (overdueCount). Que fais-tu ?',
      options: [
        'L\'ajouter aux contrats et laisser les agents le découvrir naturellement',
        'Envoyer un message à chaque agent pour mettre à jour leur code avec le nouveau champ',
        'Mettre en pause les agents API et UI, mettre à jour le contrat, rebriéfer les deux avec le changement, puis reprendre',
        'Attendre que tous les agents aient fini, puis l\'ajouter en tâche de suivi',
      ],
      correctIndex: 2,
      explanation: "L'option C est correcte parce que : l'agent API doit produire le nouveau champ, l'agent UI doit le consommer, et les deux doivent être au courant du changement simultanément. La mise en pause garantit qu'aucun des deux ne construit contre du contexte périmé. L'option D (reporter) est aussi valide si le champ n'est pas critique — mais C est la procédure correcte en cours de vol.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu sais gérer les changements de contexte sans casser les agents en cours d\'exécution.',
    },

    // === AVOIDING DUPLICATION ===
    {
      type: 'multiple-choice',
      question: 'Trois agents créent chacun leur propre fonction `formatDate()` dans leur module. Quelle est la cause de cette duplication ?',
      options: [
        'Les agents ne sont pas assez intelligents pour réutiliser du code',
        'Aucune bibliothèque d\'utilitaires partagés n\'a été définie en amont, et les agents n\'ont pas été informés où trouver les helpers communs',
        'Les agents ont délibérément choisi des stratégies de formatage de dates différentes',
        'TypeScript ne supporte pas les modules partagés entre worktrees',
      ],
      correctIndex: 1,
      explanation: "Sans frontières claires, les agents créent indépendamment leurs propres fonctions utilitaires, helpers de validation et garde-types. Tu te retrouves avec `src/auth/utils.ts`, `src/api/helpers.ts` et `src/payments/utils.ts` qui contiennent tous des implémentations légèrement différentes de la même logique. La solution : définir les utilitaires partagés en amont et dire aux agents où les trouver.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce fichier barrel d\'utilitaires partagés. Remplis les imports qui empêchent les agents de dupliquer la logique commune.',
      language: 'typescript',
      filename: 'src/lib/index.ts',
      template: `/**
 * SHARED UTILITIES
 * Pre-built by orchestrator. Agents import, never modify.
 * If you need something not here, build it in your own module.
 */

// Validation helpers
export { z } from '{{validation_lib}}'
export { validateEmail, validatePassword } from './validation'

// API helpers
export { createApiResponse, createErrorResponse } from './api-helpers'
export type { ApiResponse } from '@/contracts'

// Date formatting (prevents 5 agents each writing their own)
export { {{date_exports}} } from './dates'

// Error handling
export { AppError, isAppError, handleError } from './errors'

// Auth helpers
export { getSession, requireAuth, {{role_helper}} } from './auth'`,
      blanks: [
        { id: 'validation_lib', answer: 'zod', alternatives: ['zod', 'Zod'], placeholder: 'bibliothèque de validation', hint: 'La bibliothèque de validation schema-first TypeScript mentionnée dans CLAUDE.md' },
        { id: 'date_exports', answer: 'formatRelativeTime, formatISO, parseISO', alternatives: ['formatRelativeTime, formatISO, parseISO'], placeholder: 'fonctions utilitaires de dates', hint: 'Trois fonctions : une pour le style « il y a 2 heures », une pour formater en ISO, une pour parser l\'ISO' },
        { id: 'role_helper', answer: 'requireRole', alternatives: ['requireRole', 'checkRole'], placeholder: 'helper d\'autorisation par rôle', hint: 'Une fonction qui vérifie si l\'utilisateur a un rôle spécifique (admin, member, viewer)' },
      ],
      explanation: "Crée un répertoire lib partagé avec les utilitaires communs avant que les agents ne commencent. Référence-le dans chaque spécification. Les agents IMPORTENT depuis celui-ci mais ne le MODIFIENT jamais. Si un agent a besoin d'un utilitaire qui n'existe pas, il l'ajoute dans son propre module — tu pourras l'extraire vers le partagé plus tard.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette section de référence au code partagé pour une spécification par module. Remplis les utilitaires spécifiques que les agents doivent importer au lieu de recréer.',
      language: 'markdown',
      filename: 'specs/ui-agent.md',
      template: `## Shared Code (DO NOT DUPLICATE)

Import these from \`src/lib/\` — do NOT create your own versions:
- Date formatting: \`{{date_function}}\` (for "2 hours ago" displays)
- API responses: \`createApiResponse\` (standardized shape)
- Validation: \`z\` (Zod) + \`validateEmail\`, \`validatePassword\`
- Error handling: \`{{error_class}}\`, \`handleError\`
- Auth: \`getSession\`, \`requireAuth\`

If you need a utility that doesn't exist in src/lib/, create it in
{{fallback_location}} and note it for post-merge extraction.`,
      blanks: [
        { id: 'date_function', answer: 'formatRelativeTime', alternatives: ['formatRelativeTime'], placeholder: 'formateur de temps relatif', hint: 'La fonction qui transforme les timestamps en chaînes style « il y a 2 heures »' },
        { id: 'error_class', answer: 'AppError', alternatives: ['AppError'], placeholder: 'classe d\'erreur personnalisée', hint: 'La classe d\'erreur à l\'échelle du projet définie dans le lib partagé' },
        { id: 'fallback_location', answer: 'YOUR module (src/ui/utils.ts)', alternatives: ['YOUR module (src/ui/utils.ts)', 'your own module', 'src/ui/utils.ts'], placeholder: 'où mettre les nouveaux utilitaires', hint: 'Si le lib partagé n\'a pas ce dont tu as besoin, crée-le dans ton propre répertoire de module' },
      ],
      explanation: "Dans chaque spécification par module, pointe explicitement les agents vers le lib partagé. Cette seule ligne prévient le patron de duplication le plus courant : les agents qui écrivent leurs propres formateurs de dates, fonctions de validation et constructeurs de réponses API.",
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent API a besoin d\'une fonction `slugify` qui n\'existe pas dans le lib partagé. Que devrait-il faire ?',
      options: [
        'Ajouter slugify à src/lib/index.ts puisque d\'autres agents pourraient en avoir besoin',
        'La créer dans src/api/utils.ts (son propre module) et la noter pour extraction ultérieure',
        'Importer un package slugify tiers',
        'Demander à l\'orchestrateur de l\'ajouter au lib partagé',
      ],
      correctIndex: 1,
      explanation: "Les agents ne modifient pas les ressources partagées. L'agent crée l'utilitaire dans son propre domaine. Après la complétion de la flotte, l'orchestrateur fait la revue et extrait les utilitaires véritablement partagés. Ça prévient les conflits en cours de vol tout en permettant aux agents de construire ce dont ils ont besoin.",
    },

    // === ADVANCED: CONTEXT BUDGET ===
    {
      type: 'multiple-choice',
      question: 'Un agent reçoit le CLAUDE.md complet de 500 lignes, les 12 contrats d\'interface, et une spécification de 200 lignes. Quel est le problème de cette approche ?',
      options: [
        'Rien — plus de contexte signifie toujours un meilleur résultat',
        'L\'agent a trop de contexte non ciblé ; il ne devrait recevoir que le sous-ensemble pertinent des contrats et un CLAUDE.md court',
        'La spécification devrait être plus longue pour compenser le grand CLAUDE.md',
        'Les agents ne peuvent pas traiter plus de 100 lignes de contexte',
      ],
      correctIndex: 1,
      explanation: "Les agents performent mieux avec un contexte ciblé. Chaque agent devrait recevoir : les conventions globales (courtes), les contrats dont il dépend (sous-ensemble pertinent), et sa propre spécification (détaillée). Si un agent n'a pas besoin de savoir quoi que ce soit sur les paiements, ne lui parle pas des paiements. Moins de bruit, meilleur résultat.",
    },
    {
      type: 'checklist',
      title: 'Budget de contexte par agent',
      items: [
        'CLAUDE.md : Moins de 100 lignes de règles universelles (pas de détails de fonctionnalités)',
        'Contrats : Seulement les interfaces que CET agent importe/produit',
        'Spécification : 50-150 lignes d\'exigences spécifiques à la tâche',
        'Référence au lib partagé : 5-10 lignes pointant vers les utilitaires disponibles',
        'Liste d\'interdits : 3-5 contraintes explicites « NE PAS faire »',
        'Injection de contexte totale : Moins de 300 lignes par agent (ciblé, pas exhaustif)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Un contexte ciblé bat un contexte exhaustif. Moins de bruit, meilleur résultat.',
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercice : Concevoir une architecture de contexte',
      body: "Tu lances 4 agents pour construire un tableau de bord d'équipe. Les modules : Authentification (connexion, rôles, sessions), API (endpoints de données), UI (composants React) et Temps réel (événements WebSocket). Conçois le contexte que chaque agent reçoit.",
    },
    {
      type: 'terminal',
      instruction: 'Crée la structure de répertoires pour ton architecture de contexte :',
      expectedCommand: 'mkdir -p specs src/contracts src/lib',
      hint: 'Crée les répertoires specs/, src/contracts/ et src/lib/',
    },
    {
      type: 'code-input',
      instruction: 'L\'agent temps réel doit pousser des événements d\'activité vers l\'UI. L\'agent UI doit les afficher. Écris le type de contrat pour un message WebSocket qui transporte un ActivityItem :',
      placeholder: 'export interface WsMessage { ... }',
      answer: 'export interface WsMessage { type: "activity"; payload: ActivityItem; timestamp: string }',
      hint: 'Inclus un discriminateur de type, le payload ActivityItem et un timestamp',
    },
    {
      type: 'order',
      instruction: 'Ordonne ces étapes pour configurer le contexte multi-agents :',
      items: [
        'Écrire CLAUDE.md avec les conventions universelles',
        'Définir les contrats d\'interface (frontières typées)',
        'Créer les utilitaires partagés dans src/lib/',
        'Écrire les spécifications par module en référençant contrats et lib',
        'Lancer les agents avec : CLAUDE.md + contrats pertinents + leur spécification',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'diagram',
      title: 'Architecture de contexte complète',
      body: "La vue d'ensemble. L'orchestrateur crée et maintient toutes les couches de contexte. Les agents lisent depuis global + contrats + leur spécification. Aucun agent n'écrit dans les ressources partagées. Les changements en cours de vol passent par l'orchestrateur avec le protocole pause/mise à jour/reprise.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'orch', label: 'Orchestrateur', sublabel: 'Crée et maintient', shape: 'pill', highlight: true },
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Règles universelles', shape: 'rounded' },
          { id: 'contracts', label: 'Contrats', sublabel: 'Frontières typées', shape: 'rounded' },
          { id: 'lib', label: 'Lib partagé', sublabel: 'Utilitaires communs', shape: 'rounded' },
          { id: 'specs', label: 'Spéc par agent', sublabel: '1 par agent', shape: 'rect' },
          { id: 'agents', label: 'Flotte d\'agents', sublabel: 'Lecture seule', shape: 'rect', highlight: true },
        ],
        edges: [
          { from: 'orch', to: 'claude', label: 'écrit' },
          { from: 'orch', to: 'contracts', label: 'écrit' },
          { from: 'orch', to: 'lib', label: 'écrit' },
          { from: 'orch', to: 'specs', label: 'écrit' },
          { from: 'claude', to: 'agents', dashed: true },
          { from: 'contracts', to: 'agents', dashed: true },
          { from: 'specs', to: 'agents', dashed: true },
        ],
      },
    },
    {
      type: 'checklist',
      title: 'Maîtrise de la gestion du contexte partagé',
      items: [
        'Je structure le contexte en couches : global (CLAUDE.md) → contrats → spécifications par module',
        'J\'écris les contrats d\'interface AVANT de lancer les agents',
        'Je garde les contrats gelés pendant l\'exécution de la flotte',
        'J\'utilise le protocole pause/mise à jour/reprise pour les changements en cours de vol',
        'Je préviens la duplication avec un lib partagé + des références explicites dans les spécifications',
        'Je budgète le contexte : moins de 300 lignes par agent (ciblé, pas exhaustif)',
        'Je sépare COMMENT (CLAUDE.md) de QUOI (spécifications) de FORME (contrats)',
        'Seul l\'orchestrateur écrit dans les ressources partagées — les agents ne font que lire',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Contexte partagé maîtrisé ! Plusieurs agents IA peuvent construire un produit cohérent.',
    },
  ],
}

export default content
