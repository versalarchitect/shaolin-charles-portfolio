import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Les agents écrivent du code différemment',
      body: "Quand un humain écrit du code, il alterne entre lire, réfléchir et taper. Quand un agent IA écrit du code, il génère de gros diffs en quelques secondes — parfois à travers plusieurs fichiers à la fois. Cette vitesse est un superpouvoir, mais elle change la façon de gérer le contrôle de version. Les branches, les commits et les pull requests ont tous besoin de nouvelles conventions. Sans discipline, tu te retrouves avec des PR de 50 fichiers, des messages de commit vagues et des conflits de merge qui prennent des heures à démêler. Cette leçon te donne le workflow git qui rend les agents productifs sans créer le chaos.",
    },
    {
      type: 'info',
      title: 'Le principe fondamental : des unités petites et révisables',
      body: "La règle fondamentale de git avec les agents est la même que sans eux — juste plus importante. Garde les changements petits et focalisés. Une branche par fonctionnalité. Une préoccupation par commit. Un changement logique par PR. Les agents rendent tentant de tout laisser arriver d'un coup parce qu'ils sont rapides. Résiste à cette tentation. Une PR de 200 fichiers d'un agent est tout aussi impossible à réviser qu'une PR de 200 fichiers d'un humain. L'avantage de vitesse devrait servir à faire plus de petites PR, pas des plus grosses.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Fondamentaux de git pour agents établis !',
    },

    // === BRANCH STRATEGY ===
    {
      type: 'multiple-choice',
      question: 'Pourquoi devrais-tu créer une nouvelle branche pour CHAQUE tâche que tu donnes à un agent, même les petites ?',
      options: [
        'Les branches rendent les commandes git plus rapides',
        'Les branches donnent isolation, rollback et visibilité pour le travail de l\'agent',
        'Les agents ne peuvent pas committer sur la branche principale',
        'Plusieurs branches réduisent automatiquement les conflits de merge',
      ],
      correctIndex: 1,
      explanation: 'Les branches sont pas chères mais fournissent trois avantages critiques : isolation (les changements de l\'agent restent séparés de main), rollback (supprime la branche si l\'agent déraille), et visibilité (tu vois tout le travail de l\'agent dans ta liste de branches). Nomme les branches de façon descriptive : feat/add-auth-flow, fix/pagination-off-by-one.',
    },
    {
      type: 'terminal',
      instruction: 'Crée une nouvelle branche de fonctionnalité pour une tâche d\'agent :',
      expectedCommand: 'git checkout -b feat/add-user-settings',
      hint: 'Utilise git checkout -b suivi du nom de la branche',
    },
    {
      type: 'interactive-diagram',
      title: 'Workflow de branches agent',
      body: 'Clique sur chaque étape pour voir comment les branches d\'agents circulent de la création à la révision jusqu\'au merge.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'main', label: 'main', sublabel: 'Protégée', shape: 'pill', highlight: true },
          { id: 'feat1', label: 'feat/auth', sublabel: 'Agent 1', shape: 'rect' },
          { id: 'feat2', label: 'feat/settings', sublabel: 'Agent 2', shape: 'rect' },
          { id: 'feat3', label: 'fix/pagination', sublabel: 'Agent 3', shape: 'rect' },
          { id: 'review', label: 'Révision PR', sublabel: 'Porte humaine', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'main', to: 'feat1', label: 'branche' },
          { from: 'main', to: 'feat2', label: 'branche' },
          { from: 'main', to: 'feat3', label: 'branche' },
          { from: 'feat1', to: 'review' },
          { from: 'feat2', to: 'review' },
          { from: 'feat3', to: 'review' },
          { from: 'review', to: 'main', label: 'merge' },
        ],
      },
      stages: [
        {
          highlightNodes: ['main'],
          highlightEdges: [],
          explanation: 'Main est la branche protégée. Aucun agent — et aucun humain — ne pousse directement ici. Tous les changements passent par des pull requests révisées.',
        },
        {
          highlightNodes: ['main', 'feat1', 'feat2', 'feat3'],
          highlightEdges: [{ from: 'main', to: 'feat1' }, { from: 'main', to: 'feat2' }, { from: 'main', to: 'feat3' }],
          explanation: 'Chaque tâche d\'agent a sa propre branche. Plusieurs agents travaillent en parallèle sans interférer. Nomme les branches avec des préfixes comme feat/, fix/, refactor/.',
        },
        {
          highlightNodes: ['feat1', 'feat2', 'feat3', 'review'],
          highlightEdges: [{ from: 'feat1', to: 'review' }, { from: 'feat2', to: 'review' }, { from: 'feat3', to: 'review' }],
          explanation: 'Les agents poussent leurs branches et ouvrent des PR. Chaque changement passe par la porte de révision humaine — vérifiant les erreurs de logique, les problèmes de sécurité et le scope creep.',
        },
        {
          highlightNodes: ['review', 'main'],
          highlightEdges: [{ from: 'review', to: 'main' }],
          explanation: 'Après révision et approbation, les changements sont mergés dans main. L\'humain garde le contrôle de ce qui part en production.',
        },
      ],
    },

    // === INTERACTIF : COMPARE, CODE-FILL, INTERACTIVE-DIAGRAM ===
    {
      type: 'compare',
      title: 'PR focalisée vs méga PR',
      body: 'La taille de ta pull request affecte directement la qualité de la révision.',
      question: 'Quelle PR est plus facile à réviser et plus sûre à merger ?',
      correctSide: 'left',
      left: {
        label: 'Focalisée (3 fichiers)',
        content: 'feat: add email validation to signup form\n\nChanged:\n- src/lib/validation.ts (new function)\n- src/components/signup-form.tsx (use validator)\n- src/components/signup-form.test.tsx (3 tests)\n\nReview time: ~5 minutes\nRisk: Low — isolated change',
        language: 'text',
      },
      right: {
        label: 'Méga (47 fichiers)',
        content: 'feat: add auth, dashboard, settings, and API\n\nChanged:\n- 47 files across 12 directories\n- New auth system + session management\n- Dashboard with 8 widgets\n- Settings page with 5 forms\n- 14 new API routes\n\nReview time: ~2 hours\nRisk: High — impossible to review thoroughly',
        language: 'text',
      },
      explanation: 'Les petites PR focalisées reçoivent des révisions approfondies. Les méga PR sont tamponnées parce que personne n\'a le temps de réviser 47 fichiers attentivement. Les bugs se cachent dans les parties que personne ne lit.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète les commandes git en utilisant le nommage conventionnel de branches et le format de commit :',
      language: 'shell',
      template: 'git checkout -b {{branch_type}}/{{branch_name}}\n\n# ... make changes ...\n\ngit add src/lib/validation.ts\ngit commit -m "{{commit_type}}: {{commit_desc}}"',
      blanks: [
        { id: 'branch_type', answer: 'feat', alternatives: ['feature'], placeholder: 'préfixe de branche ?', hint: 'Type de travail : feat, fix, refactor' },
        { id: 'branch_name', answer: 'add-email-validation', alternatives: ['email-validation', 'add-validation'], placeholder: 'description de branche ?', hint: 'Description en kebab-case du changement' },
        { id: 'commit_type', answer: 'feat', alternatives: ['feature'], placeholder: 'type de commit ?' },
        { id: 'commit_desc', answer: 'add email validation to signup form', placeholder: 'qu\'est-ce qui a changé ?', hint: 'Description courte commençant par un verbe' },
      ],
      explanation: 'Les noms de branches conventionnels (feat/, fix/, refactor/) et les types de commit rendent l\'historique git scannable. L\'agent suit ces patterns quand il les voit dans CLAUDE.md.',
    },
    {
      type: 'interactive-diagram',
      title: 'Workflow de branches agent — étape par étape',
      body: 'Parcours comment plusieurs agents travaillent sur des branches séparées, avec une porte de révision humaine avant de merger dans main.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'main', label: 'main', sublabel: 'Protégée', shape: 'pill', highlight: true },
          { id: 'feat1', label: 'feat/auth', sublabel: 'Agent 1', shape: 'rect' },
          { id: 'feat2', label: 'feat/settings', sublabel: 'Agent 2', shape: 'rect' },
          { id: 'feat3', label: 'fix/pagination', sublabel: 'Agent 3', shape: 'rect' },
          { id: 'review', label: 'Révision PR', sublabel: 'Porte humaine', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'main', to: 'feat1', label: 'branche' },
          { from: 'main', to: 'feat2', label: 'branche' },
          { from: 'main', to: 'feat3', label: 'branche' },
          { from: 'feat1', to: 'review' },
          { from: 'feat2', to: 'review' },
          { from: 'feat3', to: 'review' },
          { from: 'review', to: 'main', label: 'merge' },
        ],
      },
      stages: [
        {
          highlightNodes: ['main'],
          highlightEdges: [],
          explanation: 'On part de la branche main protégée. Personne — humain ou agent — ne pousse directement ici.',
        },
        {
          highlightNodes: ['main', 'feat1', 'feat2', 'feat3'],
          highlightEdges: [{ from: 'main', to: 'feat1' }, { from: 'main', to: 'feat2' }, { from: 'main', to: 'feat3' }],
          explanation: 'Chaque tâche d\'agent a sa propre branche. Plusieurs agents travaillent en parallèle sans interférer entre eux.',
        },
        {
          highlightNodes: ['feat1', 'feat2', 'feat3', 'review'],
          highlightEdges: [{ from: 'feat1', to: 'review' }, { from: 'feat2', to: 'review' }, { from: 'feat3', to: 'review' }],
          explanation: 'Les agents poussent leurs branches et ouvrent des PR. Chaque changement doit passer par la porte de révision humaine.',
        },
        {
          highlightNodes: ['review', 'main'],
          highlightEdges: [{ from: 'review', to: 'main' }],
          explanation: 'Après révision et approbation, les changements sont mergés dans main. L\'humain garde le contrôle de ce qui est livré.',
        },
      ],
    },

    // === COMMIT HYGIENE ===
    {
      type: 'compare',
      title: 'Mauvais vs bons messages de commit d\'agent',
      body: 'Le message de commit est ton seul contexte des semaines plus tard pour comprendre pourquoi l\'agent a fait un choix.',
      question: 'Quel style donne aux réviseurs le contexte dont ils ont besoin ?',
      correctSide: 'right',
      left: {
        label: 'Mauvais (ne dit rien)',
        content: "git commit -m \"update auth\"\ngit commit -m \"fix bug\"\ngit commit -m \"changes from Claude\"\ngit commit -m \"update files\"\n\n→ Quoi a été mis à jour ? Quel bug ?\n→ Pas de scope, pas d'intention, pas de contexte\n→ Inutile en révision des semaines plus tard\n→ Impossible de git bisect efficacement",
        language: 'text',
      },
      right: {
        label: 'Bon (explique l\'intention)',
        content: "git commit -m \"feat(auth): add refresh\n  token rotation to prevent session\n  hijacking\"\ngit commit -m \"fix(api): handle null\n  response from payments webhook\"\ngit commit -m \"refactor(db): extract\n  query builder to reduce duplication\"\n\n→ Type + scope + pourquoi\n→ Format commit conventionnel\n→ Contexte révisable des semaines plus tard",
        language: 'text',
      },
      explanation: 'Les bons messages de commit utilisent le format conventionnel (type(scope): description), expliquent POURQUOI le changement existe (pas ce qui a changé — le diff le montre), et incluent un trailer Co-Authored-By pour l\'agent. N\'accepte jamais de messages vagues des agents.',
    },
    {
      type: 'multiple-choice',
      question: 'Quel message de commit suit le mieux les conventions pour du code généré par agent ?',
      options: [
        '"Updated several files across the project"',
        '"fix(cart): prevent negative quantities by clamping to minimum of 1"',
        '"Claude made some changes to the cart"',
        '"Changes"',
      ],
      correctIndex: 1,
      explanation: 'Un commit conventionnel avec un scope, une description claire de ce qui a été corrigé, et le raisonnement (empêcher les quantités négatives) donne aux réviseurs le contexte complet. Le diff montre le code — le message explique l\'intention.',
    },

    // === REVIEWING AGENT PRs ===
    {
      type: 'match',
      instruction: 'En révisant les PR d\'agents, associe chaque point d\'attention à ce que tu cherches :',
      leftItems: [
        'Erreurs de logique',
        'Sur-ingénierie',
        'Problèmes de sécurité',
        'Dépassement de scope',
      ],
      rightItems: [
        'Bugs que l\'agent ne peut pas détecter sans exécuter le code',
        'Abstractions prématurées et complexité inutile',
        'Secrets exposés, vérifications d\'auth manquantes, injection SQL',
        'Changements sur des fichiers en dehors de la tâche assignée',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Les PR d\'agents ont besoin de la même rigueur que les PR humaines mais avec un focus différent. Les agents ont rarement des problèmes de style (ils suivent les linters). Concentre-toi sur les erreurs de logique, la sur-ingénierie, la sécurité et le dépassement de scope. Survole vite, plonge dans la logique métier.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ces commandes git pour réviser efficacement une PR d\'agent. Périmètre d\'abord, puis détails :',
      language: 'bash',
      filename: 'review-workflow.sh',
      template: "# Voir tous les fichiers changés dans la branche PR\ngit diff {{stat_flag}} main...HEAD\n\n# Réviser les changements dans un répertoire spécifique\ngit diff main...HEAD -- src/auth/\n\n# Vérifier si l'agent a touché des fichiers hors périmètre\ngit diff {{names_flag}} main...HEAD | grep -v '^src/auth/'\n\n# Réviser avec GitHub CLI\ngh pr {{review_cmd}} 42",
      blanks: [
        { id: 'stat_flag', answer: '--stat', alternatives: ['--stats'], placeholder: 'flag résumé ?', hint: 'Le flag git diff qui montre un résumé des fichiers changés et lignes ajoutées/supprimées' },
        { id: 'names_flag', answer: '--name-only', alternatives: ['--names-only', '--nameonly'], placeholder: 'flag noms de fichiers ?', hint: 'Le flag git diff qui montre uniquement les noms de fichiers, pas les changements' },
        { id: 'review_cmd', answer: 'diff', alternatives: ['review'], placeholder: 'gh pr ___ ?', hint: 'La sous-commande gh pr qui montre le diff de la PR' },
      ],
      explanation: 'Utilise --stat pour un résumé de haut niveau des changements, --name-only pour vérifier le périmètre (l\'agent a-t-il touché des fichiers hors de sa tâche ?), et gh pr diff pour réviser la PR complète. Une révision efficace signifie périmètre d\'abord, puis plongée dans la logique métier.',
    },
    {
      type: 'multiple-choice',
      question: 'En révisant une PR d\'agent, sur quoi devrais-tu te concentrer le plus ?',
      options: [
        'Le formatage du code et la cohérence du style',
        'Les conventions de nommage des variables',
        'Les erreurs de logique, les cas limites manquants et les problèmes de sécurité',
        'La qualité des commentaires et la documentation',
      ],
      correctIndex: 2,
      explanation: 'Les agents suivent bien les linters et les guides de style. Ils ont rarement des problèmes de formatage. Mais ils peuvent rater des erreurs de logique (ils ne peuvent pas exécuter le code dans leur tête), sauter des cas limites et parfois introduire des failles de sécurité. Concentre ton énergie de révision là-dessus.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Workflow de révision de PR verrouillé !',
    },

    // === MERGE CONFLICTS ===
    {
      type: 'multiple-choice',
      question: 'Quand une branche d\'agent a des conflits de merge, que devrais-tu faire ?',
      options: [
        'Demander à l\'agent de résoudre les conflits automatiquement',
        'Réviser les deux côtés toi-même, décider la résolution, puis laisser l\'agent l\'implémenter',
        'Supprimer la branche et recommencer de zéro',
        'Force-push la branche de l\'agent pour écraser main',
      ],
      correctIndex: 1,
      explanation: 'Ne demande jamais à un agent de résoudre les conflits à l\'aveugle — il n\'a pas le contexte de ce que l\'autre branche voulait. Révise les deux côtés, décide toi-même la bonne résolution, puis laisse l\'agent l\'implémenter. La prévention est meilleure : pull le dernier main avant de commencer, et garde les branches d\'agents de courte durée.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète le workflow de résolution de conflits. Rebase la branche d\'agent sur le dernier main :',
      language: 'bash',
      filename: 'resolve-conflicts.sh',
      template: "# Mettre à jour main d'abord\ngit checkout main && git pull\n\n# Basculer sur la branche agent et rebaser\ngit checkout {{branch_name}}\ngit {{rebase_cmd}} main\n\n# Si des conflits apparaissent :\n# 1. Ouvrir les fichiers en conflit\n# 2. Comprendre les DEUX côtés\n# 3. Résoudre manuellement\ngit add <fichiers-résolus>\ngit rebase {{continue_flag}}\n\n# Si trop compliqué, annuler et merger à la place\ngit rebase --abort\ngit merge main",
      blanks: [
        { id: 'branch_name', answer: 'feat/add-auth', alternatives: ['feat/auth'], placeholder: 'nom de branche ?', hint: 'La branche de fonctionnalité sur laquelle l\'agent travaillait' },
        { id: 'rebase_cmd', answer: 'rebase', placeholder: 'commande de replay ?', hint: 'La commande git qui rejoue tes commits par-dessus une autre branche' },
        { id: 'continue_flag', answer: '--continue', placeholder: 'flag de reprise ?', hint: 'Le flag de rebase qui continue après la résolution d\'un conflit' },
      ],
      explanation: 'D\'abord mettre à jour main avec git pull. Basculer sur la branche agent et rebaser sur main. Résoudre les conflits manuellement (jamais à l\'aveugle), puis git rebase --continue. Si le rebase est trop compliqué, annuler et utiliser git merge à la place.',
    },
    {
      type: 'terminal',
      instruction: 'Voir quels fichiers ont des conflits de merge après un rebase :',
      expectedCommand: 'git diff --name-only --diff-filter=U',
      hint: 'Utilise git diff avec --name-only et filtre pour les fichiers non-mergés (U)',
    },

    // === GIT WORKTREES ===
    {
      type: 'code-fill',
      instruction: 'Mets en place des git worktrees pour le travail d\'agents en parallèle. Chaque worktree crée un répertoire de travail séparé lié au même repo :',
      language: 'bash',
      filename: 'worktree-setup.sh',
      template: "# Créer un worktree pour une branche de fonctionnalité\ngit worktree {{add_cmd}} ../project-feat-auth feat/add-auth\n\n# Créer un autre worktree pour une autre tâche\ngit worktree {{add_cmd}} ../project-fix-pagination fix/pagination\n\n# Lister tous les worktrees actifs\ngit worktree {{list_cmd}}\n\n# Chaque agent travaille dans son propre répertoire — pas d'interférence\n# Agent 1: cd ../project-feat-auth && claude\n# Agent 2: cd ../project-fix-pagination && claude\n\n# Quand c'est fini, nettoyer\ngit worktree {{remove_cmd}} ../project-feat-auth",
      blanks: [
        { id: 'add_cmd', answer: 'add', placeholder: 'sous-commande de création ?', hint: 'La sous-commande git worktree qui crée un nouveau répertoire worktree' },
        { id: 'list_cmd', answer: 'list', placeholder: 'sous-commande d\'affichage ?', hint: 'La sous-commande git worktree qui montre tous les worktrees actifs' },
        { id: 'remove_cmd', answer: 'remove', placeholder: 'sous-commande de nettoyage ?', hint: 'La sous-commande git worktree qui supprime un worktree quand tu as fini' },
      ],
      explanation: 'Les git worktrees créent des répertoires de travail séparés liés au même dépôt. Utilise "add" pour créer, "list" pour voir tous les worktrees actifs, et "remove" pour nettoyer. Chaque agent a son propre répertoire et branche — pas de stash, pas de changement de contexte.',
    },
    {
      type: 'multiple-choice',
      question: 'Quel problème les git worktrees résolvent-ils pour les workflows d\'agents en parallèle ?',
      options: [
        'Ils rendent les commandes git plus rapides',
        'Ils permettent à plusieurs agents de travailler sur différentes branches simultanément sans conflits',
        'Ils résolvent automatiquement les conflits de merge',
        'Ils compressent le dépôt pour économiser de l\'espace disque',
      ],
      correctIndex: 1,
      explanation: 'Les worktrees créent des répertoires de travail séparés pour chaque branche. Plusieurs agents peuvent chacun avoir leur propre répertoire et branche — pas de stash, pas de changement de contexte, pas d\'interférence entre les tâches parallèles.',
    },

    // === BEST PRACTICES ===
    {
      type: 'multiple-choice',
      question: 'Laquelle est une règle NON NÉGOCIABLE de git avec les agents ?',
      options: [
        'Les agents devraient committer directement sur main pour gagner du temps',
        'Le force-push est acceptable si l\'agent est confiant',
        'Ne jamais laisser les agents pousser directement sur main — toujours utiliser une PR avec révision',
        'Les branches d\'agents devraient rester ouvertes des semaines pour accumuler les changements',
      ],
      correctIndex: 2,
      explanation: 'Les règles d\'or : 1) Jamais pousser directement sur main. 2) Jamais de force-push ni réécriture d\'historique. 3) Branches de courte durée. 4) Vérifier les builds et tests avant le merge. 5) Utiliser la protection de branche pour les faire respecter même quand pressé.',
    },
    {
      type: 'code-fill',
      instruction: 'Configure la protection de branche via GitHub CLI. Empêche les agents et les humains de contourner la révision :',
      language: 'bash',
      filename: 'branch-protection.sh',
      template: "# Configurer la protection de branche via GitHub CLI\ngh api repos/{owner}/{repo}/branches/main/protection -X PUT -f \\\n  required_pull_request_reviews.required_approving_review_count={{min_reviews}} \\\n  required_status_checks.strict=true \\\n  enforce_admins=true \\\n  allow_force_pushes={{force_push}} \\\n  allow_deletions=false\n\n# Résultat : personne ne peut push directement, force push ou skip la révision",
      blanks: [
        { id: 'min_reviews', answer: '1', alternatives: ['2'], placeholder: 'combien d\'approbations ?', hint: 'Le nombre minimum de révisions approuvatrices — au moins une personne doit réviser' },
        { id: 'force_push', answer: 'false', placeholder: 'autoriser le force push ?', hint: 'Le force push réécrit l\'historique et est une des violations des règles d\'or' },
      ],
      explanation: 'Exiger au moins 1 révision approuvatrice, appliquer des vérifications de statut strictes (le CI doit passer), et mettre allow_force_pushes à false. Ça garantit que personne — humain ou agent — ne peut contourner la révision, même pressé.',
    },

    // === WORKFLOW EXERCISE ===
    {
      type: 'order',
      instruction: 'Ordonne le workflow git complet d\'un agent du début à la fin :',
      items: [
        'L\'agent crée des commits avec des messages clairs',
        'L\'humain crée une branche de fonctionnalité',
        'L\'humain merge la PR après approbation',
        'L\'agent pousse la branche et ouvre une PR',
        'L\'humain révise le diff, vérifie la logique et la sécurité',
        'Le CI lance les tests et le linting sur la PR',
      ],
      correctOrder: [1, 0, 3, 5, 4, 2],
    },
    {
      type: 'terminal',
      instruction: 'Affiche un log compact des 10 derniers commits pour vérifier la qualité des commits de l\'agent :',
      expectedCommand: 'git log --oneline -10',
      hint: 'Utilise git log avec --oneline pour une sortie compacte et -10 pour limiter les résultats',
    },
    {
      type: 'code-input',
      instruction: 'Quelle commande git crée un nouveau worktree au chemin ../my-feature sur la branche feat/login ?',
      placeholder: 'git worktree ...',
      answer: 'git worktree add ../my-feature feat/login',
      hint: 'Utilise git worktree add suivi du chemin et du nom de branche',
    },

    // === FINAL ASSESSMENT ===
    {
      type: 'multiple-choice',
      question: 'Un agent a créé une PR de 150 fichiers à travers 8 modules différents. Quelle est la meilleure réponse ?',
      options: [
        'La merger rapidement puisque l\'agent a probablement bien fait',
        'Demander à l\'agent de la découper en PR plus petites et focalisées — une par module ou préoccupation',
        'Réviser les 150 fichiers manuellement en une seule session',
        'Supprimer la branche et refaire le travail toi-même',
      ],
      correctIndex: 1,
      explanation: 'Les grosses PR sont impossibles à réviser, qu\'elles viennent d\'humains ou d\'agents. La bonne réponse est de découper le travail en PR plus petites et focalisées qui peuvent chacune être révisées indépendamment. La vitesse des agents devrait produire plus de petites PR, pas moins de grosses.',
    },
    {
      type: 'checklist',
      title: 'Maîtrise Git + Agents IA :',
      items: [
        'Je crée une nouvelle branche pour chaque tâche d\'agent',
        'J\'écris (ou exige) des messages de commit conventionnels descriptifs',
        'Je révise les PR d\'agents pour les erreurs de logique et les problèmes de sécurité',
        'Je sais résoudre les conflits de merge du travail d\'agents en parallèle',
        'Je peux utiliser les git worktrees pour lancer plusieurs agents simultanément',
        'Je fais respecter la protection de branche pour empêcher les push directs sur main',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Workflow Git avec Agents IA terminé ! Ton contrôle de version est prêt pour les agents.',
    },
  ],
}

export default content
