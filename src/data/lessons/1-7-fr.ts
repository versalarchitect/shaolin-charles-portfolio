import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'La pièce manquante : les outils externes',
      body: "Ton agent peut lire des fichiers, écrire du code et exécuter des commandes. Mais que se passe-t-il s'il doit interroger une base de données ? Vérifier le statut d'un déploiement ? Parcourir de la documentation ? Sans configuration supplémentaire, les agents sont prisonniers de ton système de fichiers. MCP — Model Context Protocol — est le standard qui les libère. Il donne à ton agent un moyen structuré d'appeler des outils externes : bases de données, API, navigateurs, tout ce que tu peux envelopper dans un serveur.",
    },
    {
      type: 'info',
      title: 'C\'est quoi MCP ?',
      body: "MCP est un protocole ouvert créé par Anthropic qui standardise la façon dont les agents IA communiquent avec les outils externes. Pense à ça comme l'USB pour l'IA : avant l'USB, chaque appareil avait besoin de son propre connecteur propriétaire. Avant MCP, chaque intégration d'outil était un bricolage maison. MCP définit une interface universelle — n'importe quel outil qui parle le protocole peut être branché dans n'importe quel agent qui le supporte. Un protocole, des outils infinis.",
    },

    // === ARCHITECTURE DIAGRAM 1 ===
    {
      type: 'interactive-diagram',
      title: 'Flux de requête MCP',
      body: 'Clique sur chaque étape pour suivre une requête de ton agent vers un service externe et retour.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'claude', label: 'Claude Code', sublabel: 'Client MCP', shape: 'rounded', highlight: true },
          { id: 'request', label: 'Requête', sublabel: 'Sortante', shape: 'rect' },
          { id: 'server', label: 'Serveur MCP', sublabel: 'Ton code', shape: 'rect' },
          { id: 'tool', label: 'Appel d\'outil', sublabel: 'Exécuter', shape: 'rect' },
          { id: 'api', label: 'API externe', sublabel: 'Base de données/SaaS', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'claude', to: 'request', label: 'JSON-RPC' },
          { from: 'request', to: 'server' },
          { from: 'server', to: 'tool', label: 'invoquer' },
          { from: 'tool', to: 'api', label: 'HTTP/SDK' },
        ],
      },
      stages: [
        {
          highlightNodes: ['claude'],
          highlightEdges: [],
          explanation: 'Tout commence avec Claude Code. Le modèle décide qu\'il a besoin de données externes — une requête de base de données, un statut de déploiement, un fichier hors du bac à sable — et sélectionne le bon outil MCP.',
        },
        {
          highlightNodes: ['claude', 'request'],
          highlightEdges: [{ from: 'claude', to: 'request' }],
          explanation: 'Claude Code sérialise l\'appel d\'outil en un message JSON-RPC 2.0 — nom de méthode, paramètres et un identifiant de requête unique. C\'est le format de transmission universel pour toute communication MCP.',
        },
        {
          highlightNodes: ['request', 'server'],
          highlightEdges: [{ from: 'request', to: 'server' }],
          explanation: 'Le message JSON-RPC atteint ton processus serveur MCP. Le serveur parse le nom de la méthode, valide les paramètres contre le schéma de l\'outil et route vers le bon handler.',
        },
        {
          highlightNodes: ['server', 'tool'],
          highlightEdges: [{ from: 'server', to: 'tool' }],
          explanation: 'Le serveur invoque le handler de l\'outil — ton code qui fait le vrai travail. C\'est ici que la frontière MCP se termine et que ta logique personnalisée commence.',
        },
        {
          highlightNodes: ['tool', 'api'],
          highlightEdges: [{ from: 'tool', to: 'api' }],
          explanation: 'Le handler de l\'outil contacte le service externe — un appel HTTP vers une API REST, une méthode SDK pour interroger une base de données, une lecture de fichier. Le résultat remonte par la même chaîne jusqu\'à Claude Code.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Architecture du protocole cartographiée !',
    },

    // === CORE CONCEPTS ===
    {
      type: 'info',
      title: 'Les trois couches',
      body: "Chaque interaction MCP a trois couches. Le Client est ton agent IA (Claude Code). Il décide quand utiliser un outil et envoie la requête. Le Protocole est JSON-RPC 2.0 — un format de message léger qui enveloppe les noms de méthodes et les paramètres. Le Serveur est ton code qui reçoit la requête, fait le vrai travail (interroger une base de données, appeler une API, lire un système de fichiers) et retourne le résultat. Le client ne touche jamais le service externe directement. Le serveur est la frontière.",
    },
    {
      type: 'multiple-choice',
      question: 'Dans l\'architecture MCP, quel format de transmission transporte les messages entre client et serveur ?',
      options: [
        'GraphQL',
        'REST avec des corps JSON',
        'JSON-RPC 2.0',
        'Protocol Buffers',
      ],
      correctIndex: 2,
      explanation: 'MCP utilise JSON-RPC 2.0 comme protocole de transmission. C\'est léger, indépendant du langage et conçu pour la communication requête-réponse — idéal pour les appels d\'outils.',
    },

    // === SERVER TYPES DIAGRAM 2 ===
    {
      type: 'diagram',
      title: 'Types de serveurs MCP',
      body: 'Un seul protocole connecte ton agent à plusieurs catégories d\'outils différentes. Chaque serveur expose une capacité spécialisée.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'protocol', label: 'Protocole MCP', sublabel: 'JSON-RPC 2.0', shape: 'rounded', highlight: true },
          { id: 'fs', label: 'Système de fichiers', sublabel: 'Lire/Écrire', shape: 'rect' },
          { id: 'db', label: 'Base de données', sublabel: 'Requête/Mutation', shape: 'rect' },
          { id: 'api', label: 'API', sublabel: 'Appels HTTP', shape: 'rect' },
          { id: 'agent', label: 'Ton agent', sublabel: 'Claude Code', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'agent', to: 'protocol', label: 'se connecte' },
          { from: 'protocol', to: 'fs' },
          { from: 'protocol', to: 'db' },
          { from: 'protocol', to: 'api' },
        ],
      },
    },
    {
      type: 'info',
      title: 'Catégories courantes de serveurs MCP',
      body: "Les serveurs de système de fichiers permettent à l'agent de lire et écrire des fichiers en dehors de son bac à sable. Les serveurs de base de données exposent des requêtes SQL ou NoSQL — Supabase, Postgres, SQLite. Les serveurs d'API enveloppent des services externes comme GitHub, Vercel, Stripe ou Slack. Les serveurs de navigateur donnent à l'agent un vrai navigateur headless pour le scraping ou les tests. Les serveurs personnalisés sont tout ce que tu construis : outils internes, API propriétaires, contrôleurs matériels. L'écosystème grandit vite parce que construire un serveur est simple.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Paysage des serveurs compris !',
    },

    // === CONFIGURATION ===
    {
      type: 'info',
      title: 'Configurer les serveurs MCP',
      body: "Tu indiques les serveurs MCP à Claude Code via des fichiers de configuration. Il y a deux niveaux : la config au niveau projet dans .claude/settings.json (partagée avec ton équipe via git) et la config au niveau utilisateur dans ~/.claude/settings.json (personnelle, pas committée). Chaque entrée de serveur spécifie la commande pour le lancer, les arguments et des variables d'environnement optionnelles pour les secrets comme les clés API.",
    },
    {
      type: 'code-demo',
      title: 'Config MCP au niveau projet',
      body: 'Cette configuration enregistre deux serveurs MCP. Claude Code les lance comme processus enfants et communique via stdio.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "/Users/you/projects"\n      ]\n    },\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "env": {\n        "SUPABASE_ACCESS_TOKEN": "your-token"\n      }\n    }\n  }\n}',
    },
    {
      type: 'code-input',
      instruction: 'Dans la config MCP, quelle clé contient l\'objet qui mappe les noms de serveurs à leurs configurations ?',
      placeholder: 'Enter the key name',
      answer: 'mcpServers',
      hint: 'Regarde la clé de premier niveau dans la config JSON ci-dessus',
    },

    // === TOOLS VS RESOURCES ===
    {
      type: 'info',
      title: 'Outils vs Ressources',
      body: "Les serveurs MCP exposent deux types de capacités. Les Outils sont des actions — ils font quelque chose : écrire un fichier, exécuter une requête, envoyer un message, créer un déploiement. Ils ont des effets secondaires. Les Ressources sont des données — elles fournissent de l'information : lire un fichier, lister des tables, récupérer une configuration, obtenir le statut actuel. La distinction compte parce que Claude Code les traite différemment. Les outils nécessitent une approbation explicite (ils changent des choses). Les ressources sont en lecture seule et plus sûres à auto-approuver.",
    },
    {
      type: 'multiple-choice',
      question: 'Lequel de ces éléments est un « outil » MCP (action) plutôt qu\'une « ressource » (données) ?',
      options: [
        'Lister toutes les tables d\'une base de données',
        'Lire le contenu d\'un fichier de config',
        'Supprimer une ligne de la table users',
        'Obtenir le statut actuel du déploiement',
      ],
      correctIndex: 2,
      explanation: 'Supprimer une ligne est une action avec effet secondaire — ça change l\'état. Ça en fait un outil. Les autres sont des lectures de données en lecture seule, qui sont des ressources.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Outils vs ressources — clair !',
    },

    // === BUILDING A SERVER ===
    {
      type: 'info',
      title: 'Construire ton propre serveur MCP',
      body: "Le package officiel @modelcontextprotocol/sdk rend ça simple. Tu crées une instance de serveur, tu enregistres des outils avec leurs schémas d'entrée, tu implémentes les fonctions de gestion et tu démarres le serveur sur stdio. Le serveur écoute les requêtes JSON-RPC de Claude Code, exécute l'outil correspondant et retourne le résultat. Un serveur minimal peut faire moins de 40 lignes de code.",
    },
    {
      type: 'code-demo',
      title: 'Serveur MCP minimal : lire un fichier',
      body: 'Un serveur MCP complet qui expose un seul outil — lire un fichier et retourner son contenu. C\'est le serveur le plus simple que tu puisses construire.',
      language: 'typescript',
      filename: 'my-mcp-server.ts',
      code: "import { McpServer } from \"@modelcontextprotocol/sdk/server/mcp.js\";\nimport { StdioServerTransport } from \"@modelcontextprotocol/sdk/server/stdio.js\";\nimport { readFile } from \"fs/promises\";\nimport { z } from \"zod\";\n\nconst server = new McpServer({\n  name: \"file-reader\",\n  version: \"1.0.0\",\n});\n\nserver.tool(\n  \"read_file\",\n  \"Read a file from disk and return its contents\",\n  { path: z.string().describe(\"Absolute file path\") },\n  async ({ path }) => {\n    const text = await readFile(path, \"utf-8\");\n    return {\n      content: [{ type: \"text\", text }],\n    };\n  }\n);\n\nconst transport = new StdioServerTransport();\nawait server.connect(transport);",
    },
    {
      type: 'order',
      instruction: 'Ordonne les étapes pour construire un serveur MCP de la première à la dernière :',
      items: [
        'Enregistrer les outils avec leurs schémas d\'entrée',
        'Créer une instance McpServer',
        'Se connecter à un transport (stdio)',
        'Implémenter les fonctions de gestion',
        'Installer @modelcontextprotocol/sdk',
      ],
      correctOrder: [4, 1, 0, 3, 2],
    },

    // === REGISTERING YOUR SERVER ===
    {
      type: 'code-demo',
      title: 'Enregistrer ton serveur personnalisé',
      body: 'Pointe Claude Code vers ton serveur en l\'ajoutant à ta config MCP. La commande exécute ton script serveur directement avec Node ou tsx.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "file-reader": {\n      "command": "npx",\n      "args": ["tsx", "my-mcp-server.ts"]\n    }\n  }\n}',
    },
    {
      type: 'terminal',
      instruction: 'Installe le package SDK MCP pour commencer à construire ton propre serveur :',
      expectedCommand: 'npm install @modelcontextprotocol/sdk',
      hint: 'Utilise npm install suivi du nom du package',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu sais construire des serveurs MCP !',
    },

    // === DEBUGGING ===
    {
      type: 'info',
      title: 'Déboguer les connexions MCP',
      body: "Les connexions MCP échouent silencieusement plus souvent que bruyamment. Les problèmes les plus courants : le binaire du serveur est introuvable (mauvais chemin ou package npx manquant), les variables d'environnement sont manquantes (clé API non définie), les conflits de port (un autre processus sur le même port), et les timeouts (le serveur met trop de temps à démarrer). Quand un outil MCP n'apparaît pas dans Claude Code, ça signifie presque toujours que le serveur n'a pas réussi à se lancer — pas que l'outil est mal configuré.",
    },
    {
      type: 'code-demo',
      title: 'Check-list de débogage dans Claude Code',
      body: 'Utilise la commande /mcp dans Claude Code pour vérifier le statut des serveurs. Elle montre quels serveurs sont connectés, lesquels ont échoué et quels outils sont disponibles.',
      language: 'text',
      filename: 'debug-commands.txt',
      code: "# Inside Claude Code, check MCP status:\n/mcp\n\n# Common output when a server fails:\n# ✗ my-server — failed to start\n#   Error: Cannot find module '@modelcontextprotocol/sdk'\n\n# Fix: ensure the package is installed or use npx -y\n# Fix: check that env vars are set correctly\n# Fix: verify the command path is correct",
    },
    {
      type: 'multiple-choice',
      question: 'Un outil de serveur MCP n\'apparaît pas dans Claude Code. Quelle est la cause la plus probable ?',
      options: [
        'L\'outil a un bug dans sa fonction de gestion',
        'Le serveur n\'a pas réussi à démarrer (binaire introuvable, dépendance manquante)',
        'Claude Code ne supporte pas ce type d\'outil',
        'Le nom de l\'outil a des caractères invalides',
      ],
      correctIndex: 1,
      explanation: 'Quand un outil n\'apparaît pas du tout, le serveur n\'a presque certainement pas réussi à se lancer. Un bug dans le handler permettrait quand même à l\'outil d\'apparaître — il donnerait juste une erreur quand on l\'appelle. Vérifie d\'abord le chemin de ta commande, les dépendances et les variables d\'environnement.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Instincts de débogage aiguisés !',
    },

    // === REAL-WORLD PRACTICE ===
    {
      type: 'info',
      title: 'L\'écosystème MCP dans le monde réel',
      body: "L'écosystème MCP comprend déjà des dizaines de serveurs prêts pour la production. Supabase expose des requêtes de base de données et la gestion de schémas. Vercel fournit le statut de déploiement et l'inspection des logs. GitHub permet à l'agent de lire les issues, les PR et l'historique des commits. Puppeteer et Playwright donnent l'automatisation du navigateur. Stripe expose les opérations de paiement. Chaque serveur est un processus autonome que Claude Code gère comme un processus enfant — lancer, communiquer, arrêter.",
    },
    {
      type: 'code-demo',
      title: 'Config multi-serveurs',
      body: 'Un vrai projet pourrait connecter trois ou quatre serveurs. Chacun ajoute une catégorie de capacités à ton agent.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "mcpServers": {\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "env": {\n        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_TOKEN}"\n      }\n    },\n    "github": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-github"],\n      "env": {\n        "GITHUB_TOKEN": "${GH_TOKEN}"\n      }\n    },\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "/home/user/docs"\n      ]\n    }\n  }\n}',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi les configs de serveurs MCP utilisent-elles des variables d\'environnement comme "${SUPABASE_TOKEN}" au lieu de coder en dur les secrets ?',
      options: [
        'Les valeurs codées en dur sont plus lentes à parser',
        'Les variables d\'environnement empêchent les secrets d\'être committés dans le contrôle de version',
        'MCP ne supporte que l\'authentification par variables d\'environnement',
        'Ça rend le fichier JSON plus petit',
      ],
      correctIndex: 1,
      explanation: 'Les fichiers de configuration sont souvent committés dans git. Mettre les secrets directement dans la config signifie pousser des clés API vers un repo public ou partagé. Les variables d\'environnement gardent les secrets hors du contrôle de version et laissent chaque développeur utiliser ses propres identifiants.',
    },

    // === SECURITY ===
    {
      type: 'info',
      title: 'Frontières de sécurité',
      body: "Chaque serveur MCP tourne comme un processus enfant avec les mêmes permissions que ton compte utilisateur. Si tu donnes à un serveur MCP tes identifiants de base de données, l'agent peut exécuter n'importe quelle requête que le serveur autorise. C'est puissant mais demande de la prudence. Utilise des tokens en lecture seule quand c'est possible. Limite les clés API aux permissions minimales requises. Vérifie quels outils un serveur expose avant de le connecter. Claude Code montre des invites d'approbation pour les actions avec effets secondaires, mais le serveur lui-même est la vraie frontière de confiance.",
    },

    // === MATCH EXERCISE ===
    {
      type: 'match',
      instruction: 'Associez chaque concept MCP à son rôle :',
      leftItems: [
        'MCP Client',
        'MCP Server',
        'Tool',
        'Resource',
        'Transport',
      ],
      rightItems: [
        'L\'agent IA qui envoie les requêtes',
        'Un programme qui expose des capacités',
        'Une action que l\'IA peut exécuter',
        'Des données que l\'IA peut lire',
        'Le canal de communication (stdio, HTTP)',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'MCP sépare les responsabilités : le client (IA) envoie des requêtes, le serveur expose des capacités, les outils effectuent des actions, les ressources fournissent des données, et le transport transmet les messages entre eux.',
    },

    // === FINAL EXERCISES ===
    {
      type: 'code-input',
      instruction: 'Quelle commande dans Claude Code montre le statut de tous les serveurs MCP connectés ?',
      placeholder: '/___',
      answer: '/mcp',
      hint: 'Une commande slash de trois lettres qui signifie Model Context Protocol',
    },
    {
      type: 'order',
      instruction: 'Ordonne le cycle de vie d\'une requête MCP du début à la fin :',
      items: [
        'Le serveur exécute le handler de l\'outil',
        'Claude Code envoie une requête JSON-RPC',
        'Le résultat est retourné au modèle',
        'Le modèle décide d\'utiliser un outil',
        'Le serveur retourne une réponse JSON-RPC',
      ],
      correctOrder: [3, 1, 0, 4, 2],
    },
    {
      type: 'checklist',
      title: 'Check-list de maîtrise MCP :',
      items: [
        'Je comprends l\'architecture Client-Protocole-Serveur',
        'Je peux configurer des serveurs MCP dans settings.json',
        'Je connais la différence entre outils (actions) et ressources (données)',
        'Je peux construire un serveur MCP minimal avec le SDK',
        'Je sais déboguer les connexions MCP échouées',
        'Je limite les clés API aux permissions minimales pour la sécurité',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Plongée MCP terminée ! Tes agents atteignent maintenant au-delà du système de fichiers.',
    },
  ],
}

export default content
