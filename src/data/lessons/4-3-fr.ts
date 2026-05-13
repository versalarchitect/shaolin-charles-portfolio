import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-3',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Les frontières de modules sont des unités de travail d\'agent',
      body: "Voici l'insight central de cette leçon : si deux agents doivent modifier le même fichier en même temps, votre architecture a échoué. Une frontière de module dans une codebase agent-native n'est pas juste un concept d'organisation du code — c'est une frontière de parallélisme. Chaque module devrait être modifiable indépendamment par un agent sans entrer en conflit avec tout autre agent travaillant sur tout autre module. Votre architecture EST la couche de coordination. Tracez les bonnes frontières et les agents peuvent travailler en parallèle sans conflits. Tracez-les mal et vous revenez à l'exécution en série.",
    },
    {
      type: 'info',
      title: 'Pourquoi le travail parallèle des agents compte',
      body: "La vitesse. Une flotte de 5 agents travaillant en parallèle construit 5x plus vite — mais seulement s'ils ne se bloquent jamais mutuellement. Au moment où deux agents doivent modifier le même fichier, vous avez un conflit de merge. Au moment où ils partagent un état mutable, vous avez une condition de concurrence. Au moment où la sortie d'un agent dépend de celle d'un autre, vous avez une dépendance séquentielle. Les frontières de modules sont l'outil architectural qui élimine les trois. Concevez-les intentionnellement ou subissez un surcoût de coordination qui efface l'avantage du parallélisme.",
    },

    // === THE CONFLICT MODEL ===
    {
      type: 'diagram',
      title: 'Monolithe vs modulaire : zones de conflit',
      body: 'Dans un monolithe, les agents entrent fréquemment en collision sur des fichiers partagés. Dans un système modulaire, chaque agent possède un module distinct sans chevauchement.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'monolith', label: 'Monolithique', sublabel: 'Fichiers partagés = conflits', shape: 'rounded' },
          { id: 'agent_a', label: 'Agent A', sublabel: 'Modifie routes.ts', shape: 'rect' },
          { id: 'agent_b', label: 'Agent B', sublabel: 'Modifie routes.ts', shape: 'rect' },
          { id: 'conflict', label: 'CONFLIT DE MERGE', sublabel: 'Même fichier, changements différents', shape: 'diamond' },
          { id: 'modular', label: 'Modulaire', sublabel: 'Modules isolés', shape: 'rounded', highlight: true },
          { id: 'agent_c', label: 'Agent C', sublabel: 'features/payments/', shape: 'rect' },
          { id: 'agent_d', label: 'Agent D', sublabel: 'features/orders/', shape: 'rect' },
          { id: 'success', label: 'PAS DE CONFLIT', sublabel: 'Travail indépendant', shape: 'diamond', highlight: true },
        ],
        edges: [
          { from: 'monolith', to: 'agent_a' },
          { from: 'monolith', to: 'agent_b' },
          { from: 'agent_a', to: 'conflict' },
          { from: 'agent_b', to: 'conflict' },
          { from: 'modular', to: 'agent_c' },
          { from: 'modular', to: 'agent_d' },
          { from: 'agent_c', to: 'success' },
          { from: 'agent_d', to: 'success' },
        ],
      },
    },
    {
      type: 'interactive-diagram',
      title: 'Monolithe vs modulaire : zones de conflit',
      body: 'Parcourez étape par étape comment les agents entrent en collision dans un monolithe versus travaillent indépendamment dans un système modulaire.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'monolith', label: 'Monolithique', sublabel: 'Fichiers partagés = conflits', shape: 'rounded' },
          { id: 'agent_a', label: 'Agent A', sublabel: 'Modifie routes.ts', shape: 'rect' },
          { id: 'agent_b', label: 'Agent B', sublabel: 'Modifie routes.ts', shape: 'rect' },
          { id: 'conflict', label: 'CONFLIT DE MERGE', sublabel: 'Même fichier, changements différents', shape: 'diamond' },
          { id: 'modular', label: 'Modulaire', sublabel: 'Modules isolés', shape: 'rounded', highlight: true },
          { id: 'agent_c', label: 'Agent C', sublabel: 'features/payments/', shape: 'rect' },
          { id: 'agent_d', label: 'Agent D', sublabel: 'features/orders/', shape: 'rect' },
          { id: 'success', label: 'PAS DE CONFLIT', sublabel: 'Travail indépendant', shape: 'diamond', highlight: true },
        ],
        edges: [
          { from: 'monolith', to: 'agent_a' },
          { from: 'monolith', to: 'agent_b' },
          { from: 'agent_a', to: 'conflict' },
          { from: 'agent_b', to: 'conflict' },
          { from: 'modular', to: 'agent_c' },
          { from: 'modular', to: 'agent_d' },
          { from: 'agent_c', to: 'success' },
          { from: 'agent_d', to: 'success' },
        ],
      },
      stages: [
        {
          highlightNodes: ['monolith', 'agent_a', 'agent_b'],
          highlightEdges: [{ from: 'monolith', to: 'agent_a' }, { from: 'monolith', to: 'agent_b' }],
          explanation: 'Dans un monolithe, les Agents A et B sont envoyés travailler sur des fonctionnalités différentes. Mais l\'architecture les force à modifier les mêmes fichiers partagés (routes.ts, types.ts, config.ts).',
        },
        {
          highlightNodes: ['agent_a', 'agent_b', 'conflict'],
          highlightEdges: [{ from: 'agent_a', to: 'conflict' }, { from: 'agent_b', to: 'conflict' }],
          explanation: 'Les deux agents modifient routes.ts simultanément. Quand ils ont fini, les changements ne peuvent pas être fusionnés proprement. Le travail d\'un agent doit être refait ou réconcilié manuellement. Le parallélisme est perdu.',
        },
        {
          highlightNodes: ['modular', 'agent_c', 'agent_d'],
          highlightEdges: [{ from: 'modular', to: 'agent_c' }, { from: 'modular', to: 'agent_d' }],
          explanation: 'Dans un système modulaire, l\'Agent C travaille exclusivement dans features/payments/ et l\'Agent D travaille exclusivement dans features/orders/. Chaque module possède ses propres routes, types et configuration.',
        },
        {
          highlightNodes: ['agent_c', 'agent_d', 'success'],
          highlightEdges: [{ from: 'agent_c', to: 'success' }, { from: 'agent_d', to: 'success' }],
          explanation: 'Zéro chevauchement de fichiers signifie zéro conflit. Les deux agents complètent leur travail indépendamment et les deux fusionnent proprement. Vrai parallélisme atteint par l\'architecture, pas la coordination.',
        },
      ],
    },
    {
      type: 'match',
      instruction: 'Associez chaque module à l\'agent le mieux adapté pour en être propriétaire. Considérez l\'expertise de domaine et la spécialisation.',
      leftItems: ['Module auth', 'Module paiements', 'Couche API', 'Composants UI'],
      rightItems: ['Agent-1 (focus sécurité)', 'Agent-2 (spécialiste Stripe)', 'Agent-3 (patrons REST)', 'Agent-4 (React/Tailwind)'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'La propriété de module correspond à la spécialisation de l\'agent. Auth nécessite une expertise en sécurité (Agent-1). Paiements a besoin de connaissances du domaine Stripe (Agent-2). La couche API demande une maîtrise des patrons REST (Agent-3). Les composants UI nécessitent des compétences React/Tailwind (Agent-4). Quand les modules s\'alignent avec les forces des agents, chaque agent travaille de façon autonome sans avoir besoin de connaissances inter-domaines.',
    },
    {
      type: 'info',
      title: 'La métrique du taux de conflits',
      body: "Exécutez des agents en parallèle sur des tâches réelles. Comptez combien de sessions produisent des conflits de merge ou nécessitent de la coordination. Divisez par le total de sessions. C'est votre taux de conflits. En dessous de 5% : vos frontières fonctionnent. 5-15% : de la friction existe mais c'est gérable. Au-dessus de 15% : votre architecture force le travail en série. Suivez quels fichiers causent des conflits — ce sont vos échecs de frontières. Un fichier qui cause des conflits dans 3+ sessions parallèles a besoin d'être divisé ou restructuré.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Modèle de conflits compris !',
    },

    // === INTERFACE CONTRACTS ===
    {
      type: 'info',
      title: 'Contrats d\'interface : la clé de l\'indépendance',
      body: "Deux modules ne peuvent travailler indépendamment que s'ils s'accordent sur l'interface entre eux. Un contrat d'interface définit : (1) Quels types circulent entre les modules, (2) Quelles fonctions sont appelables de l'extérieur, (3) Quels événements sont émis, (4) Quelles garanties chaque module fournit. Une fois le contrat défini, les agents qui construisent chaque module n'ont besoin de savoir RIEN sur les entrailles de l'autre module. Ils construisent selon le contrat. C'est le mécanisme qui permet un vrai travail parallèle des agents.",
    },
    {
      type: 'code-demo',
      title: 'Contrat d\'interface entre modules',
      body: 'Le contrat est défini EN PREMIER, avant toute implémentation. Les deux modules se construisent indépendamment contre cet accord partagé.',
      language: 'typescript',
      filename: 'src/contracts/order-payment.contract.ts',
      code: "/**\n * Contract: Orders → Payments\n * \n * The Orders module needs to charge customers.\n * The Payments module provides the charging capability.\n * Neither module imports the other's internal files.\n */\n\n// Types that flow between modules\nexport interface ChargeRequest {\n  orderId: string\n  customerId: string\n  amountCents: number\n  currency: 'USD' | 'EUR' | 'GBP'\n  idempotencyKey: string\n}\n\nexport interface ChargeResult {\n  success: boolean\n  transactionId?: string\n  failureReason?: string\n}\n\n// The interface that Payments exposes\nexport interface PaymentGateway {\n  charge(request: ChargeRequest): Promise<ChargeResult>\n  refund(transactionId: string, amountCents: number): Promise<ChargeResult>\n  getStatus(transactionId: string): Promise<'pending' | 'completed' | 'failed'>\n}\n\n// Events emitted by Payments (Orders subscribes)\nexport interface PaymentEvents {\n  'payment.completed': { orderId: string; transactionId: string }\n  'payment.failed': { orderId: string; reason: string }\n  'payment.refunded': { orderId: string; amountCents: number }\n}",
    },
    {
      type: 'info',
      title: 'Développement contrat-d\'abord pour les agents',
      body: "Le flux de travail change. Avant : construire le Module A, puis comprendre comment le Module B s'y connecte. Maintenant : définir le contrat entre A et B D'ABORD. Puis envoyer deux agents en parallèle — l'un construit l'implémentation de A du contrat, l'autre construit la consommation de B du contrat. Ils n'ont jamais besoin de communiquer. Ils ne modifient jamais les mêmes fichiers. Ils finissent tous les deux à peu près en même temps. Le fichier de contrat lui-même est écrit par vous (l'architecte) avant que les agents ne commencent. C'est VOTRE architecture.",
    },
    {
      type: 'multiple-choice',
      question: 'Deux agents construisent le module Orders et le module Payments en parallèle. L\'Agent A (Orders) a besoin d\'appeler la fonction charge de l\'Agent B (Payments). Comment ça devrait fonctionner ?',
      options: [
        'L\'Agent A importe directement depuis les fichiers internes de Payments et construit contre l\'implémentation actuelle',
        'L\'Agent A attend que l\'Agent B finisse, puis intègre contre le code construit',
        'Les deux agents construisent contre un contrat d\'interface pré-défini — aucun n\'a besoin de l\'implémentation de l\'autre',
        'L\'Agent A mocke le module Payments et vous les reliez manuellement plus tard',
      ],
      correctIndex: 2,
      explanation: 'Le contrat est défini avant que l\'un ou l\'autre agent ne commence. L\'Agent A construit Orders pour APPELER l\'interface du contrat. L\'Agent B construit Payments pour IMPLÉMENTER l\'interface du contrat. Aucun n\'a besoin que l\'autre existe. C\'est pourquoi le contrat-d\'abord permet un vrai parallélisme.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Contrats d\'interface maîtrisés !',
    },

    // === NEW INTERACTIVE STEPS ===
    {
      type: 'code-fill',
      instruction: 'Complétez ce contrat d\'interface que deux agents partageront. Remplissez les noms de types, types de champs et types de retour pour que les deux agents puissent construire indépendamment.',
      language: 'typescript',
      template: '// Contract: Orders module → Payments module\n// Both agents build against this shared agreement.\n\nexport interface ___ {\n  orderId: ___\n  customerId: string\n  amountCents: ___\n  currency: \'USD\' | \'EUR\'\n  idempotencyKey: string\n}\n\nexport interface ___ {\n  success: boolean\n  transactionId?: string\n  failureReason?: ___\n}\n\nexport interface PaymentGateway {\n  charge(request: ChargeRequest): Promise<___>\n  refund(transactionId: string): Promise<ChargeResult>\n}',
      blanks: [
        { id: 'request-type', answer: 'ChargeRequest', alternatives: ['PaymentRequest', 'ChargePayload'], hint: 'Nom décrivant une requête pour facturer un paiement', placeholder: 'NomDeType' },
        { id: 'id-type', answer: 'string', alternatives: [], hint: 'Le type standard pour les identifiants', placeholder: 'type' },
        { id: 'amount-type', answer: 'number', alternatives: ['int', 'integer'], hint: 'Les montants monétaires en centimes sont des nombres entiers', placeholder: 'type' },
        { id: 'result-type', answer: 'ChargeResult', alternatives: ['PaymentResult', 'ChargeResponse'], hint: 'Nom décrivant le résultat d\'une opération de facturation', placeholder: 'NomDeType' },
        { id: 'reason-type', answer: 'string', alternatives: [], hint: 'Les explications d\'échec lisibles par un humain sont du texte', placeholder: 'type' },
        { id: 'return-type', answer: 'ChargeResult', alternatives: ['PaymentResult', 'ChargeResponse'], hint: 'La méthode charge retourne le même type de résultat', placeholder: 'NomDeType' },
      ],
      filename: 'src/contracts/order-payment.contract.ts',
      explanation: 'Les contrats d\'interface définissent les types exacts qui circulent entre les modules. L\'agent Orders et l\'agent Payments construisent tous les deux contre ce contrat indépendamment. L\'agent Orders appelle charge() avec un ChargeRequest et attend un ChargeResult. L\'agent Payments implémente charge() retournant un ChargeResult. Aucun n\'a besoin de connaître l\'implémentation interne de l\'autre.',
    },
    {
      type: 'compare',
      title: 'État mutable partagé vs isolation par contrat',
      body: 'Deux approches de coordination multi-agents. L\'une crée des conflits ; l\'autre permet un vrai travail parallèle.',
      left: {
        label: 'État mutable partagé (Conflits)',
        content: '// god-file.ts — Les DEUX agents modifient\nexport const config = { ... }\nexport const routes = [ ... ]\nexport type AllTypes = { ... }\n\n// Agent A ajoute les routes paiement ici\n// Agent B ajoute les routes commande ici\n// RÉSULTAT : conflit de merge à chaque fois\n\n// Les deux agents doivent lire tout le\n// fichier pour comprendre ce que fait\n// l\'autre. Les changements sont entrelacés\n// et fragiles. Une modif peut casser l\'autre.',
        language: 'typescript',
        filename: 'god-file.ts',
      },
      right: {
        label: 'Isolation par contrat (Pas de conflits)',
        content: '// contract.ts — défini UNE FOIS par l\'architecte\nexport interface ChargeRequest { ... }\nexport interface ChargeResult { ... }\n\n// payments/payments.service.ts\n// Agent A touche UNIQUEMENT ce fichier\n// Implémente l\'interface du contrat\n\n// orders/orders.service.ts\n// Agent B touche UNIQUEMENT ce fichier\n// Appelle l\'interface du contrat\n\n// RÉSULTAT : zéro conflit, vrai parallèle\n// Chaque agent possède entièrement son\n// module. Le contrat est le seul artefact.',
        language: 'typescript',
        filename: 'contract-isolation.ts',
      },
      question: 'Quelle approche permet à deux agents de travailler simultanément sans jamais modifier le même fichier ?',
      correctSide: 'right',
      explanation: 'L\'isolation par contrat signifie que l\'architecte définit l\'interface une fois, puis chaque agent travaille exclusivement dans son propre module. Le fichier de contrat est en lecture seule pendant l\'implémentation — aucun agent ne le modifie. En revanche, l\'état mutable partagé force les deux agents à modifier le même fichier, garantissant des conflits de merge.',
    },

    // === ELIMINATING SHARED MUTABLE STATE ===
    {
      type: 'info',
      title: 'L\'état mutable partagé tue le parallélisme',
      body: "Tout fichier que plusieurs agents pourraient modifier est un état mutable partagé au niveau architectural. Coupables courants : un fichier routes.ts central qui enregistre toutes les routes (chaque nouvelle fonctionnalité ajoute une ligne). Un types.ts partagé qui accumule chaque type du système. Un objet de configuration que les modules étendent. Un fichier de migration de base de données que plusieurs fonctionnalités modifient. Chacun de ceux-ci force l'exécution en série — les agents doivent prendre leur tour pour modifier le fichier partagé, ou ils entrent en conflit.",
    },
    {
      type: 'code-demo',
      title: 'Éliminer le fichier de routes partagé',
      body: 'AVANT : chaque agent ajoute des routes à un fichier (aimant à conflits). APRÈS : chaque module enregistre ses propres routes (zéro conflit).',
      language: 'typescript',
      filename: 'routes-refactor.ts',
      code: "// ❌ BEFORE: Shared routes file (ALL agents edit this)\n// src/routes.ts\nimport { paymentsRoutes } from './features/payments'\nimport { ordersRoutes } from './features/orders'\nimport { usersRoutes } from './features/users'\nimport { notificationsRoutes } from './features/notifications'\n\nexport const routes = [\n  ...paymentsRoutes,    // Agent A adds here\n  ...ordersRoutes,      // Agent B adds here\n  ...usersRoutes,       // Agent C adds here  \n  ...notificationsRoutes, // Agent D adds here\n  // Every new feature = edit this file = conflict\n]\n\n// ✅ AFTER: Auto-discovery (NO shared file to edit)\n// src/app.ts\nimport { glob } from 'fast-glob'\n\nasync function registerRoutes(app: App) {\n  const routeFiles = await glob('src/features/*/routes.ts')\n  for (const file of routeFiles) {\n    const mod = await import(file)\n    app.register(mod.default)\n  }\n}\n\n// Each feature owns its own routes.ts — no shared file needed\n// src/features/payments/routes.ts (only Agent A touches this)\n// src/features/orders/routes.ts (only Agent B touches this)",
    },
    {
      type: 'info',
      title: 'Le problème des types partagés',
      body: "Un types.ts central ou shared/types/index.ts est un autre aimant à conflits. Solution : chaque module définit ses propres types. Les types qui traversent les frontières de modules vivent dans le fichier de contrat entre ces modules spécifiques. Il n'y a pas un seul fichier qui accumule tous les types. Si TypeA n'est utilisé que par le module payments, il vit dans payments/payments.types.ts. S'il traverse vers orders, il vit dans contracts/order-payment.contract.ts. Nulle part ailleurs.",
    },
    {
      type: 'code-demo',
      title: 'Éliminer les types partagés',
      body: 'Les types appartiennent là où ils sont utilisés. Les types inter-modules vivent dans le contrat entre ces modules spécifiques.',
      language: 'typescript',
      filename: 'type-ownership.ts',
      code: "// ❌ BEFORE: Global types file (conflict magnet)\n// src/types/index.ts\nexport interface Payment { ... }      // Used only by payments\nexport interface Order { ... }         // Used only by orders\nexport interface User { ... }          // Used only by users\nexport interface ChargeRequest { ... } // Crosses payments ↔ orders\n// Every agent adds types here → conflicts\n\n// ✅ AFTER: Types owned by their module\n// src/features/payments/payments.types.ts\nexport interface Payment {\n  id: string\n  amountCents: number\n  status: PaymentStatus\n}\n\n// src/features/orders/orders.types.ts  \nexport interface Order {\n  id: string\n  items: OrderItem[]\n  totalCents: number\n}\n\n// src/contracts/order-payment.contract.ts\n// ONLY types that cross boundaries live here\nexport interface ChargeRequest {\n  orderId: string\n  amountCents: number\n}",
    },
    {
      type: 'multiple-choice',
      question: 'Votre app a un seul fichier de migration de base de données que 3 agents doivent modifier simultanément pour leurs fonctionnalités respectives. Quelle est la meilleure solution ?',
      options: [
        'Utiliser un mécanisme de verrouillage pour que les agents prennent leur tour pour modifier le fichier',
        'Laisser les agents créer des fichiers de migration séparés (un par fonctionnalité) qui s\'exécutent en séquence',
        'Avoir un agent dédié qui gère tous les changements de base de données',
        'Utiliser une base de données NoSQL qui ne nécessite pas de migrations',
      ],
      correctIndex: 1,
      explanation: 'Des fichiers de migration séparés par fonctionnalité signifient que chaque agent crée son propre fichier (par ex., 001_add_payments_table.sql, 002_add_orders_table.sql). Pas de fichier partagé pour entrer en conflit. Le runner de migration les exécute dans l\'ordre. C\'est ainsi que fonctionne chaque ORM mature — et c\'est le patron qui permet le travail parallèle des agents sur la couche base de données.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'État partagé éliminé !',
    },

    // === DESIGNING BOUNDARIES ===
    {
      type: 'info',
      title: 'Comment tracer les frontières de modules',
      body: "La règle n'est pas « un module par fonctionnalité » — c'est trop simpliste. La règle est : un module par unité indépendamment modifiable. Demandez-vous : « Un agent peut-il ajouter une fonctionnalité à ce module sans AUCUNE connaissance des autres modules ? » Si oui, la frontière est correcte. Si l'agent doit lire ou modifier des fichiers dans un autre module pour compléter sa tâche, la frontière est mauvaise — soit les modules sont trop couplés, soit la répartition des responsabilités n'est pas naturelle.",
    },
    {
      type: 'info',
      title: 'Tests décisifs de frontières',
      body: "Trois tests pour une bonne frontière. (1) Test agent-unique : Un seul agent peut-il compléter une fonctionnalité complète dans ce module ? S'il doit traverser dans un autre module, la frontière est trop étroite. (2) Test parallèle : Deux agents peuvent-ils travailler sur des modules différents simultanément sans conflits ? S'ils partagent des fichiers, la frontière fuit. (3) Test de contrat : Pouvez-vous définir l'interface entre ce module et ses voisins en moins de 20 lignes de types ? Si l'interface est énorme, les modules sont trop couplés.",
    },
    {
      type: 'code-demo',
      title: 'Structure de module bien délimitée',
      body: 'Chaque module est autonome. Un agent travaillant sur un module n\'a jamais besoin de toucher un autre.',
      language: 'text',
      filename: 'boundary-structure',
      code: "src/features/\n├── payments/\n│   ├── CLAUDE.md              # Module-specific rules\n│   ├── payments.handler.ts    # HTTP layer (routes, request parsing)\n│   ├── payments.service.ts    # Business logic\n│   ├── payments.repository.ts # Database queries\n│   ├── payments.schema.ts     # Validation (Zod)\n│   ├── payments.types.ts      # Internal types\n│   ├── payments.events.ts     # Events this module emits\n│   ├── payments.test.ts       # Unit + integration tests\n│   └── index.ts               # Public API (only this is importable)\n│\n├── orders/\n│   ├── CLAUDE.md\n│   ├── orders.handler.ts\n│   ├── orders.service.ts\n│   ├── orders.repository.ts\n│   ├── orders.schema.ts\n│   ├── orders.types.ts\n│   ├── orders.events.ts\n│   ├── orders.test.ts\n│   └── index.ts\n│\nsrc/contracts/\n├── order-payment.contract.ts   # Interface between orders ↔ payments\n├── order-notification.contract.ts\n└── user-payment.contract.ts",
    },
    {
      type: 'order',
      instruction: 'Ordonnez ces étapes pour concevoir les frontières de modules dans un nouveau système :',
      items: [
        'Implémenter chaque module indépendamment (un agent par module)',
        'Définir les contrats d\'interface entre les modules adjacents',
        'Identifier les domaines métier principaux (paiements, commandes, utilisateurs, etc.)',
        'Valider : exécuter des agents en parallèle et mesurer le taux de conflits (<5%)',
        'Cartographier le flux de données : quels domaines ont besoin de communiquer ?',
      ],
      correctOrder: [2, 4, 1, 0, 3],
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Conception des frontières maîtrisée !',
    },

    // === VALIDATION ===
    {
      type: 'info',
      title: 'Mesurer l\'efficacité des frontières',
      body: "La théorie est inutile sans mesure. Voici comment valider que vos frontières fonctionnent. (1) Envoyez 3-5 agents sur différentes fonctionnalités simultanément. (2) Quand tous ont fini, lancez git diff sur toutes les branches. (3) Comptez les fichiers modifiés par plus d'un agent. (4) Calculez le taux de conflits : fichiers conflictuels / total de fichiers modifiés. (5) Pour chaque conflit, tracez-le jusqu'à un échec de frontière. (6) Reconcevoir la frontière et retestez. C'est de l'architecture empirique — vous mesurez et itérez, vous ne devinez pas.",
    },
    {
      type: 'info',
      title: 'Échecs de frontières courants et correctifs',
      body: "Échec : Plusieurs agents modifient le fichier de configuration de l'app. Correctif : Chaque module enregistre sa propre configuration — pas de fichier de config central. Échec : Les agents entrent en conflit sur le fichier de schéma de base de données. Correctif : Fichiers de migration par module. Échec : Les agents modifient tous les deux les types d'erreur partagés. Correctif : Chaque module définit ses propres types d'erreur ; seules les erreurs inter-modules vivent dans les contrats. Échec : Les agents entrent en conflit sur le fichier de setup de test. Correctif : Chaque module a son propre setup de test ; les utilitaires de test partagés sont de l'infrastructure en lecture seule.",
    },
    {
      type: 'multiple-choice',
      question: 'Après avoir exécuté 10 sessions d\'agents en parallèle, vous trouvez que 3 ont produit des conflits — tous sur src/middleware/auth.ts. Qu\'est-ce que ça vous dit ?',
      options: [
        'Le middleware auth est bogué et doit être réécrit',
        'Vous devriez verrouiller le fichier auth et laisser un seul agent le toucher',
        'Le middleware auth est une dépendance partagée que plusieurs fonctionnalités doivent modifier — il doit être décomposé en hooks d\'auth par fonctionnalité ou rendu configurable sans changements de code',
        'Trois conflits sur 10 est acceptable — ne rien faire',
      ],
      correctIndex: 2,
      explanation: 'Un taux de conflits de 30% sur un fichier signifie que ce fichier est un échec de frontière. Plusieurs fonctionnalités sont forcées de le modifier, ce qui casse le parallélisme. Le correctif est la décomposition : soit chaque fonctionnalité définit ses propres règles d\'auth (hooks par fonctionnalité) soit le middleware auth devient configurable via des données (pas des changements de code). Le fichier ne devrait jamais nécessiter de modification pour une nouvelle fonctionnalité.',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'Les frontières comme architecture',
      body: "Les frontières de modules ne sont pas une préférence d'organisation du code — elles sont la décision architecturale fondamentale pour les systèmes agent-natifs. Tracez les bonnes frontières et vous débloquez un vrai parallélisme : 5 agents travaillant 5x plus vite avec zéro surcoût de coordination. Tracez-les mal et vous revenez à un agent à la fois, ou pire — des agents qui entrent en conflit et produisent du code cassé. Le travail de l'architecte dans un monde agent-natif est principalement celui-ci : tracer des frontières si propres que les agents n'ont jamais besoin de les traverser.",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification des frontières de modules pour le travail parallèle :',
      items: [
        'Je comprends que les frontières de modules = frontières de parallélisme',
        'Je peux définir des contrats d\'interface entre les modules',
        'Je peux identifier et éliminer l\'état mutable partagé (fichiers de routes, fichiers de types, fichiers de config)',
        'J\'utilise les trois tests décisifs : agent-unique, parallèle et contrat',
        'Je sais comment mesurer le taux de conflits empiriquement',
        'Je peux tracer les conflits jusqu\'aux échecs de frontières et les corriger',
        'Je conçois pour le développement contrat-d\'abord où les agents construisent indépendamment',
      ],
    },
    {
      type: 'checkpoint',
      xp: 20,
      message: 'Conception des frontières de modules maîtrisée ! Vous pouvez maintenant concevoir des architectures où les flottes d\'agents travaillent en vrai parallèle.',
    },
  ],
}

export default content
