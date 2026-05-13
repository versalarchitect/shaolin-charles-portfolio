import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-5',
  steps: [
    // === INTRODUCTION (garder les 2 premiers passifs) ===
    { type: 'info', title: "Lancer votre première flotte d'agents", body: "C'est le moment. Tout ce que vous avez appris — décomposition, worktrees, CLAUDE.md, graphes de tâches — converge ici. Vous allez lancer 3-5 agents simultanément, chacun construisant une fonctionnalité différente, chacun dans son propre worktree, tous coordonnés par un fichier de contexte partagé. Pensez à vous comme le centre de contrôle de mission : vous ne pilotez pas les fusées, mais vous suivez chacune d'elles." },
    { type: 'info', title: "L'état d'esprit d'orchestrateur", body: "Votre rôle change complètement. Vous ne guidez plus un seul agent à travers une fonctionnalité. Vous gérez une flotte : assigner les tâches, surveiller l'avancement, intervenir quand quelque chose ne va pas, et fusionner les résultats en un tout cohérent. La compétence n'est pas dans le prompting — c'est dans la coordination." },

    // CONVERTI : diagram → interactive-diagram (#1)
    {
      type: 'interactive-diagram',
      title: 'Hub et rayons : Architecture de flotte',
      body: "Vous êtes le hub. Chaque agent est un rayon travaillant dans son propre worktree isolé. Tous les rayons lisent le CLAUDE.md partagé. Tous les résultats fusionnent par vous. Aucun agent ne communique directement avec un autre — toute la coordination passe par le hub.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'you', label: 'Vous', sublabel: 'Orchestrateur', shape: 'rounded', highlight: true },
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Contexte partagé', shape: 'rect' },
          { id: 'a1', label: 'Agent 1', sublabel: 'Auth', shape: 'rect' },
          { id: 'a2', label: 'Agent 2', sublabel: 'API', shape: 'rect' },
          { id: 'a3', label: 'Agent 3', sublabel: 'UI', shape: 'rect' },
          { id: 'a4', label: 'Agent 4', sublabel: 'Tests', shape: 'rect' },
          { id: 'merge', label: 'Fusion', sublabel: 'Intégration', shape: 'rect' },
          { id: 'done', label: 'Livrer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'you', to: 'claude', label: 'écrit' },
          { from: 'claude', to: 'a1', label: 'lit' },
          { from: 'claude', to: 'a2', label: 'lit' },
          { from: 'claude', to: 'a3', label: 'lit' },
          { from: 'claude', to: 'a4', label: 'lit' },
          { from: 'you', to: 'a1', label: 'assigne' },
          { from: 'you', to: 'a2', label: 'assigne' },
          { from: 'you', to: 'a3', label: 'assigne' },
          { from: 'you', to: 'a4', label: 'assigne' },
          { from: 'a1', to: 'merge' },
          { from: 'a2', to: 'merge' },
          { from: 'a3', to: 'merge' },
          { from: 'a4', to: 'merge' },
          { from: 'merge', to: 'done' },
        ],
      },
      stages: [
        { highlightNodes: ['you', 'claude'], highlightEdges: [{ from: 'you', to: 'claude' }], explanation: "Vous écrivez CLAUDE.md — le contexte partagé que chaque agent lit. C'est votre source unique de vérité pour l'architecture, les conventions et les contrats." },
        { highlightNodes: ['you', 'a1', 'a2', 'a3', 'a4'], highlightEdges: [{ from: 'you', to: 'a1' }, { from: 'you', to: 'a2' }, { from: 'you', to: 'a3' }, { from: 'you', to: 'a4' }], explanation: "Vous assignez à chaque agent une tâche spécifique avec la propriété exclusive des fichiers. Aucun agent ne touche les mêmes fichiers qu'un autre." },
        { highlightNodes: ['claude', 'a1', 'a2', 'a3', 'a4'], highlightEdges: [{ from: 'claude', to: 'a1' }, { from: 'claude', to: 'a2' }, { from: 'claude', to: 'a3' }, { from: 'claude', to: 'a4' }], explanation: "Tous les agents lisent CLAUDE.md pour les conventions et contrats partagés. Aucun agent ne communique directement avec un autre — toute la coordination passe par le hub." },
        { highlightNodes: ['a1', 'a2', 'a3', 'a4', 'merge', 'done'], highlightEdges: [{ from: 'a1', to: 'merge' }, { from: 'a2', to: 'merge' }, { from: 'a3', to: 'merge' }, { from: 'a4', to: 'merge' }, { from: 'merge', to: 'done' }], explanation: "Tous les résultats fusionnent par vous. Vérifiez l'intégration, résolvez les conflits éventuels, puis livrez." },
      ],
    },
    { type: 'checkpoint', xp: 3, message: 'Vous comprenez le modèle hub-et-rayons de flotte.' },

    // CONVERTI : info → multiple-choice (#2)
    {
      type: 'multiple-choice',
      question: "Pourquoi chaque agent obtient-il son propre worktree git au lieu de travailler dans le même répertoire ?",
      options: [
        'Les worktrees font tourner le code plus vite',
        "Les worktrees isolent chaque agent sur sa propre branche pour qu'ils ne puissent pas accidentellement écraser le travail de l'autre",
        'Git exige des worktrees pour le développement parallèle',
        'Les worktrees résolvent automatiquement les conflits de fusion',
      ],
      correctIndex: 1,
      explanation: "Chaque agent obtient son propre worktree git — une copie isolée du codebase sur sa propre branche. Ça signifie que les agents ne peuvent pas accidentellement écraser le travail de l'autre. Chaque worktree est un répertoire séparé sur votre système de fichiers, tous partageant le même historique git.",
    },
    { type: 'terminal', instruction: "Créez un worktree pour l'agent auth sur une nouvelle branche :", expectedCommand: 'git worktree add ../fleet-auth -b feat/auth', hint: 'git worktree add <chemin> -b <nom-branche>' },
    { type: 'terminal', instruction: 'Créez les worktrees pour les agents API et UI :', expectedCommand: 'git worktree add ../fleet-api -b feat/api && git worktree add ../fleet-ui -b feat/ui', hint: 'Enchaînez deux commandes git worktree add avec && pour les agents api et ui' },
    // CONVERTI : code-demo → code-fill (#3)
    {
      type: 'code-fill',
      instruction: 'Complétez ce script de configuration de flotte qui crée les worktrees pour le travail parallèle :',
      language: 'bash',
      filename: 'setup-fleet.sh',
      template: '#!/bin/bash\n# Fleet setup: create worktrees for parallel agent work\n\nAGENTS=("auth" "{{agent2}}" "{{agent3}}" "tests")\n\nfor agent in "${AGENTS[@]}"; do\n  echo "Creating worktree for $agent..."\n  git {{wtCommand}} "../fleet-$agent" -b "{{branchPrefix}}/$agent"\ndone\n\n# Verify all worktrees\ngit worktree {{listCmd}}\n\necho "Fleet ready. {{numAgents}} worktrees created."',
      blanks: [
        { id: 'agent2', answer: 'api', alternatives: ['backend'], placeholder: 'deuxième agent ?', hint: "L'agent qui construit les endpoints API" },
        { id: 'agent3', answer: 'ui', alternatives: ['frontend'], placeholder: 'troisième agent ?', hint: "L'agent qui construit l'interface utilisateur" },
        { id: 'wtCommand', answer: 'worktree add', placeholder: 'sous-commande git ?', hint: 'La commande git pour créer un nouveau worktree' },
        { id: 'branchPrefix', answer: 'feat', alternatives: ['feature'], placeholder: 'préfixe de branche ?', hint: 'Convention pour les branches de fonctionnalité' },
        { id: 'listCmd', answer: 'list', placeholder: 'commande de vérification ?', hint: 'Afficher tous les worktrees existants' },
        { id: 'numAgents', answer: '4', placeholder: 'nombre ?', hint: 'auth, api, ui, tests' },
      ],
      explanation: "Le script boucle sur les noms d'agents, crée un worktree par agent avec une branche de fonctionnalité, puis vérifie que tous les worktrees ont été créés. Exécutez ceci une fois avant de répartir les agents.",
    },
    { type: 'checkpoint', xp: 5, message: "L'infrastructure de flotte est prête." },

    // CONVERTI : info → multiple-choice (#4)
    {
      type: 'multiple-choice',
      question: "Qu'est-ce qui fait une bonne spécification de tâche par agent ?",
      options: [
        "Une description de haut niveau comme \"construire le système d'auth\"",
        "Les fichiers exacts à créer, les contrats à suivre, et une définition de \"terminé\" — assez détaillée pour que l'agent n'ait jamais besoin de poser une question",
        'Un lien vers le README du projet et une liste de souhaits de fonctionnalités',
        "Une conversation où vous expliquez la tâche étape par étape pendant que l'agent travaille",
      ],
      correctIndex: 1,
      explanation: "Chaque agent a besoin d'une spécification de tâche claire et autonome incluant : quoi construire, quels fichiers créer/modifier, les contrats à suivre, et la définition de « terminé ». La spec doit être assez détaillée pour que l'agent n'ait jamais besoin de vous poser une question.",
    },
    // CONVERTI : code-demo + code-demo → compare (#5)
    {
      type: 'compare',
      title: 'Spécifications par agent : Auth vs API',
      body: "Chaque agent obtient sa propre spec tout aussi spécifique. Remarquez comment la propriété des fichiers est explicite et ne chevauche pas entre les agents.",
      question: "Quelle propriété clé empêche les conflits de fusion entre ces deux agents ?",
      correctSide: 'left',
      left: {
        label: 'Agent 1 : Auth',
        content: "Périmètre : Auth email/mot de passe avec tokens JWT\n\nFichiers à créer :\n- src/auth/login.ts\n- src/auth/signup.ts\n- src/auth/middleware.ts\n- src/auth/schemas.ts\n- src/auth/__tests__/login.test.ts\n- src/auth/__tests__/signup.test.ts\n\nContrats :\n- Importer User type depuis src/types/contracts.ts\n- Payload JWT : { userId, email, role }\n- Retourner ApiResponse<{ token: string }>\n\nClé : Propriété exclusive de src/auth/*",
      },
      right: {
        label: 'Agent 2 : API',
        content: "Périmètre : Endpoints CRUD pour les tâches\n\nFichiers à créer :\n- src/api/routes/tasks.ts\n- src/api/routes/health.ts\n- src/api/schemas.ts\n- src/api/__tests__/tasks.test.ts\n\nContrats :\n- Importer Task, ApiResponse depuis contracts.ts\n- Utiliser le middleware auth (chemin d'import seulement)\n- Toutes les réponses encapsulées dans ApiResponse<T>\n\nClé : Propriété exclusive de src/api/*",
      },
      explanation: "La propriété exclusive des fichiers est la clé. L'agent auth ne crée des fichiers que dans src/auth/*, l'agent API que dans src/api/*. Aucun chevauchement signifie aucun conflit de fusion. Les deux agents référencent le même contracts.ts mais aucun ne le modifie.",
    },
    { type: 'multiple-choice', question: "L'agent API doit importer le middleware auth mais l'agent auth le construit en parallèle. Comment ça se gère ?", options: ["L'agent API attend que l'agent auth finisse", "L'agent API importe le chemin — il se résoudra après la fusion", "L'agent API construit son propre middleware auth", "Vous construisez le middleware auth d'abord, puis lancez les deux agents"], correctIndex: 1, explanation: "L'agent API code contre l'interface (chemin d'import + comportement attendu), pas l'implémentation. Après la fusion, l'import se résout. C'est pourquoi les contrats sont définis en amont — les agents travaillent contre des interfaces convenues, pas contre le code réel de l'autre." },
    { type: 'checkpoint', xp: 5, message: 'Vous pouvez écrire des spécifications autonomes pour chaque agent.' },

    // CONVERTI : info → multiple-choice (#6)
    {
      type: 'multiple-choice',
      question: "À quelle fréquence devriez-vous vérifier l'avancement de chaque agent lors de la première exécution de flotte ?",
      options: [
        'Une fois à la toute fin quand tous les agents ont terminé',
        'Toutes les 2-3 minutes — vérifier git status dans chaque worktree pour voir si des fichiers apparaissent',
        'Surveiller en continu chaque frappe en temps réel',
        "Seulement quand un agent demande explicitement de l'aide",
      ],
      correctIndex: 1,
      explanation: "Une fois les agents lancés, votre travail est d'observer, pas d'attendre. Vérifiez l'avancement de chaque agent périodiquement. Des fichiers qui apparaissent signifient que le travail avance. Aucun changement après 5 minutes peut signifier que l'agent est bloqué. Les bons orchestrateurs vérifient toutes les 2-3 minutes pendant la première exécution, puis se détendent.",
    },
    // CONVERTI : code-demo → code-fill (#7)
    {
      type: 'code-fill',
      instruction: "Complétez ce script de vérification d'état de flotte pour surveiller tous les agents :",
      language: 'bash',
      filename: 'check-fleet.sh',
      template: '#!/bin/bash\n# Quick fleet status check\n\necho "=== Auth Agent ==="\ngit -C ../{{authDir}} status --short\n\necho "=== API Agent ==="\ngit -C ../{{apiDir}} {{statusCmd}}\n\necho "=== UI Agent ==="\ngit -C ../fleet-ui status --{{shortFlag}}\n\necho "=== Tests Agent ==="\ngit -C ../fleet-tests status --short',
      blanks: [
        { id: 'authDir', answer: 'fleet-auth', placeholder: 'répertoire auth ?', hint: 'Suit le patron fleet-<nom-agent>' },
        { id: 'apiDir', answer: 'fleet-api', placeholder: 'répertoire api ?', hint: 'Suit le patron fleet-<nom-agent>' },
        { id: 'statusCmd', answer: 'status --short', alternatives: ['status -s'], placeholder: 'commande git ?', hint: 'La même commande git status utilisée pour les autres agents' },
        { id: 'shortFlag', answer: 'short', alternatives: ['s'], placeholder: 'drapeau ?', hint: 'Format de sortie compact pour git status' },
      ],
      explanation: "Vérifier git status dans chaque worktree est un moyen rapide de voir où en est chaque agent. Des fichiers qui apparaissent signifient que le travail avance. Aucun changement après 5 minutes peut signifier que l'agent est bloqué.",
    },
    { type: 'checklist', title: "Déclencheurs d'intervention — quand intervenir", items: ["L'agent tourne depuis 10+ minutes sans nouveau fichier (probablement bloqué en boucle)", "L'agent crée des fichiers hors de son répertoire désigné (dérive de périmètre)", "L'agent modifie les fichiers de contrats partagés (viole les règles CLAUDE.md)", "L'agent installe de nouvelles dépendances non prévues dans la spec (hors-piste)", "L'agent pose une question indiquant qu'il a mal compris la tâche"] },
    { type: 'multiple-choice', question: "L'agent 3 (UI) tourne depuis 12 minutes et a créé 0 fichier. Que faites-vous ?", options: ['Attendre plus longtemps — certaines tâches prennent du temps à démarrer', "Tuer l'agent et relancer avec une tâche plus simple", "Vérifier ce que l'agent fait — il est peut-être bloqué dans une boucle de planification", 'Réduire le périmètre de la tâche et diviser en deux agents'], correctIndex: 2, explanation: "D'abord, diagnostiquez. L'agent est peut-être bloqué dans une boucle d'analyse, en train de se battre avec une erreur de type, ou en attente de quelque chose. Vérifiez son état actuel avant de décider de tuer, relancer ou ajuster. La plupart des agents 'bloqués' ont juste besoin d'un coup de pouce — une clarification ou un point de départ plus simple." },

    // CONVERTI : info → multiple-choice (#8)
    {
      type: 'multiple-choice',
      question: 'Tous les agents ont terminé. Quelle est la stratégie de fusion pour les résultats de la flotte ?',
      options: [
        "Fusionner toutes les branches en une seule fois avec une seule commande",
        "Fusionner les branches une par une avec --no-ff, en commençant par la branche la plus indépendante",
        'Cherry-pick des commits individuels de chaque branche',
        'Copier les fichiers manuellement de chaque worktree dans main',
      ],
      correctIndex: 1,
      explanation: "Fusionnez les branches séquentiellement avec --no-ff pour préserver l'historique des branches. Commencez par la branche la plus indépendante et progressez vers celle avec le plus de code partagé. Si vous avez suivi la propriété exclusive des fichiers et les contrats partagés, la fusion devrait être propre.",
    },
    { type: 'terminal', instruction: 'Fusionnez la branche auth dans main :', expectedCommand: 'git merge feat/auth --no-ff', hint: "Utilisez git merge avec --no-ff pour préserver l'historique des branches" },
    { type: 'terminal', instruction: 'Fusionnez toutes les branches restantes :', expectedCommand: 'git merge feat/api --no-ff && git merge feat/ui --no-ff && git merge feat/tests --no-ff', hint: 'Enchaînez les commandes git merge pour les branches api, ui et tests avec --no-ff' },
    // CONVERTI : code-demo → code-fill (#9)
    {
      type: 'code-fill',
      instruction: 'Complétez le script de vérification post-fusion qui contrôle le codebase intégré :',
      language: 'bash',
      filename: 'verify-merge.sh',
      template: '#!/bin/bash\n# Post-fleet-merge verification\n\necho "Checking TypeScript compilation..."\nnpx {{tscCmd}}\n\necho "Running linter..."\nbun run {{lintCmd}}\n\necho "Running all tests..."\nbun {{testCmd}}\n\necho "Building production bundle..."\nbun run {{buildCmd}}\n\necho "Integration verified. Fleet output is clean."',
      blanks: [
        { id: 'tscCmd', answer: 'tsc --noEmit', alternatives: ['tsc --noEmit --pretty'], placeholder: 'commande typecheck ?', hint: "Compilateur TypeScript avec drapeau pour seulement vérifier les types, pas émettre de fichiers" },
        { id: 'lintCmd', answer: 'lint', placeholder: 'script lint ?', hint: "Le nom du script npm pour le linting" },
        { id: 'testCmd', answer: 'test', alternatives: ['test --run'], placeholder: 'commande test ?', hint: 'Lancer tous les tests' },
        { id: 'buildCmd', answer: 'build', placeholder: 'script build ?', hint: "Le nom du script npm pour le build de production" },
      ],
      explanation: "Après avoir fusionné toutes les branches, lancez le pipeline CI complet : typecheck, lint, test, build. C'est le test d'intégration pour les résultats de votre flotte. Si les quatre passent, vous pouvez faire confiance au résultat fusionné.",
    },
    { type: 'checkpoint', xp: 5, message: "Vous pouvez fusionner les résultats de la flotte et vérifier l'intégration." },

    { type: 'code-fill', instruction: 'Complétez le script de lancement de flotte pour configurer des espaces de travail parallèles :', language: 'bash', filename: 'launch-fleet.sh', template: '#!/bin/bash\nAGENTS=("{{agent1}}" "{{agent2}}" "ui" "tests")\n\nfor agent in "${AGENTS[@]}"; do\n  git worktree add ../fleet-$agent -b {{branchPrefix}}/$agent\ndone\n\n# Launch agents in parallel\ncd ../{{worktree1}} && claude "Implement JWT auth" &\ncd ../{{worktree2}} && claude "Build REST endpoints" &\nwait\necho "Fleet complete."', blanks: [{ id: 'agent1', answer: 'auth', alternatives: ['authentication'], placeholder: 'nom du premier agent ?', hint: "L'agent responsable de login/signup" }, { id: 'agent2', answer: 'api', alternatives: ['backend', 'server'], placeholder: 'nom du deuxième agent ?', hint: "L'agent qui construit les endpoints" }, { id: 'branchPrefix', answer: 'feat', alternatives: ['feature'], placeholder: 'préfixe de branche ?', hint: 'Convention pour les branches de fonctionnalité' }, { id: 'worktree1', answer: 'fleet-auth', alternatives: ['fleet-authentication'], placeholder: 'chemin worktree auth ?', hint: 'Suit le patron ../fleet-$agent' }, { id: 'worktree2', answer: 'fleet-api', alternatives: ['fleet-backend'], placeholder: 'chemin worktree api ?' }], explanation: "Le script crée un worktree par agent avec une branche de fonctionnalité, puis lance les agents en arrière-plan avec &. La commande `wait` bloque jusqu'à ce que tous les processus en arrière-plan soient terminés." },
    { type: 'interactive-diagram', title: 'Cycle de vie complet de la flotte (étape par étape)', body: 'Parcourez le cycle de vie complet de la flotte, de la préparation à la livraison.', diagram: { direction: 'LR', nodes: [{ id: 'prep', label: 'Prép', sublabel: '5-10 min', shape: 'rounded' }, { id: 'exec', label: 'Exécuter', sublabel: 'Parallèle', shape: 'rect', highlight: true }, { id: 'monitor', label: 'Surveiller', sublabel: 'Suivre la flotte', shape: 'rect' }, { id: 'merge', label: 'Fusionner', sublabel: 'Série', shape: 'rect' }, { id: 'verify', label: 'Vérifier', sublabel: 'Pipeline CI', shape: 'rect' }, { id: 'ship', label: 'Livrer', shape: 'pill', highlight: true }], edges: [{ from: 'prep', to: 'exec' }, { from: 'exec', to: 'monitor' }, { from: 'monitor', to: 'merge' }, { from: 'merge', to: 'verify' }, { from: 'verify', to: 'ship' }] }, stages: [{ highlightNodes: ['prep'], explanation: "Écrivez CLAUDE.md, définissez les contrats, créez les worktrees, rédigez les specs par agent. C'est votre investissement de 5-10 minutes qui économise des heures." }, { highlightNodes: ['prep', 'exec'], highlightEdges: [{ from: 'prep', to: 'exec' }], explanation: 'Lancez tous les agents en parallèle. Chacun tourne dans son propre worktree sur sa propre branche. Temps total = agent le plus lent, pas la somme de tous.' }, { highlightNodes: ['exec', 'monitor'], highlightEdges: [{ from: 'exec', to: 'monitor' }], explanation: 'Vérifiez `git status` dans chaque worktree toutes les 2-3 minutes. Surveillez les agents bloqués (pas de fichiers après 10 min) ou la dérive de périmètre.' }, { highlightNodes: ['monitor', 'merge'], highlightEdges: [{ from: 'monitor', to: 'merge' }], explanation: "Fusionnez les branches séquentiellement : la plus indépendante d'abord, celle avec le plus de code partagé en dernier. Utilisez --no-ff pour préserver l'historique." }, { highlightNodes: ['merge', 'verify'], highlightEdges: [{ from: 'merge', to: 'verify' }], explanation: "Exécutez le pipeline CI complet : typecheck, lint, test, build. C'est le test d'intégration pour les résultats de votre flotte." }, { highlightNodes: ['verify', 'ship'], highlightEdges: [{ from: 'verify', to: 'ship' }], explanation: "Tout passe — livrez. Nettoyez les worktrees. L'exécution de la flotte est terminée." }] },

    // CONVERTI : info → multiple-choice (#10)
    {
      type: 'multiple-choice',
      question: 'Après avoir fusionné toutes les branches de la flotte, pourquoi devriez-vous supprimer les worktrees ?',
      options: [
        'Les worktrees consomment du stockage git et ralentissent les opérations futures',
        "Ils ont rempli leur rôle — les branches sont préservées dans l'historique git via les commits de fusion --no-ff, donc vous pouvez toujours retracer quel agent a construit quoi",
        'Git les supprime automatiquement après la fusion',
        'Vous devez libérer les noms de branches pour la prochaine exécution de flotte',
      ],
      correctIndex: 1,
      explanation: "Après la fusion, les worktrees ont rempli leur rôle. Les branches sont préservées dans l'historique git via les commits de fusion --no-ff, donc vous pouvez toujours retracer quel agent a construit quoi. Nettoyez pour garder votre système de fichiers rangé.",
    },
    { type: 'terminal', instruction: 'Supprimez tous les worktrees de la flotte :', expectedCommand: 'git worktree remove ../fleet-auth && git worktree remove ../fleet-api && git worktree remove ../fleet-ui && git worktree remove ../fleet-tests', hint: 'Enchaînez git worktree remove pour chaque répertoire de flotte' },

    // CONVERTI : diagram → interactive-diagram (#11)
    {
      type: 'interactive-diagram',
      title: 'Cycle de vie complet de la flotte',
      body: "Le cycle de vie complet de la préparation à la livraison. La préparation est rapide (5-10 minutes). L'exécution est parallèle (les agents tournent simultanément). La fusion et vérification est en série (vous intégrez soigneusement). Le temps total est dominé par l'agent le plus lent, pas la somme de toutes les tâches.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'prep', label: 'Prép', sublabel: '5-10 min', shape: 'rounded' },
          { id: 'exec', label: 'Exécuter', sublabel: 'Parallèle', shape: 'rect', highlight: true },
          { id: 'monitor', label: 'Surveiller', sublabel: 'Suivre la flotte', shape: 'rect' },
          { id: 'merge', label: 'Fusionner', sublabel: 'Série', shape: 'rect' },
          { id: 'verify', label: 'Vérifier', sublabel: 'Pipeline CI', shape: 'rect' },
          { id: 'ship', label: 'Livrer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'prep', to: 'exec' },
          { from: 'exec', to: 'monitor' },
          { from: 'monitor', to: 'merge' },
          { from: 'merge', to: 'verify' },
          { from: 'verify', to: 'ship' },
        ],
      },
      stages: [
        { highlightNodes: ['prep'], explanation: 'Préparation : CLAUDE.md, contrats, worktrees, specs par agent. Votre investissement est de 5-10 minutes.' },
        { highlightNodes: ['exec'], explanation: "Exécution : Tous les agents tournent en parallèle. Le temps total est celui de l'agent le plus lent, pas la somme de toutes les tâches." },
        { highlightNodes: ['monitor'], explanation: "Surveillance : Vérifiez git status dans chaque worktree. Intervenez quand les agents sont bloqués ou dérivent de la spec." },
        { highlightNodes: ['merge', 'verify', 'ship'], highlightEdges: [{ from: 'merge', to: 'verify' }, { from: 'verify', to: 'ship' }], explanation: "Intégration : Fusionnez séquentiellement, vérifiez avec le pipeline CI complet, puis livrez. Cette phase en série est la porte de qualité." },
      ],
    },
    { type: 'checklist', title: "Liste de vérification de première exécution de flotte", items: ['CLAUDE.md écrit avec toutes les décisions architecturales', 'Contrats définis dans un fichier de types partagé', 'Worktrees créés pour chaque agent', 'Spécifications par agent avec propriété claire des fichiers', "Surveillance de l'état toutes les 2-3 minutes pendant l'exécution", 'Intervention quand les agents dérivent de la spec ou sont bloqués', "Fusion avec --no-ff pour préserver l'historique des branches", 'Vérification post-fusion : typecheck, lint, test, build', 'Worktrees nettoyés après fusion réussie'] },
    { type: 'checkpoint', xp: 12, message: "Leçon terminée. Vous avez lancé votre première flotte. L'exécution parallèle est votre nouveau défaut." },
  ],
}

export default content
