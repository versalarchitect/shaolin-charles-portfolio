import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-13',
  steps: [
    // === INTRODUCTION: WHY 2→5 IS NOT LINEAR ===
    {
      type: 'info',
      title: 'Passer de 2 agents à 5 ou plus',
      body: "Faire rouler 2 agents en parallèle, ça se gère. Tu vérifies l'un, tu passes à l'autre, tu fusionne leur travail. Mais ajoute un troisième et quelque chose bascule — tu jongles entre les changements de contexte, résous des conflits de fusion, et perds le fil de qui fait quoi. C'est pas un problème de compétence — c'est un problème de maths. Les lignes de communication entre agents croissent selon n*(n-1)/2. Avec 2 agents, c'est 1 connexion. Avec 5, c'est 10. Avec 10, c'est 45. La solution n'est pas « essayer plus fort » — c'est de choisir un patron de coordination qui réduit le nombre de connexions actives.",
    },
    {
      type: 'code-demo',
      title: 'Croissance des connexions',
      body: "Le nombre de conflits potentiels croît beaucoup plus vite que le nombre d'agents. C'est pourquoi « juste ajouter plus d'agents » ne passe pas à l'échelle sans structure.",
      language: 'text',
      filename: 'coordination-overhead.txt',
      code: "Agents    Connections    Overhead\n──────    ───────────    ────────\n  2            1         Trivial\n  3            3         Manageable\n  4            6         Needs structure\n  5           10         Needs a pattern\n  7           21         Needs automation\n 10           45         Needs a framework",
    },
    {
      type: 'multiple-choice',
      question: 'Tu passes de 4 agents à 5. Combien de nouvelles connexions de coordination s\'ajoutent ?',
      options: [
        '1 nouvelle connexion',
        '2 nouvelles connexions',
        '4 nouvelles connexions',
        '5 nouvelles connexions',
      ],
      correctIndex: 2,
      explanation: "4 agents ont 6 connexions (4*3/2). 5 agents ont 10 connexions (5*4/2). Ça fait 4 nouvelles connexions en ajoutant un seul agent. Chaque nouvel agent se connecte à tous les agents existants.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Les maths de la coordination, compris !',
    },

    // === PATTERN 1: HUB AND SPOKE ===
    {
      type: 'info',
      title: 'Patron 1 : Moyeu et rayons (Hub and Spoke)',
      body: "Dans le patron moyeu-et-rayons, tu es le moyeu. Chaque agent te rend des comptes à toi et seulement à toi. Les agents ne communiquent jamais entre eux. Tu assignes les tâches, collectes les résultats et gères l'intégration. C'est le patron le plus intuitif — c'est déjà toi qui lances les agents. Forces : modèle mental simple, pas de conflits inter-agents, facile à déboguer. Faiblesse : tu es le goulot d'étranglement. Chaque décision, chaque fusion, chaque clarification passe par toi.",
    },
    {
      type: 'diagram',
      title: 'Moyeu et rayons',
      body: 'Tu coordonnes tout. Les agents travaillent indépendamment et te rendent des comptes. Aucune communication inter-agents.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'you', label: 'Toi', sublabel: 'Orchestrateur', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', shape: 'rect' },
          { id: 'b', label: 'Agent B', shape: 'rect' },
          { id: 'c', label: 'Agent C', shape: 'rect' },
        ],
        edges: [
          { from: 'you', to: 'a', label: 'assigner' },
          { from: 'you', to: 'b', label: 'assigner' },
          { from: 'you', to: 'c', label: 'assigner' },
          { from: 'a', to: 'you', label: 'résultat' },
          { from: 'b', to: 'you', label: 'résultat' },
          { from: 'c', to: 'you', label: 'résultat' },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Moyeu-et-rayons en pratique',
      body: 'Chaque agent a un worktree séparé et une tâche indépendante. Tu les lances, tu vérifies leur avancement, et tu fusionnes leur travail.',
      language: 'bash',
      filename: 'hub-and-spoke.sh',
      code: "# You are the hub — assign independent features to separate worktrees\ngit worktree add ../feature-auth feat/auth\ngit worktree add ../feature-dashboard feat/dashboard\ngit worktree add ../feature-settings feat/settings\n\n# Launch agents in parallel (each in its own worktree)\n# Agent A: auth system\n# Agent B: dashboard UI\n# Agent C: settings page\n\n# You check on each, resolve any issues, merge results\ngit merge feat/auth\ngit merge feat/dashboard\ngit merge feat/settings",
    },
    {
      type: 'multiple-choice',
      question: 'Quand le patron moyeu-et-rayons atteint-il ses limites ?',
      options: [
        'Quand les tâches sont trop simples',
        'Quand tu deviens le goulot d\'étranglement en gérant trop d\'agents',
        'Quand les agents ont besoin d\'accéder aux mêmes fichiers',
        'Quand les tâches prennent plus de 10 minutes',
      ],
      correctIndex: 1,
      explanation: "Le moyeu-et-rayons échoue quand l'orchestrateur (toi) ne peut plus suivre le rythme de tous les agents qui rendent des comptes. Chaque question, chaque résultat, chaque fusion passe par toi — et ta bande passante est fixe.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Patron moyeu-et-rayons verrouillé !',
    },

    // === PATTERN 2: PIPELINE ===
    {
      type: 'info',
      title: 'Patron 2 : Pipeline',
      body: "Dans un pipeline, les agents sont disposés en séquence. Chaque agent se spécialise dans une étape et passe sa sortie au suivant. L'Agent A construit, l'Agent B révise, l'Agent C teste, l'Agent D déploie. Aucun agent n'a besoin de savoir ce que les autres font — ils consomment une entrée et produisent une sortie. Forces : séparation claire des responsabilités, la qualité s'améliore à chaque étape. Faiblesse : c'est séquentiel — l'Agent D est inactif pendant que l'Agent A travaille, et le temps total est la somme de toutes les étapes.",
    },
    {
      type: 'diagram',
      title: 'Pipeline',
      body: "Étapes séquentielles avec des agents spécialisés. La sortie de chaque agent alimente le suivant. Une seule direction, pas de retour en arrière.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'build', label: 'Agent A', sublabel: 'Construction', shape: 'rounded' },
          { id: 'review', label: 'Agent B', sublabel: 'Révision', shape: 'rect' },
          { id: 'test', label: 'Agent C', sublabel: 'Tests', shape: 'rect' },
          { id: 'deploy', label: 'Agent D', sublabel: 'Déploiement', shape: 'rect' },
          { id: 'done', label: 'Terminé', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'build', to: 'review', label: 'code' },
          { from: 'review', to: 'test', label: 'révisé' },
          { from: 'test', to: 'deploy', label: 'passant' },
          { from: 'deploy', to: 'done', label: 'en ligne' },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Pipeline dans Claude Code',
      body: 'Chaque étape se termine avant que la suivante ne commence. Les agents sont spécialisés — l\'agent de construction ne teste jamais, l\'agent de test ne déploie jamais.',
      language: 'bash',
      filename: 'pipeline.sh',
      code: "# Stage 1: Build agent writes the feature\nclaude -p \"Implement the user profile API endpoint in src/api/profile.ts.\\\n  Follow existing route patterns. Include input validation.\"\n\n# Stage 2: Review agent checks quality\nclaude -p \"Review src/api/profile.ts for security issues,\\\n  error handling gaps, and style violations. Fix any issues found.\"\n\n# Stage 3: Test agent verifies behavior\nclaude -p \"Write and run tests for src/api/profile.ts.\\\n  Cover happy path, validation errors, and auth failures.\\\n  Fix any failing tests.\"\n\n# Stage 4: Deploy agent ships it\nclaude -p \"Run the full build, verify all tests pass,\\\n  commit with a descriptive message, and push to main.\"",
    },
    {
      type: 'multiple-choice',
      question: 'Quelle est la plus grande faiblesse du patron pipeline ?',
      options: [
        'Les agents peuvent interférer entre eux',
        'Il nécessite trop d\'agents',
        'Il est séquentiel — une étape lente bloque tout',
        'Il ne fonctionne que pour les petites tâches',
      ],
      correctIndex: 2,
      explanation: "Le pipeline est intrinsèquement séquentiel. Si l'étape de construction prend 20 minutes, les agents de révision, test et déploiement restent inactifs pendant 20 minutes. Le temps total est la somme de toutes les étapes, pas le maximum.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Patron pipeline maîtrisé !',
    },

    // === PATTERN 3: SWARM ===
    {
      type: 'info',
      title: 'Patron 3 : Essaim (Swarm)',
      body: "Dans un essaim, les agents piochent des tâches depuis un pool partagé. Aucun coordinateur central n'assigne le travail — les agents se sélectionnent eux-mêmes. Quand un agent termine, il prend la tâche suivante. C'est le patron le plus autonome et le plus difficile à mettre en place. Chaque tâche doit être indépendante, bien définie, et d'envergure à peu près égale. Forces : parallélisme maximum, pas de goulot d'étranglement, les agents ne sont jamais inactifs. Faiblesse : les tâches doivent être véritablement indépendantes, et tu as besoin de définitions de tâches extrêmement claires puisqu'il n'y a personne pour clarifier les ambiguïtés.",
    },
    {
      type: 'diagram',
      title: 'Essaim',
      body: 'Les agents se sélectionnent eux-mêmes des tâches depuis un pool partagé. Le patron le plus autonome — aucun coordinateur central nécessaire.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'pool', label: 'Pool de tâches', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', shape: 'rect' },
          { id: 'b', label: 'Agent B', shape: 'rect' },
          { id: 'c', label: 'Agent C', shape: 'rect' },
          { id: 'd', label: 'Agent D', shape: 'rect' },
        ],
        edges: [
          { from: 'pool', to: 'a', label: 'tâche' },
          { from: 'pool', to: 'b', label: 'tâche' },
          { from: 'pool', to: 'c', label: 'tâche' },
          { from: 'pool', to: 'd', label: 'tâche' },
          { from: 'a', to: 'pool', label: 'tâche suivante', dashed: true },
          { from: 'b', to: 'pool', label: 'tâche suivante', dashed: true },
          { from: 'c', to: 'pool', label: 'tâche suivante', dashed: true },
          { from: 'd', to: 'pool', label: 'tâche suivante', dashed: true },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Pool de tâches en essaim avec GitHub Issues',
      body: 'Utilise les GitHub Issues comme pool de tâches. Chaque agent réclame un issue, le travaille, soumet un PR, puis prend le suivant.',
      language: 'bash',
      filename: 'swarm-tasks.sh',
      code: "# Create the task pool — each issue is a self-contained unit of work\ngh issue create --title \"Add email validation to signup\" --label \"swarm\"\ngh issue create --title \"Add rate limiting to /api/search\" --label \"swarm\"\ngh issue create --title \"Add loading skeleton to profile\" --label \"swarm\"\ngh issue create --title \"Add retry logic to payment webhook\" --label \"swarm\"\ngh issue create --title \"Add cache headers to static assets\" --label \"swarm\"\ngh issue create --title \"Add input sanitization to comments\" --label \"swarm\"\n\n# Each agent picks the next open issue and works it\n# Agent claims issue → creates branch → implements → opens PR → picks next\n# No coordinator needed — agents work at their own pace",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Patron essaim compris !',
    },

    // === CHOOSING THE RIGHT PATTERN ===
    {
      type: 'multiple-choice',
      question: 'Tu as 12 endpoints API qui ont chacun besoin d\'une validation d\'entrée ajoutée. Aucun endpoint ne dépend d\'un autre. Quel patron convient le mieux ?',
      options: [
        'Moyeu-et-rayons — tu assignes chaque endpoint à un agent',
        'Pipeline — un agent écrit la validation, un autre la révise',
        'Essaim — les agents piochent des endpoints depuis un pool indépendamment',
        'Aucun — un seul agent devrait faire les 12',
      ],
      correctIndex: 2,
      explanation: "12 tâches indépendantes, de portée similaire, sans dépendances entre elles — c'est le scénario d'essaim par excellence. Les agents se sélectionnent depuis le pool et travaillent à leur propre rythme. Débit maximum.",
    },
    {
      type: 'multiple-choice',
      question: 'Ton équipe doit construire une fonctionnalité, la réviser pour la sécurité, la tester et la déployer. Quel patron ?',
      options: [
        'Moyeu-et-rayons',
        'Pipeline',
        'Essaim',
        'N\'importe quel patron fonctionne aussi bien',
      ],
      correctIndex: 1,
      explanation: "Construire, réviser, tester, déployer — ce sont des étapes séquentielles où chacune dépend de la sortie de la précédente. Le pipeline est le choix naturel. Tu ne peux pas tester du code qui n'a pas été construit, et tu ne peux pas déployer du code qui n'a pas été testé.",
    },
    {
      type: 'multiple-choice',
      question: 'Tu as 3 fonctionnalités indépendantes à construire mais tu veux personnellement réviser chacune avant de fusionner. Quel patron ?',
      options: [
        'Moyeu-et-rayons — tu coordonnes et révises chaque agent',
        'Pipeline — les agents construisent séquentiellement',
        'Essaim — les agents se sélectionnent des fonctionnalités',
        'Pipeline avec des étapes en essaim',
      ],
      correctIndex: 0,
      explanation: "Tu veux un contrôle personnel sur chaque résultat. Ça fait de toi le moyeu — les agents travaillent indépendamment sur leurs fonctionnalités, te rendent des comptes, et tu révises et fusionnes. Le moyeu-et-rayons préserve ton contrôle.",
    },

    // === MEASURING FLEET THROUGHPUT ===
    {
      type: 'info',
      title: 'Le débit de la flotte, pas la vitesse de l\'agent',
      body: "La vitesse individuelle d'un agent n'a pas d'importance. Ce qui compte, c'est le débit de la flotte : le nombre total de tâches complétées par heure à travers tous les agents. Un essaim de 5 agents complétant chacun 2 tâches/heure = 10 tâches/heure. Un pipeline de 4 agents complétant 1 tâche toutes les 40 minutes = 1,5 tâches/heure. Le patron que tu choisis détermine ton plafond de débit. Chaque patron a aussi un coût de coordination — le moyeu-et-rayons coûte du temps de révision, le pipeline coûte du temps d'inactivité, l'essaim coûte du temps de définition de tâches. L'objectif est de choisir le patron où le coût croît le plus lentement pour ta charge de travail.",
    },
    {
      type: 'code-demo',
      title: 'Comparaison de débit',
      body: 'Mêmes 5 agents, mêmes 10 tâches. Le choix du patron détermine le temps total de complétion.',
      language: 'text',
      filename: 'throughput-comparison.txt',
      code: "Scenario: 10 independent tasks, 5 agents, ~15 min per task\n\nHub-and-spoke:\n  Round 1: 5 tasks in parallel → 15 min\n  Round 2: 5 tasks in parallel → 15 min\n  + Your review time between rounds → ~5 min\n  Total: ~35 min | Throughput: ~17 tasks/hr\n\nPipeline (build→review→test):\n  Each task passes through 3 stages → 45 min per task\n  Agents idle between stages\n  Total: ~90 min | Throughput: ~7 tasks/hr\n\nSwarm:\n  All agents pull from pool continuously\n  No coordinator delay between tasks\n  Total: ~30 min | Throughput: ~20 tasks/hr",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'La pensée en débit de flotte débloquée !',
    },

    // === PRACTICAL EXERCISES ===
    {
      type: 'order',
      instruction: 'Ordonne ces patrons du PLUS d\'implication du coordinateur au MOINS :',
      items: ['Essaim', 'Moyeu-et-rayons', 'Pipeline'],
      correctOrder: [1, 2, 0],
    },
    {
      type: 'code-input',
      instruction: 'La formule pour les connexions de coordination entre n agents est n*(n-1)/2. Combien de connexions existent entre 6 agents ?',
      placeholder: '____',
      answer: '15',
      hint: 'Substitue n=6 : 6*(6-1)/2 = 6*5/2',
    },

    // === FINAL CHECKLIST ===
    {
      type: 'checklist',
      title: 'Liste de vérification de coordination multi-agents :',
      items: [
        'Je comprends pourquoi le coût de coordination croît selon n*(n-1)/2',
        'Je sais appliquer le moyeu-et-rayons pour des tâches indépendantes et contrôlées',
        'Je sais appliquer le pipeline pour des flux séquentiels par étapes',
        'Je sais appliquer l\'essaim pour de nombreuses tâches indépendantes bien définies',
        'Je choisis les patrons en fonction de la structure de dépendances des tâches',
        'Je mesure le débit de la flotte, pas la vitesse individuelle d\'un agent',
        'Je surveille la taxe de coordination et je la minimise',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Coordination multi-agents complétée ! Tu peux faire grandir ta force de travail IA avec le bon patron pour chaque situation.',
    },
  ],
}

export default content
