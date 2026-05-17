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
      type: 'code-fill',
      instruction: 'Complète ce fichier de skill qui lance une vérification pré-commit complète. Les skills sont des fichiers markdown dans .claude/commands/ :',
      language: 'markdown',
      filename: '.claude/commands/pre-commit.md',
      template: "# Pre-Commit Check\n\nRun these checks before any commit:\n\n1. Run `bun run {{lint_cmd}}` and fix any errors\n2. Run `bun run {{type_cmd}}` and fix any type errors\n3. Run `bun run test` — if tests fail, investigate and fix\n4. Stage only the files you changed (never `{{bad_add}}`)\n5. Write a conventional commit message summarizing the changes\n6. Do NOT push — just commit locally\n\nIf any step fails, stop and report the error. Do not skip checks.",
      blanks: [
        { id: 'lint_cmd', answer: 'lint', alternatives: ['eslint'], placeholder: 'vérifier le style ?', hint: 'Le script qui vérifie le style et le formatage du code' },
        { id: 'type_cmd', answer: 'typecheck', alternatives: ['tsc', 'type-check'], placeholder: 'vérifier les types ?', hint: 'Le script qui vérifie que les types TypeScript sont corrects' },
        { id: 'bad_add', answer: 'git add -A', alternatives: ['git add .', 'git add --all'], placeholder: 'commande dangereuse ?', hint: 'La commande git qui ajoute TOUS les fichiers, même ceux que tu n\'as pas changés' },
      ],
      explanation: 'Les skills sont des fichiers d\'instructions markdown. Le nom du fichier (pre-commit.md) devient la commande slash /pre-commit. Le skill lance lint, typecheck et tests avant de committer. N\'utilise jamais git add -A — ça stage des fichiers que tu n\'as pas changés.',
    },
    {
      type: 'multiple-choice',
      question: 'Un fichier de skill à .claude/commands/deploy/staging.md devient quelle commande slash ?',
      options: [
        '/deploy/staging',
        '/deploy-staging',
        '/staging',
        '/commands-deploy-staging',
      ],
      correctIndex: 1,
      explanation: 'Les répertoires imbriqués créent des commandes avec namespace et des tirets. .claude/commands/deploy/staging.md devient /deploy-staging. Les skills de projet dans .claude/commands/ sont partagés via git. Les skills utilisateur dans ~/.claude/commands/ sont personnels.',
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
      platforms: {
        windows: {
          instruction: 'Crée le répertoire de commandes pour tes skills de projet :',
          expectedCommand: 'mkdir .claude\\commands',
          hint: 'Utilise mkdir pour créer le répertoire imbriqué (PowerShell crée les dossiers parents automatiquement)',
        },
      },
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce skill de révision qui accepte un chemin de fichier en paramètre :',
      language: 'markdown',
      filename: '.claude/commands/review.md',
      template: "# Code Review\n\nReview the file: {{param_var}}\n\nCheck for:\n- {{security_check}} (SQL injection, XSS, auth bypasses)\n- Performance issues (N+1 queries, unnecessary re-renders)\n- Error handling (uncaught promises, missing try/catch)\n- Type safety (any casts, missing null checks)\n\nFor each issue found:\n1. Quote the problematic code\n2. Explain the risk\n3. Provide a fix",
      blanks: [
        { id: 'param_var', answer: '$ARGUMENTS', alternatives: ['$arguments', '$ARGS'], placeholder: 'variable d\'entrée ?', hint: 'La variable en majuscules préfixée par $ qui contient le texte passé après la commande slash' },
        { id: 'security_check', answer: 'Security vulnerabilities', alternatives: ['Security issues', 'Vulnérabilités de sécurité'], placeholder: 'première catégorie à vérifier ?', hint: 'Le type le plus critique de problème de code — implique des exploits et des attaques' },
      ],
      explanation: 'Les skills référencent $ARGUMENTS pour accepter des entrées utilisateur. Quand invoqué comme /review src/auth.ts, $ARGUMENTS contient "src/auth.ts". Les vulnérabilités de sécurité sont toujours la première priorité dans une revue de code.',
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
      type: 'compare',
      title: 'Skills vs Hooks',
      body: 'Les deux étendent Claude Code, mais ils se déclenchent de façon opposée.',
      question: 'Lequel se déclenche automatiquement sans que tu tapes quoi que ce soit ?',
      correctSide: 'right',
      left: {
        label: 'Skills (Manuel)',
        content: "- Tu invoques avec /nom-commande\n- Fichiers markdown dans .claude/commands/\n- Chargés à la demande quand tu tapes la commande\n- Peuvent contenir des instructions multi-étapes\n- Acceptent $ARGUMENTS de l'entrée utilisateur\n\nExemple : /pre-commit\n→ Lance lint, typecheck, test, puis commit",
        language: 'text',
      },
      right: {
        label: 'Hooks (Automatique)',
        content: "- Se déclenchent automatiquement sur événement\n- Configurés dans settings.json (pas en markdown)\n- S'exécutent comme commandes shell sur ta machine\n- Interceptent les appels d'outils avant/après\n- Peuvent bloquer les actions dangereuses\n\nExemple : PostToolUse sur Write\n→ Auto-lint chaque fichier que Claude crée",
        language: 'text',
      },
      explanation: 'Les skills sont manuels — tu les invoques avec une commande slash. Les hooks sont automatiques — ils se déclenchent quand Claude Code effectue certaines actions. Les hooks interceptent avant (PreToolUse) et après (PostToolUse) l\'exécution des outils, et sur les notifications.',
    },
    {
      type: 'interactive-diagram',
      title: 'Flux d\'exécution des hooks',
      body: 'Clique sur chaque étape pour voir comment les hooks interceptent les appels d\'outils avant et après l\'exécution.',
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
      stages: [
        {
          highlightNodes: ['model'],
          highlightEdges: [],
          explanation: 'Claude décide d\'utiliser un outil — Bash, Edit, Read ou Write. Avant que l\'outil ne s\'exécute, les hooks ont une chance d\'intercepter.',
        },
        {
          highlightNodes: ['model', 'pre'],
          highlightEdges: [{ from: 'model', to: 'pre' }],
          explanation: 'Le hook PreToolUse se déclenche. Ta commande shell s\'exécute avec le contexte de l\'outil appelé. Si le hook quitte avec le code 1, l\'outil est BLOQUÉ.',
        },
        {
          highlightNodes: ['pre', 'tool'],
          highlightEdges: [{ from: 'pre', to: 'tool' }],
          explanation: 'Si le hook PreToolUse autorise (code de sortie 0), l\'outil s\'exécute normalement — exécutant la commande bash, éditant le fichier, etc.',
        },
        {
          highlightNodes: ['tool', 'post'],
          highlightEdges: [{ from: 'tool', to: 'post' }],
          explanation: 'Après que l\'outil termine, le hook PostToolUse se déclenche. Utilise-le pour le formatage automatique, le linting, la journalisation ou les notifications.',
        },
        {
          highlightNodes: ['post', 'result'],
          highlightEdges: [{ from: 'post', to: 'result' }],
          explanation: 'Le résultat retourne au modèle. L\'agent continue son travail, inconscient que des hooks ont tourné en coulisses.',
        },
      ],
    },

    // === HOOK CONFIGURATION ===
    {
      type: 'code-fill',
      instruction: 'Complète cette configuration de hooks. Les hooks sont définis dans settings.json avec des types d\'événements, des matchers et des commandes shell :',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "hooks": {\n    "{{pre_event}}": [\n      {\n        "matcher": "Bash",\n        "command": "echo \\"About to run a bash command\\""\n      }\n    ],\n    "PostToolUse": [\n      {\n        "{{filter_field}}": "Write",\n        "command": "bun run lint --fix {{file_var}}"\n      }\n    ],\n    "Notification": [\n      {\n        "command": "terminal-notifier -message \\"Claude needs attention\\""\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'pre_event', answer: 'PreToolUse', alternatives: ['pretooluse'], placeholder: 'événement avant ?', hint: 'L\'événement de hook qui se déclenche AVANT l\'exécution d\'un outil — Pre + ToolUse' },
        { id: 'filter_field', answer: 'matcher', placeholder: 'clé de filtre ?', hint: 'La clé JSON qui spécifie quel nom d\'outil déclenche ce hook' },
        { id: 'file_var', answer: '$CLAUDE_FILE_PATH', alternatives: ['$claude_file_path'], placeholder: 'variable du fichier ?', hint: 'La variable d\'environnement contenant le chemin du fichier sur lequel l\'outil opère' },
      ],
      explanation: 'PreToolUse se déclenche avant l\'exécution (pour validation/blocage). Le champ "matcher" filtre par nom d\'outil. $CLAUDE_FILE_PATH est la variable d\'env contenant le chemin du fichier courant. Les hooks Notification se déclenchent quand Claude a besoin d\'attention.',
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
      type: 'match',
      instruction: 'Associe chaque variable d\'environnement de hook au contexte qu\'elle fournit :',
      leftItems: [
        '$CLAUDE_TOOL_NAME',
        '$CLAUDE_TOOL_INPUT',
        '$CLAUDE_FILE_PATH',
        '$CLAUDE_SESSION_ID',
      ],
      rightItems: [
        'Quel outil est appelé (Bash, Edit, Read, Write)',
        'Chaîne JSON des paramètres d\'entrée de l\'outil',
        'Chemin du fichier sur lequel l\'outil opère',
        'Identifiant de la session courante',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Les hooks reçoivent du contexte sur l\'appel d\'outil courant via des variables d\'environnement. Utilise $CLAUDE_TOOL_INPUT pour inspecter quelle commande est lancée — par exemple, pour bloquer les commandes git destructives comme --force ou reset --hard.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce script de hook qui bloque les commandes git destructives. Trois événements existent : PreToolUse (avant), PostToolUse (après), et Notification.',
      language: 'bash',
      filename: 'block-destructive.sh',
      template: "# Bloquer les commandes git destructives dans un hook PreToolUse\nif echo \"${{input_var}}\" | grep -q 'git.*{{force_flag}}\\|git.*reset --hard'; then\n  echo \"BLOCKED: Commande git destructive détectée\" >&2\n  exit {{block_code}}\nfi",
      blanks: [
        { id: 'input_var', answer: 'CLAUDE_TOOL_INPUT', alternatives: ['claude_tool_input'], placeholder: 'quelle var env ?', hint: 'La variable d\'environnement contenant le JSON de ce que l\'outil va faire' },
        { id: 'force_flag', answer: '--force', alternatives: ['-f'], placeholder: 'flag dangereux ?', hint: 'Le flag git push qui écrase l\'historique distant' },
        { id: 'block_code', answer: '1', placeholder: 'code de sortie ?', hint: 'Un code de sortie non-nul dit au hook PreToolUse de BLOQUER l\'outil' },
      ],
      explanation: 'Vérifie $CLAUDE_TOOL_INPUT pour les patterns dangereux comme --force ou reset --hard. Quitte avec le code 1 pour bloquer l\'outil. Le code 0 (ou pas d\'exit) autorise l\'outil. C\'est ainsi que les hooks garde-fous appliquent les limites de sécurité.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Mécanique des hooks maîtrisée !',
    },

    // === PRACTICAL EXAMPLES ===
    {
      type: 'multiple-choice',
      question: 'Un hook PostToolUse sur Write lance "npx eslint --fix" sur chaque fichier que Claude crée. Qu\'est-ce que ça accomplit ?',
      options: [
        'Ça bloque Claude d\'écrire des fichiers avec des erreurs de lint',
        'Ça corrige automatiquement le formatage dans chaque fichier que Claude écrit',
        'Ça envoie une notification quand des erreurs de lint sont trouvées',
        'Ça empêche Claude d\'utiliser l\'outil Write entièrement',
      ],
      correctIndex: 1,
      explanation: 'PostToolUse se déclenche APRÈS que l\'outil termine. Le hook auto-corrige le formatage de chaque fichier que Claude crée. L\'agent ne committe jamais de code non formaté. Les hooks PreToolUse bloquent les actions ; les hooks PostToolUse nettoient après les actions.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce hook PostToolUse qui auto-lint les fichiers après les opérations Write et Edit :',
      language: 'json',
      filename: '.claude/settings.json (partial)',
      template: '{\n  "hooks": {\n    "PostToolUse": [\n      {\n        "matcher": "{{write_tool}}",\n        "command": "npx {{linter}} --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      },\n      {\n        "matcher": "{{edit_tool}}",\n        "command": "npx {{linter}} --fix \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'write_tool', answer: 'Write', alternatives: ['write'], placeholder: 'outil de création ?', hint: 'L\'outil Claude Code qui crée de nouveaux fichiers' },
        { id: 'linter', answer: 'eslint', alternatives: ['ESLint'], placeholder: 'commande de lint ?', hint: 'L\'outil populaire de linting JavaScript/TypeScript' },
        { id: 'edit_tool', answer: 'Edit', alternatives: ['edit'], placeholder: 'outil de modification ?', hint: 'L\'outil Claude Code qui modifie les fichiers existants' },
      ],
      explanation: 'Match à la fois "Write" (nouveaux fichiers) et "Edit" (fichiers modifiés) pour s\'assurer que chaque fichier touché par Claude est auto-linté. Le "2>/dev/null || true" supprime les erreurs pour que le hook ne bloque jamais le workflow.',
    },

    // === CHAINING SKILLS ===
    {
      type: 'multiple-choice',
      question: 'Un skill /deploy référence /pre-commit et /check-deploy dans ses instructions. Quel principe de conception ça suit ?',
      options: [
        'Injection de dépendance — les skills injectent du comportement entre eux',
        'Responsabilité unique — chaque skill fait une chose, le chaînage les combine',
        'Héritage — le skill deploy hérite de pre-commit',
        'Abstraction — cacher les détails d\'implémentation',
      ],
      correctIndex: 1,
      explanation: 'Les skills peuvent référencer d\'autres skills pour créer de l\'automatisation composable. Le principe clé est la responsabilité unique — chaque skill fait une seule chose bien, et le chaînage les combine. Ça reprend les pipes Unix : des petits outils composés en workflows complexes.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce skill de déploiement qui chaîne d\'autres skills dans un pipeline :',
      language: 'markdown',
      filename: '.claude/commands/ship.md',
      template: "# Ship to Production\n\nExecute this deployment pipeline in order:\n\n1. Run the {{pre_check}} checks (lint, typecheck, test)\n2. If all checks pass, commit with a {{commit_style}} commit message\n3. Push to origin main\n4. Wait 30 seconds, then run {{verify_cmd}} to verify\n5. If deployment fails, immediately run `git revert HEAD` and push\n\nReport final status: deployed successfully or rolled back with error details.",
      blanks: [
        { id: 'pre_check', answer: '/pre-commit', alternatives: ['pre-commit'], placeholder: 'quel skill ?', hint: 'La commande slash qui lance lint, typecheck et tests' },
        { id: 'commit_style', answer: 'conventional', alternatives: ['conventional-commit', 'conventionnel'], placeholder: 'format de commit ?', hint: 'Le format de message de commit qui utilise des préfixes comme feat:, fix:, refactor:' },
        { id: 'verify_cmd', answer: '/check-deploy', alternatives: ['check-deploy'], placeholder: 'skill de vérification ?', hint: 'Une commande slash qui vérifie que le déploiement a réussi' },
      ],
      explanation: 'Le skill /ship chaîne /pre-commit pour les vérifications de qualité, utilise les commits conventionnels pour un historique clair, et lance /check-deploy pour vérifier. Si le déploiement échoue, il auto-revert. Des petits skills focalisés se combinent en pipelines puissants.',
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
      type: 'multiple-choice',
      question: 'Tu as une check-list personnelle de revue de code que tu utilises sur tous tes projets. Où ce fichier de skill devrait-il vivre ?',
      options: [
        '.claude/commands/ (niveau projet)',
        '~/.claude/commands/ (niveau utilisateur)',
        'CLAUDE.md (instructions du projet)',
        'package.json (config du projet)',
      ],
      correctIndex: 1,
      explanation: 'Les skills au niveau utilisateur dans ~/.claude/commands/ sont disponibles dans chaque projet que tu ouvres — idéal pour les workflows personnels. Les skills au niveau projet dans .claude/commands/ sont pour les workflows d\'équipe partagés committés dans git. Quand un collègue pull le repo, il obtient tous les skills de projet automatiquement.',
    },
    {
      type: 'terminal',
      instruction: 'Liste tous les skills disponibles (commandes slash) dans ta session Claude Code actuelle :',
      expectedCommand: '/commands',
      hint: 'Utilise la commande slash qui liste toutes les commandes disponibles',
    },

    // === ADVANCED PATTERNS ===
    {
      type: 'code-fill',
      instruction: 'Complète cette config combinée de hooks. Les hooks appliquent des garde-fous automatiquement tandis que les skills fournissent des workflows à la demande :',
      language: 'json',
      filename: '.claude/settings.json',
      template: '{\n  "hooks": {\n    "PreToolUse": [\n      {\n        "matcher": "{{shell_tool}}",\n        "command": "sh .claude/guards/no-force-push.sh"\n      }\n    ],\n    "PostToolUse": [\n      {\n        "matcher": "Write",\n        "command": "npx eslint --fix \\"{{file_env_var}}\\" 2>/dev/null || true"\n      }\n    ],\n    "{{notify_event}}": [\n      {\n        "command": "osascript -e \'display notification \\\"Claude needs you\\\"\'"\n      }\n    ]\n  }\n}',
      blanks: [
        { id: 'shell_tool', answer: 'Bash', alternatives: ['bash'], placeholder: 'quel outil à garder ?', hint: 'L\'outil qui exécute des commandes shell — là où les opérations git dangereuses se passent' },
        { id: 'file_env_var', answer: '$CLAUDE_FILE_PATH', alternatives: ['$claude_file_path'], placeholder: 'var chemin de fichier ?', hint: 'La variable d\'environnement du hook qui contient le fichier en cours d\'opération' },
        { id: 'notify_event', answer: 'Notification', alternatives: ['notification'], placeholder: 'événement d\'alerte ?', hint: 'L\'événement de hook qui se déclenche quand Claude a besoin d\'attention humaine' },
      ],
      explanation: 'Garde les commandes Bash avec PreToolUse pour bloquer le force-push. Auto-lint avec PostToolUse sur Write en utilisant $CLAUDE_FILE_PATH. Envoie des alertes bureau sur les événements Notification. Ensemble, hooks et skills créent un environnement gouverné et automatisé.',
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
