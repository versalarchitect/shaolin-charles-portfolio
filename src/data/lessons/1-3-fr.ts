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
      type: 'diagram',
      title: 'L\'échelle des outils',
      body: 'Cinq niveaux d\'assistance IA, du manuel au pleinement connecté. Chaque barreau ajoute de la capacité — et du coût de configuration.',
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
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Échelle débloquée !',
    },

    // === LEVEL 1: PASTE ===
    {
      type: 'info',
      title: 'Niveau 1 : Coller',
      body: "Le niveau le plus simple. Tu copies du code ou une question dans ChatGPT ou Claude.ai, tu lis la réponse, et tu recolles le résultat dans ton éditeur. Zéro configuration, résultats instantanés. Parfait pour les questions ponctuelles comme « que fait cette regex ? » ou « convertis cette fonction en TypeScript ». La limite : c'est manuel à chaque fois. Aucune mémoire entre les sessions, aucun accès aux fichiers, aucune automatisation.",
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
      type: 'info',
      title: 'Niveau 2 : Skill',
      body: "Un skill est un modèle de prompt réutilisable que tu définis une fois et que tu invoques par son nom. Dans Claude Code, tu crées un /skill qui encapsule des instructions, du contexte et des contraintes. Au lieu de retaper « révise ce composant pour les problèmes d'accessibilité et suggère des attributs ARIA » à chaque fois, tu lances /a11y-review. Le prompt est le même, la cible change. Utilise les skills quand tu te surprends à coller le même type de question plus de deux fois.",
    },
    {
      type: 'code-demo',
      title: 'Exemple : un skill de révision',
      body: 'Tu définis un skill une fois dans la config de ton projet. Ensuite tu l\'invoques sur n\'importe quel fichier.',
      language: 'markdown',
      filename: '.claude/commands/a11y-review.md',
      code: '# Accessibility Review\n\nReview the given component for:\n- Missing ARIA attributes\n- Keyboard navigation issues\n- Color contrast problems\n- Screen reader compatibility\n\nOutput a numbered list of issues with fixes.',
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
      type: 'info',
      title: 'Niveau 3 : Script',
      body: "Un script appelle l'API de l'IA de façon programmatique. Aucun humain dans la boucle — ça tourne sur un horaire, un hook git ou dans le CI. Exemple : un script Node qui lit ton git diff, l'envoie à Claude, et poste un résumé de revue de code sur Slack. La différence clé avec un skill : les scripts tournent sans toi. Ils sont entièrement automatisés. Utilise ce niveau quand la tâche est prévisible, répétitive et ne nécessite pas de jugement.",
    },
    {
      type: 'code-demo',
      title: 'Un script qui révise les PR automatiquement',
      body: 'Ce script tourne dans le CI. Il lit le diff, l\'envoie à Claude et affiche la révision. Aucun humain nécessaire.',
      language: 'typescript',
      filename: 'scripts/review-diff.ts',
      code: "import Anthropic from '@anthropic-ai/sdk'\n\nconst client = new Anthropic()\nconst diff = await $`git diff main...HEAD`\n\nconst review = await client.messages.create({\n  model: 'claude-sonnet-4-20250514',\n  max_tokens: 1024,\n  messages: [{\n    role: 'user',\n    content: `Review this diff:\\n${diff}`\n  }]\n})\n\nconsole.log(review.content[0].text)",
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
      type: 'info',
      title: 'Niveau 4 : Agent',
      body: "Un agent est une IA qui agit de façon autonome dans ta codebase. Claude Code en mode agent peut lire tes fichiers, comprendre la structure de ton projet, écrire du code dans plusieurs fichiers, lancer des tests et corriger des erreurs — le tout à partir d'une seule instruction de haut niveau. Tu dis « ajoute le support du mode sombre à la page de paramètres » et il lit le code existant, identifie le système de thème, modifie les composants, met à jour les styles et vérifie que le build passe. Utilise le mode agent pour les tâches complexes, multi-étapes, où l'IA a besoin du contexte de ta codebase réelle.",
    },
    {
      type: 'terminal',
      instruction: 'Lance Claude Code en mode agent (le mode par défaut quand tu le démarres) :',
      expectedCommand: 'claude',
      hint: 'Tape simplement le nom de la commande pour démarrer Claude Code',
    },
    {
      type: 'code-demo',
      title: 'Exemple de prompt de niveau agent',
      body: 'Une seule instruction qui prendrait plusieurs interactions de niveau coller :',
      language: 'text',
      code: "Add a /health endpoint to the API that returns:\n- server uptime\n- database connection status\n- current memory usage\n\nInclude tests. Use the existing error handling pattern\nfrom the other routes.",
    },

    // === LEVEL 5: MCP ===
    {
      type: 'info',
      title: 'Niveau 5 : MCP (Model Context Protocol)',
      body: "MCP, c'est le mode agent plus l'accès aux outils externes. L'agent ne fait pas que lire et écrire des fichiers — il se connecte à des bases de données, des API, des navigateurs et des services via un protocole standardisé. Un agent équipé MCP peut interroger ta base de données de production, vérifier le statut de ton déploiement Vercel, lire les issues GitHub et parcourir la documentation — le tout dans une seule conversation. C'est le plafond : action autonome avec connectivité au monde réel.",
    },
    {
      type: 'code-demo',
      title: 'Configuration du serveur MCP',
      body: 'Tu dis à Claude Code quels outils connecter. Chaque serveur MCP expose des capacités que l\'agent peut utiliser.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"]\n    },\n    "browser": {\n      "command": "npx",\n      "args": ["-y", "@anthropic/mcp-browser"]\n    }\n  }\n}',
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
      type: 'diagram',
      title: 'Quand escalader',
      body: 'Utilise cet arbre de décision pour choisir le bon niveau pour n\'importe quelle tâche.',
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
    },

    // === CLASSIFY TASKS ===
    {
      type: 'info',
      title: 'Classer des tâches réelles',
      body: "Maintenant, pratiquons. Pour chacune des tâches suivantes, identifie à quel niveau de l'échelle des outils elle appartient. Réfléchis : est-ce ponctuel ou répétitif ? Faut-il un accès aux fichiers ? Faut-il des outils externes ? Faut-il un jugement humain sur le résultat ?",
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
      type: 'info',
      title: 'L\'instinct d\'escalade',
      body: "La compétence la plus précieuse de tout ce cours est l'instinct d'escalade : la capacité de reconnaître, en pleine tâche, que tu es au mauvais niveau. Si tu as collé le même type de question trois fois, crée un skill. Si tu lances un skill manuellement chaque jour, écris un script. Si le script a besoin de lire ta codebase et de prendre des décisions, passe à un agent. Si l'agent a besoin de données externes, ajoute des serveurs MCP. Ne reste jamais sur un barreau plus longtemps que nécessaire.",
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
