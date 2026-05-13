import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-9',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Le résultat visuel requiert le goût humain',
      body: "Vous pouvez écrire une spec parfaite — chaque critère d'acceptation satisfait, chaque limite respectée — et quand même obtenir une interface qui ne passe pas. Le padding des cartes est étriqué, la hiérarchie est floue, le rythme d'espacement est décalé. C'est l'écart entre la conformité à la spec et le bon design. Les agents sont excellents pour implémenter la structure mais médiocres pour le jugement visuel. C'est votre travail : vous êtes le filtre de goût entre le résultat de l'agent et ce qui est livré aux utilisateurs.",
    },
    {
      type: 'info',
      title: 'Pourquoi c\'est important maintenant',
      body: "Dans les leçons précédentes, vous avez vérifié la fonctionnalité : est-ce que la fonctionnalité marche ? Est-ce qu'elle passe les tests ? Maintenant vous vérifiez l'esthétique : est-ce que ça a l'air bien ? Ce n'est pas de la vanité — c'est de l'utilisabilité. Un mauvais espacement embrouille la hiérarchie. Des tailles incohérentes cassent les patterns de lecture. Un mauvais contraste tue la lisibilité. Les utilisateurs ne séparent pas « ça marche » de « ça a l'air bien ». Ils vivent l'interface comme un tout. Votre jugement visuel est un avantage concurrentiel que les agents ne peuvent pas reproduire.",
    },

    // === WRITING VISUAL SPECS ===
    {
      type: 'compare',
      title: 'Écrire des specs visuelles qui contraignent sans micro-gérer',
      body: 'Les mêmes anti-patterns de la leçon 2-1 s\'appliquent aux specs visuelles. Trouvez le juste milieu.',
      question: 'Quelle approche donne assez de guidance à l\'agent pour produire un bon design ?',
      correctSide: 'right',
      left: {
        label: 'Trop vague / trop prescriptif',
        content: 'TROP VAGUE :\n« Fais-le paraître moderne. »\n« Utilise un bon espacement. »\n\nTROP PRESCRIPTIF :\n« Utilise p-4 gap-3 text-sm font-medium\nsur chaque carte. Le header doit faire\nexactement 64px avec un fond #1a1a1a. »',
        language: 'text',
      },
      right: {
        label: 'Contraintes de design system',
        content: 'SYSTÈME D\'ESPACEMENT :\n- Padding de section : py-12 à py-16\n- Padding de carte : p-4 à p-6\n- Gap inter-cartes : gap-4 à gap-6\n\nHIÉRARCHIE :\n- Titre de page > Titre de section > Titre de carte\n- Max 3 niveaux d\'imbrication visuelle\n\nRESPONSIVE :\n- Mobile-first, colonne unique sur mobile\n- Pas de défilement horizontal à aucun breakpoint',
        language: 'text',
      },
      explanation: 'Le juste milieu est une contrainte de design system — vous définissez l\'échelle d\'espacement, la hiérarchie des composants, la stratégie responsive — et laissez l\'agent choisir des valeurs spécifiques dans ces limites. Voyez ça comme remettre à l\'agent une règle et une palette, pas un mockup au pixel près.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Patterns de spec visuelle verrouillés !',
    },

    // === EVALUATING OUTPUT ===
    {
      type: 'multiple-choice',
      question: 'Votre évaluation du résultat UI de l\'agent a deux couches. Qu\'est-ce que la Couche 2 ?',
      options: [
        'Est-ce que ça passe les vérifications de types TypeScript ?',
        'Est-ce que ça satisfait la spec ? (comportement responsive, échelle d\'espacement)',
        'Est-ce que ça a l\'air bien ? (flux visuel, espace pour respirer, groupement, point focal)',
        'Est-ce que ça se rend sans erreurs console ?',
      ],
      correctIndex: 2,
      explanation: "La Couche 1 est objective : est-ce que ça satisfait la spec ? La Couche 2 est subjective : est-ce que ça a l'air bien ? Est-ce que l'oeil circule naturellement ? Y a-t-il assez d'espace pour respirer ? Les éléments liés semblent-ils groupés ? La page a-t-elle un point focal clair ? La Couche 2 ne peut pas être automatisée. Elle nécessite votre goût. C'est là que vit votre valeur en tant que directeur.",
    },
    {
      type: 'interactive-diagram',
      title: 'Le Filtre de Goût',
      body: 'Chaque interface générée par l\'agent passe par votre jugement visuel avant d\'être livrée. Cliquez sur chaque étape.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Spec Visuelle', sublabel: 'Vos contraintes de design', shape: 'pill' },
          { id: 'agent', label: 'L\'Agent Rend', sublabel: 'Implémente la structure', shape: 'rect' },
          { id: 'eval', label: 'Vous Évaluez', sublabel: 'Filtre de goût', shape: 'diamond', highlight: true },
          { id: 'accept', label: 'Accepter', sublabel: 'Livrer', shape: 'pill', highlight: true },
          { id: 'redirect', label: 'Rediriger', sublabel: 'Feedback spécifique', shape: 'rounded' },
        ],
        edges: [
          { from: 'spec', to: 'agent' },
          { from: 'agent', to: 'eval' },
          { from: 'eval', to: 'accept', label: 'ça passe' },
          { from: 'eval', to: 'redirect', label: 'à retravailler' },
          { from: 'redirect', to: 'agent', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [{ from: 'spec', to: 'agent' }],
          explanation: 'Commencez par votre spec visuelle : échelle d\'espacement, hiérarchie typographique, stratégie responsive, et contraintes de couleur. C\'est le livre de règles dans lequel l\'agent travaille.',
        },
        {
          highlightNodes: ['agent'],
          highlightEdges: [{ from: 'agent', to: 'eval' }],
          explanation: 'L\'agent implémente la structure. Il satisfera les exigences de la spec mais peut produire un espacement serré, une hiérarchie plate, ou des mises en page mobile cassées.',
        },
        {
          highlightNodes: ['eval'],
          highlightEdges: [{ from: 'eval', to: 'accept' }, { from: 'eval', to: 'redirect' }],
          explanation: 'Vous évaluez sur deux couches : la Couche 1 (conformité spec) est objective. La Couche 2 (goût) est subjective — est-ce que ça a l\'air bien ? C\'est là que vit votre valeur.',
        },
        {
          highlightNodes: ['accept'],
          explanation: 'Si les deux couches passent, livrez. Ne chassez pas la perfection pixel si l\'expérience utilisateur est solide.',
        },
        {
          highlightNodes: ['redirect'],
          highlightEdges: [{ from: 'redirect', to: 'agent' }],
          explanation: 'Si ça a besoin de travail, redirigez avec un feedback spécifique : nommez l\'élément, la propriété, et le changement désiré. Un feedback vague gaspille des itérations.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Un agent livre un tableau de bord qui satisfait tous les critères d\'acceptation. Les cartes ont un padding p-2 et un gap-1 entre elles. Tout est techniquement correct mais fait étriqué. Que faites-vous ?',
      options: [
        'Accepter — la spec est satisfaite',
        'Réécrire toute la spec visuelle depuis zéro',
        'Donner un feedback spécifique : « Augmenter le padding des cartes à p-4 et le gap inter-cartes à gap-4 pour une meilleure lisibilité »',
        'Demander à l\'agent de « rendre ça plus beau »',
      ],
      correctIndex: 2,
      explanation: 'La conformité à la spec est nécessaire mais pas suffisante. Le visuel ne passe pas le filtre de goût. Donnez un feedback spécifique et actionnable référençant des propriétés et valeurs exactes. « Rends ça plus beau » est trop vague — ça produira des changements aléatoires.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Compétences d\'évaluation qui s\'affûtent !',
    },

    // === SPECIFIC VISUAL FEEDBACK ===
    {
      type: 'order',
      instruction: 'Ordonnez ces feedbacks visuels du pire (le plus vague) au meilleur (le plus actionnable) :',
      items: [
        'Augmente le titre de page de text-2xl à text-3xl et ajoute mb-8 en dessous pour le séparer de la grille de contenu',
        'Rends l\'en-tête plus gros',
        'La mise en page semble décalée',
        'L\'en-tête a besoin de plus de poids visuel — essaie d\'augmenter la taille de police et d\'ajouter un espacement en bas',
      ],
      correctOrder: [2, 1, 3, 0],
    },
    {
      type: 'compare',
      title: 'Feedback vague vs feedback spécifique',
      body: 'La manière dont vous décrivez les problèmes visuels détermine si l\'agent peut les corriger en un seul tour.',
      question: 'Quel feedback l\'agent exécutera-t-il correctement du premier coup ?',
      correctSide: 'right',
      left: {
        label: 'Vague',
        content: '« Le tableau de bord fait étriqué. »\n« Rends les cartes plus belles. »\n« L\'espacement ne va pas. »\n« Il faut plus de hiérarchie visuelle. »',
        language: 'text',
      },
      right: {
        label: 'Spécifique',
        content: '« Augmente le padding des cartes de p-3 à p-6. »\n« Ajoute gap-4 entre les cartes de stats. »\n« Mets le titre de page en text-2xl font-bold. »\n« Ajoute un border-b border-foreground/10\n  séparateur entre les sections. »',
        language: 'text',
      },
      explanation: 'Un feedback spécifique nomme l\'élément, la propriété et la valeur. L\'agent l\'exécute en une seule modification. Un feedback vague oblige l\'agent à deviner ce que « mieux » signifie — et il devinera mal.',
    },
    {
      type: 'code-fill',
      instruction: 'Réécrivez ce feedback visuel vague en directives spécifiques et actionnables :',
      language: 'text',
      filename: 'feedback-fix.txt',
      template: '# Original : « Les cartes font bizarres et étriquées »\n# Réécrit :\nAugmenter le padding des cartes de p-2 à {{card_padding}}.\nAjouter {{gap_value}} entre les cartes de stats.\nMettre le titre de page en {{title_classes}}.\nAjouter un {{separator}} séparateur entre les sections.',
      blanks: [
        { id: 'card_padding', answer: 'p-5', alternatives: ['p-6', 'p-4'], placeholder: 'nouveau padding ?', hint: 'Padding généreux dans la plage p-4 à p-6' },
        { id: 'gap_value', answer: 'gap-4', alternatives: ['gap-5', 'gap-6'], placeholder: 'valeur de gap ?', hint: 'Espacement standard inter-cartes' },
        { id: 'title_classes', answer: 'text-2xl font-bold', alternatives: ['text-3xl font-bold', 'text-xl font-semibold'], placeholder: 'taille + poids du titre ?', hint: 'Grand et gras pour établir la hiérarchie' },
        { id: 'separator', answer: 'border-b border-foreground/10', alternatives: ['border-b border-gray-200', 'border-b border-foreground/5'], placeholder: 'bordure séparatrice ?', hint: 'Une ligne horizontale subtile' },
      ],
      explanation: 'Chaque feedback visuel devrait référencer un élément spécifique, une propriété et un changement désiré. Un feedback spécifique, c\'est une itération. Un feedback vague, c\'en est trois.',
    },
    {
      type: 'multiple-choice',
      question: 'Quel feedback produira le meilleur résultat en une seule itération ?',
      options: [
        '« Le formulaire a besoin de travail »',
        '« Rends les inputs du formulaire plus grands et ajoute plus d\'espace entre eux »',
        '« Augmente la hauteur des inputs à h-11, mets gap-y-5 entre les champs, et ajoute un pt-6 au-dessus du bouton soumettre pour le séparer visuellement des champs »',
        '« Le formulaire devrait ressembler au formulaire checkout de Stripe »',
      ],
      correctIndex: 2,
      explanation: 'La troisième option nomme les éléments exacts (inputs, champs, bouton soumettre), les propriétés exactes (hauteur, gap, padding), et les valeurs exactes (h-11, gap-y-5, pt-6). L\'agent peut exécuter ça en une passe sans interprétation.',
    },

    // === COMMON VISUAL ISSUES ===
    {
      type: 'multiple-choice',
      question: 'Parmi ces six problèmes visuels courants des agents, lequel a le PLUS d\'impact sur l\'utilisabilité ?',
      options: [
        'Padding serré (espacement minimal)',
        'Hiérarchie plate (tout le texte de taille et poids similaires)',
        'États interactifs incohérents (certains boutons ont des effets de survol, d\'autres non)',
        'Flux responsive cassé (s\'empile maladroitement sur mobile)',
      ],
      correctIndex: 1,
      explanation: "La hiérarchie plate a le plus d'impact parce qu'elle détruit la capacité de l'utilisateur à scanner et naviguer. Quand les titres de page, de section et de carte se ressemblent tous, les utilisateurs ne peuvent pas distinguer la structure. Les cinq autres problèmes (padding serré, groupement manquant, mises en page surchargées, états incohérents, responsive cassé) reviennent aussi, mais la hiérarchie est la fondation de la communication visuelle.",
    },
    {
      type: 'code-fill',
      instruction: 'Corrigez cette hiérarchie typographique plate. Chaque niveau de titre a besoin d\'une taille, d\'un poids et d\'un style distincts :',
      language: 'tsx',
      filename: 'hierarchy-fix.tsx',
      template: '// Hiérarchie claire — taille + poids distincts à chaque niveau\n<h1 className="{{h1_classes}}">Dashboard</h1>\n<h2 className="{{h2_classes}}">Recent Activity</h2>\n<h3 className="{{h3_classes}}">Card Title</h3>',
      blanks: [
        { id: 'h1_classes', answer: 'text-3xl font-bold tracking-tight', alternatives: ['text-3xl font-bold', 'text-4xl font-bold tracking-tight'], placeholder: 'classes du titre de page ?', hint: 'Le plus grand et le plus gras — le titre de page' },
        { id: 'h2_classes', answer: 'text-xl font-semibold text-muted-foreground', alternatives: ['text-xl font-semibold', 'text-lg font-semibold text-muted-foreground'], placeholder: 'classes du titre de section ?', hint: 'Taille moyenne, légèrement atténuée pour montrer qu\'il est secondaire' },
        { id: 'h3_classes', answer: 'text-sm font-medium uppercase tracking-wide', alternatives: ['text-sm font-medium uppercase', 'text-xs font-semibold uppercase tracking-wide'], placeholder: 'classes du titre de carte ?', hint: 'Petit, majuscules, espacement large pour un effet d\'étiquette' },
      ],
      explanation: 'La hiérarchie vient du contraste entre les niveaux. Titre de page : grand et gras. Titre de section : moyen et atténué. Titre de carte : petit, majuscules, espacé. Les agents mettent des tailles similaires à chaque niveau — votre travail est d\'imposer un poids visuel distinct.',
    },
    {
      type: 'match',
      instruction: 'Associez chaque problème visuel à sa correction :',
      leftItems: ['Tout fait étriqué', 'Tout le texte a la même taille', 'Les éléments liés semblent déconnectés', 'Boutons trop petits sur mobile'],
      rightItems: ['Augmenter le padding (p-3 → p-6) et les valeurs de gap', 'Varier la taille et le poids de police (text-sm → text-2xl, font-semibold)', 'Grouper avec des bordures, des fonds partagés ou un espacement plus serré', 'Définir des zones de toucher minimum de 44px (min-h-[44px] min-w-[44px])'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Chaque problème visuel a une correction mécanique. Étriqué → plus de padding. Hiérarchie plate → varier taille/poids du texte. Déconnecté → grouper visuellement. Petites cibles → minimum 44px.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez les classes Tailwind pour corriger cette carte étriquée et plate :',
      language: 'tsx',
      filename: 'src/components/stat-card.tsx',
      template: '<div className="rounded-xl border border-foreground/[0.08] {{padding}} {{gap}}">\n  <p className="{{label_size}} text-foreground/50">Revenue</p>\n  <p className="{{value_size}} {{value_weight}}">$12,450</p>\n  <p className="text-xs text-green-500">+12% this week</p>\n</div>',
      blanks: [
        { id: 'padding', answer: 'p-6', alternatives: ['p-5', 'p-8'], placeholder: 'padding ?', hint: 'Padding généreux : p-5 à p-8' },
        { id: 'gap', answer: 'space-y-2', alternatives: ['space-y-3', 'flex flex-col gap-2'], placeholder: 'espacement vertical ?', hint: 'Espace entre les enfants' },
        { id: 'label_size', answer: 'text-sm', alternatives: ['text-xs'], placeholder: 'taille du label ?', hint: 'Petit mais lisible' },
        { id: 'value_size', answer: 'text-2xl', alternatives: ['text-xl', 'text-3xl'], placeholder: 'taille de la valeur ?', hint: 'Le nombre principal doit être grand' },
        { id: 'value_weight', answer: 'font-bold', alternatives: ['font-semibold'], placeholder: 'poids de la valeur ?', hint: 'Le faire ressortir' },
      ],
      explanation: 'La hiérarchie vient du contraste : petit label atténué, grande valeur en gras, et petite tendance colorée. Un padding généreux (p-6) empêche la sensation d\'étriqué.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Problèmes courants catalogués !',
    },

    // === GOOD-ENOUGH VS PIXEL-PERFECT ===
    {
      type: 'match',
      instruction: 'Associez chaque problème visuel à la décision : corriger ou livrer :',
      leftItems: ['Le border radius des cartes est rounded-lg au lieu de rounded-xl', 'Le CTA principal est visuellement identique au bouton Supprimer destructif', 'Le gap est gap-4 quand gap-5 pourrait être légèrement mieux', 'La hiérarchie de navigation est complètement plate — les utilisateurs ne trouvent pas les actions clés'],
      rightItems: ['CORRIGER : Problème d\'utilisabilité, les utilisateurs ne distinguent pas le sûr du dangereux', 'LIVRER : Différence de préférence, pas d\'impact sur l\'expérience utilisateur', 'LIVRER : Amélioration marginale, pas la peine d\'une itération', 'CORRIGER : La confusion de navigation causera de la friction réelle chez les utilisateurs'],
      correctPairs: { 0: 1, 1: 0, 2: 2, 3: 3 },
      explanation: "La règle : si un problème visuel vous ferait hésiter à montrer ça à un utilisateur, corrigez-le. Si vous ne le remarquez que parce que vous le fixez, livrez-le. Le goût est important, mais le perfectionnisme est coûteux. Chaque itération brûle des tokens, du contexte et votre attention.",
    },
    {
      type: 'multiple-choice',
      question: 'Quel problème vaut une autre itération pour être corrigé ?',
      options: [
        'Le border radius des cartes est rounded-lg au lieu de votre préféré rounded-xl',
        'Le bouton CTA principal est visuellement identique à une action destructive « Supprimer » — même taille, même proéminence',
        'Le gap inter-cartes est gap-4 quand gap-5 pourrait être légèrement mieux',
        'Le font weight d\'un label est font-medium au lieu de font-semibold',
      ],
      correctIndex: 1,
      explanation: 'Une action principale visuellement identique à une action destructive est un problème d\'utilisabilité — les utilisateurs ne peuvent pas distinguer le sûr du dangereux d\'un coup d\'oeil. Les autres problèmes sont des différences de préférence qui n\'affectent pas significativement l\'expérience utilisateur.',
    },

    // === HANDS-ON EXERCISES ===
    {
      type: 'terminal',
      instruction: 'Créez un fichier de spec visuelle qui définit votre système d\'espacement, échelle typographique et hiérarchie des composants pour une app de tableau de feedback.',
      expectedCommand: 'claude "Create a file at VISUAL_SPEC.md with: Spacing System (section padding py-16, card padding p-5 to p-6, gap-4 to gap-6), Typography Scale (page title text-3xl font-bold, section heading text-xl font-semibold, card title text-base font-medium, body text-sm), Component Hierarchy (page > section > card > content). Mobile-first responsive strategy."',
      hint: 'Dirigez l\'agent pour créer un fichier markdown de spec visuelle avec vos contraintes de design system.',
    },
    {
      type: 'terminal',
      instruction: 'Maintenant dirigez l\'agent pour construire un composant carte qui suit votre spec visuelle. Contraignez l\'espacement sans dicter chaque classe.',
      expectedCommand: 'claude "Build a FeedbackCard component following VISUAL_SPEC.md. It displays: title (card title scale), description (body scale), vote count, and status badge. Card padding must follow the spec. Include hover state with subtle border color change. Mobile: full width. Desktop: works in a 3-column grid."',
      hint: 'Référencez le fichier de spec visuelle et décrivez le contenu et comportement de la carte — laissez l\'agent choisir l\'implémentation spécifique dans vos contraintes.',
    },
    {
      type: 'terminal',
      instruction: 'L\'agent a livré la carte avec un padding p-3 et aucune séparation visuelle entre le titre et la description. Donnez un feedback correctif spécifique.',
      expectedCommand: 'claude "Fix the FeedbackCard: increase padding from p-3 to p-5, add mb-2 below the title to separate it from description, and ensure the vote count has a bg-muted rounded-md px-2 py-1 treatment to distinguish it from plain text."',
      hint: 'Nommez l\'élément exact, le problème actuel, et la correction spécifique avec les valeurs Tailwind.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Compétences de direction visuelle en action !',
    },

    // === RESPONSIVE EVALUATION ===
    {
      type: 'multiple-choice',
      question: 'Vous ouvrez les outils de dev et redimensionnez à 375px. Lequel de ces problèmes est une défaillance FONCTIONNELLE, pas juste cosmétique ?',
      options: [
        'Les cartes sont en colonne unique au lieu de la grille à 3 colonnes du desktop',
        'Les tailles de police sont légèrement plus petites que sur desktop',
        'Les zones de toucher (boutons, liens) font moins de 44px et sont difficiles à presser',
        'La barre latérale est cachée derrière un menu hamburger',
      ],
      correctIndex: 2,
      explanation: "Les agents réussissent souvent le desktop et ignorent le mobile. Les zones de toucher sous 44px sont des défaillances fonctionnelles — les utilisateurs ne peuvent physiquement pas les toucher de manière fiable. Le débordement de contenu, les CTAs manquants au-dessus du pli, et la troncature de texte sont aussi fonctionnels, pas cosmétiques. La mise en page en colonne unique et la barre latérale cachée sont des adaptations mobiles correctes, pas des défaillances.",
    },
    {
      type: 'multiple-choice',
      question: 'Vous redimensionnez l\'interface construite par l\'agent à 375px et le bouton d\'action principal est sous le pli, nécessitant un défilement. L\'agent n\'a techniquement violé aucune spec. Que faites-vous ?',
      options: [
        'Accepter — l\'UX mobile est un objectif étiré',
        'Ajouter une contrainte de spec : « Le CTA principal doit être visible sans défilement sur viewport mobile » et faire corriger par l\'agent',
        'Réécrire tout le composant depuis zéro vous-même',
        'Dire à l\'agent de « rendre ça adapté au mobile »',
      ],
      correctIndex: 1,
      explanation: 'C\'est un cas où votre évaluation révèle une lacune dans la spec. Ajoutez la contrainte explicitement pour que l\'agent sache ce que « visible sur mobile » signifie, puis faites-lui corriger la mise en page. Ça améliore à la fois le résultat actuel et la spec pour les futures itérations.',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'À mesure que les agents IA deviennent plus capables de générer des interfaces, quelle compétence devient PLUS précieuse, pas moins ?',
      options: [
        'Écrire du CSS à la main',
        'Mémoriser les noms de classes Tailwind',
        'Le goût visuel — juger ce qui a l\'air bien, semble équilibré, et communique la hiérarchie',
        'Taper rapidement du markup HTML',
      ],
      correctIndex: 2,
      explanation: "Les agents vont devenir plus rapides à générer des interfaces. Mais le goût — le jugement de ce qui a l'air bien, ce qui semble équilibré, ce qui communique la hiérarchie — reste humain. Votre valeur n'est pas de cocher des cases. C'est le jugement visuel qui transforme une interface conforme en une interface que les utilisateurs apprécient. Développez ce muscle : regardez les interfaces de manière critique, nommez ce qui vous dérange spécifiquement, et dirigez les corrections avec précision.",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification de direction visuelle :',
      items: [
        'Je peux écrire des specs visuelles qui contraignent sans micro-gérer',
        'J\'évalue le résultat de l\'agent sur deux couches : conformité à la spec ET goût',
        'Je donne un feedback spécifique avec noms d\'éléments, propriétés et valeurs',
        'Je reconnais les six problèmes visuels courants que les agents produisent',
        'Je sais quand « assez bien » est acceptable vs quand pousser pour mieux',
        'Je vérifie le comportement responsive aux vraies largeurs d\'appareils',
      ],
    },
    {
      type: 'checkpoint',
      xp: 8,
      message: 'Direction visuelle maîtrisée ! Votre goût est la porte de qualité.',
    },
  ],
}

export default content
