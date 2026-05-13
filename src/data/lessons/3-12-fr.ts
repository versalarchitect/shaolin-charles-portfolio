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
      type: 'diagram',
      title: 'Architecture de contexte en couches',
      body: "Le contexte n'est pas un document plat — il est structuré en couches. Le contexte global (CLAUDE.md) s'applique à tous les agents. Les spécifications de module s'appliquent à un seul agent. Les contrats d'interface définissent les frontières entre agents. Chaque agent lit la couche globale + sa propre spécification de module + les contrats dont il dépend. Ni plus, ni moins.",
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
      type: 'info',
      title: 'Ce qui va dans CLAUDE.md (contexte global)',
      body: "CLAUDE.md contient les décisions que CHAQUE agent doit respecter, peu importe ce qu'il construit. Style de code, conventions de nommage, structure de répertoires, patrons de tests, philosophie de gestion d'erreurs, et patrons interdits. Pense-le comme le guide de l'équipe d'ingénierie — des règles universelles qui créent de la cohérence dans tout le code produit par les agents.",
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md : conventions globales pour le travail multi-agents',
      body: "Voici ce que chaque agent de la flotte lit. Remarque que ça porte sur COMMENT écrire du code, pas QUOI construire. Ça garantit que, peu importe quel agent écrit quelle fonctionnalité, le résultat a l'air d'avoir été écrit par une seule personne.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `# Project: Team Dashboard

## Architecture
- Framework: Next.js 14 (App Router)
- Database: Prisma + PostgreSQL
- Auth: NextAuth.js with JWT sessions
- State: React Query for server state, Zustand for client state

## Conventions
- File naming: kebab-case for files, PascalCase for components
- Exports: Named exports only (no default exports except pages)
- Error handling: All async functions return Result<T, Error> pattern
- Testing: Colocated tests (component.test.tsx next to component.tsx)

## Patterns (ALL agents must follow)
- API responses: { data: T | null, error: string | null }
- Components: Loading skeleton → Error state → Empty state → Data state
- Database: Always use transactions for multi-table writes
- Validation: Zod schemas for all input boundaries

## Forbidden
- No \`any\` types
- No default exports (except page.tsx and layout.tsx)
- No console.log in committed code
- No hardcoded URLs or secrets
- No modifying files outside your assigned directory`,
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
      type: 'info',
      title: 'Contrats d\'interface : frontières typées entre agents',
      body: "Les contrats d'interface sont la pièce la plus critique du contexte multi-agents. Ils définissent la forme exacte des données qui circulent entre les modules construits par différents agents. Sans eux, l'Agent A construit un objet utilisateur avec `{ name: string }` et l'Agent B s'attend à `{ firstName: string, lastName: string }` — et tu découvres l'incompatibilité au moment de l'intégration.",
    },
    {
      type: 'code-demo',
      title: 'Fichier de contrat d\'interface',
      body: "Ce fichier est écrit par TOI (l'orchestrateur) avant que tout agent ne commence. Chaque agent en fait l'import. AUCUN AGENT ne peut le modifier. Il définit chaque frontière entre modules — les formes de réponses API, les props des composants, les signatures de fonctions qui traversent les frontières de modules.",
      language: 'typescript',
      filename: 'src/contracts/index.ts',
      code: `/**
 * INTERFACE CONTRACTS
 * Written by orchestrator. Read-only for all agents.
 * Defines every cross-module boundary.
 */

// === Auth → All Modules ===
export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'member' | 'viewer'
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
  error: { code: string; message: string } | null
  meta?: { page: number; total: number }
}

// === Dashboard Stats (API produces, UI consumes) ===
export interface DashboardStats {
  totalProjects: number
  activeMembers: number
  velocityTrend: number[]  // last 7 days
  completionRate: number   // 0-1
}

// === Activity Feed (API produces, UI consumes) ===
export interface ActivityItem {
  id: string
  userId: string
  action: 'created' | 'updated' | 'completed' | 'commented'
  target: string
  timestamp: string  // ISO 8601
}

// === Team Member (API produces, UI consumes) ===
export interface TeamMember {
  id: string
  name: string
  email: string
  role: AuthUser['role']
  avatarUrl: string | null
  contributionCount: number
  lastActiveAt: string  // ISO 8601
}`,
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
      type: 'info',
      title: 'Spécifications par module : ce qu\'un seul agent doit savoir',
      body: "Chaque agent reçoit un document de spécification propre à sa tâche. Ça inclut : les fichiers exacts à créer, les détails de la logique métier, les cas limites, et comment importer depuis le fichier de contrats. La spécification doit être autonome — un agent qui lit CLAUDE.md + contrats + sa spécification devrait avoir tout ce qu'il faut pour compléter la tâche sans poser de questions.",
    },
    {
      type: 'code-demo',
      title: 'Exemple de spécification par module : agent API',
      body: "Remarque comment cette spécification référence les contrats pour les types de retour mais ajoute des détails spécifiques à l'API : endpoints, paramètres de requête, logique de pagination. L'agent auth n'a pas besoin de connaître la pagination. L'agent UI n'a pas besoin de connaître les requêtes de base de données. Séparation des responsabilités.",
      language: 'markdown',
      filename: 'specs/api-agent.md',
      code: `# API Agent Spec

## Scope
Build REST API endpoints in \`src/api/\`

## Endpoints

### GET /api/dashboard/stats
- Returns: \`ApiResponse<DashboardStats>\` (from contracts)
- Auth: Required (validate session token)
- Cache: 60 seconds (stale-while-revalidate)

### GET /api/activity?page=1&limit=20
- Returns: \`ApiResponse<ActivityItem[]>\` with meta.page, meta.total
- Auth: Required
- Filter: Only show activity from user's team
- Sort: Most recent first

### GET /api/team/members
- Returns: \`ApiResponse<TeamMember[]>\`
- Auth: Required, admin or member role
- Include: contributionCount (computed from last 30 days)

## Database Access
- Use Prisma client from \`src/lib/db.ts\`
- All queries filtered by teamId from session
- Use \`select\` to only fetch needed fields (not select *)

## Error Handling
- 401 for missing/invalid auth
- 403 for insufficient role
- 404 for resource not found
- 500 with generic message (log full error server-side)`,
    },

    // === KEEPING CONTEXT IN SYNC ===
    {
      type: 'info',
      title: 'Le problème de la dérive : le contexte devient périmé pendant le travail en parallèle',
      body: "Voici le côté délicat. L'Agent 1 construit le module d'auth et ajoute un nouveau champ à la session utilisateur (par ex. `teamId`). Pendant ce temps, l'Agent 3 construit des composants UI contre les contrats originaux qui n'incluent pas `teamId`. Au moment de la fusion, le code de l'agent UI est basé sur du contexte périmé. Comment prévenir ça ?",
    },
    {
      type: 'diagram',
      title: 'Prévention de la dérive du contexte',
      body: "La solution : les contrats sont gelés au lancement de la flotte. Si tu dois modifier un contrat en cours de route, tu mets en pause les agents concernés, tu mets à jour le contrat, et tu les rebriefes. L'orchestrateur est la seule entité qui modifie le contexte partagé.",
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
      type: 'info',
      title: 'Prévenir la duplication de code entre agents',
      body: "Sans frontières claires, les agents créent indépendamment leurs propres fonctions utilitaires, helpers de validation et garde-types. Tu te retrouves avec `src/auth/utils.ts`, `src/api/helpers.ts` et `src/payments/utils.ts` qui contiennent tous des implémentations légèrement différentes de la même logique. La solution : définir les utilitaires partagés en amont et dire aux agents où les trouver.",
    },
    {
      type: 'code-demo',
      title: 'Stratégie d\'utilitaires partagés',
      body: "Crée un répertoire lib partagé avec les utilitaires communs avant que les agents ne commencent. Référence-le dans chaque spécification. Les agents IMPORTENT depuis celui-ci mais ne le MODIFIENT jamais. Si un agent a besoin d'un utilitaire qui n'existe pas, il l'ajoute dans son propre module — tu pourras l'extraire vers le partagé plus tard.",
      language: 'typescript',
      filename: 'src/lib/index.ts',
      code: `/**
 * SHARED UTILITIES
 * Pre-built by orchestrator. Agents import, never modify.
 * If you need something not here, build it in your own module.
 */

// Validation helpers
export { z } from 'zod'
export { validateEmail, validatePassword } from './validation'

// API helpers
export { createApiResponse, createErrorResponse } from './api-helpers'
export type { ApiResponse } from '@/contracts'

// Date formatting (prevents 5 agents each writing their own)
export { formatRelativeTime, formatISO, parseISO } from './dates'

// Error handling
export { AppError, isAppError, handleError } from './errors'

// Auth helpers
export { getSession, requireAuth, requireRole } from './auth'`,
    },
    {
      type: 'code-demo',
      title: 'Référence aux utilitaires partagés dans la spécification',
      body: "Dans chaque spécification par module, pointe explicitement les agents vers le lib partagé. Cette seule ligne prévient le patron de duplication le plus courant : les agents qui écrivent leurs propres formateurs de dates, fonctions de validation et constructeurs de réponses API.",
      language: 'markdown',
      filename: 'specs/ui-agent.md',
      code: `## Shared Code (DO NOT DUPLICATE)

Import these from \`src/lib/\` — do NOT create your own versions:
- Date formatting: \`formatRelativeTime\` (for "2 hours ago" displays)
- API responses: \`createApiResponse\` (standardized shape)
- Validation: \`z\` (Zod) + \`validateEmail\`, \`validatePassword\`
- Error handling: \`AppError\`, \`handleError\`
- Auth: \`getSession\`, \`requireAuth\`

If you need a utility that doesn't exist in src/lib/, create it in
YOUR module (src/ui/utils.ts) and note it for post-merge extraction.`,
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
      type: 'info',
      title: 'Budget de contexte : moins, c\'est plus',
      body: "Une erreur courante : tout balancer — le CLAUDE.md complet, tous les contrats, et une spécification de 500 lignes — dans chaque agent. Les agents performent mieux avec un contexte ciblé. Chaque agent devrait recevoir : les conventions globales (courtes), les contrats dont il dépend (sous-ensemble pertinent), et sa propre spécification (détaillée). Si un agent n'a pas besoin de savoir quoi que ce soit sur les paiements, ne lui parle pas des paiements.",
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
