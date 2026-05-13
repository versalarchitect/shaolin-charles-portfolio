import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-12',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Le projet final : prouve la boucle complète',
      body: "C'est le moment. Tu vas spécifier, diriger, vérifier et livrer un produit complet — une application SaaS de tableau de rétroaction — en utilisant uniquement la direction d'agent. Pas de code écrit toi-même. Pas de modifications manuelles. Tu diriges, l'agent construit. Chaque compétence du Tier 2 converge ici : écriture de specs, direction itérative, protocoles de vérification, évaluation visuelle, contraintes de scope et déploiement. À la fin de cette leçon, tu auras un URL de production live qui roule un logiciel que tu as dirigé un agent à construire de bout en bout.",
    },
    {
      type: 'info',
      title: 'Le produit : Tableau de rétroaction',
      body: "Un vrai produit avec une vraie utilité. Les utilisateurs soumettent des items de rétroaction (titre + description). Les autres utilisateurs votent sur les items pour indiquer la priorité. Un admin peut changer le statut d'un item (nouveau, en cours, terminé, décliné). Les items s'affichent dans un tableau public trié par votes. C'est pas un jouet — ça a l'authentification, la persistance en base de données, le contrôle d'accès par rôle, et une interface responsive. Des entreprises comme Canny et Nolt chargent 79 $-400 $/mois pour ça. Tu vas le construire en 75 minutes de travail dirigé.",
    },
    {
      type: 'interactive-diagram',
      title: 'Phases du projet final',
      body: 'Six phases du spec à la livraison. Chaque phase utilise une compétence spécifique du Tier 2. Clique sur chaque phase.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Phase 1', sublabel: 'Écrire le spec', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Phase 2', sublabel: 'Auth + Base de données', shape: 'rect' },
          { id: 'core', label: 'Phase 3', sublabel: 'Fonctionnalités de base', shape: 'rect' },
          { id: 'ui', label: 'Phase 4', sublabel: 'Interface', shape: 'rect' },
          { id: 'verify', label: 'Phase 5', sublabel: 'Tout vérifier', shape: 'diamond' },
          { id: 'ship', label: 'Phase 6', sublabel: 'Déployer + Doc', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'auth' },
          { from: 'auth', to: 'core' },
          { from: 'core', to: 'ui' },
          { from: 'ui', to: 'verify' },
          { from: 'verify', to: 'ship', label: 'passe' },
          { from: 'verify', to: 'core', label: 'corriger', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'auth' }],
          explanation: 'Phase 1 : Écris le spec produit complet avec les cinq sections — Objectif, Contraintes, Critères d\'acceptation, Limites techniques et Hors scope. C\'est le contrat d\'exécution pour tout le build.',
        },
        {
          highlightNodes: ['auth'],
          highlightEdges: [{ from: 'auth', to: 'core' }],
          explanation: 'Phase 2 : Dirige l\'agent pour construire l\'auth et le schéma de base de données comme deux sous-tâches scopées. L\'agent construit les fondations sans toucher aux fonctionnalités de l\'app — séparation des responsabilités.',
        },
        {
          highlightNodes: ['core'],
          highlightEdges: [{ from: 'core', to: 'ui' }],
          explanation: 'Phase 3 : Dirige trois fonctionnalités de base — soumission de rétroaction, vote, et statut admin — chacune comme un prompt scopé séparé. Applique la direction itérative si la première sortie manque quelque chose.',
        },
        {
          highlightNodes: ['ui'],
          highlightEdges: [{ from: 'ui', to: 'verify' }],
          explanation: 'Phase 4 : Compose tous les composants en une interface cohésive. Applique les contraintes visuelles — espacement, hiérarchie, comportement responsive — et évalue la sortie avec ton filtre de goût.',
        },
        {
          highlightNodes: ['verify'],
          highlightEdges: [{ from: 'verify', to: 'ship' }, { from: 'verify', to: 'core' }],
          explanation: 'Phase 5 : Vérifie tout — tests fonctionnels contre les critères d\'acceptation, audit de sécurité (secrets, auth, exposition de données), et évaluation visuelle. Si la vérification échoue, retourne corriger.',
        },
        {
          highlightNodes: ['ship'],
          explanation: 'Phase 6 : Déploie sur Vercel, vérifie le déploiement en production, et documente le projet. Variables d\'environnement, vérification du build, plan de rollback, et un README qui couvre de la configuration au déploiement.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Contexte du projet final établi ! Construisons.',
    },

    // === PHASE 1: WRITE THE SPEC ===
    {
      type: 'info',
      title: 'Phase 1 : Écrire le spec (compétences de la leçon 2-1)',
      body: "Ta première action, c'est d'écrire le spec produit complet. C'est pas un aperçu rapide — c'est le contrat d'exécution qui gouverne tout le build. Inclus les cinq sections : Objectif, Contraintes, Critères d'acceptation, Limites techniques et Hors scope. Sois précis sur les choix technologiques. Sois exhaustif sur les critères d'acceptation. Sois explicite sur ce qui n'est PAS inclus. Ce spec est ton artefact le plus important.",
    },
    {
      type: 'code-demo',
      title: 'Tableau de rétroaction — Spec complet',
      body: 'C\'est le spec que tu vas livrer à l\'agent. Étudie-le — ensuite tu vas créer ta propre version.',
      language: 'markdown',
      filename: 'SPEC.md',
      code: "# Feedback Board — Agent Spec\n\n## Goal\nA public feedback board where users submit ideas, vote on them,\nand an admin manages item status. Live at a production URL.\n\n## Constraints\n- Next.js 15 with App Router\n- TypeScript strict mode\n- Supabase for auth (magic link) and database (Postgres)\n- Tailwind CSS + shadcn/ui components\n- Deployed on Vercel\n- Mobile-first responsive design\n\n## Acceptance Criteria\n- [ ] Users can sign in via magic link (email)\n- [ ] Signed-in users can submit feedback (title + description)\n- [ ] Signed-in users can upvote/remove vote on any item (one vote per user per item)\n- [ ] All users (including anonymous) can view the public board\n- [ ] Board displays items sorted by vote count (descending)\n- [ ] Admin can change item status: new | in-progress | done | declined\n- [ ] Items show their status as a colored badge\n- [ ] Board is filterable by status\n- [ ] Responsive: single column mobile, two-column desktop\n- [ ] App runs locally with `npm run dev` after `npm install`\n- [ ] App deploys to Vercel without errors\n\n## Technical Boundaries\n- Use Supabase Row Level Security for access control\n- Server components for data fetching, server actions for mutations\n- All database logic through Supabase client (no raw SQL in app code)\n- Keep components in src/components/, pages in src/app/\n- Admin role determined by a role column in the users/profiles table\n\n## Out of Scope\n- Comments/replies on items\n- Categories or tags\n- Email notifications\n- Public API\n- Custom domain configuration\n- Analytics or tracking\n- Dark mode (ship light-only for MVP)",
    },
    {
      type: 'code-fill',
      instruction: 'Complète la section Hors Scope du spec du Tableau de rétroaction pour prévenir la dérive de scope :',
      language: 'markdown',
      filename: 'SPEC.md',
      template: '## Out of Scope\n- {{scope1}}\n- Email notifications on new feedback\n- {{scope2}}\n- Analytics dashboard\n- {{scope3}}',
      blanks: [
        { id: 'scope1', answer: 'User profiles or settings page', alternatives: ['User profiles', 'Profile page', 'Settings page', 'User settings'], placeholder: 'quelle fonctionnalité utilisateur ?', hint: 'Une fonctionnalité courante que les agents ajoutent qui n\'est pas nécessaire pour un tableau de rétroaction' },
        { id: 'scope2', answer: 'Markdown or rich text formatting', alternatives: ['Rich text editor', 'Markdown support', 'Text formatting'], placeholder: 'quelle fonctionnalité de contenu ?', hint: 'Une fonctionnalité de formatage de texte qui ajouterait de la complexité' },
        { id: 'scope3', answer: 'Deployment or CI/CD configuration', alternatives: ['Docker', 'CI/CD', 'Deployment config', 'Infrastructure'], placeholder: 'quelle infrastructure ?', hint: 'Quelque chose que l\'agent pourrait ajouter pour la livraison' },
      ],
      explanation: 'Chaque exclusion prévient un type spécifique de dérive de scope. Sans celles-ci, les agents ajoutent couramment des pages de profil, des éditeurs de texte riche, et des configs Docker aux projets simples.',
    },
    {
      type: 'terminal',
      instruction: 'Crée le répertoire de ton projet et écris le spec en tant que SPEC.md. Adapte l\'exemple ci-dessus ou écris le tien — mais inclus les cinq sections.',
      expectedCommand: 'claude "Create a new directory called feedback-board. Inside it, create a SPEC.md file with a complete product spec for a Feedback Board app. Include: Goal (public feedback board with voting and admin status management), Constraints (Next.js 15, TypeScript, Supabase, Tailwind + shadcn/ui, Vercel deploy, mobile-first), Acceptance Criteria (at least 10 testable items covering auth, submission, voting, display, admin, filtering, responsive, deploy), Technical Boundaries (RLS, server components, server actions, directory structure), Out of Scope (comments, categories, notifications, API, analytics, dark mode)."',
      hint: 'Crée le répertoire du projet et fais écrire à l\'agent un SPEC.md complet.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Phase 1 complétée — spec écrit !',
    },

    // === PHASE 2: AUTH + DATABASE ===
    {
      type: 'info',
      title: 'Phase 2 : Diriger Auth + Base de données (compétences de scope de la leçon 2-10)',
      body: "Maintenant tu diriges l'agent pour construire les fondations — mais PAS tout en même temps. Applique les contraintes de scope de la leçon 2-10. La phase 2 a deux sous-tâches ciblées : (1) le schéma de base de données Supabase avec les politiques RLS, (2) le flux d'authentification avec lien magique. Chaque sous-tâche a son propre prompt avec des limites explicites. L'agent construit le schéma sans toucher au code de l'app, puis construit l'auth sans toucher au schéma.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour initialiser le projet Next.js et créer le schéma Supabase. Scope : configuration du projet et base de données UNIQUEMENT — pas de fonctionnalités applicatives encore.',
      expectedCommand: 'claude "Initialize a Next.js 15 project in the feedback-board directory with TypeScript, Tailwind, and App Router. Install @supabase/supabase-js and @supabase/ssr. Then create a Supabase migration file at supabase/migrations/001_schema.sql with: (1) profiles table (id uuid PK references auth.users, email text, role text default \'user\', created_at timestamp), (2) feedback_items table (id uuid PK, title text, description text, author_id uuid references profiles, status text default \'new\', created_at timestamp), (3) votes table (id uuid PK, item_id uuid references feedback_items, user_id uuid references profiles, unique constraint on item_id+user_id). Add RLS policies: anyone can SELECT feedback_items and votes, authenticated users can INSERT feedback_items and votes, only the admin role can UPDATE feedback_items status. Do NOT create any app pages or components yet."',
      hint: 'Scope à l\'initialisation du projet et au schéma de base de données. Exclus explicitement les fonctionnalités applicatives.',
    },
    {
      type: 'terminal',
      instruction: 'Maintenant dirige l\'implémentation de l\'auth. Scope : UNIQUEMENT le flux d\'auth — connexion, déconnexion, gestion de session. Pas de code de fonctionnalités.',
      expectedCommand: 'claude "Implement magic link authentication. BOUNDARIES: Only create/modify files in src/lib/supabase/ and src/app/(auth)/. Create: (1) Supabase client utilities (browser client + server client), (2) a /login page with email input and magic link send, (3) a /auth/callback route that exchanges the code for a session, (4) a sign-out server action. Do NOT create any feature pages, feedback components, or voting logic. Only auth."',
      hint: 'Scope à l\'auth uniquement — page de connexion, route de callback, utilitaires client. Pas de fonctionnalités.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 2 complétée — fondations construites !',
    },

    // === PHASE 3: CORE FEATURES ===
    {
      type: 'info',
      title: 'Phase 3 : Diriger les fonctionnalités de base (leçons 2-3, 2-10)',
      body: "Avec l'auth et la base de données en place, tu diriges les fonctionnalités de base : soumission de rétroaction, vote et gestion de statut par l'admin. Chacune est une sous-tâche scopée. L'agent sait que le schéma existe et que le flux d'auth marche — maintenant il construit la logique applicative par-dessus. Applique la direction itérative de la leçon 2-3 : si la première sortie manque quelque chose, donne des suivis ciblés plutôt que de recommencer.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige la fonctionnalité de soumission de rétroaction. Scope : formulaire de soumission et server action uniquement.',
      expectedCommand: 'claude "Implement feedback submission. Create a SubmitFeedback component (client component with form) and a server action that inserts into feedback_items. The form has: title (required, max 100 chars), description (optional, max 500 chars). After submission, revalidate the main page. Place the component at src/components/submit-feedback.tsx and the action at src/app/actions/feedback.ts. The submit button should be disabled for anonymous users with a message to sign in first. Do NOT implement voting or status management."',
      hint: 'Une fonctionnalité : la soumission. Exclusion explicite du vote et de la gestion de statut.',
    },
    {
      type: 'terminal',
      instruction: 'Dirige la fonctionnalité de vote. Scope : logique de vote/dévote uniquement.',
      expectedCommand: 'claude "Implement voting. Create a VoteButton component and a toggleVote server action. Behavior: if the user has not voted on this item, insert a vote. If they have already voted, delete their vote (toggle). Show the current vote count and whether the current user has voted (filled vs outline icon). Place component at src/components/vote-button.tsx and action at src/app/actions/vote.ts. Do NOT modify the submission flow or add admin features."',
      hint: 'Une fonctionnalité : le toggle de vote. Ne touche pas à la soumission ni à l\'admin.',
    },
    {
      type: 'terminal',
      instruction: 'Dirige la gestion de statut admin. Scope : mise à jour de statut uniquement, admin seulement.',
      expectedCommand: 'claude "Implement admin status management. Create a StatusSelect component (dropdown with options: new, in-progress, done, declined) and an updateStatus server action. The action must verify the user has role=admin before executing. The StatusSelect should only render for admin users. Place at src/components/status-select.tsx and src/app/actions/status.ts. Do NOT modify existing components. Do NOT add any other admin features."',
      hint: 'Une fonctionnalité : le statut admin. Vérifie que la vérification d\'auth est incluse.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 3 complétée — fonctionnalités de base construites !',
    },

    // === PHASE 4: INTERFACE ===
    {
      type: 'info',
      title: 'Phase 4 : Diriger l\'interface (compétences visuelles de la leçon 2-9)',
      body: "Les composants existent mais ils doivent être assemblés en une interface cohésive. C'est ici que tes compétences de direction visuelle comptent. Tu vas diriger l'agent pour construire la page du tableau — composer les composants, établir la mise en page, et implémenter l'UI de filtre. Applique les contraintes de spec visuel : système d'espacement, hiérarchie, comportement responsive. Puis évalue la sortie avec ton filtre de goût.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige la mise en page de la page principale du tableau et le filtre de statut. Inclus des contraintes visuelles.',
      expectedCommand: 'claude "Build the main board page at src/app/page.tsx. Layout: header with app title + sign-in/out button, followed by the board. Board structure: filter bar (status pills: All, New, In Progress, Done, Declined) above a grid of feedback items. Each item card shows: title, description (truncated to 2 lines), vote button with count, status badge, author email. VISUAL CONSTRAINTS: mobile single-column, md:grid-cols-2. Card padding p-5, gap-4 between cards. Clear typographic hierarchy: page title text-2xl font-bold, card title text-base font-semibold, description text-sm text-muted-foreground. Status badges use colored backgrounds (new=blue, in-progress=amber, done=green, declined=red) at low opacity. Sort items by vote count descending."',
      hint: 'Compose tous les composants dans une page avec des contraintes visuelles explicites de la leçon 2-9.',
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent livre la page du tableau. Les cartes ont un padding p-2, pas d\'espace entre elles, et le titre est de la même taille que la description. Quelle rétroaction donnes-tu ?',
      options: [
        '« Rends les cartes plus belles »',
        '« Augmente le padding des cartes à p-5, ajoute gap-4 entre les cartes, mets les titres de cartes en text-base font-semibold et les descriptions en text-sm text-muted-foreground »',
        '« Refais toute la page — c\'est tout croche »',
        '« Le style est correct, livre-le »',
      ],
      correctIndex: 1,
      explanation: 'De la rétroaction spécifique et actionnable avec les noms de propriétés et valeurs exactes. Ça corrige les trois problèmes (padding serré, pas d\'espace, hiérarchie plate) en une seule itération.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 4 complétée — interface peaufinée !',
    },

    // === PHASE 5: VERIFY EVERYTHING ===
    {
      type: 'info',
      title: 'Phase 5 : Tout vérifier (leçons 2-5, 2-6, 2-7, 2-8)',
      body: "Le produit est construit. Maintenant tu vérifies — systématiquement. Applique chaque compétence de vérification du Tier 2 : tests fonctionnels (est-ce que chaque critère d'acceptation marche ?), tests de cas limites (qu'est-ce qui se passe avec des états vides, du texte long, des votes simultanés ?), audit de sécurité (vérifications d'auth, politiques RLS, pas de variables d'env qui fuient), et évaluation visuelle (responsive, hiérarchie, espacement). C'est ici que la rigueur prévient la gêne.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige un test fonctionnel complet de chaque critère d\'acceptation.',
      expectedCommand: 'claude "Test every acceptance criterion from SPEC.md: (1) Start the dev server. (2) Visit the board as anonymous — verify items are visible but vote/submit buttons are disabled. (3) Sign in via magic link. (4) Submit a feedback item with title and description — verify it appears. (5) Vote on an item — verify count increments. (6) Vote again — verify it toggles off. (7) Filter by status — verify filtering works. (8) Check mobile layout at 375px — verify single column. Report pass/fail for each criterion."',
      hint: 'Parcours chaque critère d\'acceptation du spec et vérifie chacun.',
    },
    {
      type: 'terminal',
      instruction: 'Dirige un audit de sécurité sur la base de code avant le déploiement.',
      expectedCommand: 'claude "Security audit: (1) Search for any hardcoded keys, tokens, or passwords in source files. (2) Verify every server action checks authentication before mutating data. (3) Verify the updateStatus action checks for admin role specifically. (4) Confirm .env.local is in .gitignore. (5) Check that SUPABASE_SERVICE_ROLE_KEY is never imported in client components. (6) Verify RLS policies are active — no service-role bypass in client-facing code. Report findings as pass/fail checklist."',
      hint: 'Trois catégories : fuite de secrets, routes non protégées, surexposition de données.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 5 complétée — vérifié et sécurisé !',
    },

    // === PHASE 6: DEPLOY + DOCUMENT ===
    {
      type: 'info',
      title: 'Phase 6 : Déployer + Documenter (compétences de la leçon 2-11)',
      body: "La phase finale. Tu diriges l'agent à travers la configuration de déploiement, le push vers Vercel, et la documentation du projet. Applique les compétences de déploiement de la leçon 2-11 : configuration des variables d'environnement, vérification du déploiement de prévisualisation, et vérifications de préparation à la production. Puis dirige la documentation pour que le projet soit maintenable — un README qui explique comment rouler, développer et déployer.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour préparer le déploiement Vercel — variables d\'env, vérification du build et préparation à la production.',
      expectedCommand: 'claude "Prepare for Vercel deployment: (1) Verify the build succeeds with npm run build — fix any type errors or build failures. (2) Create .env.example with all required environment variables documented. (3) Verify no localhost URLs are hardcoded in source files. (4) Check that NEXT_PUBLIC_APP_URL is used instead of hardcoded URLs. (5) Verify the Vercel framework detection will work (next.config present, correct build command). Report readiness status."',
      hint: 'Vérification du build, documentation des variables d\'env et utilisation d\'URL de production.',
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour créer un README complet pour le projet.',
      expectedCommand: 'claude "Create a README.md for the feedback-board project. Include: (1) One-line description, (2) Tech stack list, (3) Local development setup (clone, install, env vars, run), (4) Supabase setup (create project, run migration, get keys), (5) Deploy to Vercel (link project, set env vars, deploy), (6) Admin setup (how to set a user as admin via Supabase SQL). Keep it concise — no fluff, just the essential commands and steps."',
      hint: 'Documentation du projet couvrant la configuration, le développement, le déploiement et la configuration admin.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 6 complétée — déployé et documenté !',
    },

    {
      type: 'match',
      instruction: 'Associe chaque compétence du Tier 2 à la phase du projet final où tu l\'utilises :',
      leftItems: ['Écriture de spec (2-1)', 'Audit de sécurité auth (2-3)', 'Discipline de scope (2-10)', 'Vérification de code (2-8)', 'Déploiement (2-11)'],
      rightItems: ['Phase 1 : Écrire le spec produit', 'Phase 2 : Diriger auth + base de données', 'Phase 3 : Diriger les fonctionnalités de base', 'Phase 5 : Tout vérifier', 'Phase 6 : Déployer + documenter'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Le projet final synthétise chaque leçon du Tier 2. L\'écriture de spec définit quoi construire. L\'audit d\'auth assure la sécurité. La discipline de scope garde chaque phase concentrée. La vérification attrape les erreurs. Le déploiement met le tout en ligne.',
    },

    // === REFLECTION ===
    {
      type: 'diagram',
      title: 'Ce que tu viens de faire',
      body: 'Tu as dirigé un agent à travers le cycle de vie complet d\'un produit sans écrire une seule ligne de code toi-même.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'idea', label: 'Idée de produit', sublabel: 'Tableau de rétroaction', shape: 'pill' },
          { id: 'spec', label: 'Spec écrit', sublabel: '5 sections, 11 critères', shape: 'rounded' },
          { id: 'built', label: 'Produit construit', sublabel: 'Auth, CRUD, vote, admin', shape: 'rect' },
          { id: 'verified', label: 'Vérifié', sublabel: 'Fonctionnel + sécurité + visuel', shape: 'diamond' },
          { id: 'shipped', label: 'Livré', sublabel: 'URL de production live', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'idea', to: 'spec', label: 'Leçon 2-1' },
          { from: 'spec', to: 'built', label: 'Leçons 2-2 à 2-4' },
          { from: 'built', to: 'verified', label: 'Leçons 2-5 à 2-9' },
          { from: 'verified', to: 'shipped', label: 'Leçon 2-11' },
        ],
      },
    },
    {
      type: 'info',
      title: 'Maîtrise du Tier 2 : le directeur d\'agent unique',
      body: "Tu as prouvé que tu peux prendre un produit de l'idée à la production en utilisant uniquement la direction d'agent. Tu as écrit zéro ligne de code applicatif. Tu as écrit des specs, donné des directives, évalué les sorties, et pris des décisions de jugement. C'est la nouvelle compétence : la direction de produit à la vitesse de la pensée. Au Tier 3, tu vas passer à l'échelle — diriger plusieurs agents en parallèle, orchestrer des systèmes complexes, et construire à un rythme qui était auparavant impossible. Mais la fondation, c'est ce que tu viens de démontrer : des specs clairs, une direction scopée, une vérification rigoureuse, et un déploiement confiant.",
    },
    {
      type: 'checklist',
      title: 'Checklist de complétion du projet final :',
      items: [
        'J\'ai écrit un spec produit complet en 5 sections',
        'J\'ai dirigé le schéma de base de données et l\'auth comme sous-tâches scopées',
        'J\'ai dirigé trois fonctionnalités de base avec des limites explicites',
        'J\'ai appliqué des contraintes visuelles et évalué la qualité de l\'interface',
        'J\'ai effectué des tests fonctionnels contre chaque critère d\'acceptation',
        'J\'ai complété un audit de sécurité avant le déploiement',
        'J\'ai dirigé la configuration et la vérification du déploiement',
        'J\'ai un URL de production live qui roule un logiciel construit par agent',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'TIER 2 COMPLÉTÉ ! Tu peux diriger l\'IA pour construire des produits entiers à partir de zéro. T\'es prêt pour le prochain niveau.',
    },
  ],
}

export default content
