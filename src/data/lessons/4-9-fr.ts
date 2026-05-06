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
      type: 'diagram',
      title: 'Le filtre du goût',
      body: 'Les agents produisent du contenu fonctionnel. Ton filtre du goût l\'élève vers l\'excellence.',
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
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Le goût comme filtre — compris!',
    },

    // === DIMENSIONS OF TASTE ===
    {
      type: 'info',
      title: 'Dimension 1 : La simplicité',
      body: "Un agent à qui on demande de construire un système de notifications va souvent produire une solution complète : plusieurs canaux de notification, une file d'attente, une logique de réessai, des gabarits, des préférences utilisateur, un suivi de livraison. Le tout fonctionnel. Mais si ton app a 200 utilisateurs et a besoin de notifications par courriel pour les réinitialisations de mot de passe — cette solution est un passif, pas un actif. Le goût dit : une seule fonction qui appelle SendGrid, c'est correct. L'agent a produit ce qui était demandé. Le goût décide ce qui AURAIT DÛ être demandé.",
    },
    {
      type: 'info',
      title: 'Dimension 2 : La cohérence',
      body: "Ta codebase utilise des patrons fonctionnels : fonctions pures, composition, données immuables. L'agent écrit une classe avec un état mutable. Ça fonctionne. Les tests passent. Mais ça viole la voix du système. Dans six mois, quelqu'un lit cette classe et assume que les classes sont acceptables ici — maintenant t'as deux patrons. Le goût impose la cohérence non pas parce qu'un style est meilleur, mais parce que des styles mélangés créent de la surcharge cognitive pour chaque futur lecteur (humain ou agent).",
    },
    {
      type: 'info',
      title: 'Dimension 3 : La proportionnalité',
      body: "Est-ce que cette solution est proportionnelle au problème ? Une abstraction de 500 lignes pour éviter de répéter 3 lignes de code, c'est disproportionné. Une machine à états faite à la main pour un toggle à deux états, c'est disproportionné. Le goût calibre l'investissement en complexité par rapport à la gravité du problème. Les agents ne peuvent pas faire ça parce qu'ils ne ressentent pas le coût continu de maintenir du code complexe — ils ne voient que le problème immédiat à résoudre.",
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
      type: 'info',
      title: 'L\'élégance n\'est pas la ruse',
      body: "Les agents adorent les solutions ingénieuses. Des one-liners qui enchaînent 6 méthodes de tableau. De la gymnastique de types qui infère tout. Des gabarits récursifs qui se génèrent eux-mêmes. Ce sont des exploits impressionnants de programmation — et du terrible code de production. L'élégance est l'OPPOSÉ de la ruse. L'élégance, c'est quand la solution est tellement simple qu'elle semble évidente en rétrospective. Quand tu lis du code élégant, tu penses « bien sûr ». Quand tu lis du code rusé, tu penses « quoi ? ».",
    },
    {
      type: 'code-demo',
      title: 'Rusé vs Élégant',
      body: 'La version rusée est impressionnante. La version élégante est maintenable. Le goût choisit toujours cette dernière.',
      language: 'typescript',
      filename: 'comparison.ts',
      code: "// CLEVER: Agent-generated one-liner\nconst grouped = items.reduce((acc, item) => \n  ({ ...acc, [item.category]: [...(acc[item.category] ?? []), item] }), \n  {} as Record<string, Item[]>\n)\n\n// ELEGANT: Human-curated clarity\nconst grouped: Record<string, Item[]> = {}\nfor (const item of items) {\n  if (!grouped[item.category]) {\n    grouped[item.category] = []\n  }\n  grouped[item.category].push(item)\n}",
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
      type: 'info',
      title: 'Développer ton esthétique',
      body: "Le goût n'est pas inné — il se développe par l'exposition et la pratique. Lis d'excellentes codebases (la bibliothèque standard de Go, le code source de SQLite, les entrailles de Redis). Remarque ce qui les rend satisfaisantes : la clarté, la cohérence, la proportion. Puis applique ce standard à la sortie des agents. Au fil du temps, tu développes un sens interne de « c'est juste » qui se déclenche avant que tu puisses articuler pourquoi. Ce sens est ton avantage compétitif — c'est de la reconnaissance de patrons entraînée sur des milliers d'exemples évalués.",
    },
    {
      type: 'info',
      title: 'Le rôle de curateur',
      body: "Dans un monde assisté par agents, ton rôle passe de producteur à curateur. Un curateur de musée ne peint pas — il décide ce qui va sur le mur et ce qui va en réserve. Il crée de la cohérence à partir d'une collection d'oeuvres individuelles. Tu fais la même chose : les agents produisent. Tu sélectionnes, arranges et affines. Le système final reflète ton goût, pas celui de l'agent. C'est pas de la paresse — la curation au niveau du système demande plus de jugement que d'écrire n'importe quel composant individuel.",
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
      type: 'info',
      title: 'Le goût, c\'est savoir quoi couper',
      body: "Un agent ne dira jamais « ne construis pas cette fonctionnalité ». Il ne suggérera jamais de supprimer un composant. Il optimise pour la complétude — plus c'est mieux dans sa distribution d'entraînement. Mais les meilleurs produits se définissent par ce qu'ils EXCLUENT. Le goût, c'est le courage de couper : cette fonctionnalité est techniquement possible et quelqu'un l'a demandée et l'agent l'a construite parfaitement — et elle ne devrait quand même pas exister parce qu'elle complexifie le produit sans valeur proportionnelle.",
    },
    {
      type: 'info',
      title: 'Le test de la fonctionnalité',
      body: "Avant de livrer toute fonctionnalité construite par un agent, applique le test de la fonctionnalité. Un : si cette fonctionnalité disparaissait demain, est-ce que les utilisateurs le remarqueraient dans la semaine ? Deux : est-ce que cette fonctionnalité améliore l'expérience principale ou dilue-t-elle l'attention ? Trois : est-ce que cette fonctionnalité nécessite une maintenance continue disproportionnée par rapport à son utilisation ? Si les réponses sont non, dilue et oui — coupe. L'agent l'a bien construite. Toi, tu la coupes judicieusement. La production, c'est ce que le goût laisse passer, pas ce que la capacité peut produire.",
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
      type: 'info',
      title: 'Construire une grille d\'évaluation du goût',
      body: "Rends ton goût explicite. Avant de réviser la sortie d'un agent, écris tes critères d'évaluation : Est-ce proportionnel ? Est-ce cohérent avec le système existant ? Est-ce assez simple pour que la prochaine personne (ou le prochain agent) puisse le comprendre en 30 secondes ? Est-ce que ça résout un problème qui vaut la peine d'être résolu ? Quand t'as une grille, tu ne te fies pas à ton humeur — tu appliques un jugement cohérent. Au fil du temps, cette grille évolue à mesure que ton goût s'affine.",
    },
    {
      type: 'code-demo',
      title: 'Grille d\'évaluation du goût pour la revue de sortie d\'agents',
      body: 'Applique cette grille à chaque morceau significatif de code généré par un agent avant de fusionner. Pas tous les éléments s\'appliquent à chaque changement — mais parcourir la liste attrape la majorité des échecs de goût.',
      language: 'markdown',
      filename: 'REVIEW_RUBRIC.md',
      code: "# Agent Output Review Rubric\n\n## Proportionality (most common taste failure)\n- [ ] Is the solution proportional to the problem?\n- [ ] Could this be done in significantly fewer lines without losing clarity?\n- [ ] Does this abstraction earn its complexity?\n\n## Coherence\n- [ ] Does this match the existing patterns in the codebase?\n- [ ] If it introduces a new pattern, is the old pattern deprecated?\n- [ ] Would a future reader understand the style without context?\n\n## Simplicity\n- [ ] Can I explain this to a colleague in one sentence?\n- [ ] Are there any clever tricks that should be rewritten plainly?\n- [ ] Does it use the simplest tool that solves the problem?\n\n## Necessity\n- [ ] Does this solve a problem that actually exists (not a hypothetical)?\n- [ ] If I deleted this, would anything break within 30 days?\n- [ ] Is the ongoing maintenance cost justified by the usage?",
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
      type: 'info',
      title: 'Pourquoi c\'est l\'avantage défensif',
      body: "La génération de code deviendra banalisée. Les tests seront automatisés. Le déploiement sera autonome. Ce qui ne peut pas être automatisé, c'est le jugement sur quoi construire, à quel point le simplifier, et quand dire non. Ce jugement — le goût — se forge au fil d'années à construire, livrer, maintenir, et voir les conséquences des décisions. Ça ne peut pas être distillé dans un prompt. Ça ne peut pas être enseigné à un modèle. C'est expérientiel, contextuel, et profondément humain. Investis-y sans relâche.",
    },
    {
      type: 'info',
      title: 'Le praticien qui a du goût',
      body: "Il révise la sortie d'un agent et voit immédiatement : cette abstraction ne survivra pas à la prochaine demande de fonctionnalité. Il regarde une architecture proposée et sent : ça va devenir un fardeau de maintenance dans 6 mois. Il évalue une fonctionnalité et sait : ça dilue le produit sans ajouter de valeur proportionnelle. Il ne peut pas toujours articuler POURQUOI en temps réel — le jugement se déclenche plus vite que l'explication. Mais il a raison assez souvent pour que son équipe fasse confiance à son instinct. C'est vers ça que tu te diriges.",
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
