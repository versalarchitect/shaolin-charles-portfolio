import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-4',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Principe 1 : Lire avant de générer',
      body: "Tu reçois une tâche — « ajoute une page de connexion » — et tu la tapes immédiatement dans Claude Code. L'agent génère un composant, mais il utilise un framework CSS différent, invente son propre pattern de routage, et importe une bibliothèque qui n'est pas dans le package.json. Tu as créé plus de travail que tu n'en as économisé. La solution : avant de demander à un agent d'écrire ou de modifier du code, tu dois d'abord comprendre ce qui existe déjà — la structure des fichiers, les conventions de nommage, les patterns d'import et les composants existants. Un agent qui reçoit du contexte produit du code qui s'intègre. Un agent qui ne reçoit qu'une description de tâche produit du code qui entre en conflit.",
    },

    // === DIAGRAM 1: Read Then Generate ===
    {
      type: 'interactive-diagram',
      title: 'Lire puis générer',
      body: 'Clique sur chaque étape pour suivre le workflow correct quand on dirige un agent pour modifier une codebase.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'codebase', label: 'Codebase', shape: 'rounded', highlight: true },
          { id: 'read', label: 'Lire les fichiers' },
          { id: 'map', label: 'Cartographier' },
          { id: 'prompt', label: 'Écrire le prompt' },
          { id: 'build', label: 'L\'agent construit' },
          { id: 'verified', label: 'Vérifié', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'codebase', to: 'read' },
          { from: 'read', to: 'map' },
          { from: 'map', to: 'prompt' },
          { from: 'prompt', to: 'build' },
          { from: 'build', to: 'verified' },
        ],
      },
      stages: [
        {
          highlightNodes: ['codebase'],
          highlightEdges: [],
          explanation: 'Commence par la codebase. Avant de taper un seul mot à l\'agent, le code a déjà des patterns, des conventions et des composants existants. Ton travail est de les découvrir.',
        },
        {
          highlightNodes: ['codebase', 'read'],
          highlightEdges: [{ from: 'codebase', to: 'read' }],
          explanation: 'Lis les fichiers clés : package.json pour les dépendances, CLAUDE.md pour les règles du projet, et des composants existants similaires à ce que tu veux construire. Utilise cat, find et grep.',
        },
        {
          highlightNodes: ['read', 'map'],
          highlightEdges: [{ from: 'read', to: 'map' }],
          explanation: 'Cartographie la structure : où vivent les pages ? Comment les composants sont-ils exportés ? Quelle approche de style est utilisée ? Quelle gestion d\'état existe ? Construis un modèle mental du projet.',
        },
        {
          highlightNodes: ['map', 'prompt'],
          highlightEdges: [{ from: 'map', to: 'prompt' }],
          explanation: 'Maintenant écris un prompt qui référence des fichiers spécifiques, des patterns et des conventions que tu as découverts. L\'agent passe de la devinette au suivi d\'un plan.',
        },
        {
          highlightNodes: ['prompt', 'build', 'verified'],
          highlightEdges: [{ from: 'prompt', to: 'build' }, { from: 'build', to: 'verified' }],
          explanation: 'L\'agent construit du code qui s\'intègre à ton projet du premier coup. Pas de patterns conflictuels, pas de conventions inventées, pas d\'itérations gaspillées. Vérifie et livre.',
        },
      ],
    },

    // === THE ANTI-PATTERN ===
    {
      type: 'code-fill',
      instruction: 'Voici ce qui arrive quand tu sautes la lecture. L\'agent n\'a aucun contexte et fait des suppositions fausses. Remplis ce que ton projet utilise vraiment vs ce que l\'agent a supposé.',
      language: 'text',
      template: '# You type:\n"Add a login page to my app"\n\n# The agent assumes:\n- React Router (your app uses {{actual_router}})\n- Tailwind CSS (your app uses {{actual_css}})\n- A new AuthContext (your app already has one in {{auth_path}})\n- fetch() for API calls (your app uses axios with interceptors)\n\n# Result: a "working" component that breaks everything',
      blanks: [
        { id: 'actual_router', answer: 'TanStack Router', alternatives: ['tanstack router', 'tanstack-router', 'TanStack router'], placeholder: '______', hint: 'Une bibliothèque de routage React populaire et type-safe' },
        { id: 'actual_css', answer: 'styled-components', alternatives: ['Styled Components', 'styled components'], placeholder: '______', hint: 'Bibliothèque CSS-in-JS utilisant des template literals' },
        { id: 'auth_path', answer: 'src/providers/', alternatives: ['src/providers', 'src/providers/*'], placeholder: '______', hint: 'Où vivent généralement les providers de contexte React' },
      ],
      explanation: 'Sans lire la codebase d\'abord, l\'agent comble les lacunes avec les patterns les plus courants de ses données d\'entraînement — pas les patterns de ton projet. Chaque mauvaise supposition crée plus de travail que tu n\'en as économisé.',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi la génération à l\'aveugle produit-elle du code en conflit avec la codebase existante ?',
      options: [
        'Le modèle IA n\'est pas assez puissant',
        'L\'agent n\'a aucun contexte sur les conventions du projet et comble les lacunes avec des suppositions',
        'L\'agent ignore intentionnellement les patterns existants',
        'La génération à l\'aveugle ne échoue que sur les gros projets',
      ],
      correctIndex: 1,
      explanation: "Les agents IA prédisent le code le plus probable pour ta requête. Sans contexte sur ton projet spécifique, « le plus probable » signifie les patterns les plus courants des données d'entraînement — pas les patterns de ton projet. L'agent n'a pas tort ; il est non informé.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu comprends pourquoi lire d\'abord est important !',
    },

    // === THE EXPLORATION WORKFLOW ===
    {
      type: 'multiple-choice',
      question: 'Avant de demander à un agent IA de modifier du code, quels trois types de reconnaissance devrais-tu lancer ?',
      options: [
        'build, test, deploy',
        'find (quels fichiers existent), grep (quels patterns sont utilisés), read (comment fonctionnent les fichiers)',
        'install, configure, run',
        'commit, push, merge',
      ],
      correctIndex: 1,
      explanation: 'Avant de toucher au code, lance trois types de reconnaissance : find (quels fichiers existent), grep (quels patterns sont utilisés), et read (comment fonctionnent des fichiers spécifiques). Pense à ça comme un chirurgien qui étudie les scans avant d\'opérer — tu dois connaître l\'anatomie avant de couper.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ces commandes find pour cartographier la structure du projet. La commande find te montre quels fichiers existent et où ils se trouvent.',
      language: 'bash',
      filename: 'terminal',
      template: '# See all TypeScript/React files\nfind . -name "{{tsx_pattern}}" | head -20\n\n# Find component files specifically\nfind ./src/{{components_dir}} -name "*.tsx"\n\n# Find config files at the root\nfind . -maxdepth 1 -name "{{config_pattern}}"\n\n# Find test files\nfind . -name "*.test.*" -o -name "*.spec.*"',
      blanks: [
        { id: 'tsx_pattern', answer: '*.tsx', alternatives: ['*.TSX'], placeholder: '______', hint: 'Le pattern glob pour les fichiers TypeScript React' },
        { id: 'components_dir', answer: 'components', alternatives: ['Components'], placeholder: '______', hint: 'Le répertoire standard pour les composants React' },
        { id: 'config_pattern', answer: '*.config.*', alternatives: ['*.config.ts', '*.config.js'], placeholder: '______', hint: 'Pattern glob correspondant à vite.config.ts, tailwind.config.js, etc.' },
      ],
      explanation: 'La commande find est ton premier outil de reconnaissance. Utilise-la pour découvrir quels fichiers existent, où vivent les composants, et quels fichiers de config contrôlent le projet. Ça te donne une carte du projet avant de demander à l\'agent de changer quoi que ce soit.',
    },
    {
      type: 'terminal',
      instruction: 'Utilise find pour découvrir tous les fichiers TypeScript React dans un projet. Tape cette commande :',
      expectedCommand: 'find . -name "*.tsx" | head -20',
      hint: 'Utilise find avec -name pour matcher l\'extension .tsx, redirige vers head pour limiter la sortie',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ces commandes grep pour découvrir les patterns du projet. Une fois que tu sais quels fichiers existent, grep te dit comment ils fonctionnent.',
      language: 'bash',
      filename: 'terminal',
      template: '# How are components exported?\ngrep -r "{{export_pattern}}" src/components/ | head -10\ngrep -r "export function" src/components/ | head -10\n\n# What routing library is used?\ngrep -r "import.*from.*{{router_search}}" src/ | head -5\n\n# What state management exists?\ngrep -r "createContext\\|useContext\\|zustand\\|{{state_lib}}" src/ | head -10',
      blanks: [
        { id: 'export_pattern', answer: 'export default', alternatives: ['export default function'], placeholder: '______', hint: 'La combinaison de mots-clés pour les exports par défaut' },
        { id: 'router_search', answer: 'router', alternatives: ['Router'], placeholder: '______', hint: 'Mot-clé trouvé dans les chemins d\'import des bibliothèques de routage' },
        { id: 'state_lib', answer: 'redux', alternatives: ['Redux', 'jotai', 'recoil'], placeholder: '______', hint: 'Une bibliothèque populaire de gestion d\'état pour React' },
      ],
      explanation: 'Grep est ton deuxième outil de reconnaissance. Il révèle les conventions que suit ton projet : comment les composants sont exportés, quelles bibliothèques sont utilisées pour le routage et l\'état, et quels patterns existent. C\'est du contexte essentiel pour écrire des prompts informés.',
    },
    {
      type: 'terminal',
      instruction: 'Utilise grep pour trouver comment les composants sont exportés dans un projet :',
      expectedCommand: 'grep -r "export default" src/components/ | head -10',
      hint: 'Utilise grep -r pour chercher récursivement dans le répertoire des composants',
    },
    {
      type: 'code-fill',
      instruction: 'Complète ces commandes de lecture. Ces fichiers d\'ancrage t\'en disent plus sur le projet que toute autre source.',
      language: 'bash',
      filename: 'terminal',
      template: '# Project dependencies and scripts\ncat {{deps_file}}\n\n# Project-specific AI instructions\ncat {{ai_file}}\n\n# Routing configuration\ncat src/routes.tsx\n\n# An existing component (to match its pattern)\ncat src/components/Dashboard.tsx\n\n# Global styles and theme\ncat src/{{styles_file}}',
      blanks: [
        { id: 'deps_file', answer: 'package.json', alternatives: ['Package.json'], placeholder: '______', hint: 'Le fichier qui liste les dépendances et scripts du projet' },
        { id: 'ai_file', answer: 'CLAUDE.md', alternatives: ['claude.md'], placeholder: '______', hint: 'Le fichier d\'instructions IA spécifiques au projet' },
        { id: 'styles_file', answer: 'globals.css', alternatives: ['global.css', 'index.css', 'app.css'], placeholder: '______', hint: 'La feuille de style globale du projet' },
      ],
      explanation: 'Lire les fichiers d\'ancrage est ton troisième outil de reconnaissance. package.json révèle la stack technique, CLAUDE.md contient les règles spécifiques au projet, et les composants existants montrent les patterns que tu dois reproduire. Lis avant de prompter.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu connais le workflow find-grep-read !',
    },

    // === WHAT TO MAP ===
    {
      type: 'checklist',
      title: 'Ce qu\'il faut cartographier avant de prompter',
      items: [
        'Structure des fichiers — où vivent les composants, pages, hooks et utils ?',
        'Conventions de nommage — fichiers PascalCase ? kebab-case ? barrels index.ts ?',
        'Patterns d\'import — chemins absolus (@/components) ou relatifs (../../) ?',
        'Composants existants — y a-t-il un Button, Modal ou Form que tu devrais réutiliser ?',
        'Routage — quelle bibliothèque et quel pattern (basé sur les fichiers, basé sur la config) ?',
        'Gestion d\'état — Context, Zustand, Redux ou simples props ?',
        'Style — Tailwind, CSS modules, styled-components ou inline ?',
        'Couche API — fetch, axios, tRPC ou client généré ?',
      ],
    },
    {
      type: 'order',
      instruction: 'Ordonne ces étapes d\'exploration de la PREMIÈRE à la DERNIÈRE :',
      items: [
        'Écrire le prompt pour l\'agent',
        'Lire le package.json et les fichiers de config',
        'Trouver la structure de fichiers du projet',
        'Grep pour les patterns et conventions',
      ],
      correctOrder: [2, 1, 3, 0],
    },

    // === DIAGRAM 2: Blind vs Informed ===
    {
      type: 'interactive-diagram',
      title: 'Génération aveugle vs informée',
      body: 'Clique pour voir comment la même tâche produit des résultats très différents selon que tu lis la codebase d\'abord ou non.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'task', label: 'Tâche', shape: 'rounded' },
          { id: 'decision', label: 'Lu d\'abord ?', shape: 'diamond' },
          { id: 'blind', label: 'Sortie aveugle', sublabel: 'Conflits, bugs' },
          { id: 'informed', label: 'Sortie informée', sublabel: 'Propre, cohérent', highlight: true },
        ],
        edges: [
          { from: 'task', to: 'decision' },
          { from: 'decision', to: 'blind', label: 'non' },
          { from: 'decision', to: 'informed', label: 'lu d\'abord' },
        ],
      },
      stages: [
        {
          highlightNodes: ['task'],
          highlightEdges: [],
          explanation: 'Tu as une tâche : « Ajoute une page de paramètres. » La même tâche produira des résultats radicalement différents selon ce que tu fais ensuite.',
        },
        {
          highlightNodes: ['task', 'decision'],
          highlightEdges: [{ from: 'task', to: 'decision' }],
          explanation: 'Le fork critique : lis-tu la codebase d\'abord, ou sautes-tu directement au prompting ? Cette seule décision détermine si la sortie de l\'agent s\'intègre à ton projet ou le combat.',
        },
        {
          highlightNodes: ['decision', 'blind'],
          highlightEdges: [{ from: 'decision', to: 'blind' }],
          explanation: 'Sauter la lecture : l\'agent devine. Il choisit React Router (tu utilises TanStack), Tailwind (tu utilises styled-components), crée un nouveau AuthContext (tu en as déjà un). Résultat : conflits, bugs, temps perdu à corriger des suppositions.',
        },
        {
          highlightNodes: ['decision', 'informed'],
          highlightEdges: [{ from: 'decision', to: 'informed' }],
          explanation: 'Lire d\'abord : l\'agent suit ton plan. Il utilise ton routeur, ton approche de style, ton contexte d\'auth existant, tes patterns de composants. Résultat : du code propre qui s\'intègre du premier coup.',
        },
      ],
    },

    // === CONTEXT-AWARE PROMPTS ===
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce qui rend un « prompt contextualisé » différent d\'un prompt ordinaire ?',
      options: [
        'Il utilise un langage plus poli',
        'Il référence des fichiers spécifiques, des patterns et des conventions découverts en lisant la codebase',
        'Il fait plus de 500 mots',
        'Il inclut le code source entier du projet',
      ],
      correctIndex: 1,
      explanation: 'Une fois que tu as lu la codebase, tu injectes ces connaissances dans ton prompt. Un prompt contextualisé dit à l\'agent quels patterns suivre, quels composants réutiliser et quelles conventions respecter. L\'agent passe de la devinette au suivi d\'un plan.',
    },
    {
      type: 'code-demo',
      title: 'Avant vs après la lecture',
      body: "Compare ces deux prompts pour la même tâche. Le second produit du code qui s'intègre au projet du premier coup.",
      language: 'text',
      code: '# BEFORE reading (blind):\n"Add a settings page where users can update their profile"\n\n# AFTER reading (informed):\n"Add a Settings page at src/pages/Settings.tsx.\nFollow the same pattern as src/pages/Dashboard.tsx:\n- Use the AppLayout wrapper component\n- Use react-hook-form for the form (already in package.json)\n- Use the existing supabase client from src/lib/supabase.ts\n- Use Tailwind classes matching the card pattern in Dashboard\n- Add the route in src/routes.tsx using the lazy-load pattern\n- Export as default function component (matches convention)"',
    },
    {
      type: 'code-input',
      instruction: 'Tu as lu la codebase et trouvé que les composants sont dans src/components/, utilisent des exports par défaut et suivent le nommage PascalCase. Complète ce prompt :',
      placeholder: 'Create a Navbar component at src/components/______.tsx using a ______ export',
      answer: 'Navbar',
      hint: 'Respecte la convention de nommage PascalCase que tu as découverte',
    },
    {
      type: 'multiple-choice',
      question: 'Quel prompt produira le code le plus cohérent ?',
      options: [
        '"Construis-moi un composant de tableau de données"',
        '"Construis un DataTable à src/components/DataTable.tsx. Utilise le même pattern de card Tailwind que UserList.tsx, le hook useQuery de src/hooks/useApi.ts, et reproduis l\'approche de tri par colonnes existante dans OrdersTable."',
        '"Construis un tableau de données. Utilise React et TypeScript."',
        '"Construis un beau tableau de données avec tri et filtrage"',
      ],
      correctIndex: 1,
      explanation: 'Ce prompt référence des fichiers existants spécifiques, des hooks, des patterns et des conventions découverts en lisant la codebase. L\'agent peut reproduire le style exact au lieu d\'inventer le sien.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu sais écrire des prompts contextualisés !',
    },
    {
      type: 'compare',
      title: 'Prompt aveugle vs prompt informé',
      body: 'La même tâche produit des résultats très différents selon que tu lis la codebase d\'abord ou non.',
      question: 'Quel prompt produira du code qui respecte les patterns existants du projet ?',
      correctSide: 'right',
      left: {
        label: 'Aveugle',
        content: '"Add a navbar component with links to Home, About, and Contact pages."',
        language: 'text',
      },
      right: {
        label: 'Informé',
        content: '"Add a navbar component at src/components/navbar.tsx. Use the existing Button component from @/components/ui/button. Follow the project pattern of named exports. Route paths are /, /about, /contact as defined in src/routes.tsx."',
        language: 'text',
      },
      explanation: 'Le prompt informé référence des fichiers spécifiques, des composants existants et des conventions du projet. L\'agent peut construire quelque chose qui s\'intègre à la codebase au lieu de deviner.',
    },

    // === PRACTICE: READING A PROJECT ===
    {
      type: 'terminal',
      instruction: 'C\'est l\'heure de pratiquer. Tu dois ajouter une fonctionnalité « Annonces ». Commence par vérifier les dépendances du projet :',
      expectedCommand: 'cat package.json',
      hint: 'Lis le fichier package.json pour comprendre les dépendances du projet',
    },
    {
      type: 'terminal',
      instruction: 'Maintenant trouve tous les composants de page existants pour comprendre le pattern de routage :',
      expectedCommand: 'find ./src/pages -name "*.tsx"',
      hint: 'Utilise find pour lister les fichiers .tsx dans le répertoire pages',
    },
    {
      type: 'code-demo',
      title: 'Construire ton prompt informé',
      body: "Après avoir lancé find, grep et lu les fichiers clés, tu assembles le tout dans un prompt riche en contexte. Remarque comment chaque décision est ancrée dans quelque chose que tu as réellement observé.",
      language: 'text',
      code: '# Your reconnaissance found:\n# - Pages live in src/pages/ as PascalCase default exports\n# - Routes defined in src/routes.tsx with lazy imports\n# - Uses Supabase for backend (src/lib/supabase.ts)\n# - Existing list pages use a shared Card component\n# - Forms use react-hook-form with zod validation\n\n# Your informed prompt:\n"Add an Announcements page.\n- Create src/pages/Announcements.tsx (default export)\n- Add lazy route in src/routes.tsx matching the existing pattern\n- Fetch announcements from Supabase \'announcements\' table\n  using the client from src/lib/supabase.ts\n- Display in Card components from src/components/ui/card\n- For the create form, use react-hook-form + zod\n  matching the pattern in src/pages/Settings.tsx"',
    },

    // === COMMON MISTAKES ===
    {
      type: 'multiple-choice',
      question: 'Tu dois ajouter une fonctionnalité à une codebase que tu ne connais pas. Que devrais-tu faire EN PREMIER ?',
      options: [
        'Demander à l\'agent d\'ajouter la fonctionnalité immédiatement',
        'Lire le README puis demander à l\'agent',
        'Lancer find/grep/read pour cartographier la structure, les conventions et les dépendances',
        'Demander à l\'agent de t\'expliquer la codebase',
      ],
      correctIndex: 2,
      explanation: "Même si lire le README aide, il ne couvre souvent pas les patterns d'implémentation. Demander à l'agent d'expliquer la codebase est circulaire — il peut halluciner des détails. Lancer find/grep/read toi-même te donne la vérité terrain sur ce qui existe réellement.",
    },

    // === WRAP-UP ===
    {
      type: 'checklist',
      title: 'Check-list du Principe 1',
      items: [
        'Lancer find pour cartographier la structure des fichiers avant de prompter',
        'Lancer grep pour découvrir les patterns d\'export, les imports et les conventions',
        'Lire package.json, les fichiers de config et CLAUDE.md pour le contexte du projet',
        'Lire au moins un fichier existant similaire à ce que tu veux créer',
        'Référencer des fichiers et patterns spécifiques dans ton prompt',
        'Ne jamais demander à un agent de générer du code sans contexte de projet',
      ],
    },
    {
      type: 'checkpoint',
      xp: 11,
      message: 'Leçon terminée ! Tu as maîtrisé le Principe 1 : Lire avant de générer.',
    },
  ],
}

export default content
