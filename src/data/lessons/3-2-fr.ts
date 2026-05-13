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
      type: 'interactive-diagram',
      title: 'Sans contexte partagé : décisions divergentes',
      body: "Parcourez les étapes pour voir comment les agents parallèles divergent sans fichier de contexte partagé.",
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
      stages: [
        {
          highlightNodes: ['you'],
          explanation: 'Vous répartissez quatre agents sans fichier de contexte partagé. Chaque agent ne reçoit que la description de sa tâche.',
        },
        {
          highlightNodes: ['a', 'b'],
          highlightEdges: [{ from: 'you', to: 'a' }, { from: 'you', to: 'b' }],
          explanation: 'L\'agent A choisit REST parce que ça semble plus simple. L\'agent B choisit GraphQL parce que ça gère mieux les requêtes complexes. Les deux sont raisonnables — mais incompatibles.',
        },
        {
          highlightNodes: ['c', 'd'],
          highlightEdges: [{ from: 'you', to: 'c' }, { from: 'you', to: 'd' }],
          explanation: 'L\'agent C nomme les fichiers en camelCase (userProfile.tsx). L\'agent D utilise le kebab-case (user-profile.tsx). Les deux sont des conventions valides — mais incohérentes ensemble.',
        },
        {
          highlightNodes: ['merge'],
          highlightEdges: [{ from: 'a', to: 'merge' }, { from: 'b', to: 'merge' }, { from: 'c', to: 'merge' }, { from: 'd', to: 'merge' }],
          explanation: 'Au moment de la fusion : REST et GraphQL se heurtent, le nommage est incohérent, les chemins d\'import cassent. Chaque agent a produit du code fonctionnel — mais du code qui contredit les autres.',
        },
      ],
    },

    // === DIAGRAM 2: With CLAUDE.md ===
    {
      type: 'interactive-diagram',
      title: 'Avec CLAUDE.md : décisions cohérentes',
      body: "Maintenant voyez ce qui se passe quand chaque agent lit CLAUDE.md en premier.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Contexte partagé', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', sublabel: 'Lit -> REST', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'Lit -> REST', shape: 'rect' },
          { id: 'c', label: 'Agent C', sublabel: 'Lit -> kebab-case', shape: 'rect' },
          { id: 'd', label: 'Agent D', sublabel: 'Lit -> kebab-case', shape: 'rect' },
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
      stages: [
        {
          highlightNodes: ['claude'],
          explanation: 'CLAUDE.md dit : REST, kebab-case, validation Zod. Ce sont des règles non négociables écrites avant que les agents ne commencent.',
        },
        {
          highlightNodes: ['claude', 'a', 'b'],
          highlightEdges: [{ from: 'claude', to: 'a' }, { from: 'claude', to: 'b' }],
          explanation: 'Les agents A et B lisent la même règle : REST avec réponses JSON. Pas de GraphQL. Ils suivent tous les deux la même approche.',
        },
        {
          highlightNodes: ['claude', 'c', 'd'],
          highlightEdges: [{ from: 'claude', to: 'c' }, { from: 'claude', to: 'd' }],
          explanation: 'Les agents C et D lisent : kebab-case.tsx pour les composants. Chaque fichier suit la même convention de nommage.',
        },
        {
          highlightNodes: ['merge'],
          highlightEdges: [{ from: 'a', to: 'merge' }, { from: 'b', to: 'merge' }, { from: 'c', to: 'merge' }, { from: 'd', to: 'merge' }],
          explanation: 'Au moment de la fusion : tout est cohérent. REST partout, kebab-case partout, Zod partout. La fusion est propre parce que chaque pièce a été construite selon la même spécification.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Vous comprenez pourquoi le contexte partagé prévient les échecs de coordination.',
    },

    // === WHAT BELONGS IN CLAUDE.MD ===
    {
      type: 'multiple-choice',
      question: 'CLAUDE.md contient les décisions que les agents doivent prendre de façon cohérente. Qu\'est-ce qui N\'a PAS sa place dans un CLAUDE.md multi-agent ?',
      options: [
        'Style API : REST avec réponses JSON',
        'Un tutoriel étape par étape sur le fonctionnement des hooks React',
        'Patrons interdits : pas de type `any`, pas de fichiers barrel',
        'Nommage des fichiers : kebab-case.tsx pour les composants',
      ],
      correctIndex: 1,
      explanation: "CLAUDE.md est pour les décisions, pas pour l'éducation. Les agents savent déjà comment fonctionnent les hooks React. Ils ont besoin de connaître les règles spécifiques de VOTRE projet — les choix qui pourraient aller dans n'importe quelle direction s'ils ne sont pas spécifiés. Pensez-y comme la constitution — les règles non négociables.",
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ce CLAUDE.md multi-agent qui empêche les agents de prendre des décisions contradictoires :',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '# Project: TaskFlow\n\n## Architecture Decisions (DO NOT DEVIATE)\n\n- **API style**: {{apiStyle}}. No GraphQL.\n- **Validation**: {{validation}} in `src/schemas/`. Every endpoint validates input.\n- **Auth**: {{authMethod}} via `src/lib/auth.ts`. No session-based auth.\n- **State management**: {{stateLib}}. No Redux, no Context for global state.\n- **Styling**: {{cssApproach}} only. No CSS modules, no styled-components.',
      blanks: [
        { id: 'apiStyle', answer: 'REST with JSON responses', alternatives: ['REST', 'REST API', 'REST with JSON'], placeholder: 'quel style API ?', hint: 'Le patron API le plus courant pour les apps web' },
        { id: 'validation', answer: 'Zod schemas', alternatives: ['Zod', 'zod schemas', 'Zod Schemas'], placeholder: 'quelle validation ?', hint: 'Bibliothèque de validation de schéma TypeScript-first' },
        { id: 'authMethod', answer: 'JWT tokens', alternatives: ['JWT', 'jwt tokens', 'JSON Web Tokens'], placeholder: 'quelle auth ?', hint: 'Authentification basée sur des tokens stateless' },
        { id: 'stateLib', answer: 'Zustand', alternatives: ['zustand'], placeholder: 'quelle lib d\'état ?', hint: 'Bibliothèque de gestion d\'état légère' },
        { id: 'cssApproach', answer: 'Tailwind CSS', alternatives: ['Tailwind', 'tailwind', 'tailwind css'], placeholder: 'quel CSS ?', hint: 'Framework CSS utilitaire' },
      ],
      explanation: 'Chaque blanc élimine une catégorie de divergence. Sans choix explicites pour le style API, la validation, l\'auth, la gestion d\'état et le styling, les agents prendront des décisions raisonnables mais incompatibles.',
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
      type: 'multiple-choice',
      question: 'Un seul CLAUDE.md racine couvre les décisions à l\'échelle du projet. Mais quand les agents travaillent dans des répertoires spécifiques, ils ont besoin de guidance spécifique. Comment Claude gère-t-il cela ?',
      options: [
        'Claude ne lit que le CLAUDE.md racine — les fichiers au niveau répertoire sont ignorés',
        'Claude lit le CLAUDE.md racine et à chaque niveau de répertoire pertinent à son travail (superposés)',
        'Claude lit chaque CLAUDE.md du projet entier peu importe l\'emplacement',
        'Vous devez copier toutes les règles dans chaque CLAUDE.md au niveau répertoire',
      ],
      correctIndex: 1,
      explanation: 'Claude lit le CLAUDE.md à chaque niveau — racine pour les règles globales, niveau répertoire pour les spécificités locales. C\'est la superposition : contexte général en haut, contexte spécifique là où le travail se fait. Les règles de répertoire ajoutent de la spécificité sans répéter les règles globales.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ce CLAUDE.md au niveau répertoire pour l\'agent API qui se superpose aux règles racine :',
      language: 'markdown',
      filename: 'src/api/CLAUDE.md',
      template: '# API Layer — Agent-Specific Context\n\n## Endpoint Pattern\nEvery route follows: `src/api/routes/{{routePattern}}.ts`\nEach file exports a Hono router with {{operations}} operations.\n\n## Response Format\nAlways wrap in: `{ data: T, error: null }` or `{ data: null, error: string }`\nUse the {{responseType}} type from `src/types/contracts.ts`.\n\n## Error Handling\n- 400: {{validationError}}\n- 401: Missing or expired JWT\n- 404: Resource not found\n- 500: Unexpected error (log full stack, return generic message)',
      blanks: [
        { id: 'routePattern', answer: '{resource}', alternatives: ['resource', '[resource]'], placeholder: 'quel patron ?', hint: 'Les routes sont organisées par nom de ressource' },
        { id: 'operations', answer: 'CRUD', alternatives: ['crud', 'Create Read Update Delete'], placeholder: 'quelles opérations ?', hint: 'Les quatre opérations de base de données de base' },
        { id: 'responseType', answer: 'ApiResponse<T>', alternatives: ['ApiResponse', 'ApiResponse<T> type'], placeholder: 'quel type ?', hint: 'Le wrapper de réponse générique des contrats partagés' },
        { id: 'validationError', answer: 'Zod validation failure (return parsed errors)', alternatives: ['Zod validation failure', 'Validation failure', 'validation error'], placeholder: 'quel type d\'erreur ?', hint: 'Échecs de validation d\'entrée utilisant la bibliothèque de schéma du CLAUDE.md racine' },
      ],
      explanation: 'Ce CLAUDE.md au niveau répertoire se superpose aux règles racine. Il ne répète pas « utiliser Zod » — c\'est dans la racine. Il spécifie COMMENT l\'agent API utilise Zod (retourner les erreurs parsées sur 400).',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ce CLAUDE.md au niveau répertoire pour l\'agent UI avec des patrons spécifiques aux composants :',
      language: 'markdown',
      filename: 'src/components/CLAUDE.md',
      template: '# UI Components — Agent-Specific Context\n\n## Component Structure\n- Props interface above component (named {{propsNaming}})\n- {{destructure}} props in function signature\n- Use forwardRef for any component that wraps an HTML element\n\n## Import Order\n1. React/framework imports\n2. Third-party libraries\n3. Internal components ({{componentAlias}})\n4. Utilities (@/lib/*)\n5. Types (@/types/*)',
      blanks: [
        { id: 'propsNaming', answer: '{Component}Props', alternatives: ['ComponentProps', '{ComponentName}Props'], placeholder: 'patron de nommage ?', hint: 'L\'interface des props est nommée d\'après le composant' },
        { id: 'destructure', answer: 'Destructure', alternatives: ['destructure', 'Destructured', 'Déstructurer'], placeholder: 'quoi faire avec les props ?', hint: 'Extraire les propriétés directement dans le paramètre de fonction' },
        { id: 'componentAlias', answer: '@/components/*', alternatives: ['@/components'], placeholder: 'quel alias d\'import ?', hint: 'Les composants internes utilisent l\'alias de chemin @' },
      ],
      explanation: 'L\'agent UI hérite des règles racine (Tailwind, Zustand, kebab-case) et ajoute des patrons spécifiques aux composants. L\'ordre des imports et le nommage des props préviennent les petites incohérences qui s\'accumulent en un codebase désordonné.',
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
      type: 'multiple-choice',
      question: 'L\'agent A utilise Axios pour HTTP, l\'agent B utilise fetch, l\'agent C crée un wrapper personnalisé. Quelle section CLAUDE.md aurait empêché cela ?',
      options: [
        'Une section « Premiers pas » tutoriel',
        'Une section « Catégories de décisions » spécifiant l\'approche HTTP unique',
        'Une section « Membres de l\'équipe » listant les responsabilités des agents',
        'Une section « Journal des modifications » suivant les modifications',
      ],
      correctIndex: 1,
      explanation: 'CLAUDE.md prévient les décisions contradictoires en rendant les choix explicites avant que tout agent ne commence. Le fetching de données, la gestion de formulaires, les bibliothèques de dates, la génération d\'ID et la gestion d\'erreurs sont les catégories principales où les agents divergent. Un choix explicite par catégorie élimine le problème.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ces catégories de décisions qui empêchent les agents de choisir des bibliothèques différentes pour le même travail :',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Decisions That Prevent Contradictions\n\n### Data Fetching\n- Client: use `{{httpClient}}` via the wrapper in `src/lib/api-client.ts`\n- No Axios, no ky, no got — one HTTP approach\n\n### Form Handling\n- {{formLib}} + Zod resolver\n- No Formik, no uncontrolled forms\n\n### Date/Time\n- {{dateLib}} for all formatting and manipulation\n- No moment.js, no dayjs, no native Date formatting',
      blanks: [
        { id: 'httpClient', answer: 'fetch', alternatives: ['Fetch', 'the fetch API'], placeholder: 'quel client HTTP ?', hint: 'L\'API native du navigateur/Node pour faire des requêtes HTTP' },
        { id: 'formLib', answer: 'React Hook Form', alternatives: ['react-hook-form', 'react hook form', 'RHF'], placeholder: 'quelle bibliothèque de formulaires ?', hint: 'La bibliothèque de formulaires React la plus populaire avec API basée sur les hooks' },
        { id: 'dateLib', answer: 'date-fns', alternatives: ['Date-fns', 'date fns', 'datefns'], placeholder: 'quelle bibliothèque de dates ?', hint: 'Bibliothèque utilitaire de dates fonctionnelle (pas moment, pas dayjs)' },
      ],
      explanation: 'Chaque décision nomme un outil et interdit explicitement les alternatives. Sans cela, vous obtenez trois bibliothèques HTTP, deux gestionnaires de formulaires, et un formatage de dates incohérent à travers votre codebase.',
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
      type: 'multiple-choice',
      question: 'Pendant une exécution parallèle, l\'agent A découvre que la bibliothèque d\'auth nécessite une initialisation asynchrone. Qui devrait mettre à jour CLAUDE.md avec cette information ?',
      options: [
        'L\'agent A devrait mettre à jour CLAUDE.md directement',
        'Tous les agents devraient s\'arrêter et discuter du changement',
        'Vous (l\'orchestrateur) mettez à jour CLAUDE.md et informez les agents concernés',
        'Pas de mise à jour nécessaire — chaque agent se débrouille indépendamment',
      ],
      correctIndex: 2,
      explanation: 'Seul l\'orchestrateur (vous) met à jour CLAUDE.md. Les agents proposent des changements ; vous décidez. Vous notez la découverte, mettez à jour le fichier, et informez sélectivement les agents dont le travail est affecté. C\'est de la coordination ciblée, pas une interruption en broadcast.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez cette mise à jour CLAUDE.md en cours de session qui propage une découverte d\'un agent à tous les autres :',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Runtime Notes (added during this session)\n\n### Auth Initialization (IMPORTANT)\nThe auth client requires {{initType}} init before any protected call:\n```typescript\nimport { initAuth } from \'@/lib/auth\'\n// Call once at app startup or route handler entry\n{{initCall}}\n```\nAny agent making authenticated requests MUST call this first.\n\n### Database: users table has new column\nAdded `{{newColumn}} DEFAULT \'{}\'` to users table.\nAgents working with user data: include this field in your types.',
      blanks: [
        { id: 'initType', answer: 'async', alternatives: ['asynchronous', 'asynchrone'], placeholder: 'sync ou async ?', hint: 'L\'initialisation nécessite un await' },
        { id: 'initCall', answer: 'await initAuth()', alternatives: ['await initAuth();'], placeholder: 'l\'appel d\'init ?', hint: 'Un appel de fonction awaité pour initialiser l\'auth' },
        { id: 'newColumn', answer: 'preferences JSONB', alternatives: ['preferences jsonb', 'preferences JSONB DEFAULT'], placeholder: 'définition de colonne ?', hint: 'Une colonne JSON pour les préférences utilisateur' },
      ],
      explanation: 'Les mises à jour en cours de session propagent les découvertes entre agents. Le besoin d\'init async et le changement de schéma affectent chaque agent faisant des appels authentifiés ou travaillant avec les données utilisateur. Sans cette mise à jour, les agents échoueraient à l\'exécution.',
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
        content: 'All agents read:\n  "Functions: camelCase"\n  "Errors: throw AppError(msg, code)"\n  "Styling: Tailwind only, no inline"\n\nAgent 1: follows rules\nAgent 2: follows rules\nAgent 3: follows rules\n\nResult: consistent codebase',
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
      type: 'multiple-choice',
      question: 'Vous allez lancer 4 agents sur un projet e-commerce : auth, catalogue produits, panier/paiement et tableau de bord admin. Quelle est la PREMIÈRE chose que vous écrivez avant de répartir un agent ?',
      options: [
        'Le composant du catalogue produits',
        'Un CLAUDE.md partagé avec les décisions d\'architecture, la propriété des fichiers, le nommage et les patrons interdits',
        'Les fichiers de migration de base de données',
        'Les descriptions de tâches individuelles pour chaque agent',
      ],
      correctIndex: 1,
      explanation: 'Le CLAUDE.md partagé vient en premier — avant tout code, avant que tout agent ne démarre. Il établit les règles qui gardent les quatre agents cohérents. Sans lui, l\'agent auth pourrait utiliser Prisma tandis que l\'agent catalogue utilise Drizzle.',
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
- src/auth/* -> Auth Agent (login, signup, session)
- src/products/* -> Catalog Agent (listing, search, detail)
- src/cart/* -> Cart Agent (add/remove, checkout, payment)
- src/admin/* -> Admin Agent (dashboard, CRUD, analytics)

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
