import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-1',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Que se passe-t-il quand tu appuies sur Entrée ?',
      body: "Tu tapes un prompt. Une réponse apparaît. Mais entre ces deux instants, une cascade de calculs mathématiques transforme tes mots en nombres, pèse chaque mot par rapport à tous les autres, et prédit le prochain token un à la fois. Comprendre ce pipeline, c'est la différence entre deviner ses prompts et les concevoir avec intention.",
    },
    {
      type: 'info',
      title: 'Pourquoi c\'est important pour diriger des agents',
      body: "Les agents IA sont construits sur des modèles de langage. Quand ton agent comprend mal une instruction, invente un chemin de fichier, ou perd le contexte au milieu d'une tâche, la cause profonde est presque toujours liée à la façon dont le modèle traite le texte. Cette leçon te donne le modèle mental pour diagnostiquer ces échecs au lieu de simplement réessayer.",
    },

    // === TOKENIZATION ===
    {
      type: 'multiple-choice',
      question: 'Comment l\'IA lit-elle votre texte?',
      options: [
        'Elle lit des phrases complètes comme des unités',
        'Elle lit des caractères individuels un à la fois',
        'Elle lit des "tokens" — de petits morceaux de texte, pas des mots entiers',
        'Elle convertit le texte en images d\'abord, puis lit les images',
      ],
      correctIndex: 2,
      explanation: 'Les modèles ne lisent pas des mots — ils lisent des tokens. Un token est un morceau de texte, généralement un fragment de mot. Le mot "tokenization" devient deux tokens : "token" et "ization". Les mots courants comme "the" sont des tokens uniques. Les espaces et la ponctuation sont aussi des tokens. C\'est important parce que l\'IA facture au token et il y a une limite de tokens qu\'elle peut gérer.',
    },
    {
      type: 'multiple-choice',
      question: 'Comment un tokenizer typique découperait-il le mot "unhappiness" ?',
      options: [
        'Un seul token : "unhappiness"',
        'Deux tokens : "unhappy" + "ness"',
        'Trois tokens : "un" + "happi" + "ness"',
        'Onze tokens : un par caractère',
      ],
      correctIndex: 2,
      explanation: 'Les tokenizers découpent les mots en sous-mots appris. Les préfixes courants ("un"), les racines ("happi") et les suffixes ("ness") deviennent chacun des tokens séparés. Ça permet au modèle de comprendre des mots qu\'il n\'a jamais vus en entier en analysant leurs parties.',
    },
    {
      type: 'compare',
      title: 'Le nombre de tokens affecte le coût et les limites',
      body: 'Chaque appel API est facturé au token — en entrée et en sortie. Règle approximative : 1 token fait environ 4 caractères en anglais, soit à peu près 3/4 d\'un mot.',
      question: 'Quel prompt utilise plus de tokens et coûte plus cher?',
      correctSide: 'right',
      left: {
        label: 'Prompt court (~5 tokens)',
        content: '"Explain recursion in Python"\n\nCoût plus bas\nPlus de place pour la réponse\nSortie moins spécifique',
        language: 'text',
      },
      right: {
        label: 'Prompt détaillé (~16 tokens)',
        content: '"Explain recursion in Python with 3 examples, edge cases, and performance analysis"\n\nCoût plus élevé\nMoins de place pour la réponse\nSortie plus spécifique',
        language: 'text',
      },
      explanation: 'Plus de tokens en entrée = coût plus élevé et moins de place pour la réponse. Claude peut gérer environ 200 000 tokens à la fois. Le compromis : des prompts détaillés donnent de meilleurs résultats mais utilisent plus de votre budget de tokens.',
    },
    {
      type: 'terminal',
      instruction: 'Utilise Claude Code pour compter les tokens d\'une courte phrase. Tape cette commande :',
      expectedCommand: 'echo "Hello world" | claude --print-tokens',
      hint: 'Redirige du texte vers claude avec le flag --print-tokens',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu comprends la tokenisation !',
    },

    // === EMBEDDINGS ===
    {
      type: 'multiple-choice',
      question: 'Que sont les embeddings et comment fonctionnent-ils?',
      options: [
        'Les embeddings sont des images que l\'IA crée à partir du texte',
        'Les embeddings sont des listes de nombres représentant le sens — les mots similaires obtiennent des nombres similaires',
        'Les embeddings sont les mots de passe que l\'IA utilise pour accéder aux bases de données',
        'Les embeddings sont le code HTML qui fait afficher du texte aux sites web',
      ],
      correctIndex: 1,
      explanation: 'Une fois le texte tokenisé, chaque token est converti en un embedding — une longue liste de nombres (un vecteur) qui représente son sens. Pense à ça comme des coordonnées GPS dans un espace de sens. Les mots avec des significations similaires se retrouvent proches : "dog" est proche de "puppy" mais loin de "algebra". C\'est comme ça que le modèle comprend que les synonymes sont reliés.',
    },
    {
      type: 'multiple-choice',
      question: 'Dans l\'espace des embeddings, quelle paire de mots serait la plus proche ?',
      options: [
        '"cat" et "calendar"',
        '"run" et "sprint"',
        '"blue" et "recursion"',
        '"Python" et "Tuesday"',
      ],
      correctIndex: 1,
      explanation: '"Run" et "sprint" partagent un sens similaire, donc leurs vecteurs d\'embedding pointent presque dans la même direction. Les embeddings capturent la similarité sémantique, pas l\'orthographe ou la longueur.',
    },

    // === DIAGRAM 1: THE PIPELINE ===
    {
      type: 'interactive-diagram',
      title: 'Du prompt à la réponse',
      body: 'Clique sur chaque étape pour voir comment ton message se transforme en réponse.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'prompt', label: 'Prompt', shape: 'pill' },
          { id: 'tokenize', label: 'Tokeniser', sublabel: 'Texte → IDs' },
          { id: 'embed', label: 'Encoder', sublabel: 'IDs → vecteurs' },
          { id: 'attend', label: 'Attention', sublabel: 'Pondérer le contexte', shape: 'rounded', highlight: true },
          { id: 'generate', label: 'Générer', sublabel: 'Prédire le suivant' },
          { id: 'response', label: 'Réponse', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'prompt', to: 'tokenize' },
          { from: 'tokenize', to: 'embed' },
          { from: 'embed', to: 'attend' },
          { from: 'attend', to: 'generate' },
          { from: 'generate', to: 'response' },
        ],
      },
      stages: [
        {
          highlightNodes: ['prompt'],
          highlightEdges: [],
          explanation: 'Tout commence par ton texte. Les caractères bruts que tu tapes — « Explique la récursion en Python » — entrent dans le pipeline sous forme de chaîne de caractères.',
        },
        {
          highlightNodes: ['prompt', 'tokenize'],
          highlightEdges: [{ from: 'prompt', to: 'tokenize' }],
          explanation: 'Le tokenizer découpe ton texte en fragments de sous-mots. « Explain » → un token. « recursion » → « recur » + « sion ». Chaque token reçoit un identifiant numérique.',
        },
        {
          highlightNodes: ['tokenize', 'embed'],
          highlightEdges: [{ from: 'tokenize', to: 'embed' }],
          explanation: 'Chaque identifiant de token est mappé à un vecteur de haute dimension (embedding) qui capture son sens. Les mots similaires atterrissent proches les uns des autres dans cet espace.',
        },
        {
          highlightNodes: ['embed', 'attend'],
          highlightEdges: [{ from: 'embed', to: 'attend' }],
          explanation: 'L\'attention compare chaque token à tous les autres, calculant des scores de pertinence. C\'est ici que le modèle comprend que « il » réfère à « récursion », pas à « Python ».',
        },
        {
          highlightNodes: ['attend', 'generate'],
          highlightEdges: [{ from: 'attend', to: 'generate' }],
          explanation: 'Le modèle prédit le token suivant le plus probable en fonction du contexte pondéré par l\'attention. Il choisit un token, l\'ajoute, et recommence.',
        },
        {
          highlightNodes: ['generate', 'response'],
          highlightEdges: [{ from: 'generate', to: 'response' }],
          explanation: 'Token par token, la réponse complète est assemblée. La génération s\'arrête quand le modèle produit un token spécial de fin de séquence.',
        },
      ],
    },

    // === ATTENTION ===
    {
      type: 'multiple-choice',
      question: 'Dans la phrase "Le chat s\'est assis sur le tapis parce qu\'il était fatigué", que permet le mécanisme d\'attention de comprendre?',
      options: [
        'Que la phrase est en français',
        'Que "il" réfère à "chat", pas à "tapis"',
        'Combien de mots il y a dans la phrase',
        'L\'orthographe correcte de chaque mot',
      ],
      correctIndex: 1,
      explanation: 'L\'attention est le mécanisme qui permet au modèle de décider quelles parties de l\'entrée comptent le plus pour générer chaque mot de la sortie. Il compare chaque mot à tous les autres et donne plus d\'importance aux paires les plus pertinentes. Dans ce cas, il comprend que "il" réfère à "chat" grâce aux indices contextuels comme "fatigué".',
    },
    {
      type: 'compare',
      title: 'L\'attention en pratique',
      body: 'L\'attention explique pourquoi la structure du prompt est importante. Le modèle pèse chaque token par rapport à tous les autres. Placer l\'instruction la plus importante à la fin donne souvent de meilleurs résultats.',
      question: 'Quelle structure de prompt produira une sortie plus fiable ?',
      correctSide: 'right',
      left: {
        label: 'Plus faible',
        content: '"Write a function that sorts a list. Make it Python. Use type hints. Return only code."',
        language: 'text',
      },
      right: {
        label: 'Plus forte',
        content: '"Write a Python function with type hints that sorts a list. Return only code."',
        language: 'text',
      },
      explanation: 'La version plus forte place la contrainte la plus importante (« Return only code ») à la fin, là où la génération commence. Le modèle pondère plus fortement les tokens récents, donc la dernière instruction a le plus de poids.',
    },
    {
      type: 'order',
      instruction: 'Ordonne ces sections du prompt de la MOINS à la PLUS pondérée par le modèle (pour la sortie finale) :',
      items: [
        'Prompt système (début)',
        'Milieu d\'une longue conversation',
        'Le message utilisateur le plus récent',
        'Les derniers tokens avant la génération',
      ],
      correctOrder: [0, 1, 2, 3],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Mécanisme d\'attention compris !',
    },

    // === TEMPERATURE ===
    {
      type: 'match',
      instruction: 'Associe chaque réglage de température à son meilleur cas d\'utilisation :',
      leftItems: ['Température 0', 'Température 0.3', 'Température 0.7', 'Température 1.0+'],
      rightItems: ['Refactoring de code et extraction de données', 'Courriels d\'affaires et docs techniques', 'Écriture créative et brainstorming', 'Génération de texte expérimentale et artistique'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'La température contrôle le niveau de créativité vs fiabilité. À 0, le modèle choisit toujours le token le plus probable — parfait pour le code. À 0.3, principalement fiable avec une légère variation — idéal pour l\'écriture d\'affaires. À 0.7, créativité équilibrée. À 1.0+, variété maximale — bon pour le brainstorming mais risqué pour la production.',
    },
    {
      type: 'multiple-choice',
      question: 'Tu utilises un agent IA pour refactoriser du code en production. Quelle température devrais-tu utiliser ?',
      options: [
        '0 — complètement déterministe',
        '0.2 — principalement déterministe avec une légère variation',
        '0.7 — créativité équilibrée',
        '1.5 — créativité maximale',
      ],
      correctIndex: 0,
      explanation: 'Pour le refactoring de code, tu veux la sortie la plus prévisible et fiable. La température 0 garantit que le modèle choisit toujours le token avec la plus haute probabilité (le plus susceptible d\'être correct). La créativité est un risque quand on modifie du code en production.',
    },

    // === HALLUCINATION ===
    {
      type: 'multiple-choice',
      question: 'Pourquoi l\'IA écrit-elle parfois des informations qui sonnent convaincantes mais qui sont fausses (hallucination)?',
      options: [
        'Parce que l\'IA ment intentionnellement',
        'Parce qu\'elle prédit toujours le token le plus probable — elle n\'a aucun concept de vérité, seulement de probabilité',
        'Parce que la connexion internet est lente',
        'Parce que l\'IA manque de mémoire',
      ],
      correctIndex: 1,
      explanation: 'L\'hallucination se produit quand un modèle génère du texte qui sonne vrai mais qui est factuellement faux. Ça arrive parce que le modèle prédit toujours le token le plus probable — il n\'a aucun concept de vérité. Trois déclencheurs : (1) le sujet est hors des données d\'entraînement, (2) le prompt est ambigu, (3) des questions orientées qui biaisent le modèle.',
    },
    {
      type: 'interactive-diagram',
      title: 'Quand les modèles hallucinent',
      body: 'La fiabilité du modèle dépend de si l\'entrée tombe dans sa distribution d\'entraînement. Parcourez les étapes pour voir l\'arbre de décision.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'input', label: 'Entrée', sublabel: 'Ton prompt', shape: 'rounded', highlight: true },
          { id: 'trained', label: 'Données\nd\'entraînement ?', shape: 'diamond' },
          { id: 'ambiguous', label: 'Ambigu ?', shape: 'diamond' },
          { id: 'reliable', label: 'Fiable', sublabel: 'Haute confiance', shape: 'pill', highlight: true },
          { id: 'risky', label: 'Risqué', sublabel: 'Peut halluciner', shape: 'pill' },
          { id: 'hallucinate', label: 'Hallucination', sublabel: 'Probablement faux', shape: 'pill' },
        ],
        edges: [
          { from: 'input', to: 'trained' },
          { from: 'trained', to: 'ambiguous', label: 'Oui' },
          { from: 'trained', to: 'hallucinate', label: 'Non' },
          { from: 'ambiguous', to: 'reliable', label: 'Non' },
          { from: 'ambiguous', to: 'risky', label: 'Oui', dashed: true },
        ],
      },
      stages: [
        { highlightNodes: ['input'], explanation: 'Tout commence par ton prompt. La question est : le modèle a-t-il des données d\'entraînement fiables sur ce sujet?' },
        { highlightNodes: ['input', 'trained'], highlightEdges: [{ from: 'input', to: 'trained' }], explanation: 'Première vérification : le modèle a-t-il été entraîné sur ce sujet? Sinon, il n\'a rien de fiable à utiliser et va probablement halluciner.' },
        { highlightNodes: ['trained', 'hallucinate'], highlightEdges: [{ from: 'trained', to: 'hallucinate' }], explanation: 'Pas de données d\'entraînement = territoire d\'hallucination. Le modèle va générer du texte plausible basé sur des patterns, pas des faits. Exemple : demander des événements après sa date de coupure.' },
        { highlightNodes: ['trained', 'ambiguous'], highlightEdges: [{ from: 'trained', to: 'ambiguous' }], explanation: 'Si des données d\'entraînement existent, prochaine vérification : ton prompt est-il clair ou ambigu? Des instructions vagues laissent de la place au modèle pour combler les trous incorrectement.' },
        { highlightNodes: ['ambiguous', 'reliable'], highlightEdges: [{ from: 'ambiguous', to: 'reliable' }], explanation: 'Prompt clair + bonnes données d\'entraînement = sortie fiable. C\'est le point idéal. Sois spécifique, fournis du contexte, et reste sur des sujets bien connus.' },
        { highlightNodes: ['ambiguous', 'risky'], highlightEdges: [{ from: 'ambiguous', to: 'risky' }], explanation: 'Prompt ambigu + données d\'entraînement = risqué. Le modèle connaît le sujet mais tes instructions vagues le laissent combler des détails qui peuvent être faux. Solution : rends ton prompt plus spécifique.' },
      ],
    },
    {
      type: 'compare',
      title: 'Détecter le risque d\'hallucination',
      body: 'Apprends à reconnaître les prompts susceptibles de produire des hallucinations vs ceux qui gardent le modèle ancré.',
      question: 'Quel prompt est plus sûr et moins susceptible de causer une hallucination?',
      correctSide: 'right',
      left: {
        label: 'Haut risque (non ancré)',
        content: '"What did the CEO of Acme Corp say in their Q3 2025 earnings call?"\n\nLe modèle peut inventer des citations qu\'il n\'a jamais vues\nAucun matériel de référence fourni\nDemande des faits spécifiques de mémoire',
        language: 'text',
      },
      right: {
        label: 'Risque plus bas (ancré)',
        content: '"Based on the following transcript [paste text], summarize what the CEO said about revenue."\n\nLe modèle travaille à partir du contexte fourni, pas de la mémoire\nLe matériel de référence ancre la réponse\nTâche claire et spécifique avec des contraintes',
        language: 'text',
      },
      explanation: 'La solution aux hallucinations est généralement d\'ajouter des contraintes, de fournir du matériel de référence, ou de demander au modèle de dire "je ne sais pas" quand il n\'est pas sûr. Les prompts ancrés donnent au modèle des données réelles avec lesquelles travailler.',
    },
    {
      type: 'multiple-choice',
      question: 'Quel prompt est le PLUS susceptible de causer une hallucination ?',
      options: [
        '"Résume ce document : [texte complet collé]"',
        '"Combien font 2 + 2 ?"',
        '"Liste tous les CVE publiés pour libfoo en mars 2026"',
        '"Traduis \'hello\' en français"',
      ],
      correctIndex: 2,
      explanation: 'Demander des CVE spécifiques à une date qui peut être au-delà des données d\'entraînement du modèle est un déclencheur classique d\'hallucination. Le modèle va probablement inventer des numéros de CVE qui ont l\'air plausibles plutôt que d\'admettre qu\'il ne sait pas.',
    },

    // === PRACTICAL APPLICATION ===
    {
      type: 'code-input',
      instruction: 'Tu écris un prompt et tu veux que le modèle reconnaisse son incertitude au lieu de deviner. Complète cette instruction système :',
      placeholder: 'If you are not sure, say "______"',
      answer: 'I don\'t know',
      hint: 'Dis au modèle quoi répondre quand il manque de confiance',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu peux prédire quand les modèles échouent !',
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'order',
      instruction: 'Mets le pipeline de traitement de l\'IA dans le bon ordre, de ton entrée à la réponse finale :',
      items: [
        'Ton texte entre sous forme de caractères bruts',
        'Le tokenizer découpe le texte en fragments de sous-mots',
        'Chaque token est converti en un vecteur d\'embedding',
        'L\'attention pèse chaque token par rapport à tous les autres',
        'Le modèle prédit le token suivant le plus probable',
        'La réponse est assemblée token par token',
      ],
      correctOrder: [0, 1, 2, 3, 4, 5],
    },
    {
      type: 'terminal',
      instruction: 'Teste ta compréhension. Demande à Claude d\'expliquer ce qui arrive à ton prompt en interne :',
      expectedCommand: 'claude "Explain step by step what happens to my prompt before you generate a response"',
      hint: 'Utilise le CLI claude pour poser une question sur son propre pipeline de traitement',
    },
    {
      type: 'checkpoint',
      xp: 6,
      message: 'Leçon terminée ! Tu comprends maintenant ce qui se passe entre le prompt et la réponse.',
    },
  ],
}

export default content
