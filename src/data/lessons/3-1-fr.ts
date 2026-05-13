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
      type: 'diagram',
      title: 'Exécution séquentielle vs parallèle',
      body: "Voici le changement fondamental de modèle mental. L'exécution séquentielle est sûre mais lente — chaque tâche attend la précédente. L'exécution parallèle lance les tâches indépendantes simultanément. L'orchestrateur (vous) remplace l'agent unique comme coordinateur.",
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Vous voyez le graphe. Séquentiel = une chaîne. Parallèle = un éventail.',
    },

    // === TASK DECOMPOSITION ===
    {
      type: 'info',
      title: 'Décomposition des tâches et propriété des fichiers',
      body: "La décomposition des tâches consiste à diviser un produit en unités de travail adaptées à un agent. Chaque unité doit avoir des frontières claires, posséder des fichiers spécifiques et être testable indépendamment. La règle d'or : si deux agents doivent écrire dans le même fichier, votre décomposition est mauvaise. L'accès partagé aux fichiers est la cause numéro un d'échec multi-agent.",
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
      type: 'diagram',
      title: 'Graphe de dépendances des tâches',
      body: "Un vrai produit SaaS décomposé en flux de travail parallèles. Auth et API peuvent démarrer immédiatement — ils sont indépendants. L'UI dépend du contrat API (a besoin des formes de réponse). Les Paiements dépendent de l'Auth (a besoin du contexte utilisateur). Tout converge à l'intégration.",
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
      type: 'info',
      title: 'Étape zéro : définir les contrats',
      body: "Avant qu'un agent commence à coder, vous définissez les contrats — les interfaces entre les composants. Formes de réponse API, format du token d'auth, props des composants, schéma de base de données. Ça prend 5 minutes et prévient des heures de douleur à l'intégration. Chaque agent travaille avec les mêmes types partagés. Aucun agent ne modifie le fichier de contrats.",
    },
    {
      type: 'code-demo',
      title: 'Un fichier de contrats partagé',
      body: "Ce fichier de types est écrit en premier, avant que tout agent ne commence. Chaque agent l'importe. Aucun agent ne le modifie. C'est la source unique de vérité qui rend le travail parallèle possible.",
      language: 'typescript',
      filename: 'src/types/contracts.ts',
      code: `// Written by YOU before agents start
// Every agent imports from this file — none modify it

export interface User {
  id: string
  email: string
  role: 'admin' | 'member'
}

export interface ApiResponse<T> {
  data: T
  error: string | null
}

export interface DashboardStats {
  revenue: number
  users: number
  churn: number
}`,
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
      type: 'code-demo',
      title: 'Répartition des agents en parallèle',
      body: "Dans Claude Code, vous répartissez les agents en parallèle en regroupant les appels d'outils indépendants ou en utilisant l'outil Agent. Chaque agent obtient son propre contexte, périmètre de fichiers et description de tâche. Remarquez comment chaque tâche possède des répertoires spécifiques — aucun chevauchement.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Parallel Tasks — Run Simultaneously

### Agent 1: Auth (owns src/auth/*)
Build login, signup, and password reset.
Use the User type from src/types/contracts.ts.
Write tests in src/auth/__tests__/.

### Agent 2: API (owns src/api/*)
Build REST endpoints for dashboard stats.
Use ApiResponse<T> from src/types/contracts.ts.
Write tests in src/api/__tests__/.

### Agent 3: Landing Page (owns src/marketing/*)
Build the marketing landing page.
No dependencies on other agents.
Static content only.`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Vous comprenez les contrats et le patron de répartition.',
    },

    // === DIAGRAM 3: When NOT to Parallelize ===
    {
      type: 'diagram',
      title: 'Quand NE PAS paralléliser',
      body: "Toutes les tâches ne bénéficient pas de l'exécution parallèle. Utilisez cet arbre de décision avant de répartir les agents. Si les tâches partagent un état ou des fichiers, exécutez-les en série. Si elles touchent des fichiers indépendants sans état partagé, parallélisez en confiance.",
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
      type: 'info',
      title: 'Prévenir chaque mode d\'échec',
      body: "Conflits de fichiers partagés : imposer la propriété exclusive des fichiers par agent. Hypothèses incohérentes : définir les contrats partagés avant de commencer. Échecs d'intégration : planifier l'étape de fusion explicitement et tester les interfaces tôt. Travail en double : donner à chaque agent un périmètre clair et non chevauchant dans le prompt.",
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

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercice : Décomposer un projet',
      body: "C'est le moment de pratiquer. Vous construisez une application de gestion de tâches avec : authentification utilisateur (email/mot de passe), une interface Kanban, une API REST pour les opérations CRUD sur les tâches, et des mises à jour en temps réel via WebSocket. Décomposez en tâches adaptées aux agents et identifiez les dépendances.",
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
      type: 'code-demo',
      title: 'Votre décomposition sous forme de graphe de tâches',
      body: "Voici comment vous documenteriez cette décomposition dans votre CLAUDE.md. Remarquez la propriété explicite des fichiers et les notes de dépendance.",
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: `## Task Graph

### Phase 1 — Contracts (you, 5 min)
Define types in src/types/task.ts

### Phase 2 — Parallel Agents
- Agent A: Auth → src/auth/* (independent)
- Agent B: API → src/api/* (independent)
- Agent C: WebSocket → src/realtime/* (independent)

### Phase 3 — Dependent Work
- Agent D: Kanban UI → src/board/*
  (after API contract is defined)

### Phase 4 — Integration
- Wire routes, test end-to-end`,
    },
    {
      type: 'info',
      title: 'Maximiser le parallélisme avec les contrats',
      body: "Voici le coup avancé : si vous définissez le contrat API en amont (les formes de réponse, les chemins d'endpoint, les codes de statut), l'agent UI PEUT démarrer en parallèle avec l'agent API. Les deux travaillent contre le contrat — l'API l'implémente, l'UI le consomme. C'est comme ça que vous passez de 3 agents parallèles à 4.",
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
