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
      type: 'info',
      title: 'Quoi dire à l\'agent',
      body: "Quand vous dirigez un scaffold, spécifiez : le framework et la version (Next.js 15, App Router), la structure de routing (quelles pages existent), les besoins en données par route (quelles pages nécessitent des données côté serveur), les layouts partagés (qu'est-ce qui enveloppe quoi), et les packages clés (ORM, styling, auth). Ne spécifiez PAS : les conventions de nommage de fichiers (l'agent connaît les conventions Next.js), l'organisation interne des dossiers de composants, l'ordre des imports, ni le config boilerplate. Laissez l'agent gérer ce qu'il sait déjà.",
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
      type: 'code-demo',
      title: 'Un bon prompt de scaffold',
      body: 'Ce prompt donne assez d\'infos à Claude Code pour scaffolder correctement sans micro-gérer les noms de fichiers ou le boilerplate.',
      language: 'text',
      filename: 'scaffold-prompt.txt',
      code: "Create a Next.js 15 app with App Router. TypeScript, Tailwind CSS.\n\nRoutes:\n- / (landing page, static)\n- /dashboard (authenticated, server component, fetches user data)\n- /dashboard/bookmarks (list view, server component, fetches from DB)\n- /dashboard/bookmarks/[id] (detail view, dynamic route)\n- /settings (client component, form interactions)\n\nLayouts:\n- Root layout: global styles, fonts, metadata\n- /dashboard layout: sidebar nav, auth check wrapper\n\nPackages: Drizzle ORM + SQLite, next-auth for session.\n\nUse server components by default. Only use client components\nwhere user interaction requires it (forms, toggles, modals).",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Prompt de scaffold rédigé !',
    },

    // === CREATE NEXT APP ===
    {
      type: 'info',
      title: 'La commande initiale',
      body: "La plupart des sessions de scaffold commencent avec create-next-app. Vous pouvez soit laisser l'agent l'exécuter, soit l'exécuter vous-même d'abord puis inviter l'agent dans le projet existant. Les deux fonctionnent. Si vous laissez l'agent le faire, spécifiez les flags qui vous importent dans votre prompt. L'agent choisira typiquement : --typescript, --tailwind, --app, --src-dir. Si vous avez des préférences pour la config ESLint ou les alias d'import, dites-le explicitement.",
    },
    {
      type: 'terminal',
      instruction: 'Lancez la commande create-next-app avec TypeScript, Tailwind et App Router :',
      expectedCommand: 'npx create-next-app@latest --typescript --tailwind --app',
      hint: 'Utilisez npx create-next-app@latest avec les flags --typescript, --tailwind et --app',
    },
    {
      type: 'code-demo',
      title: 'Dire à l\'agent de scaffolder de zéro',
      body: 'Si vous voulez que l\'agent gère tout, y compris la commande initiale de création, votre prompt pourrait ressembler à ceci.',
      language: 'text',
      filename: 'full-scaffold-prompt.txt',
      code: "Create a new Next.js 15 project called \"bookmark-app\" in the\ncurrent directory. Use:\n- TypeScript strict\n- Tailwind CSS\n- App Router with src/ directory\n- ESLint with the default Next.js config\n\nAfter creating, set up the route structure from my spec\nand install Drizzle ORM with better-sqlite3.",
    },

    // === RENDERING STRATEGY ===
    {
      type: 'info',
      title: 'Évaluer les décisions de rendu',
      body: "La décision architecturale la plus importante dans une app Next.js est la stratégie de rendu par route. Les Server Components se rendent sur le serveur, n'ont pas de JavaScript côté client, et peuvent accéder directement aux bases de données et APIs. Les Client Components se rendent côté client, supportent l'interactivité (useState, useEffect, gestionnaires d'événements), et envoient du JavaScript au navigateur. L'agent doit choisir correctement par route. Votre travail est de vérifier que ces choix correspondent aux exigences de données et d'interaction de votre spec.",
    },
    {
      type: 'info',
      title: 'Le cadre de décision',
      body: "Demandez-vous : est-ce que cette route a besoin d'interactivité (formulaires, mises à jour en temps réel, toggles) ? Si oui, elle a besoin de composants client — au moins partiellement. Est-ce qu'elle récupère des données au chargement ? Composant serveur. Les deux ? Composant serveur au niveau de la page avec des îlots de composants client pour les parties interactives. L'erreur la plus courante de l'agent est de tout mettre en composant client parce que c'est « plus sûr » — ça fonctionne, mais ça envoie du JavaScript inutile et perd les avantages de performance du rendu serveur.",
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
      type: 'info',
      title: 'Quand rediriger',
      body: "Vous révisez la structure générée et trouvez un problème. Peut-être que l'agent a mis « use client » sur une page qui ne fait que récupérer des données. Peut-être qu'il a créé des routes API alors que votre spec disait server actions. Peut-être que la hiérarchie des layouts est plate alors qu'elle devrait être imbriquée. Rediriger n'est pas un échec — c'est le flux de travail normal. La compétence est d'identifier le problème rapidement et de donner une correction précise.",
    },
    {
      type: 'code-demo',
      title: 'Redirection : mauvais type de composant',
      body: 'L\'agent a fait de la page de liste de favoris un composant client. Voici comment le rediriger.',
      language: 'text',
      filename: 'redirect-prompt.txt',
      code: "The bookmarks list page (src/app/dashboard/bookmarks/page.tsx)\nshould be a server component, not a client component. It only\ndisplays data — there is no interactivity on this page.\n\nRemove \"use client\", move the data fetch into the component\nbody (direct DB query via Drizzle), and remove the useEffect\n+ useState pattern. The data should be fetched at render time\non the server.",
    },
    {
      type: 'code-demo',
      title: 'Redirection : mauvais pattern de données',
      body: 'L\'agent a créé des routes API pour les mutations. Votre spec disait server actions. Voici la correction.',
      language: 'text',
      filename: 'redirect-prompt-2.txt',
      code: "The spec says \"server actions for mutations.\" You created\nAPI routes at src/app/api/bookmarks/route.ts. Remove those.\n\nInstead, create server actions in src/app/dashboard/bookmarks/\nactions.ts using \"use server\". The form in the add-bookmark\ncomponent should call the server action directly via the\naction prop or useFormAction.",
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
      type: 'info',
      title: 'Évaluer la hiérarchie des layouts',
      body: "Les layouts dans l'App Router de Next.js sont imbriqués par défaut. Un layout à app/dashboard/layout.tsx enveloppe toutes les pages sous /dashboard/*. C'est là que vous mettez l'UI partagée : barres latérales, navigation, wrappers d'auth. L'agent devrait créer des layouts correspondant aux exigences d'UI partagée de votre spec. Erreurs courantes : tout mettre dans le root layout (rendant impossible d'avoir des layouts différents par section), ou ne pas créer de layouts du tout (dupliquant le code de la sidebar dans chaque page).",
    },
    {
      type: 'code-demo',
      title: 'Hiérarchie de layouts attendue',
      body: 'Pour la spec de l\'app de favoris, voici l\'imbrication correcte des layouts. Vérifiez que l\'agent produit quelque chose d\'équivalent.',
      language: 'text',
      filename: 'expected-structure.txt',
      code: "src/app/\n├── layout.tsx          ← Root: html, body, fonts, global providers\n├── page.tsx            ← Landing page (no sidebar)\n├── dashboard/\n│   ├── layout.tsx      ← Dashboard: sidebar + auth wrapper\n│   ├── page.tsx        ← Dashboard home\n│   ├── bookmarks/\n│   │   ├── page.tsx    ← Bookmark list (server component)\n│   │   └── [id]/\n│   │       └── page.tsx ← Bookmark detail (dynamic)\n│   └── settings/\n│       └── page.tsx    ← Settings form (client component)\n└── globals.css",
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
      type: 'info',
      title: 'Vérifier le scaffold',
      body: "Après le scaffold de l'agent, faites une passe de vérification rapide. Vérifiez que la structure de fichiers correspond aux routes de votre spec. Ouvrez les fichiers clés pour confirmer la stratégie de rendu (cherchez les directives « use client »). Vérifiez que le package.json a les bonnes dépendances. Lancez le serveur de dev pour confirmer qu'il démarre sans erreurs. Ça prend 2 minutes et attrape les problèmes structurels avant que vous construisiez des fonctionnalités sur une fondation cassée.",
    },
    {
      type: 'terminal',
      instruction: 'Après le scaffolding, vérifiez que le projet démarre sans erreurs :',
      expectedCommand: 'npm run dev',
      hint: 'La commande dev standard de Next.js',
    },
    {
      type: 'code-demo',
      title: 'Prompts de vérification pour Claude Code',
      body: 'Vous pouvez demander à Claude Code de s\'auto-vérifier par rapport à votre spec. Il lira les fichiers générés et rapportera les divergences.',
      language: 'text',
      filename: 'verify-prompt.txt',
      code: "Review the project structure you just created against my spec.\nFor each route in the spec, confirm:\n1. The file exists at the correct path\n2. The rendering strategy is correct (server vs client)\n3. The layout hierarchy matches the nesting I specified\n\nList any discrepancies.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Flux de vérification verrouillé !',
    },

    // === COMMON PATTERNS ===
    {
      type: 'info',
      title: 'Pattern : composant serveur avec îlots client',
      body: "Le pattern correct le plus courant dans l'App Router de Next.js : la page est un composant serveur qui récupère les données, et les éléments interactifs sont extraits dans de petits composants client enfants. La page passe les données via props. Ça vous donne la performance de récupération de données côté serveur avec l'interactivité côté client où nécessaire. Si l'agent fait de toute la page un composant client pour supporter un clic de bouton, redirigez-le vers ce pattern.",
    },
    {
      type: 'code-demo',
      title: 'Page serveur avec îlot client',
      body: 'La page récupère les données sur le serveur. Le bouton supprimer interactif est un composant client séparé.',
      language: 'typescript',
      filename: 'src/app/dashboard/bookmarks/page.tsx',
      code: "import { db } from '@/db'\nimport { bookmarks } from '@/db/schema'\nimport { DeleteButton } from './delete-button' // client component\n\nexport default async function BookmarksPage() {\n  const allBookmarks = await db.select().from(bookmarks)\n\n  return (\n    <div>\n      <h1>Bookmarks</h1>\n      {allBookmarks.map((b) => (\n        <div key={b.id}>\n          <a href={b.url}>{b.title}</a>\n          <DeleteButton id={b.id} />\n        </div>\n      ))}\n    </div>\n  )\n}",
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
      type: 'info',
      title: 'Ce qu\'il faut laisser au jugement de l\'agent',
      body: "Chaque décision n'a pas besoin de votre avis. Laissez l'agent décider : les noms de fichiers de composants et l'organisation interne, le placement des fonctions utilitaires, le nommage des classes CSS dans Tailwind, le placement des error boundaries, les emplacements de loading.tsx et not-found.tsx, le nommage des interfaces TypeScript. Ce sont des détails d'implémentation qui n'affectent pas l'architecture. Les micro-gérer gaspille votre temps et la fenêtre de contexte de l'agent. Concentrez-vous sur les décisions coûteuses à changer plus tard.",
    },
    {
      type: 'info',
      title: 'L\'heuristique du coût de changement',
      body: "Quelles décisions devriez-vous contrôler dans la spec ? Utilisez l'heuristique du coût de changement. Structure de routing — coûteux à changer (affecte les URLs, la navigation, le flux de données). Stratégie de rendu — coûteux (restructurer les limites serveur/client se propage). Hiérarchie des layouts — modéré (nécessite de déplacer des fichiers et de mettre à jour l'état partagé). Nommage des composants — pas cher (rechercher-remplacer). Classes Tailwind — trivial. Verrouillez les décisions coûteuses. Laissez les pas chères à l'agent.",
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
