import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Le virage : des tâches aux produits',
      body: "Au Tier 1, vous avez appris à utiliser un agent pour des tâches individuelles — écrire une fonction, corriger un bug, ajouter un test. C'est utile mais limité. Au Tier 2, vous dirigez un seul agent pour construire un produit complet. La différence n'est pas juste une question d'échelle. C'est une compétence fondamentalement différente : vous arrêtez d'écrire du code et vous commencez à écrire des spécifications. La spec devient votre artéfact principal — la chose que vous itérez, peaufinez, et remettez à l'agent comme contrat d'exécution.",
    },
    {
      type: 'info',
      title: 'Ce que « spec » veut dire ici',
      body: "Ce n'est pas un PRD traditionnel (Product Requirements Document). Un PRD est écrit pour des humains — il explique le contexte, la motivation, les user stories, et laisse les détails d'implémentation à l'équipe d'ingénierie. Une spec d'agent est un contrat d'exécution. L'agent n'a pas besoin de motivation ni de user stories. Il a besoin de limites précises : quoi construire, quoi ne pas construire, qu'est-ce qui compte comme terminé, et où il est autorisé à prendre ses propres décisions. Voyez ça comme un contrat entre vous (le directeur) et l'agent (le constructeur).",
    },

    // === SPEC STRUCTURE ===
    {
      type: 'multiple-choice',
      question: 'Une bonne spec d\'agent comporte cinq sections. Laquelle N\'EN fait PAS partie ?',
      options: [
        'Objectif : une phrase decrivant ce qui existe quand l\'agent a termine',
        'User Stories : descriptions narratives de comment differents personas interagissent avec le produit',
        'Criteres d\'acceptation : conditions specifiques et testables prouvant que le travail est termine',
        'Hors perimetre : choses explicitement exclues que l\'agent pourrait autrement construire',
      ],
      correctIndex: 1,
      explanation: 'Les User Stories appartiennent a un PRD (ecrit pour des humains), pas a une spec d\'agent. Les cinq sections sont : Objectif, Contraintes (garde-fous technologiques), Criteres d\'acceptation (preuve testable), Limites techniques (ce que l\'agent peut toucher), et Hors perimetre (exclusions explicites). Un agent n\'a pas besoin de contexte narratif — il a besoin de limites precises.',
    },
    {
      type: 'interactive-diagram',
      title: 'Structure de la Spec',
      body: 'Les cinq sections forment un entonnoir allant de la vision large aux limites precises. Parcourez chaque section pour comprendre son role.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'goal', label: 'Objectif', sublabel: 'Ce qui existe une fois termine', shape: 'rounded', highlight: true },
          { id: 'constraints', label: 'Contraintes', sublabel: 'Garde-fous techno et style', shape: 'rect' },
          { id: 'acceptance', label: 'Criteres d\'acceptation', sublabel: 'Preuve testable de completion', shape: 'rect' },
          { id: 'boundaries', label: 'Limites techniques', sublabel: 'Autorise et interdit', shape: 'rect' },
          { id: 'oos', label: 'Hors perimetre', sublabel: 'Explicitement exclu', shape: 'pill' },
        ],
        edges: [
          { from: 'goal', to: 'constraints' },
          { from: 'constraints', to: 'acceptance' },
          { from: 'acceptance', to: 'boundaries' },
          { from: 'boundaries', to: 'oos' },
        ],
      },
      stages: [
        {
          highlightNodes: ['goal'],
          highlightEdges: [],
          explanation: 'Objectif : Une phrase decrivant ce qui existe quand l\'agent a termine. « Une app web fonctionnelle ou les utilisateurs peuvent sauvegarder, taguer, chercher et supprimer des favoris. » Cela ancre tout ce qui suit.',
        },
        {
          highlightNodes: ['goal', 'constraints'],
          highlightEdges: [{ from: 'goal', to: 'constraints' }],
          explanation: 'Contraintes : Choix technologiques, exigences de style, budgets de performance. Ce sont des garde-fous — ils empechent l\'agent de prendre des decisions technologiques non autorisees.',
        },
        {
          highlightNodes: ['constraints', 'acceptance'],
          highlightEdges: [{ from: 'constraints', to: 'acceptance' }],
          explanation: 'Criteres d\'acceptation : Conditions specifiques et testables prouvant que le travail est termine. Chaque critere est une case a cocher que l\'agent (et vous) pouvez verifier.',
        },
        {
          highlightNodes: ['acceptance', 'boundaries'],
          highlightEdges: [{ from: 'acceptance', to: 'boundaries' }],
          explanation: 'Limites techniques : Ce que l\'agent est autorise a toucher — fichiers, packages, APIs — et ce qui est interdit. Cela previent les effets de bord inattendus.',
        },
        {
          highlightNodes: ['boundaries', 'oos'],
          highlightEdges: [{ from: 'boundaries', to: 'oos' }],
          explanation: 'Hors perimetre : Choses que l\'agent pourrait raisonnablement supposer incluses mais qui sont explicitement exclues. Sans cela, les agents enthousiastes vont sur-construire.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Anatomie de la spec comprise !',
    },

    // === REAL EXAMPLE ===
    {
      type: 'code-fill',
      instruction: 'Parcourons un exemple concret. Vous avez une idee de produit : un gestionnaire de favoris avec des tags. Completez les parties manquantes de cette spec — remarquez comment chaque section contraint l\'agent sans le micro-gerer. La spec dit QUOI, pas COMMENT.',
      language: 'markdown',
      filename: 'SPEC.md',
      template: '# Bookmark Manager — Agent Spec\n\n## Goal\nA working web app where users can save, tag, search, and delete bookmarks.\n\n## Constraints\n- Next.js 15 with App Router\n- TypeScript strict mode\n- {{database}} (local file DB, no external services)\n- Tailwind CSS for styling\n- No authentication (single-user, local)\n\n## Acceptance Criteria\n- [ ] User can add a bookmark (URL + optional title)\n- [ ] User can assign multiple tags to a bookmark\n- [ ] User can filter bookmarks by tag\n- [ ] User can full-text search bookmarks by title/URL\n- [ ] User can delete a bookmark\n\n## Technical Boundaries\n- Create a new project from scratch (not modify existing)\n- Use `src/` directory structure\n- Keep all DB logic in `src/db/` directory\n- Use {{mutation_pattern}} for mutations (no API routes)\n\n## Out of Scope\n- User authentication / multi-tenancy\n- {{excluded_feature}}\n- Browser extension\n- Favicon fetching',
      blanks: [
        { id: 'database', answer: 'SQLite via Drizzle ORM', alternatives: ['SQLite + Drizzle ORM', 'Drizzle ORM + SQLite', 'SQLite with Drizzle ORM'], placeholder: 'quelle base de donnees + ORM ?', hint: 'Une BD legere basee sur fichier associee a un ORM TypeScript' },
        { id: 'mutation_pattern', answer: 'server actions', alternatives: ['Server Actions', 'server actions', 'Server actions'], placeholder: 'quel pattern de mutation ?', hint: 'Fonctionnalite de l\'App Router Next.js qui remplace les routes API pour les soumissions de formulaire' },
        { id: 'excluded_feature', answer: 'Bookmark import/export', alternatives: ['Import/export', 'import/export', 'Bookmark import export'], placeholder: 'quelle fonctionnalite de portabilite ?', hint: 'Une fonctionnalite courante pour migrer des favoris entre outils' },
      ],
      explanation: 'Nommer SQLite + Drizzle elimine une decision de base de donnees. Server actions est un choix architectural qui affecte comment toute l\'app gere les mutations. Import/export est une fonctionnalite raisonnable qu\'un agent pourrait ajouter — l\'exclure previent la derive de perimetre.',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi la spec dit « SQLite via Drizzle ORM » au lieu de juste « une base de données » ?',
      options: [
        'Parce que SQLite est la seule base de données qui fonctionne avec Next.js',
        'Pour empêcher l\'agent de passer du temps à évaluer les options de base de données — la décision est prise',
        'Parce que Drizzle ORM est requis pour les server actions',
        'Pour rendre la spec plus longue et plus professionnelle',
      ],
      correctIndex: 1,
      explanation: 'Nommer la technologie spécifique élimine un point de décision. Sans ça, l\'agent pourrait passer des tokens à évaluer Postgres vs SQLite vs Prisma vs Drizzle. La spec fait le choix pour que l\'agent puisse exécuter immédiatement. C\'est une contrainte — un garde-fou qui fait gagner du temps.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Vraie spec analysée !',
    },

    // === ANTI-PATTERNS ===
    {
      type: 'compare',
      title: 'Deux anti-patterns de spec',
      body: 'Ces deux specs vont causer des problemes. L\'une ne dit presque rien a l\'agent. L\'autre ecrit du code en francais.',
      question: 'Quel mode de defaillance gaspille LE PLUS de votre temps a corriger la sortie ?',
      correctSide: 'left',
      left: {
        label: 'Trop vague',
        content: '« Construis-moi un gestionnaire de\nfavoris. Fais-le bien. Utilise de\nla techno moderne. »\n\nResultat : l\'agent prend des\ndizaines de decisions non autorisees\n— choisit une BD, invente des\nfonctionnalites, choisit des\npatterns de routing.',
        language: 'text',
      },
      right: {
        label: 'Trop prescriptif',
        content: '« Cree src/components/BookmarkCard.tsx.\nExporte un composant avec props\n{ url: string, title: string }.\nUtilise un div avec className\n\'card p-4 border rounded-lg\'... »\n\nResultat : vous ecrivez du code\nen francais. Ecrivez le code\ndirectement.',
        language: 'text',
      },
      explanation: 'Trop vague cause plus de retravail car l\'agent prend des decisions architecturales que vous devez defaire. Trop prescriptif gaspille votre temps a ecrire la spec, mais la sortie est au moins previsible. Le bon equilibre : contraindre les decisions couteuses (architecture, stack, limites), laisser les decisions bon marche (nommage, details de style) a l\'agent.',
    },
    {
      type: 'multiple-choice',
      question: 'Une spec a un objectif clair et des criteres d\'acceptation mais aucune limite ni exclusion de perimetre. L\'agent construit tout correctement — puis ajoute aussi l\'authentification, la config Docker et un pipeline CI/CD. Quel anti-pattern est-ce ?',
      options: [
        'Trop vague — la spec n\'a pas specifie assez de details',
        'Trop prescriptif — la spec a trop contraint l\'agent',
        'Limites manquantes — sans exclusions explicites, l\'agent optimise pour la completude',
        'Mauvais format — la spec aurait du etre dans CLAUDE.md au lieu d\'un prompt',
      ],
      correctIndex: 2,
      explanation: 'Sans section Hors perimetre, l\'agent essaie d\'etre utile en construisant tout ce qu\'il pense que vous pourriez avoir besoin. La section Hors perimetre n\'est pas optionnelle — c\'est votre defense contre le depassement de perimetre d\'un constructeur enthousiaste.',
    },
    {
      type: 'compare',
      title: 'Identifie l\'anti-pattern',
      body: 'Une de ces specs contraint l\'agent. L\'autre écrit du code en anglais.',
      question: 'Quel côté est l\'approche correcte ?',
      correctSide: 'left',
      left: {
        label: 'Contrainte',
        content: '## Constraints\n- Use Tailwind CSS for all styling\n- No authentication — single user only\n- Keep database logic in src/db/\n- SQLite via Drizzle ORM',
        language: 'markdown',
      },
      right: {
        label: 'Trop prescriptif',
        content: '## Implementation\n- Create src/components/BookmarkCard.tsx\n- Export component with props { url: string }\n- Use a div with className "card p-4 border"\n- Inside render an anchor tag with href={url}',
        language: 'markdown',
      },
      explanation: 'Le côté gauche pose des garde-fous — quels outils utiliser, ce qui est interdit. Le côté droit dicte la structure exacte du code. Si tu connais le JSX exact, écris-le toi-même. Une spec contraint les décisions sans les prendre.',
    },
    {
      type: 'multiple-choice',
      question: 'Quelle instruction de spec est un anti-pattern ?',
      options: [
        '« Utiliser Tailwind CSS pour tout le styling »',
        '« Créer une fonction appelée calculateTotal qui prend un tableau de nombres et retourne leur somme en utilisant reduce »',
        '« Pas d\'authentification — utilisateur unique seulement »',
        '« Garder la logique de base de données dans src/db/ »',
      ],
      correctIndex: 1,
      explanation: 'Dicter le nom exact de la fonction, les paramètres, et l\'implémentation (utiliser reduce) est trop prescriptif. Vous écrivez du code en français. Les autres options sont des contraintes appropriées qui guident sans micro-gérer.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Anti-patterns identifiés !',
    },

    // === DELIVERY METHOD ===
    {
      type: 'multiple-choice',
      question: 'Vous demarrez un nouveau projet qui va evoluer sur plusieurs semaines. Ou devriez-vous mettre la spec pour que l\'agent ait le contexte a chaque invocation ?',
      options: [
        'Dans le premier message de prompt — collez-la a chaque fois que vous demarrez une session',
        'Dans CLAUDE.md a la racine du projet — l\'agent le lit automatiquement a chaque session',
        'Dans un fichier README.md — emplacement standard de documentation',
        'Dans un commentaire en haut du fichier source principal',
      ],
      correctIndex: 1,
      explanation: 'CLAUDE.md a la racine du projet est lu automatiquement par Claude Code au debut de chaque session. Pour les projets en cours ou la spec evolue, c\'est la meilleure methode de livraison. Pour les constructions en une fois, coller la spec directement dans le prompt fonctionne aussi — mais ca ne persiste pas entre les sessions.',
    },
    {
      type: 'compare',
      title: 'CLAUDE.md vs prompt direct',
      body: 'Deux facons valides de livrer une spec a l\'agent. Le bon choix depend du cycle de vie de votre projet.',
      question: 'Quelle methode est meilleure pour un projet qui evolue sur plusieurs semaines ?',
      correctSide: 'left',
      left: {
        label: 'CLAUDE.md',
        content: '# Bookmark Manager\n\n## Spec\n[... votre spec complete ici ...]\n\n## Development\n- Run: `npm run dev`\n- Test: `npm test`\n\n## Architecture Decisions\n(L\'agent remplit au fur et a mesure)\n\n✓ Persiste entre les sessions\n✓ Evolue avec le projet\n✓ Lu automatiquement par l\'agent',
        language: 'markdown',
      },
      right: {
        label: 'Prompt direct',
        content: 'Build this project from scratch\naccording to the following spec:\n\n[collez votre spec complete]\n\nStart by creating the project\nstructure, then implement each\ncriterion one at a time.\n\n✓ Bon pour les constructions en une fois\n✓ Pas de fichier a maintenir\n✗ Doit etre re-colle a chaque session',
        language: 'text',
      },
      explanation: 'CLAUDE.md est le bon choix pour les projets evolutifs — il persiste, se met a jour avec le temps, et l\'agent le lit automatiquement. Les prompts directs fonctionnent pour les constructions en une fois ou la spec est une instruction a usage unique.',
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'De la vision produit au lancement',
      body: 'Le flux complet de l\'idee au produit deploye. La spec est le pont entre votre vision et l\'execution par l\'agent. Parcourez chaque etape.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'vision', label: 'Vision Produit', sublabel: 'Votre idee', shape: 'pill' },
          { id: 'spec', label: 'Ecrire la Spec', sublabel: '5 sections', shape: 'rounded', highlight: true },
          { id: 'execute', label: 'L\'Agent Execute', sublabel: 'Claude Code construit', shape: 'rect' },
          { id: 'review', label: 'Reviser le Resultat', sublabel: 'Verifier les criteres', shape: 'diamond' },
          { id: 'ship', label: 'Livrer', sublabel: 'Deployer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'vision', to: 'spec' },
          { from: 'spec', to: 'execute' },
          { from: 'execute', to: 'review' },
          { from: 'review', to: 'ship', label: 'pass' },
          { from: 'review', to: 'spec', label: 'iterer', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['vision', 'spec'],
          highlightEdges: [{ from: 'vision', to: 'spec' }],
          explanation: 'Vous commencez avec une idee de produit et la traduisez en spec structuree avec les cinq sections. C\'est l\'etape la plus importante — tout en aval depend de la qualite de la spec.',
        },
        {
          highlightNodes: ['spec', 'execute'],
          highlightEdges: [{ from: 'spec', to: 'execute' }],
          explanation: 'Remettez la spec a Claude Code. L\'agent la lit (depuis CLAUDE.md ou un prompt) et construit le produit. Votre spec contraint ce qu\'il construit et comment.',
        },
        {
          highlightNodes: ['execute', 'review'],
          highlightEdges: [{ from: 'execute', to: 'review' }],
          explanation: 'Revisez la sortie par rapport a vos criteres d\'acceptation. Est-ce que ca correspond a la spec ? Y a-t-il des ajouts inattendus ou des fonctionnalites manquantes ?',
        },
        {
          highlightNodes: ['review', 'spec'],
          highlightEdges: [{ from: 'review', to: 'spec' }],
          explanation: 'Si quelque chose cloche, iterez : mettez a jour la spec ou donnez un prompt de suivi cible. Prevoyez 2-3 tours. Les specs parfaites n\'existent pas.',
        },
        {
          highlightNodes: ['review', 'ship'],
          highlightEdges: [{ from: 'review', to: 'ship' }],
          explanation: 'Quand la sortie passe tous les criteres, livrez. Deployez en production. La spec, le code et la documentation CLAUDE.md voyagent ensemble.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Flux de travail cartographié !',
    },

    // === ITERATION ===
    {
      type: 'multiple-choice',
      question: 'L\'agent construit votre gestionnaire de favoris. La recherche fonctionne, mais utilise du filtrage cote client au lieu de la recherche SQL cote serveur que vous vouliez. Combien de tours d\'iteration devriez-vous prevoir en travaillant avec des specs ?',
      options: [
        'Zero — une spec bien ecrite devrait produire une sortie parfaite du premier coup',
        'Un — si vous avez besoin de plus d\'une revision, votre spec etait trop vague',
        'Deux a trois tours — les bonnes specs reduisent les iterations, mais les specs parfaites n\'existent pas',
        'Cinq ou plus — les agents ont toujours besoin de corrections lourdes',
      ],
      correctIndex: 2,
      explanation: 'Prevoyez 2-3 tours d\'iteration. Le cycle est : observer ce que l\'agent a construit, identifier l\'ecart entre la sortie et l\'intention, mettre a jour la spec (ou donner un suivi cible), et laisser l\'agent reviser. Les bonnes specs reduisent les tours mais ne peuvent pas les eliminer entierement.',
    },
    {
      type: 'compare',
      title: 'Suivi cible vs reecriture de spec',
      body: 'Quand quelque chose cloche dans la sortie, vous avez deux strategies de correction. Le bon choix depend de ce qui doit changer.',
      question: 'L\'agent a utilise du filtrage cote client au lieu d\'une recherche cote serveur. Quelle correction est appropriee ?',
      correctSide: 'left',
      left: {
        label: 'Suivi cible',
        content: '« La recherche devrait etre cote\nserveur avec SQL LIKE, pas du\nfiltrage cote client. Mettez a\njour la page de favoris pour\ninterroger la base directement. »\n\n✓ La correction est dans les limites existantes\n✓ Correction rapide et chirurgicale\n✓ Pas de changement de spec necessaire',
        language: 'text',
      },
      right: {
        label: 'Reecriture de spec',
        content: '« En fait, je veux que ce soit une\nextension Chrome au lieu d\'une app\nweb. Reecrivez la spec avec de\nnouvelles contraintes et limites. »\n\n✓ Necessaire quand les limites changent\n✓ Changement fondamental de direction\n✗ Excessif pour les petites corrections',
        language: 'text',
      },
      explanation: 'Un suivi cible est le bon choix car la correction est dans les limites existantes — vous voulez toujours une app web, juste avec une implementation de recherche differente. Une reecriture de spec n\'est necessaire que quand les limites elles-memes changent (ex. : passer d\'une app web a une extension Chrome).',
    },

    // === INTERACTIVE EXERCISES ===
    {
      type: 'order',
      instruction: 'Ordonnez les étapes de rédaction d\'une spec du début à la fin :',
      items: [
        'Définir les critères d\'acceptation (conditions testables)',
        'Écrire l\'objectif (une phrase, ce qui existe une fois terminé)',
        'Lister ce qui est hors périmètre',
        'Définir les contraintes (stack techno, style)',
        'Définir les limites techniques (fichiers, APIs, packages)',
      ],
      correctOrder: [1, 3, 0, 4, 2],
    },
    {
      type: 'multiple-choice',
      question: 'Vous donnez une spec à l\'agent et il construit une fonctionnalité que vous avez explicitement listée dans « Hors périmètre ». Qu\'est-ce qui a mal tourné ?',
      options: [
        'L\'agent est cassé et ignore les instructions',
        'La section Hors périmètre était probablement trop vague ou enfouie — rendez-la plus visible',
        'Vous auriez dû utiliser CLAUDE.md au lieu d\'un prompt direct',
        'Les sections Hors périmètre ne fonctionnent pas vraiment avec les agents IA',
      ],
      correctIndex: 1,
      explanation: 'Les agents ont un biais vers l\'aide et la complétude. Si un élément Hors périmètre est vague ou facile à manquer, l\'agent pourrait le construire quand même. Rendez les exclusions explicites, visibles et sans ambiguïté. Répétez les exclusions critiques dans les contraintes si nécessaire.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette section Hors périmètre pour le gestionnaire de favoris. Réfléchis à ce qu\'un agent enthousiaste pourrait ajouter que tu ne veux explicitement PAS.',
      language: 'markdown',
      filename: 'SPEC.md',
      template: '## Out of Scope\n- {{scope_1}}\n- Bookmark import/export\n- {{scope_2}}\n- Favicon fetching\n- {{scope_3}}',
      blanks: [
        { id: 'scope_1', answer: 'User authentication', alternatives: ['Authentication', 'User auth', 'Auth', 'Multi-tenancy', 'User authentication / multi-tenancy'], placeholder: 'quelle fonctionnalité de connexion ?', hint: 'La spec dit utilisateur unique, local' },
        { id: 'scope_2', answer: 'Browser extension', alternatives: ['Chrome extension', 'browser extension', 'Extension'], placeholder: 'quelle fonctionnalité navigateur ?', hint: 'Une façon courante de sauvegarder des favoris' },
        { id: 'scope_3', answer: 'Deployment configuration', alternatives: ['Deployment', 'Deploy config', 'Deployment config', 'CI/CD', 'Docker'], placeholder: 'quelle infrastructure ?', hint: 'La spec se concentre sur le développement local' },
      ],
      explanation: 'Chaque exclusion empêche une forme spécifique de dérive de périmètre. Un agent enthousiaste pourrait raisonnablement ajouter n\'importe laquelle de ces fonctionnalités « utiles » sans qu\'on lui dise de ne pas le faire.',
    },
    {
      type: 'code-input',
      instruction: 'Écrivez un critère d\'acceptation pour un gestionnaire de favoris : l\'utilisateur devrait pouvoir chercher des favoris par titre. Écrivez-le comme un élément de checkbox commençant par « [ ] ».',
      placeholder: '[ ] User can...',
      answer: '[ ] User can search bookmarks by title',
      hint: 'Commencez par « [ ] User can » et décrivez le champ de recherche',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'Chaque ambiguite dans votre spec devient une decision que l\'agent prend sans vous. Lequel des suivants decrit le mieux l\'« etat d\'esprit de la spec » ?',
      options: [
        'Ecrivez des specs aussi detaillees que possible — couvrez chaque nom de variable et signature de fonction',
        'Gardez les specs minimales — l\'agent sait mieux et prendra de bonnes decisions',
        'Verrouillez les decisions qui comptent (architecture, limites) et laissez les decisions bon marche a l\'agent',
        'Ecrivez la spec une fois et n\'iterez jamais — les revisions signifient que la spec originale etait mauvaise',
      ],
      correctIndex: 2,
      explanation: 'L\'etat d\'esprit de la spec est de savoir quelles decisions sont couteuses a changer plus tard (architecture, stack techno, perimetre) et de les verrouiller. Les decisions bon marche (nommage, details de style) peuvent etre laissees a l\'agent en toute securite. Le retour : une spec bien ecrite vous permet de construire en heures ce qui prenait des jours.',
    },
    {
      type: 'checklist',
      title: 'Liste de vérification pour la rédaction de specs :',
      items: [
        'Je peux articuler la différence entre un PRD et une spec d\'agent',
        'Je connais les cinq sections d\'une bonne spec',
        'Je peux convertir une idée de produit en spec structurée',
        'Je reconnais les trois anti-patterns (trop vague, trop prescriptif, limites manquantes)',
        'Je sais quand itérer la spec vs donner un suivi ciblé',
        'Je peux livrer une spec via CLAUDE.md ou prompt direct',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Rédaction de specs maîtrisée ! Vous êtes prêt à diriger des agents à l\'échelle produit.',
    },
  ],
}

export default content
