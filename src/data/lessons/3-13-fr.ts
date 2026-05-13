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
      type: 'code-fill',
      instruction: 'Remplis les nombres de connexions manquants avec la formule n*(n-1)/2. Ça montre pourquoi le coût de coordination explose.',
      language: 'text',
      filename: 'coordination-overhead.txt',
      template: `Agents    Connections    Overhead
──────    ───────────    ────────
  2            1         Trivial
  3            {{three_agents}}         Manageable
  4            6         Needs structure
  5           {{five_agents}}         Needs a pattern
  7           21         Needs automation
 10           {{ten_agents}}         Needs a framework`,
      blanks: [
        { id: 'three_agents', answer: '3', alternatives: ['3'], placeholder: '?', hint: '3*(3-1)/2 = 3*2/2' },
        { id: 'five_agents', answer: '10', alternatives: ['10'], placeholder: '?', hint: '5*(5-1)/2 = 5*4/2' },
        { id: 'ten_agents', answer: '45', alternatives: ['45'], placeholder: '?', hint: '10*(10-1)/2 = 10*9/2' },
      ],
      explanation: "Le nombre de conflits potentiels croît beaucoup plus vite que le nombre d'agents. C'est pourquoi « juste ajouter plus d'agents » ne passe pas à l'échelle sans structure.",
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
      type: 'multiple-choice',
      question: 'Dans le patron moyeu-et-rayons, comment les agents communiquent-ils ?',
      options: [
        'Les agents communiquent directement entre eux via des fichiers partagés',
        'Chaque agent te rend des comptes à toi (le moyeu) seulement — aucune communication inter-agents',
        'Les agents passent leurs sorties à l\'agent suivant dans une chaîne',
        'Les agents se sélectionnent des tâches depuis un pool partagé',
      ],
      correctIndex: 1,
      explanation: "Dans le patron moyeu-et-rayons, tu es le moyeu. Chaque agent te rend des comptes à toi et seulement à toi. Les agents ne communiquent jamais entre eux. Tu assignes les tâches, collectes les résultats et gères l'intégration. Forces : modèle mental simple, pas de conflits inter-agents. Faiblesse : tu es le goulot d'étranglement.",
    },
    {
      type: 'interactive-diagram',
      title: 'Moyeu et rayons',
      body: 'Clique pour voir comment tu coordonnes tout en tant que moyeu central.',
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
      stages: [
        {
          highlightNodes: ['you'],
          highlightEdges: [],
          explanation: 'Tu es le moyeu — le coordinateur central. Tu écris les spécifications, assignes les tâches et prends toutes les décisions. C\'est le point de départ de chaque opération de flotte.',
        },
        {
          highlightNodes: ['you', 'a', 'b', 'c'],
          highlightEdges: [{ from: 'you', to: 'a' }, { from: 'you', to: 'b' }, { from: 'you', to: 'c' }],
          explanation: 'Tu assignes des tâches indépendantes à chaque agent. Ils travaillent en parallèle, chacun dans son propre worktree. Aucun agent ne sait ce que les autres font.',
        },
        {
          highlightNodes: ['you', 'a', 'b', 'c'],
          highlightEdges: [{ from: 'a', to: 'you' }, { from: 'b', to: 'you' }, { from: 'c', to: 'you' }],
          explanation: 'Les agents te retournent les résultats. Tu révises, fusionnes et gères l\'intégration. Le goulot d\'étranglement : tout passe par toi.',
        },
      ],
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette configuration moyeu-et-rayons. Remplis les commandes worktree et la séquence de fusion.',
      language: 'bash',
      filename: 'hub-and-spoke.sh',
      template: `# You are the hub — assign independent features to separate worktrees
git worktree add ../feature-auth {{auth_branch}}
git worktree add ../feature-dashboard feat/dashboard
git worktree add ../feature-settings feat/settings

# Launch agents in parallel (each in its own worktree)
# Agent A: auth system
# Agent B: dashboard UI
# Agent C: settings page

# You check on each, resolve any issues, merge results
git merge {{first_merge}}
git merge feat/dashboard
git merge feat/settings`,
      blanks: [
        { id: 'auth_branch', answer: 'feat/auth', alternatives: ['feat/auth', '-b feat/auth'], placeholder: 'nom de branche', hint: 'Suis la convention de nommage : préfixe feat/ + nom de fonctionnalité' },
        { id: 'first_merge', answer: 'feat/auth', alternatives: ['feat/auth'], placeholder: 'quelle branche en premier ?', hint: 'Auth est la fondation — fusionne-la en premier car les autres peuvent dépendre des types de session' },
      ],
      explanation: 'Chaque agent a un worktree séparé et une tâche indépendante. Tu les lances, tu vérifies leur avancement, et tu fusionnes leur travail. En tant que moyeu, tu contrôles l\'ordre de fusion.',
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
      type: 'multiple-choice',
      question: 'Dans un patron pipeline, comment les agents sont-ils reliés entre eux ?',
      options: [
        'Tous les agents travaillent sur la même tâche simultanément',
        'Les agents sont disposés en séquence — chacun se spécialise dans une étape et passe sa sortie au suivant',
        'Les agents communiquent librement et divisent le travail dynamiquement',
        'Un agent coordonne tous les autres depuis le centre',
      ],
      correctIndex: 1,
      explanation: "Dans un pipeline, les agents sont disposés en séquence. L'Agent A construit, l'Agent B révise, l'Agent C teste, l'Agent D déploie. Chacun se spécialise dans une étape et passe sa sortie au suivant. Forces : séparation claire des responsabilités. Faiblesse : c'est séquentiel — le temps total est la somme de toutes les étapes.",
    },
    {
      type: 'interactive-diagram',
      title: 'Pipeline',
      body: 'Clique pour voir comment chaque étape alimente la suivante dans un pipeline séquentiel.',
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
      stages: [
        {
          highlightNodes: ['build'],
          highlightEdges: [],
          explanation: 'Étape 1 : L\'agent de construction écrit la fonctionnalité. Tous les autres agents sont inactifs, en attente d\'entrée. C\'est le coût principal du pipeline — la sérialisation.',
        },
        {
          highlightNodes: ['build', 'review'],
          highlightEdges: [{ from: 'build', to: 'review' }],
          explanation: 'Étape 2 : La sortie de construction passe à l\'agent de révision. Il vérifie les problèmes de sécurité, les violations de style et les erreurs de logique. La qualité s\'améliore à chaque étape.',
        },
        {
          highlightNodes: ['review', 'test'],
          highlightEdges: [{ from: 'review', to: 'test' }],
          explanation: 'Étape 3 : Le code révisé passe à l\'agent de test. Il écrit et exécute les tests, corrigeant les échecs. Chaque étape ne fait que consommer une entrée et produire une sortie.',
        },
        {
          highlightNodes: ['test', 'deploy', 'done'],
          highlightEdges: [{ from: 'test', to: 'deploy' }, { from: 'deploy', to: 'done' }],
          explanation: 'Étape 4 : Le code passant est livré en production. Temps total = somme de toutes les étapes. Le pipeline garantit la qualité mais sacrifie le parallélisme.',
        },
      ],
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce script pipeline. Remplis les prompts spécifiques à chaque étape.',
      language: 'bash',
      filename: 'pipeline.sh',
      template: `# Stage 1: Build agent writes the feature
claude -p "Implement the user profile API endpoint in src/api/profile.ts.\\
  Follow existing route patterns. Include input validation."

# Stage 2: Review agent checks quality
claude -p "{{review_prompt}}"

# Stage 3: Test agent verifies behavior
claude -p "Write and run tests for src/api/profile.ts.\\
  Cover happy path, validation errors, and auth failures.\\
  Fix any failing tests."

# Stage 4: Deploy agent ships it
claude -p "{{deploy_prompt}}"`,
      blanks: [
        { id: 'review_prompt', answer: 'Review src/api/profile.ts for security issues, error handling gaps, and style violations. Fix any issues found.', alternatives: ['Review src/api/profile.ts for security issues, error handling gaps, and style violations. Fix any issues found.'], placeholder: 'instruction de l\'agent de révision', hint: 'L\'agent de révision vérifie les problèmes de sécurité, les lacunes de gestion d\'erreurs et les violations de style dans le fichier construit' },
        { id: 'deploy_prompt', answer: 'Run the full build, verify all tests pass, commit with a descriptive message, and push to main.', alternatives: ['Run the full build, verify all tests pass, commit with a descriptive message, and push to main.'], placeholder: 'instruction de l\'agent de déploiement', hint: 'Build, vérifier les tests, commiter et pousser — la dernière étape qui livre en production' },
      ],
      explanation: 'Chaque étape se termine avant que la suivante ne commence. Les agents sont spécialisés — l\'agent de construction ne teste jamais, l\'agent de test ne déploie jamais. C\'est le patron pipeline en action.',
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
      type: 'multiple-choice',
      question: 'Quel est le prérequis clé pour que le patron essaim fonctionne ?',
      options: [
        'Un coordinateur central puissant pour assigner les tâches dynamiquement',
        'Des agents capables de communiquer entre eux en temps réel',
        'Chaque tâche doit être indépendante, bien définie et d\'envergure à peu près égale',
        'Au moins 10 agents tournant simultanément',
      ],
      correctIndex: 2,
      explanation: "Dans un essaim, les agents piochent des tâches depuis un pool partagé sans coordinateur central. Quand un agent termine, il prend la tâche suivante. Chaque tâche doit être indépendante, bien définie et d'envergure à peu près égale. Forces : parallélisme maximum, pas de goulot d'étranglement. Faiblesse : les tâches doivent être véritablement indépendantes, et tu as besoin de définitions extrêmement claires.",
    },
    {
      type: 'interactive-diagram',
      title: 'Passage à l\'échelle de l\'essaim',
      body: 'Clique pour voir comment les agents se sélectionnent des tâches depuis un pool partagé et passent à l\'échelle horizontalement.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'pool', label: 'Pool de tâches', sublabel: '12 tâches', shape: 'rounded', highlight: true },
          { id: 'a', label: 'Agent A', shape: 'rect' },
          { id: 'b', label: 'Agent B', shape: 'rect' },
          { id: 'c', label: 'Agent C', shape: 'rect' },
          { id: 'd', label: 'Agent D', shape: 'rect' },
          { id: 'done', label: 'Terminé', sublabel: 'Toutes les tâches complétées', shape: 'pill' },
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
          { from: 'a', to: 'done', dashed: true },
          { from: 'b', to: 'done', dashed: true },
          { from: 'c', to: 'done', dashed: true },
          { from: 'd', to: 'done', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['pool'],
          highlightEdges: [],
          explanation: 'Le pool de tâches contient 12 tâches indépendantes et bien définies. Chaque tâche est autonome — aucune tâche ne dépend d\'une autre. C\'est le prérequis pour le patron essaim.',
        },
        {
          highlightNodes: ['pool', 'a', 'b', 'c', 'd'],
          highlightEdges: [{ from: 'pool', to: 'a' }, { from: 'pool', to: 'b' }, { from: 'pool', to: 'c' }, { from: 'pool', to: 'd' }],
          explanation: 'Tour 1 : Les 4 agents piochent leur première tâche simultanément. Aucun coordinateur n\'assigne le travail — les agents se sélectionnent eux-mêmes. 4 tâches en cours, 8 restantes.',
        },
        {
          highlightNodes: ['a', 'b', 'pool'],
          highlightEdges: [{ from: 'a', to: 'pool' }, { from: 'b', to: 'pool' }],
          explanation: 'Les Agents A et B finissent en premier et piochent immédiatement la tâche suivante. Pas d\'attente pour un coordinateur. Les Agents C et D travaillent encore sur leur première tâche. 6 tâches terminées ou en cours.',
        },
        {
          highlightNodes: ['a', 'b', 'c', 'd', 'done'],
          highlightEdges: [{ from: 'a', to: 'done' }, { from: 'b', to: 'done' }, { from: 'c', to: 'done' }, { from: 'd', to: 'done' }],
          explanation: 'Les 12 tâches sont complétées. Les agents plus rapides prennent naturellement plus de tâches — pas besoin d\'équilibrage de charge. Le temps total est déterminé par la tâche individuelle la plus lente, pas par le nombre total. Débit maximum.',
        },
      ],
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette configuration de pool de tâches en essaim avec GitHub Issues. Remplis les définitions de tâches autonomes et indépendantes.',
      language: 'bash',
      filename: 'swarm-tasks.sh',
      template: `# Create the task pool — each issue is a self-contained unit of work
gh issue create --title "Add email validation to signup" --label "{{swarm_label}}"
gh issue create --title "Add rate limiting to /api/search" --label "{{swarm_label}}"
gh issue create --title "Add loading skeleton to profile" --label "{{swarm_label}}"
gh issue create --title "{{webhook_task}}" --label "{{swarm_label}}"
gh issue create --title "Add cache headers to static assets" --label "{{swarm_label}}"
gh issue create --title "Add input sanitization to comments" --label "{{swarm_label}}"

# Each agent picks the next open issue and works it
# Agent claims issue → creates branch → implements → opens PR → picks next
# No coordinator needed — agents work at their own pace`,
      blanks: [
        { id: 'swarm_label', answer: 'swarm', alternatives: ['swarm', '"swarm"'], placeholder: 'label pour les tâches essaim', hint: 'Un label qui identifie les tâches appartenant à ce pool d\'essaim' },
        { id: 'webhook_task', answer: 'Add retry logic to payment webhook', alternatives: ['Add retry logic to payment webhook'], placeholder: 'une autre tâche indépendante', hint: 'Une tâche autonome liée à la fiabilité du webhook de paiement' },
      ],
      explanation: 'Utilise les GitHub Issues comme pool de tâches. Chaque agent réclame un issue, le travaille, soumet un PR, puis prend le suivant. La clé : chaque issue doit être totalement indépendant — aucune tâche ne dépend d\'une autre.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Patron essaim compris !',
    },

    // === MATCH: Patrons de scaling → cas d'utilisation ===
    {
      type: 'match',
      instruction: 'Associe chaque patron de flotte à son meilleur cas d\'utilisation :',
      leftItems: ['Moyeu-et-rayons', 'Pipeline', 'Essaim'],
      rightItems: ['Traitement séquentiel de données avec transferts entre étapes', 'Coordinateur central dirigeant des agents spécialistes', 'De nombreux agents identiques travaillant indépendamment sur des tâches similaires'],
      correctPairs: { 0: 1, 1: 0, 2: 2 },
      explanation: 'Le moyeu-et-rayons utilise un orchestrateur central pour coordonner les spécialistes. Le pipeline enchaîne les étapes séquentiellement. L\'essaim fait tourner des travailleurs identiques en parallèle sur des tâches indépendantes.',
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
      type: 'multiple-choice',
      question: 'Un essaim de 5 agents complétant chacun 2 tâches/heure atteint quel débit de flotte ?',
      options: [
        '2 tâches/heure (limité par la vitesse individuelle de l\'agent)',
        '5 tâches/heure (une par agent)',
        '10 tâches/heure (5 agents x 2 tâches chacun)',
        '7 tâches/heure (moyenne des agents et des tâches)',
      ],
      correctIndex: 2,
      explanation: "La vitesse individuelle d'un agent n'a pas d'importance — c'est le débit de la flotte qui compte. 5 agents x 2 tâches/heure chacun = 10 tâches/heure au total. Le patron que tu choisis détermine ton plafond de débit. Chaque patron a un coût de coordination : le moyeu-et-rayons coûte du temps de révision, le pipeline coûte du temps d'inactivité, l'essaim coûte du temps de définition de tâches.",
    },
    {
      type: 'code-fill',
      instruction: 'Remplis les calculs de débit pour chaque patron de coordination. Mêmes 5 agents, mêmes 10 tâches, ~15 min par tâche.',
      language: 'text',
      filename: 'throughput-comparison.txt',
      template: `Scenario: 10 independent tasks, 5 agents, ~15 min per task

Hub-and-spoke:
  Round 1: 5 tasks in parallel → 15 min
  Round 2: 5 tasks in parallel → 15 min
  + Your review time between rounds → ~5 min
  Total: ~35 min | Throughput: ~{{hub_throughput}} tasks/hr

Pipeline (build→review→test):
  Each task passes through 3 stages → 45 min per task
  Agents idle between stages
  Total: ~90 min | Throughput: ~{{pipeline_throughput}} tasks/hr

Swarm:
  All agents pull from pool continuously
  No coordinator delay between tasks
  Total: ~{{swarm_time}} min | Throughput: ~20 tasks/hr`,
      blanks: [
        { id: 'hub_throughput', answer: '17', alternatives: ['17', '~17'], placeholder: '?', hint: '10 tâches en ~35 min. Mise à l\'échelle horaire : 10/35*60' },
        { id: 'pipeline_throughput', answer: '7', alternatives: ['7', '~7'], placeholder: '?', hint: '10 tâches en ~90 min. Mise à l\'échelle horaire : 10/90*60' },
        { id: 'swarm_time', answer: '30', alternatives: ['30', '~30'], placeholder: '?', hint: '10 tâches / 5 agents = 2 tours de ~15 min chacun, pas de délai entre les tours' },
      ],
      explanation: 'Mêmes agents, mêmes tâches — le patron détermine le débit. L\'essaim gagne pour les tâches indépendantes (pas de surcoût de coordination). Le pipeline est le pire pour les tâches indépendantes (sérialisation forcée). Le moyeu-et-rayons se situe entre les deux.',
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
