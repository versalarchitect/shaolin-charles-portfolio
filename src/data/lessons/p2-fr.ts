import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: 'p2',
  steps: [
    {
      type: 'info',
      title: 'Déployer d\'abord, coder ensuite',
      body: "La plupart des cours gardent le déploiement pour la fin. Nous, on le fait en premier. Déployer, c'est mettre votre app sur internet pour que n'importe qui puisse la visiter. Si vous êtes pas capable de déployer, rien d'autre compte. Quelque chose qui fonctionne juste sur votre ordinateur, c'est pas encore un produit.",
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi on déploie avant d\'écrire du vrai code?',
      options: [
        'Le déploiement est la partie la plus facile',
        'Pour impressionner nos amis avec une URL',
        'Si vous êtes pas capable de déployer, rien d\'autre compte',
        'Vercel l\'exige',
      ],
      correctIndex: 2,
      explanation: 'Votre pipeline de déploiement, c\'est la route entre votre ordinateur et internet. Chaque fonctionnalité que vous bâtissez a besoin de cette route pour rejoindre les utilisateurs. La mettre en place en premier fait que vous serez jamais bloqué à la fin à vous demander comment mettre en ligne.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Vous comprenez pourquoi on déploie en premier. Bonne réflexion.',
    },

    {
      type: 'interactive-diagram',
      title: 'Le pipeline de déploiement',
      body: 'Chaque changement suit ce chemin de votre machine jusqu\'au monde entier. Parcourez chaque étape pour voir ce qui se passe.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'edit', label: 'Modifier le code' },
          { id: 'commit', label: 'Commit' },
          { id: 'push', label: 'Push' },
          { id: 'gh', label: 'GitHub', sublabel: 'Stockage du code' },
          { id: 'vc', label: 'Vercel', sublabel: 'Publie automatiquement' },
          { id: 'live', label: 'En ligne', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'edit', to: 'commit' },
          { from: 'commit', to: 'push' },
          { from: 'push', to: 'gh' },
          { from: 'gh', to: 'vc', label: 'webhook' },
          { from: 'vc', to: 'live' },
        ],
      },
      stages: [
        { highlightNodes: ['edit'], explanation: 'Vous faites des changements dans votre code avec VS Code ou n\'importe quel éditeur. Rien ne quitte votre ordinateur pour le moment.' },
        { highlightNodes: ['edit', 'commit'], highlightEdges: [{ from: 'edit', to: 'commit' }], explanation: 'Git commit sauvegarde un instantané de vos changements avec une courte description. Pensez-y comme un point de sauvegarde auquel vous pouvez revenir.' },
        { highlightNodes: ['commit', 'push'], highlightEdges: [{ from: 'commit', to: 'push' }], explanation: 'Git push envoie vos changements sauvegardés de votre ordinateur vers GitHub. C\'est à ce moment que votre code quitte votre machine.' },
        { highlightNodes: ['push', 'gh'], highlightEdges: [{ from: 'push', to: 'gh' }], explanation: 'GitHub reçoit votre code et le stocke. Il notifie aussi Vercel qu\'il y a eu un changement via un webhook.' },
        { highlightNodes: ['gh', 'vc'], highlightEdges: [{ from: 'gh', to: 'vc' }], explanation: 'Vercel récupère automatiquement votre code, construit votre app et la prépare pour internet. Aucune étape manuelle nécessaire.' },
        { highlightNodes: ['vc', 'live'], highlightEdges: [{ from: 'vc', to: 'live' }], explanation: 'Votre app est en ligne! N\'importe qui avec l\'URL peut la visiter. Le processus complet prend moins d\'une minute.' },
      ],
    },

    // === VERCEL ACCOUNT ===
    {
      type: 'multiple-choice',
      question: 'Lors de la création d\'un compte Vercel, quelle méthode d\'inscription devriez-vous utiliser et pourquoi?',
      options: [
        'Inscription par courriel — c\'est plus sécuritaire',
        'Continuer avec GitHub — ça connecte automatiquement vos repos pour les déploiements automatiques',
        'Inscription Google — ça synchronise votre calendrier',
        'N\'importe quelle méthode fonctionne pareil',
      ],
      correctIndex: 1,
      explanation: 'Allez sur vercel.com et inscrivez-vous pour un compte gratuit. Cliquez sur "Continue with GitHub" — ça connecte automatiquement vos projets GitHub à Vercel, ce qui vous sauve une étape de configuration plus tard. Vos repos deviennent instantanément disponibles pour le déploiement.',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi s\'inscrire avec GitHub au lieu d\'un courriel?',
      options: [
        'L\'inscription par courriel est brisée',
        'Ça connecte automatiquement vos repos et configure les webhooks',
        'Les comptes GitHub sont plus sécuritaires',
        'Vercel supporte seulement GitHub',
      ],
      correctIndex: 1,
      explanation: 'S\'inscrire avec GitHub permet à Vercel de voir vos projets automatiquement et de publier les mises à jour chaque fois que vous poussez du nouveau code. Une chose de moins à configurer.',
    },
    {
      type: 'order',
      instruction: 'Mettez les étapes de configuration du compte Vercel dans le bon ordre :',
      items: [
        'Aller sur vercel.com',
        'Cliquer "Continue with GitHub"',
        'Sélectionner le plan Hobby (gratuit)',
      ],
      correctOrder: [0, 1, 2],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Compte Vercel prêt!',
    },

    // === CREATE PROJECT ===
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce que Next.js et pourquoi l\'utilise-t-on?',
      options: [
        'Un outil de base de données pour stocker les informations des utilisateurs',
        'Un framework populaire (fondation pré-construite) pour bâtir des apps web',
        'Un remplacement pour Git comme contrôle de version',
        'Un agent IA qui écrit du code pour vous',
      ],
      correctIndex: 1,
      explanation: 'Next.js est un framework populaire (une fondation pré-construite) pour bâtir des apps web. Vous n\'avez pas besoin de tout comprendre ce qu\'il met en place — l\'agent IA va s\'occuper des détails. On l\'utilise parce qu\'il fonctionne parfaitement avec Vercel.',
    },
    {
      type: 'terminal',
      instruction: 'Ouvrez votre terminal et collez cette commande. Elle crée un nouveau dossier de projet avec tous les fichiers de départ dont vous avez besoin :',
      expectedCommand: 'bunx create-next-app@latest my-first-deploy --ts --tailwind --app --src-dir --eslint',
      hint: 'bunx create-next-app@latest my-first-deploy --ts --tailwind --app --src-dir --eslint',
    },
    {
      type: 'terminal',
      instruction: 'Maintenant, naviguez dans votre nouveau dossier de projet en collant cette commande :',
      expectedCommand: 'cd my-first-deploy',
    },
    {
      type: 'terminal',
      instruction: 'Démarrez le serveur de développement. Ça fait rouler votre projet localement pour que vous puissiez le voir dans votre navigateur :',
      expectedCommand: 'bun dev',
    },
    {
      type: 'multiple-choice',
      question: 'Après avoir exécuté bun dev, quelle URL devriez-vous ouvrir pour voir votre projet rouler localement?',
      options: [
        'http://vercel.com/preview',
        'http://localhost:3000',
        'http://github.com/my-project',
        'http://nextjs.org/demo',
      ],
      correctIndex: 1,
      explanation: 'Quand vous exécutez bun dev, Next.js démarre un serveur de développement local à http://localhost:3000. Ouvrez cette URL dans votre navigateur et vous devriez voir la page d\'accueil de Next.js. Si vous la voyez — votre projet fonctionne localement.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Votre projet roule sur votre ordinateur! Vous venez de créer une app web.',
    },

    // === PUSH TO GITHUB ===
    {
      type: 'multiple-choice',
      question: 'En créant un nouveau dépôt GitHub pour votre projet, pourquoi ne devriez-vous PAS cocher "Add a README" ou "Add .gitignore"?',
      options: [
        'GitHub facture un supplément pour ces fichiers',
        'Le projet a déjà ces fichiers — les ajouter créerait des conflits',
        'Les fichiers README ralentissent les déploiements',
        'Vercel ignore les dépôts avec des fichiers README',
      ],
      correctIndex: 1,
      explanation: 'Quand vous avez créé le projet avec create-next-app, il a déjà généré les fichiers README et .gitignore. Si GitHub les crée aussi, vous aurez un conflit lors de votre premier push. Allez sur github.com/new, nommez-le my-first-deploy, et laissez toutes les cases décochées.',
    },
    {
      type: 'terminal',
      instruction: 'Dites à votre projet local où envoyer le code sur GitHub. Remplacez YOUR_USERNAME par votre nom d\'utilisateur GitHub :',
      expectedCommand: 'git remote add origin git@github.com:YOUR_USERNAME/my-first-deploy.git',
      hint: 'git remote add origin git@github.com:...',
    },
    {
      type: 'terminal',
      instruction: 'Envoyez votre code vers GitHub pour la première fois. Le flag -u retient cette connexion pour que vous n\'ayez pas besoin de le retaper :',
      expectedCommand: 'git push -u origin main',
    },
    {
      type: 'multiple-choice',
      question: 'Que fait le flag -u dans git push -u origin main?',
      options: [
        'Téléverse toutes les branches en même temps',
        'Retient la connexion pour que les prochains push n\'aient besoin que de "git push"',
        'Défait votre dernier changement',
        'Met à jour l\'adresse web de votre projet',
      ],
      correctIndex: 1,
      explanation: 'Le flag -u dit à Git de retenir où envoyer votre code. Après cette première fois, vous pouvez juste taper "git push" et il sait où aller. Une chose de moins à retenir.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Votre code est sur GitHub! N\'importe qui avec le lien peut voir votre projet.',
    },

    // === DEPLOY ===
    {
      type: 'order',
      instruction: 'Mettez les étapes de déploiement Vercel dans le bon ordre :',
      items: [
        'Aller sur vercel.com/new dans votre navigateur',
        'Trouver my-first-deploy dans la liste de vos projets GitHub',
        'Cliquer Import sur le projet',
        'Laisser les paramètres par défaut (Next.js auto-détecté)',
        'Cliquer Deploy et attendre votre URL en ligne',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'multiple-choice',
      question: 'Après avoir déployé votre premier projet, quel type d\'URL obtenez-vous de Vercel?',
      options: [
        'Une URL localhost qui fonctionne seulement sur votre ordinateur',
        'Une URL .vercel.app que n\'importe qui sur internet peut visiter',
        'Une URL .github.io hébergée par GitHub',
        'Aucune URL — vous devez d\'abord configurer un domaine personnalisé',
      ],
      correctIndex: 1,
      explanation: 'Après avoir cliqué Deploy, Vercel vous donne une URL .vercel.app en ligne que n\'importe qui sur internet peut visiter. C\'est votre URL de production. Vous pouvez ajouter un domaine personnalisé plus tard, mais l\'URL .vercel.app fonctionne immédiatement.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Votre app est en ligne sur internet! Vous avez une vraie URL que n\'importe qui peut visiter.',
    },

    // === AUTO DEPLOY ===
    {
      type: 'multiple-choice',
      question: 'Que se passe-t-il quand vous poussez du code vers GitHub après avoir connecté Vercel?',
      options: [
        'Rien — vous devez cliquer Deploy manuellement chaque fois',
        'GitHub vous envoie un courriel demandant d\'approuver le déploiement',
        'Vercel détecte automatiquement le push et publie la mise à jour',
        'Vous devez exécuter une commande de déploiement séparée dans votre terminal',
      ],
      correctIndex: 2,
      explanation: 'Voici la magie : chaque fois que vous poussez du code vers GitHub, Vercel publie automatiquement la mise à jour. Aucune étape manuelle. Testons ça en faisant un petit changement à votre fichier de page d\'accueil.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez le composant de page d\'accueil pour afficher un titre centré "Hello, Vercel." :',
      language: 'tsx',
      filename: 'src/app/page.tsx',
      template: 'export default function {{funcName}}() {\n  return (\n    <main className="flex min-h-screen items-center justify-center">\n      <{{tag}} className="text-4xl font-bold">Hello, Vercel.</{{tag}}>\n    </main>\n  )\n}',
      blanks: [
        { id: 'funcName', answer: 'Home', alternatives: ['home'], placeholder: 'nom du composant?', hint: 'Le composant principal de page dans Next.js' },
        { id: 'tag', answer: 'h1', placeholder: 'balise HTML?', hint: 'La balise de titre principal en HTML' },
      ],
      explanation: 'Les pages Next.js exportent un composant fonction par défaut. La page principale utilise le nom Home. Pour le titre principal, on utilise h1 — le niveau de titre le plus important en HTML.',
    },
    {
      type: 'terminal',
      instruction: 'Dites à Git d\'inclure tous vos changements dans la prochaine sauvegarde. Ça s\'appelle le "staging" :',
      expectedCommand: 'git add .',
    },
    {
      type: 'terminal',
      instruction: 'Sauvegardez vos changements avec une courte description de ce que vous avez fait. Ça s\'appelle un "commit" :',
      expectedCommand: 'git commit -m "Replace default page with hello world"',
      hint: 'git commit -m "..."',
    },
    {
      type: 'terminal',
      instruction: 'Envoyez vos changements vers GitHub. Vercel va automatiquement détecter la mise à jour et la publier :',
      expectedCommand: 'git push',
    },
    {
      type: 'multiple-choice',
      question: 'Combien de temps prend un déploiement Vercel typique après avoir poussé du code?',
      options: [
        'Environ 30 minutes',
        'Moins d\'une minute pour la plupart des projets',
        'Ça dépend du nombre de fichiers modifiés — habituellement 10-15 minutes',
        'Les déploiements ne se font qu\'une fois par jour',
      ],
      correctIndex: 1,
      explanation: 'Vérifiez votre tableau de bord Vercel — vous allez voir un nouveau déploiement en construction. En moins d\'une minute, votre site en ligne se met à jour automatiquement. À partir de maintenant, chaque fois que vous poussez du code, votre site se met à jour. Aucun travail manuel nécessaire.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Le déploiement automatique fonctionne! Poussez du code, le site se met à jour. Simple de même.',
    },

    // === PREVIEW VS PRODUCTION ===
    {
      type: 'interactive-diagram',
      title: 'Aperçu vs Production',
      body: 'La branche vers laquelle vous poussez détermine si vos changements vont en ligne pour les utilisateurs ou créent une version test. Parcourez les étapes pour voir comment ça fonctionne.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'push', label: 'git push', shape: 'rounded', highlight: true },
          { id: 'branch', label: 'Branche?', shape: 'diamond' },
          { id: 'main', label: 'main' },
          { id: 'feature', label: 'feature-*' },
          { id: 'prod', label: 'Production', shape: 'pill', highlight: true },
          { id: 'prev', label: 'Aperçu', shape: 'pill' },
        ],
        edges: [
          { from: 'push', to: 'branch' },
          { from: 'branch', to: 'main', label: 'main' },
          { from: 'branch', to: 'feature', label: 'autre' },
          { from: 'main', to: 'prod' },
          { from: 'feature', to: 'prev' },
        ],
      },
      stages: [
        { highlightNodes: ['push'], explanation: 'Chaque déploiement commence par un git push. Mais la destination de votre code dépend de la branche vers laquelle vous poussez.' },
        { highlightNodes: ['push', 'branch'], highlightEdges: [{ from: 'push', to: 'branch' }], explanation: 'Vercel vérifie quelle branche a reçu le push. Cette seule décision détermine votre type de déploiement.' },
        { highlightNodes: ['branch', 'main', 'prod'], highlightEdges: [{ from: 'branch', to: 'main' }, { from: 'main', to: 'prod' }], explanation: 'Pousser vers main = déploiement en Production. Votre site en ligne se met à jour. Les vrais utilisateurs voient les changements immédiatement.' },
        { highlightNodes: ['branch', 'feature', 'prev'], highlightEdges: [{ from: 'branch', to: 'feature' }, { from: 'feature', to: 'prev' }], explanation: 'Pousser vers n\'importe quelle autre branche = déploiement d\'Aperçu. Une URL test privée que vous seul pouvez voir. Votre site en ligne reste intact.' },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce qui déclenche un déploiement en PRODUCTION sur Vercel?',
      options: [
        'N\'importe quel git push vers n\'importe quelle branche',
        'Pousser vers la branche main',
        'Cliquer sur "Deploy" dans le tableau de bord',
        'Créer un pull request',
      ],
      correctIndex: 1,
      explanation: 'Pousser vers la branche main met à jour votre site en ligne que les utilisateurs voient. Pousser vers n\'importe quelle autre branche crée un aperçu — une URL test privée que vous seul pouvez voir. Ça garde votre site en ligne en sécurité pendant que vous expérimentez.',
    },
    {
      type: 'terminal',
      instruction: 'Créez une branche de test (un espace de travail séparé pour expérimenter). Ça n\'affectera pas votre site en ligne :',
      expectedCommand: 'git checkout -b test-preview',
    },
    {
      type: 'code-input',
      instruction: 'Après avoir fait un changement, quelle commande pousse cette branche pour créer un déploiement d\'aperçu?',
      placeholder: 'git push -u origin _________',
      answer: 'git push -u origin test-preview',
      hint: 'Poussez le nom de la branche que vous venez de créer',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi les déploiements d\'aperçu sont-ils importants?',
      options: [
        'Ils rendent votre site plus rapide pour les utilisateurs',
        'Ils vous permettent de tester les changements sur une URL privée avant la mise en ligne, empêchant les bris accidentels',
        'Ils sont requis par Vercel pour tous les projets',
        'Ils économisent sur les coûts d\'hébergement',
      ],
      correctIndex: 1,
      explanation: 'Les déploiements d\'aperçu sont votre filet de sécurité. Vous testez les changements sur une URL privée avant qu\'ils soient en ligne. Votre vrai site reste intact. Cette habitude vous empêche de briser accidentellement quelque chose que vos utilisateurs voient.',
    },
    {
      type: 'checkpoint',
      xp: 1,
      message: 'Les déploiements d\'aperçu sont compris! Vous savez comment tester en toute sécurité.',
    },
    {
      type: 'compare',
      title: 'Déploiements Production vs Aperçu',
      body: 'Chaque push déclenche un déploiement, mais le type dépend de la branche vers laquelle vous poussez.',
      question: 'Quel type de déploiement devriez-vous utiliser pour tester des changements avant la mise en ligne?',
      correctSide: 'right',
      left: {
        label: 'Production',
        content: 'Branche : main\nDéclencheur : push vers main\nURL : votre-app.vercel.app\nVisibilité : Public, en ligne pour les utilisateurs\nRetour arrière : Instantané via le tableau de bord Vercel',
        language: 'text',
      },
      right: {
        label: 'Aperçu',
        content: 'Branche : n\'importe quelle branche de fonctionnalité\nDéclencheur : push ou PR\nURL : votre-app-git-branche.vercel.app\nVisibilité : Privé, juste vous\nRetour arrière : Pas nécessaire — fermez juste le PR',
        language: 'text',
      },
      explanation: 'Les déploiements d\'aperçu vous permettent de tester sur une vraie URL sans affecter les utilisateurs. Poussez vers une branche de fonctionnalité, vérifiez que tout marche, puis fusionnez vers main pour la production.',
    },

    // === FINAL ===
    {
      type: 'order',
      instruction: 'Mettez le pipeline de déploiement dans le bon ordre :',
      items: ['Modifier le code localement', 'Git commit', 'Git push vers main', 'Vercel build automatique', 'Le site est en ligne'],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'match',
      instruction: 'Associez chaque étape du pipeline de déploiement à ce qu\'elle accomplit :',
      leftItems: ['Lier Vercel à GitHub', 'Exécuter bun dev', 'git push -u origin main', 'Pousser vers une branche de fonctionnalité'],
      rightItems: ['Active les déploiements automatiques au push', 'Teste votre projet localement avant le déploiement', 'Déclenche un déploiement en production', 'Crée un déploiement d\'aperçu pour tester en sécurité'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Chaque étape a un but précis. Lier Vercel active les déploiements automatiques. Exécuter dev teste localement. Pousser vers main va en production. Les branches de fonctionnalité créent des aperçus sûrs.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Pipeline de déploiement complété! Vous avez maintenant un workflow de livraison au push.',
    },
  ],
}

export default content
