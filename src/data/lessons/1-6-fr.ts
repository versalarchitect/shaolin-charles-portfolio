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
      type: 'multiple-choice',
      question: 'Chaque message d\'erreur a quatre parties. Laquelle n\'en fait PAS partie ?',
      options: [
        'Le type d\'erreur (catégorie du problème)',
        'Le fichier et le numéro de ligne (où c\'est arrivé)',
        'Le commit git qui a introduit le bug',
        'Le stack trace (chaîne d\'appels de fonctions)',
      ],
      correctIndex: 2,
      explanation: 'Les quatre parties sont : le type d\'erreur, le message lisible, le fichier/numéro de ligne, et le stack trace. Le commit git ne fait pas partie du message d\'erreur — il faudrait git blame pour ça. T\'entraîner à parser ces quatre parties instantanément est la compétence de débogage la plus rentable.',
    },
    {
      type: 'code-fill',
      instruction: 'Remplis les quatre parties de ce message d\'erreur Node.js disséqué :',
      language: 'text',
      template: "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderList (/app/src/components/UserList.tsx:12:18)\n    at Object.render (/app/src/pages/Dashboard.tsx:45:5)\n\n┌─ Type:     {{error_type}}\n├─ Message:  Cannot read properties of undefined (reading 'map')\n├─ File:     {{error_file}}, line 12\n└─ Cause:    '{{undefined_var}}' is undefined when .map() is called",
      blanks: [
        { id: 'error_type', answer: 'TypeError', alternatives: ['typeerror', 'type error'], placeholder: 'catégorie d\'erreur ?', hint: 'Le premier mot du message d\'erreur — quel type d\'erreur est-ce ?' },
        { id: 'error_file', answer: 'src/components/UserList.tsx', alternatives: ['UserList.tsx'], placeholder: 'quel fichier ?', hint: 'Regarde le haut du stack trace — quel fichier est à la ligne 12 ?' },
        { id: 'undefined_var', answer: 'users', alternatives: ['user'], placeholder: 'quelle variable ?', hint: 'Qu\'est-ce qui est undefined quand .map() est appelé ? Pense à ce sur quoi tu fais .map().' },
      ],
      explanation: 'Le type est TypeError. Le fichier est src/components/UserList.tsx à la ligne 12 (haut du stack trace — commence toujours par là). La variable undefined est users — tu appelles .map() sur un tableau d\'utilisateurs, mais il est undefined.',
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
      type: 'interactive-diagram',
      title: 'Catégories d\'erreurs',
      body: 'Clique sur chaque étape pour apprendre les trois catégories d\'erreurs et comment déboguer chacune.',
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
      stages: [
        {
          highlightNodes: ['error', 'type'],
          highlightEdges: [{ from: 'error', to: 'type' }],
          explanation: 'Chaque erreur tombe dans l\'une de trois catégories. Chacune nécessite une approche de débogage différente. La première étape est toujours de classifier l\'erreur.',
        },
        {
          highlightNodes: ['type', 'syntax', 'code'],
          highlightEdges: [{ from: 'type', to: 'syntax' }, { from: 'syntax', to: 'code' }],
          explanation: 'Les erreurs de syntaxe signifient que le code ne peut même pas être parsé. Crochets manquants, typos, mauvais imports. Ce sont les plus faciles — le message pointe vers le caractère exact. Le correctif est mécanique : lis le message, va à la ligne, corrige la typo.',
        },
        {
          highlightNodes: ['type', 'runtime', 'data'],
          highlightEdges: [{ from: 'type', to: 'runtime' }, { from: 'runtime', to: 'data' }],
          explanation: 'Les erreurs d\'exécution se produisent quand le code est syntaxiquement valide mais échoue pendant l\'exécution. Références null, incompatibilités de types, fichiers manquants. Vérifie quelles données existaient réellement au point de l\'échec.',
        },
        {
          highlightNodes: ['type', 'logic', 'logic_fix'],
          highlightEdges: [{ from: 'type', to: 'logic' }, { from: 'logic', to: 'logic_fix' }],
          explanation: 'Les erreurs de logique sont les plus difficiles. Le code tourne sans planter mais produit de mauvais résultats. Aucun message d\'erreur. Ça nécessite de comprendre l\'intention vs le comportement — c\'est là que les agents IA aident le plus.',
        },
      ],
    },
    {
      type: 'code-fill',
      instruction: 'Le parser te dit exactement où est le problème. Remplis ce que le message d\'erreur révèle :',
      language: 'text',
      template: "{{error_type}}: Unexpected token '}' at line {{line_num}}\n\nfunction greet(name: string) {\n  console.log('Hello, ' + name)\n}} // <-- {{fix_description}}",
      blanks: [
        { id: 'error_type', answer: 'SyntaxError', alternatives: ['syntaxerror', 'syntax error'], placeholder: 'type d\'erreur ?', hint: 'Cette catégorie d\'erreur signifie que le code ne peut même pas être parsé' },
        { id: 'line_num', answer: '3', placeholder: 'quelle ligne ?', hint: 'Compte les lignes de la fonction — quelle ligne a l\'accolade en trop ?' },
        { id: 'fix_description', answer: 'extra closing brace', alternatives: ['extra brace', 'extra }', 'accolade en trop'], placeholder: 'quel est le problème ?', hint: 'Il y en a une de trop à la fin' },
      ],
      explanation: 'Un SyntaxError à la ligne 3 causé par une accolade fermante en trop. Les erreurs de syntaxe se corrigent mécaniquement : lis le message, va à la ligne, corrige le problème structurel.',
    },
    {
      type: 'compare',
      title: 'Erreurs d\'exécution vs Erreurs de logique',
      body: 'Les deux se produisent après le parsing, mais elles se comportent très différemment.',
      question: 'Quel type est plus difficile à déboguer et pourquoi ?',
      correctSide: 'right',
      left: {
        label: 'Erreur d\'exécution',
        content: "// Le code plante pendant l'exécution\nconst users = null;\nconsole.log(users.length);\n// TypeError: Cannot read properties of null\n\n// Tu obtiens : type, message, fichier, ligne\n// Stratégie : vérifier les données au point d'échec\n// Difficulté : Moyenne — l'erreur te dit où",
        language: 'typescript',
      },
      right: {
        label: 'Erreur de logique',
        content: "// Le code tourne mais produit de MAUVAIS résultats\nfunction discount(price: number) {\n  return price * 1.1; // BUG: ajoute 10% au lieu\n}\ndiscount(100); // Retourne 110, devrait être 90\n\n// Tu obtiens : AUCUN message d'erreur, pas de crash\n// Stratégie : comparer attendu vs réel\n// Difficulté : Difficile — rien ne te dit où chercher",
        language: 'typescript',
      },
      explanation: 'Les erreurs d\'exécution plantent avec un message qui pointe vers le problème. Les erreurs de logique sont silencieuses — le code tourne mais produit une mauvaise sortie. Tu dois comparer le comportement attendu vs réel, c\'est pourquoi les agents IA sont plus utiles ici : ils peuvent tracer la logique étape par étape.',
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
      type: 'compare',
      title: 'Prompts vagues vs précis pour le débogage',
      body: "La façon dont tu demandes de l'aide à un agent détermine s'il résout ton problème ou perd ton temps à deviner.",
      question: 'Quel prompt obtiendra une réponse utile de l\'agent ?',
      correctSide: 'right',
      left: {
        label: 'Vague (l\'agent devine)',
        content: "\"Mon app marche pas\"\n\"J'ai une erreur dans mon composant React\"\n\"Les données s'affichent pas\"\n\"Quelque chose a cassé après ma mise à jour\"\n\n→ L'agent a zéro information\n→ Suggère 5 correctifs différents\n→ Aucun ne correspond à ton vrai problème\n→ Tu perds du temps à essayer chacun",
        language: 'text',
      },
      right: {
        label: 'Précis (l\'agent trace)',
        content: "\"J'ai cette erreur quand le Dashboard charge :\n\nTypeError: Cannot read properties of\n  undefined (reading 'map')\n  at renderList (UserList.tsx:12:18)\n  at Dashboard (Dashboard.tsx:45:5)\n\nLa prop users vient de /api/users.\nJ'attends un tableau mais c'est undefined\nau premier rendu. Quelle est la cause ?\"",
        language: 'text',
      },
      explanation: 'Les prompts vagues forcent l\'agent à deviner. Le prompt précis inclut l\'erreur exacte, le stack trace, les noms de fichiers et le comportement attendu — tout ce dont l\'agent a besoin pour tracer la cause profonde. Inclus toujours le message d\'erreur exact et le stack trace.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce prompt de débogage pour donner à l\'agent tout ce dont il a besoin :',
      language: 'text',
      template: "\"J'ai cette erreur quand le {{page_name}} charge :\n\n{{error_type}}: Cannot read properties of undefined (reading 'map')\n  at renderList (src/components/UserList.tsx:12:18)\n\nLa prop `users` vient de {{data_source}}.\nQuelle est la cause profonde ?\"",
      blanks: [
        { id: 'page_name', answer: 'Dashboard', alternatives: ['dashboard'], placeholder: 'quelle page ?', hint: 'Regarde le stack trace — quel composant de page appelle renderList ?' },
        { id: 'error_type', answer: 'TypeError', alternatives: ['typeerror'], placeholder: 'catégorie d\'erreur ?', hint: 'Accéder à une propriété d\'undefined est quel type d\'erreur ?' },
        { id: 'data_source', answer: '/api/users', alternatives: ['api/users', 'l\'API', 'une API'], placeholder: 'd\'où viennent les données ?', hint: 'D\'où proviennent les données users ? Pense à la source de données.' },
      ],
      explanation: 'Un prompt de débogage précis inclut : la page où ça se produit (Dashboard), le type d\'erreur (TypeError), et la source de données (/api/users). Ça donne à l\'agent le contexte complet pour tracer le problème de la source au symptôme.',
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
      type: 'multiple-choice',
      question: 'La boucle de débogage en 3 étapes : Lire l\'erreur, former une hypothèse, vérifier avec ___ changement(s). Combien de changements par cycle ?',
      options: [
        'Autant que nécessaire pour corriger le bug',
        'Deux — un pour corriger et un pour tester',
        'Un seul — un changement unique par cycle',
        'Cinq — essayer plusieurs approches en même temps',
      ],
      correctIndex: 2,
      explanation: 'Chaque débogueur expérimenté suit la même boucle : Lire, Former une hypothèse, Vérifier avec UN seul changement. Pas deux. Pas cinq. Un seul. Si ça ne corrige pas, tu as appris quelque chose — mets à jour ton hypothèse et recommence. Plusieurs changements à la fois rendent impossible de savoir lequel a aidé.',
    },
    {
      type: 'code-fill',
      instruction: 'Applique la boucle de débogage en 3 étapes pour corriger un composant qui plante. Remplis la clause de garde :',
      language: 'typescript',
      template: "// Étape 1: LIRE — l'erreur dit 'users' est undefined à la ligne 12\n// Étape 2: HYPOTHÈSE — l'API n'a pas résolu avant le rendu\n// Étape 3: VÉRIFIER — ajouter une clause de garde et tester\n\nfunction UserList({ users }: Props) {\n  if ({{guard_check}}) return <p>{{fallback_text}}</p>\n  return users.{{array_method}}(u => <li>{u.name}</li>)\n}",
      blanks: [
        { id: 'guard_check', answer: '!users', alternatives: ['!users', 'users === undefined', 'users == null'], placeholder: 'vérification null ?', hint: 'Vérifie si users est falsy — quel opérateur nie une valeur ?' },
        { id: 'fallback_text', answer: 'Loading...', alternatives: ['Loading', 'Chargement...', 'chargement'], placeholder: 'afficher quoi ?', hint: 'Que montres-tu à l\'utilisateur pendant que les données chargent ?' },
        { id: 'array_method', answer: 'map', placeholder: 'quelle méthode ?', hint: 'La méthode qui transforme chaque élément d\'un tableau' },
      ],
      explanation: 'La clause de garde vérifie !users avant d\'appeler .map(). Si users est undefined, elle affiche un message Loading. C\'est UN seul changement qui corrige le crash ou te dit que le problème est ailleurs.',
    },

    // === ROOT CAUSE VS SYMPTOMS ===
    {
      type: 'multiple-choice',
      question: 'La clause de garde ci-dessus arrête le crash. Mais est-ce un correctif de cause profonde ou de symptôme ?',
      options: [
        'Cause profonde — ça résout pourquoi users est undefined',
        'Symptôme — ça cache le crash mais les données sont toujours manquantes',
        'Les deux — ça corrige la cause profonde et le symptôme',
        'Ni l\'un ni l\'autre — les clauses de garde n\'ont rien à voir avec le débogage',
      ],
      correctIndex: 1,
      explanation: 'La clause de garde arrête le crash mais ne corrige pas POURQUOI users est undefined. La cause profonde pourrait être un appel API non-await ou un mauvais nom de prop. Demande à l\'agent d\'investiguer POURQUOI les données manquent, pas juste comment arrêter le crash. Les correctifs de symptômes s\'accumulent en code fragile.',
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
