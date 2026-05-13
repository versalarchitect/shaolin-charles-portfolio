import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Le modèle mental multi-agent',
      body: "Jusqu'ici, vous dirigiez un seul agent. C'est comme engager un seul entrepreneur pour construire toute votre maison — fondation, charpente, plomberie, électricité — une tâche à la fois. Ça fonctionne, mais c'est péniblement lent. Aujourd'hui, vous apprenez à penser comme un entrepreneur général : décomposer le travail, assigner des spécialistes et les faire travailler en parallèle.",
    },
    {
      type: 'info',
      title: 'Pourquoi c\'est important',
      body: "Une application SaaS comprend l'authentification, un tableau de bord, une couche API, le traitement des paiements et une page d'accueil. Un seul agent construit tout ça en séquence — environ 45 minutes au total. Avec une bonne décomposition, cinq agents construisent simultanément en moins de 10 minutes. Même qualité, 4x plus rapide. Mais seulement si vous décomposez correctement.",
    },

    // === DIAGRAM 1: Serial vs Parallel ===
    {
      type: 'interactive-diagram',
      title: 'Exécution séquentielle vs parallèle',
      body: "Voici le changement fondamental de modèle mental. L'exécution séquentielle est sûre mais lente. L'exécution parallèle lance les tâches indépendantes simultanément. Parcourez les étapes pour voir comment l'orchestrateur coordonne.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'orch', label: 'Orchestrateur', sublabel: 'Vous', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Tâche A', sublabel: 'Auth', shape: 'rect' },
          { id: 'b', label: 'Tâche B', sublabel: 'API', shape: 'rect' },
          { id: 'c', label: 'Tâche C', sublabel: 'UI', shape: 'rect' },
          { id: 'merge', label: 'Fusion', sublabel: 'Intégration', shape: 'rect' },
          { id: 'done', label: 'Terminé', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'orch', to: 'a', label: 'parallèle' },
          { from: 'orch', to: 'b', label: 'parallèle' },
          { from: 'orch', to: 'c', label: 'parallèle' },
          { from: 'a', to: 'merge' },
          { from: 'b', to: 'merge' },
          { from: 'c', to: 'merge' },
          { from: 'merge', to: 'done' },
        ],
      },
      stages: [
        {
          highlightNodes: ['orch'],
          explanation: 'Vous êtes l\'orchestrateur. Au lieu de diriger un agent à travers chaque tâche séquentiellement, vous décomposez le travail et répartissez plusieurs agents simultanément.',
        },
        {
          highlightNodes: ['orch', 'a', 'b', 'c'],
          highlightEdges: [{ from: 'orch', to: 'a' }, { from: 'orch', to: 'b' }, { from: 'orch', to: 'c' }],
          explanation: 'Fan-out : trois agents démarrent en même temps, chacun sur une tâche indépendante. Auth, API et UI s\'exécutent en parallèle car ils ne dépendent pas les uns des autres.',
        },
        {
          highlightNodes: ['a', 'b', 'c', 'merge'],
          highlightEdges: [{ from: 'a', to: 'merge' }, { from: 'b', to: 'merge' }, { from: 'c', to: 'merge' }],
          explanation: 'Fan-in : quand tous les agents ont fini, leur travail converge à l\'étape de fusion. C\'est ici que vous intégrez les pièces et résolvez les incompatibilités d\'interface.',
        },
        {
          highlightNodes: ['merge', 'done'],
          highlightEdges: [{ from: 'merge', to: 'done' }],
          explanation: 'Après l\'intégration, le projet est complet. Temps réel : la durée de l\'agent le plus lent plus le temps de fusion. Bien plus rapide que le séquentiel.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Vous voyez le graphe. Séquentiel = une chaîne. Parallèle = un éventail.',
    },

    // === TASK DECOMPOSITION ===
    {
      type: 'multiple-choice',
      question: 'La décomposition des tâches consiste à diviser un produit en unités de travail adaptées à un agent. Quelle est la règle d\'or de la propriété des fichiers en multi-agent ?',
      options: [
        'Chaque agent devrait travailler sur les plus petits fichiers possibles',
        'Les agents devraient partager des fichiers pour rester au courant des changements des autres',
        'Si deux agents doivent écrire dans le même fichier, votre décomposition est mauvaise',
        'La propriété des fichiers n\'a pas d\'importance tant que les agents travaillent sur des fonctionnalités différentes',
      ],
      correctIndex: 2,
      explanation: 'L\'accès partagé aux fichiers est la cause numéro un d\'échec multi-agent. Si deux agents doivent écrire dans le même fichier, restructurez pour que chaque agent possède ses fichiers exclusivement. Chaque unité de travail doit avoir des frontières claires, posséder des fichiers spécifiques et être testable indépendamment.',
    },
    {
      type: 'multiple-choice',
      question: 'Deux agents doivent tous les deux modifier `src/App.tsx` pour ajouter leurs routes. Que devez-vous faire ?',
      options: [
        'Les laisser tous les deux l\'éditer et fusionner manuellement',
        'Faire faire les deux ajouts de routes par un seul agent',
        'Créer un fichier de configuration des routes dans lequel chaque agent écrit séparément',
        'Exécuter les agents séquentiellement pour éviter les conflits',
      ],
      correctIndex: 2,
      explanation: "Restructurez pour que chaque agent possède ses fichiers. Un patron de configuration de routes (par ex., chaque fonctionnalité exporte ses routes depuis son propre répertoire) élimine complètement le problème de fichier partagé. L'exécution séquentielle fonctionne mais annule l'avantage du parallélisme.",
    },
    {
      type: 'checklist',
      title: 'Qu\'est-ce qui fait une bonne tâche pour un agent ?',
      items: [
        'Descriptible en une phrase (« Construire le flux d\'auth avec login, inscription et réinitialisation du mot de passe »)',
        'Possède des fichiers spécifiques — aucun chevauchement avec d\'autres tâches',
        'A un contrat d\'entrée clair (forme de l\'API, interface des props, variables d\'environnement)',
        'Testable indépendamment — vous pouvez vérifier que ça fonctionne isolément',
        'Prend 5-15 minutes à un agent — pas 2, pas 60',
        'Produit un artéfact fonctionnel (une page, un endpoint, un composant)',
      ],
    },

    // === DIAGRAM 2: Task Dependency Graph ===
    {
      type: 'interactive-diagram',
      title: 'Graphe de dépendances des tâches',
      body: "Un vrai produit SaaS décomposé en flux de travail parallèles. Parcourez les étapes pour voir quelles tâches peuvent s'exécuter en parallèle et lesquelles doivent attendre.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'spec', label: 'Spec', sublabel: 'Contrats', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Auth', sublabel: 'Login/Inscription', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: 'Endpoints', shape: 'rect' },
          { id: 'ui', label: 'UI', sublabel: 'Tableau de bord', shape: 'rect' },
          { id: 'pay', label: 'Paiements', sublabel: 'Stripe', shape: 'rect' },
          { id: 'int', label: 'Intégration', shape: 'rect' },
          { id: 'deploy', label: 'Déploiement', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'auth', label: 'indépendant' },
          { from: 'spec', to: 'api', label: 'indépendant' },
          { from: 'api', to: 'ui', label: 'dépend de' },
          { from: 'auth', to: 'pay', label: 'dépend de' },
          { from: 'auth', to: 'int' },
          { from: 'api', to: 'int' },
          { from: 'ui', to: 'int' },
          { from: 'pay', to: 'int' },
          { from: 'int', to: 'deploy' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'auth' }, { from: 'spec', to: 'api' }],
          explanation: 'Étape 0 : Vous définissez le spec et les contrats partagés en premier. Ça prend 5 minutes et active tout ce qui suit. Types, formes API, schéma de base de données.',
        },
        {
          highlightNodes: ['auth', 'api'],
          explanation: 'Étape 1 : Auth et API peuvent démarrer immédiatement en parallèle — ils sont indépendants. Chacun possède ses propres fichiers et travaille avec les contrats partagés.',
        },
        {
          highlightNodes: ['ui', 'pay'],
          highlightEdges: [{ from: 'api', to: 'ui' }, { from: 'auth', to: 'pay' }],
          explanation: 'Étape 2 : L\'UI dépend du contrat API (a besoin des formes de réponse). Les Paiements dépendent de l\'Auth (a besoin du contexte utilisateur). Ceux-ci démarrent après la fin de leurs dépendances.',
        },
        {
          highlightNodes: ['int', 'deploy'],
          highlightEdges: [{ from: 'int', to: 'deploy' }],
          explanation: 'Étape 3 : L\'intégration fusionne toutes les pièces. Vous branchez les routes, testez les interfaces, résolvez les incompatibilités. Puis déployez le produit unifié.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Dans le graphe de dépendances ci-dessus, quelles tâches peuvent démarrer en même temps ?',
      options: [
        'Auth, API, UI et Paiements',
        'Auth et API seulement',
        'Toutes les tâches peuvent s\'exécuter simultanément',
        'Auth, API et Paiements',
      ],
      correctIndex: 1,
      explanation: "Seules Auth et API sont indépendantes au départ. L'UI dépend du contrat API (formes de réponse), et les Paiements dépendent de l'Auth (contexte utilisateur). Vous définissez d'abord les spécifications/contrats, puis lancez Auth et API en parallèle.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Vous savez lire un graphe de dépendances et identifier les opportunités de parallélisme.',
    },

    // === THE SPEC / CONTRACTS STEP ===
    {
      type: 'multiple-choice',
      question: 'Avant qu\'un agent commence à coder, vous définissez les contrats partagés (interfaces, formes API, types). Pourquoi cette étape est-elle critique pour le travail parallèle ?',
      options: [
        'Ça rend le compilateur TypeScript content',
        'Ça empêche les agents de faire des suppositions raisonnables mais incompatibles sur les formes de données',
        'Ça donne aux agents quelque chose à lire en attendant leur tour',
        'C\'est nécessaire seulement pour les équipes de plus de 3 agents',
      ],
      correctIndex: 1,
      explanation: 'Sans contrats partagés, l\'agent A pourrait définir un User avec un champ « name » tandis que l\'agent B attend « firstName » et « lastName ». Le fichier de contrats est écrit une fois par vous, importé par chaque agent, et modifié par aucun. Ça prend 5 minutes et prévient des heures de douleur à l\'intégration.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ce fichier de contrats partagé que tous les agents importeront. Aucun agent ne le modifie — vous l\'écrivez avant qu\'ils commencent :',
      language: 'typescript',
      filename: 'src/types/contracts.ts',
      template: '// Written by YOU before agents start\n// Every agent imports from this file — none modify it\n\nexport interface User {\n  id: {{idType}}\n  email: string\n  role: {{roleType}}\n}\n\nexport interface ApiResponse<T> {\n  data: T\n  error: {{errorType}}\n}\n\nexport interface DashboardStats {\n  revenue: number\n  users: number\n  churn: {{churnType}}\n}',
      blanks: [
        { id: 'idType', answer: 'string', alternatives: ['String'], placeholder: 'quel type pour les IDs ?', hint: 'Les UUIDs sont représentés par ce type en TypeScript' },
        { id: 'roleType', answer: "'admin' | 'member'", alternatives: ['"admin" | "member"', "'admin'|'member'", '"admin"|"member"'], placeholder: 'quel type union ?', hint: 'Une union de types littéraux de chaîne pour les deux rôles' },
        { id: 'errorType', answer: 'string | null', alternatives: ['string|null', 'null | string'], placeholder: 'erreur ou pas d\'erreur ?', hint: 'Le champ erreur est une chaîne quand présent, ou absent' },
        { id: 'churnType', answer: 'number', alternatives: ['Number'], placeholder: 'quel type pour les métriques ?', hint: 'Le taux de désabonnement est une valeur numérique comme le revenu et les utilisateurs' },
      ],
      explanation: 'Chaque type de champ est une décision qui prévient la divergence. Si vous laissez le type User.role non spécifié, un agent pourrait utiliser des chaînes tandis qu\'un autre utilise un enum. Le fichier de contrats est la source unique de vérité.',
    },
    {
      type: 'code-input',
      instruction: 'Vous définissez le contrat pour un agent de paiements. Il a besoin d\'une fonction qui prend un ID utilisateur et un montant, puis retourne un ID d\'intention de paiement. Écrivez la signature de type TypeScript :',
      placeholder: 'type CreatePayment = ...',
      answer: 'type CreatePayment = (userId: string, amount: number) => Promise<string>',
      hint: 'Un type de fonction avec deux paramètres (userId: string, amount: number) retournant Promise<string>',
    },

    // === AGENT DISPATCH PATTERN ===
    {
      type: 'code-fill',
      instruction: 'Complétez ce plan de répartition CLAUDE.md qui assigne des agents en parallèle avec propriété exclusive des fichiers :',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Parallel Tasks — Run Simultaneously\n\n### Agent 1: Auth (owns {{authDir}})\nBuild login, signup, and password reset.\nUse the User type from src/types/contracts.ts.\nWrite tests in src/auth/__tests__/.\n\n### Agent 2: API (owns {{apiDir}})\nBuild REST endpoints for dashboard stats.\nUse {{responseType}} from src/types/contracts.ts.\nWrite tests in src/api/__tests__/.\n\n### Agent 3: Landing Page (owns {{marketingDir}})\nBuild the marketing landing page.\nNo dependencies on other agents.\n{{staticNote}}.',
      blanks: [
        { id: 'authDir', answer: 'src/auth/*', alternatives: ['src/auth'], placeholder: 'quel répertoire ?', hint: 'L\'agent auth possède tous les fichiers sous src/auth/' },
        { id: 'apiDir', answer: 'src/api/*', alternatives: ['src/api'], placeholder: 'quel répertoire ?', hint: 'L\'agent API possède tous les fichiers sous src/api/' },
        { id: 'responseType', answer: 'ApiResponse<T>', alternatives: ['ApiResponse', 'ApiResponse<T> type'], placeholder: 'quel type partagé ?', hint: 'Le wrapper de réponse générique du fichier de contrats' },
        { id: 'marketingDir', answer: 'src/marketing/*', alternatives: ['src/marketing'], placeholder: 'quel répertoire ?', hint: 'L\'agent landing page possède tous les fichiers sous src/marketing/' },
        { id: 'staticNote', answer: 'Static content only', alternatives: ['Static content', 'static content only'], placeholder: 'quel type de contenu ?', hint: 'La landing page n\'a aucune dépendance — elle est purement statique' },
      ],
      explanation: 'Chaque agent a une propriété exclusive des fichiers (aucun chevauchement), importe d\'un contrat partagé (lecture seule), et a un périmètre clair en une phrase. C\'est le patron de répartition qui rend le travail parallèle sûr.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Vous comprenez les contrats et le patron de répartition.',
    },

    // === DIAGRAM 3: When NOT to Parallelize ===
    {
      type: 'interactive-diagram',
      title: 'Quand NE PAS paralléliser',
      body: "Toutes les tâches ne bénéficient pas de l'exécution parallèle. Parcourez cet arbre de décision pour apprendre quand paralléliser et quand sérialiser.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'task', label: 'Nouvelle tâche', shape: 'rounded' },
          { id: 'state', label: 'État partagé ?', shape: 'diamond' },
          { id: 'serial', label: 'Série', sublabel: 'Un à la fois', shape: 'rect' },
          { id: 'files', label: 'Fichiers propres ?', shape: 'diamond' },
          { id: 'parallel', label: 'Paralléliser', shape: 'pill', highlight: true },
          { id: 'coord', label: 'Coordonner', sublabel: 'Restructurer', shape: 'rect' },
        ],
        edges: [
          { from: 'task', to: 'state' },
          { from: 'state', to: 'serial', label: 'oui' },
          { from: 'state', to: 'files', label: 'non' },
          { from: 'files', to: 'parallel', label: 'oui' },
          { from: 'files', to: 'coord', label: 'non' },
        ],
      },
      stages: [
        {
          highlightNodes: ['task'],
          highlightEdges: [{ from: 'task', to: 'state' }],
          explanation: 'Commencez avec une nouvelle tâche que vous voulez paralléliser. La première question : cette tâche partage-t-elle un état mutable avec une autre tâche ?',
        },
        {
          highlightNodes: ['state', 'serial'],
          highlightEdges: [{ from: 'state', to: 'serial' }],
          explanation: 'Si les tâches partagent un état (même table de base de données, même store Zustand, même fichier de config), exécutez-les en série. L\'état partagé est la catégorie la plus dangereuse pour le travail parallèle.',
        },
        {
          highlightNodes: ['state', 'files'],
          highlightEdges: [{ from: 'state', to: 'files' }],
          explanation: 'Si les tâches NE partagent PAS d\'état, posez la question suivante : possèdent-elles chacune leurs propres fichiers sans chevauchement ?',
        },
        {
          highlightNodes: ['files', 'parallel'],
          highlightEdges: [{ from: 'files', to: 'parallel' }],
          explanation: 'Si chaque tâche possède ses fichiers exclusivement — parallélisez en confiance. Pas d\'état partagé, pas de fichiers partagés, pas de conflits.',
        },
        {
          highlightNodes: ['files', 'coord'],
          highlightEdges: [{ from: 'files', to: 'coord' }],
          explanation: 'Si les tâches touchent des fichiers qui se chevauchent, restructurez d\'abord. Extrayez le code partagé dans un module, créez un patron de configuration, ou divisez le fichier. Puis parallélisez.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Deux agents doivent ajouter des éléments au même store Zustand. Que dit l\'arbre de décision ?',
      options: [
        'Paralléliser — Zustand gère la concurrence',
        'Exécuter en série — ils partagent un état',
        'Coordonner — restructurer le store en tranches que chaque agent possède',
        'B et C sont tous les deux valides',
      ],
      correctIndex: 3,
      explanation: "Un état partagé signifie soit exécuter en série (sûr, simple), soit restructurer pour que chaque agent possède une tranche de store séparée (parallèle, demande du travail en amont). Les deux sont valides — la mauvaise réponse est de paralléliser aveuglément.",
    },

    // === FAILURE MODES ===
    {
      type: 'order',
      instruction: 'Classez ces modes d\'échec multi-agent du PLUS fréquent (en haut) au MOINS fréquent :',
      items: [
        'Conflits de fichiers partagés (deux agents éditent le même fichier)',
        'Hypothèses incohérentes (les agents ne s\'accordent pas sur les formes de données)',
        'Échecs d\'intégration (les pièces ne se connectent pas à la fusion)',
        'Travail en double (les agents construisent la même chose sans le savoir)',
      ],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'multiple-choice',
      question: 'Comment empêcher les agents de faire des suppositions incohérentes (par ex., l\'agent A attend User.name tandis que l\'agent B attend User.firstName) ?',
      options: [
        'Laisser les agents décider individuellement et réconcilier au moment de la fusion',
        'Définir les contrats partagés (types, interfaces) avant que tout agent ne commence',
        'Utiliser le même modèle d\'IA pour tous les agents pour qu\'ils fassent les mêmes suppositions',
        'Faire lire à chaque agent le code des autres agents d\'abord',
      ],
      correctIndex: 1,
      explanation: 'Les contrats partagés définis avant le démarrage des agents sont la prévention. Les conflits de fichiers partagés sont prévenus par la propriété exclusive. Les échecs d\'intégration en planifiant l\'étape de fusion. Le travail en double en donnant un périmètre non chevauchant.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Vous connaissez les modes d\'échec et comment les prévenir.',
    },

    // === MATCH EXERCISE ===
    {
      type: 'match',
      instruction: 'Associez chaque stratégie de décomposition à son meilleur cas d\'utilisation :',
      leftItems: [
        'Fan-out / Fan-in',
        'Pipeline',
        'Specialist delegation',
        'Competitive',
      ],
      rightItems: [
        'Traiter les données à travers des étapes séquentielles',
        'Exécuter des tâches identiques en parallèle, fusionner les résultats',
        'Diriger les tâches vers des agents experts du domaine',
        'Faire résoudre le même problème par plusieurs agents, choisir le meilleur',
      ],
      correctPairs: { 0: 1, 1: 0, 2: 2, 3: 3 },
      explanation: 'Fan-out parallélise le travail identique. Pipeline enchaîne les étapes séquentielles. La délégation spécialisée route par expertise. La redondance compétitive assure la qualité par la comparaison.',
    },

    // === PROMPT LAB: DECOMPOSITION PROMPT ===
    {
      type: 'prompt-lab',
      instruction: "Écrivez un prompt de décomposition qui divise la construction d'un tableau de bord SaaS en tâches adaptées aux agents avec des frontières claires.",
      scenario: "Vous devez construire un tableau de bord SaaS avec authentification utilisateur, une page de visualisation de données, une couche API et une page de facturation. Écrivez un prompt pour répartir plusieurs agents en parallèle.",
      starterPrompt: 'Construis le tableau de bord avec plusieurs agents.',
      responses: [
        {
          triggerKeywords: ['owns', 'boundary', 'contract', 'file ownership', 'interface', 'possède', 'frontière', 'contrat', 'propriété'],
          response: "Compris. Je répartis 4 agents avec propriété exclusive des fichiers :\n\n- Agent 1 (Auth) : src/auth/* — login, inscription, gestion de session\n- Agent 2 (API) : src/api/* — endpoints REST, types de réponse\n- Agent 3 (Dashboard) : src/dashboard/* — graphiques, tableaux, filtres\n- Agent 4 (Facturation) : src/billing/* — intégration Stripe, factures\n\nContrat partagé : src/types/contracts.ts (lecture seule pour tous les agents)\n\nDémarrage de l'exécution parallèle...",
          quality: 'excellent',
          feedback: "Vous avez spécifié les rôles des agents, les frontières de propriété des fichiers et les contrats partagés. Chaque agent a un périmètre clair et sans chevauchement. C'est de la décomposition de niveau production.",
        },
        {
          triggerKeywords: ['agent', 'auth', 'api', 'dashboard', 'billing', 'facturation', 'tableau'],
          response: "Je configure les agents :\n\n- Agent 1 : Construire l'authentification\n- Agent 2 : Construire l'API\n- Agent 3 : Construire l'interface du tableau de bord\n- Agent 4 : Construire la facturation\n\nDois-je définir les types partagés d'abord ? Quels fichiers chaque agent devrait-il posséder ?",
          quality: 'good',
          feedback: "Vous avez identifié les bons rôles d'agents, mais sans propriété explicite des fichiers et contrats, les agents posent des questions de suivi. Spécifiez quels répertoires chaque agent possède et définissez l'interface partagée en amont.",
        },
        {
          triggerKeywords: ['construis', 'tableau', 'multiple', 'plusieurs'],
          response: "Je vais construire tout le tableau de bord ! Je commence par l'auth, puis l'API, puis l'UI, puis la facturation. Je gère tout séquentiellement pour éviter les conflits.\n\nCréation de src/app/...",
          quality: 'poor',
          feedback: "Trop vague. L'agent est retombé sur l'exécution séquentielle car il n'y avait pas de frontières définies. Sans règles de propriété des fichiers, il ne peut pas paralléliser en sécurité. Spécifiez les rôles des agents, les répertoires possédés et les contrats partagés.",
        },
      ],
      fallbackResponse: {
        response: "Je vais construire le tableau de bord. Je déterminerai la répartition des agents au fur et à mesure...",
        feedback: "Votre prompt a besoin de trois choses : (1) des rôles d'agents explicites avec des descriptions en une phrase, (2) des frontières de propriété des fichiers pour que les agents ne touchent jamais les mêmes fichiers, et (3) un fichier de contrats partagé que tous les agents lisent mais qu'aucun ne modifie.",
      },
    },

    // === COMPARE: MONOLITHIQUE vs MULTI-AGENT ===
    {
      type: 'compare',
      title: 'Agent unique vs flotte d\'agents',
      body: 'La même construction de tableau de bord SaaS, deux approches. Un seul agent qui fait tout séquentiellement versus quatre agents travaillant en parallèle avec des frontières claires.',
      question: 'Quelle approche finit plus vite avec moins de problèmes d\'intégration ?',
      correctSide: 'right',
      left: {
        label: 'Agent unique (Séquentiel)',
        content: "1. Construire l'auth (10 min)\n2. Construire l'API (10 min)\n3. Construire l'UI tableau de bord (12 min)\n4. Construire la facturation (8 min)\n5. Total : ~40 minutes\n\nRisques :\n- La fenêtre de contexte se remplit à l'étape 3\n- L'agent oublie les décisions antérieures\n- Un échec bloque tout\n- Aucun parallélisme possible",
      },
      right: {
        label: 'Flotte d\'agents (Parallèle)',
        content: "Phase 0 : Définir les contrats (5 min, vous)\nPhase 1 : 4 agents en parallèle (12 min)\n  - Agent Auth : src/auth/*\n  - Agent API : src/api/*\n  - Agent Dashboard : src/dashboard/*\n  - Agent Facturation : src/billing/*\nPhase 2 : Fusion d'intégration (3 min)\nTotal : ~20 minutes\n\nAvantages :\n- Chaque agent a un contexte focalisé\n- Les échecs sont isolés\n- 2x plus rapide en temps réel",
      },
      explanation: "L'approche en flotte est plus rapide car les tâches indépendantes s'exécutent simultanément. Chaque agent opère avec un contexte focalisé (pas d'épuisement du contexte), et les échecs d'un agent ne bloquent pas les autres. Le coût initial de définition des contrats se rentabilise largement.",
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'multiple-choice',
      question: 'Vous construisez une application de gestion de tâches avec auth, une interface Kanban, une API REST et des mises à jour en temps réel via WebSocket. Quelles tâches peuvent démarrer en parallèle dès le début ?',
      options: [
        'Auth, API, UI et WebSocket — les quatre sont indépendantes',
        'Auth, API et WebSocket — l\'UI Kanban a besoin des formes de réponse API d\'abord',
        'Seulement Auth et API — tout le reste en dépend',
        'Aucune — elles doivent toutes s\'exécuter séquentiellement',
      ],
      correctIndex: 1,
      explanation: 'Auth, API et WebSocket sont indépendantes et peuvent démarrer en parallèle. L\'UI Kanban a besoin de connaître la forme des objets tâche retournés par l\'API (titre, statut, assigné, etc.). Sans ce contrat, l\'agent UI devinerait les structures de données.',
    },
    {
      type: 'code-input',
      instruction: 'Listez les tâches indépendantes qui peuvent démarrer en parallèle dès le début (séparées par des virgules, en minuscules) :',
      placeholder: 'tâche1, tâche2, ...',
      answer: 'auth, api, websocket',
      hint: 'Quelles fonctionnalités ne dépendent pas de l\'existence préalable d\'autres fonctionnalités ? L\'UI Kanban a besoin des formes de réponse API.',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi l\'interface Kanban ne peut-elle pas démarrer en même temps que Auth et API ?',
      options: [
        'L\'UI est toujours la dernière chose construite',
        'L\'UI a besoin des formes de réponse API pour typer ses composants',
        'L\'UI nécessite que l\'authentification soit complète d\'abord',
        'L\'UI est trop complexe pour un seul agent',
      ],
      correctIndex: 1,
      explanation: "Le tableau Kanban a besoin de connaître la forme des objets tâche retournés par l'API (titre, statut, assigné, etc.). Sans ce contrat, l'agent UI devinerait les structures de données. Solution : définir le contrat d'abord, puis l'UI peut aussi tourner en parallèle.",
    },
    {
      type: 'terminal',
      instruction: 'Créez la structure de répertoires pour le travail en parallèle. Créez les répertoires pour chaque domaine d\'agent :',
      expectedCommand: 'mkdir -p src/auth src/api src/board src/realtime',
      hint: 'Utilisez mkdir -p pour créer les répertoires auth, api, board et realtime sous src/',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez cette documentation de graphe de tâches qui assigne les agents aux phases avec propriété claire et dépendances :',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Task Graph\n\n### Phase 1 — Contracts (you, 5 min)\nDefine types in {{typesFile}}\n\n### Phase 2 — Parallel Agents\n- Agent A: Auth → {{authOwnership}} (independent)\n- Agent B: API → {{apiOwnership}} (independent)\n- Agent C: WebSocket → {{wsOwnership}} (independent)\n\n### Phase 3 — Dependent Work\n- Agent D: Kanban UI → src/board/*\n  (after {{dependency}} is defined)',
      blanks: [
        { id: 'typesFile', answer: 'src/types/task.ts', alternatives: ['src/types/contracts.ts', 'src/types/task'], placeholder: 'quel fichier ?', hint: 'Le fichier de types partagé pour l\'app de gestion de tâches' },
        { id: 'authOwnership', answer: 'src/auth/*', alternatives: ['src/auth'], placeholder: 'quel répertoire ?', hint: 'L\'agent A possède tous les fichiers auth' },
        { id: 'apiOwnership', answer: 'src/api/*', alternatives: ['src/api'], placeholder: 'quel répertoire ?', hint: 'L\'agent B possède tous les fichiers API' },
        { id: 'wsOwnership', answer: 'src/realtime/*', alternatives: ['src/realtime', 'src/websocket/*'], placeholder: 'quel répertoire ?', hint: 'L\'agent C possède tous les fichiers realtime/WebSocket' },
        { id: 'dependency', answer: 'API contract', alternatives: ['api contract', 'the API contract', 'API response shapes', 'contrat API', 'le contrat API'], placeholder: 'quelle dépendance ?', hint: 'L\'UI Kanban a besoin de connaître les formes de données de l\'API' },
      ],
      explanation: 'Chaque agent obtient une propriété exclusive des fichiers, travaille avec les types partagés, et les dépendances sont explicites. L\'UI Kanban attend le contrat API pour typer correctement ses composants.',
    },
    {
      type: 'multiple-choice',
      question: 'L\'UI Kanban dépend des formes de réponse API. Comment faire démarrer l\'agent UI en parallèle avec l\'agent API au lieu d\'attendre ?',
      options: [
        'Faire deviner les formes de réponse à l\'agent UI et corriger plus tard',
        'Définir le contrat API (formes de réponse, chemins d\'endpoints) en amont pour que les deux agents travaillent avec le même contrat',
        'Donner à l\'agent UI accès au worktree de l\'agent API pour qu\'il puisse lire le code',
        'Démarrer l\'agent UI avec des données fictives et ne jamais le connecter à la vraie API',
      ],
      correctIndex: 1,
      explanation: 'Si vous définissez le contrat API en amont, l\'agent UI PEUT démarrer en parallèle avec l\'agent API. Les deux travaillent contre le contrat — l\'API l\'implémente, l\'UI le consomme. C\'est comme ça que vous passez de 3 agents parallèles à 4.',
    },
    {
      type: 'checklist',
      title: 'Liste de vérification de préparation multi-agent',
      items: [
        'Je peux identifier quand un projet bénéficie de plusieurs agents',
        'Je décompose les produits en tâches avec propriété exclusive des fichiers',
        'Je définis les contrats partagés avant de répartir les agents',
        'Je dessine des graphes de dépendances pour trouver les opportunités de parallélisme',
        'Je connais les quatre modes d\'échec courants et comment les prévenir',
        'Je comprends l\'arbre de décision : état partagé ? fichiers propres ? paralléliser ou sérialiser ?',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Leçon terminée. Vous pensez en graphes maintenant, plus en chaînes.',
    },
  ],
}

export default content
