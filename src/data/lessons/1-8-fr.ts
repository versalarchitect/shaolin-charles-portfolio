import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Au-delà des prompts one-shot',
      body: "Tu as tapé des instructions à Claude Code une à la fois. Ça marche — mais ça ne passe pas à l'échelle. Et si tu pouvais empaqueter un workflow complexe dans une seule commande slash ? Et si ton agent pouvait automatiquement lancer des vérifications avant d'écrire des fichiers, ou te notifier après un déploiement ? Les skills et les hooks résolvent ça. Les skills sont des jeux d'instructions réutilisables que tu invoques avec une commande slash. Les hooks sont des commandes shell qui se déclenchent automatiquement quand certains événements se produisent. Ensemble, ils transforment Claude Code d'un assistant réactif en une plateforme d'automatisation proactive.",
    },
    {
      type: 'info',
      title: 'C\'est quoi les skills ?',
      body: "Un skill est un fichier markdown contenant des instructions que Claude Code charge à la demande. Quand tu tapes /mon-skill dans le chat, Claude lit ce fichier et suit ses instructions comme si tu les avais tapées toi-même. Les skills peuvent contenir des workflows multi-étapes, des templates de code, des check-lists de révision, des procédures de déploiement — tout ce que tu collerais autrement dans la conversation de façon répétée. Ils vivent dans ton projet (committés dans git) ou dans ta config utilisateur (personnels, pas committés).",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Concept de skills verrouillé !',
    },

    // === SKILL FILE STRUCTURE ===
    {
      type: 'code-demo',
      title: 'Anatomie d\'un fichier de skill',
      body: 'Les skills sont des fichiers markdown stockés dans le répertoire .claude/commands/. Le nom du fichier (sans .md) devient le nom de la commande slash. Voici un skill qui lance une vérification pré-commit complète.',
      language: 'markdown',
      filename: '.claude/commands/pre-commit.md',
      code: "# Pre-Commit Check\n\nRun these checks before any commit:\n\n1. Run `bun run lint` and fix any errors\n2. Run `bun run typecheck` and fix any type errors\n3. Run `bun run test` — if tests fail, investigate and fix\n4. Stage only the files you changed (never `git add -A`)\n5. Write a conventional commit message summarizing the changes\n6. Do NOT push — just commit locally\n\nIf any step fails, stop and report the error. Do not skip checks.",
    },
    {
      type: 'info',
      title: 'Emplacements des fichiers de skill',
      body: "Les skills peuvent vivre à trois endroits. Les skills de projet vont dans .claude/commands/ et sont committés dans git — toute ton équipe les partage. Les skills utilisateur vont dans ~/.claude/commands/ et sont personnels à travers tous les projets. Les répertoires imbriqués créent des commandes avec namespace : .claude/commands/deploy/staging.md devient /deploy-staging. Le nom du fichier moins l'extension .md est le nom de la commande.",
    },
    {
      type: 'multiple-choice',
      question: 'Où places-tu un fichier de skill pour que toute ton équipe puisse l\'utiliser ?',
      options: [
        '~/.claude/commands/',
        '.claude/commands/',
        'CLAUDE.md',
        '.claude/settings.json',
      ],
      correctIndex: 1,
      explanation: 'Les skills de projet dans .claude/commands/ sont committés dans git et partagés avec l\'équipe. Les skills utilisateur dans ~/.claude/commands/ sont personnels et pas committés.',
    },

    // === CREATING A SKILL ===
    {
      type: 'terminal',
      instruction: 'Crée le répertoire de commandes pour tes skills de projet :',
      expectedCommand: 'mkdir -p .claude/commands',
      hint: 'Utilise mkdir avec le flag -p pour créer des répertoires imbriqués',
    },
    {
      type: 'code-demo',
      title: 'Un skill de révision avec des paramètres',
      body: 'Les skills peuvent référencer $ARGUMENTS pour accepter des entrées de l\'utilisateur. Quand invoqué comme /review src/auth.ts, la variable $ARGUMENTS contient "src/auth.ts".',
      language: 'markdown',
      filename: '.claude/commands/review.md',
      code: "# Code Review\n\nReview the file: $ARGUMENTS\n\nCheck for:\n- Security vulnerabilities (SQL injection, XSS, auth bypasses)\n- Performance issues (N+1 queries, unnecessary re-renders)\n- Error handling (uncaught promises, missing try/catch)\n- Type safety (any casts, missing null checks)\n\nFor each issue found:\n1. Quote the problematic code\n2. Explain the risk\n3. Provide a fix\n\nIf the file is clean, say so explicitly.",
    },
    {
      type: 'code-input',
      instruction: 'Dans un fichier de skill, quelle variable contient le texte que l\'utilisateur passe après la commande slash ?',
      placeholder: '$...',
      answer: '$ARGUMENTS',
      hint: 'C\'est une variable en majuscules préfixée par $',
    },

    // === HOOKS: AUTOMATIC TRIGGERS ===
    {
      type: 'info',
      title: 'C\'est quoi les hooks ?',
      body: "Les hooks sont des commandes shell qui s'exécutent automatiquement quand Claude Code effectue certaines actions. Contrairement aux skills (que tu invoques manuellement), les hooks se déclenchent seuls quand un événement correspondant se produit. Ils interceptent le comportement de l'agent à des moments clés : avant qu'un outil s'exécute, après qu'un outil s'exécute, ou quand une notification est envoyée. Les hooks sont configurés dans settings.json — pas dans des fichiers markdown. Ils s'exécutent en dehors du modèle, comme de simples commandes shell sur ta machine.",
    },
    {
      type: 'diagram',
      title: 'Flux d\'exécution des hooks',
      body: 'Les hooks interceptent les appels d\'outils à deux points : avant l\'exécution (PreToolUse) et après l\'exécution (PostToolUse). Le hook exécute ta commande shell et peut bloquer ou modifier l\'action.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'model', label: 'Modèle Claude', sublabel: 'Décide d\'utiliser un outil', shape: 'rounded', highlight: true },
          { id: 'pre', label: 'Hook PreToolUse', sublabel: 'Commande shell', shape: 'rect' },
          { id: 'tool', label: 'Outil s\'exécute', sublabel: 'Bash/Edit/Read', shape: 'rect' },
          { id: 'post', label: 'Hook PostToolUse', sublabel: 'Commande shell', shape: 'rect' },
          { id: 'result', label: 'Résultat au modèle', sublabel: 'Continuer le flux', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'model', to: 'pre', label: 'intercepter' },
          { from: 'pre', to: 'tool', label: 'autoriser' },
          { from: 'tool', to: 'post', label: 'terminé' },
          { from: 'post', to: 'result', label: 'retourner' },
        ],
      },
    },

    // === HOOK CONFIGURATION ===
    {
      type: 'code-demo',
      title: 'Configuration des hooks dans settings.json',
      body: 'Les hooks sont définis dans la clé "hooks" de ton settings.json. Chaque événement de hook mappe vers un tableau de handlers. Le "matcher" filtre quel outil déclenche le hook. La "command" est la commande shell à exécuter.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "command": "echo \\"About to run a bash command\\""\n      },\n      {\n        "matcher": "Edit",\n        "command": "test -f .pre-edit-check && sh .pre-edit-check"\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "bun run lint --fix $CLAUDE_FILE_PATH"\n      }\n    ],\n    "Notification": [\n      {\n        "command": "terminal-notifier -message \\"Claude needs attention\\""\n      }\n    ]\n  }\n}',
    },
    {
      type: 'multiple-choice',
      question: 'Quel est le but du champ "matcher" dans la configuration d\'un hook ?',
      options: [
        'Il fait correspondre des chemins de fichiers pour déterminer quels fichiers surveiller',
        'Il filtre quel nom d\'outil déclenche le hook',
        'Il fait correspondre des patterns regex dans la sortie de la commande',
        'Il sélectionne quel serveur MCP utiliser',
      ],
      correctIndex: 1,
      explanation: 'Le champ matcher spécifie quel nom d\'outil déclenche le hook. "Bash" signifie que le hook se déclenche uniquement quand l\'outil Bash est utilisé. "Edit" signifie uniquement pour les appels à l\'outil Edit. Sans matcher, le hook se déclenche pour tous les outils.',
    },

    // === HOOK EVENTS ===
    {
      type: 'info',
      title: 'Types d\'événements de hook',
      body: "Il y a trois événements de hook. PreToolUse se déclenche avant qu'un outil s'exécute — utilise-le pour la validation, la journalisation ou le blocage de commandes dangereuses. PostToolUse se déclenche après qu'un outil a terminé — utilise-le pour le formatage automatique, le linting ou les notifications. Notification se déclenche quand l'agent envoie une notification (typiquement quand il a besoin d'une entrée humaine ou termine une longue tâche) — utilise-le pour les alertes bureau, les messages Slack ou les effets sonores. Chaque événement reçoit du contexte via des variables d'environnement.",
    },
    {
      type: 'code-demo',
      title: 'Variables d\'environnement disponibles pour les hooks',
      body: 'Les hooks reçoivent du contexte sur l\'appel d\'outil courant via des variables d\'environnement. Utilise-les pour prendre des décisions dans tes scripts de hook.',
      language: 'bash',
      filename: 'hook-env-vars.sh',
      code: "# Available in all hooks:\n# $CLAUDE_TOOL_NAME    — the tool being called (Bash, Edit, Read, Write)\n# $CLAUDE_TOOL_INPUT   — JSON string of the tool's input parameters\n# $CLAUDE_FILE_PATH    — file path if the tool operates on a file\n# $CLAUDE_SESSION_ID   — current session identifier\n\n# Example: Block destructive git commands\nif echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'git.*--force\\|git.*reset --hard'; then\n  echo \"BLOCKED: Destructive git command detected\" >&2\n  exit 1\nfi",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Mécanique des hooks maîtrisée !',
    },

    // === PRACTICAL EXAMPLES ===
    {
      type: 'info',
      title: 'Patterns de hooks pratiques',
      body: "Les hooks les plus puissants sont les garde-fous. Un hook PreToolUse sur Bash peut bloquer rm -rf, git push --force, ou toute commande correspondant à une liste noire. Un hook PostToolUse sur Write peut auto-lancer le linter sur tout fichier créé par l'agent. Un hook Notification peut envoyer un message Slack ou jouer un son quand Claude termine une tâche. Les hooks transforment ton agent de non encadré à gouverné — toujours autonome, mais dans les limites que tu définis.",
    },
    {
      type: 'code-demo',
      title: 'Auto-lint après chaque écriture de fichier',
      body: 'Ce hook PostToolUse lance ESLint avec auto-fix sur tout fichier que Claude écrit. L\'agent ne committe jamais de code non formaté.',
      language: 'json',
      filename: '.claude/settings.json (partial)',
      code: '{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      },\n      {\n        "matcher": "Edit",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      }\n    ]\n  }\n}',
    },

    // === CHAINING SKILLS ===
    {
      type: 'info',
      title: 'Chaîner des skills pour des workflows complexes',
      body: "Les skills peuvent référencer d'autres skills dans leurs instructions. Un skill /deploy pourrait dire « D'abord lance /pre-commit, puis pousse sur main, puis vérifie avec /check-deploy ». Ça crée de l'automatisation composable : des petits skills focalisés qui se combinent en pipelines puissants. Le principe clé est la responsabilité unique — chaque skill fait une seule chose bien, et le chaînage les combine. Ça reprend le fonctionnement des pipes Unix : des petits outils composés en workflows complexes.",
    },
    {
      type: 'code-demo',
      title: 'Un skill de déploiement qui chaîne d\'autres skills',
      body: 'Ce skill orchestre un déploiement multi-étapes en référençant d\'autres skills en séquence. Chaque sous-skill gère une préoccupation.',
      language: 'markdown',
      filename: '.claude/commands/ship.md',
      code: "# Ship to Production\n\nExecute this deployment pipeline in order:\n\n1. Run the /pre-commit checks (lint, typecheck, test)\n2. If all checks pass, commit with a conventional commit message\n3. Push to origin main\n4. Wait 30 seconds, then run /check-deploy to verify\n5. If deployment fails, immediately run `git revert HEAD` and push\n\nReport final status: deployed successfully or rolled back with error details.",
    },
    {
      type: 'multiple-choice',
      question: 'Quelle est l\'approche recommandée pour construire des workflows de skills complexes ?',
      options: [
        'Mettre tout dans un seul gros fichier de skill',
        'Utiliser plusieurs petits skills à responsabilité unique qui se chaînent ensemble',
        'Éviter complètement les skills et utiliser des hooks à la place',
        'Écrire le workflow directement dans CLAUDE.md',
      ],
      correctIndex: 1,
      explanation: 'Des petits skills focalisés qui se chaînent ensemble suivent la philosophie Unix : chacun fait une seule chose bien, et la composition crée la puissance. Ça rend les skills réutilisables, testables et plus faciles à maintenir.',
    },

    // === SHARING SKILLS ===
    {
      type: 'info',
      title: 'Partager des skills entre projets',
      body: "Les skills au niveau utilisateur dans ~/.claude/commands/ sont disponibles dans chaque projet que tu ouvres. C'est idéal pour les workflows personnels : ta check-list de revue de code, ton processus de déploiement, tes étapes de débogage. Les skills au niveau projet dans .claude/commands/ sont partagés avec ton équipe via git. Quand un collègue pull le repo, il obtient tous les skills automatiquement. Ça crée du savoir institutionnel qui vit dans la codebase — pas dans la tête de quelqu'un ou un wiki que personne ne lit.",
    },
    {
      type: 'terminal',
      instruction: 'Liste tous les skills disponibles (commandes slash) dans ta session Claude Code actuelle :',
      expectedCommand: '/commands',
      hint: 'Utilise la commande slash qui liste toutes les commandes disponibles',
    },

    // === ADVANCED PATTERNS ===
    {
      type: 'code-demo',
      title: 'Combiner hooks et skills',
      body: 'Le pattern le plus puissant : les hooks appliquent des garde-fous automatiquement, tandis que les skills fournissent des workflows à la demande. Ensemble, ils créent un environnement de développement gouverné et automatisé.',
      language: 'json',
      filename: '.claude/settings.json',
      code: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "Bash",\n        "command": "sh .claude/guards/no-force-push.sh"\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      }\n    ],\n    "Notification": [\n      {\n        "command": "osascript -e \'display notification \\\"Claude needs you\\\" with title \\\"Claude Code\\\"\'"\n      }\n    ]\n  }\n}',
    },
    {
      type: 'order',
      instruction: 'Ordonne les étapes pour mettre en place un workflow complet skill + hook :',
      items: [
        'Tester le skill en l\'invoquant avec /nom-commande',
        'Créer le répertoire .claude/commands/',
        'Ajouter des hooks dans .claude/settings.json pour des garde-fous automatiques',
        'Écrire un fichier de skill .md avec des instructions étape par étape',
        'Committer les skills et settings dans git pour le partage d\'équipe',
      ],
      correctOrder: [1, 3, 0, 2, 4],
    },

    // === INTERACTIF : COMPARE, MATCH, CODE-FILL ===
    {
      type: 'compare',
      title: 'Instructions inline vs skills sauvegardés',
      body: 'Tu peux taper la même instruction à chaque fois, ou la sauvegarder dans un fichier de skill réutilisable.',
      question: 'Quelle approche passe mieux à l\'échelle entre les projets ?',
      correctSide: 'right',
      left: {
        label: 'Inline (à chaque fois)',
        content: '> claude "Review this PR for security issues.\n  Check for: hardcoded secrets, SQL injection,\n  XSS vulnerabilities, missing auth checks,\n  exposed API keys. Format as a checklist\n  with severity levels."',
        language: 'text',
      },
      right: {
        label: 'Skill sauvegardé',
        content: '# .claude/commands/security-review.md\n\nReview the current diff for security issues.\n\nCheck for:\n- Hardcoded secrets or API keys\n- SQL injection vulnerabilities\n- XSS attack vectors\n- Missing authentication checks\n- Exposed internal endpoints\n\nFormat as a severity-ranked checklist.',
        language: 'markdown',
      },
      explanation: 'Les skills sauvegardés sont cohérents, partageables et versionnés. Tu tapes /security-review au lieu de te souvenir du prompt complet. Toute l\'équipe utilise la même check-list.',
    },
    {
      type: 'match',
      instruction: 'Associe chaque type de hook à son rôle :',
      leftItems: ['PreToolUse', 'PostToolUse', 'Notification'],
      rightItems: ['Valider ou bloquer une action avant son exécution', 'Lancer un nettoyage ou des vérifications après une action', 'Réagir à des événements comme des erreurs ou des changements d\'état'],
      correctPairs: { 0: 0, 1: 1, 2: 2 },
      explanation: 'Les hooks PreToolUse agissent comme des garde-fous — ils peuvent empêcher les actions dangereuses. Les hooks PostToolUse s\'exécutent après coup pour la journalisation ou le nettoyage. Les hooks Notification réagissent aux événements système.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette configuration de hook pour auto-linter chaque fichier que l\'agent écrit :',
      language: 'json',
      template: '{\n  "hooks": {\n    "{{event_type}}": [\n      {\n        "{{filter_key}}": "{{tool_name}}",\n        "command": "npx eslint --fix \\"$CLAUDE_FILE_PATH\\""\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'event_type', answer: 'PostToolUse', alternatives: ['postToolUse', 'posttooluse'], placeholder: 'événement du hook ?', hint: 'Ce hook se déclenche après qu\'un outil termine — Pre ou Post ?' },
        { id: 'filter_key', answer: 'matcher', placeholder: 'champ de filtre ?', hint: 'La clé JSON qui filtre quel outil déclenche le hook' },
        { id: 'tool_name', answer: 'Write', alternatives: ['write'], placeholder: 'quel outil ?', hint: 'L\'outil qui crée de nouveaux fichiers' },
      ],
      explanation: 'PostToolUse se déclenche après qu\'un outil termine. Le champ "matcher" filtre par nom d\'outil. "Write" cible la création de fichiers — donc chaque nouveau fichier est auto-linté.',
    },

    // === FINAL EXERCISES ===
    {
      type: 'code-input',
      instruction: 'Quel chemin de répertoire contient les skills au niveau projet qui sont partagés via git ?',
      placeholder: 'path/to/skills',
      answer: '.claude/commands',
      hint: 'C\'est à l\'intérieur du répertoire .claude à la racine du projet',
    },
    {
      type: 'multiple-choice',
      question: 'Un hook PreToolUse quitte avec le code 1. Que se passe-t-il ?',
      options: [
        'L\'outil s\'exécute quand même mais affiche un avertissement',
        'L\'exécution de l\'outil est bloquée',
        'Claude Code redémarre la session',
        'Le hook est désactivé pour le reste de la session',
      ],
      correctIndex: 1,
      explanation: 'Un code de sortie non nul d\'un hook PreToolUse bloque l\'exécution de l\'outil. C\'est comme ça que les hooks garde-fous empêchent les opérations dangereuses — ils quittent avec le code 1 pour stopper l\'action.',
    },
    {
      type: 'checklist',
      title: 'Maîtrise Skills & Hooks :',
      items: [
        'Je peux créer un fichier de skill dans .claude/commands/',
        'Je comprends $ARGUMENTS pour les skills paramétrés',
        'Je peux configurer des hooks PreToolUse pour bloquer les commandes dangereuses',
        'Je peux configurer des hooks PostToolUse pour le formatage automatique',
        'Je sais chaîner des skills pour des workflows multi-étapes',
        'Je peux partager des skills avec mon équipe via git',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Configuration de Skills & Hooks terminée ! Ton agent est maintenant pleinement gouverné et automatisé.',
    },
  ],
}

export default content
