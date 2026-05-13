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
      type: 'info',
      title: 'Branch-per-feature avec les agents',
      body: "Crée une nouvelle branche pour chaque tâche que tu donnes à un agent. Même si la tâche semble petite. Les branches sont pas chères. Une branche te donne de l'isolation (les changements de l'agent ne touchent pas main tant qu'ils ne sont pas révisés), du rollback (supprime la branche si l'agent déraille), et de la visibilité (tu peux voir tout le travail de l'agent dans ta liste de branches). Nomme les branches de façon descriptive : feat/add-auth-flow, fix/pagination-off-by-one, refactor/extract-api-client. Inclus le périmètre du changement dans le nom.",
    },
    {
      type: 'terminal',
      instruction: 'Crée une nouvelle branche de fonctionnalité pour une tâche d\'agent :',
      expectedCommand: 'git checkout -b feat/add-user-settings',
      hint: 'Utilise git checkout -b suivi du nom de la branche',
    },
    {
      type: 'diagram',
      title: 'Workflow de branches agent',
      body: 'Chaque tâche d\'agent vit sur sa propre branche. L\'humain révise avant de merger dans main. Plusieurs agents peuvent travailler en parallèle sur des branches séparées.',
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
      type: 'info',
      title: 'Messages de commit pour le code généré par agent',
      body: "Les agents produisent du code vite, mais le message de commit est toujours important — peut-être même plus qu'habituellement. Quand tu révises une PR des semaines plus tard, le message de commit est ton seul contexte pour comprendre pourquoi l'agent a fait un choix. Bonne pratique : utilise les commits conventionnels (feat:, fix:, refactor:), décris l'intention pas l'implémentation, et inclus un trailer Co-Authored-By pour l'agent. Claude Code fait ça automatiquement quand tu lui demandes de committer. N'accepte jamais un message de commit comme « update files » ou « make changes ».",
    },
    {
      type: 'code-demo',
      title: 'Bons vs mauvais messages de commit d\'agent',
      body: 'Le message de commit devrait expliquer pourquoi le changement existe. Le diff montre déjà ce qui a changé.',
      language: 'text',
      filename: 'commit-examples.txt',
      code: "# BAD - tells you nothing\ngit commit -m \"update auth\"\ngit commit -m \"fix bug\"\ngit commit -m \"changes from Claude\"\n\n# GOOD - explains intent and scope\ngit commit -m \"feat(auth): add refresh token rotation to prevent session hijacking\"\ngit commit -m \"fix(api): handle null response from payments webhook\"\ngit commit -m \"refactor(db): extract query builder to reduce duplication in user service\"\n\n# With Co-Authored-By (added automatically by Claude Code)\ngit commit -m \"feat(settings): add user preferences page with theme toggle\n\nCo-Authored-By: Claude <noreply@anthropic.com>\"",
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
      type: 'info',
      title: 'Réviser les pull requests des agents',
      body: "Les PR d'agents ont besoin de la même rigueur de révision que les PR humaines — mais avec des points d'attention différents. Les agents ont rarement des typos ou des problèmes de style (ils suivent les linters). À la place, cherche : les erreurs de logique que l'agent ne pourrait pas détecter sans exécuter le code, la sur-ingénierie (les agents adorent abstraire trop tôt), les cas limites manquants, les problèmes de sécurité (les agents exposent parfois des secrets ou sautent les vérifications d'auth), et les changements inutiles sur des fichiers hors du périmètre de la tâche. Survole vite, concentre-toi en profondeur sur la logique métier.",
    },
    {
      type: 'code-demo',
      title: 'Commandes de révision de PR',
      body: 'Utilise ces commandes git pour réviser efficacement les PR générées par agent. Concentre-toi d\'abord sur la compréhension du périmètre, puis plonge dans les détails.',
      language: 'bash',
      filename: 'review-workflow.sh',
      code: "# See all files changed in the PR branch\ngit diff --stat main...HEAD\n\n# Review changes file by file\ngit diff main...HEAD -- src/auth/\n\n# See commit history (check for logical grouping)\ngit log --oneline main..HEAD\n\n# Check if agent touched files outside its scope\ngit diff --name-only main...HEAD | grep -v '^src/auth/'\n\n# Interactive review with GitHub CLI\ngh pr diff 42\ngh pr review 42 --comment -b \"LGTM — logic is sound, tests cover edge cases\"",
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
      type: 'info',
      title: 'Gérer les conflits de merge dans les workflows d\'agents',
      body: "Les conflits de merge arrivent plus souvent avec les agents parce que plusieurs agents peuvent travailler en parallèle sur des fichiers reliés. La prévention vaut mieux que la cure : avant de lancer un agent sur une tâche, pull le dernier main. Garde les branches d'agents de courte durée (merge en quelques heures, pas jours). Quand les conflits arrivent, ne demande pas à l'agent de les résoudre à l'aveugle — il n'a pas le contexte de ce que l'autre branche voulait. À la place : révise les deux côtés, décide toi-même de la bonne résolution, puis laisse l'agent l'implémenter.",
    },
    {
      type: 'code-demo',
      title: 'Résoudre les conflits en toute sécurité',
      body: 'Quand une branche d\'agent entre en conflit avec main, rebase sur le dernier main et résous les conflits avec le contexte complet.',
      language: 'bash',
      filename: 'resolve-conflicts.sh',
      code: "# Update main first\ngit checkout main && git pull\n\n# Switch to the agent branch and rebase\ngit checkout feat/add-auth\ngit rebase main\n\n# If conflicts appear:\n# 1. Open the conflicted files\n# 2. Understand BOTH sides (yours and main)\n# 3. Resolve manually — don't guess\n# 4. Continue the rebase\ngit add <resolved-files>\ngit rebase --continue\n\n# If the rebase is too messy, abort and merge instead\ngit rebase --abort\ngit merge main",
    },
    {
      type: 'terminal',
      instruction: 'Voir quels fichiers ont des conflits de merge après un rebase :',
      expectedCommand: 'git diff --name-only --diff-filter=U',
      hint: 'Utilise git diff avec --name-only et filtre pour les fichiers non-mergés (U)',
    },

    // === GIT WORKTREES ===
    {
      type: 'info',
      title: 'Git worktrees pour le travail d\'agents en parallèle',
      body: "Quand tu veux que plusieurs agents travaillent simultanément sur différentes branches du même repo, les git worktrees sont la solution. Un worktree crée un répertoire de travail séparé lié au même dépôt. Chaque worktree peut avoir une branche différente checkout. Ça veut dire que tu peux avoir l'Agent A qui travaille dans /project-feat-auth et l'Agent B dans /project-fix-pagination — même repo, pas de conflits, pas de stash, pas de changement de branche. Chaque agent a son propre espace de travail propre.",
    },
    {
      type: 'code-demo',
      title: 'Mettre en place des worktrees pour des agents en parallèle',
      body: 'Crée des répertoires de travail séparés pour chaque tâche d\'agent. Ils partagent le même historique git mais ont des états de fichiers indépendants.',
      language: 'bash',
      filename: 'worktree-setup.sh',
      code: "# Create a worktree for a feature branch\ngit worktree add ../project-feat-auth feat/add-auth\n\n# Create another worktree for a different task\ngit worktree add ../project-fix-pagination fix/pagination\n\n# List all active worktrees\ngit worktree list\n# /Users/you/project             abc1234 [main]\n# /Users/you/project-feat-auth   def5678 [feat/add-auth]\n# /Users/you/project-fix-pagination ghi9012 [fix/pagination]\n\n# Each agent works in its own directory — no interference\n# Agent 1: cd ../project-feat-auth && claude\n# Agent 2: cd ../project-fix-pagination && claude\n\n# When done, clean up\ngit worktree remove ../project-feat-auth\ngit worktree remove ../project-fix-pagination",
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
      type: 'info',
      title: 'Les règles d\'or',
      body: "Voici les règles non négociables pour git avec les agents. Un : ne laisse jamais les agents pousser directement sur main — utilise toujours une PR avec révision. Deux : ne laisse jamais les agents force-push ou réécrire l'historique sur les branches partagées. Trois : garde les branches d'agents de courte durée — merge ou supprime dans la journée. Quatre : vérifie toujours que les changements de l'agent compilent et passent les tests avant de merger. Cinq : utilise les règles de protection de branche pour faire respecter ces contraintes même quand tu es pressé.",
    },
    {
      type: 'code-demo',
      title: 'Protection de branche pour la sécurité des agents',
      body: 'Configure ton dépôt pour empêcher les agents (et les humains) de contourner la révision. Ces paramètres s\'appliquent sur GitHub/GitLab.',
      language: 'bash',
      filename: 'branch-protection.sh',
      code: "# Set up branch protection via GitHub CLI\ngh api repos/{owner}/{repo}/branches/main/protection -X PUT -f \\\n  required_pull_request_reviews.required_approving_review_count=1 \\\n  required_status_checks.strict=true \\\n  enforce_admins=true \\\n  allow_force_pushes=false \\\n  allow_deletions=false\n\n# Result: no one (human or agent) can:\n# - Push directly to main\n# - Force push to main\n# - Merge without an approval\n# - Merge with failing CI checks",
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
