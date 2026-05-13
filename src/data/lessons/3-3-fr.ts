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
      type: 'interactive-diagram',
      title: 'Isolation par worktree',
      body: 'Trois agents travaillent dans des worktrees séparés sur des branches séparées. Parcourez pour voir comment l\'isolation fonctionne.',
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
      stages: [
        {
          highlightNodes: ['repo'],
          explanation: 'Votre dépôt principal est sur la branche main. C\'est là que le code fusionné final vit.',
        },
        {
          highlightNodes: ['repo', 'wt-a', 'wt-b', 'wt-c'],
          highlightEdges: [{ from: 'repo', to: 'wt-a' }, { from: 'repo', to: 'wt-b' }, { from: 'repo', to: 'wt-c' }],
          explanation: 'Chaque agent obtient son propre répertoire worktree avec sa propre branche. Ils partagent la base de données .git mais ont des systèmes de fichiers complètement séparés. Aucun conflit pendant le travail.',
        },
        {
          highlightNodes: ['wt-a', 'wt-b', 'wt-c', 'merge'],
          highlightEdges: [{ from: 'wt-a', to: 'merge' }, { from: 'wt-b', to: 'merge' }, { from: 'wt-c', to: 'merge' }],
          explanation: 'Quand les agents ont fini, fusionnez leurs branches vers main. Les conflits n\'arrivent qu\'au moment de la fusion — et avec une bonne propriété des fichiers, ils sont rares.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Vous voyez l\'architecture !',
    },

    // === WHAT IS A WORKTREE ===
    {
      type: 'compare',
      title: 'Worktree vs Clone',
      body: 'Deux façons de donner aux agents des répertoires de travail séparés. L\'un est léger et rapide, l\'autre est lourd et lent.',
      question: 'Quelle approche est meilleure pour des agents parallèles travaillant sur le même projet ?',
      correctSide: 'left',
      left: {
        label: 'Git Worktree',
        content: "git worktree add ../agent-auth -b feat/auth\n\n- Millisecondes pour créer\n- Partage l'historique .git avec le dépôt principal\n- Branches visibles dans tous les worktrees\n- Fusion locale (même dépôt)\n- Léger : pas de données dupliquées\n- Un seul remote à push/pull",
      },
      right: {
        label: 'Git Clone',
        content: "git clone repo-url ../agent-auth-clone\n\n- Minutes pour créer (copie complète)\n- Historique .git séparé par clone\n- Branches NON partagées entre clones\n- Doit push/pull pour coordonner\n- Lourd : copie complète du dépôt à chaque fois\n- Multiples remotes à gérer",
      },
      explanation: 'Les worktrees partagent tout en coulisses — commits, branches, historique, remotes. Ils sont légers (millisecondes pour créer) et les branches locales sont immédiatement visibles dans tous les worktrees. Les clones dupliquent tout et nécessitent push/pull pour coordonner.',
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
      type: 'multiple-choice',
      question: 'Les worktrees Git se résument à quatre commandes. Quelle commande crée un nouveau worktree avec une nouvelle branche ?',
      options: [
        'git worktree list -b <branche>',
        'git worktree add <chemin> -b <branche>',
        'git branch <branche> && git checkout <branche>',
        'git worktree create <chemin> <branche>',
      ],
      correctIndex: 1,
      explanation: 'git worktree add crée un nouveau répertoire et extrait une branche dedans. Le flag -b crée une nouvelle branche. Les quatre commandes sont : add (créer), list (voir tout), remove (nettoyer), et prune (supprimer les références périmées).',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ces commandes git worktree pour créer des espaces de travail pour les agents :',
      language: 'bash',
      filename: 'terminal',
      template: '# Create a worktree with a new branch\ngit worktree {{addCmd}} ../project-auth -b {{authBranch}}\n\n# Create a worktree for an existing branch\ngit worktree {{addCmd}} ../project-api {{apiBranch}}\n\n# Result: ../project-auth/ is now a full working directory\n# on the {{authBranch}} branch, ready for an agent',
      blanks: [
        { id: 'addCmd', answer: 'add', alternatives: [], placeholder: 'quelle sous-commande ?', hint: 'La sous-commande git worktree qui crée un nouveau worktree' },
        { id: 'authBranch', answer: 'feat/auth', alternatives: ['feature/auth', 'auth'], placeholder: 'nom de branche ?', hint: 'Une branche de fonctionnalité pour le travail auth' },
        { id: 'apiBranch', answer: 'feat/api', alternatives: ['feature/api', 'api'], placeholder: 'branche existante ?', hint: 'Une branche de fonctionnalité pour le travail API' },
      ],
      explanation: 'git worktree add est la commande principale. Avec -b elle crée une nouvelle branche. Sans -b elle extrait une branche existante. Chaque worktree obtient son propre répertoire qui est une copie de travail complète.',
    },
    {
      type: 'terminal',
      instruction: 'Créez un nouveau worktree à ../wt-auth sur une branche appelée feat/auth :',
      expectedCommand: 'git worktree add ../wt-auth -b feat/auth',
      hint: 'Utilisez git worktree add <chemin> -b <nom-nouvelle-branche>',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ces commandes de gestion de worktrees :',
      language: 'bash',
      filename: 'terminal',
      template: '# List all worktrees\ngit worktree {{listCmd}}\n\n# Remove a worktree after merging\ngit worktree {{removeCmd}} ../project-auth\n\n# Clean up stale references\ngit worktree {{pruneCmd}}',
      blanks: [
        { id: 'listCmd', answer: 'list', alternatives: [], placeholder: 'quelle commande ?', hint: 'Voir tous les worktrees actifs' },
        { id: 'removeCmd', answer: 'remove', alternatives: ['rm'], placeholder: 'quelle commande ?', hint: 'Nettoyer un répertoire worktree' },
        { id: 'pruneCmd', answer: 'prune', alternatives: [], placeholder: 'quelle commande ?', hint: 'Supprimer les références de worktree périmées' },
      ],
      explanation: 'list montre tous les worktrees actifs avec leurs branches. remove supprime le répertoire worktree et le délie. prune nettoie les références aux worktrees supprimés manuellement.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Commandes de base maîtrisées !',
    },

    // === DIAGRAM 2: WORKTREE LIFECYCLE ===
    {
      type: 'interactive-diagram',
      title: 'Cycle de vie d\'un worktree',
      body: 'Chaque worktree suit ce cycle de vie. Parcourez chaque phase.',
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
        {
          highlightNodes: ['create', 'branch'],
          highlightEdges: [{ from: 'create', to: 'branch' }],
          explanation: 'Créer : exécutez git worktree add pour créer un répertoire isolé avec sa propre branche. Prend des millisecondes. L\'agent a maintenant son propre bac à sable de fichiers.',
        },
        {
          highlightNodes: ['branch', 'work'],
          highlightEdges: [{ from: 'branch', to: 'work' }],
          explanation: 'Travailler : l\'agent travaille librement dans son worktree — modification, création, suppression de fichiers. Aucun autre agent n\'est affecté. Isolation complète.',
        },
        {
          highlightNodes: ['work', 'test'],
          highlightEdges: [{ from: 'work', to: 'test' }],
          explanation: 'Tester : exécutez les tests dans le worktree pour vérifier le travail de l\'agent avant la fusion. Détectez les problèmes tôt pendant que le contexte est frais.',
        },
        {
          highlightNodes: ['test', 'merge'],
          highlightEdges: [{ from: 'test', to: 'merge' }],
          explanation: 'Fusionner : revenez au dépôt principal et faites git merge de la branche de fonctionnalité. Si la propriété des fichiers était exclusive, ça fusionne proprement.',
        },
        {
          highlightNodes: ['merge', 'cleanup'],
          highlightEdges: [{ from: 'merge', to: 'cleanup' }],
          explanation: 'Nettoyer : exécutez git worktree remove et git branch -d pour nettoyer. Retour à un état vierge pour la prochaine exécution.',
        },
      ],
    },

    // === PRACTICAL SETUP ===
    {
      type: 'multiple-choice',
      question: 'Vous avez une fonctionnalité qui se divise en trois tâches indépendantes : auth, API et UI. Où chaque agent devrait-il travailler ?',
      options: [
        'Les trois agents travaillent dans le répertoire du dépôt principal sur différentes branches',
        'Chaque agent travaille dans son propre répertoire worktree, jamais dans le dépôt principal',
        'Le premier agent travaille dans le dépôt principal, les autres dans des worktrees',
        'Chaque agent clone le dépôt dans un répertoire séparé',
      ],
      correctIndex: 1,
      explanation: 'Chaque agent travaille dans un répertoire worktree séparé sur sa propre branche. Jamais dans le répertoire du dépôt principal. Cela assure une isolation complète des fichiers — aucun agent ne peut écraser le travail d\'un autre.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez cette configuration parallèle complète pour trois agents avec des worktrees :',
      language: 'bash',
      filename: 'terminal',
      template: '# From your main repo directory\ngit worktree add ../myapp-auth -b {{authBranch}}\ngit worktree add ../myapp-api  -b {{apiBranch}}\ngit worktree add ../myapp-ui   -b {{uiBranch}}\n\n# Launch agents in separate terminals\n# Terminal 1:\ncd ../myapp-auth && claude "{{authTask}}"\n\n# Terminal 2:\ncd ../myapp-api && claude "Add CRUD endpoints for users"',
      blanks: [
        { id: 'authBranch', answer: 'feat/auth', alternatives: ['feature/auth'], placeholder: 'nom de branche ?', hint: 'Branche de fonctionnalité pour le travail auth' },
        { id: 'apiBranch', answer: 'feat/api', alternatives: ['feature/api'], placeholder: 'nom de branche ?', hint: 'Branche de fonctionnalité pour le travail API' },
        { id: 'uiBranch', answer: 'feat/ui', alternatives: ['feature/ui'], placeholder: 'nom de branche ?', hint: 'Branche de fonctionnalité pour le travail UI' },
        { id: 'authTask', answer: 'Implement JWT auth middleware', alternatives: ['Build JWT auth', 'Implement auth middleware', 'Build authentication'], placeholder: 'tâche de l\'agent ?', hint: 'Une tâche en une phrase pour l\'agent auth' },
      ],
      explanation: 'Trois worktrees, trois branches, trois agents. Chaque agent a une isolation complète. Le patron de commande clé : git worktree add <répertoire> -b <branche>, puis cd dans le répertoire et lancer l\'agent.',
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
      type: 'multiple-choice',
      question: 'Les trois agents ont fini. Vous devez fusionner leurs branches vers main. Que devriez-vous fusionner EN PREMIER ?',
      options: [
        'La plus grosse branche (le plus de changements)',
        'La branche la plus indépendante (le moins de dépendances)',
        'La branche qui a fini en premier',
        'Ça n\'a pas d\'importance — l\'ordre est sans importance',
      ],
      correctIndex: 1,
      explanation: 'Commencez par la branche qui a zéro dépendance envers les autres — généralement la fonctionnalité la plus isolée. Puis fusionnez la suivante, en résolvant contre le main mis à jour. Enfin, fusionnez la branche la plus susceptible de toucher du code partagé en dernier.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez cette stratégie de fusion séquentielle — auth en premier (indépendant), puis api, puis ui :',
      language: 'bash',
      filename: 'terminal',
      template: '# Back in your main repo directory\n\n# Step 1: Merge auth (no dependencies)\ngit {{mergeCmd}} feat/auth\n# Clean merge — auth is fully independent\n\n# Step 2: Merge api\ngit {{mergeCmd}} feat/api\n# Clean merge — api didn\'t touch auth files\n\n# Step 3: Merge ui (may conflict if it imports api types)\ngit {{mergeCmd}} {{uiBranch}}\n# If conflicts arise, resolve them here',
      blanks: [
        { id: 'mergeCmd', answer: 'merge', alternatives: [], placeholder: 'quelle commande ?', hint: 'La commande git qui combine les branches' },
        { id: 'uiBranch', answer: 'feat/ui', alternatives: ['feature/ui'], placeholder: 'quelle branche ?', hint: 'La branche de fonctionnalité UI' },
      ],
      explanation: 'Fusionnez la branche la plus indépendante d\'abord, puis progressez vers les branches avec plus de dépendances. Ainsi, les conflits sont concentrés dans la fusion finale où vous pouvez tous les gérer en une fois.',
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
      type: 'interactive-diagram',
      title: 'Stratégie de branches',
      body: 'Les branches de fonctionnalité divergent de main, sont révisées, et fusionnent à nouveau. Parcourez le workflow parallèle.',
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
      stages: [
        {
          highlightNodes: ['main-top'],
          highlightEdges: [{ from: 'main-top', to: 'auth' }, { from: 'main-top', to: 'api' }, { from: 'main-top', to: 'ui' }],
          explanation: 'Toutes les branches de fonctionnalité divergent du même point sur main. Chaque agent commence avec un code identique.',
        },
        {
          highlightNodes: ['auth', 'api', 'ui'],
          explanation: 'Les agents travaillent en parallèle sur leurs propres branches dans leurs propres worktrees. Isolation complète — aucune coordination nécessaire pendant la phase de travail.',
        },
        {
          highlightNodes: ['review'],
          highlightEdges: [{ from: 'auth', to: 'review' }, { from: 'api', to: 'review' }, { from: 'ui', to: 'review' }],
          explanation: 'Toutes les branches convergent pour la révision de PR. Vous vérifiez chaque branche indépendamment, puis fusionnez dans l\'ordre des dépendances.',
        },
        {
          highlightNodes: ['main-end'],
          highlightEdges: [{ from: 'review', to: 'main-end' }],
          explanation: 'Après révision et fusion, main a les trois fonctionnalités intégrées. Nettoyez les worktrees, supprimez les branches de fonctionnalité, terminé.',
        },
      ],
    },

    // === CONFLICT RESOLUTION ===
    {
      type: 'multiple-choice',
      question: 'Même avec l\'isolation par worktree, l\'agent 1 ajoute un nouvel export à src/index.ts et l\'agent 3 ajoute aussi un export à src/index.ts. Que se passe-t-il à la fusion ?',
      options: [
        'Git fusionne automatiquement les deux ajouts parfaitement',
        'Git peut signaler un conflit car les deux ont modifié le même fichier près des mêmes lignes',
        'La deuxième fusion écrase la première — des données sont perdues',
        'Les worktrees empêchent que cela arrive',
      ],
      correctIndex: 1,
      explanation: 'Même avec une isolation parfaite, des conflits peuvent survenir quand les agents modifient le même fichier. Git ne peut pas toujours auto-fusionner des changements adjacents. La solution est simple : garder les deux ajouts, supprimer les marqueurs de conflit, commiter. Les worktrees réduisent les conflits de « cauchemar constant » à « occasionnel et gérable ».',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez la résolution de conflit — gardez les deux exports de différents agents :',
      language: 'typescript',
      filename: 'src/index.ts',
      template: '// Git shows conflict markers in the file:\n// <<<<<<< HEAD\n// export { AuthService } from \'./auth\'\n// =======\n// export { UserSettings } from \'./settings\'\n// >>>>>>> feat/ui\n\n// Resolution: keep {{resolution}}\nexport { {{export1}} } from \'./auth\'\nexport { {{export2}} } from \'./settings\'',
      blanks: [
        { id: 'resolution', answer: 'both exports', alternatives: ['both', 'both additions', 'both lines', 'les deux exports', 'les deux'], placeholder: 'garder quoi ?', hint: 'Les deux agents ont ajouté du code valide — gardez tout' },
        { id: 'export1', answer: 'AuthService', alternatives: ['authService'], placeholder: 'premier export ?', hint: 'L\'export ajouté par l\'agent auth' },
        { id: 'export2', answer: 'UserSettings', alternatives: ['userSettings'], placeholder: 'deuxième export ?', hint: 'L\'export ajouté par l\'agent UI' },
      ],
      explanation: 'Quand les agents ajoutent du code non chevauchant au même fichier, la solution est presque toujours de garder les deux ajouts. Supprimez les marqueurs <<<, === et >>>, gardez les deux exports, et commitez la fusion.',
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
      type: 'multiple-choice',
      question: 'Après avoir fusionné toutes les branches, vous avez trois répertoires worktree encore sur le disque. Que devriez-vous faire ?',
      options: [
        'Les laisser — ils pourraient être utiles plus tard',
        'Supprimer les répertoires manuellement avec rm -rf',
        'Exécuter git worktree remove pour chacun, puis git branch -d pour supprimer les branches fusionnées',
        'Exécuter git worktree prune pour tout supprimer d\'un coup',
      ],
      correctIndex: 2,
      explanation: 'Nettoyage propre : git worktree remove pour chaque répertoire (le délie de git), puis git branch -d pour chaque branche fusionnée. Ça vous laisse dans un état propre. Les worktrees restants dérivent de main et accumulent des conflits.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez la séquence de nettoyage complète après la fusion :',
      language: 'bash',
      filename: 'terminal',
      template: '# Remove worktrees\ngit worktree {{removeCmd}} ../myapp-auth\ngit worktree {{removeCmd}} ../myapp-api\ngit worktree {{removeCmd}} ../myapp-ui\n\n# Delete merged branches\ngit branch {{deleteFlag}} feat/auth\ngit branch {{deleteFlag}} feat/api\ngit branch {{deleteFlag}} feat/ui\n\n# Verify clean state\ngit worktree {{verifyCmd}}',
      blanks: [
        { id: 'removeCmd', answer: 'remove', alternatives: ['rm'], placeholder: 'commande de nettoyage ?', hint: 'Supprimer le répertoire worktree' },
        { id: 'deleteFlag', answer: '-d', alternatives: ['--delete', '-D'], placeholder: 'quel flag ?', hint: 'Supprimer une branche fusionnée en sécurité' },
        { id: 'verifyCmd', answer: 'list', alternatives: [], placeholder: 'commande de vérification ?', hint: 'Lister tous les worktrees pour confirmer qu\'il ne reste que main' },
      ],
      explanation: 'Supprimez les worktrees d\'abord, puis supprimez les branches, puis vérifiez avec list. Le flag -d pour la suppression de branches est sûr — il ne supprime que les branches complètement fusionnées. Utilisez -D (majuscule) seulement pour forcer la suppression de branches non fusionnées.',
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
      type: 'multiple-choice',
      question: 'Que se passe-t-il si vous essayez d\'extraire la même branche dans deux worktrees ?',
      options: [
        'Ça fonctionne — les deux worktrees partagent la branche',
        'Git crée une copie de la branche',
        'Git refuse et affiche une erreur',
        'Le deuxième worktree devient en lecture seule',
      ],
      correctIndex: 2,
      explanation: 'Git impose que chaque branche ne peut être extraite que dans un seul worktree à la fois. Cela empêche deux worktrees de faire des changements contradictoires à la même référence de branche. Trois pièges à éviter : (1) même branche dans deux worktrees, (2) oublier de commiter avant la fusion, (3) laisser les worktrees traîner pendant des semaines.',
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
