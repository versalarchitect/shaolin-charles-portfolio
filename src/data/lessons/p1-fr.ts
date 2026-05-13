import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p1',
  steps: [
    {
      type: 'info',
      title: 'Bienvenue dans votre première leçon',
      body: "Avant de pouvoir diriger des agents IA pour bâtir des logiciels pour votre entreprise, votre ordinateur a besoin de quelques outils. Pensez-y comme préparer un atelier avant de commencer à construire. Un bon setup maintenant vous évite des maux de tête pour chaque projet futur.",
    },
    {
      type: 'match',
      instruction: 'Avant de commencer, associez chaque outil à sa description en une ligne. Vous allez tous les installer :',
      leftItems: ['Node.js', 'Bun', 'Git', 'VS Code', 'Clés SSH'],
      rightItems: ['Moteur qui fait rouler vos apps', 'Installe les dépendances rapidement', 'Suit les changements comme un historique', 'Éditeur de texte pour réviser le code', 'Connexion sécurisée pour GitHub'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Node.js exécute le JavaScript. Bun installe les dépendances rapidement. Git suit l\'historique du code. VS Code est votre éditeur. Les clés SSH vous connectent à GitHub de façon sécurisée. Chaque outil est utilisé tout au long du cours.',
    },
    {
      type: 'interactive-diagram',
      title: 'Votre feuille de route',
      body: 'On installe chaque outil dans l\'ordre. Chacun s\'appuie sur le précédent. Parcourez les étapes pour voir ce que fait chaque outil.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'rt', label: 'Moteurs', sublabel: 'Node + Bun' },
          { id: 'git', label: 'Git', sublabel: 'Suivi des changements' },
          { id: 'ed', label: 'VS Code', sublabel: 'Éditeur de code' },
          { id: 'cfg', label: 'Config', sublabel: 'Raccourcis + Sécurité' },
          { id: 'done', label: 'Prêt', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'rt', to: 'git' },
          { from: 'git', to: 'ed' },
          { from: 'ed', to: 'cfg' },
          { from: 'cfg', to: 'done' },
        ],
      },
      stages: [
        { highlightNodes: ['rt'], explanation: 'D\'abord, on installe Node.js et Bun — les moteurs qui exécutent votre code et gèrent les dépendances du projet.' },
        { highlightNodes: ['rt', 'git'], highlightEdges: [{ from: 'rt', to: 'git' }], explanation: 'Ensuite, Git suit chaque changement que vous faites — comme l\'historique de versions de Google Docs, mais pour le code.' },
        { highlightNodes: ['git', 'ed'], highlightEdges: [{ from: 'git', to: 'ed' }], explanation: 'VS Code est l\'éditeur où vous révisez et modifiez le code. Les extensions le rendent plus intelligent.' },
        { highlightNodes: ['ed', 'cfg'], highlightEdges: [{ from: 'ed', to: 'cfg' }], explanation: 'Finalement, on ajoute des raccourcis terminal pour sauver du temps et des clés SSH pour un accès GitHub sécurisé.' },
        { highlightNodes: ['cfg', 'done'], highlightEdges: [{ from: 'cfg', to: 'done' }], explanation: 'Une fois tout configuré, votre machine est prête à bâtir de vrais projets avec des agents IA.' },
      ],
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Bon départ! On prépare votre machine.',
    },

    // === NODE.JS ===
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce que Node.js et pourquoi en a-t-on besoin?',
      options: [
        'Un navigateur web pour consulter des sites',
        'Un moteur qui fait rouler du code JavaScript sur votre ordinateur',
        'Un éditeur de texte pour écrire du code',
        'Un outil pour gérer des mots de passe',
      ],
      correctIndex: 1,
      explanation: 'Node.js est le moteur qui fait rouler du code JavaScript sur votre ordinateur. Pensez-y comme le moteur sous le capot de chaque app que vous allez bâtir. On a besoin de la version 22 ou plus récente parce qu\'elle inclut les fonctionnalités modernes les plus récentes.',
    },
    {
      type: 'code-fill',
      instruction: 'nvm (Node Version Manager) gère quelle version de Node.js votre ordinateur utilise. Complétez la commande d\'installation en remplissant le nom de l\'outil et le shell :',
      language: 'bash',
      template: 'curl -o- https://raw.githubusercontent.com/{{tool}}-sh/{{tool}}/v0.40.3/install.sh | {{shell}}',
      blanks: [
        { id: 'tool', answer: 'nvm', placeholder: 'quel outil?', hint: 'L\'outil qui gère les versions de Node' },
        { id: 'shell', answer: 'bash', placeholder: 'quel shell?', hint: 'Le shell Unix standard qui exécute les scripts' },
      ],
      explanation: 'nvm s\'installe en téléchargeant un script depuis GitHub et en le redirigeant vers bash. C\'est un pattern courant pour installer des outils de développement.',
    },
    {
      type: 'terminal',
      instruction: 'Fermez votre terminal, rouvrez-le, puis collez cette commande. Elle installe Node.js version 22 sur votre machine :',
      expectedCommand: 'nvm install 22',
      hint: 'nvm install <version>',
    },
    {
      type: 'terminal',
      instruction: 'Maintenant, définissez Node 22 comme version par défaut pour qu\'elle soit toujours disponible quand vous ouvrez un nouveau terminal :',
      expectedCommand: 'nvm alias default 22',
      hint: 'nvm alias default <version>',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi utilise-t-on nvm au lieu d\'installer Node.js directement depuis le site web?',
      options: [
        'nvm rend Node.js plus rapide',
        'nvm permet de changer facilement entre différentes versions de Node.js pour différents projets',
        'nvm est requis par la plateforme d\'hébergement',
        'nvm remplace le besoin d\'autres outils',
      ],
      correctIndex: 1,
      explanation: 'Différents projets ont parfois besoin de différentes versions de Node.js. nvm vous permet de passer de l\'une à l\'autre instantanément, donc vous n\'êtes jamais bloqué. Pas besoin de mémoriser ça — comprenez juste l\'idée.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Beau travail! Node.js est installé et prêt à rouler.',
    },

    {
      type: 'interactive-diagram',
      title: 'nvm en action',
      body: 'Chaque projet peut utiliser une version différente de Node. nvm change instantanément. Parcourez les étapes pour voir comment.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'nvm', label: 'nvm', shape: 'rounded', highlight: true },
          { id: 'pa', label: 'Projet A' },
          { id: 'pb', label: 'Projet B' },
          { id: 'pc', label: 'Projet C' },
          { id: 'v18', label: 'Node 18', shape: 'pill' },
          { id: 'v22', label: 'Node 22', shape: 'pill', highlight: true },
          { id: 'v20', label: 'Node 20', shape: 'pill' },
        ],
        edges: [
          { from: 'nvm', to: 'pa' },
          { from: 'nvm', to: 'pb' },
          { from: 'nvm', to: 'pc' },
          { from: 'pa', to: 'v18' },
          { from: 'pb', to: 'v22' },
          { from: 'pc', to: 'v20' },
        ],
      },
      stages: [
        { highlightNodes: ['nvm'], explanation: 'nvm est au sommet, gérant toutes vos versions de Node.js. Il sait quelle version chaque projet a besoin.' },
        { highlightNodes: ['nvm', 'pa', 'v18'], highlightEdges: [{ from: 'nvm', to: 'pa' }, { from: 'pa', to: 'v18' }], explanation: 'Le Projet A utilise Node 18 — peut-être un ancien projet qui n\'a pas encore été mis à jour.' },
        { highlightNodes: ['nvm', 'pb', 'v22'], highlightEdges: [{ from: 'nvm', to: 'pb' }, { from: 'pb', to: 'v22' }], explanation: 'Le Projet B utilise Node 22 — la dernière version avec les fonctionnalités modernes. C\'est ce qu\'on utilise dans ce cours.' },
        { highlightNodes: ['nvm', 'pc', 'v20'], highlightEdges: [{ from: 'nvm', to: 'pc' }, { from: 'pc', to: 'v20' }], explanation: 'Le Projet C utilise Node 20 — une version complètement différente. nvm passe de l\'une à l\'autre instantanément.' },
      ],
    },

    // === BUN ===
    {
      type: 'multiple-choice',
      question: 'Que fait Bun et pourquoi l\'utilise-t-on au lieu de npm?',
      options: [
        'Bun est un navigateur web qui affiche du JavaScript',
        'Bun installe les dépendances de projet et exécute des scripts — comme npm mais beaucoup plus vite',
        'Bun est un éditeur de code comme VS Code',
        'Bun remplace Node.js entièrement',
      ],
      correctIndex: 1,
      explanation: 'Bun est un outil qui installe les dépendances de votre projet (les blocs de construction dont votre app a besoin) et exécute des scripts. Il fait la même job que npm mais beaucoup plus vite. Vous allez l\'utiliser tout au long du cours.',
    },
    {
      type: 'terminal',
      instruction: 'Ouvrez votre terminal et collez cette commande. Elle télécharge et installe Bun sur votre machine :',
      expectedCommand: 'curl -fsSL https://bun.sh/install | bash',
    },
    {
      type: 'terminal',
      instruction: 'Fermez et rouvrez votre terminal, puis collez cette commande pour confirmer que Bun s\'est installé correctement. Vous devriez voir un numéro de version :',
      expectedCommand: 'bun --version',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Bun est installé! Deux outils de faits, encore quelques-uns à faire.',
    },

    // === GIT ===
    {
      type: 'multiple-choice',
      question: 'Quelle est la meilleure façon de décrire ce que fait Git?',
      options: [
        'Git est un service de stockage dans le cloud comme Google Drive',
        'Git suit tous vos changements de code comme un historique de versions, vous permettant de défaire des erreurs et collaborer en sécurité',
        'Git est un langage de programmation pour bâtir des sites web',
        'Git est un outil qui corrige automatiquement les bogues dans votre code',
      ],
      correctIndex: 1,
      explanation: 'Git est un outil qui suit tous vos changements — comme l\'historique de versions de Google Docs, mais pour le code. Il vous permet de défaire des erreurs, voir ce qui a changé et quand, et collaborer en toute sécurité avec d\'autres. Si vous êtes sur Mac, vous l\'avez peut-être déjà installé.',
    },
    {
      type: 'code-fill',
      instruction: 'La plupart des ordinateurs ont déjà Git. Sinon, complétez la commande d\'installation pour votre système. Remplissez le bon nom de paquet pour chaque plateforme :',
      language: 'bash',
      template: 'xcode-select --install  # macOS\nsudo apt install {{pkg1}}     # Ubuntu/Debian\nwinget install {{pkg2}}   # Windows',
      blanks: [
        { id: 'pkg1', answer: 'git', placeholder: 'paquet?', hint: 'Le nom de l\'outil lui-même, en minuscules' },
        { id: 'pkg2', answer: 'Git.Git', alternatives: ['git.git'], placeholder: 'ID du paquet?', hint: 'Windows utilise le format Éditeur.Paquet' },
      ],
      explanation: 'Sur Ubuntu, le paquet est simplement "git". Sur Windows avec winget, l\'identifiant du paquet est "Git.Git". Sur macOS, les outils en ligne de commande Xcode incluent Git automatiquement.',
    },
    {
      type: 'terminal',
      instruction: 'Dites à Git votre nom. Celui-ci sera attaché à chaque changement que vous sauvegardez. Remplacez "Your Name" par votre vrai nom :',
      expectedCommand: 'git config --global user.name "Your Name"',
      hint: 'git config --global user.name "..."',
    },
    {
      type: 'terminal',
      instruction: 'Maintenant, dites à Git votre courriel. Utilisez le même courriel que celui avec lequel vous vous êtes inscrit sur GitHub pour que vos changements soient liés à votre profil :',
      expectedCommand: 'git config --global user.email "you@example.com"',
      hint: 'git config --global user.email "..."',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi votre courriel Git devrait correspondre à votre courriel GitHub?',
      options: [
        'Git ne fonctionnera pas autrement',
        'Pour que vos commits soient liés à votre profil GitHub',
        'GitHub exige une vérification par courriel pour chaque commit',
        'Ça rend Git plus rapide',
      ],
      correctIndex: 1,
      explanation: 'GitHub associe le courriel dans vos changements à votre profil. S\'ils ne correspondent pas, votre travail apparaît comme "contributeur inconnu" au lieu de votre nom.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Git est configuré! Vos changements seront maintenant suivis sous votre nom.',
    },

    // === VS CODE ===
    {
      type: 'multiple-choice',
      question: 'Pourquoi utilise-t-on VS Code comme éditeur de code?',
      options: [
        'C\'est le seul éditeur qui supporte JavaScript',
        'Il est gratuit, multiplateforme, et possède un riche écosystème d\'extensions',
        'Il a été créé par la même équipe que Node.js',
        'Il est plus rapide que taper du code dans le terminal',
      ],
      correctIndex: 1,
      explanation: 'VS Code est l\'éditeur de code qu\'on utilise tout au long du cours. Il est gratuit et fonctionne sur Mac, Windows et Linux. Son écosystème d\'extensions le rend incroyablement puissant. Téléchargez-le depuis code.visualstudio.com si ce n\'est pas déjà fait.',
    },
    {
      type: 'order',
      instruction: 'Installez ces extensions VS Code (des add-ons qui facilitent le codage). Mettez-les dans cet ordre, la plus importante en premier :',
      items: ['ESLint', 'Tailwind CSS IntelliSense', 'Prettier', 'Error Lens'],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'code-fill',
      instruction: 'Complétez les paramètres VS Code pour nettoyer automatiquement le formatage chaque fois que vous sauvegardez un fichier :',
      language: 'json',
      filename: 'settings.json',
      template: '{\n  "editor.{{setting1}}": {{value1}},\n  "editor.{{setting2}}": "esbenp.prettier-vscode"\n}',
      blanks: [
        { id: 'setting1', answer: 'formatOnSave', alternatives: ['format_on_save'], placeholder: 'quel paramètre?', hint: 'Combine format + on + save en camelCase' },
        { id: 'value1', answer: 'true', placeholder: 'activé ou désactivé?', hint: 'Booléen : true ou false' },
        { id: 'setting2', answer: 'defaultFormatter', alternatives: ['default_formatter'], placeholder: 'quel paramètre de formatage?', hint: 'Quel paramètre définit le formateur par défaut?' },
      ],
      explanation: 'formatOnSave exécute automatiquement Prettier chaque fois que vous sauvegardez. defaultFormatter indique à VS Code quelle extension utiliser pour le formatage.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'VS Code est configuré! Votre éditeur est prêt pour l\'action.',
    },

    // === SHELL ALIASES ===
    {
      type: 'multiple-choice',
      question: 'Que sont les alias de terminal et où vont-ils?',
      options: [
        'Les alias sont des signets de navigateur stockés dans votre barre de favoris',
        'Les alias sont des commandes raccourcies stockées dans votre fichier de paramètres du terminal (~/.zshrc ou ~/.bashrc)',
        'Les alias sont des branches Git utilisées pour les tests',
        'Les alias sont des extensions VS Code qui exécutent des commandes',
      ],
      correctIndex: 1,
      explanation: 'Vous allez utiliser le terminal souvent dans ce cours. Les raccourcis (appelés alias) vous permettent de taper des commandes courtes au lieu de longues. Ils vont dans votre fichier de paramètres du terminal (appelé ~/.zshrc sur Mac ou ~/.bashrc sur Linux).',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ces raccourcis terminal. Chaque alias mappe une commande courte à une plus longue — par exemple, gs exécute git status :',
      language: 'bash',
      filename: '~/.zshrc',
      template: '# Git shortcuts\nalias gs="{{cmd1}}"\nalias gc="git commit"\nalias gp="{{cmd2}}"\nalias gl="git log --oneline -20"\n\n# Project shortcuts\nalias dev="{{cmd3}}"',
      blanks: [
        { id: 'cmd1', answer: 'git status', placeholder: 'commande complète?', hint: 'gs signifie git s...' },
        { id: 'cmd2', answer: 'git push', placeholder: 'commande complète?', hint: 'gp signifie git p...' },
        { id: 'cmd3', answer: 'bun run dev', placeholder: 'commande complète?', hint: 'Utilise bun pour exécuter le script dev' },
      ],
      explanation: 'Chaque alias mappe une abréviation courte à la commande complète. gs = git status, gp = git push, dev = bun run dev. Ça sauve du temps sur les commandes que vous exécutez plusieurs fois par jour.',
    },
    {
      type: 'code-input',
      instruction: 'Après avoir modifié votre fichier de paramètres du terminal, vous devez le recharger. Quelle commande fait ça? (Le fichier s\'appelle .zshrc)',
      placeholder: 'source ~/.______',
      answer: 'source ~/.zshrc',
      hint: 'Tapez source suivi du chemin vers votre fichier de paramètres : ~/.zshrc',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Les raccourcis sont en place! Vous allez sauver beaucoup de frappe à partir de maintenant.',
    },

    // === SSH KEYS ===
    {
      type: 'multiple-choice',
      question: 'Que sont les clés SSH et pourquoi en a-t-on besoin?',
      options: [
        'Les clés SSH sont des outils de chiffrement qui protègent vos fichiers des virus',
        'Les clés SSH sont des identifiants sécurisés qui vous permettent d\'envoyer du code à GitHub sans taper votre mot de passe à chaque fois',
        'Les clés SSH sont des branches Git spéciales utilisées pour le développement sécurisé',
        'Les clés SSH sont des extensions VS Code pour l\'édition à distance',
      ],
      correctIndex: 1,
      explanation: 'Les clés SSH sont des identifiants de connexion sécurisés — comme un mot de passe, mais plus sûr et plus pratique. Une fois configurées, vous pouvez envoyer du code à GitHub sans taper votre mot de passe à chaque fois. On utilise le format Ed25519, qui est le standard moderne.',
    },
    {
      type: 'terminal',
      instruction: 'Ouvrez votre terminal et collez cette commande pour créer votre clé SSH. Remplacez le courriel par le vôtre :',
      expectedCommand: 'ssh-keygen -t ed25519 -C "you@example.com"',
      hint: 'ssh-keygen -t ed25519 -C "votre courriel"',
    },
    {
      type: 'code-fill',
      instruction: 'Activez le programme assistant SSH et enregistrez votre nouvelle clé. Remplissez les parties manquantes :',
      language: 'bash',
      template: 'eval "$({{agent}} -s)"\nssh-add ~/.ssh/{{keyfile}}',
      blanks: [
        { id: 'agent', answer: 'ssh-agent', placeholder: 'quel programme?', hint: 'Le programme assistant SSH' },
        { id: 'keyfile', answer: 'id_ed25519', alternatives: ['id_ed25519.pub'], placeholder: 'nom du fichier clé?', hint: 'Le fichier de clé privée créé par ssh-keygen avec Ed25519' },
      ],
      explanation: 'ssh-agent est un programme assistant qui garde vos clés en mémoire. ssh-add enregistre votre clé spécifique (id_ed25519) avec l\'agent pour qu\'elle puisse être utilisée automatiquement.',
    },
    {
      type: 'order',
      instruction: 'Mettez ces étapes pour ajouter votre clé SSH à GitHub dans le bon ordre :',
      items: [
        'Copier votre clé publique : cat ~/.ssh/id_ed25519.pub | pbcopy',
        'Aller sur GitHub et cliquer sur votre photo de profil',
        'Naviguer vers Settings, puis SSH and GPG keys',
        'Cliquer New SSH key et coller votre clé',
        'Sauvegarder la clé',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'terminal',
      instruction: 'Testez votre connexion à GitHub. Si ça fonctionne, vous allez voir un message disant "successfully authenticated" :',
      expectedCommand: 'ssh -T git@github.com',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'SSH est connecté! Vous pouvez maintenant communiquer de façon sécurisée avec GitHub.',
    },

    // === REVUE INTERACTIVE ===
    {
      type: 'match',
      instruction: 'Associez chaque outil à son rôle dans votre environnement de développement :',
      leftItems: ['Node.js', 'Bun', 'Git', 'VS Code', 'Clé SSH'],
      rightItems: ['Runtime JavaScript pour exécuter du code', 'Gestionnaire de paquets et bundler rapide', 'Contrôle de version pour suivre les changements', 'Éditeur de code avec extensions', 'Authentification sécurisée avec GitHub'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Chaque outil a un rôle précis. Node.js exécute le JavaScript, Bun gère les paquets rapidement, Git suit l\'historique du code, VS Code est votre éditeur, et les clés SSH vous authentifient avec GitHub sans mot de passe.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez les paramètres VS Code pour activer le formatage automatique à la sauvegarde :',
      language: 'json',
      filename: '.vscode/settings.json',
      template: '{\n  "editor.{{setting1}}": {{value1}},\n  "editor.{{setting2}}": "esbenp.prettier-vscode"\n}',
      blanks: [
        { id: 'setting1', answer: 'formatOnSave', alternatives: ['format_on_save'], placeholder: 'quel paramètre?', hint: 'Deux mots en anglais : format + on + save' },
        { id: 'value1', answer: 'true', placeholder: 'true ou false?' },
        { id: 'setting2', answer: 'defaultFormatter', alternatives: ['default_formatter'], placeholder: 'quel paramètre de formatage?', hint: 'Quel est le formateur par défaut?' },
      ],
      explanation: 'formatOnSave exécute automatiquement Prettier chaque fois que vous sauvegardez. defaultFormatter indique à VS Code quelle extension utiliser pour le formatage.',
    },

    // === VERIFICATION ===
    {
      type: 'match',
      instruction: 'Associez chaque commande de vérification à ce que vous devriez voir comme résultat :',
      leftItems: ['node --version', 'bun --version', 'git --version', 'ssh -T git@github.com', 'gs'],
      rightItems: ['v22.x.x ou plus', 'Une version comme 1.x.x', 'Une version comme 2.x.x', '"successfully authenticated"', 'Votre sortie git status'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 },
      explanation: 'Chaque commande vérifie un outil différent. node --version devrait afficher v22+, bun affiche sa version, git affiche sa version, ssh -T teste votre connexion GitHub, et gs teste votre alias pour git status.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Votre machine est prête! Tout est installé et configuré. Passons à la prochaine leçon.',
    },
  ],
}

export default content
