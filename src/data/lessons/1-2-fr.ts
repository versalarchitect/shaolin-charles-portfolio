import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-2',
  steps: [
    {
      type: 'info',
      title: 'La mémoire de travail du modèle',
      body: 'Chaque fois que tu parles à Claude, tu écris dans un tampon de taille fixe appelé la fenêtre de contexte. Elle contient tout : le prompt système, ton CLAUDE.md, les fichiers de code que l\'agent lit, ton historique de conversation et les réponses du modèle. Quand le tampon se remplit, les informations les plus anciennes sont perdues. Comprendre ce budget, c\'est la différence entre une session productive et une où l\'agent oublie ce que tu as demandé il y a dix minutes.',
    },
    {
      type: 'info',
      title: 'C\'est quoi une fenêtre de contexte ?',
      body: 'Pense à ça comme un tableau blanc avec une surface fixe. Le tableau blanc de Claude fait 200 000 tokens — environ 150 000 mots ou 500 pages de texte. Ça semble énorme, mais ça se remplit plus vite que tu ne le penses. Les prompts système, les fichiers CLAUDE.md et le contexte de code peuvent consommer 30-50 % de la fenêtre avant même que tu tapes un seul mot.',
    },
    {
      type: 'interactive-diagram',
      title: 'Budget de la fenêtre de contexte',
      body: 'Clique sur chaque étape pour voir comment une session typique de Claude Code remplit la fenêtre de contexte.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'sys', label: 'Prompt système', sublabel: '~2K tokens', shape: 'rounded' },
          { id: 'claude', label: 'CLAUDE.md', sublabel: '~1-5K tokens', shape: 'rounded' },
          { id: 'code', label: 'Contexte de code', sublabel: '~10-50K tokens' },
          { id: 'window', label: 'Fenêtre de contexte', sublabel: '200K total', shape: 'rounded', highlight: true },
          { id: 'prompt', label: 'Ton prompt', sublabel: '~0.5-2K tokens' },
          { id: 'response', label: 'Réponse du modèle', sublabel: 'Le reste', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'sys', to: 'window', label: 'chargé en premier' },
          { from: 'claude', to: 'window', label: 'injecté auto' },
          { from: 'code', to: 'window', label: 'fichiers lus' },
          { from: 'prompt', to: 'window' },
          { from: 'window', to: 'response', label: 'ce qui reste' },
        ],
      },
      stages: [
        {
          highlightNodes: ['window'],
          highlightEdges: [],
          explanation: 'Tu commences avec une fenêtre de contexte vierge de 200 000 tokens. Pense à ça comme un tableau blanc vide. Tout ce qui se passe dans cette session doit tenir sur cette surface.',
        },
        {
          highlightNodes: ['sys', 'window'],
          highlightEdges: [{ from: 'sys', to: 'window' }],
          explanation: 'Le prompt système est chargé en premier, consommant environ 2 000 tokens. Il contient les instructions de base et les capacités de Claude. Tu ne le vois jamais, mais il est toujours là.',
        },
        {
          highlightNodes: ['claude', 'window'],
          highlightEdges: [{ from: 'claude', to: 'window' }],
          explanation: 'Ton fichier CLAUDE.md est injecté automatiquement ensuite, utilisant 1 000 à 5 000 tokens. C\'est la mémoire persistante de ton projet — règles d\'architecture, conventions, décisions.',
        },
        {
          highlightNodes: ['code', 'window'],
          highlightEdges: [{ from: 'code', to: 'window' }],
          explanation: 'Au fur et à mesure que l\'agent lit des fichiers, chacun remplit la fenêtre. Cinq fichiers peuvent facilement consommer 10 000 à 50 000 tokens. C\'est généralement le plus gros consommateur après l\'historique de conversation.',
        },
        {
          highlightNodes: ['prompt', 'window'],
          highlightEdges: [{ from: 'prompt', to: 'window' }],
          explanation: 'Tes prompts sont relativement petits — 500 à 2 000 tokens chacun. Mais ils s\'accumulent au fil de la session. Après 20 échanges, ça monte vite.',
        },
        {
          highlightNodes: ['window', 'response'],
          highlightEdges: [{ from: 'window', to: 'response' }],
          explanation: 'Les tokens restants sont disponibles pour la réponse du modèle. Au début d\'une session il y a amplement de place. Après 30 minutes, la fenêtre peut être presque pleine, et la qualité des réponses se dégrade.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Modèle de fenêtre de contexte compris !',
    },

    // === TOKEN COUNTING ===
    {
      type: 'info',
      title: 'Comment fonctionnent les tokens',
      body: 'Les tokens ne sont ni des caractères ni des mots — ce sont des morceaux de texte que le modèle traite comme des unités individuelles. En prose anglaise, 1 token fait environ 4 caractères ou 0,75 mot. Mais le code est plus dense : les noms de variables, les crochets et l\'indentation consomment tous des tokens. Un fichier TypeScript de 200 lignes peut faire entre 2 000 et 4 000 tokens selon la complexité.',
    },
    {
      type: 'multiple-choice',
      question: 'Environ combien de tokens fait la phrase "The quick brown fox jumps over the lazy dog" (44 caractères) ?',
      options: [
        '5 tokens',
        '10 tokens',
        '44 tokens',
        '20 tokens',
      ],
      correctIndex: 1,
      explanation: '44 caractères / ~4 caractères par token = environ 10-11 tokens. L\'heuristique de 1 token pour 4 caractères anglais est une estimation rapide fiable.',
    },
    {
      type: 'code-demo',
      title: 'Heuristiques d\'estimation des tokens',
      body: 'Utilise ces règles empiriques pour estimer rapidement la consommation de tokens sans aucun outil.',
      language: 'text',
      filename: 'token-heuristics.txt',
      code: 'English prose:  1 token ≈ 4 characters ≈ 0.75 words\nCode (JS/TS):   1 token ≈ 3 characters (denser)\nJSON/config:    1 token ≈ 2.5 characters (very dense)\n\nQuick estimates:\n- Short prompt (2 sentences):     ~30-50 tokens\n- Detailed prompt (paragraph):    ~150-300 tokens\n- CLAUDE.md (typical):            ~1,000-5,000 tokens\n- 100-line TypeScript file:       ~1,000-2,000 tokens\n- Full React component (300 LOC): ~3,000-6,000 tokens\n- npm package.json:               ~500-1,500 tokens',
    },
    {
      type: 'code-input',
      instruction: 'Un fichier TypeScript fait 400 lignes. En utilisant l\'heuristique que 100 lignes de code font environ 1 000 à 2 000 tokens, quelle est une estimation haute raisonnable pour ce fichier ?',
      placeholder: 'Entre un nombre (tokens)',
      answer: '8000',
      hint: '400 lignes / 100 = 4 groupes, fois la borne supérieure de 2 000',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Calcul de tokens maîtrisé !',
    },

    // === WHAT FILLS THE WINDOW ===
    {
      type: 'info',
      title: 'Ce qui remplit la fenêtre dans Claude Code',
      body: 'Quand tu démarres une session Claude Code, la fenêtre de contexte n\'est pas vide. Le prompt système est injecté automatiquement. Ton CLAUDE.md est chargé. Au fur et à mesure que l\'agent travaille, il lit des fichiers, exécute des commandes, et chaque appel d\'outil et son résultat s\'ajoutent à la fenêtre. Un simple « lis ce fichier et refactorise-le » peut consommer 10 000+ tokens entre le contenu du fichier, l\'analyse du modèle et le code réécrit.',
    },
    {
      type: 'order',
      instruction: 'Ordonne ces éléments du PLUS de tokens consommés au MOINS dans une session Claude Code typique :',
      items: [
        'Fichiers de code lus par l\'agent',
        'Historique de conversation',
        'Prompt système',
        'Tes prompts tapés',
        'Contenu du CLAUDE.md',
      ],
      correctOrder: [0, 1, 4, 2, 3],
    },
    {
      type: 'terminal',
      instruction: 'Utilise wc pour compter les caractères dans un fichier, que tu peux ensuite diviser par 3-4 pour estimer les tokens. Essaie sur un fichier TypeScript :',
      expectedCommand: 'wc -c src/App.tsx',
      hint: 'wc -c <chemin_du_fichier>',
    },
    {
      type: 'code-demo',
      title: 'Estimer un budget de session',
      body: 'Avant de commencer une tâche complexe, esquisse ton budget de tokens pour voir si ça tient dans une seule session.',
      language: 'text',
      filename: 'session-budget.txt',
      code: 'Context Window:           200,000 tokens\n─────────────────────────────────────\nSystem prompt:             -2,000\nCLAUDE.md:                 -3,000\nFiles to read (5 files):  -15,000\nConversation so far:      -20,000\nYour next prompt:            -500\n─────────────────────────────────────\nRemaining for response:   159,500 tokens  ✓ Plenty\n\n--- After 30 minutes of back-and-forth ---\n\nConversation history:    -140,000\nFiles read this session:  -40,000\nSystem + CLAUDE.md:        -5,000\n─────────────────────────────────────\nRemaining for response:    15,000 tokens  ⚠ Getting tight\nRemaining after next read: ~5,000 tokens  ✗ Danger zone',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Planification du budget débloquée !',
    },

    // === CONTEXT EXHAUSTION ===
    {
      type: 'info',
      title: 'Quand la fenêtre se remplit',
      body: 'L\'épuisement du contexte est réel et ses symptômes sont subtils. Le modèle ne plante pas — il se dégrade. Il commence à répéter des instructions que tu as déjà données. Il oublie des contraintes du début de la conversation. La qualité du code baisse. Il relit des fichiers qu\'il a déjà lus. Tu pourrais penser que le modèle « est nul », mais il a littéralement perdu la mémoire de tes messages précédents.',
    },
    {
      type: 'multiple-choice',
      question: 'Lequel n\'est PAS un symptôme d\'épuisement de la fenêtre de contexte ?',
      options: [
        'Le modèle oublie les instructions du début de la session',
        'Le modèle commence à se répéter',
        'Le modèle refuse complètement de répondre',
        'La qualité et la cohérence du code diminuent',
      ],
      correctIndex: 2,
      explanation: 'Le modèle ne refuse pas de répondre — il continue, mais avec une qualité dégradée. Il perd silencieusement l\'ancien contexte, ce qui rend les symptômes plus difficiles à repérer qu\'une erreur franche.',
    },
    {
      type: 'diagram',
      title: 'Épuisement du contexte',
      body: 'Quand la fenêtre de contexte se remplit, Claude Code déclenche la compaction pour libérer de l\'espace — mais certaines informations sont inévitablement perdues.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'full', label: 'Fenêtre pleine', sublabel: '200K utilisés', shape: 'rounded', highlight: true },
          { id: 'compact', label: 'Compaction ?', shape: 'diamond' },
          { id: 'lost', label: 'Anciens msgs perdus', sublabel: 'Résumés' },
          { id: 'kept', label: 'Contexte clé', sublabel: 'Préservé' },
          { id: 'resume', label: 'Continue', shape: 'pill' },
        ],
        edges: [
          { from: 'full', to: 'compact', label: 'seuil atteint' },
          { from: 'compact', to: 'lost', label: 'basse priorité' },
          { from: 'compact', to: 'kept', label: 'haute priorité' },
          { from: 'lost', to: 'resume', dashed: true },
          { from: 'kept', to: 'resume' },
        ],
      },
    },
    {
      type: 'info',
      title: 'Comment fonctionne la compaction',
      body: 'Claude Code compacte automatiquement la conversation quand la fenêtre de contexte approche sa limite. Il résume les anciens messages sous une forme compressée, en préservant les détails les plus importants — chemins de fichiers, décisions clés, tâche en cours — tout en abandonnant la formulation exacte des échanges précédents. C\'est pourquoi tu vois parfois « [conversation compacted] » dans ta session. Le modèle continue de travailler, mais sa mémoire du début de la conversation devient un résumé, pas un transcript.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Patterns d\'épuisement reconnus !',
    },
    {
      type: 'compare',
      title: 'Session fraîche vs session épuisée',
      body: 'Le même agent se comporte très différemment selon la quantité de contexte déjà consommée.',
      left: {
        label: 'Fraîche (début de session)',
        content: 'Available: 200,000 tokens\nSystem prompt: loaded\nCLAUDE.md: loaded\nYour code: not yet read\n\nAgent behavior:\n✓ Follows all instructions\n✓ Consistent style\n✓ Remembers constraints',
        language: 'text',
      },
      right: {
        label: 'Épuisée (30 min après)',
        content: 'Available: ~12,000 tokens\nSystem prompt: compressed\nCLAUDE.md: partially lost\nYour code: fragments remain\n\nAgent behavior:\n✗ Forgets earlier decisions\n✗ Contradicts itself\n✗ Ignores constraints',
        language: 'text',
      },
    },
    {
      type: 'match',
      instruction: 'Associe chaque consommateur de contexte à son coût approximatif en tokens :',
      leftItems: ['Prompt système', 'Fichier CLAUDE.md', 'Gros fichier de code (500 lignes)', 'Historique de conversation (30 min)'],
      rightItems: ['~2 000 tokens', '1 000–5 000 tokens', '5 000–15 000 tokens', '20 000–80 000 tokens'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'L\'historique de conversation est de loin le plus gros consommateur. Une session de 30 minutes peut engloutir 20K à 80K tokens en allers-retours, laissant peu de place pour le travail réel.',
    },

    // === STRATEGIES ===
    {
      type: 'info',
      title: 'Stratégie 1 : Démarrer de nouvelles sessions',
      body: 'La stratégie la plus efficace est de savoir quand démarrer une nouvelle session. Si tu fais des allers-retours depuis 20+ messages, ou si le modèle montre des symptômes d\'épuisement, démarre une nouvelle conversation. Tu ne perds rien — les changements de code sont déjà sauvegardés sur le disque. La nouvelle session démarre avec une fenêtre propre de 200K.',
    },
    {
      type: 'info',
      title: 'Stratégie 2 : CLAUDE.md comme mémoire externe',
      body: 'Ton fichier CLAUDE.md est chargé à neuf au début de chaque session. Mets-y les décisions persistantes, les règles d\'architecture et les conventions du projet au lieu de les répéter dans chaque prompt. C\'est une mémoire externe qui survit aux réinitialisations de contexte. Pense à ça comme le stockage à long terme du modèle, tandis que la fenêtre de contexte est le court terme.',
    },
    {
      type: 'code-demo',
      title: 'Stratégie 3 : Des fichiers de spec pour les tâches complexes',
      body: 'Pour les grosses tâches, écris un fichier de spec que l\'agent peut consulter. Ça garde les détails critiques disponibles même après la compaction.',
      language: 'markdown',
      filename: 'specs/refactor-auth.md',
      code: '# Auth Refactor Spec\n\n## Goal\nReplace session-based auth with JWT tokens.\n\n## Files to modify\n- src/middleware/auth.ts\n- src/routes/login.ts\n- src/routes/protected.ts\n- src/lib/jwt.ts (new)\n\n## Constraints\n- Must be backward compatible with existing sessions\n- Token expiry: 24 hours\n- Refresh tokens: 7 days\n\n## Definition of done\n- [ ] All protected routes accept Bearer tokens\n- [ ] Login returns JWT + refresh token\n- [ ] Old session cookies still work (migration period)',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi un fichier de spec est-il plus efficace qu\'un long prompt initial pour les tâches complexes ?',
      options: [
        'Les fichiers de spec sont plus rapides à écrire',
        'L\'agent peut le relire après la compaction, mais un long prompt est résumé et perdu',
        'Les fichiers de spec utilisent moins de tokens',
        'Le modèle préfère les fichiers markdown',
      ],
      correctIndex: 1,
      explanation: 'Un fichier de spec vit sur le disque. Si le contexte est compacté et que le modèle perd tes instructions détaillées, il peut relire le fichier de spec et récupérer tous les détails. Un long prompt n\'existe que dans la fenêtre de contexte et est compressé lors de la compaction.',
    },
    {
      type: 'checklist',
      title: 'Habitudes de gestion du contexte :',
      items: [
        'Démarrer une nouvelle session quand la qualité se dégrade',
        'Garder CLAUDE.md à jour avec les décisions persistantes',
        'Écrire des fichiers de spec pour les tâches touchant plusieurs fichiers',
        'Estimer le budget de tokens avant de commencer une grosse tâche',
        'Découper les gros refactorings en morceaux focalisés pour une seule session',
        'Surveiller les messages de compaction comme signal d\'alerte',
      ],
    },
    {
      type: 'code-input',
      instruction: 'Dans Claude Code, quelle est la taille approximative de la fenêtre de contexte en tokens ?',
      placeholder: 'Entre un nombre',
      answer: '200000',
      hint: 'C\'est 200K — écris-le comme un nombre complet',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Maîtrise du contexte atteinte ! Tu penses maintenant en budgets de tokens.',
    },
  ],
}

export default content
