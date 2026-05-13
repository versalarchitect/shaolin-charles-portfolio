import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-3',
  steps: [
    {
      type: 'info',
      title: 'La plupart des gens ne dépassent jamais le niveau 1',
      body: "Il y a cinq niveaux d'assistance IA — du copier-coller dans une fenêtre de chat aux agents entièrement autonomes avec accès aux outils. La plupart des développeurs restent au niveau 1 pour toujours : coller du code, obtenir une réponse, recoller. Ça marche, mais c'est comme utiliser une Ferrari pour aller à l'épicerie. Cette leçon t'apprend à reconnaître quel niveau une tâche demande et à escalader en conséquence.",
    },
    {
      type: 'info',
      title: 'L\'échelle des outils',
      body: "Pense aux outils IA comme une échelle. Chaque barreau te donne plus de puissance mais demande plus de configuration. L'habileté n'est pas de grimper au sommet — c'est de savoir quel barreau convient au travail. Un simple renommage ? Coller. Un rapport quotidien ? Script. La construction d'une fonctionnalité complète ? Agent. Faire correspondre l'outil à la tâche, c'est ce qui sépare les utilisateurs occasionnels des directeurs efficaces.",
    },
    {
      type: 'interactive-diagram',
      title: 'L\'échelle des outils',
      body: 'Clique sur chaque barreau pour comprendre les cinq niveaux d\'assistance IA.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'mcp', label: 'MCP', sublabel: 'Connecté', shape: 'rounded', highlight: true },
          { id: 'agent', label: 'Agent', sublabel: 'Autonome', shape: 'rect' },
          { id: 'script', label: 'Script', sublabel: 'Automatisé', shape: 'rect' },
          { id: 'skill', label: 'Skill', sublabel: 'Réutilisable', shape: 'rect' },
          { id: 'paste', label: 'Coller', sublabel: 'Copier-coller', shape: 'rect' },
        ],
        edges: [
          { from: 'paste', to: 'skill' },
          { from: 'skill', to: 'script' },
          { from: 'script', to: 'agent' },
          { from: 'agent', to: 'mcp' },
        ],
      },
      stages: [
        {
          highlightNodes: ['paste'],
          highlightEdges: [],
          explanation: 'Niveau 1 : Coller. Copie une question dans ChatGPT ou Claude.ai, lis la réponse, recolle. Zéro configuration. Bon pour les questions ponctuelles. Mais entièrement manuel à chaque fois, sans mémoire entre les sessions.',
        },
        {
          highlightNodes: ['paste', 'skill'],
          highlightEdges: [{ from: 'paste', to: 'skill' }],
          explanation: 'Niveau 2 : Skill. Un modèle de prompt réutilisable que tu invoques par son nom (comme /a11y-review). Tu le définis une fois, tu l\'utilises sur n\'importe quelle cible. L\'IA édite les fichiers directement au lieu que tu copies-colles. Utilise quand tu te surprends à coller la même question plus de deux fois.',
        },
        {
          highlightNodes: ['skill', 'script'],
          highlightEdges: [{ from: 'skill', to: 'script' }],
          explanation: 'Niveau 3 : Script. L\'IA tourne sans toi. Un script appelle l\'API sur un cron job ou un hook git. Aucun humain dans la boucle. Pour les tâches prévisibles et répétitives qui ne nécessitent aucun jugement.',
        },
        {
          highlightNodes: ['script', 'agent'],
          highlightEdges: [{ from: 'script', to: 'agent' }],
          explanation: 'Niveau 4 : Agent. L\'IA lit ta codebase, planifie une approche multi-étapes, édite plusieurs fichiers, lance les tests et corrige les erreurs. Tu donnes une seule instruction de haut niveau. Pour les tâches complexes qui nécessitent de comprendre la codebase.',
        },
        {
          highlightNodes: ['agent', 'mcp'],
          highlightEdges: [{ from: 'agent', to: 'mcp' }],
          explanation: 'Niveau 5 : MCP. Le mode agent plus l\'accès aux outils externes. L\'IA se connecte aux bases de données, API, navigateurs et services via le Model Context Protocol. Action autonome avec connectivité au monde réel.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Échelle débloquée !',
    },

    // === LEVEL 1: PASTE ===
    {
      type: 'multiple-choice',
      question: 'Quelle est la limitation principale du Niveau 1 (Coller) ?',
      options: [
        'Il ne peut pas comprendre le code',
        'C\'est manuel à chaque fois, sans mémoire entre les sessions, sans accès aux fichiers et sans automatisation',
        'Il ne fonctionne qu\'avec le code Python',
        'Il nécessite un abonnement payant',
      ],
      correctIndex: 1,
      explanation: 'Le niveau 1 est le plus simple : copier du code ou une question dans ChatGPT ou Claude.ai, lire la réponse, recoller. Zéro configuration, résultats instantanés. Parfait pour les questions ponctuelles comme « que fait cette regex ? ». Mais c\'est manuel à chaque fois — aucune mémoire entre les sessions, aucun accès aux fichiers, aucune automatisation.',
    },
    {
      type: 'multiple-choice',
      question: 'Quelle tâche est la MIEUX adaptée au niveau coller ?',
      options: [
        'Refactoriser 50 fichiers pour utiliser une nouvelle API',
        'Expliquer ce que fait un one-liner confus',
        'Exécuter des migrations de base de données à chaque déploiement',
        'Construire une fonctionnalité CRUD complète avec des tests',
      ],
      correctIndex: 1,
      explanation: 'Le niveau coller est idéal pour les questions rapides, ponctuelles, qui nécessitent un humain pour appliquer la réponse. Expliquer une ligne confuse est un cas parfait — question rapide, réponse rapide, terminé.',
    },

    // === LEVEL 2: SKILL ===
    {
      type: 'multiple-choice',
      question: 'Quand devrais-tu créer un skill réutilisable au lieu de coller le même prompt ?',
      options: [
        'Seulement pour les tâches qui prennent plus d\'une heure',
        'Quand tu te surprends à coller le même type de question plus de deux fois',
        'Seulement pour les tâches de revue de code',
        'Quand le modèle IA change de version',
      ],
      correctIndex: 1,
      explanation: 'Un skill est un modèle de prompt réutilisable que tu définis une fois et invoques par son nom. Dans Claude Code, tu crées un /skill qui encapsule des instructions, du contexte et des contraintes. Au lieu de retaper « révise ce composant pour les problèmes d\'accessibilité » à chaque fois, tu lances /a11y-review. Utilise les skills quand tu te surprends à coller le même type de question plus de deux fois.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette définition de skill. Un skill encapsule des instructions réutilisables que tu invoques par nom sur n\'importe quel fichier.',
      language: 'markdown',
      filename: '.claude/commands/a11y-review.md',
      template: '# {{skill_title}} Review\n\nReview the given component for:\n- Missing {{attr_type}} attributes\n- Keyboard navigation issues\n- {{contrast_issue}} problems\n- Screen reader compatibility\n\nOutput a numbered list of issues with fixes.',
      blanks: [
        { id: 'skill_title', answer: 'Accessibility', alternatives: ['A11y', 'accessibility'], placeholder: '______', hint: 'Quel type de révision ce skill effectue-t-il ?' },
        { id: 'attr_type', answer: 'ARIA', alternatives: ['aria', 'Aria'], placeholder: '____', hint: 'Attributs HTML pour l\'accessibilité' },
        { id: 'contrast_issue', answer: 'Color contrast', alternatives: ['color contrast', 'Colour contrast', 'colour contrast'], placeholder: '______', hint: 'Un problème d\'accessibilité visuelle lié aux couleurs' },
      ],
      explanation: 'Ce skill vérifie les quatre piliers de l\'accessibilité web : les attributs ARIA, la navigation clavier, le contraste des couleurs et la compatibilité lecteur d\'écran. Tu le définis une fois et tu l\'invoques sur n\'importe quel composant avec /a11y-review.',
    },
    {
      type: 'code-input',
      instruction: 'Dans Claude Code, comment invoques-tu un skill nommé "a11y-review" ?',
      placeholder: '/_____-______',
      answer: '/a11y-review',
      hint: 'Les skills sont invoqués avec un slash suivi du nom du skill',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Skills compris !',
    },

    // === LEVEL 3: SCRIPT ===
    {
      type: 'multiple-choice',
      question: 'Un script Node lit ton git diff à chaque push, l\'envoie à Claude, et poste une revue sur Slack. Quel niveau de l\'échelle des outils est-ce ?',
      options: [
        'Niveau 1 : Coller',
        'Niveau 2 : Skill',
        'Niveau 3 : Script',
        'Niveau 4 : Agent',
      ],
      correctIndex: 2,
      explanation: 'Un script appelle l\'API de l\'IA de façon programmatique, sans aucun humain dans la boucle — ça tourne sur un horaire, un hook git ou dans le CI. La différence clé avec un skill : les scripts tournent sans toi. Ils sont entièrement automatisés. Utilise ce niveau quand la tâche est prévisible, répétitive et ne nécessite pas de jugement.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce script CI qui révise automatiquement les PR. Il lit le diff, l\'envoie à Claude et affiche la révision. Aucun humain nécessaire.',
      language: 'typescript',
      filename: 'scripts/review-diff.ts',
      template: "import Anthropic from '{{import_path}}'\n\nconst client = new Anthropic()\nconst diff = await $`git diff {{diff_range}}`\n\nconst review = await client.messages.create({\n  model: 'claude-sonnet-4-20250514',\n  max_tokens: {{max_tokens}},\n  messages: [{\n    role: 'user',\n    content: `Review this diff:\\n${diff}`\n  }]\n})\n\nconsole.log(review.content[0].text)",
      blanks: [
        { id: 'import_path', answer: '@anthropic-ai/sdk', alternatives: ['anthropic'], placeholder: '______', hint: 'Le nom du package officiel du SDK Anthropic' },
        { id: 'diff_range', answer: 'main...HEAD', alternatives: ['main..HEAD'], placeholder: '______', hint: 'La plage git diff de la branche main au HEAD actuel' },
        { id: 'max_tokens', answer: '1024', alternatives: ['1024', '2048', '4096'], placeholder: '____', hint: 'Une limite de tokens raisonnable pour une réponse de revue de code' },
      ],
      explanation: 'Ce script importe le SDK Anthropic, récupère le git diff de main au HEAD, et l\'envoie à Claude pour révision. Il tourne dans le CI sans aucune interaction humaine — la caractéristique définissante du Niveau 3 (Script).',
    },
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce qui différencie un script d\'un skill ?',
      options: [
        'Les scripts utilisent un modèle IA différent',
        'Les scripts tournent sans interaction humaine',
        'Les scripts sont plus rapides',
        'Les scripts ne peuvent tourner qu\'en local',
      ],
      correctIndex: 1,
      explanation: 'La différence fondamentale : les scripts sont entièrement automatisés. Ils appellent l\'API, traitent le résultat et agissent — aucun humain ne colle ou ne révise dans la boucle.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Automatisation débloquée !',
    },

    // === LEVEL 4: AGENT ===
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce qui distingue un agent (Niveau 4) d\'un script (Niveau 3) ?',
      options: [
        'Les agents sont plus rapides parce qu\'ils sautent l\'étape de planification',
        'Les agents peuvent lire ta codebase, planifier des approches multi-étapes, éditer plusieurs fichiers et corriger des erreurs de façon autonome à partir d\'une seule instruction',
        'Les agents tournent selon un horaire sans interaction humaine, comme les scripts',
        'Les agents ne fonctionnent qu\'avec le code Python, tandis que les scripts fonctionnent avec tout langage',
      ],
      correctIndex: 1,
      explanation: 'Un agent est une IA qui agit de façon autonome dans ta codebase. Claude Code en mode agent peut lire tes fichiers, comprendre la structure de ton projet, écrire du code dans plusieurs fichiers, lancer des tests et corriger des erreurs — le tout à partir d\'une seule instruction de haut niveau. Tu dis « ajoute le support du mode sombre à la page de paramètres » et il lit le code existant, identifie le système de thème, modifie les composants, met à jour les styles et vérifie que le build passe. Les scripts sont automatisés mais prévisibles ; les agents raisonnent et s\'adaptent.',
    },
    {
      type: 'terminal',
      instruction: 'Lance Claude Code en mode agent (le mode par défaut quand tu le démarres) :',
      expectedCommand: 'claude',
      hint: 'Tape simplement le nom de la commande pour démarrer Claude Code',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce prompt de niveau agent. Une seule instruction qui prendrait plusieurs interactions de niveau coller.',
      language: 'text',
      template: "Add a /health endpoint to the API that returns:\n- server {{metric_1}}\n- {{metric_2}} connection status\n- current memory usage\n\nInclude {{include_what}}. Use the existing error handling pattern\nfrom the other routes.",
      blanks: [
        { id: 'metric_1', answer: 'uptime', alternatives: ['up time'], placeholder: '______', hint: 'Depuis combien de temps le serveur tourne' },
        { id: 'metric_2', answer: 'database', alternatives: ['db', 'DB'], placeholder: '______', hint: 'Le stockage persistant de données' },
        { id: 'include_what', answer: 'tests', alternatives: ['test', 'unit tests', 'test cases'], placeholder: '______', hint: 'Ce que tu devrais toujours écrire avec les nouveaux endpoints' },
      ],
      explanation: 'Ce prompt démontre le travail de niveau agent : il requiert de lire le code existant (pattern de gestion d\'erreurs), créer un nouveau fichier, et vérifier que ça fonctionne (tests). Une approche de niveau coller nécessiterait plusieurs allers-retours.',
    },

    // === LEVEL 5: MCP ===
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce que MCP (Model Context Protocol) ajoute par-dessus le mode agent ?',
      options: [
        'Une interface graphique pour l\'agent',
        'La capacité de se connecter à des outils externes comme des bases de données, des API, des navigateurs et des services via un protocole standardisé',
        'Des temps de réponse plus rapides en mettant en cache les conversations précédentes',
        'La capacité de faire tourner plusieurs agents en parallèle sur différentes codebases',
      ],
      correctIndex: 1,
      explanation: 'MCP, c\'est le mode agent plus l\'accès aux outils externes. L\'agent ne fait pas que lire et écrire des fichiers — il se connecte à des bases de données, des API, des navigateurs et des services via un protocole standardisé. Un agent équipé MCP peut interroger ta base de données de production, vérifier le statut de ton déploiement Vercel, lire les issues GitHub et parcourir la documentation — le tout dans une seule conversation. C\'est le plafond : action autonome avec connectivité au monde réel.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette configuration de serveur MCP. Tu dis à Claude Code quels outils externes connecter. Chaque serveur expose des capacités que l\'agent peut utiliser.',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "{{config_key}}": {\n    "supabase": {\n      "command": "{{runner}}",\n      "args": ["-y", "@supabase/mcp-server"]\n    },\n    "browser": {\n      "command": "npx",\n      "args": ["-y", "@anthropic/mcp-browser"]\n    }\n  }\n}',
      blanks: [
        { id: 'config_key', answer: 'mcpServers', alternatives: ['mcp-servers', 'mcp_servers'], placeholder: '______', hint: 'La clé JSON qui liste les définitions de serveurs MCP' },
        { id: 'runner', answer: 'npx', alternatives: ['bunx'], placeholder: '___', hint: 'La commande d\'exécution de packages Node.js' },
      ],
      explanation: 'Les serveurs MCP sont configurés dans .claude/settings.json sous la clé "mcpServers". Chaque serveur a une commande (npx pour exécuter le package) et des arguments. L\'agent les utilise pour se connecter à des outils externes comme les bases de données Supabase et les navigateurs.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Échelle complète cartographiée !',
    },

    // === MATCH EXERCISE ===
    {
      type: 'match',
      instruction: 'Associez chaque niveau d\'outil à sa description :',
      leftItems: [
        'Level 1: Paste',
        'Level 2: Skill',
        'Level 3: Script',
        'Level 4: Agent',
        'Level 5: MCP',
      ],
      rightItems: [
        'Copier la sortie du chat IA dans votre éditeur',
        'L\'IA édite les fichiers directement dans votre projet',
        'L\'IA exécute une séquence d\'étapes prédéfinies',
        'L\'IA planifie et exécute de manière autonome',
        'L\'IA se connecte à des outils et API externes',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Chaque niveau donne plus d\'autonomie à l\'IA. Paste est du copier-coller manuel. Skill signifie l\'édition en ligne. Script automatise les étapes. Agent planifie indépendamment. MCP étend les capacités au-delà de la machine locale.',
    },

    // === COMPARE: PASTE vs MCP ===
    {
      type: 'compare',
      title: 'Niveau 1 vs Niveau 5',
      body: "L'écart entre le bas et le haut de l'échelle est énorme. Compare comment la même tâche — « vérifier si notre API est en panne » — se présente à chaque extrême.",
      question: 'Quelle approche détecte la panne plus vite et avec moins d\'effort ?',
      correctSide: 'right',
      left: {
        label: 'Niveau 1 : Coller',
        content: '1. Ouvrir le navigateur, aller sur ChatGPT\n2. Coller : « Voici mes logs serveur : [copier 200 lignes] »\n3. Lire la réponse : « On dirait un 502 sur /api/users »\n4. Ouvrir manuellement le tableau de bord Vercel\n5. Vérifier manuellement le statut du déploiement\n6. Redémarrer manuellement si nécessaire\n\nTemps : 5-10 minutes\nAutomatisation : Aucune\nContexte : Seulement ce que tu colles',
      },
      right: {
        label: 'Niveau 5 : MCP',
        content: '1. Dire à Claude Code : « Vérifie si notre API est en panne »\n2. L\'agent interroge le statut Vercel via MCP\n3. L\'agent lit les logs d\'erreur récents via MCP\n4. L\'agent vérifie le endpoint de santé directement\n5. L\'agent rapporte : « 502 sur /api/users depuis 14h32,\n   causé par une migration DB échouée. Rollback en cours. »\n\nTemps : 30 secondes\nAutomatisation : Totale\nContexte : Données de production en direct',
      },
      explanation: "Le niveau 1 t'oblige à rassembler le contexte manuellement et interpréter les résultats toi-même. Le niveau 5 se connecte aux vrais outils (Vercel, bases de données, navigateurs) et agit de façon autonome. La différence n'est pas juste la vitesse — c'est l'accès aux données en direct que l'approche coller ne peut jamais avoir.",
    },

    // === INTERACTIVE DIAGRAM: TOOL LADDER WALKTHROUGH ===
    {
      type: 'interactive-diagram',
      title: "Grimper l'échelle des outils",
      body: 'Parcours chaque niveau pour voir comment l\'autonomie augmente et l\'effort humain diminue.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'mcp', label: 'MCP', sublabel: 'Connecté', shape: 'rounded', highlight: true },
          { id: 'agent', label: 'Agent', sublabel: 'Autonome', shape: 'rect' },
          { id: 'script', label: 'Script', sublabel: 'Automatisé', shape: 'rect' },
          { id: 'skill', label: 'Skill', sublabel: 'Réutilisable', shape: 'rect' },
          { id: 'paste', label: 'Coller', sublabel: 'Copier-coller', shape: 'rect' },
        ],
        edges: [
          { from: 'paste', to: 'skill' },
          { from: 'skill', to: 'script' },
          { from: 'script', to: 'agent' },
          { from: 'agent', to: 'mcp' },
        ],
      },
      stages: [
        {
          highlightNodes: ['paste'],
          highlightEdges: [],
          explanation: "Niveau 1 : Coller. Tu copies une question dans une fenêtre de chat, tu lis la réponse et tu recolles le résultat. Zéro configuration. Entièrement manuel. Aucune mémoire entre les sessions. Bon pour les questions ponctuelles.",
        },
        {
          highlightNodes: ['paste', 'skill'],
          highlightEdges: [{ from: 'paste', to: 'skill' }],
          explanation: "Niveau 2 : Skill. Tu définis un modèle de prompt réutilisable (comme /a11y-review) et tu l'invoques par son nom. Le prompt reste le même, la cible change. L'IA édite maintenant les fichiers en ligne au lieu que tu copies-colles.",
        },
        {
          highlightNodes: ['skill', 'script'],
          highlightEdges: [{ from: 'skill', to: 'script' }],
          explanation: "Niveau 3 : Script. L'IA tourne sans toi. Un script appelle l'API selon un horaire ou un hook git — aucun humain dans la boucle. Tâches prévisibles et répétitives qui ne nécessitent aucun jugement.",
        },
        {
          highlightNodes: ['script', 'agent'],
          highlightEdges: [{ from: 'script', to: 'agent' }],
          explanation: "Niveau 4 : Agent. L'IA lit ta codebase, planifie une approche multi-étapes, écrit du code dans plusieurs fichiers, lance des tests et corrige les erreurs. Tu donnes une seule instruction de haut niveau et elle exécute de façon autonome.",
        },
        {
          highlightNodes: ['agent', 'mcp'],
          highlightEdges: [{ from: 'agent', to: 'mcp' }],
          explanation: "Niveau 5 : MCP. Le mode agent plus l'accès aux outils externes. L'IA se connecte aux bases de données, API, navigateurs et services via un protocole standardisé. Action autonome avec connectivité au monde réel — le plafond.",
        },
      ],
    },

    // === DECISION FLOW ===
    {
      type: 'interactive-diagram',
      title: 'Quand escalader',
      body: 'Parcours cet arbre de décision pour choisir le bon niveau pour n\'importe quelle tâche.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'task', label: 'Nouvelle tâche', shape: 'rounded', highlight: true },
          { id: 'repeat', label: 'Répétable ?', shape: 'diamond' },
          { id: 'paste', label: 'Coller' },
          { id: 'complex', label: 'Complexe ?', shape: 'diamond' },
          { id: 'skill', label: 'Skill' },
          { id: 'tools', label: 'Besoin d\'outils ?', shape: 'diamond' },
          { id: 'script', label: 'Script' },
          { id: 'agentmcp', label: 'Agent+MCP', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'task', to: 'repeat' },
          { from: 'repeat', to: 'paste', label: 'non' },
          { from: 'repeat', to: 'complex', label: 'oui' },
          { from: 'complex', to: 'skill', label: 'non' },
          { from: 'complex', to: 'tools', label: 'oui' },
          { from: 'tools', to: 'script', label: 'non' },
          { from: 'tools', to: 'agentmcp', label: 'oui' },
        ],
      },
      stages: [
        {
          highlightNodes: ['task', 'repeat'],
          highlightEdges: [{ from: 'task', to: 'repeat' }],
          explanation: 'Commence par la première question : cette tâche est-elle répétable ? Vas-tu faire le même type de travail demain, la semaine prochaine, ou sur chaque PR ? Si non, coller suffit.',
        },
        {
          highlightNodes: ['repeat', 'paste'],
          highlightEdges: [{ from: 'repeat', to: 'paste' }],
          explanation: 'Pas répétable ? Utilise Coller. Les questions ponctuelles comme « que signifie cette erreur ? » ou « convertis ça en TypeScript » ne nécessitent aucune configuration. Copie, demande, colle, terminé.',
        },
        {
          highlightNodes: ['repeat', 'complex', 'skill'],
          highlightEdges: [{ from: 'repeat', to: 'complex' }, { from: 'complex', to: 'skill' }],
          explanation: 'Répétable mais pas complexe ? Utilise un Skill. Les tâches répétitives simples comme « révise ce composant pour l\'accessibilité » s\'intègrent parfaitement comme modèle de prompt réutilisable.',
        },
        {
          highlightNodes: ['complex', 'tools', 'script', 'agentmcp'],
          highlightEdges: [{ from: 'complex', to: 'tools' }, { from: 'tools', to: 'script' }, { from: 'tools', to: 'agentmcp' }],
          explanation: 'Répétable et complexe ? Demande-toi : faut-il des outils externes (bases de données, API, navigateurs) ? Pas besoin d\'outils signifie qu\'un Script suffit. Besoin d\'outils signifie que tu veux Agent + MCP pour une action autonome complète avec connectivité.',
        },
      ],
    },

    // === CLASSIFY TASKS ===
    {
      type: 'multiple-choice',
      question: 'Pour classer une tâche au bon niveau d\'outil, quel ensemble de questions devrais-tu te poser ?',
      options: [
        'Combien de temps ça prendra ? Combien coûte l\'IA ? Est-ce que la tâche est intéressante ?',
        'Est-ce ponctuel ou répétitif ? Faut-il un accès aux fichiers ? Faut-il des outils externes ? Faut-il un jugement humain ?',
        'Est-ce que la tâche est écrite en TypeScript ? L\'équipe utilise-t-elle VS Code ? Y a-t-il un délai ?',
        'Quelqu\'un d\'autre a-t-il résolu ça avant ? Y a-t-il un tutoriel ? Puis-je copier la réponse ?',
      ],
      correctIndex: 1,
      explanation: 'Les bonnes questions de classification sont : Est-ce ponctuel ou répétitif ? (coller vs niveaux supérieurs) Faut-il un accès aux fichiers ? (skill vs script) Faut-il des outils externes ? (script vs agent+MCP) Faut-il un jugement humain ? (script vs agent). Ces quatre questions correspondent directement aux barreaux de l\'échelle des outils.',
    },
    {
      type: 'multiple-choice',
      question: 'Tâche : "Que fait l\'opérateur ?? en JavaScript ?" — Quel niveau ?',
      options: [
        'Coller',
        'Skill',
        'Script',
        'Agent',
      ],
      correctIndex: 0,
      explanation: 'Une question factuelle rapide sans contexte de fichier nécessaire. Colle-la dans n\'importe quel chat IA, obtiens ta réponse, terminé. Aucune configuration requise.',
    },
    {
      type: 'multiple-choice',
      question: 'Tâche : "Chaque matin, résumer les issues GitHub d\'hier et poster sur Slack." — Quel niveau ?',
      options: [
        'Coller',
        'Skill',
        'Script',
        'Agent + MCP',
      ],
      correctIndex: 2,
      explanation: 'C\'est automatisé (tourne quotidiennement sans toi), utilise des API (GitHub + Slack), et c\'est prévisible. Un script qui appelle l\'API de l\'IA sur un cron job est le bon choix.',
    },
    {
      type: 'multiple-choice',
      question: 'Tâche : "Refactoriser le module d\'auth pour utiliser le nouveau format de token, mettre à jour tous les sites d\'appel, et corriger les tests." — Quel niveau ?',
      options: [
        'Coller',
        'Skill',
        'Script',
        'Agent',
      ],
      correctIndex: 3,
      explanation: 'Ça nécessite de lire plusieurs fichiers, comprendre la structure de la codebase, faire des modifications coordonnées et lancer des tests. Le mode agent gère ça — il a besoin de l\'accès aux fichiers et d\'un raisonnement multi-étapes.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Classification des tâches maîtrisée !',
    },

    // === ORDER EXERCISE ===
    {
      type: 'order',
      instruction: 'Ordonne l\'échelle des outils de la MOINS à la PLUS de capacité :',
      items: ['Agent', 'Coller', 'MCP', 'Skill', 'Script'],
      correctOrder: [1, 3, 4, 0, 2],
    },

    // === KEY INSIGHT ===
    {
      type: 'multiple-choice',
      question: 'Tu réalises que tu lances le même skill /review manuellement sur chaque PR depuis deux semaines. Que devrais-tu faire ?',
      options: [
        'Continuer avec le skill — ça marche bien',
        'Escalader vers un script qui tourne automatiquement sur chaque PR dans le CI',
        'Rétrograder vers le niveau coller — les skills c\'est trop',
        'Escalader vers le mode agent complet avec MCP',
      ],
      correctIndex: 1,
      explanation: 'L\'instinct d\'escalade est la capacité de reconnaître, en pleine tâche, que tu es au mauvais niveau. Si tu lances un skill manuellement chaque jour, écris un script. Si le script a besoin de comprendre la codebase, passe à un agent. Si l\'agent a besoin de données externes, ajoute des serveurs MCP. Ne reste jamais sur un barreau plus longtemps que nécessaire.',
    },

    // === CHECKLIST ===
    {
      type: 'checklist',
      title: 'Check-list de reconnaissance des niveaux :',
      items: [
        'Je peux identifier les tâches de niveau coller (ponctuelles, sans accès aux fichiers)',
        'Je peux repérer quand une tâche mérite un skill réutilisable',
        'Je sais quand automatiser avec un script (aucun humain dans la boucle)',
        'Je comprends quand le mode agent est nécessaire (multi-fichiers, multi-étapes)',
        'Je sais que MCP ajoute l\'accès aux outils externes aux agents',
        'Je cherche les signaux d\'escalade dans mon workflow',
      ],
    },
    {
      type: 'checkpoint',
      xp: 9,
      message: 'Échelle des outils complétée ! Tu vois maintenant cinq niveaux là où la plupart n\'en voient qu\'un.',
    },
  ],
}

export default content
