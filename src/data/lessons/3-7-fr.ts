import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-7',
  steps: [
    // === INTRODUCTION (garder le premier passif) ===
    {
      type: 'info',
      title: 'Quand les changements des agents IA se chevauchent',
      body: "Deux agents ont touché des fichiers connexes. Peut-être que les deux ont modifié la configuration du routeur. Peut-être qu'ils ont importé des versions différentes d'un utilitaire partagé. La fusion a des conflits — pas parce que quelqu'un a échoué, mais parce que le travail parallèle crée inévitablement des zones de chevauchement. Cette leçon t'apprend à résoudre ces conflits en comprenant l'intention, pas juste les lignes du diff.",
    },
    // CONVERTI : info → multiple-choice (#1)
    {
      type: 'multiple-choice',
      question: "Qu'est-ce qu'un conflit de fusion te dit sur ta décomposition de flotte ?",
      options: [
        'Ta décomposition était mauvaise et tu dois recommencer',
        'Les agents ont fait des erreurs qui doivent être annulées',
        "T'as trouvé un cas limite dans tes frontières de propriété de fichiers — chaque conflit t'apprend où tracer des lignes plus nettes la prochaine fois",
        "Le travail parallèle d'agents n'est pas fiable et devrait être évité",
      ],
      correctIndex: 2,
      explanation: "Un conflit de fusion ne veut pas dire que ta décomposition était mauvaise. Ça veut dire que t'as trouvé un cas limite dans tes frontières de propriété de fichiers. Chaque conflit t'apprend où tracer des lignes plus nettes la prochaine fois. L'objectif c'est pas zéro conflit — c'est une résolution rapide et confiante quand ils surviennent.",
    },

    // CONVERTI : diagram → interactive-diagram (#2)
    {
      type: 'interactive-diagram',
      title: 'Comment les conflits apparaissent dans le travail de flotte',
      body: "L'Agent A et l'Agent B partent tous les deux de la même base. Chacun modifie des fichiers dans son propre domaine. Mais quand des fichiers partagés sont touchés par les deux, la fusion produit des conflits.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'base', label: 'Base', sublabel: 'branche main', shape: 'rounded' },
          { id: 'a', label: 'Agent A', sublabel: 'feat/auth', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'feat/api', shape: 'rect' },
          { id: 'conflict', label: 'Conflit !', sublabel: 'Fichier partagé modifié', shape: 'diamond', highlight: true },
          { id: 'resolve', label: 'Résolution', sublabel: "Comprendre l'intention", shape: 'rect' },
          { id: 'merged', label: 'Fusionné', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'base', to: 'a', label: 'branche' },
          { from: 'base', to: 'b', label: 'branche' },
          { from: 'a', to: 'conflict', label: 'modifie le routeur' },
          { from: 'b', to: 'conflict', label: 'modifie le routeur' },
          { from: 'conflict', to: 'resolve' },
          { from: 'resolve', to: 'merged' },
        ],
      },
      stages: [
        { highlightNodes: ['base', 'a', 'b'], highlightEdges: [{ from: 'base', to: 'a' }, { from: 'base', to: 'b' }], explanation: 'Les deux agents partent de la même base. Chacun travaille dans son propre worktree sur sa propre branche.' },
        { highlightNodes: ['a', 'b', 'conflict'], highlightEdges: [{ from: 'a', to: 'conflict' }, { from: 'b', to: 'conflict' }], explanation: 'Les deux agents modifient le même fichier partagé (ex : le routeur). Git ne peut pas fusionner automatiquement les deux ensembles de changements.' },
        { highlightNodes: ['conflict', 'resolve', 'merged'], highlightEdges: [{ from: 'conflict', to: 'resolve' }, { from: 'resolve', to: 'merged' }], explanation: "La résolution nécessite de comprendre l'INTENTION de chaque agent, pas juste les lignes du diff. Combine les deux intentions dans le résultat fusionné." },
      ],
    },
    { type: 'checkpoint', xp: 3, message: 'Tu comprends comment le travail parallèle crée des conflits de fusion.' },

    // CONVERTI : info → multiple-choice (#3)
    {
      type: 'multiple-choice',
      question: 'Quand tu résous un conflit de fusion entre deux agents, que devrais-tu lire EN PREMIER ?',
      options: [
        'Le diff git pour voir exactement quelles lignes ont changé',
        'Le log git pour voir quel agent a commité en premier',
        "Le cahier des charges de chaque agent pour comprendre ce qu'ils essayaient d'accomplir",
        'Stack Overflow pour des astuces de résolution de conflits',
      ],
      correctIndex: 2,
      explanation: "Un diff git te montre CE QUI a changé. Il te dit pas POURQUOI. Quand tu résous des conflits d'agents, tu dois comprendre l'intention de chaque agent : qu'est-ce qu'il essayait d'accomplir ? Une ligne qui semble incorrecte isolément peut être critique pour la fonctionnalité d'un agent. Lis le cahier des charges de la tâche, pas juste le diff.",
    },
    // CONVERTI : code-demo → code-fill (#4)
    {
      type: 'code-fill',
      instruction: "C'est un conflit de fusion entre deux agents. Les deux ont modifié le routeur principal. Remplis ce que chaque agent ajoutait :",
      language: 'typescript',
      filename: 'src/routes/index.ts',
      template: "import { Hono } from 'hono'\n\nconst app = new Hono()\n\n// Auth agent added:\nimport { {{authImport}} } from '../auth/routes'\napp.route('/auth', authRoutes)\napp.use('/api/*', {{middlewareName}})\n\n// API agent added:\nimport { {{taskImport}} } from '../api/routes/tasks'\nimport { healthRoutes } from '../api/routes/health'\napp.route('/api/tasks', taskRoutes)\napp.route('/api/{{healthPath}}', healthRoutes)\n\nexport default app",
      blanks: [
        { id: 'authImport', answer: 'authRoutes', placeholder: 'export auth ?', hint: "L'export nommé pour les handlers de routes auth" },
        { id: 'middlewareName', answer: 'authMiddleware', alternatives: ['middleware'], placeholder: 'middleware ?', hint: "Le middleware de vérification JWT qui protège les routes API" },
        { id: 'taskImport', answer: 'taskRoutes', placeholder: 'export tasks ?', hint: "L'export nommé pour les handlers de routes CRUD de tâches" },
        { id: 'healthPath', answer: 'health', placeholder: "chemin de l'endpoint ?", hint: "Le chemin URL pour l'endpoint de health check" },
      ],
      explanation: "Ces changements sont additifs — les deux agents ont ajouté des routes au même fichier. La résolution garde les deux ensembles d'imports et d'enregistrements de routes. L'ordre compte : le middleware avant les routes qu'il protège.",
    },
    { type: 'multiple-choice', question: 'En regardant ce conflit, quelle est la bonne résolution ?', options: ["Garder seulement les changements de l'agent d'auth (il était premier)", "Garder seulement les changements de l'agent d'API (ils sont plus importants)", 'Garder LES DEUX — ils sont additifs, pas contradictoires', 'Réécrire le fichier à partir de zéro'], correctIndex: 2, explanation: "Ces changements sont additifs — les deux agents ont ajouté des routes au même fichier. La résolution est de garder les deux ensembles d'imports et d'enregistrements de routes. Le conflit existe parce que git peut pas dire que les deux changements sont complémentaires, pas contradictoires. Comprendre l'intention révèle ça immédiatement." },
    // CONVERTI : code-demo → code-fill (#5)
    {
      type: 'code-fill',
      instruction: "Complète la bonne résolution qui préserve les intentions des deux agents. L'ordre compte : le middleware avant les routes qu'il protège.",
      language: 'typescript',
      filename: 'src/routes/index.ts',
      template: "import { Hono } from 'hono'\nimport { authRoutes } from '../auth/routes'\nimport { {{mwImport}} } from '../auth/middleware'\nimport { taskRoutes } from '../api/routes/tasks'\nimport { healthRoutes } from '../api/routes/health'\n\nconst app = new Hono()\n\n// Auth routes (public)\napp.route('/{{authPath}}', authRoutes)\n\n// Protected API routes\napp.use('/api/*', {{mwName}})\napp.route('/api/tasks', {{taskVar}})\napp.route('/api/health', healthRoutes)\n\nexport default app",
      blanks: [
        { id: 'mwImport', answer: 'authMiddleware', placeholder: 'import middleware ?', hint: "L'export nommé depuis le fichier middleware auth" },
        { id: 'authPath', answer: 'auth', placeholder: 'chemin route auth ?', hint: "Le préfixe URL pour les endpoints d'authentification" },
        { id: 'mwName', answer: 'authMiddleware', placeholder: 'variable middleware ?', hint: "Le même nom de variable que l'import" },
        { id: 'taskVar', answer: 'taskRoutes', placeholder: 'variable routeur tasks ?', hint: 'La variable contenant les handlers de routes de tâches' },
      ],
      explanation: "Les intentions des deux agents sont préservées. Les routes auth viennent en premier (publiques), puis le middleware protège toutes les routes API, puis les routes de tâches et de santé sont enregistrées. L'ordre garantit que le middleware tourne avant les routes qu'il protège.",
    },
    { type: 'code-diff', title: 'Résoudre un conflit de fusion', body: "Voici une vraie résolution de conflit. L'agent de gauche a ajouté la gestion d'erreurs, l'agent de droite a ajouté la journalisation. La résolution conserve les deux changements dans un ordre logique.", language: 'typescript', filename: 'src/api/handler.ts', before: 'export async function handleRequest(req: Request) {\n  const data = await fetchData(req.url)\n  return new Response(JSON.stringify(data))\n}', after: 'export async function handleRequest(req: Request) {\n  try {\n    console.log(`[API] Processing ${req.url}`)\n    const data = await fetchData(req.url)\n    console.log(`[API] Success: ${data.length} items`)\n    return new Response(JSON.stringify(data))\n  } catch (error) {\n    console.error(`[API] Failed: ${error.message}`)\n    return new Response(JSON.stringify({ error: error.message }), { status: 500 })\n  }\n}' },
    { type: 'compare', title: 'Résolution manuelle vs structurée', body: "Deux approches pour le même conflit de fusion. La résolution manuelle lit les diffs ligne par ligne. La résolution structurée commence par comprendre l'intention de chaque agent avant de toucher au code.", question: 'Quelle approche produit moins de régressions dans le résultat fusionné ?', correctSide: 'right', left: { label: 'Manuelle (Ligne par ligne)', content: "1. Ouvrir le fichier en conflit\n2. Lire les marqueurs <<<<<<< et >>>>>>>\n3. Examiner les deux versions à l'oeil\n4. Choisir les lignes qui « semblent correctes »\n5. Supprimer les marqueurs de conflit\n6. Espérer que rien ne casse\n\nRisques :\n- Rater l'intention subtile derrière un changement\n- Supprimer accidentellement un import nécessaire\n- Erreurs d'ordre (middleware après les routes)\n- Aucune vérification systématique" }, right: { label: "Structurée (Intention d'abord)", content: "1. Lire le cahier des charges de l'Agent A : que voulait-il faire ?\n2. Lire le cahier des charges de l'Agent B : que voulait-il faire ?\n3. Classifier : additif, contradictoire ou structurel ?\n4. Fusionner en combinant les intentions, pas juste les lignes\n5. Vérifier : le résultat satisfait-il LES DEUX cahiers ?\n6. Tester le code fusionné\n\nAvantages :\n- La fusion consciente de l'intention détecte les dépendances cachées\n- L'ordre reflète le flux d'exécution réel\n- Vérification systématique contre les cahiers des charges" }, explanation: "La résolution manuelle traite les conflits comme un problème de texte. La résolution structurée les traite comme un problème d'intention. Quand tu comprends POURQUOI chaque agent a fait ses changements, tu peux fusionner sémantiquement — en gardant la logique correcte, pas juste la syntaxe." },

    { type: 'match', instruction: 'Associe chaque type de conflit à la meilleure stratégie de résolution :', leftItems: ['Même ligne éditée différemment', 'Nouvelle fonction ajoutée par les deux agents', "Conflits d'imports", 'Différences de style/formatage'], rightItems: ['Garder les deux fonctions, renommer si collision de noms', "Choisir la version sémantiquement correcte selon l'intention", "Fusionner les listes d'imports (union des deux)", 'Appliquer les conventions du projet depuis le CLAUDE.md'], correctPairs: { 0: 1, 1: 0, 2: 2, 3: 3 }, explanation: "Les éditions de la même ligne nécessitent de comprendre l'intention pour choisir la bonne version. Les fonctions en double sont généralement additives — garde les deux. Les conflits d'imports se résolvent presque toujours en fusionnant les listes. Les différences de style doivent suivre les conventions du projet, pas les préférences individuelles de chaque agent." },

    { type: 'checkpoint', xp: 5, message: "Tu résous les conflits en comprenant l'intention, pas en choisissant un camp." },

    // CONVERTI : info → multiple-choice (#6)
    {
      type: 'multiple-choice',
      question: 'Quels sont les trois types de conflits de fusion dans le travail de flotte ?',
      options: [
        'Erreurs de syntaxe, erreurs de logique, et erreurs runtime',
        'Additif (les deux ont ajouté des choses), contradictoire (décisions opposées), et structurel (réorganisations différentes)',
        'Simple, moyen, et complexe',
        'Conflits git, conflits TypeScript, et conflits runtime',
      ],
      correctIndex: 1,
      explanation: "Pas tous les conflits sont pareils. Les conflits additifs (les deux agents ont ajouté des choses) sont faciles — garde les deux. Les conflits contradictoires (les agents ont pris des décisions opposées) demandent du jugement. Les conflits structurels (les agents ont réorganisé le même fichier différemment) peuvent nécessiter une troisième approche entièrement.",
    },
    // CONVERTI : code-demo → code-fill (#7)
    {
      type: 'code-fill',
      instruction: 'Complète les commandes de fusion manuelle pour résoudre un conflit additif :',
      language: 'bash',
      filename: 'terminal',
      template: '# See what conflicts exist\ngit {{statusCmd}}\n\n# Open the conflicted file and combine both sides\n# (keep both agents\' additions, fix ordering)\n\n# Mark resolved\ngit {{addCmd}} src/routes/index.ts\ngit commit -m "{{commitMsg}}"',
      blanks: [
        { id: 'statusCmd', answer: 'status', placeholder: 'commande de vérification ?', hint: "Voir l'état actuel de l'arbre de travail" },
        { id: 'addCmd', answer: 'add', placeholder: 'commande de staging ?', hint: 'Mettre le fichier résolu en staging pour le commit' },
        { id: 'commitMsg', answer: 'merge: combine auth and api routes', alternatives: ['merge: combine auth and API routes', 'merge auth and api routes'], placeholder: 'message de commit ?', hint: 'Décris ce qui a été fusionné' },
      ],
      explanation: "Pour les conflits additifs, la résolution est directe : ouvre le fichier, garde les ajouts des deux côtés, corrige l'ordre, mets en staging, et commit. C'est le cas le plus courant dans un travail de flotte bien décomposé.",
    },
    // CONVERTI : code-demo → code-fill (#8)
    {
      type: 'code-fill',
      instruction: "Complète ce prompt de fusion assistée par agent pour les conflits complexes :",
      language: 'markdown',
      filename: 'merge-assist-prompt.md',
      template: "# Merge Assistance Task\n\n## Context\nTwo agents modified src/lib/{{conflictFile}}. I need help resolving.\n\n## Agent A's Intent (from its task spec)\nAdd connection {{poolFeature}} with a max of 10 connections.\nAdd a query timeout of 30 seconds.\n\n## Agent B's Intent (from its task spec)\nAdd {{txFeature}} support with automatic rollback on error.\nAdd query logging for debugging.\n\n## Task\nCombine both agents' changes into a single coherent file\nthat satisfies {{howMany}} specs. If there's a true contradiction\n(not just an overlap), flag it for me to decide.",
      blanks: [
        { id: 'conflictFile', answer: 'database.ts', alternatives: ['database'], placeholder: 'quel fichier ?', hint: 'Le fichier utilitaire de base de données partagé que les deux agents ont modifié' },
        { id: 'poolFeature', answer: 'pooling', alternatives: ['pool'], placeholder: "fonctionnalité Agent A ?", hint: 'Gérer un pool de connexions à la base de données' },
        { id: 'txFeature', answer: 'transaction', alternatives: ['transactions'], placeholder: "fonctionnalité Agent B ?", hint: "Opérations de base de données qui réussissent ou échouent en bloc" },
        { id: 'howMany', answer: 'BOTH', alternatives: ['both'], placeholder: 'combien de cahiers ?', hint: 'La fusion doit satisfaire les exigences des deux agents' },
      ],
      explanation: "Pour les conflits complexes, donne à un agent les deux versions plus le cahier des charges de chaque agent. Il peut raisonner sur la bonne combinaison parce qu'il comprend l'intention derrière chaque changement, pas juste le diff.",
    },
    // CONVERTI : code-demo → code-fill (#9)
    {
      type: 'code-fill',
      instruction: 'Complète les commandes pour la Stratégie 3 : relancer avec de meilleures frontières quand le conflit est structurel :',
      language: 'bash',
      filename: 'terminal',
      template: "# Abort the problematic merge\ngit merge {{abortFlag}}\n\n# Update CLAUDE.md with better file ownership boundaries\n# Agent A owns: src/lib/database-{{fileA}}.ts (new file)\n# Agent B owns: src/lib/database-{{fileB}}.ts (new file)\n# Shared: src/lib/database.ts imports from both ({{whoWrites}} writes)\n\n# Re-run the affected agent with the updated spec\n# Now each agent has {{ownership}} ownership — no conflict possible",
      blanks: [
        { id: 'abortFlag', answer: '--abort', placeholder: "drapeau d'annulation ?", hint: "Le drapeau git merge pour annuler et revenir à l'état pré-fusion" },
        { id: 'fileA', answer: 'pool', alternatives: ['pooling'], placeholder: "suffixe fichier Agent A ?", hint: "Correspond à la fonctionnalité de l'Agent A : pooling de connexions" },
        { id: 'fileB', answer: 'transactions', alternatives: ['tx'], placeholder: "suffixe fichier Agent B ?", hint: "Correspond à la fonctionnalité de l'Agent B : support des transactions" },
        { id: 'whoWrites', answer: 'orchestrator', alternatives: ['you', 'the orchestrator', 'l\'orchestrateur'], placeholder: 'qui écrit les fichiers partagés ?', hint: 'La personne qui coordonne la flotte, pas un agent' },
        { id: 'ownership', answer: 'exclusive', alternatives: ['separate', 'sole'], placeholder: 'type de propriété ?', hint: 'Chaque agent possède son fichier sans chevauchement' },
      ],
      explanation: "Quand deux agents ont fondamentalement réorganisé le même code différemment, la correction la plus rapide est d'améliorer les frontières et de relancer. Divise le fichier contesté en morceaux appartenant à chaque agent avec un fichier partagé que seul l'orchestrateur écrit. Ça élimine entièrement le conflit.",
    },
    { type: 'multiple-choice', question: "Deux agents ont tous les deux refactorisé la même fonction utilitaire différemment. L'un l'a rendue async, l'autre l'a divisée en deux fonctions. Quelle stratégie ?", options: ['Fusion manuelle — combiner les deux refactorisations', "Assistée par agent — laisser un agent s'en occuper", 'Relancer avec de meilleures frontières — le conflit est structurel', 'Garder celui des agents qui a fini en premier'], correctIndex: 2, explanation: "C'est un conflit structurel — deux réorganisations incompatibles du même code. Tu peux pas combiner 'rendre async' avec 'diviser en deux fonctions' sans comprendre quelle approche sert mieux le projet. Mieux vaut clarifier la propriété et relancer un agent avec la bonne approche spécifiée." },
    { type: 'checkpoint', xp: 5, message: 'Tu connais trois stratégies de résolution et quand utiliser chacune.' },

    // CONVERTI : info → multiple-choice (#10)
    {
      type: 'multiple-choice',
      question: "Après avoir résolu un conflit, que devrais-tu faire pour empêcher la même classe de conflit à l'avenir ?",
      options: [
        "Espérer que ça n'arrive plus",
        'Ajouter un commentaire dans le fichier contesté disant « ne modifie pas »',
        "Se demander pourquoi deux agents ont touché le même fichier, puis mettre à jour le CLAUDE.md avec la propriété explicite des fichiers ou diviser le fichier en morceaux par agent",
        "Réduire le nombre d'agents dans les futures exécutions de flotte",
      ],
      correctIndex: 2,
      explanation: "Chaque conflit est une leçon. Après avoir résolu, demande-toi : pourquoi deux agents ont touché le même fichier ? Corrections courantes : extraire un fichier partagé que seul l'orchestrateur écrit, diviser un gros fichier en morceaux appartenant à chaque agent, ou ajouter une règle dans le CLAUDE.md qui assigne explicitement le fichier contesté.",
    },
    // CONVERTI : code-demo → code-fill (#11)
    {
      type: 'code-fill',
      instruction: 'Complète ce guide de prévention des conflits pour les principales zones chaudes de la flotte :',
      language: 'markdown',
      filename: 'conflict-prevention.md',
      template: "# Conflict Prevention Playbook\n\n## 1. Router/App Configuration Files\nProblem: Every agent adds its routes to the same file.\nFix: Each agent exports routes from its own directory.\n     {{whoRouter}} writes the top-level router that imports all.\n\n## 2. Package.json / Dependencies\nProblem: Multiple agents install different packages.\nFix: Orchestrator {{preAction}} all dependencies before dispatch.\n     CLAUDE.md lists approved packages — agents don't add new ones.\n\n## 3. Shared Type Definitions\nProblem: Agents extend the same interface differently.\nFix: {{contractFile}} is {{accessMode}}. Each agent defines local types\n     that extend the shared ones in their own directories.\n\n## 4. CSS / Global Styles\nProblem: Agents add conflicting global styles.\nFix: {{cssStrategy}} (no globals). Each component is\n     self-contained. No agent modifies global.css.",
      blanks: [
        { id: 'whoRouter', answer: 'Orchestrator', alternatives: ['orchestrator', 'You', 'you'], placeholder: 'qui écrit le routeur ?', hint: 'La personne qui coordonne la flotte, pas un agent' },
        { id: 'preAction', answer: 'pre-installs', alternatives: ['installs', 'pre-install'], placeholder: 'action dépendances ?', hint: 'Installer tous les packages nécessaires avant que les agents commencent' },
        { id: 'contractFile', answer: 'contracts.ts', alternatives: ['contracts', 'the contracts file'], placeholder: 'fichier de types partagé ?', hint: 'Le fichier contenant les définitions d\'interfaces partagées' },
        { id: 'accessMode', answer: 'read-only', alternatives: ['readonly', 'read only'], placeholder: "niveau d'accès ?", hint: 'Les agents peuvent le lire mais pas le modifier' },
        { id: 'cssStrategy', answer: 'Tailwind utility-first', alternatives: ['Tailwind', 'tailwind utility-first', 'Utility-first CSS'], placeholder: 'approche CSS ?', hint: 'Un framework CSS utility-first qui évite les styles globaux' },
      ],
      explanation: "Chaque règle de prévention élimine une classe de conflit avant que les agents commencent. L'orchestrateur possède les fichiers partagés. Les dépendances sont pré-installées. Les contrats sont en lecture seule. Le CSS utilise des classes utilitaires au lieu de globaux.",
    },
    { type: 'order', instruction: 'Après avoir résolu un conflit, classe ces actions de prévention de la PLUS efficace (haut) à la MOINS efficace :', items: ['Mettre à jour le CLAUDE.md avec la propriété explicite des fichiers pour la zone contestée', 'Diviser le fichier contesté en morceaux appartenant à chaque agent', 'Ajouter un commentaire dans le fichier disant « ne modifie pas ça »', "Dire verbalement aux agents d'éviter ce fichier la prochaine fois"], correctOrder: [1, 0, 2, 3] },

    { type: 'terminal', instruction: 'Commence la fusion de la branche API et observe le conflit :', expectedCommand: 'git merge feat/api --no-ff', hint: 'Utilise git merge avec le drapeau --no-ff' },
    { type: 'terminal', instruction: 'Regarde quels fichiers ont des conflits :', expectedCommand: 'git diff --name-only --diff-filter=U', hint: 'git diff avec --name-only et --diff-filter=U montre seulement les fichiers en conflit (non fusionnés)' },
    { type: 'terminal', instruction: 'Après avoir résolu le conflit dans ton éditeur, marque-le comme résolu et complète la fusion :', expectedCommand: 'git add . && git commit --no-edit', hint: 'Stage les fichiers résolus et commit (--no-edit utilise le message de fusion par défaut)' },

    // CONVERTI : diagram → interactive-diagram (#12)
    {
      type: 'interactive-diagram',
      title: 'Arbre de décision pour la résolution de conflits',
      body: "Utilise cet arbre de décision quand tu rencontres un conflit de fusion. La nature du conflit détermine la stratégie.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'conflict', label: 'Conflit', shape: 'rounded' },
          { id: 'nature', label: 'Nature ?', shape: 'diamond' },
          { id: 'additive', label: 'Additif', sublabel: 'Les deux ont ajouté', shape: 'rect' },
          { id: 'contra', label: 'Contradictoire', sublabel: 'Choix opposés', shape: 'rect' },
          { id: 'struct', label: 'Structurel', sublabel: 'Réorgs différentes', shape: 'rect' },
          { id: 'combine', label: 'Combiner les deux', shape: 'pill', highlight: true },
          { id: 'decide', label: 'Choisir + Maj cahier', shape: 'pill', highlight: true },
          { id: 'rerun', label: "Relancer l'agent", shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'conflict', to: 'nature' },
          { from: 'nature', to: 'additive', label: 'les deux ajoutent' },
          { from: 'nature', to: 'contra', label: 'opposés' },
          { from: 'nature', to: 'struct', label: 'réorganisé' },
          { from: 'additive', to: 'combine' },
          { from: 'contra', to: 'decide' },
          { from: 'struct', to: 'rerun' },
        ],
      },
      stages: [
        { highlightNodes: ['conflict', 'nature'], highlightEdges: [{ from: 'conflict', to: 'nature' }], explanation: "D'abord, classifie le conflit. Lis le cahier des charges de chaque agent pour comprendre leur intention." },
        { highlightNodes: ['nature', 'additive', 'combine'], highlightEdges: [{ from: 'nature', to: 'additive' }, { from: 'additive', to: 'combine' }], explanation: "Additif : les deux agents ont ajouté des choses au même fichier. Garde les deux, corrige l'ordre. Le plus courant dans un travail de flotte bien décomposé." },
        { highlightNodes: ['nature', 'contra', 'decide'], highlightEdges: [{ from: 'nature', to: 'contra' }, { from: 'contra', to: 'decide' }], explanation: "Contradictoire : les agents ont pris des décisions opposées. Choisis selon les besoins du projet et mets à jour le cahier pour empêcher la récurrence." },
        { highlightNodes: ['nature', 'struct', 'rerun'], highlightEdges: [{ from: 'nature', to: 'struct' }, { from: 'struct', to: 'rerun' }], explanation: "Structurel : les agents ont réorganisé le même code différemment. Annule la fusion, améliore les frontières dans le CLAUDE.md, relance l'agent concerné." },
      ],
    },
    { type: 'checklist', title: 'Liste de vérification pour la résolution de conflits', items: ['Lire le cahier des charges de chaque agent avant de regarder le diff', 'Classifier le conflit : additif, contradictoire ou structurel', "Additif : combiner les deux côtés, corriger l'ordre", 'Contradictoire : choisir selon les besoins du projet, mettre à jour le CLAUDE.md', "Structurel : annuler la fusion, améliorer les frontières, relancer l'agent concerné", 'Après résolution : mettre à jour le CLAUDE.md pour prévenir cette classe de conflit', 'Documenter le pattern dans ton guide de prévention des conflits'] },
    { type: 'checkpoint', xp: 7, message: "Résolution de conflits maîtrisée ! Les changements qui se chevauchent, c'est normal et réparable." },
  ],
}

export default content
