import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-2',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'CLAUDE.md comme contexte partagé entre agents',
      body: "Quand un seul agent construit votre projet, la cohérence est automatique — il se souvient de ses propres décisions. Mais quand cinq agents construisent en parallèle, chacun part d'une page blanche. L'agent A choisit REST. L'agent B choisit GraphQL. L'agent C nomme les fichiers en camelCase. L'agent D utilise le kebab-case. Vous fusionnez et vous obtenez le chaos. CLAUDE.md est le protocole de coordination qui empêche ça.",
    },
    {
      type: 'info',
      title: 'Pourquoi c\'est important',
      body: "CLAUDE.md n'est pas de la documentation pour les humains — c'est un cerveau partagé pour les agents. Chaque agent le lit avant d'écrire une seule ligne de code. Il encode les décisions architecturales, les conventions de nommage, les patrons de fichiers et les approches interdites qui gardent le travail parallèle cohérent. Sans lui, vous faites jouer cinq musiciens sans partition.",
    },

    // === DIAGRAM 1: The Coordination Problem ===
    {
      type: 'diagram',
      title: 'Sans contexte partagé : décisions divergentes',
      body: "Sans fichier de contexte partagé, chaque agent prend des décisions indépendantes. Ils produisent tous du code fonctionnel — mais du code qui contredit les autres. La fusion devient un cauchemar de patrons contradictoires.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'you', label: 'Vous', sublabel: 'Orchestrateur', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', sublabel: 'Choisit REST', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'Choisit GraphQL', shape: 'rect' },
          { id: 'c', label: 'Agent C', sublabel: 'Fichiers camelCase', shape: 'rect' },
          { id: 'd', label: 'Agent D', sublabel: 'Fichiers kebab-case', shape: 'rect' },
          { id: 'merge', label: 'Fusion', sublabel: 'Contradictions !', shape: 'diamond' },
        ],
        edges: [
          { from: 'you', to: 'a' },
          { from: 'you', to: 'b' },
          { from: 'you', to: 'c' },
          { from: 'you', to: 'd' },
          { from: 'a', to: 'merge' },
          { from: 'b', to: 'merge' },
          { from: 'c', to: 'merge' },
          { from: 'd', to: 'merge' },
        ],
      },
    },

    // === DIAGRAM 2: With CLAUDE.md ===
    {
      type: 'diagram',
      title: 'Avec CLAUDE.md : décisions cohérentes',
      body: "Chaque agent lit CLAUDE.md en premier. Il dit : REST, fichiers kebab-case, validation Zod. Tous les agents suivent les mêmes règles. La fusion est propre parce que chaque pièce a été construite selon la même spécification.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Contexte partagé', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', sublabel: 'Lit → REST', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'Lit → REST', shape: 'rect' },
          { id: 'c', label: 'Agent C', sublabel: 'Lit → kebab-case', shape: 'rect' },
          { id: 'd', label: 'Agent D', sublabel: 'Lit → kebab-case', shape: 'rect' },
          { id: 'merge', label: 'Fusion', sublabel: 'Propre !', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'claude', to: 'a', label: 'lit' },
          { from: 'claude', to: 'b', label: 'lit' },
          { from: 'claude', to: 'c', label: 'lit' },
          { from: 'claude', to: 'd', label: 'lit' },
          { from: 'a', to: 'merge' },
          { from: 'b', to: 'merge' },
          { from: 'c', to: 'merge' },
          { from: 'd', to: 'merge' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Vous comprenez pourquoi le contexte partagé prévient les échecs de coordination.',
    },

    // === WHAT BELONGS IN CLAUDE.MD ===
    {
      type: 'info',
      title: 'Ce qui appartient au CLAUDE.md partagé',
      body: "Tout n'a pas sa place dans CLAUDE.md. Ce n'est pas un tutoriel ni un README. Il contient uniquement les décisions que les agents doivent prendre de façon cohérente : choix architecturaux, conventions de nommage, patrons de fichiers, approches interdites et contrats d'intégration. Pensez-y comme la constitution — les règles non négociables que chaque agent doit suivre.",
    },
    {
      type: 'code-demo',
      title: 'Un CLAUDE.md multi-agent (racine du projet)',
      body: "Voici un vrai CLAUDE.md conçu pour le travail en parallèle avec des agents. Remarquez comment chaque section répond à une question qu'un agent devrait autrement deviner.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `# Project: TaskFlow

## Architecture Decisions (DO NOT DEVIATE)

- **API style**: REST with JSON responses. No GraphQL.
- **Validation**: Zod schemas in \`src/schemas/\`. Every endpoint validates input.
- **Auth**: JWT tokens via \`src/lib/auth.ts\`. No session-based auth.
- **State management**: Zustand. No Redux, no Context for global state.
- **Styling**: Tailwind CSS only. No CSS modules, no styled-components.

## File Naming

- Components: \`kebab-case.tsx\` (e.g., \`user-profile.tsx\`)
- Utilities: \`kebab-case.ts\` (e.g., \`format-date.ts\`)
- Types: \`kebab-case.ts\` in \`src/types/\`
- Tests: \`*.test.ts\` co-located with source file

## Forbidden Patterns

- \`any\` type — use \`unknown\` and narrow
- Barrel files (\`index.ts\` re-exports) — import directly
- Default exports — use named exports only
- \`console.log\` in production code — use the logger from \`src/lib/logger.ts\`

## Shared Contracts

All agents import types from \`src/types/contracts.ts\`.
No agent modifies this file. It is written by the orchestrator.`,
    },
    {
      type: 'multiple-choice',
      question: 'Lequel de ces éléments N\'a PAS sa place dans un CLAUDE.md multi-agent ?',
      options: [
        'Style API : REST avec réponses JSON',
        'Tutoriel étape par étape sur le fonctionnement des hooks React',
        'Patrons interdits : pas de type `any`, pas de fichiers barrel',
        'Nommage des fichiers : kebab-case.tsx pour les composants',
      ],
      correctIndex: 1,
      explanation: "CLAUDE.md est pour les décisions, pas pour l'éducation. Les agents savent déjà comment fonctionnent les hooks React. Ils ont besoin de connaître les règles spécifiques de VOTRE projet — les choix qui pourraient aller dans n'importe quelle direction s'ils ne sont pas spécifiés.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Vous savez ce qui appartient au contexte partagé et ce qui n\'y appartient pas.',
    },

    // === LAYERING: PROJECT + DIRECTORY ===
    {
      type: 'info',
      title: 'Superposition : CLAUDE.md au niveau projet + répertoire',
      body: "Un seul CLAUDE.md à la racine couvre les décisions à l'échelle du projet. Mais quand les agents travaillent dans des répertoires spécifiques, ils ont aussi besoin de guidance spécifique au domaine. Claude lit les fichiers CLAUDE.md à chaque niveau — racine pour les règles globales, niveau répertoire pour les spécificités locales. C'est la superposition : contexte général en haut, contexte spécifique là où le travail se fait.",
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md au niveau répertoire pour l\'agent API',
      body: "Ce fichier réside dans src/api/ et donne à l'agent API des directives spécifiques au-delà de ce que le CLAUDE.md racine fournit. Il se superpose — ne répète pas les règles globales.",
      language: 'markdown',
      filename: 'src/api/CLAUDE.md',
      code: `# API Layer — Agent-Specific Context

## Endpoint Pattern
Every route follows: \`src/api/routes/{resource}.ts\`
Each file exports a Hono router with CRUD operations.

## Response Format
Always wrap in: \`{ data: T, error: null }\` or \`{ data: null, error: string }\`
Use the ApiResponse<T> type from \`src/types/contracts.ts\`.

## Error Handling
- 400: Zod validation failure (return parsed errors)
- 401: Missing or expired JWT
- 404: Resource not found
- 500: Unexpected error (log full stack, return generic message)

## Database Access
Use Drizzle ORM. Schema at \`src/db/schema.ts\`.
Never raw SQL. Never direct pg client calls.`,
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md au niveau répertoire pour l\'agent UI',
      body: "Un agent différent travaillant dans src/components/ obtient sa propre guidance spécifique. Il hérite des règles au niveau projet (Tailwind, Zustand, kebab-case) et ajoute des patrons spécifiques aux composants.",
      language: 'markdown',
      filename: 'src/components/CLAUDE.md',
      code: `# UI Components — Agent-Specific Context

## Component Structure
- Props interface above component (named {Component}Props)
- Destructure props in function signature
- Use forwardRef for any component that wraps an HTML element

## Import Order
1. React/framework imports
2. Third-party libraries
3. Internal components (@/components/*)
4. Utilities (@/lib/*)
5. Types (@/types/*)

## Accessibility
- All interactive elements need aria-labels
- Use semantic HTML (button, nav, main, aside)
- Support keyboard navigation (onKeyDown handlers)

## Testing
- Use Testing Library (render, screen, userEvent)
- Test behavior, not implementation
- Co-locate test files: \`user-card.test.tsx\` beside \`user-card.tsx\``,
    },
    {
      type: 'multiple-choice',
      question: 'Un agent travaillant dans `src/api/` lit quels fichiers CLAUDE.md ?',
      options: [
        'Seulement src/api/CLAUDE.md',
        'Seulement le CLAUDE.md racine',
        'CLAUDE.md racine + src/api/CLAUDE.md (superposés)',
        'Tous les fichiers CLAUDE.md du projet entier',
      ],
      correctIndex: 2,
      explanation: "Claude lit le CLAUDE.md à la racine du projet et à chaque niveau de répertoire pertinent à son travail. Un agent dans src/api/ obtient à la fois les règles globales (REST, Zod, nommage) et les règles spécifiques à l'API (format de réponse, codes d'erreur). Ils se superposent — les règles du répertoire ajoutent de la spécificité sans répéter les règles globales.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Vous comprenez la superposition des CLAUDE.md pour la coordination multi-agent.',
    },

    // === PREVENTING CONTRADICTORY DECISIONS ===
    {
      type: 'info',
      title: 'Prévenir les décisions contradictoires',
      body: "L'échec multi-agent le plus courant : deux agents font des choix raisonnables mais incompatibles. L'agent A utilise Axios pour HTTP. L'agent B utilise fetch. L'agent C crée un wrapper personnalisé. Maintenant vous avez trois bibliothèques HTTP dans un seul projet. CLAUDE.md prévient ça en rendant le choix explicite avant que tout agent ne commence.",
    },
    {
      type: 'code-demo',
      title: 'Catégories de décisions qui DOIVENT être spécifiées',
      body: "Ce sont les décisions où les agents vont diverger si on ne leur dit pas explicitement. Chaque CLAUDE.md multi-agent a besoin de réponses à ces questions.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Decisions That Prevent Contradictions

### Data Fetching
- Client: use \`fetch\` via the wrapper in \`src/lib/api-client.ts\`
- No Axios, no ky, no got — one HTTP approach

### Form Handling
- React Hook Form + Zod resolver
- No Formik, no uncontrolled forms

### Date/Time
- date-fns for all formatting and manipulation
- No moment.js, no dayjs, no native Date formatting

### ID Generation
- nanoid for client-generated IDs
- UUID v4 for database-generated IDs (via Postgres)

### Error Boundaries
- Use the shared ErrorBoundary from \`src/components/error-boundary.tsx\`
- Don't create new error boundary components`,
    },
    {
      type: 'order',
      instruction: 'Classez du PLUS susceptible de causer des contradictions entre agents (en haut) au MOINS susceptible :',
      items: [
        'Quelle bibliothèque client HTTP utiliser',
        'Comment indenter le code (tabs vs espaces)',
        'Quelle approche de gestion d\'état utiliser',
        'Quelle couleur donner au bouton de soumission',
      ],
      correctOrder: [2, 0, 3, 1],
    },

    // === UPDATING SHARED CONTEXT ===
    {
      type: 'info',
      title: 'Mettre à jour le contexte partagé pendant le travail parallèle',
      body: "Les bases de code évoluent pendant une session multi-agent. L'agent A découvre que la bibliothèque d'auth nécessite un patron d'initialisation spécifique. L'agent C trouve que le schéma de base de données a besoin d'un champ supplémentaire. Ces découvertes doivent se propager aux autres agents. La règle : seul l'orchestrateur (vous) met à jour CLAUDE.md. Les agents proposent des changements ; vous décidez.",
    },
    {
      type: 'code-demo',
      title: 'Mise à jour CLAUDE.md en cours de session',
      body: "Pendant une exécution de flotte, l'agent A découvre que la bibliothèque d'auth nécessite une initialisation asynchrone. Vous mettez à jour CLAUDE.md pour que tous les autres agents gèrent ça correctement. C'est une mise à jour de coordination en temps réel.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Runtime Notes (added during this session)

### Auth Initialization (IMPORTANT)
The auth client requires async init before any protected call:
\`\`\`typescript
import { initAuth } from '@/lib/auth'
// Call once at app startup or route handler entry
await initAuth()
\`\`\`
Any agent making authenticated requests MUST call this first.

### Database: users table has new column
Added \`preferences JSONB DEFAULT '{}'\` to users table.
Agents working with user data: include this field in your types.`,
    },
    {
      type: 'multiple-choice',
      question: 'Pendant une exécution parallèle, l\'agent B découvre un patron critique. Que faites-vous ?',
      options: [
        'Laisser l\'agent B mettre à jour CLAUDE.md directement',
        'Arrêter tous les agents, mettre à jour CLAUDE.md, tout redémarrer',
        'Noter la découverte, mettre à jour CLAUDE.md, et informer les agents concernés',
        'L\'ignorer — chaque agent se débrouille indépendamment',
      ],
      correctIndex: 2,
      explanation: "Vous (l'orchestrateur) mettez à jour CLAUDE.md et informez sélectivement les agents qui ont besoin de savoir. Vous n'avez pas besoin d'arrêter tout le monde — seulement les agents dont le travail est affecté par la nouvelle information. C'est de la coordination ciblée, pas une interruption en broadcast.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Vous pouvez gérer les mises à jour de contexte en direct pendant les exécutions de flotte.',
    },

    // === INTERACTIF : COMPARE ===
    {
      type: 'compare',
      title: 'Sans vs avec un protocole de coordination',
      body: 'Quand plusieurs agents travaillent sur le même codebase, la cohérence dépend de règles partagées.',
      left: {
        label: 'Sans CLAUDE.md',
        content: 'Agent 1: uses camelCase functions\nAgent 2: uses snake_case functions\nAgent 1: throws Error("message")\nAgent 2: returns { error: "message" }\nAgent 1: uses Tailwind classes\nAgent 2: uses inline styles\n\nResult: inconsistent mess',
        language: 'text',
      },
      right: {
        label: 'CLAUDE.md partagé',
        content: 'All agents read:\n  "Functions: camelCase"\n  "Errors: throw AppError(msg, code)"\n  "Styling: Tailwind only, no inline"\n\nAgent 1: follows rules ✓\nAgent 2: follows rules ✓\nAgent 3: follows rules ✓\n\nResult: consistent codebase',
        language: 'text',
      },
    },

    // === INTERACTIF : CODE-FILL ===
    {
      type: 'code-fill',
      instruction: 'Complétez la section de coordination CLAUDE.md qui garde tous les agents cohérents :',
      language: 'markdown',
      template: '## Architecture Decisions (DO NOT DEVIATE)\n\n- **Naming**: All functions use {{naming}} style\n- **Error handling**: Always {{errorPattern}} with a code\n- **Styling**: {{stylingRule}} only. No CSS modules, no inline styles.\n- **Exports**: Use {{exportType}} exports only. No default exports.',
      blanks: [
        { id: 'naming', answer: 'camelCase', alternatives: ['camel-case', 'camel case'], placeholder: 'convention de nommage ?', hint: 'Le style de nommage JS le plus courant' },
        { id: 'errorPattern', answer: 'throw AppError(msg, code)', alternatives: ['throw AppError', 'throw new AppError(msg, code)'], placeholder: 'approche d\'erreur ?', hint: 'Lancer un objet erreur, pas le retourner' },
        { id: 'stylingRule', answer: 'Tailwind CSS', alternatives: ['Tailwind', 'tailwind'], placeholder: 'approche CSS ?', hint: 'Framework CSS utilitaire' },
        { id: 'exportType', answer: 'named', alternatives: ['Named'], placeholder: 'style d\'export ?', hint: 'Pas les exports par défaut' },
      ],
      explanation: 'Chaque blanc élimine une catégorie de divergence. Le nommage, les erreurs, le styling et les exports sont les quatre domaines principaux où les agents font des choix incohérents sans guidance explicite.',
    },

    // === EXERCICE PRATIQUE ===
    {
      type: 'info',
      title: 'Exercice : Écrire un CLAUDE.md multi-agent',
      body: "C'est le moment de pratiquer. Vous allez lancer 4 agents sur un projet e-commerce : agent auth, agent catalogue produits, agent panier/paiement, et agent tableau de bord admin. Écrivez le contexte partagé qui les garde alignés.",
    },
    {
      type: 'terminal',
      instruction: 'Créez un fichier CLAUDE.md à la racine du projet :',
      expectedCommand: 'touch CLAUDE.md',
      hint: 'Créez le fichier avec touch',
    },
    {
      type: 'code-input',
      instruction: 'La section la plus critique empêche les contradictions de choix technologiques. Écrivez la ligne qui spécifie l\'approche de gestion d\'état :',
      placeholder: '- **State management**: ...',
      answer: '- **State management**: Zustand. No Redux, no Context for global state.',
      hint: 'Choisissez un outil et interdisez explicitement les alternatives. Format : "- **State management**: [choix]. No [alternatives]."',
    },
    {
      type: 'terminal',
      instruction: 'Créez un CLAUDE.md au niveau répertoire pour l\'agent panier/paiement :',
      expectedCommand: 'mkdir -p src/cart && touch src/cart/CLAUDE.md',
      hint: 'Créez le répertoire et le fichier CLAUDE.md à l\'intérieur',
    },
    {
      type: 'code-demo',
      title: 'Votre CLAUDE.md e-commerce complet',
      body: "Voici un exemple complet de ce que vous écririez avant de lancer quatre agents. Étudiez comment chaque section élimine une catégorie de conflits potentiels.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `# E-Commerce Platform

## Architecture (ALL AGENTS FOLLOW)
- Framework: Next.js 14 App Router
- API: Server Actions for mutations, Route Handlers for external APIs
- Database: Prisma + PostgreSQL
- Auth: NextAuth.js with JWT strategy
- Payments: Stripe SDK (server-side only)
- State: Zustand for client state, server state via React Query

## File Ownership
- src/auth/* → Auth Agent (login, signup, session)
- src/products/* → Catalog Agent (listing, search, detail)
- src/cart/* → Cart Agent (add/remove, checkout, payment)
- src/admin/* → Admin Agent (dashboard, CRUD, analytics)

## Shared Resources (NO AGENT MODIFIES)
- src/types/contracts.ts — shared type definitions
- src/lib/db.ts — Prisma client instance
- src/lib/stripe.ts — Stripe client instance
- prisma/schema.prisma — database schema

## Naming & Patterns
- Files: kebab-case.tsx / kebab-case.ts
- Components: PascalCase named exports
- Server Actions: src/{domain}/actions.ts
- Validation: Zod schemas in src/{domain}/schemas.ts

## Forbidden
- Client-side Stripe key usage
- Direct database access outside src/lib/db.ts
- Modifying shared resources without orchestrator approval
- any type — use unknown and narrow`,
    },
    {
      type: 'checklist',
      title: 'Liste de vérification de coordination CLAUDE.md',
      items: [
        'Le CLAUDE.md racine couvre tous les choix technologiques qui pourraient diverger',
        'La propriété des fichiers est explicite — pas de répertoires qui se chevauchent',
        'Les patrons interdits sont listés pour prévenir les erreurs courantes',
        'Les ressources partagées sont marquées en lecture seule pour les agents',
        'Des CLAUDE.md au niveau répertoire ajoutent des règles spécifiques au domaine où nécessaire',
        'Le processus de mise à jour du contexte en cours de session est clair (orchestrateur seulement)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Leçon terminée. CLAUDE.md est votre protocole de coordination — la partition que chaque agent lit.',
    },
  ],
}

export default content
