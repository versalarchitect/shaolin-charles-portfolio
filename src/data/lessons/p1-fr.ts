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
      type: 'info',
      title: 'Ce qu\'on installe',
      body: 'Voici ce qu\'on met en place : Node.js (le moteur qui fait rouler vos apps), Bun (un outil qui installe les dépendances de projet rapidement), Git (suit tous vos changements comme l\'historique de versions de Google Docs), VS Code (l\'éditeur de texte où vous allez réviser le code), et les clés SSH (des identifiants de connexion sécurisés pour GitHub, comme un mot de passe mais plus sûr). Chaque outil ici est utilisé dans le cours.',
    },
    {
      type: 'diagram',
      title: 'Votre feuille de route',
      body: 'On installe chaque outil dans l\'ordre. Chacun s\'appuie sur le précédent.',
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
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Bon départ! On prépare votre machine.',
    },

    // === NODE.JS ===
    {
      type: 'info',
      title: 'Étape 1 : Node.js',
      body: 'Node.js est le moteur qui fait rouler du code JavaScript sur votre ordinateur. Pensez-y comme le moteur sous le capot de chaque app que vous allez bâtir. On a besoin de la version 22 ou plus récente parce qu\'elle inclut les fonctionnalités modernes les plus récentes.',
    },
    {
      type: 'code-demo',
      title: 'Installer Node.js avec nvm',
      body: 'nvm (Node Version Manager) est un petit outil qui gère quelle version de Node.js votre ordinateur utilise. Différents projets peuvent avoir besoin de différentes versions, et nvm vous permet de passer de l\'une à l\'autre facilement. Ouvrez votre terminal et collez cette commande pour installer nvm :',
      language: 'bash',
      code: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash',
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
      type: 'diagram',
      title: 'nvm en action',
      body: 'Chaque projet peut utiliser une version différente de Node. nvm change instantanément.',
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
    },

    // === BUN ===
    {
      type: 'info',
      title: 'Étape 2 : Bun',
      body: "Bun est un outil qui installe les dépendances de votre projet (les blocs de construction dont votre app a besoin) et exécute des scripts. Il fait la même job que npm mais beaucoup plus vite. Vous allez l'utiliser tout au long du cours.",
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
      type: 'info',
      title: 'Étape 3 : Git',
      body: "Git est un outil qui suit tous vos changements — comme l'historique de versions de Google Docs, mais pour le code. Il vous permet de défaire des erreurs, voir ce qui a changé et quand, et collaborer en toute sécurité avec d'autres. Si vous êtes sur Mac, vous l'avez peut-être déjà installé.",
    },
    {
      type: 'code-demo',
      title: 'Installer Git si nécessaire',
      body: 'La plupart des ordinateurs ont déjà Git. Ouvrez votre terminal et tapez git --version pour vérifier. Si vous voyez un numéro de version, c\'est bon. Sinon, utilisez une de ces commandes selon votre système :',
      language: 'bash',
      code: 'xcode-select --install  # macOS\nsudo apt install git     # Ubuntu/Debian\nwinget install Git.Git   # Windows',
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
      type: 'info',
      title: 'Étape 4 : VS Code',
      body: 'VS Code est l\'éditeur de code qu\'on utilise tout au long du cours. Il est gratuit et fonctionne sur Mac, Windows et Linux. Téléchargez-le depuis code.visualstudio.com si ce n\'est pas déjà fait.',
    },
    {
      type: 'order',
      instruction: 'Installez ces extensions VS Code (des add-ons qui facilitent le codage). Mettez-les dans cet ordre, la plus importante en premier :',
      items: ['ESLint', 'Tailwind CSS IntelliSense', 'Prettier', 'Error Lens'],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'code-demo',
      title: 'Activer le formatage à la sauvegarde',
      body: 'Ajoutez ceci à vos paramètres VS Code. Ça nettoie automatiquement le formatage de votre code chaque fois que vous sauvegardez un fichier — une chose de moins à se soucier :',
      language: 'json',
      filename: 'settings.json',
      code: '{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode"\n}',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'VS Code est configuré! Votre éditeur est prêt pour l\'action.',
    },

    // === SHELL ALIASES ===
    {
      type: 'info',
      title: 'Étape 5 : Raccourcis du terminal',
      body: "Vous allez utiliser le terminal souvent dans ce cours. Les raccourcis (appelés alias) vous permettent de taper des commandes courtes au lieu de longues. Ils vont dans votre fichier de paramètres du terminal (appelé ~/.zshrc sur Mac ou ~/.bashrc sur Linux).",
    },
    {
      type: 'code-demo',
      body: 'Ajoutez ces raccourcis à votre fichier de paramètres du terminal. Ça vous permet de taper des commandes courtes au lieu de longues — par exemple, taper gs au lieu de git status :',
      language: 'bash',
      filename: '~/.zshrc',
      code: '# Git shortcuts\nalias gs="git status"\nalias gc="git commit"\nalias gp="git push"\nalias gl="git log --oneline -20"\n\n# Project shortcuts\nalias dev="bun run dev"\nalias build="bun run build"',
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
      type: 'info',
      title: 'Étape 6 : Clés SSH (connexion sécurisée pour GitHub)',
      body: 'Les clés SSH sont des identifiants de connexion sécurisés — comme un mot de passe, mais plus sûr et plus pratique. Une fois configurées, vous pouvez envoyer du code à GitHub sans taper votre mot de passe à chaque fois. On va créer une clé avec le format Ed25519, qui est le standard moderne.',
    },
    {
      type: 'terminal',
      instruction: 'Ouvrez votre terminal et collez cette commande pour créer votre clé SSH. Remplacez le courriel par le vôtre :',
      expectedCommand: 'ssh-keygen -t ed25519 -C "you@example.com"',
      hint: 'ssh-keygen -t ed25519 -C "votre courriel"',
    },
    {
      type: 'code-demo',
      body: 'Maintenant, activez le programme assistant SSH et enregistrez votre nouvelle clé. Collez ces deux commandes une à la fois :',
      language: 'bash',
      code: 'eval "$(ssh-agent -s)"\nssh-add ~/.ssh/id_ed25519',
    },
    {
      type: 'info',
      title: 'Ajouter votre clé à GitHub',
      body: 'Copiez votre clé publique en collant ceci dans votre terminal : cat ~/.ssh/id_ed25519.pub | pbcopy — ça la copie dans votre presse-papiers. Ensuite, allez sur GitHub, cliquez sur votre photo de profil, allez dans Settings, puis SSH and GPG keys, cliquez New SSH key, collez votre clé et sauvegardez.',
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

    // === VERIFICATION ===
    {
      type: 'checklist',
      title: 'Vérification finale — exécutez chacune de ces commandes dans votre terminal et confirmez qu\'elles fonctionnent :',
      items: [
        'Exécutez node --version dans votre terminal — vous devriez voir v22 ou plus',
        'Exécutez bun --version — vous devriez voir un numéro de version comme 1.x.x',
        'Exécutez git --version — vous devriez voir un numéro de version comme 2.x.x',
        'Ouvrez VS Code et confirmez que vos extensions sont installées (regardez dans la barre latérale)',
        'Exécutez ssh -T git@github.com — vous devriez voir "successfully authenticated"',
        'Tapez gs dans votre terminal — ça devrait afficher votre git status (ça teste vos raccourcis)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Votre machine est prête! Tout est installé et configuré. Passons à la prochaine leçon.',
    },
  ],
}

export default content
