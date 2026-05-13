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
      type: 'multiple-choice',
      question: 'Dans MCP, quelle couche est la frontière que le client IA ne franchit jamais ?',
      options: [
        'Le Client — il limite les outils que l\'IA peut voir',
        'Le Protocole — JSON-RPC bloque les requêtes non autorisées',
        'Le Serveur — l\'IA ne touche jamais les services externes directement',
        'Le Transport — stdio empêche l\'accès direct aux API',
      ],
      correctIndex: 2,
      explanation: 'Chaque interaction MCP a trois couches. Le Client (Claude Code) décide quand utiliser un outil. Le Protocole (JSON-RPC 2.0) transporte le message. Le Serveur reçoit la requête, fait le vrai travail et retourne le résultat. Le client ne touche jamais le service externe directement — le serveur est la frontière de confiance.',
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
      type: 'interactive-diagram',
      title: 'Types de serveurs MCP',
      body: 'Clique sur chaque étape pour découvrir les types de serveurs auxquels ton agent peut se connecter.',
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
      stages: [
        {
          highlightNodes: ['agent', 'protocol'],
          highlightEdges: [{ from: 'agent', to: 'protocol' }],
          explanation: 'Un seul protocole connecte ton agent à plusieurs catégories d\'outils. Le protocole MCP est le connecteur universel — comme l\'USB pour les outils IA.',
        },
        {
          highlightNodes: ['protocol', 'fs'],
          highlightEdges: [{ from: 'protocol', to: 'fs' }],
          explanation: 'Les serveurs de système de fichiers permettent à l\'agent de lire et écrire des fichiers en dehors de son bac à sable. Ça étend l\'agent au-delà du répertoire du projet.',
        },
        {
          highlightNodes: ['protocol', 'db'],
          highlightEdges: [{ from: 'protocol', to: 'db' }],
          explanation: 'Les serveurs de base de données exposent des requêtes SQL ou NoSQL — Supabase, Postgres, SQLite. L\'agent peut interroger des données, inspecter des schémas et même lancer des migrations.',
        },
        {
          highlightNodes: ['protocol', 'api'],
          highlightEdges: [{ from: 'protocol', to: 'api' }],
          explanation: 'Les serveurs d\'API enveloppent des services externes comme GitHub, Vercel, Stripe ou Slack. Les serveurs de navigateur donnent l\'automatisation headless. Les serveurs personnalisés sont tout ce que tu construis. L\'écosystème grandit vite parce que construire un serveur est simple.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Paysage des serveurs compris !',
    },

    // === CONFIGURATION ===
    {
      type: 'multiple-choice',
      question: 'Les configs de serveurs MCP peuvent vivre à deux niveaux. Lequel est partagé avec ton équipe via git ?',
      options: [
        '~/.claude/settings.json (niveau utilisateur)',
        '.claude/settings.json (niveau projet)',
        'package.json (dépendances)',
        'CLAUDE.md (instructions)',
      ],
      correctIndex: 1,
      explanation: 'La config au niveau projet dans .claude/settings.json est committée dans git et partagée avec l\'équipe. La config au niveau utilisateur dans ~/.claude/settings.json est personnelle et pas committée. Chaque entrée de serveur spécifie la commande, les arguments et des variables d\'environnement optionnelles pour les secrets.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette configuration MCP pour enregistrer un serveur Supabase que Claude Code lance comme processus enfant :',
      language: 'json',
      template: '{\n  "{{config_key}}": {\n    "supabase": {\n      "{{launch_key}}": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "{{secrets_key}}": {\n        "SUPABASE_ACCESS_TOKEN": "your-token"\n      }\n    }\n  }\n}',
      blanks: [
        { id: 'config_key', answer: 'mcpServers', alternatives: ['mcpservers'], placeholder: 'clé de premier niveau ?', hint: 'La clé JSON qui contient toutes les configurations de serveurs MCP' },
        { id: 'launch_key', answer: 'command', placeholder: 'comment démarrer ?', hint: 'La clé qui dit à Claude Code quel exécutable lancer' },
        { id: 'secrets_key', answer: 'env', alternatives: ['environment'], placeholder: 'clé des secrets ?', hint: 'La clé pour les variables d\'environnement comme les tokens API' },
      ],
      explanation: 'La clé "mcpServers" contient toutes les configs de serveurs. Chaque serveur a besoin d\'une "command" (l\'exécutable), des "args" (arguments), et optionnellement "env" pour les variables d\'environnement secrètes comme les tokens API.',
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
      type: 'compare',
      title: 'Outils vs Ressources',
      body: 'Les serveurs MCP exposent deux types de capacités que Claude Code traite très différemment.',
      question: 'Quel type nécessite une approbation explicite avant exécution ?',
      correctSide: 'left',
      left: {
        label: 'Outils (Actions)',
        content: "// Les outils FONT quelque chose — effets secondaires\n\n- Écrire un fichier sur le disque\n- Exécuter une requête qui modifie des données\n- Envoyer un message Slack\n- Créer un déploiement Vercel\n- Supprimer une ligne d'une table\n\n→ Nécessitent une approbation explicite\n→ Ils changent l'état",
        language: 'text',
      },
      right: {
        label: 'Ressources (Données)',
        content: "// Les ressources FOURNISSENT de l'info — lecture seule\n\n- Lire le contenu d'un fichier\n- Lister les tables de la base de données\n- Récupérer la configuration actuelle\n- Obtenir le statut du déploiement\n- Vérifier la santé du serveur\n\n→ Plus sûres à auto-approuver\n→ Elles lisent uniquement l'état",
        language: 'text',
      },
      explanation: 'Les outils sont des actions avec effets secondaires — ils changent des choses. Claude Code nécessite une approbation explicite pour les outils. Les ressources sont des lectures de données en lecture seule — plus sûres à auto-approuver parce qu\'elles ne peuvent pas modifier l\'état.',
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
      type: 'code-fill',
      instruction: 'Complète ce serveur MCP minimal qui lit un fichier et retourne son contenu. Un serveur peut faire moins de 40 lignes :',
      language: 'typescript',
      filename: 'my-mcp-server.ts',
      template: "import { McpServer } from \"@modelcontextprotocol/sdk/server/mcp.js\";\nimport { {{transport_class}} } from \"@modelcontextprotocol/sdk/server/stdio.js\";\nimport { readFile } from \"fs/promises\";\nimport { z } from \"zod\";\n\nconst server = new McpServer({\n  name: \"file-reader\",\n  version: \"1.0.0\",\n});\n\nserver.{{register_method}}(\n  \"read_file\",\n  \"Read a file from disk and return its contents\",\n  { path: z.string().describe(\"Absolute file path\") },\n  async ({ path }) => {\n    const text = await readFile(path, \"utf-8\");\n    return {\n      content: [{ type: \"text\", text }],\n    };\n  }\n);\n\nconst transport = new {{transport_class}}();\nawait server.{{connect_method}}(transport);",
      blanks: [
        { id: 'transport_class', answer: 'StdioServerTransport', alternatives: ['stdioservertransport'], placeholder: 'classe transport ?', hint: 'Claude Code communique avec les serveurs MCP via stdio — quelle est la classe de transport ?' },
        { id: 'register_method', answer: 'tool', placeholder: 'méthode d\'enregistrement ?', hint: 'La méthode sur McpServer pour enregistrer un nouvel outil' },
        { id: 'connect_method', answer: 'connect', placeholder: 'méthode de démarrage ?', hint: 'La méthode qui démarre le serveur en écoute sur le transport' },
      ],
      explanation: 'Importe StdioServerTransport pour la communication stdio. Utilise server.tool() pour enregistrer des outils avec des schémas et des handlers. Appelle server.connect(transport) pour commencer à écouter les requêtes JSON-RPC de Claude Code.',
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
      type: 'code-fill',
      instruction: 'Enregistre ton serveur MCP personnalisé dans la config. Pointe Claude Code vers ton script serveur :',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "mcpServers": {\n    "{{server_name}}": {\n      "command": "{{package_runner}}",\n      "args": ["tsx", "my-mcp-server.ts"]\n    }\n  }\n}',
      blanks: [
        { id: 'server_name', answer: 'file-reader', alternatives: ['file_reader', 'filereader'], placeholder: 'nom du serveur ?', hint: 'Nomme-le d\'après ce qu\'il fait — il lit des fichiers' },
        { id: 'package_runner', answer: 'npx', alternatives: ['bunx'], placeholder: 'commande d\'exécution ?', hint: 'L\'exécuteur de packages Node.js qui lance tsx sans installation globale' },
      ],
      explanation: 'Le nom de serveur "file-reader" devient la façon dont Claude Code référence ce serveur. "npx" lance l\'exécuteur TypeScript tsx sans l\'installer globalement. Le tableau args passe "tsx" et le chemin de ton script serveur.',
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
      type: 'match',
      instruction: 'Associe chaque symptôme d\'échec MCP à son correctif le plus probable :',
      leftItems: [
        'Binaire du serveur introuvable',
        'L\'outil n\'apparaît pas dans Claude Code',
        'Erreur d\'authentification de l\'API externe',
        'Le serveur met trop de temps à répondre',
      ],
      rightItems: [
        'Vérifier le chemin de la commande et s\'assurer que le package npx est installé',
        'Le serveur n\'a pas réussi à se lancer — vérifier la sortie de /mcp',
        'Les variables d\'environnement sont manquantes ou incorrectes dans la config env',
        'Augmenter le timeout ou vérifier si le serveur a une logique de démarrage bloquante',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Les connexions MCP échouent silencieusement plus souvent que bruyamment. Quand un outil n\'apparaît pas, le serveur n\'a presque certainement pas réussi à se lancer. Utilise /mcp dans Claude Code pour vérifier le statut. Correctifs courants : vérifier les chemins de commandes, les variables d\'env et l\'installation des packages.',
    },
    {
      type: 'code-fill',
      instruction: 'Utilise la commande de débogage dans Claude Code pour vérifier quels serveurs sont connectés :',
      language: 'text',
      template: "# Dans Claude Code, vérifier le statut MCP :\n{{debug_command}}\n\n# Sortie typique quand un serveur échoue :\n# {{fail_symbol}} my-server — failed to start\n#   Error: Cannot find module '@modelcontextprotocol/sdk'\n\n# Fix: s'assurer que le package est installé ou utiliser npx {{auto_flag}}",
      blanks: [
        { id: 'debug_command', answer: '/mcp', placeholder: 'commande slash ?', hint: 'Une commande slash de trois lettres pour Model Context Protocol' },
        { id: 'fail_symbol', answer: '✗', alternatives: ['x', 'X', '✕'], placeholder: 'icône d\'échec ?', hint: 'Le symbole qui indique un serveur en échec (opposé d\'un checkmark)' },
        { id: 'auto_flag', answer: '-y', alternatives: ['--yes'], placeholder: 'flag auto-install ?', hint: 'Le flag npx qui répond automatiquement "oui" aux invites d\'installation' },
      ],
      explanation: 'La commande /mcp montre le statut des serveurs. Les serveurs en échec s\'affichent avec ✗. Utilise npx -y pour auto-installer les packages sans invite. Vérifie toujours /mcp d\'abord quand un outil manque.',
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
      type: 'match',
      instruction: 'Associe chaque serveur MCP à ce qu\'il donne à ton agent :',
      leftItems: [
        'Supabase MCP',
        'GitHub MCP',
        'Puppeteer MCP',
        'Stripe MCP',
      ],
      rightItems: [
        'Requêtes de base de données et gestion de schémas',
        'Issues, PR et historique de commits',
        'Automatisation de navigateur headless pour scraping et tests',
        'Opérations de paiement et données clients',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'L\'écosystème MCP comprend déjà des dizaines de serveurs prêts pour la production. Chacun est un processus autonome que Claude Code gère comme un processus enfant — lancer, communiquer, arrêter. Un vrai projet pourrait connecter trois ou quatre serveurs simultanément.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette config multi-serveurs. Chaque serveur ajoute une catégorie de capacités à ton agent :',
      language: 'json',
      template: '{\n  "mcpServers": {\n    "supabase": {\n      "command": "npx",\n      "args": ["-y", "@supabase/mcp-server"],\n      "env": {\n        "SUPABASE_ACCESS_TOKEN": "{{token_syntax}}"\n      }\n    },\n    "{{vcs_server}}": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-github"],\n      "env": {\n        "{{token_key}}": "${GH_TOKEN}"\n      }\n    }\n  }\n}',
      blanks: [
        { id: 'token_syntax', answer: '${SUPABASE_TOKEN}', alternatives: ['$SUPABASE_TOKEN', '${SUPABASE_ACCESS_TOKEN}'], placeholder: 'référence de var env ?', hint: 'Référence une variable d\'environnement avec la syntaxe ${NOM_VAR}' },
        { id: 'vcs_server', answer: 'github', alternatives: ['GitHub'], placeholder: 'nom du serveur ?', hint: 'Le service de contrôle de version qui héberge tes repos' },
        { id: 'token_key', answer: 'GITHUB_TOKEN', alternatives: ['GH_TOKEN', 'GITHUB_ACCESS_TOKEN'], placeholder: 'var env du token ?', hint: 'Le nom standard de variable d\'environnement pour l\'authentification GitHub' },
      ],
      explanation: 'Utilise la syntaxe ${NOM_VAR} pour référencer des variables d\'environnement — ça empêche les secrets d\'être committés dans git. Chaque serveur est nommé de façon descriptive et reçoit ses propres identifiants via la config env.',
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
      type: 'multiple-choice',
      question: 'Un serveur MCP tourne avec les mêmes permissions que ton compte utilisateur. Quelle est la pratique de sécurité LA PLUS importante ?',
      options: [
        'N\'utiliser que des serveurs MCP écrits en TypeScript',
        'Limiter les clés API aux permissions minimales requises et utiliser des tokens en lecture seule quand c\'est possible',
        'Toujours lancer les serveurs MCP dans des conteneurs Docker',
        'Restreindre MCP aux connexions localhost uniquement',
      ],
      correctIndex: 1,
      explanation: 'Chaque serveur MCP tourne comme un processus enfant avec tes permissions. Si tu lui donnes des identifiants de base de données, l\'agent peut exécuter n\'importe quelle requête que le serveur autorise. Utilise des tokens en lecture seule quand c\'est possible, limite les clés API aux permissions minimales, et vérifie quels outils un serveur expose avant de le connecter. Le serveur lui-même est la vraie frontière de confiance.',
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
