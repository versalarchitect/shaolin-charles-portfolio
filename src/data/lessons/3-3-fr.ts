import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-3',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Le problème de collision de fichiers',
      body: "Vous lancez trois agents Claude Code sur le même dépôt. L'agent 1 modifie src/auth.ts. L'agent 2 modifie src/auth.ts. L'agent 3 lit une version périmée de src/auth.ts. L'un écrase l'autre. Le travail du troisième agent est basé sur du code qui n'existe plus. Bienvenue dans la raison numéro un pour laquelle les agents parallèles échouent : ils se battent tous pour le même répertoire de travail.",
    },
    {
      type: 'info',
      title: 'Les worktrees résolvent ça complètement',
      body: "Les worktrees Git donnent à chaque agent son propre répertoire de travail avec sa propre branche — mais ils partagent tous le même historique .git. Pas de copies, pas de clones, pas de problèmes de synchronisation. Chaque agent écrit dans son propre dossier, sur sa propre branche, et quand ils ont fini, vous fusionnez. C'est la différence entre trois chefs qui partagent une seule planche à découper et trois chefs avec leur propre station.",
    },

    // === DIAGRAM 1: WORKTREE ISOLATION ===
    {
      type: 'diagram',
      title: 'Isolation par worktree',
      body: 'Trois agents travaillent dans des worktrees séparés sur des branches séparées. Aucun conflit de fichier. Fusion propre à la fin.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'repo', label: 'Dépôt principal', sublabel: 'branche main', shape: 'rounded', highlight: true },
          { id: 'wt-a', label: 'Worktree A', sublabel: 'Agent 1', shape: 'rect' },
          { id: 'wt-b', label: 'Worktree B', sublabel: 'Agent 2', shape: 'rect' },
          { id: 'wt-c', label: 'Worktree C', sublabel: 'Agent 3', shape: 'rect' },
          { id: 'merge', label: 'Fusion', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'repo', to: 'wt-a' },
          { from: 'repo', to: 'wt-b' },
          { from: 'repo', to: 'wt-c' },
          { from: 'wt-a', to: 'merge' },
          { from: 'wt-b', to: 'merge' },
          { from: 'wt-c', to: 'merge' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Vous voyez l\'architecture !',
    },

    // === WHAT IS A WORKTREE ===
    {
      type: 'info',
      title: 'Qu\'est-ce qu\'un worktree git ?',
      body: "Un worktree est un répertoire de travail supplémentaire lié à votre dépôt existant. Normalement, vous avez un seul répertoire de travail et changez de branche avec git checkout. Les worktrees vous permettent d'avoir plusieurs branches extraites simultanément dans différents dossiers. Crucialément, ils partagent tous la même base de données .git — commits, branches, historique, remotes. Quand l'agent 1 fait un commit dans son worktree, l'agent 2 peut voir cette branche immédiatement.",
    },
    {
      type: 'info',
      title: 'Worktree vs clone',
      body: "Vous pourriez penser : clonez le dépôt trois fois. Ça fonctionne mais pose des problèmes. Trois clones signifient trois copies de l'historique .git complet, trois ensembles de remotes à push/pull, et aucune visibilité de branche partagée. Les worktrees partagent tout en coulisses. Ils sont légers — en créer un prend des millisecondes, pas des minutes. Et quand vous fusionnez, vous fusionnez des branches locales, pas en coordonnant entre des dépôts séparés.",
    },
    {
      type: 'multiple-choice',
      question: 'Que partagent tous les worktrees d\'un dépôt ?',
      options: [
        'Les mêmes fichiers du répertoire de travail',
        'La même branche extraite',
        'La même base de données .git et le même historique',
        'Les mêmes modifications non commitées',
      ],
      correctIndex: 2,
      explanation: 'Les worktrees partagent la base de données .git — tous les commits, branches, tags et remotes. Mais chaque worktree a son propre répertoire de travail et sa propre branche extraite. Les modifications non commitées sont isolées dans chaque worktree.',
    },

    // === CORE COMMANDS ===
    {
      type: 'info',
      title: 'Les quatre commandes dont vous avez besoin',
      body: "Les worktrees Git se résument à quatre commandes : add (créer un nouveau worktree), list (voir tous les worktrees actifs), remove (nettoyer un worktree), et prune (supprimer les références périmées). C'est tout. La simplicité est le point — la puissance est dans la façon dont vous les combinez avec les agents.",
    },
    {
      type: 'code-demo',
      title: 'Créer un worktree',
      body: 'La commande git worktree add crée un nouveau répertoire et extrait une branche dedans. Si la branche n\'existe pas, utilisez -b pour la créer.',
      language: 'bash',
      filename: 'terminal',
      code: '# Create a worktree with a new branch\ngit worktree add ../project-auth -b feat/auth\n\n# Create a worktree for an existing branch\ngit worktree add ../project-api feat/api\n\n# Result: ../project-auth/ is now a full working directory\n# on the feat/auth branch, ready for an agent',
    },
    {
      type: 'terminal',
      instruction: 'Créez un nouveau worktree à ../wt-auth sur une branche appelée feat/auth :',
      expectedCommand: 'git worktree add ../wt-auth -b feat/auth',
      hint: 'Utilisez git worktree add <chemin> -b <nom-nouvelle-branche>',
    },
    {
      type: 'code-demo',
      title: 'Gérer les worktrees',
      body: 'Listez tous les worktrees pour voir ce qui est actif, et supprimez-les quand c\'est fini.',
      language: 'bash',
      filename: 'terminal',
      code: '# List all worktrees\ngit worktree list\n# /home/user/project        abc1234 [main]\n# /home/user/project-auth   def5678 [feat/auth]\n# /home/user/project-api    ghi9012 [feat/api]\n\n# Remove a worktree after merging\ngit worktree remove ../project-auth\n\n# Clean up stale references\ngit worktree prune',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Commandes de base maîtrisées !',
    },

    // === DIAGRAM 2: WORKTREE LIFECYCLE ===
    {
      type: 'diagram',
      title: 'Cycle de vie d\'un worktree',
      body: 'Chaque worktree suit ce cycle de vie : le créer, brancher depuis main, faire le travail, le tester, fusionner vers main, puis nettoyer.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'create', label: 'Créer', shape: 'rounded' },
          { id: 'branch', label: 'Brancher' },
          { id: 'work', label: 'Travailler' },
          { id: 'test', label: 'Tester' },
          { id: 'merge', label: 'Fusionner' },
          { id: 'cleanup', label: 'Nettoyer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'create', to: 'branch' },
          { from: 'branch', to: 'work' },
          { from: 'work', to: 'test' },
          { from: 'test', to: 'merge' },
          { from: 'merge', to: 'cleanup' },
        ],
      },
    },

    // === PRACTICAL SETUP ===
    {
      type: 'info',
      title: 'Configurer 3 worktrees pour des agents parallèles',
      body: "Voici le vrai workflow. Vous avez une fonctionnalité qui se divise en trois tâches indépendantes : auth, API et UI. Vous créez trois worktrees, lancez trois agents Claude Code, et pointez chacun vers son propre répertoire. Ils travaillent en parallèle sans aucune coordination nécessaire. La règle clé : chaque agent travaille dans un répertoire worktree séparé, jamais dans le répertoire du dépôt principal.",
    },
    {
      type: 'code-demo',
      title: 'Configuration complète en parallèle',
      body: 'Créez trois worktrees, puis lancez des agents dans chacun. Chaque agent obtient son propre espace de travail isolé.',
      language: 'bash',
      filename: 'terminal',
      code: '# From your main repo directory\ngit worktree add ../myapp-auth -b feat/auth\ngit worktree add ../myapp-api  -b feat/api\ngit worktree add ../myapp-ui   -b feat/ui\n\n# Launch agents in separate terminals\n# Terminal 1:\ncd ../myapp-auth && claude "Implement JWT auth middleware"\n\n# Terminal 2:\ncd ../myapp-api && claude "Add CRUD endpoints for users"\n\n# Terminal 3:\ncd ../myapp-ui && claude "Build the settings page component"',
    },
    {
      type: 'code-input',
      instruction: 'Écrivez la commande pour créer un worktree à ../myapp-api sur une nouvelle branche appelée feat/api :',
      placeholder: 'git worktree add _____ -b _____',
      answer: 'git worktree add ../myapp-api -b feat/api',
      hint: 'Patron : git worktree add <chemin> -b <branche>',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi chaque agent devrait-il s\'exécuter dans son propre répertoire worktree plutôt que dans le dépôt principal ?',
      options: [
        'Le dépôt principal est en lecture seule',
        'Les agents dans le même répertoire écraseront les fichiers de l\'autre',
        'Git ne permet pas plusieurs branches',
        'Claude Code ne peut ouvrir qu\'un seul fichier à la fois',
      ],
      correctIndex: 1,
      explanation: 'Si deux agents modifient le même fichier dans le même répertoire, l\'un écrasera les modifications de l\'autre. Des worktrees séparés signifient des systèmes de fichiers séparés — pas de conflits pendant le travail, seulement au moment de la fusion.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Configuration parallèle maîtrisée !',
    },

    // === MERGE STRATEGY ===
    {
      type: 'info',
      title: 'L\'ordre de fusion compte',
      body: "Quand les trois agents ont fini, vous devez fusionner leurs branches vers main. L'ordre compte. Commencez par la branche qui a zéro dépendance envers les autres — généralement la fonctionnalité la plus isolée. Puis fusionnez la suivante. Si ça crée un conflit, vous le résolvez contre un main qui a déjà la première fusion. Enfin, fusionnez la branche la plus susceptible de toucher du code partagé en dernier, pour attraper tous les conflits en une seule passe.",
    },
    {
      type: 'code-demo',
      title: 'Stratégie de fusion séquentielle',
      body: 'Fusionnez auth en premier (indépendant), puis api, puis ui (qui peut dépendre des types api).',
      language: 'bash',
      filename: 'terminal',
      code: '# Back in your main repo directory\n\n# Step 1: Merge auth (no dependencies)\ngit merge feat/auth\n# Clean merge -- auth is fully independent\n\n# Step 2: Merge api\ngit merge feat/api\n# Clean merge -- api didn\'t touch auth files\n\n# Step 3: Merge ui (may conflict if it imports api types)\ngit merge feat/ui\n# If conflicts arise, resolve them here\n# You only deal with conflicts once, at the end',
    },
    {
      type: 'order',
      instruction: 'Ordonnez ces étapes de fusion de la première à la dernière :',
      items: [
        'Fusionner la branche avec le plus de changements dans le code partagé',
        'Résoudre les conflits éventuels',
        'Fusionner la branche la plus indépendante en premier',
        'Fusionner la branche de dépendance intermédiaire',
      ],
      correctOrder: [2, 3, 0, 1],
    },

    // === DIAGRAM 3: BRANCH STRATEGY ===
    {
      type: 'diagram',
      title: 'Stratégie de branches',
      body: 'Les branches de fonctionnalité divergent de main, sont révisées, et fusionnent à nouveau. La couche parallèle est l\'endroit où les agents travaillent simultanément.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'main-top', label: 'main', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'feat/auth', shape: 'rect' },
          { id: 'api', label: 'feat/api', shape: 'rect' },
          { id: 'ui', label: 'feat/ui', shape: 'rect' },
          { id: 'review', label: 'Révision PR', shape: 'rect' },
          { id: 'main-end', label: 'main', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'main-top', to: 'auth' },
          { from: 'main-top', to: 'api' },
          { from: 'main-top', to: 'ui' },
          { from: 'auth', to: 'review' },
          { from: 'api', to: 'review' },
          { from: 'ui', to: 'review' },
          { from: 'review', to: 'main-end' },
        ],
      },
    },

    // === CONFLICT RESOLUTION ===
    {
      type: 'info',
      title: 'Quand les conflits arrivent quand même',
      body: "Même avec une isolation parfaite par worktree, des conflits peuvent survenir. L'agent 1 ajoute un nouvel export à src/index.ts. L'agent 3 ajoute aussi un export à src/index.ts. Ils ont modifié des lignes différentes, mais git ne peut pas toujours auto-fusionner des changements adjacents. La solution est simple : quand git merge signale un conflit, ouvrez le fichier, gardez les deux ajouts, et commitez. L'insight clé est que les worktrees réduisent les conflits de « cauchemar constant » à « occasionnel et gérable ».",
    },
    {
      type: 'code-demo',
      title: 'Résoudre un conflit de fusion',
      body: 'Git marque les conflits avec des chevrons. Gardez les deux changements, supprimez les marqueurs, et commitez.',
      language: 'typescript',
      filename: 'src/index.ts',
      code: '// Git shows this in the conflicted file:\n<<<<<<< HEAD\nexport { AuthService } from \'./auth\'\n=======\nexport { UserSettings } from \'./settings\'\n>>>>>>> feat/ui\n\n// Resolution: keep both exports\nexport { AuthService } from \'./auth\'\nexport { UserSettings } from \'./settings\'',
    },
    {
      type: 'multiple-choice',
      question: 'Deux agents ont tous les deux ajouté de nouveaux exports au même fichier index. Quelle est la résolution la plus courante ?',
      options: [
        'Supprimer l\'export d\'un agent',
        'Garder les deux exports et supprimer les marqueurs de conflit',
        'Annuler les deux branches et recommencer',
        'Déplacer un export dans un fichier différent',
      ],
      correctIndex: 1,
      explanation: 'Quand les agents ajoutent du code non chevauchant au même fichier, la solution est presque toujours de garder les deux ajouts. Supprimez les marqueurs <<<, === et >>>, gardez les deux exports, et commitez la fusion.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Résolution de conflits gérée !',
    },

    // === CLEANUP ===
    {
      type: 'info',
      title: 'Nettoyage : supprimer les worktrees après la fusion',
      body: "Les worktrees sont peu coûteux à créer mais vous devriez quand même les nettoyer. Après la fusion, le répertoire worktree ne fait que prendre de l'espace disque et la référence de branche devient périmée. Supprimez chaque worktree, supprimez les branches fusionnées, et vous retrouvez un état propre. Prenez-en l'habitude — des worktrees restants de la fonctionnalité de la semaine dernière vous embrouilleront la semaine prochaine.",
    },
    {
      type: 'code-demo',
      title: 'Séquence de nettoyage complète',
      body: 'Supprimez les répertoires worktree, puis supprimez les branches fusionnées.',
      language: 'bash',
      filename: 'terminal',
      code: '# Remove worktrees\ngit worktree remove ../myapp-auth\ngit worktree remove ../myapp-api\ngit worktree remove ../myapp-ui\n\n# Delete merged branches\ngit branch -d feat/auth\ngit branch -d feat/api\ngit branch -d feat/ui\n\n# Verify clean state\ngit worktree list\n# Should show only the main worktree',
    },
    {
      type: 'terminal',
      instruction: 'Supprimez le worktree à ../wt-auth après l\'avoir fusionné :',
      expectedCommand: 'git worktree remove ../wt-auth',
      hint: 'Utilisez git worktree remove <chemin>',
    },

    // === INTERACTIF : CODE-FILL ===
    {
      type: 'code-fill',
      instruction: 'Complétez les commandes git worktree pour configurer des espaces de travail parallèles :',
      language: 'shell',
      template: '# Create isolated worktrees for two agents\ngit worktree add ../{{dir1}} -b {{branch1}}\ngit worktree add ../{{dir2}} -b {{branch2}}\n\n# After agents finish, clean up\ngit worktree {{cleanup}} ../agent-auth\ngit worktree {{cleanup}} ../agent-api',
      blanks: [
        { id: 'dir1', answer: 'agent-auth', alternatives: ['wt-auth'], placeholder: 'nom du répertoire ?', hint: 'Nom descriptif pour l\'espace de travail de l\'agent auth' },
        { id: 'branch1', answer: 'feat/auth', alternatives: ['feature/auth', 'auth'], placeholder: 'nom de branche ?', hint: 'Branche de fonctionnalité pour le travail auth' },
        { id: 'dir2', answer: 'agent-api', alternatives: ['wt-api'], placeholder: 'nom du répertoire ?' },
        { id: 'branch2', answer: 'feat/api', alternatives: ['feature/api', 'api'], placeholder: 'nom de branche ?' },
        { id: 'cleanup', answer: 'remove', alternatives: ['rm'], placeholder: 'commande de nettoyage ?', hint: 'Supprimer le worktree quand c\'est fini' },
      ],
      explanation: 'Chaque agent obtient son propre répertoire et sa propre branche. Ils travaillent en isolation complète — aucun conflit de fichier. Après la fusion, supprimez les worktrees pour nettoyer.',
    },

    // === INTERACTIF : DIAGRAMME CYCLE DE VIE WORKTREE ===
    {
      type: 'interactive-diagram',
      title: 'Cycle de vie du worktree (étape par étape)',
      body: 'Parcourez chaque phase du cycle de vie du worktree pour comprendre ce qui se passe à chaque étape.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'create', label: 'Créer', shape: 'rounded' },
          { id: 'branch', label: 'Brancher' },
          { id: 'work', label: 'Travailler' },
          { id: 'test', label: 'Tester' },
          { id: 'merge', label: 'Fusionner' },
          { id: 'cleanup', label: 'Nettoyer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'create', to: 'branch' },
          { from: 'branch', to: 'work' },
          { from: 'work', to: 'test' },
          { from: 'test', to: 'merge' },
          { from: 'merge', to: 'cleanup' },
        ],
      },
      stages: [
        { highlightNodes: ['create'], explanation: 'Exécutez `git worktree add ../agent-dir -b feat/task` pour créer un répertoire isolé avec sa propre branche. Prend des millisecondes.' },
        { highlightNodes: ['create', 'branch'], highlightEdges: [{ from: 'create', to: 'branch' }], explanation: 'Le nouveau worktree extrait une branche fraîche depuis votre HEAD actuel. L\'agent a maintenant son propre bac à sable de fichiers.' },
        { highlightNodes: ['branch', 'work'], highlightEdges: [{ from: 'branch', to: 'work' }], explanation: 'L\'agent travaille librement dans son worktree — modification, création, suppression de fichiers. Aucun autre agent n\'est affecté.' },
        { highlightNodes: ['work', 'test'], highlightEdges: [{ from: 'work', to: 'test' }], explanation: 'Exécutez les tests dans le worktree pour vérifier le travail de l\'agent avant la fusion. Détectez les problèmes tôt.' },
        { highlightNodes: ['test', 'merge'], highlightEdges: [{ from: 'test', to: 'merge' }], explanation: 'Revenez au dépôt principal et faites `git merge feat/task`. Si la propriété des fichiers était exclusive, ça fusionne proprement.' },
        { highlightNodes: ['merge', 'cleanup'], highlightEdges: [{ from: 'merge', to: 'cleanup' }], explanation: 'Exécutez `git worktree remove ../agent-dir` et `git branch -d feat/task`. Ardoise propre pour la prochaine exécution.' },
      ],
    },

    // === ANTI-PATRONS ===
    {
      type: 'info',
      title: 'Erreurs courantes à éviter',
      body: "Trois pièges font trébucher les gens. Premier : extraire la même branche dans deux worktrees. Git ne vous laissera pas faire — chaque branche ne peut être extraite que dans un seul worktree à la fois. Deuxième : oublier de commiter dans le worktree avant de passer au dépôt principal pour la fusion. Le travail non commité reste dans le worktree — il n'apparaît pas magiquement dans main. Troisième : laisser les worktrees traîner pendant des semaines. Ils dérivent de main et les conflits s'accumulent. Créer, travailler, fusionner, nettoyer — le même jour si possible.",
    },
    {
      type: 'multiple-choice',
      question: 'Que se passe-t-il si vous essayez d\'extraire la même branche dans deux worktrees ?',
      options: [
        'Ça fonctionne — les deux worktrees partagent la branche',
        'Git crée une copie de la branche',
        'Git refuse et affiche une erreur',
        'Le deuxième worktree devient en lecture seule',
      ],
      correctIndex: 2,
      explanation: 'Git impose que chaque branche ne peut être extraite que dans un seul worktree à la fois. Cela empêche deux worktrees de faire des changements contradictoires à la même référence de branche.',
    },

    // === CHECKLIST ===
    {
      type: 'checklist',
      title: 'Liste de vérification du workflow worktree :',
      items: [
        'Je peux créer des worktrees avec git worktree add',
        'Je sais que chaque agent a besoin de son propre répertoire worktree',
        'Je comprends que les worktrees partagent .git mais ont des fichiers séparés',
        'Je fusionne la branche la plus indépendante en premier',
        'Je peux résoudre les conflits quand les agents touchent le même fichier',
        'Je nettoie les worktrees et branches après la fusion',
        'Je sais qu\'une branche ne peut pas être extraite dans deux worktrees',
      ],
    },
    {
      type: 'checkpoint',
      xp: 17,
      message: 'Maîtrise des worktrees complète ! Vous pouvez maintenant exécuter des agents en vrai isolement parallèle.',
    },
  ],
}

export default content
