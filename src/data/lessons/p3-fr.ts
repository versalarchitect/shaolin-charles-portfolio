import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p3',
  steps: [
    // === INTRO ===
    {
      type: 'multiple-choice',
      question: 'Claude Code est un assistant IA qui vit dans votre terminal. Où opère-t-il?',
      options: [
        'Dans un navigateur web comme un chatbot normal',
        'Directement dans votre projet — lisant des fichiers, écrivant du code et exécutant des commandes',
        'Seulement dans le cloud, sans accès à vos fichiers locaux',
        'Dans une application mobile sur votre téléphone',
      ],
      correctIndex: 1,
      explanation: 'Claude Code est un agent CLI qui lit votre codebase, exécute des commandes, modifie des fichiers et raisonne sur l\'architecture — tout depuis votre terminal. Dans cette leçon, vous allez l\'installer, le connecter à des outils externes via MCP, configurer des skills et des hooks, et compléter votre première tâche dirigée par l\'agent.',
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
      type: 'order',
      instruction: 'Mettez les étapes d\'installation de Claude Code dans le bon ordre :',
      items: [
        'Exécuter npm install -g @anthropic-ai/claude-code',
        'Taper claude dans le terminal',
        'S\'authentifier via la fenêtre de navigateur qui s\'ouvre',
        'Voir l\'écran de bienvenue de Claude Code dans le terminal',
      ],
      correctOrder: [0, 1, 2, 3],
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
      type: 'compare',
      title: 'Avant MCP vs Après MCP',
      body: 'MCP est comme un port USB — un standard universel qui permet à Claude Code de se brancher à n\'importe quel service.',
      question: 'Quelle approche est plus facile à maintenir quand on ajoute des outils?',
      correctSide: 'right',
      left: {
        label: 'Sans MCP',
        content: 'Chaque outil nécessite sa propre intégration personnalisée\nDifférents formats d\'API pour chaque service\nCasse quand un service met à jour son API\nVous devez construire chaque connecteur vous-même',
        language: 'text',
      },
      right: {
        label: 'Avec MCP',
        content: 'Protocole standard universel pour tous les outils\nUn format cohérent (JSON-RPC)\nServeurs pré-construits pour la plupart des services\nPlug and play — ajoutez juste dans settings.json',
        language: 'text',
      },
      explanation: 'MCP est un standard universel — comme USB a remplacé le fouillis de câbles propriétaires. Un serveur MCP est un petit programme qui donne à Claude Code l\'accès à un outil spécifique. La plupart sont pré-construits et prêts à l\'emploi.',
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
      type: 'code-fill',
      instruction: 'Ajoutez le serveur MCP filesystem à vos paramètres de projet. Ça permet à Claude Code de lire et chercher des fichiers. Remplissez la configuration manquante :',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "{{section}}": {\n    "filesystem": {\n      "command": "{{runner}}",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-{{type}}",\n        "."\n      ]\n    }\n  }\n}',
      blanks: [
        { id: 'section', answer: 'mcpServers', placeholder: 'section de config?', hint: 'La clé qui contient toutes les configurations de serveurs MCP' },
        { id: 'runner', answer: 'npx', placeholder: 'exécuteur?', hint: 'L\'outil Node.js pour exécuter des paquets sans les installer globalement' },
        { id: 'type', answer: 'filesystem', placeholder: 'type de serveur?', hint: 'Ce serveur fournit l\'accès au système de fichiers' },
      ],
      explanation: 'La section mcpServers mappe les noms de serveurs à leurs configurations. npx exécute le paquet sans installation globale. Le paquet server-filesystem donne à Claude Code des capacités améliorées de lecture et recherche de fichiers.',
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
      type: 'code-fill',
      instruction: 'Les skills sont des prompts réutilisables invoqués avec une commande slash. Complétez ce fichier de skill qui définit comment Claude Code devrait créer des composants React :',
      language: 'markdown',
      filename: '.claude/skills/component.md',
      template: '# Component Generator\n\nWhen asked to create a React component:\n\n1. Use {{lang}} with explicit prop interfaces\n2. Export as {{exportType}}\n3. Use {{css}} for styling\n4. Add JSDoc comments for props\n5. Place in src/{{dir}}/',
      blanks: [
        { id: 'lang', answer: 'TypeScript', alternatives: ['typescript', 'TS', 'ts'], placeholder: 'quel langage?', hint: 'JavaScript avec la sécurité des types' },
        { id: 'exportType', answer: 'default', placeholder: 'type d\'export?', hint: 'Le style d\'export standard pour les composants de page' },
        { id: 'css', answer: 'Tailwind', alternatives: ['tailwind', 'TailwindCSS', 'tailwindcss'], placeholder: 'framework CSS?', hint: 'Framework CSS utility-first' },
        { id: 'dir', answer: 'components', placeholder: 'répertoire?', hint: 'Où vivent les composants React dans le projet' },
      ],
      explanation: 'Les skills encodent les conventions de votre équipe comme des prompts réutilisables. Ce skill dit à Claude Code de toujours utiliser TypeScript, les exports par défaut, Tailwind CSS, et de placer les composants dans src/components/.',
    },
    {
      type: 'code-fill',
      instruction: 'Les hooks sont des actions automatisées qui s\'exécutent sans que vous le demandiez. Complétez ce hook qui lint automatiquement les fichiers après que Claude Code les modifie :',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "hooks": {\n    "{{trigger}}": [\n      {\n        "command": "npx {{linter}} --fix ${file}",\n        "description": "Auto-lint after edit"\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'trigger', answer: 'afterEdit', alternatives: ['after_edit'], placeholder: 'quand exécuter?', hint: 'Ce hook s\'exécute après la modification d\'un fichier' },
        { id: 'linter', answer: 'eslint', placeholder: 'quel linter?', hint: 'Le linter JavaScript/TypeScript le plus populaire' },
      ],
      explanation: 'Le hook afterEdit s\'exécute chaque fois que Claude Code modifie un fichier. ESLint avec le flag --fix corrige automatiquement le formatage et les problèmes de style. La variable ${file} est remplacée par le chemin du fichier modifié.',
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
      type: 'interactive-diagram',
      title: 'Votre stack d\'outils IA',
      body: 'Tout ce que vous venez de configurer, fonctionnant ensemble. Parcourez les étapes pour voir comment chaque pièce se connecte.',
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
      stages: [
        { highlightNodes: ['cc'], explanation: 'Claude Code est le centre. Il reçoit vos instructions en langage naturel et orchestre tout le reste.' },
        { highlightNodes: ['cc', 'skills'], highlightEdges: [{ from: 'cc', to: 'skills' }], explanation: 'Les skills sont des instructions réutilisables invoquées avec des commandes slash. Ils enseignent à Claude Code les patterns et conventions de votre projet.' },
        { highlightNodes: ['cc', 'hooks'], highlightEdges: [{ from: 'cc', to: 'hooks' }], explanation: 'Les hooks se déclenchent automatiquement à des moments précis — comme le linting après chaque modification. Aucune action manuelle nécessaire.' },
        { highlightNodes: ['cc', 'mcp', 'tools'], highlightEdges: [{ from: 'cc', to: 'mcp' }, { from: 'mcp', to: 'tools' }], explanation: 'Les serveurs MCP connectent Claude Code aux outils externes — bases de données, APIs, plateformes de déploiement. C\'est comme ça qu\'il interagit avec le monde au-delà de vos fichiers de projet.' },
      ],
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
      type: 'match',
      instruction: 'Associez chaque configuration que vous venez de compléter à son emplacement de fichier :',
      leftItems: ['Configuration du serveur MCP', 'Skill de génération de composants', 'Hook d\'auto-lint', 'Instructions du projet'],
      rightItems: ['.claude/settings.json (section mcpServers)', '.claude/skills/component.md', '.claude/settings.json (section hooks)', 'CLAUDE.md à la racine du projet'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Chaque configuration vit dans un emplacement spécifique. Les serveurs MCP et les hooks vont dans .claude/settings.json. Les skills sont des fichiers markdown dans .claude/skills/. Les instructions au niveau du projet vont dans CLAUDE.md à la racine du projet.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Outils IA configurés! Vous avez un environnement de développement dirigé par agent fonctionnel.',
    },
  ],
}

export default content
