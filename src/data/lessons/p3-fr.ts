import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p3',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Votre copilote IA vit dans le terminal',
      body: "Claude Code est un agent CLI qui lit votre codebase, exécute des commandes, modifie des fichiers et raisonne sur l'architecture — tout depuis votre terminal. Dans cette leçon, vous allez l'installer, le connecter à des outils externes via MCP, configurer des skills et des hooks, et compléter votre première tâche dirigée par l'agent.",
    },
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce qui différencie Claude Code d\'un chatbot?',
      options: [
        'Il a une plus belle interface',
        'Il peut lire, modifier et exécuter du code directement dans votre projet',
        'Il fonctionne seulement avec Python',
        'Il nécessite une extension de navigateur',
      ],
      correctIndex: 1,
      explanation: 'Claude Code est un outil agentique — il opère à l\'intérieur de votre codebase, lit des fichiers, écrit du code et exécute des commandes dans le terminal. Un chatbot prend juste du texte en entrée et donne du texte en sortie.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Mentalité d\'agent débloquée!',
    },

    // === INSTALL & AUTH ===
    {
      type: 'terminal',
      instruction: 'Installez Claude Code globalement via npm :',
      expectedCommand: 'npm install -g @anthropic-ai/claude-code',
      hint: 'npm install -g @anthropic-ai/claude-code',
    },
    {
      type: 'terminal',
      instruction: 'Lancez Claude Code pour démarrer le processus d\'authentification (ça ouvre une fenêtre de navigateur pour OAuth) :',
      expectedCommand: 'claude',
      hint: 'Tapez juste "claude" — il vous guide à travers l\'authentification.',
    },
    {
      type: 'checklist',
      title: 'Vérification de l\'installation :',
      items: [
        'Exécuté npm install -g @anthropic-ai/claude-code',
        'Lancé claude dans le terminal',
        'Complété le processus d\'authentification dans le navigateur',
        'Vu le message de bienvenue de Claude Code',
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Claude Code installé et authentifié!',
    },

    // === MCP ARCHITECTURE ===
    {
      type: 'interactive-diagram',
      title: 'Architecture MCP',
      body: 'Le Model Context Protocol permet à Claude Code de se connecter à des outils et sources de données externes via une interface standard. Parcourez chaque étape pour voir comment une requête circule.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'Claude Code', shape: 'rounded', highlight: true },
          { id: 'mcp', label: 'Protocole MCP', shape: 'diamond' },
          { id: 'server', label: 'Serveur MCP', shape: 'rounded' },
          { id: 'tool', label: 'Outil', shape: 'pill', highlight: true },
          { id: 'resource', label: 'Ressource', shape: 'pill' },
        ],
        edges: [
          { from: 'claude', to: 'mcp', label: 'JSON-RPC' },
          { from: 'mcp', to: 'server' },
          { from: 'server', to: 'tool', label: 'exécuter' },
          { from: 'server', to: 'resource', label: 'lire' },
        ],
      },
      stages: [
        { highlightNodes: ['claude'], explanation: 'Vous demandez à Claude Code de faire quelque chose — comme interroger une base de données ou vérifier un déploiement. Claude Code décide quel outil utiliser.' },
        { highlightNodes: ['claude', 'mcp'], highlightEdges: [{ from: 'claude', to: 'mcp' }], explanation: 'Claude Code envoie la requête via le protocole MCP en utilisant JSON-RPC — un format de message standard. C\'est l\'adaptateur universel.' },
        { highlightNodes: ['mcp', 'server'], highlightEdges: [{ from: 'mcp', to: 'server' }], explanation: 'Le serveur MCP reçoit la requête. Chaque serveur est un petit programme qui sait comment communiquer avec un service spécifique.' },
        { highlightNodes: ['server', 'tool'], highlightEdges: [{ from: 'server', to: 'tool' }], explanation: 'Le serveur exécute l\'outil — lancer une requête de base de données, appeler une API, ou effectuer une action. Le résultat revient à Claude Code.' },
        { highlightNodes: ['server', 'resource'], highlightEdges: [{ from: 'server', to: 'resource' }], explanation: 'Le serveur peut aussi lire des ressources — récupérer des données comme le statut de déploiement, le contenu de fichiers, ou la configuration. Les ressources sont en lecture seule.' },
      ],
    },
    {
      type: 'info',
      title: 'Comprendre MCP',
      body: "MCP (Model Context Protocol) est un standard ouvert qui permet aux agents IA de communiquer avec des outils externes — bases de données, APIs, navigateurs, systèmes de fichiers, n'importe quoi. Un serveur MCP est un petit programme qui expose des outils et des ressources via un protocole standard. Claude Code se connecte à ces serveurs et obtient de nouvelles capacités sans aucun code personnalisé.",
    },
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce qu\'un serveur MCP fournit à Claude Code?',
      options: [
        'Une connexion internet plus rapide',
        'Des outils qu\'il peut exécuter et des ressources qu\'il peut lire',
        'Une interface graphique',
        'Du stockage dans le cloud pour vos fichiers',
      ],
      correctIndex: 1,
      explanation: 'Les serveurs MCP exposent des outils (actions que l\'agent peut prendre) et des ressources (données qu\'il peut lire). C\'est comme ça que Claude Code obtient des capacités au-delà de ses fonctionnalités intégrées.',
    },

    // === CONFIGURE MCP SERVER ===
    {
      type: 'code-demo',
      title: 'Configurer un serveur MCP',
      body: "Ajoutez le serveur MCP filesystem à vos paramètres de projet. Ça permet à Claude Code de lire et chercher des fichiers avec des capacités améliorées.",
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "."\n      ]\n    }\n  }\n}',
    },
    {
      type: 'code-input',
      instruction: 'Dans la config MCP, quelle clé contient l\'objet qui associe les noms de serveurs à leurs configurations?',
      placeholder: '"________": { "filesystem": { ... } }',
      answer: 'mcpServers',
      hint: 'Regardez la clé de premier niveau dans le JSON des paramètres.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'MCP maîtrisé — premier serveur configuré!',
    },

    // === SKILLS & HOOKS ===
    {
      type: 'code-demo',
      title: 'Créer un skill',
      body: "Les skills sont des prompts réutilisables invoqués avec une commande slash. Ils enseignent à Claude Code les patterns de votre projet. Créez .claude/skills/component.md :",
      language: 'markdown',
      filename: '.claude/skills/component.md',
      code: '# Component Generator\n\nWhen asked to create a React component:\n\n1. Use TypeScript with explicit prop interfaces\n2. Export as default\n3. Use Tailwind for styling\n4. Add JSDoc comments for props\n5. Place in src/components/',
    },
    {
      type: 'code-demo',
      title: 'Configurer un hook',
      body: "Les hooks sont des actions automatisées qui s'exécutent à des moments précis du cycle de vie — avant une commande, après une modification de fichier, ou au démarrage d'une conversation. Ajoutez ceci à votre settings.json :",
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "hooks": {\n    "afterEdit": [\n      {\n        "command": "npx eslint --fix ${file}",\n        "description": "Auto-lint after edit"\n      }\n    ]\n  }\n}',
    },
    {
      type: 'multiple-choice',
      question: 'Quel est le but d\'un skill Claude Code?',
      options: [
        'Pour remplacer vos scripts package.json',
        'Pour enseigner à Claude des patterns réutilisables, spécifiques au projet',
        'Pour chiffrer votre code source',
        'Pour déployer votre application',
      ],
      correctIndex: 1,
      explanation: "Les skills encodent les conventions de votre équipe sous forme de prompts réutilisables. Au lieu d'expliquer vos patterns à chaque fois, définissez-les une seule fois et invoquez-les avec une commande slash.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Skills et hooks configurés!',
    },
    {
      type: 'match',
      instruction: 'Associez chaque capacité de Claude Code à ce qu\'elle fait :',
      leftItems: ['Outil Read', 'Outil Edit', 'Outil Bash', 'Outil Agent', 'Serveurs MCP'],
      rightItems: ['Voir le contenu des fichiers sans les modifier', 'Faire des changements précis aux fichiers existants', 'Exécuter des commandes shell et des scripts', 'Déléguer des tâches complexes à des sous-agents', 'Se connecter à des outils et APIs externes'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Claude Code utilise différents outils pour différentes tâches. Read affiche les fichiers, Edit les modifie, Bash exécute des commandes, Agent délègue du travail, et les serveurs MCP étendent les capacités aux systèmes externes.',
    },

    // === YOUR AI TOOLING STACK ===
    {
      type: 'diagram',
      title: 'Votre stack d\'outils IA',
      body: 'Tout ce que vous venez de configurer, fonctionnant ensemble.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'cc', label: 'Claude Code', shape: 'rounded', highlight: true },
          { id: 'skills', label: 'Skills' },
          { id: 'hooks', label: 'Hooks' },
          { id: 'mcp', label: 'Serveurs MCP' },
          { id: 'tools', label: 'Outils externes', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'cc', to: 'skills', label: 'invoquer' },
          { from: 'cc', to: 'hooks', label: 'déclencher' },
          { from: 'cc', to: 'mcp', label: 'connecter' },
          { from: 'mcp', to: 'tools' },
        ],
      },
    },

    // === FIRST AGENT TASK ===
    {
      type: 'terminal',
      instruction: 'Demandez à Claude Code de créer un composant hello world dans votre projet :',
      expectedCommand: 'claude "Create a HelloWorld React component in src/components that renders a centered heading"',
      hint: 'claude "Create a HelloWorld React component..."',
    },
    {
      type: 'order',
      instruction: 'Mettez le workflow dirigé par l\'agent dans le bon ordre :',
      items: [
        'Vous décrivez l\'intention en langage naturel',
        'Claude Code lit le contexte de votre projet',
        'L\'agent planifie l\'implémentation',
        'Les fichiers sont créés ou modifiés',
        'Vous révisez et approuvez les changements',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'checklist',
      title: 'Vérification finale :',
      items: [
        'Claude Code installé et authentifié',
        'Comprendre l\'architecture MCP (serveurs, outils, ressources)',
        'Configuré un serveur MCP dans les paramètres',
        'Créé un fichier de skill',
        'Configuré un hook',
        'Complété une vraie tâche dirigée par l\'agent',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Outils IA configurés! Vous avez un environnement de développement dirigé par agent fonctionnel.',
    },
  ],
}

export default content
