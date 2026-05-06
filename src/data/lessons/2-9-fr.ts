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
      type: 'info',
      title: 'Écrire des specs visuelles qui contraignent sans micro-gérer',
      body: "Les mêmes anti-patterns de la leçon 2-1 s'appliquent ici. Trop vague : « fais-le paraître moderne ». Trop prescriptif : « utilise p-4 gap-3 text-sm font-medium ». Le juste milieu est une contrainte de design system — vous définissez l'échelle d'espacement, la hiérarchie des composants, la stratégie responsive — et laissez l'agent choisir des valeurs spécifiques dans ces limites. Voyez ça comme remettre à l'agent une règle et une palette, pas un mockup au pixel près.",
    },
    {
      type: 'code-demo',
      title: 'Spec visuelle : contraintes de design system',
      body: 'Ceci contraint les décisions visuelles sans dicter chaque classe. L\'agent a un système dans lequel travailler.',
      language: 'markdown',
      filename: 'SPEC.md',
      code: "## Visual Design Constraints\n\n### Responsive Strategy\n- Mobile-first: design for 375px, then enhance for 768px+\n- Single column on mobile, max 2 columns on tablet, 3 on desktop\n- No horizontal scrolling at any breakpoint\n\n### Component Hierarchy\n- Page title → Section headings → Card titles → Body text\n- Max 3 levels of visual nesting\n- Cards are the primary content container\n\n### Spacing System\n- Use Tailwind's default scale (4px increments)\n- Section padding: py-12 to py-16\n- Card padding: p-4 to p-6\n- Inter-card gap: gap-4 to gap-6\n- Never less than p-3 inside interactive elements\n\n### Color & Contrast\n- Monochromatic palette (grays + one accent)\n- Text must meet WCAG AA contrast (4.5:1 body, 3:1 large text)\n- Interactive elements must have visible focus states",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Patterns de spec visuelle verrouillés !',
    },

    // === EVALUATING OUTPUT ===
    {
      type: 'info',
      title: 'Évaluer le résultat UI de l\'agent',
      body: "L'agent livre une interface fonctionnelle. Votre évaluation a deux couches. Couche 1 : Est-ce que ça satisfait la spec ? Vérifiez le comportement responsive, la hiérarchie des composants, la conformité à l'échelle d'espacement. C'est objectif. Couche 2 : Est-ce que ça a l'air bien ? C'est subjectif — et c'est là que votre goût compte. Est-ce que l'oeil circule naturellement ? Y a-t-il assez d'espace pour respirer ? Les éléments liés semblent-ils groupés ? La page a-t-elle un point focal clair ? La couche 2 ne peut pas être automatisée. Elle vous nécessite.",
    },
    {
      type: 'diagram',
      title: 'Le Filtre de Goût',
      body: 'Chaque interface générée par l\'agent passe par votre jugement visuel avant d\'être livrée.',
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
      type: 'info',
      title: 'Donner un feedback visuel spécifique',
      body: "Un feedback vague gaspille des itérations. « La mise en page semble décalée » ne donne rien à l'agent pour travailler. Il fera des ajustements aléatoires en espérant vous satisfaire. Un feedback spécifique nomme la propriété, l'élément, et la direction du changement. Comparez : « rends l'en-tête plus gros » versus « augmente le titre de page de text-2xl à text-3xl et ajoute mb-8 en dessous pour le séparer de la grille de contenu ». Le second, c'est une itération. Le premier, c'en est trois.",
    },
    {
      type: 'code-demo',
      title: 'Mauvais vs bon feedback visuel',
      body: 'Chaque feedback visuel devrait référencer un élément spécifique, une propriété et un changement désiré.',
      language: 'text',
      filename: 'feedback-examples.txt',
      code: "❌ BAD FEEDBACK (vague, multi-interpretation)\n\"The cards look weird\"\n\"Make it more spacious\"\n\"The page feels cluttered\"\n\"Fix the alignment\"\n\"Make it look more professional\"\n\n✅ GOOD FEEDBACK (specific, actionable)\n\"Increase card padding from p-2 to p-5\"\n\"The sidebar is 320px — reduce to 256px so content area breathes\"\n\"Add a border-b border-gray-200 below the nav to separate it from content\"\n\"The CTA button is the same size as secondary actions — make it h-12 px-8 vs h-9 px-4\"\n\"Move the filter bar above the grid, not inside the sidebar — it's a primary action\"",
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
      type: 'info',
      title: 'Les six problèmes visuels que les agents produisent le plus souvent',
      body: "Après avoir révisé des centaines d'interfaces générées par des agents, six problèmes reviennent. (1) Padding serré — les agents utilisent un espacement minimal par défaut. (2) Hiérarchie plate — tout le texte est de taille et poids similaires. (3) Séparation de groupes manquante — les éléments liés ne sont pas visuellement regroupés. (4) Mises en page surchargées — trop d'éléments en compétition pour l'attention. (5) États interactifs incohérents — certains boutons ont des effets de survol, d'autres non. (6) Flux responsive cassé — s'empile maladroitement sur mobile. Entraînez-vous à scanner ces six problèmes en premier.",
    },
    {
      type: 'code-demo',
      title: 'Corriger la hiérarchie plate',
      body: 'Les agents rendent souvent les titres de page, de section et de carte trop similaires en taille. Imposez une échelle typographique claire.',
      language: 'tsx',
      filename: 'hierarchy-fix.tsx',
      code: "// BEFORE: Flat hierarchy — everything looks the same weight\n<h1 className=\"text-xl font-medium\">Dashboard</h1>\n<h2 className=\"text-lg font-medium\">Recent Activity</h2>\n<h3 className=\"text-base font-medium\">Card Title</h3>\n\n// AFTER: Clear hierarchy — distinct size + weight at each level\n<h1 className=\"text-3xl font-bold tracking-tight\">Dashboard</h1>\n<h2 className=\"text-xl font-semibold text-muted-foreground\">Recent Activity</h2>\n<h3 className=\"text-sm font-medium uppercase tracking-wide\">Card Title</h3>",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Problèmes courants catalogués !',
    },

    // === GOOD-ENOUGH VS PIXEL-PERFECT ===
    {
      type: 'info',
      title: 'Quand accepter « assez bien » vs pousser vers le pixel-perfect',
      body: "Le goût est important. Le perfectionnisme est coûteux. La question n'est pas « est-ce parfait ? » mais « corriger ça améliorera-t-il notablement l'expérience utilisateur ? » Une différence de 2px de padding — probablement pas. Une hiérarchie visuelle manquante qui embrouille la navigation — absolument. Votre temps a un coût. Chaque itération brûle des tokens, du contexte et votre attention. La règle : si un problème visuel vous ferait hésiter à montrer ça à un utilisateur, corrigez-le. Si vous ne le remarquez que parce que vous le fixez, livrez-le.",
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
      type: 'info',
      title: 'Évaluer le comportement responsive',
      body: "Les agents réussissent souvent le desktop et ignorent le mobile. Ou ils empilent tout verticalement sur mobile sans considérer la portée du pouce, la troncature du texte, ou les zones de toucher. Votre spec visuelle devrait définir le comportement par breakpoint, mais vous devez quand même le vérifier. Ouvrez les outils de dev, redimensionnez à 375px de large, et vérifiez : Le contenu déborde-t-il ? Les zones de toucher font-elles au moins 44px ? L'action la plus importante reste-t-elle visible sans défiler ? Ce ne sont pas des problèmes cosmétiques — ce sont des défaillances fonctionnelles sur mobile.",
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
      type: 'info',
      title: 'Votre rôle : la couche de goût',
      body: "Les agents vont devenir plus rapides et plus capables de générer des interfaces. Mais le goût — le jugement de ce qui a l'air bien, ce qui semble équilibré, ce qui communique la hiérarchie — reste humain. Votre valeur dans la direction d'interfaces construites par agent n'est pas de cocher des cases. C'est le jugement visuel qui transforme une interface conforme en une interface que les utilisateurs apprécient vraiment utiliser. Développez ce muscle : regardez les interfaces de manière critique, nommez ce qui vous dérange spécifiquement, et dirigez les corrections avec précision.",
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
