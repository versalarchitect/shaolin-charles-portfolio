import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-4',
  steps: [
    // === INTRO (garder passif) ===
    {
      type: 'info',
      title: 'Tout ne peut pas rouler en même temps',
      body: "Le parallélisme est puissant, mais lancer cinq agents à l'aveugle en même temps peut créer le chaos. Certaines tâches dépendent d'autres — l'UI ne peut pas être construite tant que les types API n'existent pas, et l'API ne peut pas être construite tant que le schéma de base de données n'est pas verrouillé. Les graphes de tâches vous donnent un modèle visuel pour ce qui peut tourner simultanément et ce qui doit attendre. Cette leçon vous apprend à décomposer une fonctionnalité en graphe de dépendances, trouver le chemin critique, et maximiser le parallélisme sans rien casser.",
    },
    // CONVERTI : info → multiple-choice (#1)
    {
      type: 'multiple-choice',
      question: "À quoi sert un graphe de tâches (DAG) dans l'orchestration d'agents ?",
      options: [
        'Il suit combien de temps chaque agent a passé à coder',
        "Il modélise les tâches et les dépendances pour identifier ce qui tourne en parallèle vs ce qui doit attendre",
        "Il visualise l'historique des commits git d'un projet",
        "Il surveille l'utilisation CPU et mémoire des agents en cours d'exécution",
      ],
      correctIndex: 1,
      explanation: "Un graphe de tâches est un graphe acyclique dirigé (DAG) où les nœuds représentent des tâches et les arêtes représentent des dépendances. S'il y a une arête de A vers B, alors A doit finir avant que B puisse commencer. Les tâches sans arêtes partagées sont indépendantes — elles peuvent tourner en parallèle. Rendre le graphe de tâches implicite explicite est la façon dont vous trouvez le plan d'exécution le plus rapide possible.",
    },
    { type: 'multiple-choice', question: 'Dans un graphe de tâches, que signifie une arête de la Tâche A vers la Tâche B ?', options: ['A et B peuvent tourner en parallèle', 'A doit finir avant que B puisse commencer', 'B doit finir avant que A puisse commencer', 'A et B sont la même tâche'], correctIndex: 1, explanation: "Une arête de A vers B signifie que B dépend de A — donc A doit se terminer avant que B ne commence. C'est la règle fondamentale des graphes de dépendances." },

    // === GRAPHE SIMPLE — CONVERTI : diagram → interactive-diagram (#2) ===
    {
      type: 'interactive-diagram',
      title: 'Graphe de tâches simple',
      body: "Une construction de fonctionnalité typique. La Spec vient en premier, puis Auth et Base de données tournent en parallèle. L'API a besoin des deux, puis l'UI, puis le Déploiement.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'spec', label: 'Spec', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Auth', shape: 'rect' },
          { id: 'db', label: 'Base de données', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: 'a besoin des deux', shape: 'rect' },
          { id: 'ui', label: 'UI', shape: 'rect' },
          { id: 'deploy', label: 'Déploiement', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'auth' },
          { from: 'spec', to: 'db' },
          { from: 'auth', to: 'api' },
          { from: 'db', to: 'api' },
          { from: 'api', to: 'ui' },
          { from: 'ui', to: 'deploy' },
        ],
      },
      stages: [
        { highlightNodes: ['spec'], explanation: "Spec n'a pas d'arêtes entrantes — c'est le point de départ. Toutes les autres tâches l'attendent." },
        { highlightNodes: ['spec', 'auth', 'db'], highlightEdges: [{ from: 'spec', to: 'auth' }, { from: 'spec', to: 'db' }], explanation: "Après Spec, Auth et Base de données ne dépendent que de Spec. Ils peuvent tourner simultanément — c'est un éventail sortant." },
        { highlightNodes: ['auth', 'db', 'api'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'db', to: 'api' }], explanation: "API dépend d'Auth et de Base de données. Elle attend celui qui finit en dernier — c'est un goulot d'éventail entrant." },
        { highlightNodes: ['api', 'ui', 'deploy'], highlightEdges: [{ from: 'api', to: 'ui' }, { from: 'ui', to: 'deploy' }], explanation: "UI attend API, puis Déploiement attend UI. C'est une chaîne stricte — aucun parallélisme possible ici." },
      ],
    },
    { type: 'checkpoint', xp: 2, message: 'Fondamentaux des graphes de tâches acquis !' },

    // CONVERTI : info → multiple-choice (#3)
    {
      type: 'multiple-choice',
      question: 'En regardant le graphe de tâches, pourquoi Auth et Base de données peuvent-ils tourner en parallèle ?',
      options: [
        "Ils dépendent tous les deux d'API, qui tourne en premier",
        "Ils ne partagent aucune arête entre eux — tous deux ne dépendent que de Spec",
        "L'orchestrateur les lance manuellement en même temps",
        "Base de données est plus rapide qu'Auth donc elle finit avant que la dépendance compte",
      ],
      correctIndex: 1,
      explanation: "Auth et Base de données ne dépendent que de Spec. Une fois Spec terminé, ils ne partagent aucune arête entre eux, donc ils peuvent tourner en même temps. L'insight clé : les tâches parallèles sont de la vitesse gratuite, mais les points de convergence (comme API) créent des goulots d'étranglement. Votre travail en tant que directeur est de minimiser le temps d'attente aux goulots.",
    },
    { type: 'multiple-choice', question: 'Dans le graphe de tâches ci-dessus, quelles tâches peuvent tourner en parallèle ?', options: ['Spec et Auth', 'Auth et Base de données', 'API et UI', 'Base de données et Déploiement'], correctIndex: 1, explanation: "Auth et Base de données ne dépendent que de Spec. Une fois Spec terminé, ils ne partagent aucune arête entre eux, donc ils peuvent tourner en même temps. Chaque autre paire a une chaîne de dépendance entre eux." },

    // CONVERTI : info → multiple-choice (#4)
    {
      type: 'multiple-choice',
      question: "Qu'est-ce que le chemin critique dans un graphe de tâches ?",
      options: [
        'Le chemin avec le moins de tâches',
        'Le chemin qui a les fonctionnalités les plus importantes',
        'La plus longue chaîne de tâches dépendantes du début à la fin — elle détermine le temps total minimum',
        'Le chemin où les agents sont le plus susceptibles de produire des bugs',
      ],
      correctIndex: 2,
      explanation: "Le chemin critique est la plus longue chaîne de tâches dépendantes du début à la fin. Il détermine le temps minimum possible pour compléter le projet entier — aucune quantité de parallélisme ne peut le raccourcir. Chaque autre chemin est plus court, ce qui signifie que ces tâches ont du jeu. Trouver le chemin critique vous dit exactement où concentrer les efforts d'optimisation.",
    },
    // CONVERTI : diagram → interactive-diagram (#5)
    {
      type: 'interactive-diagram',
      title: 'Chemin critique',
      body: "La chaîne surlignée est le chemin critique : 2h + 3h + 2h + 0.5h = 7.5h minimum. Base de données (1h) tourne en parallèle mais finit avant Auth, donc elle a du jeu et n'est pas sur le chemin critique.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'auth', label: 'Auth', sublabel: '2h', shape: 'rect', highlight: true },
          { id: 'db', label: 'BD', sublabel: '1h', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: '3h', shape: 'rect', highlight: true },
          { id: 'ui', label: 'UI', sublabel: '2h', shape: 'rect', highlight: true },
          { id: 'deploy', label: 'Déploiement', sublabel: '0.5h', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'auth', to: 'api' },
          { from: 'db', to: 'api', dashed: true },
          { from: 'api', to: 'ui' },
          { from: 'ui', to: 'deploy' },
        ],
      },
      stages: [
        { highlightNodes: ['auth', 'db'], explanation: 'Auth (2h) et BD (1h) démarrent en parallèle. BD finit en premier — elle a 1 heure de jeu.' },
        { highlightNodes: ['auth', 'api'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'db', to: 'api' }], explanation: "API attend le prédécesseur le plus lent (Auth à 2h). BD était terminée une heure plus tôt — son jeu est absorbé." },
        { highlightNodes: ['auth', 'api', 'ui', 'deploy'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'api', to: 'ui' }, { from: 'ui', to: 'deploy' }], explanation: 'Chemin critique : Auth(2h) -> API(3h) -> UI(2h) -> Déploiement(0.5h) = 7.5h minimum. Seules les optimisations sur ce chemin réduisent le temps total.' },
      ],
    },
    { type: 'multiple-choice', question: 'Si vous pouviez accélérer une tâche pour réduire le temps total du projet, laquelle devriez-vous cibler ?', options: ["BD (1h) — c'est la tâche la plus courte", "API (3h) — elle est sur le chemin critique et c'est la tâche la plus longue", 'Déploiement (0.5h) — ça tourne en dernier', 'BD (1h) — ça tourne en parallèle'], correctIndex: 1, explanation: "Seules les tâches sur le chemin critique affectent le temps total du projet. Accélérer BD ne change rien — elle finit déjà avant Auth. API est la tâche du chemin critique la plus longue, donc la réduire réduit directement le temps total minimum." },
    { type: 'checkpoint', xp: 3, message: 'Analyse du chemin critique déverrouillée !' },

    // CONVERTI : info → multiple-choice (#6)
    {
      type: 'multiple-choice',
      question: "Quel est l'algorithme pour trouver le chemin critique dans un graphe de tâches ?",
      options: [
        'Choisir la tâche avec le plus de dépendances et la suivre jusqu\'à la fin',
        'Lister chaque chemin du début à la fin, additionner les durées de chacun, et choisir le plus long',
        'Lancer toutes les tâches et mesurer laquelle prend le plus de temps',
        'Trouver la tâche avec zéro jeu et c\'est le chemin critique',
      ],
      correctIndex: 1,
      explanation: "Étape 1 : Listez chaque chemin du début à la fin. Étape 2 : Additionnez les durées le long de chaque chemin. Étape 3 : Le chemin le plus long est le chemin critique. Dans l'exemple précédent, Auth(2h)->API(3h)->UI(2h)->Déploiement(0.5h) = 7.5h vs BD(1h)->API(3h)->UI(2h)->Déploiement(0.5h) = 6.5h. Pour l'orchestration d'agents avec 10-15 tâches, papier et crayon suffisent.",
    },
    { type: 'order', instruction: 'Ordonnez ces étapes pour trouver le chemin critique :', items: ['Choisir le chemin avec la plus longue durée totale', 'Lister chaque chemin du début à la fin', 'Additionner les durées des tâches le long de chaque chemin', 'Dessiner le graphe de dépendances des tâches'], correctOrder: [3, 1, 2, 0] },

    // CONVERTI : info → compare (#7)
    {
      type: 'compare',
      title: 'Dépendance séquentielle vs contrat d\'interface',
      body: "Quand la Tâche B dépend de la Tâche A, vous avez deux approches. L'une bloque la progression. L'autre débloque le travail parallèle.",
      question: 'Quelle approche permet aux deux agents de travailler simultanément ?',
      correctSide: 'right',
      left: {
        label: 'Séquentielle (Attendre A)',
        content: "1. L'Agent A construit l'API REST complète\n2. L'Agent A termine (prend 3 heures)\n3. SEULEMENT MAINTENANT l'Agent B peut commencer le frontend\n4. L'Agent B construit contre la vraie API\n5. Temps total : 3h + 2h = 5h\n\nPourquoi c'est lent :\n- L'Agent B est inactif pendant 3 heures\n- Aucun parallélisme possible\n- Un seul agent travaille à la fois",
      },
      right: {
        label: "Contrat d'interface (Définir les types d'abord)",
        content: "1. Définir les types API dans un fichier de contrat partagé (15 min)\n2. L'Agent A construit l'API contre le contrat\n3. L'Agent B construit le frontend contre le MÊME contrat\n4. Les deux travaillent en parallèle après le contrat\n5. Temps total : 15min + max(3h, 2h) = 3.25h\n\nPourquoi c'est rapide :\n- On attend seulement la définition de l'interface (minutes)\n- Les deux agents construisent contre les types convenus\n- Le contrat garantit une intégration propre",
      },
      explanation: "La dépendance existe toujours, mais au lieu d'attendre l'implémentation complète, vous n'attendez que la définition de l'interface (minutes au lieu d'heures). Les deux agents construisent ensuite contre le même contrat simultanément. C'est l'astuce du contrat d'interface.",
    },
    { type: 'diagram', title: "Contrat d'interface", body: "L'Agent A produit le contrat d'abord (types API). L'Agent B construit contre. Les deux peuvent travailler en parallèle après la définition du contrat.", diagram: { direction: 'TB', nodes: [{ id: 'a', label: 'Agent A', sublabel: 'Constructeur API', shape: 'rounded' }, { id: 'contract', label: 'Contrat', sublabel: 'Types API', shape: 'rect', highlight: true }, { id: 'b', label: 'Agent B', sublabel: 'Constructeur UI', shape: 'rounded' }], edges: [{ from: 'a', to: 'contract', label: 'définit' }, { from: 'contract', to: 'b', label: 'construit contre' }] } },
    // CONVERTI : code-demo → code-fill (#8)
    {
      type: 'code-fill',
      instruction: "Complétez ce contrat d'interface partagé que les agents API et UI utiliseront. Définissez les types pour que ni l'un ni l'autre ne bloque l'autre.",
      language: 'typescript',
      filename: 'src/types/api-contract.ts',
      template: "// This file is the contract between the API and UI agents.\n// Define it FIRST, before either agent starts building.\n\nexport interface {{mainType}} {\n  id: string\n  title: string\n  completed: {{boolType}}\n  createdAt: string\n}\n\nexport interface CreateTodoRequest {\n  title: {{titleType}}\n}\n\nexport interface ApiRoutes {\n  'GET /todos': { response: {{listResponse}} }\n  'POST /todos': { body: CreateTodoRequest; response: Todo }\n  'PATCH /todos/:id': { body: {{partialType}}; response: Todo }\n  'DELETE /todos/:id': { response: void }\n}",
      blanks: [
        { id: 'mainType', answer: 'Todo', placeholder: "nom de l'entité ?", hint: "L'entité principale gérée par cette API" },
        { id: 'boolType', answer: 'boolean', placeholder: 'type ?', hint: 'Un type vrai/faux en TypeScript' },
        { id: 'titleType', answer: 'string', placeholder: 'type ?', hint: "Le type pour un champ de titre texte" },
        { id: 'listResponse', answer: 'Todo[]', alternatives: ['Array<Todo>'], placeholder: 'type de réponse ?', hint: "Un tableau de l'entité principale" },
        { id: 'partialType', answer: 'Partial<Todo>', placeholder: 'type de mise à jour partielle ?', hint: 'Type utilitaire TypeScript qui rend tous les champs optionnels' },
      ],
      explanation: "Le contrat définit les formes exactes contre lesquelles les deux agents construisent. L'agent API les implémente comme vrais endpoints. L'agent UI les importe et les utilise pour des appels fetch typés. Aucun ne bloque l'autre.",
    },
    { type: 'multiple-choice', question: "Pourquoi définir un contrat d'interface augmente le parallélisme ?", options: ["Ça fait tourner le code plus vite à l'exécution", "Ça supprime entièrement la dépendance entre les deux tâches", "Ça transforme une dépendance séquentielle en une petite tâche initiale, permettant aux deux agents de travailler en parallèle après", "Ça élimine le besoin de tester"], correctIndex: 2, explanation: "La dépendance existe toujours — mais au lieu d'attendre l'implémentation complète, vous n'attendez que la définition de l'interface (minutes au lieu d'heures). Les deux agents construisent ensuite contre le même contrat simultanément." },
    { type: 'checkpoint', xp: 3, message: "Contrats d'interface maîtrisés !" },

    // CONVERTI : info+info → compare (#9)
    {
      type: 'compare',
      title: 'Plan statique vs re-séquençage dynamique',
      body: "Les plans ne survivent pas au contact avec la réalité. Faut-il s'en tenir au planning original ou s'adapter à la volée ?",
      question: 'Quelle approche utilise mieux la capacité des agents quand les choses déraillent ?',
      correctSide: 'right',
      left: {
        label: "Statique (S'en tenir au plan)",
        content: "14:00  Agent A démarre Auth (est. 2h)\n14:00  Agent B démarre Base de données (est. 1h)\n14:45  Agent B finit Base de données en avance !\n14:45  Agent B attend... (prochaine tâche prévue à 16:00)\n15:30  Agent A finit Auth\n15:30  Agent A démarre API\n16:00  Agent B démarre enfin les stubs de test\n\nProblème :\n- Agent B inactif pendant 1h15m\n- Parallélisme gaspillé\n- Temps total : plus long que nécessaire",
      },
      right: {
        label: 'Dynamique (Re-séquencer à la volée)',
        content: "14:00  Agent A démarre Auth (est. 2h)\n14:00  Agent B démarre Base de données (est. 1h)\n14:45  Agent B finit Base de données en avance !\n14:45  > Réassigner Agent B à : écrire les stubs de test API\n       (pas de dépendances non satisfaites, prévu plus tard)\n15:30  Agent A finit Auth, démarre API\n15:30  Agent B a les stubs prêts — les tests API tournent\n       immédiatement pendant qu'Agent A écrit chaque endpoint\n\nRésultat : Les tests API tournent en parallèle avec l'implémentation.\nTemps économisé : ~1h",
      },
      explanation: "Des agents inactifs, c'est du parallélisme gaspillé. Les bons directeurs re-séquencent dynamiquement : quand un agent finit en avance, parcourez le graphe de tâches pour trouver n'importe quelle tâche dont les dépendances sont satisfaites et réassignez. Le graphe de tâches est un document vivant, pas un plan fixe.",
    },
    // CONVERTI : code-demo → code-fill (#10)
    {
      type: 'code-fill',
      instruction: "Complétez ce journal d'orchestration montrant le re-séquençage dynamique quand l'Agent B finit en avance :",
      language: 'text',
      filename: 'agent-orchestration-log.txt',
      template: "14:00  Agent A starts Auth     (est. 2h)\n14:00  Agent B starts {{task1}}  (est. 1h)\n14:45  Agent B finishes {{task1}} early!\n14:45  > Re-assign Agent B to: write {{newTask}}\n       ({{reason}}, were scheduled for later)\n15:30  Agent A finishes Auth\n15:30  Agent A starts {{nextTask}} implementation",
      blanks: [
        { id: 'task1', answer: 'Database', alternatives: ['DB', 'database'], placeholder: 'tâche originale ?', hint: "La tâche originalement assignée à l'Agent B" },
        { id: 'newTask', answer: 'API test stubs', alternatives: ['test stubs', 'API tests'], placeholder: 'tâche réassignée ?', hint: "Que peut faire l'Agent B maintenant sans dépendances non satisfaites ?" },
        { id: 'reason', answer: 'API tests have no dependencies', alternatives: ['no dependencies', 'no unmet dependencies'], placeholder: 'pourquoi cette tâche ?', hint: 'Pourquoi cette tâche peut-elle commencer maintenant ?' },
        { id: 'nextTask', answer: 'API', alternatives: ['api'], placeholder: "prochaine tâche pour Agent A ?", hint: "Sur quoi l'Agent A travaille après Auth ?" },
      ],
      explanation: "Quand un agent finit en avance, redirigez-le vers la prochaine tâche disponible sans dépendances non satisfaites. Ça compresse la durée totale en gardant tous les agents productifs.",
    },
    { type: 'multiple-choice', question: "Un agent finit sa tâche 30 minutes en avance. Que devez-vous faire ?", options: ['Le laisser attendre que la prochaine tâche planifiée soit prête', 'Le réassigner à la prochaine tâche disponible sans dépendances non satisfaites', "Lui faire refaire la tâche qu'il vient de finir pour améliorer la qualité", "L'arrêter pour économiser les coûts API"], correctIndex: 1, explanation: "Des agents inactifs, c'est du parallélisme gaspillé. Parcourez le graphe de tâches pour trouver n'importe quelle tâche dont les dépendances sont déjà satisfaites et assignez-la à l'agent. Ça compresse la durée totale." },

    { type: 'match', instruction: 'Associez chaque relation de tâche à son type de dépendance :', leftItems: ['Système auth -> les routes API en ont besoin', 'Composants UI (indépendants)', "Système de paiement -> a besoin des types API", 'Suite de tests -> a besoin de toutes les fonctionnalités'], rightItems: ["Dépendance bloquante -- doit se terminer d'abord", 'Indépendant -- peut tourner en parallèle', "Dépendance partielle -- a besoin du contrat d'interface seulement", "Porte -- bloque l'intégration finale"], correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 }, explanation: "Les dépendances bloquantes doivent finir en premier. Les tâches indépendantes tournent en parallèle librement. Les dépendances partielles n'ont besoin que de l'interface (types), pas de l'implémentation. Les portes nécessitent tout avant de pouvoir s'exécuter." },
    { type: 'interactive-diagram', title: 'Graphe de tâches simple (étape par étape)', body: 'Parcourez ce graphe de tâches pour comprendre les dépendances, le parallélisme et le chemin critique.', diagram: { direction: 'TB', nodes: [{ id: 'spec', label: 'Spec', shape: 'rounded', highlight: true }, { id: 'auth', label: 'Auth', sublabel: '2h', shape: 'rect' }, { id: 'db', label: 'Base de données', sublabel: '1h', shape: 'rect' }, { id: 'api', label: 'API', sublabel: '3h', shape: 'rect' }, { id: 'ui', label: 'UI', sublabel: '2h', shape: 'rect' }, { id: 'deploy', label: 'Déploiement', sublabel: '0.5h', shape: 'pill' }], edges: [{ from: 'spec', to: 'auth' }, { from: 'spec', to: 'db' }, { from: 'auth', to: 'api' }, { from: 'db', to: 'api', dashed: true }, { from: 'api', to: 'ui' }, { from: 'ui', to: 'deploy' }] }, stages: [{ highlightNodes: ['spec'], explanation: "Spec n'a pas d'arêtes entrantes — c'est le point de départ. Tout le reste l'attend." }, { highlightNodes: ['spec', 'auth', 'db'], highlightEdges: [{ from: 'spec', to: 'auth' }, { from: 'spec', to: 'db' }], explanation: 'Éventail sortant : Auth (2h) et Base de données (1h) ne dépendent que de Spec. Ils tournent en parallèle — vitesse gratuite.' }, { highlightNodes: ['auth', 'db', 'api'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'db', to: 'api' }], explanation: "Éventail entrant : API dépend d'Auth et de BD. Elle attend celui qui finit en dernier (Auth à 2h). BD finit à 1h — elle a 1h de jeu." }, { highlightNodes: ['auth', 'api', 'ui', 'deploy'], highlightEdges: [{ from: 'auth', to: 'api' }, { from: 'api', to: 'ui' }, { from: 'ui', to: 'deploy' }], explanation: "Chemin critique : Auth(2h) -> API(3h) -> UI(2h) -> Déploiement(0.5h) = 7.5h minimum. C'est la plus longue chaîne — aucun parallélisme ne peut la raccourcir." }] },

    // CONVERTI : info → multiple-choice (#11)
    {
      type: 'multiple-choice',
      question: "Vous construisez une appli de tâches avec auth, base de données, API, frontend et déploiement. Quelle tâche devrait venir en premier ?",
      options: [
        "Construire l'UI React pour que les parties prenantes voient l'avancement",
        "Déployer en production pour sécuriser l'URL",
        "Concevoir le schéma de base de données — il définit le modèle de données dont tout le reste dépend",
        "Implémenter les endpoints API puisqu'ils connectent tout",
      ],
      correctIndex: 2,
      explanation: "Le schéma de base de données définit le modèle de données dont l'API, l'auth et l'UI dépendent tous. Sans lui, vous ne pouvez pas définir les contrats d'interface qui permettent le travail parallèle. Réfléchissez à où les contrats d'interface pourraient aider : les types API définis à partir du schéma permettent à l'agent frontend de commencer immédiatement.",
    },
    { type: 'order', instruction: "Ordonnez ces tâches d'application de tâches par dépendance (ce qui doit venir en premier) :", items: ['Déployer en production', 'Écrire les types de contrat API', "Construire l'UI React", 'Implémenter les endpoints API', 'Concevoir le schéma de base de données'], correctOrder: [4, 1, 3, 2, 0] },
    // CONVERTI : code-demo → code-fill (#12)
    {
      type: 'code-fill',
      instruction: 'Complétez ce prompt pour que Claude Code décompose une fonctionnalité en graphe de tâches :',
      language: 'text',
      filename: 'prompt.txt',
      template: "Decompose this feature into a task dependency graph:\n\nFeature: Todo app with auth, database, API, and React UI\n\nFor each task, specify:\n1. Task name and {{timeField}}\n2. {{depsField}} (which tasks must finish first)\n3. Outputs (what this task produces for others)\n4. {{contractField}} (shared types between tasks)\n\nThen identify:\n- Which tasks can run in {{execMode}}\n- The {{pathName}} and minimum total time\n- Where interface contracts can unlock more parallelism",
      blanks: [
        { id: 'timeField', answer: 'estimated time', alternatives: ['time estimate', 'duration'], placeholder: 'quoi par tâche ?', hint: 'Combien de temps chaque tâche prend' },
        { id: 'depsField', answer: 'Dependencies', alternatives: ['dependencies', 'Deps'], placeholder: 'quelles relations ?', hint: 'Ce qui doit finir avant que cette tâche commence' },
        { id: 'contractField', answer: 'Interface contracts', alternatives: ['Contracts', 'interface contracts', 'Shared types'], placeholder: 'accords partagés ?', hint: 'Accords sur les types partagés entre agents' },
        { id: 'execMode', answer: 'parallel', alternatives: ['simultaneously', 'concurrently'], placeholder: "style d'exécution ?", hint: "Tourner en même temps" },
        { id: 'pathName', answer: 'critical path', alternatives: ['Critical path'], placeholder: 'nom de la plus longue chaîne ?', hint: 'La plus longue chaîne dépendante qui fixe le temps minimum' },
      ],
      explanation: "Ce prompt donne à Claude Code tout ce dont il a besoin pour décomposer n'importe quelle fonctionnalité : structure des tâches, dépendances, sorties, contrats, et l'analyse du parallélisme et du chemin critique.",
    },
    { type: 'terminal', instruction: 'Lancez Claude Code pour décomposer une fonctionnalité en graphe de tâches :', expectedCommand: 'claude', hint: 'Lancez Claude Code pour pouvoir coller le prompt de graphe de tâches' },

    {
      type: 'multiple-choice',
      question: 'Quel patron de dépendance représente la plus grande opportunité de parallélisme ?',
      options: [
        'Chaîne — tâches strictement séquentielles',
        'Éventail sortant — une tâche permet plusieurs tâches parallèles',
        "Éventail entrant — plusieurs tâches doivent se terminer avant qu'une commence",
        'Tous les patrons offrent un parallélisme égal',
      ],
      correctIndex: 1,
      explanation: "Trois patrons reviennent constamment. Éventail sortant : une tâche permet plusieurs tâches parallèles (Spec permet Auth + BD + Docs) — c'est là que vit le parallélisme. Éventail entrant : plusieurs tâches doivent toutes se terminer avant qu'une commence — ça crée un goulot. Chaîne : dépendance séquentielle stricte — zéro parallélisme. Reconnaître ces patrons vous dit instantanément où la vitesse se cache et où les goulots se tapissent.",
    },

    { type: 'checklist', title: 'Liste de vérification de maîtrise des graphes de tâches :', items: ['Je peux décomposer une fonctionnalité en tâches avec des dépendances explicites', 'Je peux dessiner un graphe de dépendances avec des nœuds et des arêtes dirigées', 'Je peux identifier quelles tâches sont indépendantes et parallélisables', 'Je peux trouver le chemin critique en traçant la plus longue chaîne', 'Je sais que seules les optimisations du chemin critique réduisent le temps total', "Je peux définir des contrats d'interface pour débloquer le travail parallèle entre tâches dépendantes", 'Je re-séquence dynamiquement quand les agents finissent en avance ou sont bloqués'] },
    { type: 'checkpoint', xp: 17, message: "Graphes de tâches terminés ! Vous pouvez maintenant mapper n'importe quelle fonctionnalité en graphe de dépendances et trouver le plan d'exécution le plus rapide." },
  ],
}

export default content
