import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Principe 3 : Lire l\'erreur en premier',
      body: "Lis le message d'erreur. Le message d'erreur au complet. Avant tout le reste. La plupart des développeurs — et la plupart des agents IA — sautent cette étape. Ils voient du texte rouge et commencent à deviner. Ils changent des trucs au hasard. Ils demandent « pourquoi ça marche pas ? » sans lire ce que l'ordinateur leur a déjà dit. Ça gaspille énormément de temps.",
    },
    {
      type: 'info',
      title: 'Les erreurs sont des réponses, pas des problèmes',
      body: "Un message d'erreur, c'est l'ordinateur qui te dit exactement ce qui a mal tourné, où c'est arrivé, et souvent pourquoi. Un stack trace est une carte. Une erreur de type est un diagnostic. Traiter les erreurs comme du bruit, c'est comme ignorer les résultats d'analyse du médecin et deviner ce qui va pas.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Changement de mentalité : les erreurs sont des données.',
    },

    // === DEBUGGING DECISION TREE DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Arbre de décision de débogage',
      body: 'Clique sur chaque étape pour suivre le chemin systématique de débogage.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'err', label: 'Erreur survient', shape: 'rounded', highlight: true },
          { id: 'read', label: 'Lire le message', shape: 'rect' },
          { id: 'rec', label: 'Reconnu ?', shape: 'diamond' },
          { id: 'fix', label: 'Appliquer le correctif', shape: 'rect' },
          { id: 'search', label: 'Chercher l\'erreur', shape: 'rect' },
          { id: 'verify', label: 'Vérifier le correctif', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'err', to: 'read' },
          { from: 'read', to: 'rec' },
          { from: 'rec', to: 'fix', label: 'oui' },
          { from: 'rec', to: 'search', label: 'non' },
          { from: 'fix', to: 'verify' },
          { from: 'search', to: 'verify' },
        ],
      },
      stages: [
        {
          highlightNodes: ['err'],
          highlightEdges: [],
          explanation: 'Une erreur survient. Quelque chose est rouge dans ton terminal ou ta console navigateur. Résiste à l\'envie de commencer à modifier le code immédiatement.',
        },
        {
          highlightNodes: ['err', 'read'],
          highlightEdges: [{ from: 'err', to: 'read' }],
          explanation: 'Lis le message d\'erreur au complet. Pas juste la première ligne — le type, le message, le chemin du fichier, le numéro de ligne et le stack trace. Parse les quatre parties avant de faire quoi que ce soit.',
        },
        {
          highlightNodes: ['read', 'rec'],
          highlightEdges: [{ from: 'read', to: 'rec' }],
          explanation: 'Est-ce que tu reconnais cette erreur ? Un TypeError sur "undefined" signifie des données null. Un SyntaxError signifie une structure cassée. Un ReferenceError signifie que quelque chose manque. Classifie-la.',
        },
        {
          highlightNodes: ['rec', 'fix'],
          highlightEdges: [{ from: 'rec', to: 'fix' }],
          explanation: 'Si tu reconnais l\'erreur, applique le correctif connu directement. Tu as déjà vu "Cannot read properties of undefined" — tu sais qu\'il faut vérifier si les données sont chargées avant d\'y accéder.',
        },
        {
          highlightNodes: ['rec', 'search'],
          highlightEdges: [{ from: 'rec', to: 'search' }],
          explanation: 'Si l\'erreur est inconnue, cherche-la. Colle le message exact dans ton agent ou un moteur de recherche. Inclus le type d\'erreur et la phrase clé, pas le stack trace entier.',
        },
        {
          highlightNodes: ['fix', 'search', 'verify'],
          highlightEdges: [{ from: 'fix', to: 'verify' }, { from: 'search', to: 'verify' }],
          explanation: 'Vérifie toujours. Fais UN seul changement, puis teste. L\'erreur a-t-elle disparu ? Une nouvelle est-elle apparue ? Un changement par cycle t\'empêche d\'introduire de nouveaux problèmes en corrigeant les anciens.',
        },
      ],
    },

    // === ERROR ANATOMY ===
    {
      type: 'info',
      title: 'Anatomie d\'un message d\'erreur',
      body: 'Chaque erreur a quatre parties : le type d\'erreur (quelle catégorie de problème), le message (description lisible par un humain), le fichier et le numéro de ligne (où c\'est arrivé), et le stack trace (la chaîne d\'appels de fonctions qui y a mené). T\'entraîner à parser ces quatre éléments instantanément est la compétence de débogage la plus rentable.',
    },
    {
      type: 'code-demo',
      title: 'Une vraie erreur Node.js, disséquée',
      body: 'Regarde chaque partie. Le type est TypeError. Le message dit ce qui a échoué. L\'emplacement dit où. Le stack dit comment tu y es arrivé.',
      language: 'text',
      filename: 'terminal output',
      code: "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderList (/app/src/components/UserList.tsx:12:18)\n    at Object.render (/app/src/pages/Dashboard.tsx:45:5)\n    at processChild (/app/node_modules/react-dom/server.js:3456:14)\n\n┌─ Type:     TypeError\n├─ Message:  Cannot read properties of undefined (reading 'map')\n├─ File:     src/components/UserList.tsx, line 12\n└─ Cause:    'users' is undefined when .map() is called",
    },
    {
      type: 'multiple-choice',
      question: 'Dans l\'erreur ci-dessus, quel fichier devrais-tu regarder EN PREMIER ?',
      options: [
        'react-dom/server.js',
        'src/pages/Dashboard.tsx',
        'src/components/UserList.tsx',
        'package.json',
      ],
      correctIndex: 2,
      explanation: "Le haut du stack trace pointe vers UserList.tsx ligne 12 — c'est là que l'erreur s'est réellement produite. Commence toujours par le haut du stack, pas par le bas. Ignore les lignes de node_modules.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Anatomie des erreurs maîtrisée !',
    },

    // === ERROR CATEGORIES ===
    {
      type: 'diagram',
      title: 'Catégories d\'erreurs',
      body: 'Chaque erreur tombe dans l\'une de trois catégories. Chacune nécessite une approche de débogage différente.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'error', label: 'Erreur', shape: 'rounded', highlight: true },
          { id: 'type', label: 'Type ?', shape: 'diamond' },
          { id: 'syntax', label: 'Erreur de syntaxe', shape: 'rect' },
          { id: 'runtime', label: 'Erreur d\'exécution', shape: 'rect' },
          { id: 'logic', label: 'Erreur de logique', shape: 'rect' },
          { id: 'code', label: 'Vérifier le code', shape: 'pill' },
          { id: 'data', label: 'Vérifier les données', shape: 'pill' },
          { id: 'logic_fix', label: 'Vérifier la logique', shape: 'pill' },
        ],
        edges: [
          { from: 'error', to: 'type' },
          { from: 'type', to: 'syntax' },
          { from: 'type', to: 'runtime' },
          { from: 'type', to: 'logic' },
          { from: 'syntax', to: 'code' },
          { from: 'runtime', to: 'data' },
          { from: 'logic', to: 'logic_fix' },
        ],
      },
    },
    {
      type: 'info',
      title: 'Catégorie 1 : Erreurs de syntaxe',
      body: "Les erreurs de syntaxe signifient que le code ne peut même pas être parsé. Crochets manquants, typos, mauvais imports. Ce sont les plus faciles — le message d'erreur pointe généralement vers le caractère exact. Le correctif est mécanique : lis le message, va à la ligne, corrige la typo.",
    },
    {
      type: 'code-demo',
      title: 'Exemple d\'erreur de syntaxe',
      body: 'Le parser te dit exactement où est le problème. Ligne 3, token inattendu.',
      language: 'text',
      filename: 'terminal output',
      code: "SyntaxError: Unexpected token '}' at line 3\n\nfunction greet(name: string) {\n  console.log('Hello, ' + name)\n}} // <-- extra closing brace",
    },
    {
      type: 'info',
      title: 'Catégorie 2 : Erreurs d\'exécution',
      body: "Les erreurs d'exécution se produisent quand le code est syntaxiquement valide mais échoue pendant l'exécution. Références null, incompatibilités de types, fichiers manquants. Le code s'est bien parsé mais a rencontré des données incorrectes ou un état inattendu. Ça nécessite de vérifier quelles données existaient réellement au point de l'échec.",
    },
    {
      type: 'info',
      title: 'Catégorie 3 : Erreurs de logique',
      body: "Les erreurs de logique sont les plus difficiles. Le code tourne sans planter mais produit de mauvais résultats. Aucun message d'erreur. Une fonction retourne 0 au lieu de 100. Un filtre supprime les mauvais éléments. Ça nécessite de comprendre l'intention vs le comportement — et c'est là que les agents IA peuvent aider le plus en traçant la logique.",
    },
    {
      type: 'multiple-choice',
      question: 'Ton app s\'affiche mais montre 0 éléments au lieu de 50. Quel type d\'erreur est-ce ?',
      options: [
        'Erreur de syntaxe — le code a une typo',
        'Erreur d\'exécution — quelque chose a planté',
        'Erreur de logique — mauvais comportement, pas de crash',
        'Pas une erreur — 0 éléments est correct',
      ],
      correctIndex: 2,
      explanation: "Pas de crash, pas de message d'erreur, mais une sortie incorrecte. C'est une erreur de logique — le type le plus difficile à déboguer parce qu'il n'y a rien à lire. Tu dois comparer le comportement attendu vs réel.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Catégories d\'erreurs verrouillées !',
    },
    {
      type: 'match',
      instruction: 'Associe chaque type d\'erreur à la bonne approche d\'investigation :',
      leftItems: ['SyntaxError', 'TypeError', 'ReferenceError', 'Erreur de logique'],
      rightItems: ['Vérifier les typos, crochets manquants ou syntaxe invalide', 'Vérifier les types de données — une valeur est-elle null, undefined ou de mauvaise forme ?', 'Vérifier si la variable ou l\'import existe dans ce scope', 'Vérifier la sortie attendue vs réelle — le code tourne mais produit de mauvais résultats'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Chaque type d\'erreur pointe vers une cause profonde différente. Les erreurs de syntaxe sont structurelles, les erreurs de type concernent la forme des données, les erreurs de référence concernent le scope, et les erreurs de logique nécessitent de comparer le comportement attendu vs réel.',
    },
    {
      type: 'compare',
      title: 'Correctif de symptôme vs correctif de cause profonde',
      body: 'Quand un agent rencontre une erreur, il peut corriger le symptôme au lieu de la cause.',
      question: 'Quel correctif résout réellement le problème ?',
      correctSide: 'right',
      left: {
        label: 'Correctif de symptôme',
        content: '// "TypeError: Cannot read property name of null"\n\n// Fix: wrap everything in try-catch\ntry {\n  const name = user.name\n  displayGreeting(name)\n} catch (e) {\n  // silently ignore\n}',
        language: 'typescript',
      },
      right: {
        label: 'Correctif de cause profonde',
        content: '// "TypeError: Cannot read property name of null"\n\n// Fix: handle the null user case\nif (!user) {\n  redirect("/login")\n  return\n}\nconst name = user.name\ndisplayGreeting(name)',
        language: 'typescript',
      },
      explanation: 'Le correctif de symptôme cache l\'erreur avec un try-catch, mais l\'utilisateur voit toujours une page cassée. Le correctif de cause profonde traite POURQUOI user est null et le gère correctement.',
    },

    // === CLASSIFY REAL ERRORS ===
    {
      type: 'order',
      instruction: 'Mets ces étapes de débogage dans le bon ordre :',
      items: [
        'Lire le message d\'erreur au complet',
        'Identifier le type et la catégorie de l\'erreur',
        'Aller au fichier et numéro de ligne',
        'Former une hypothèse sur la cause',
        'Faire UN seul changement et tester',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
    {
      type: 'code-input',
      instruction: 'Tu vois : TypeError: Cannot read properties of null (reading \'name\'). Quelle valeur la variable contient-elle au lieu d\'un objet ?',
      placeholder: 'The variable is ____',
      answer: 'null',
      hint: 'L\'erreur dit "of null" — que contient la variable ?',
    },

    // === PROMPTING AGENTS FOR DEBUGGING ===
    {
      type: 'info',
      title: 'La mauvaise façon de demander de l\'aide à un agent',
      body: "« Ça marche pas » est la chose la plus courante que les développeurs tapent dans les chats IA. C'est aussi la plus inutile. L'agent a zéro information. Il va deviner. Il pourrait suggérer cinq correctifs différents, dont aucun ne correspond à ton vrai problème. Tu perds du temps à essayer chacun.",
    },
    {
      type: 'code-demo',
      title: 'Anti-pattern : prompts de débogage vagues',
      body: 'Ces prompts forcent l\'agent à deviner. Chaque supposition gaspille ton temps.',
      language: 'text',
      filename: 'bad-prompts.txt',
      code: "Bad:  \"My app doesn't work\"\nBad:  \"I'm getting an error in my React component\"\nBad:  \"The data isn't showing up\"\nBad:  \"Something broke after I updated\"",
    },
    {
      type: 'code-demo',
      title: 'Pattern : coller l\'erreur EXACTE',
      body: 'Donne à l\'agent l\'erreur complète, le fichier et ce que tu attendais. Maintenant il peut tracer la cause profonde au lieu de deviner.',
      language: 'text',
      filename: 'good-prompt.txt',
      code: "Good prompt:\n\n\"I'm getting this error when the Dashboard loads:\n\nTypeError: Cannot read properties of undefined (reading 'map')\n  at renderList (src/components/UserList.tsx:12:18)\n  at Dashboard (src/pages/Dashboard.tsx:45:5)\n\nThe `users` prop is fetched in Dashboard from /api/users.\nI expect an array but it seems to be undefined on first render.\nWhat's the root cause and how should I fix it?\"",
    },
    {
      type: 'multiple-choice',
      question: 'Que devrais-tu TOUJOURS inclure quand tu demandes à un agent de déboguer une erreur ?',
      options: [
        'Une description de ce que tu essayais de faire',
        'Le message d\'erreur exact et le stack trace',
        'Tout ton code source',
        'Des captures d\'écran de ton terminal',
      ],
      correctIndex: 1,
      explanation: 'Le message d\'erreur exact et le stack trace donnent à l\'agent tout ce dont il a besoin pour tracer la cause profonde. Les descriptions d\'intention sont du contexte utile, mais l\'erreur elle-même est obligatoire.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Débogage avec agent débloqué !',
    },

    // === THE 3-STEP DEBUG LOOP ===
    {
      type: 'info',
      title: 'La boucle de débogage en 3 étapes',
      body: "Chaque débogueur expérimenté suit la même boucle, qu'il en soit conscient ou non : lire l'erreur, former une hypothèse, vérifier avec un seul changement. Pas deux changements. Pas cinq. Un seul. Si ça ne corrige pas, tu as appris quelque chose — mets à jour ton hypothèse et recommence. C'est comme ça que les agents devraient fonctionner aussi.",
    },
    {
      type: 'code-demo',
      title: 'La boucle de débogage en pratique',
      body: 'Un seul changement par cycle. Chaque cycle corrige le bug ou réduit les causes possibles.',
      language: 'typescript',
      filename: 'debug-loop.ts',
      code: "// Step 1: READ — the error says 'users' is undefined at line 12\n// Step 2: HYPOTHESIZE — the API call hasn't resolved before render\n// Step 3: VERIFY — add a guard clause and test\n\n// Before (crashes):\nfunction UserList({ users }: Props) {\n  return users.map(u => <li>{u.name}</li>)\n}\n\n// After (one change — guard clause):\nfunction UserList({ users }: Props) {\n  if (!users) return <p>Loading...</p>\n  return users.map(u => <li>{u.name}</li>)\n}",
    },

    // === ROOT CAUSE VS SYMPTOMS ===
    {
      type: 'info',
      title: 'Corriger les causes profondes, pas les symptômes',
      body: "La clause de garde ci-dessus arrête le crash — mais c'est un correctif de symptôme. La cause profonde pourrait être que l'appel API n'est pas await, ou que le composant parent passe le mauvais nom de prop. Demande à l'agent d'investiguer POURQUOI users est undefined, pas juste comment arrêter le crash. Les correctifs de symptômes s'accumulent en code fragile.",
    },
    {
      type: 'terminal',
      instruction: 'Utilise Claude Code pour investiguer une cause profonde. Demande-lui de tracer d\'où viennent les données :',
      expectedCommand: 'claude "Trace where the users prop in UserList.tsx gets its data. Start from the API call and follow it through every component to find where it becomes undefined."',
      hint: 'claude "Trace where the users prop..."',
    },
    {
      type: 'code-input',
      instruction: 'Un agent suggère d\'ajouter `|| []` pour corriger "Cannot read properties of undefined". Est-ce un correctif de cause profonde ou de symptôme ?',
      placeholder: 'This is a _______ fix',
      answer: 'symptom',
      hint: 'Est-ce que ça traite POURQUOI la valeur est undefined, ou juste empêche le crash ?',
    },

    // === PRACTICE: CLASSIFY ERRORS ===
    {
      type: 'multiple-choice',
      question: 'Tu vois : "Module not found: Can\'t resolve \'./Userlist\'" mais le fichier s\'appelle UserList.tsx. Quel type d\'erreur est-ce ?',
      options: [
        'Erreur d\'exécution — le module plante à l\'import',
        'Erreur de logique — mauvais comportement',
        'Erreur de syntaxe — le chemin d\'import a une typo (incompatibilité de casse)',
        'Erreur réseau — le fichier n\'a pas pu être téléchargé',
      ],
      correctIndex: 2,
      explanation: "C'est une erreur de niveau syntaxe — le chemin d'import 'Userlist' ne correspond pas au nom de fichier 'UserList' (L majuscule). Sur les systèmes de fichiers sensibles à la casse (Linux, CI), ça casse le build.",
    },
    {
      type: 'checklist',
      title: 'Ton protocole de débogage — utilise-le à chaque fois :',
      items: [
        'Lire le message d\'erreur AU COMPLET avant de faire quoi que ce soit',
        'Identifier le type d\'erreur (syntaxe, exécution ou logique)',
        'Aller au fichier et numéro de ligne du stack trace',
        'Former UNE hypothèse sur la cause',
        'Faire UN changement pour tester ton hypothèse',
        'Si tu colles pour un agent, inclure l\'erreur exacte + le stack trace',
        'Se demander si le correctif traite la cause profonde ou le symptôme',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Débogage Error-First terminé ! Tu débogues maintenant de façon systématique, pas aléatoire.',
    },
  ],
}

export default content
