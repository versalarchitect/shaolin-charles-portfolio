import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-2',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Vous êtes l\'architecte, pas le constructeur',
      body: "La compétence dans cette leçon N'EST PAS de connaître Next.js. Si vous connaissez déjà parfaitement Next.js, vous pourriez simplement le construire vous-même. La compétence est d'en savoir assez sur l'architecture pour évaluer si l'agent a fait le bon choix — et savoir comment le rediriger quand ce n'est pas le cas. Vous êtes un directeur technique qui révise des décisions architecturales en temps réel, pas un développeur qui écrit du code.",
    },
    {
      type: 'info',
      title: 'Ce que « diriger un scaffold » signifie',
      body: "Le scaffolding, c'est la structure initiale du projet : dossiers, fichiers de config, mise en place du routing, hiérarchie des layouts, dépendances de packages. L'agent génère tout ça. Votre travail est de lui donner les bonnes contraintes en amont (via votre spec), puis de réviser ce qu'il produit. Vous cherchez la justesse structurelle — pas la qualité du code à ce stade. Est-ce que le routing correspond à la spec ? Les composants serveur et client sont-ils utilisés correctement ? La hiérarchie des layouts est-elle logique ?",
    },

    // === SCAFFOLD PROMPTS ===
    {
      type: 'multiple-choice',
      question: 'Quand vous dirigez un agent pour scaffolder un projet, lequel des elements suivants ne devriez-vous PAS specifier dans votre prompt ?',
      options: [
        'Le framework et la version (ex. : Next.js 15, App Router)',
        'Les conventions de nommage de fichiers et l\'ordre des imports',
        'La structure de routing (quelles pages existent)',
        'Les packages cles (ORM, styling, auth)',
      ],
      correctIndex: 1,
      explanation: 'Les conventions de nommage, l\'ordre des imports et le config boilerplate sont des choses que l\'agent connait deja. Specifiez les decisions couteuses : version du framework, structure de routing, besoins en donnees par route, layouts partages et packages cles. Laissez l\'agent gerer ce qu\'il sait deja — micro-gerer les details bon marche gaspille votre temps et la fenetre de contexte.',
    },
    {
      type: 'compare',
      title: 'Quoi specifier vs quoi laisser a l\'agent',
      body: 'Un prompt de scaffold devrait contraindre les decisions couteuses a changer, mais laisser les details d\'implementation a l\'agent.',
      question: 'Quel cote contient les bonnes choses a specifier ?',
      correctSide: 'left',
      left: {
        label: 'Specifier ceux-ci',
        content: '✓ Strategie de rendu (Serveur vs Client)\n✓ Hierarchie des layouts (quelles pages s\'imbriquent)\n✓ Organisation des composants (par fonctionnalite)\n✓ Pattern de recuperation de donnees (server actions)\n✓ Approche de gestion d\'etat',
        language: 'text',
      },
      right: {
        label: 'Laisser a l\'agent',
        content: '✗ Noms exacts de classes CSS\n✗ Nommage des variables dans les composants\n✗ Ordre des imports\n✗ Arrow function ou syntaxe function\n✗ Placement des commentaires',
        language: 'text',
      },
      explanation: 'Les decisions architecturales (gauche) sont couteuses a changer apres la construction du scaffold. Les details d\'implementation (droite) sont bon marche a ajuster plus tard. Concentrez votre spec sur les decisions couteuses.',
    },
    {
      type: 'code-fill',
      instruction: 'Ce prompt donne assez d\'infos a Claude Code pour scaffolder correctement. Completez les specifications de routes et decisions de rendu manquantes.',
      language: 'text',
      filename: 'scaffold-prompt.txt',
      template: 'Create a Next.js 15 app with App Router. TypeScript, Tailwind CSS.\n\nRoutes:\n- / (landing page, static)\n- /dashboard (authenticated, {{dashboard_rendering}}, fetches user data)\n- /dashboard/bookmarks (list view, server component, fetches from DB)\n- /dashboard/bookmarks/[id] (detail view, dynamic route)\n- /settings ({{settings_rendering}}, form interactions)\n\nLayouts:\n- Root layout: global styles, fonts, metadata\n- /dashboard layout: sidebar nav, auth check wrapper\n\nPackages: {{database_package}}, next-auth for session.\n\nUse server components by default. Only use client components\nwhere user interaction requires it (forms, toggles, modals).',
      blanks: [
        { id: 'dashboard_rendering', answer: 'server component', alternatives: ['Server Component', 'server-component', 'SC'], placeholder: 'strategie de rendu ?', hint: 'Le dashboard recupere des donnees au chargement — pas d\'interactivite necessaire' },
        { id: 'settings_rendering', answer: 'client component', alternatives: ['Client Component', 'client-component', 'CC'], placeholder: 'strategie de rendu ?', hint: 'Les formulaires avec toggles ont besoin d\'etat cote client (useState)' },
        { id: 'database_package', answer: 'Drizzle ORM + SQLite', alternatives: ['Drizzle ORM + SQLite', 'drizzle-orm + sqlite', 'Drizzle + SQLite'], placeholder: 'quelle stack BD ?', hint: 'Un ORM TypeScript associe a une base de donnees legere sur fichier' },
      ],
      explanation: 'Dashboard recupere des donnees sans interactivite = composant serveur. Settings a des toggles de formulaire = composant client. Nommer le package de base de donnees exact empeche l\'agent d\'evaluer des alternatives.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Prompt de scaffold rédigé !',
    },

    // === CREATE NEXT APP ===
    {
      type: 'multiple-choice',
      question: 'Vous voulez que l\'agent scaffolde un projet Next.js de zero. Quelle approche est correcte ?',
      options: [
        'Toujours lancer create-next-app vous-meme d\'abord, puis inviter l\'agent',
        'Toujours laisser l\'agent lancer create-next-app — il connait les bons flags',
        'Les deux fonctionnent — mais si l\'agent le lance, specifiez les flags qui vous importent dans votre prompt',
        'Eviter completement create-next-app et laisser l\'agent creer les fichiers manuellement',
      ],
      correctIndex: 2,
      explanation: 'Les deux approches fonctionnent. Si l\'agent lance create-next-app, specifiez les flags qui comptent pour vous (--typescript, --tailwind, --app, --src-dir). Si vous avez des preferences pour la config ESLint ou les alias d\'import, dites-le explicitement. L\'agent fera des choix par defaut raisonnables pour tout ce que vous ne specifiez pas.',
    },
    {
      type: 'terminal',
      instruction: 'Lancez la commande create-next-app avec TypeScript, Tailwind et App Router :',
      expectedCommand: 'npx create-next-app@latest --typescript --tailwind --app',
      hint: 'Utilisez npx create-next-app@latest avec les flags --typescript, --tailwind et --app',
    },
    {
      type: 'code-fill',
      instruction: 'Si vous voulez que l\'agent gere tout y compris la commande de creation initiale, completez ce prompt de scaffold avec les bons choix technologiques.',
      language: 'text',
      filename: 'full-scaffold-prompt.txt',
      template: 'Create a new Next.js 15 project called "bookmark-app" in the\ncurrent directory. Use:\n- {{type_system}} strict\n- {{css_framework}}\n- App Router with src/ directory\n- ESLint with the default Next.js config\n\nAfter creating, set up the route structure from my spec\nand install {{orm_package}} with better-sqlite3.',
      blanks: [
        { id: 'type_system', answer: 'TypeScript', alternatives: ['typescript', 'TS'], placeholder: 'quel systeme de types ?', hint: 'Le systeme de types strict pour JavaScript' },
        { id: 'css_framework', answer: 'Tailwind CSS', alternatives: ['Tailwind', 'tailwindcss'], placeholder: 'quel framework CSS ?', hint: 'Framework CSS utility-first' },
        { id: 'orm_package', answer: 'Drizzle ORM', alternatives: ['drizzle-orm', 'Drizzle'], placeholder: 'quel ORM ?', hint: 'L\'ORM TypeScript de votre spec' },
      ],
      explanation: 'Nommer les packages exacts dans le prompt de scaffold empeche l\'agent d\'evaluer des alternatives. TypeScript strict attrape plus de bugs. Tailwind CSS et Drizzle ORM sont des decisions architecturales qui affectent chaque fichier du projet.',
    },

    // === RENDERING STRATEGY ===
    {
      type: 'compare',
      title: 'Composants Serveur vs Composants Client',
      body: 'La decision architecturale la plus importante dans une app Next.js. L\'agent doit choisir correctement par route — votre travail est de verifier.',
      question: 'Une page qui recupere des favoris depuis une base de donnees et les affiche en liste — quel rendu est correct ?',
      correctSide: 'left',
      left: {
        label: 'Composant Serveur',
        content: '✓ Rendu sur le serveur\n✓ Pas de JavaScript cote client\n✓ Acces direct a la BD/API\n✓ Chargement initial plus rapide\n\nIdeal pour : affichage de donnees,\ncontenu statique, pages sans\ninteraction utilisateur.',
        language: 'text',
      },
      right: {
        label: 'Composant Client',
        content: '✓ Rendu cote client\n✓ Supporte useState, useEffect\n✓ Gestionnaires d\'evenements, etat de formulaire\n✓ Interactivite en temps reel\n\nIdeal pour : formulaires, toggles,\nmodals, mises a jour en temps reel,\ntout ce qui necessite interaction.',
        language: 'text',
      },
      explanation: 'Une page d\'affichage de donnees en lecture seule est le cas d\'ecole du Composant Serveur. L\'erreur la plus courante de l\'agent est de tout mettre en composant client parce que c\'est « plus sur » — ca fonctionne, mais ca envoie du JavaScript inutile. Demandez-vous : cette route a-t-elle besoin d\'interactivite ? Si non, c\'est un composant serveur.',
    },
    {
      type: 'multiple-choice',
      question: 'Une page recupere des donnees ET a un bouton supprimer interactif. Quel est le bon pattern ?',
      options: [
        'Faire de toute la page un composant client',
        'Faire de toute la page un composant serveur et utiliser des server actions pour supprimer',
        'Composant serveur au niveau de la page avec un petit composant client pour le bouton supprimer',
        'Creer une route API pour les donnees et une route API separee pour la suppression',
      ],
      correctIndex: 2,
      explanation: 'Le bon pattern est « page serveur avec ilots client ». La page est un composant serveur qui recupere les donnees directement. Les elements interactifs (comme un bouton supprimer) sont extraits dans de petits composants client enfants. Cela vous donne la performance cote serveur avec l\'interactivite cote client ou necessaire.',
    },
    {
      type: 'multiple-choice',
      question: 'Une page /dashboard récupère les favoris de l\'utilisateur depuis une base de données et les affiche comme liste statique. Quelle stratégie de rendu est correcte ?',
      options: [
        'Composant client avec useEffect pour récupérer les données au montage',
        'Composant serveur qui interroge la base de données directement',
        'Composant client avec server action pour la récupération de données',
        'Génération statique au build avec getStaticProps',
      ],
      correctIndex: 1,
      explanation: 'Une page qui récupère des données et les affiche sans interactivité est le cas d\'école pour un Server Component. Il peut interroger la base de données directement (pas besoin de route API), n\'envoie aucun JavaScript au client, et se rend plus vite. Le fetch avec useEffect est le pattern React 18 — l\'App Router de Next.js le rend inutile pour l\'affichage de données en lecture seule.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Stratégie de rendu claire !',
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Diriger un Scaffold',
      body: 'La boucle de revision : vous specifiez, l\'agent construit, vous evaluez, et vous redirigez ou acceptez. Cliquez a travers chaque etape.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Exigences Spec', sublabel: 'Routes, layouts, donnees', shape: 'pill' },
          { id: 'scaffold', label: 'L\'Agent Scaffolde', sublabel: 'Fichiers + config', shape: 'rect', highlight: true },
          { id: 'review', label: 'Vous Revisez', sublabel: 'Verif. structure', shape: 'diamond' },
          { id: 'redirect', label: 'Rediriger', sublabel: 'Corriger les decisions', shape: 'rect' },
          { id: 'accept', label: 'Accepter', sublabel: 'Avancer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'scaffold' },
          { from: 'scaffold', to: 'review' },
          { from: 'review', to: 'accept', label: 'correct' },
          { from: 'review', to: 'redirect', label: 'incorrect', dashed: true },
          { from: 'redirect', to: 'scaffold' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'scaffold' }],
          explanation: 'Commencez par votre spec : routes, layouts, strategie de rendu, et packages cles. C\'est votre input pour l\'agent.',
        },
        {
          highlightNodes: ['scaffold'],
          highlightEdges: [{ from: 'scaffold', to: 'review' }],
          explanation: 'L\'agent genere la structure du projet — dossiers, fichiers de config, composants de page, hierarchie de layouts. Ca se fait en secondes.',
        },
        {
          highlightNodes: ['review'],
          explanation: 'Vous revisez la structure generee par rapport a votre spec. Verifiez la strategie de rendu, l\'imbrication des layouts, et la justesse des routes.',
        },
        {
          highlightNodes: ['review', 'accept'],
          highlightEdges: [{ from: 'review', to: 'accept' }],
          explanation: 'Si la structure correspond a votre spec, acceptez-la et passez a l\'implementation. Aucun changement necessaire.',
        },
        {
          highlightNodes: ['review', 'redirect', 'scaffold'],
          highlightEdges: [{ from: 'review', to: 'redirect' }, { from: 'redirect', to: 'scaffold' }],
          explanation: 'Si vous trouvez des problemes (mauvais type de composant, layouts manquants, mauvais pattern de donnees), redirigez avec une correction precise. L\'agent reconstruit et vous revisez a nouveau.',
        },
      ],
    },

    // === REDIRECTING THE AGENT ===
    {
      type: 'match',
      instruction: 'Associez chaque probleme de scaffold a la bonne instruction de redirection :',
      leftItems: ['L\'agent a ajoute "use client" a une page qui ne fait qu\'afficher des donnees', 'L\'agent a cree des routes API au lieu de server actions', 'La hierarchie des layouts est plate au lieu d\'etre imbriquee', 'L\'agent a fait de chaque composant un composant client'],
      rightItems: ['Deplacer l\'UI partagee dans dashboard/layout.tsx pour envelopper les routes enfants', 'Retirer "use client", utiliser une requete BD directe dans le corps du composant', 'Retirer les routes API, creer actions.ts avec la directive "use server"', 'Garder la page comme composant serveur, extraire seulement les elements interactifs en enfants clients'],
      correctPairs: { 0: 1, 1: 2, 2: 0, 3: 3 },
      explanation: 'Chaque redirection est chirurgicale et specifique : nommez le fichier, decrivez le probleme, et donnez la correction. Rediriger n\'est pas un echec — c\'est le flux de travail normal. La competence est d\'identifier le probleme rapidement.',
    },
    {
      type: 'code-fill',
      instruction: 'L\'agent a cree des routes API au lieu de server actions. Completez ce prompt de redirection avec la bonne correction.',
      language: 'text',
      filename: 'redirect-prompt.txt',
      template: 'The spec says "server actions for mutations." You created\nAPI routes at src/app/api/bookmarks/route.ts. Remove those.\n\nInstead, create server actions in src/app/dashboard/bookmarks/\nactions.ts using "{{server_directive}}". The form in the add-bookmark\ncomponent should call the server action directly via the\n{{form_prop}} prop or useFormAction.',
      blanks: [
        { id: 'server_directive', answer: 'use server', alternatives: ['"use server"', 'use server'], placeholder: 'quelle directive ?', hint: 'La directive qui marque un fichier comme contenant des server actions' },
        { id: 'form_prop', answer: 'action', alternatives: ['action'], placeholder: 'quel attribut de formulaire ?', hint: 'L\'attribut HTML du formulaire qui accepte une fonction server action' },
      ],
      explanation: 'Les server actions utilisent la directive "use server" et sont appelees directement depuis les attributs action des formulaires. Cela elimine le besoin de routes API et d\'appels fetch manuels pour les mutations.',
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a scaffoldé /settings comme composant serveur. La page contient un formulaire où les utilisateurs activent/désactivent les préférences de notification. Est-ce correct ?',
      options: [
        'Oui — les formulaires fonctionnent dans les composants serveur via server actions',
        'Non — une page avec des toggles et un état de formulaire nécessite « use client » pour l\'interactivité',
        'Ça dépend de si le formulaire utilise des inputs contrôlés ou non contrôlés',
        'Oui — il faut toujours préférer les composants serveur',
      ],
      correctIndex: 1,
      explanation: 'Les toggles nécessitent un état côté client (useState) pour refléter visuellement on/off pendant l\'interaction de l\'utilisateur. Bien que la soumission du formulaire puisse utiliser un server action, le composant toggle interactif lui-même a besoin de « use client ». Le composant au niveau de la page ou un composant enfant doit être un composant client pour gérer l\'état du toggle.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Instincts de redirection aiguisés !',
    },

    // === LAYOUT HIERARCHY ===
    {
      type: 'multiple-choice',
      question: 'L\'agent a mis la navigation sidebar dans le root layout (app/layout.tsx). La landing page a "/" affiche maintenant incorrectement la sidebar. Quelle est la bonne correction ?',
      options: [
        'Ajouter une condition pour masquer la sidebar sur la landing page',
        'Deplacer la sidebar dans app/dashboard/layout.tsx pour qu\'elle n\'enveloppe que les pages /dashboard/*',
        'Creer un layout separe pour la landing page',
        'Supprimer les layouts entierement et mettre la sidebar dans chaque composant de page',
      ],
      correctIndex: 1,
      explanation: 'Les layouts dans l\'App Router de Next.js sont imbriques par defaut. Un layout a app/dashboard/layout.tsx enveloppe toutes les pages sous /dashboard/*. L\'UI partagee comme les sidebars et wrappers d\'auth appartient aux layouts specifiques a la section, pas au root layout. Tout mettre dans le root rend impossible d\'avoir des layouts differents par section.',
    },
    {
      type: 'code-fill',
      instruction: 'Verifiez que l\'agent produit la bonne hierarchie de layouts. Completez les annotations de rendu manquantes pour chaque page.',
      language: 'text',
      filename: 'expected-structure.txt',
      template: 'src/app/\n├── layout.tsx          ← Root: html, body, fonts, global providers\n├── page.tsx            ← Landing page (no sidebar)\n├── dashboard/\n│   ├── layout.tsx      ← Dashboard: sidebar + auth wrapper\n│   ├── page.tsx        ← Dashboard home\n│   ├── bookmarks/\n│   │   ├── page.tsx    ← Bookmark list ({{bookmarks_type}})\n│   │   └── [id]/\n│   │       └── page.tsx ← Bookmark detail (dynamic)\n│   └── settings/\n│       └── page.tsx    ← Settings form ({{settings_type}})\n└── globals.css',
      blanks: [
        { id: 'bookmarks_type', answer: 'server component', alternatives: ['Server Component', 'server-component', 'SC'], placeholder: 'type de rendu ?', hint: 'Cette page affiche seulement des donnees recuperees de la base' },
        { id: 'settings_type', answer: 'client component', alternatives: ['Client Component', 'client-component', 'CC'], placeholder: 'type de rendu ?', hint: 'Cette page a des toggles de formulaire qui necessitent useState' },
      ],
      explanation: 'La liste de favoris affiche des donnees sans interactivite = composant serveur. Le formulaire de settings a des toggles necessitant un etat client = composant client. Verifier la strategie de rendu par page est l\'etape de revision de scaffold la plus importante.',
    },
    {
      type: 'order',
      instruction: 'Ordonnez les étapes pour diriger un agent à travers un scaffold :',
      items: [
        'Rediriger les décisions architecturales incorrectes',
        'Réviser la structure générée par rapport à la spec',
        'Écrire le prompt de scaffold avec les routes et contraintes',
        'Accepter la structure et passer à l\'implémentation',
        'L\'agent génère les fichiers du projet',
      ],
      correctOrder: [2, 4, 1, 0, 3],
    },

    // === VERIFICATION ===
    {
      type: 'multiple-choice',
      question: 'Apres que l\'agent scaffolde votre projet, quelle est la PREMIERE chose que vous devriez verifier ?',
      options: [
        'La qualite du code et le nommage des variables',
        'Que la structure de fichiers correspond aux routes de votre spec et que la strategie de rendu est correcte par page',
        'Que toutes les classes CSS sont appliquees correctement',
        'Que les tests passent',
      ],
      correctIndex: 1,
      explanation: 'La justesse structurelle passe en premier : verifiez que les routes correspondent a votre spec, que la strategie de rendu (serveur vs client) est correcte par page, que le package.json a les bonnes dependances, et que le serveur de dev demarre sans erreurs. Ca prend 2 minutes et attrape les problemes avant que vous construisiez des fonctionnalites sur une fondation cassee.',
    },
    {
      type: 'terminal',
      instruction: 'Après le scaffolding, vérifiez que le projet démarre sans erreurs :',
      expectedCommand: 'npm run dev',
      hint: 'La commande dev standard de Next.js',
    },
    {
      type: 'code-fill',
      instruction: 'Vous pouvez demander a Claude Code de s\'auto-verifier. Completez ce prompt de verification avec les bons controles.',
      language: 'text',
      filename: 'verify-prompt.txt',
      template: 'Review the project structure you just created against my spec.\nFor each route in the spec, confirm:\n1. The file exists at the correct path\n2. The {{rendering_check}} is correct (server vs client)\n3. The {{hierarchy_check}} matches the nesting I specified\n\nList any discrepancies.',
      blanks: [
        { id: 'rendering_check', answer: 'rendering strategy', alternatives: ['rendering strategy', 'component type', 'rendering type'], placeholder: 'quoi verifier par route ?', hint: 'Si chaque page est un composant serveur ou client' },
        { id: 'hierarchy_check', answer: 'layout hierarchy', alternatives: ['layout hierarchy', 'layout nesting', 'layouts'], placeholder: 'quel controle structurel ?', hint: 'Quels layouts enveloppent quelles pages' },
      ],
      explanation: 'Un prompt d\'auto-verification fait auditer par l\'agent sa propre sortie. Les trois controles — chemins de fichiers, strategie de rendu et hierarchie de layouts — sont les sources les plus courantes d\'erreurs de scaffold.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Flux de vérification verrouillé !',
    },

    // === COMMON PATTERNS ===
    {
      type: 'code-fill',
      instruction: 'Le pattern correct le plus courant : page composant serveur qui recupere les donnees, avec de petits composants client enfants pour l\'interactivite. Completez les parties manquantes de cette implementation.',
      language: 'typescript',
      filename: 'src/app/dashboard/bookmarks/page.tsx',
      template: "import { db } from '@/db'\nimport { bookmarks } from '@/db/schema'\nimport { DeleteButton } from './delete-button' // client component\n\nexport default {{function_keyword}} function BookmarksPage() {\n  const allBookmarks = await db.{{query_method}}().from(bookmarks)\n\n  return (\n    <div>\n      <h1>Bookmarks</h1>\n      {allBookmarks.map((b) => (\n        <div key={b.id}>\n          <a href={b.url}>{b.title}</a>\n          <DeleteButton id={b.id} />\n        </div>\n      ))}\n    </div>\n  )\n}",
      blanks: [
        { id: 'function_keyword', answer: 'async', alternatives: ['async'], placeholder: 'quel mot-cle ?', hint: 'Les composants serveur peuvent utiliser ce mot-cle pour await les donnees directement' },
        { id: 'query_method', answer: 'select', alternatives: ['select'], placeholder: 'quelle methode Drizzle ?', hint: 'L\'operation SQL qui lit des lignes d\'une table' },
      ],
      explanation: 'Les composants serveur peuvent etre async — ils await les donnees directement dans le corps du composant, pas besoin de useEffect. Le DeleteButton est un composant client separe car il a besoin d\'interactivite onClick. La page passe les donnees via props.',
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a créé un seul composant client BookmarkList qui récupère les données avec useEffect ET gère les interactions de suppression. Quelle est la bonne redirection ?',
      options: [
        'Le laisser — les composants client peuvent aussi récupérer des données',
        'Séparer : composant serveur pour la page et la récupération de données, composant client DeleteButton pour l\'interaction',
        'Convertir tout en composants serveur et utiliser des server actions pour la suppression',
        'Ajouter un fichier loading.tsx pour gérer l\'état de chargement',
      ],
      correctIndex: 1,
      explanation: 'Le bon pattern est de garder la page comme composant serveur (accès direct à la BD, pas besoin d\'état de chargement, pas de JS client) et d\'extraire uniquement le bouton supprimer interactif dans un petit composant client. Ça vous donne le meilleur des deux mondes : performance serveur + interactivité client.',
    },

    // === ADVANCED CONSIDERATIONS ===
    {
      type: 'match',
      instruction: 'Appliquez l\'heuristique du cout de changement. Associez chaque decision a son cout de modification ulterieure :',
      leftItems: ['Structure de routing et chemins URL', 'Limites serveur vs client', 'Nommage des fichiers de composants', 'Classes CSS Tailwind', 'Hierarchie d\'imbrication des layouts'],
      rightItems: ['Trivial — rechercher et remplacer', 'Bon marche — chercher et renommer', 'Modere — deplacer des fichiers, mettre a jour l\'etat partage', 'Couteux — la restructuration se propage dans toute l\'app', 'Couteux — affecte les URLs, la navigation, le flux de donnees'],
      correctPairs: { 0: 4, 1: 3, 2: 1, 3: 0, 4: 2 },
      explanation: 'Verrouillez les decisions couteuses (routing, strategie de rendu) dans votre spec. Laissez les decisions bon marche (nommage, classes CSS) a l\'agent. L\'heuristique du cout de changement vous dit ou concentrer votre attention en tant que directeur.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Limites de jugement établies !',
    },

    // === FINAL EXERCISES ===
    {
      type: 'code-input',
      instruction: 'Dans l\'App Router de Next.js, quelle directive mettez-vous en haut d\'un fichier pour en faire un composant client ?',
      placeholder: 'Entrez la directive',
      answer: '"use client"',
      hint: 'C\'est un littéral de chaîne en haut du fichier, commençant par « use »',
    },
    {
      type: 'order',
      instruction: 'Classez ces décisions de la PLUS coûteuse à changer (première) à la MOINS coûteuse (dernière) :',
      items: [
        'Classes CSS des composants',
        'Structure de routing et chemins URL',
        'Hiérarchie d\'imbrication des layouts',
        'Noms de variables et de fonctions',
        'Limites entre composants serveur et client',
      ],
      correctOrder: [1, 4, 2, 3, 0],
    },
    {
      type: 'multiple-choice',
      question: 'Vous dirigez l\'agent pour scaffolder une app. Il crée des routes API pour toute la récupération de données au lieu d\'utiliser des composants serveur avec accès direct à la BD. Que faites-vous ?',
      options: [
        'Accepter — les routes API fonctionnent bien pour la récupération de données',
        'Rediriger : supprimer les routes API, faire des pages d\'affichage de données des composants serveur avec requêtes BD directes',
        'Demander à l\'agent d\'expliquer sa décision avant de rediriger',
        'Réécrire toute la spec pour être plus explicite sur les patterns de récupération de données',
      ],
      correctIndex: 1,
      explanation: 'Si votre spec dit « composants serveur pour l\'affichage de données » ou le sous-entend par l\'architecture, redirigez immédiatement. Les routes API ajoutent des allers-retours réseau inutiles pour des pages rendues côté serveur qui peuvent interroger la BD directement. Une redirection claire et ciblée est plus rapide que demander des explications ou réécrire la spec.',
    },
    {
      type: 'checklist',
      title: 'Liste de vérification pour la direction d\'architecture full-stack :',
      items: [
        'Je peux écrire un prompt de scaffold qui spécifie les routes, layouts et stratégie de rendu',
        'Je sais quand utiliser les composants serveur vs les composants client',
        'Je peux identifier et rediriger les décisions de rendu incorrectes',
        'Je comprends le pattern page-serveur-avec-îlots-client',
        'Je sais quelles décisions contrôler et lesquelles laisser à l\'agent',
        'Je peux vérifier qu\'un scaffold correspond à ma spec avant de construire des fonctionnalités',
        'J\'utilise l\'heuristique du coût de changement pour prioriser mon attention',
      ],
    },
    {
      type: 'checkpoint',
      xp: 14,
      message: 'Direction d\'architecture full-stack maîtrisée ! Vous pouvez scaffolder des apps complètes via un agent.',
    },
  ],
}

export default content
