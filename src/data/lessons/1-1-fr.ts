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
      type: 'info',
      title: 'Les tokens : les atomes de l\'IA',
      body: "Les modèles ne lisent pas des mots — ils lisent des tokens. Un token est un morceau de texte, généralement un fragment de mot, pas un mot complet. Le mot \"tokenization\" devient deux tokens : \"token\" et \"ization\". Les mots courants comme \"the\" sont des tokens uniques. Les mots rares sont découpés en plus de morceaux. Les espaces et la ponctuation sont aussi des tokens.",
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
      type: 'code-demo',
      title: 'Le nombre de tokens affecte le coût et les limites',
      body: "Chaque appel API est facturé au token — en entrée et en sortie. Les modèles ont aussi une fenêtre de contexte mesurée en tokens (ex. : 200K tokens pour Claude). Une règle approximative : 1 token fait environ 4 caractères en anglais, soit à peu près 3/4 d'un mot.",
      language: 'text',
      code: 'Prompt: "Explain recursion in Python"  →  ~5 tokens\nPrompt: "Explain recursion in Python with 3 examples, edge cases, and performance analysis"  →  ~16 tokens\n\nMore tokens in = higher cost + less room for the response',
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
      type: 'info',
      title: 'Les embeddings : le sens comme coordonnées',
      body: "Une fois le texte tokenisé, chaque token est converti en un embedding — une longue liste de nombres (un vecteur) qui représente son sens. Pense à ça comme des coordonnées GPS dans un « espace de sens ». Les mots avec des significations similaires se retrouvent proches l'un de l'autre : \"dog\" est proche de \"puppy\" mais loin de \"algebra\". C'est comme ça que le modèle comprend que les synonymes sont reliés, sans que personne ne l'ait programmé explicitement.",
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
      type: 'diagram',
      title: 'Du prompt à la réponse',
      body: 'Voici le pipeline complet qui s\'exécute chaque fois que tu envoies un message. Chaque étape transforme les données dans la forme dont l\'étape suivante a besoin.',
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
    },

    // === ATTENTION ===
    {
      type: 'info',
      title: 'L\'attention : le projecteur du modèle',
      body: "L'attention est le mécanisme qui permet au modèle de décider quelles parties de l'entrée comptent le plus pour générer chaque mot de la sortie. Quand tu écris « Le chat s'est assis sur le tapis parce qu'il était fatigué », le modèle utilise l'attention pour comprendre que « il » réfère à « chat », pas à « tapis ». Il fait ça en calculant un score de pertinence entre chaque paire de tokens. Les paires avec des scores élevés s'influencent mutuellement davantage.",
    },
    {
      type: 'code-demo',
      title: 'L\'attention en pratique',
      body: "L'attention explique pourquoi la structure du prompt est importante. Le modèle pèse chaque token par rapport à tous les autres. Placer l'instruction la plus importante à la fin (plus près du début de la génération) donne souvent de meilleurs résultats.",
      language: 'text',
      code: '# Weaker — key instruction buried in the middle:\n"Write a function that sorts a list. Make it Python. Use type hints. Return only code."\n\n# Stronger — key instruction at the end:\n"Write a Python function with type hints that sorts a list. Return only code."',
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
      type: 'info',
      title: 'Température : contrôler le hasard',
      body: "Après l'attention, le modèle produit une distribution de probabilités sur tous les tokens possibles. La température contrôle comment cette distribution est échantillonnée. À température 0, le modèle choisit toujours le token le plus probable (déterministe). À température 1, il échantillonne proportionnellement (créatif). Au-dessus de 1, les sorties deviennent de plus en plus aléatoires et chaotiques. Pour les tâches d'agent, une température basse (0-0.3) est presque toujours mieux — tu veux de la fiabilité, pas de la créativité.",
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
      type: 'info',
      title: 'Quand les modèles hallucinent',
      body: "L'hallucination se produit quand un modèle génère du texte qui sonne vrai mais qui est factuellement faux. Ça arrive parce que le modèle prédit toujours le token le plus probable — il n'a aucun concept de vérité, seulement de probabilité. Trois déclencheurs courants : (1) le sujet est en dehors des données d'entraînement, (2) le prompt est ambigu, laissant le modèle combler les trous avec des détails plausibles mais faux, (3) des questions orientées qui biaisent le modèle vers une réponse spécifique (incorrecte).",
    },
    {
      type: 'diagram',
      title: 'Quand les modèles hallucinent',
      body: 'La fiabilité du modèle dépend de si l\'entrée tombe dans sa distribution d\'entraînement. Les prompts ambigus augmentent le risque même pour les sujets connus.',
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
    },
    {
      type: 'code-demo',
      title: 'Détecter le risque d\'hallucination',
      body: "Apprends à reconnaître les prompts susceptibles de produire des hallucinations. La solution est généralement d'ajouter des contraintes, de fournir du matériel de référence, ou de demander au modèle de dire « je ne sais pas » quand il n'est pas sûr.",
      language: 'text',
      code: '# High hallucination risk:\n"What did the CEO of Acme Corp say in their Q3 2025 earnings call?"\n→ Model may invent quotes it has never seen\n\n# Lower risk — grounded prompt:\n"Based on the following transcript [paste text], summarize what the CEO said about revenue."\n→ Model works from provided context, not memory',
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
      type: 'checklist',
      title: 'Modèles mentaux clés à retenir',
      items: [
        'Les tokens sont des morceaux de mots, pas des mots — "tokenization" fait 2 tokens',
        'Les embeddings placent le sens dans un espace géométrique — les concepts similaires se regroupent',
        'L\'attention pèse chaque token par rapport à tous les autres — la position et la structure comptent',
        'Température 0 pour la fiabilité, plus haut pour la créativité',
        'Les hallucinations viennent de lacunes dans les données d\'entraînement, de prompts ambigus ou de questions orientées',
        'Ancre tes prompts avec du contexte pour réduire le risque d\'hallucination',
      ],
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
