import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Ton goût et ton jugement : la compétence que l\'IA ne peut pas remplacer',
      body: "L'IA peut écrire du code, générer des tests, construire des structures de projet, déployer des systèmes et corriger des bogues. Elle ne fera que s'améliorer dans tout ça. Ce qu'elle ne peut pas faire — et ne pourra peut-être jamais faire — c'est décider ce qui DEVRAIT exister. Si une fonctionnalité vaut la peine d'être construite. Si un design est élégant ou juste compliqué. Si une interface sert vraiment l'utilisateur. Le goût, c'est le jugement humain qui sépare quelque chose qui fonctionne de quelque chose qui est réellement bon. C'est ta compétence la plus précieuse et la plus irremplaçable.",
    },
    {
      type: 'info',
      title: 'Ce que le goût signifie en ingénierie',
      body: "Le goût, c'est pas une préférence esthétique subjective. En ingénierie, le goût c'est la capacité d'évaluer au-delà de la correction. Du code peut fonctionner parfaitement et être quand même mauvais — sur-abstrait, optimisé prématurément, incohérent avec la voix du système, ou résolvant un problème qui ne devrait pas exister. Le goût, c'est savoir : ça fonctionne, mais est-ce que c'est JUSTE ? Est-ce simple là où ça devrait l'être ? Est-ce robuste là où ça compte ? Est-ce que ça s'intègre aux patrons existants du système ou lutte contre eux ? Ces questions ont des réponses — mais elles demandent du jugement, pas du calcul.",
    },

    // === THE TASTE FILTER ===
    {
      type: 'interactive-diagram',
      title: 'Le filtre du goût',
      body: 'Clique pour voir comment ton filtre du goût transforme le contenu fonctionnel en contenu excellent.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'agent', label: 'Sortie de l\'agent', sublabel: 'Fonctionnel, correct', shape: 'rect' },
          { id: 'taste', label: 'Ton filtre du goût', sublabel: 'Jugement + expérience', shape: 'diamond', highlight: true },
          { id: 'excellent', label: 'Sortie excellente', sublabel: 'Élégant, cohérent, juste', shape: 'rounded', highlight: true },
          { id: 'iterate', label: 'Itérer', sublabel: 'Affiner la spec, régénérer', shape: 'pill' },
        ],
        edges: [
          { from: 'agent', to: 'taste' },
          { from: 'taste', to: 'excellent', label: 'passe' },
          { from: 'taste', to: 'iterate', label: 'pas encore', dashed: true },
          { from: 'iterate', to: 'agent', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['agent'],
          highlightEdges: [],
          explanation: 'L\'agent produit une sortie qui fonctionne. Ça compile, passe les tests et fait ce qui a été demandé. Mais la correction fonctionnelle est une barre basse — c\'est nécessaire mais pas suffisant.',
        },
        {
          highlightNodes: ['agent', 'taste'],
          highlightEdges: [{ from: 'agent', to: 'taste' }],
          explanation: 'Ton filtre du goût évalue au-delà de la correction. Est-ce simple ? Est-ce cohérent avec les patrons existants ? Est-ce proportionnel au problème ? Ces questions demandent du jugement, pas du calcul.',
        },
        {
          highlightNodes: ['taste', 'excellent'],
          highlightEdges: [{ from: 'taste', to: 'excellent' }],
          explanation: 'Quand la sortie passe ton filtre du goût, elle n\'est pas juste fonctionnelle — elle est élégante, cohérente avec le système, et juste pour le contexte. C\'est la barre de qualité qui sépare les bons produits des excellents.',
        },
        {
          highlightNodes: ['taste', 'iterate', 'agent'],
          highlightEdges: [{ from: 'taste', to: 'iterate' }, { from: 'iterate', to: 'agent' }],
          explanation: 'Quand la sortie ne passe pas, tu itères : affine la spec, ajoute des contraintes, et régénère. Chaque itération se rapproche de l\'excellence. Le filtre du goût n\'est pas une porte — c\'est une boucle de rétroaction.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Le goût comme filtre — compris!',
    },

    // === DIMENSIONS OF TASTE ===
    {
      type: 'multiple-choice',
      question: 'Un agent construit un système de notifications complet (file d\'attente, réessai, gabarits, préférences) pour une app de 200 utilisateurs qui n\'a besoin que de courriels de réinitialisation de mot de passe. Que dit le goût ?',
      options: [
        'Livre-le — les solutions complètes sont toujours meilleures',
        'La solution est un passif, pas un actif. Une seule fonction qui appelle SendGrid, c\'est correct. L\'agent a produit ce qui était demandé ; le goût décide ce qui AURAIT DÛ être demandé.',
        'Ajoute plus de fonctionnalités puisque la fondation est là',
        'Garde-le mais désactive les fonctionnalités inutilisées',
      ],
      correctIndex: 1,
      explanation: "Dimension 1 : La simplicité. Un agent à qui on demande de construire un système de notifications va souvent produire une solution complète. Mais si ton app a 200 utilisateurs et a besoin de courriels de réinitialisation — cette solution est un passif. Le goût dit : une seule fonction qui appelle SendGrid, c'est correct. Le goût décide ce qui AURAIT DÛ être demandé.",
    },
    {
      type: 'multiple-choice',
      question: 'Ta codebase utilise des patrons fonctionnels (fonctions pures, composition, données immuables). Un agent écrit une classe avec un état mutable qui fonctionne et passe les tests. Quel est le problème de goût ?',
      options: [
        'Les classes sont toujours pires que les fonctions',
        'L\'agent aurait dû utiliser des interfaces TypeScript',
        'Ça viole la voix du système — des styles mélangés créent de la surcharge cognitive pour chaque futur lecteur, et quelqu\'un assumera que les classes sont acceptables ici',
        'L\'état mutable est toujours un risque de bogue',
      ],
      correctIndex: 2,
      explanation: "Dimension 2 : La cohérence. Le goût impose la cohérence non pas parce qu'un style est meilleur, mais parce que des styles mélangés créent de la surcharge cognitive pour chaque futur lecteur. Dans six mois, quelqu'un lit cette classe et assume que les classes sont acceptables ici — maintenant t'as deux patrons en compétition.",
    },
    {
      type: 'multiple-choice',
      question: 'Un agent crée une abstraction de 500 lignes pour éviter de répéter 3 lignes de code. Quelle dimension du goût est violée ?',
      options: [
        'Simplicité — le code est trop complexe',
        'Cohérence — ça ne correspond pas aux patrons existants',
        'Proportionnalité — l\'investissement en complexité dépasse vastement la gravité du problème à résoudre',
        'Nécessité — le code n\'est pas nécessaire',
      ],
      correctIndex: 2,
      explanation: "Dimension 3 : La proportionnalité. Est-ce que cette solution est proportionnelle au problème ? Une abstraction de 500 lignes pour éviter de répéter 3 lignes de code, c'est disproportionné. Le goût calibre l'investissement en complexité par rapport à la gravité du problème. Les agents ne peuvent pas faire ça parce qu'ils ne ressentent pas le coût continu de maintenir du code complexe.",
    },
    {
      type: 'multiple-choice',
      question: 'Un agent crée une bibliothèque générique de validation de formulaires de 200 lignes pour valider 3 formulaires dans ton app. Chaque formulaire a 2 à 4 champs. Que te dit le goût ?',
      options: [
        'Approuve — les bibliothèques réutilisables sont toujours du bon génie logiciel',
        'Rejette — l\'abstraction est disproportionnée par rapport au problème; la validation en ligne par formulaire est plus simple et suffisante',
        'Approuve mais ajoute des tests — le code complexe a besoin de couverture',
        'Rejette parce que c\'était pas dans la spec',
      ],
      correctIndex: 1,
      explanation: 'Trois formulaires simples avec quelques champs chacun ne justifient pas une bibliothèque de validation générique. La bibliothèque résout un problème que tu n\'as pas (beaucoup de formulaires complexes). La validation en ligne est proportionnelle : facile à lire, facile à modifier, zéro surcharge d\'abstraction. L\'agent a optimisé pour la réutilisabilité. Le goût optimise pour la proportionnalité.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Dimensions du goût intégrées!',
    },

    // === ELEGANCE VS CLEVERNESS ===
    {
      type: 'multiple-choice',
      question: 'Un agent produit un one-liner enchaînant 6 méthodes de tableau avec de la gymnastique de types. C\'est impressionnant et correct. Est-ce du code élégant ?',
      options: [
        'Oui — moins de lignes signifie un meilleur code',
        'Non — l\'élégance est l\'OPPOSÉ de la ruse. Le code élégant semble évident en rétrospective. Quand tu le lis, tu penses « bien sûr ». Le code rusé te fait penser « quoi ? »',
        'Oui — si ça passe les tests, c\'est assez bon',
        'Ça dépend des caractéristiques de performance',
      ],
      correctIndex: 1,
      explanation: "Les agents adorent les solutions ingénieuses. Des one-liners qui enchaînent 6 méthodes de tableau. De la gymnastique de types qui infère tout. Ce sont des exploits impressionnants de programmation — et du terrible code de production. L'élégance est l'OPPOSÉ de la ruse. L'élégance, c'est quand la solution est tellement simple qu'elle semble évidente en rétrospective.",
    },
    {
      type: 'compare',
      title: 'Code rusé vs Code élégant',
      body: 'La version rusée est un one-liner dense avec des opérations enchaînées. La version élégante utilise des fonctions nommées lisibles avec un flux clair. Lequel préfères-tu déboguer à 2h du matin ?',
      left: {
        label: 'Rusé (Dense)',
        content: '// One-liner généré par l\'agent\nconst grouped = items\n  .reduce((acc, item) => ({\n    ...acc,\n    [item.category]: [\n      ...(acc[item.category] ?? []),\n      item\n    ]\n  }), {} as Record<string, Item[]>)\n\n// Nécessite de comprendre :\n// - reduce avec spread\n// - coalescence nulle\n// - assertions de types\n// - destructuration imbriquée\n// Le tout en UNE expression',
        language: 'typescript',
        filename: 'clever.ts',
      },
      right: {
        label: 'Élégant (Clair)',
        content: '// Clarté curatée par l\'humain\nconst grouped: Record<string, Item[]> = {}\n\nfor (const item of items) {\n  if (!grouped[item.category]) {\n    grouped[item.category] = []\n  }\n  grouped[item.category].push(item)\n}\n\n// N\'importe quel développeur peut :\n// - Le lire instantanément\n// - Mettre un point d\'arrêt sur n\'importe quelle ligne\n// - Comprendre le mode de défaillance\n// - Le modifier en confiance',
        language: 'typescript',
        filename: 'elegant.ts',
      },
      question: 'Quelle version livrerais-tu en production ?',
      correctSide: 'right',
      explanation: 'La version élégante est lisible par quiconque connaît la programmation de base. Elle est débogable avec un point d\'arrêt sur n\'importe quelle ligne. Elle échoue de façon évidente. La performance à l\'exécution est identique. La version rusée est impressionnante mais crée de la surcharge cognitive pour chaque futur lecteur.',
    },
    {
      type: 'code-diff',
      title: 'Refactoriser du rusé vers l\'élégant',
      body: 'Observe une implémentation rusée se transformer en version élégante avec des étapes nommées et un flux clair.',
      language: 'typescript',
      filename: 'refactor-to-elegant.ts',
      before: "// Rusé : chaîne dense difficile à déboguer\nconst result = data\n  .filter(x => x.status !== 'deleted')\n  .reduce((acc, x) => ({...acc, [x.id]: x}), {})",
      after: "// Élégant : étapes nommées avec intention claire\nfunction getActiveItems(data: Item[]): Item[] {\n  return data.filter(item => item.status !== 'deleted')\n}\n\nfunction indexById(items: Item[]): Record<string, Item> {\n  const index: Record<string, Item> = {}\n  for (const item of items) {\n    index[item.id] = item\n  }\n  return index\n}\n\nconst result = indexById(getActiveItems(data))",
      question: 'Qu\'est-ce qui rend la version refactorisée meilleure pour une codebase de production ?',
      explanation: 'Les fonctions nommées (getActiveItems, indexById) communiquent l\'intention. Chaque fonction fait une seule chose et peut être testée indépendamment. La composition se lit comme de la prose : « indexer par ID les éléments actifs des données ». La version d\'avant nécessite un décodage mental du reduce avec la syntaxe spread.',
    },
    {
      type: 'match',
      instruction: 'Associe chaque qualité de code à son indicateur :',
      leftItems: ['Élégant', 'Rusé', 'Sur-ingéniéré', 'Simple'],
      rightItems: [
        'Lisible par un nouveau membre de l\'équipe en 30 secondes',
        'Impressionnant mais demande de la gymnastique mentale',
        'Gère des cas limites qui n\'existent pas encore',
        'Fait une seule chose et la fait bien',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Le code élégant est immédiatement lisible. Le code rusé impressionne mais surcharge les lecteurs. Le code sur-ingéniéré résout des problèmes hypothétiques. Le code simple fait une seule chose bien. En production, l\'élégant et le simple gagnent — ils minimisent la surcharge cognitive pour chaque futur lecteur et agent.',
    },
    {
      type: 'prompt-lab',
      instruction: 'Écris un prompt demandant à un agent de refactoriser du code rusé en code élégant.',
      scenario: 'Un agent a produit un one-liner dense qui enchaîne filter, reduce et spread pour transformer un tableau en objet groupé. Ça fonctionne et passe les tests, mais personne dans l\'équipe ne peut le lire sans s\'arrêter 30 secondes. Tu dois demander à l\'agent de le refactoriser pour la lisibilité.',
      starterPrompt: 'C\'est correct.',
      responses: [
        {
          triggerKeywords: ['named', 'function', 'readable', 'readability', 'clear', 'step', 'nommé', 'fonction', 'lisible', 'lisibilité', 'clair', 'étape'],
          response: 'Je vais refactoriser le one-liner en fonctions nommées avec des étapes claires.\n\nPlan :\n1. Extraire le filter dans `getActiveItems()` avec un nom explicite\n2. Remplacer le reduce+spread par une simple boucle for-of dans `groupByCategory()`\n3. Composer les deux : `groupByCategory(getActiveItems(data))`\n4. Chaque fonction reçoit un commentaire JSDoc expliquant l\'intention\n5. Ajouter un test unitaire par fonction pour la vérification indépendante\n\nRefactorisation en cours...',
          quality: 'excellent',
          feedback: 'Excellent. Tu as demandé des fonctions nommées et de la lisibilité, et l\'agent a répondu avec un plan de décomposition clair. Chaque fonction a une seule responsabilité, est testable indépendamment, et la composition se lit comme de la prose.',
        },
        {
          triggerKeywords: ['refactor', 'simplify', 'clean', 'refactoriser', 'simplifier', 'nettoyer'],
          response: 'Je vais nettoyer le code. Devrais-je :\n- Garder le reduce ou passer à une boucle ?\n- Ajouter des commentaires pour expliquer le one-liner ?\n- Découper en plusieurs lignes ?\n\nDis-moi ta préférence.',
          quality: 'good',
          feedback: 'Tu as indiqué qu\'une refactorisation était nécessaire, mais l\'agent doit encore poser des questions de clarification. Spécifie ce que « élégant » signifie pour toi : fonctions nommées, étapes à responsabilité unique, lisible en 30 secondes par n\'importe quel membre de l\'équipe.',
        },
      ],
      fallbackResponse: {
        response: 'L\'implémentation actuelle semble correcte et tous les tests passent. Le one-liner est efficace et gère la logique de groupement en une seule expression. Je ne vois pas de problème à corriger.\n\nVoulez-vous que je passe à la tâche suivante ?',
        feedback: 'Accepter le one-liner dense signifie que chaque futur lecteur (humain ou agent) passera 30 secondes à le décoder. Un bon prompt spécifie : décompose ça en fonctions nommées, chacune faisant une seule chose, pour que n\'importe qui puisse le lire, le déboguer et le modifier instantanément. Le goût exige la lisibilité plutôt que la ruse.',
      },
    },
    {
      type: 'multiple-choice',
      question: 'Quelle qualité rend la version « élégante » meilleure pour une codebase de production ?',
      options: [
        'Elle est plus rapide à l\'exécution',
        'Elle utilise moins de fonctionnalités avancées de JavaScript, la rendant lisible par n\'importe quel membre de l\'équipe et débogable dans n\'importe quel contexte',
        'Elle a plus de lignes de code, ce qui signifie qu\'elle est plus complète',
        'La boucle for est plus traditionnelle',
      ],
      correctIndex: 1,
      explanation: 'La version élégante est lisible par quiconque connaît la programmation de base. Elle est débogable avec un point d\'arrêt sur n\'importe quelle ligne. Elle échoue de façon évidente. La version rusée nécessite de comprendre reduce, le spread, la coalescence nulle et les assertions de types — le tout en une seule expression. La performance à l\'exécution est identique. La lisibilité, non.',
    },

    // === YOUR AESTHETIC AS FILTER ===
    {
      type: 'compare',
      title: 'Mentalité de producteur vs Mentalité de curateur',
      body: 'Dans un monde assisté par agents, ton rôle change. Quelle mentalité produit de meilleurs systèmes ?',
      left: {
        label: 'Producteur (Tout écrire)',
        content: 'Tu écris chaque ligne de code toi-même.\n\nSortie par jour : 200-400 LOC\nQualité : varie avec ton énergie\nCohérence : TES patrons uniquement\nGoulot : TA vitesse de frappe\n\nLe système reflète ta capacité\nà produire sous pression.\n\nLimitation : tu es le plafond.',
        language: 'text',
        filename: 'producteur.txt',
      },
      right: {
        label: 'Curateur (Sélectionner + Affiner)',
        content: 'Les agents produisent. Tu évalues.\n\nSortie par jour : 2000-5000 LOC révisés\nQualité : constante (filtre du goût appliqué)\nCohérence : TES standards, appliqués\nGoulot : TA vitesse de jugement\n\nLe système reflète ton goût\nappliqué à une production énorme.\n\nAvantage : le jugement passe à l\'échelle, pas la frappe.',
        language: 'text',
        filename: 'curateur.txt',
      },
      question: 'Quel rôle produit de meilleurs systèmes à l\'échelle ?',
      correctSide: 'right',
      explanation: "Le goût n'est pas inné — il se développe par l'exposition et la pratique. Dans un monde assisté par agents, ton rôle passe de producteur à curateur. Un curateur de musée ne peint pas — il décide ce qui va sur le mur. Tu fais la même chose : les agents produisent, tu sélectionnes, arranges et affines. La curation au niveau du système demande plus de jugement que d'écrire n'importe quel composant individuel.",
    },
    {
      type: 'multiple-choice',
      question: 'Deux agents produisent des solutions fonctionnelles au même problème. La solution A fait 40 lignes avec des noms de variables clairs et un commentaire expliquant POURQUOI. La solution B fait 15 lignes utilisant des fonctionnalités avancées de TypeScript. Les deux passent tous les tests. Laquelle livres-tu ?',
      options: [
        'La solution B — moins de code c\'est toujours mieux',
        'La solution A — la clarté et la documentation d\'intention la rendent maintenable par les futurs agents et humains',
        'Aucune — écris une troisième solution toi-même',
        'Celle sur laquelle les agents s\'entendent comme étant la meilleure',
      ],
      correctIndex: 1,
      explanation: 'Moins de code n\'est pas le but. Du code clair est le but. La solution A communique l\'intention, est débogable, et peut être modifiée par tout futur agent ou humain sans connaissance approfondie de TypeScript. Le commentaire POURQUOI donne du contexte que le code seul ne peut pas fournir. C\'est une décision de goût : optimiser pour la santé à long terme du système plutôt que pour la ruse à court terme.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Mentalité de curation activée!',
    },

    // === WHAT TO CUT ===
    {
      type: 'multiple-choice',
      question: 'Un agent ne dira jamais « ne construis pas cette fonctionnalité ». Pourquoi savoir quoi couper est-il la compétence de goût la plus difficile ?',
      options: [
        'Parce que couper des fonctionnalités gaspille le travail de l\'agent',
        'Parce que les agents optimisent pour la complétude, mais les meilleurs produits se définissent par ce qu\'ils EXCLUENT. Le goût, c\'est le courage de couper quelque chose de bien construit qui ne devrait pas exister.',
        'Parce que les parties prenantes veulent toujours plus de fonctionnalités',
        'Parce que les agents ne peuvent pas construire de fonctionnalités qui devraient être coupées',
      ],
      correctIndex: 1,
      explanation: "Un agent ne dira jamais « ne construis pas cette fonctionnalité ». Il optimise pour la complétude — plus c'est mieux dans sa distribution d'entraînement. Mais les meilleurs produits se définissent par ce qu'ils EXCLUENT. Le goût, c'est le courage de couper : cette fonctionnalité est techniquement possible et l'agent l'a construite parfaitement — et elle ne devrait quand même pas exister.",
    },
    {
      type: 'multiple-choice',
      question: 'Avant de livrer une fonctionnalité construite par un agent, tu appliques le test de la fonctionnalité. Les réponses sont : les utilisateurs NE remarqueraient PAS si elle disparaissait, elle DILUE l\'expérience principale, et elle nécessite une maintenance DISPROPORTIONNÉE. Que fais-tu ?',
      options: [
        'Livre quand même — quelqu\'un l\'a demandée',
        'Coupe. L\'agent l\'a bien construite. Toi, tu la coupes judicieusement. La production, c\'est ce que le goût laisse passer, pas ce que la capacité peut produire.',
        'Simplifie-la et livre une version réduite',
        'Demande d\'abord aux utilisateurs s\'ils la veulent',
      ],
      correctIndex: 1,
      explanation: "Avant de livrer toute fonctionnalité construite par un agent, applique le test de la fonctionnalité. Un : les utilisateurs le remarqueraient-ils ? Deux : ça améliore ou ça dilue ? Trois : maintenance disproportionnée ? Si les réponses sont non, dilue et oui — coupe.",
    },
    {
      type: 'multiple-choice',
      question: 'Un agent construit un beau toggle de mode sombre avec trois thèmes (clair, sombre, système) et des transitions fluides. Ton app est un tableau de bord admin interne utilisé par 4 personnes durant les heures de bureau. Tu livres ?',
      options: [
        'Oui — c\'est bien construit et les utilisateurs pourraient l\'apprécier',
        'Non — ça ajoute de la surface de maintenance pour zéro valeur significative dans ce contexte',
        'Oui mais simplifie à juste deux thèmes',
        'Demande aux 4 utilisateurs s\'ils le veulent',
      ],
      correctIndex: 1,
      explanation: 'La fonctionnalité est bien construite mais disproportionnée. Quatre utilisateurs internes sur un outil aux heures de bureau n\'ont pas besoin de support de thèmes. Chaque thème crée une obligation de maintenance : chaque nouveau composant doit être testé dans tous les thèmes, chaque couleur doit avoir des variantes. L\'agent l\'a construite correctement. Le goût dit : le coût de maintenance dépasse la valeur. Coupe.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Savoir quoi couper — la décision de goût la plus difficile!',
    },

    // === TASTE IN PRACTICE ===
    {
      type: 'multiple-choice',
      question: 'Pourquoi devrais-tu écrire tes critères d\'évaluation AVANT de réviser la sortie d\'un agent, plutôt que de juger au feeling ?',
      options: [
        'Pour créer de la documentation pour l\'équipe',
        'Quand t\'as une grille, tu appliques un jugement cohérent au lieu de te fier à ton humeur. Au fil du temps, la grille évolue à mesure que ton goût s\'affine.',
        'Pour ralentir le processus de revue et être plus attentif',
        'Parce que les agents ont besoin de critères écrits pour s\'améliorer',
      ],
      correctIndex: 1,
      explanation: "Rends ton goût explicite. Avant de réviser la sortie d'un agent, écris tes critères d'évaluation : Est-ce proportionnel ? Est-ce cohérent avec le système existant ? Est-ce assez simple pour que la prochaine personne puisse le comprendre en 30 secondes ? Quand t'as une grille, tu ne te fies pas à ton humeur — tu appliques un jugement cohérent.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette grille d\'évaluation du goût pour réviser la sortie d\'agents. Remplis les questions d\'évaluation clés pour chaque dimension.',
      language: 'markdown',
      filename: 'REVIEW_RUBRIC.md',
      template: '# Agent Output Review Rubric\n\n## Proportionality (most common taste failure)\n- [ ] Is the solution {{proportional_q}}?\n- [ ] Does this abstraction {{complexity_q}}?\n\n## Coherence\n- [ ] Does this match {{pattern_q}}?\n- [ ] Would a future reader {{readability_q}}?\n\n## Necessity\n- [ ] Does this solve a problem that {{exists_q}}?\n- [ ] If I deleted this, would {{deletion_q}}?',
      blanks: [
        { id: 'proportional_q', answer: 'proportional to the problem', alternatives: ['proportional', 'proportionate to the problem'], placeholder: 'vérification de proportionnalité ?', hint: 'La solution correspond-elle à la taille du problème ?' },
        { id: 'complexity_q', answer: 'earn its complexity', alternatives: ['justify its complexity', 'warrant its complexity'], placeholder: 'vérification de complexité ?', hint: 'L\'abstraction vaut-elle la surcharge ?' },
        { id: 'pattern_q', answer: 'the existing patterns in the codebase', alternatives: ['existing patterns', 'current codebase patterns'], placeholder: 'vérification de correspondance ?', hint: 'Cohérence avec ce qui existe déjà' },
        { id: 'readability_q', answer: 'understand the style without context', alternatives: ['understand it without context', 'read it without extra context'], placeholder: 'vérification de lisibilité ?', hint: 'Quelqu\'un de nouveau peut-il comprendre immédiatement ?' },
        { id: 'exists_q', answer: 'actually exists', alternatives: ['actually exists (not a hypothetical)', 'is real'], placeholder: 'vérification de nécessité ?', hint: 'Problème réel ou hypothétique ?' },
        { id: 'deletion_q', answer: 'anything break within 30 days', alternatives: ['anything break', 'users notice'], placeholder: 'test de suppression ?', hint: 'Que se passe-t-il si ce code disparaît ?' },
      ],
      explanation: 'Applique cette grille à chaque morceau significatif de code généré par un agent avant de fusionner. Parcourir la liste attrape la majorité des échecs de goût. La grille rend ton jugement implicite explicite et cohérent.',
    },
    {
      type: 'order',
      instruction: 'Ordonne ces dimensions du goût de la PLUS impactante à la MOINS impactante sur la santé à long terme du système :',
      items: [
        'Élégance des fonctions individuelles',
        'Cohérence avec les patrons existants',
        'Proportionnalité de la solution au problème',
        'Ingéniosité de l\'implémentation',
        'Si la fonctionnalité devrait exister ou non',
      ],
      correctOrder: [4, 2, 1, 0, 3],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Grille d\'évaluation du goût établie!',
    },

    // === THE IRREPLACEABLE SKILL ===
    {
      type: 'multiple-choice',
      question: 'La génération de code, les tests et le déploiement seront tous automatisés. Qu\'est-ce qui NE PEUT PAS être automatisé ?',
      options: [
        'Écrire des algorithmes complexes',
        'Déboguer des problèmes en production',
        'Le jugement sur quoi construire, à quel point le simplifier, et quand dire non — le goût est expérientiel, contextuel et profondément humain',
        'Configurer des pipelines CI/CD',
      ],
      correctIndex: 2,
      explanation: "La génération de code deviendra banalisée. Les tests seront automatisés. Le déploiement sera autonome. Ce qui ne peut pas être automatisé, c'est le jugement sur quoi construire, à quel point le simplifier, et quand dire non. Ce jugement — le goût — se forge au fil d'années à construire, livrer, maintenir, et voir les conséquences des décisions. Investis-y sans relâche.",
    },
    {
      type: 'multiple-choice',
      question: 'Un praticien avec du goût révise la sortie d\'un agent et voit immédiatement « cette abstraction ne survivra pas à la prochaine demande de fonctionnalité ». Quelle compétence est-ce ?',
      options: [
        'Connaissance technique des patrons de conception',
        'Reconnaissance de patrons forgée par des années à construire, livrer et voir les conséquences — un jugement qui se déclenche plus vite que l\'explication',
        'Pessimisme sur les capacités des agents',
        'Expérience avec un langage de programmation spécifique',
      ],
      correctIndex: 1,
      explanation: "Le praticien avec du goût révise la sortie d'un agent et voit immédiatement des problèmes invisibles dans les tests ou les métriques. Il ne peut pas toujours articuler POURQUOI en temps réel — le jugement se déclenche plus vite que l'explication. Mais il a raison assez souvent pour que son équipe fasse confiance à son instinct. C'est vers ça que tu te diriges.",
    },
    {
      type: 'checklist',
      title: 'Checklist de développement du goût :',
      items: [
        'J\'évalue la sortie des agents au-delà de la correction fonctionnelle',
        'J\'applique la simplicité, la cohérence et la proportionnalité comme dimensions de qualité',
        'Je choisis l\'élégance plutôt que la ruse à chaque revue',
        'J\'ai le courage de couper des fonctionnalités qui marchent mais qui ne devraient pas exister',
        'Je maintiens une grille d\'évaluation et je l\'applique de façon cohérente',
        'Je comprends que le goût est mon avantage compétitif à long terme',
        'J\'étudie activement d\'excellentes codebases pour affiner mes standards internes',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Le goût est l\'avantage défensif. Tu construis la seule compétence qui ne peut pas être automatisée.',
    },
  ],
}

export default content
