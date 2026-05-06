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
      type: 'info',
      title: 'Les cinq sections d\'une bonne spec',
      body: "Chaque spec efficace comporte cinq sections. Objectif : une phrase décrivant ce qui existe quand l'agent a terminé. Contraintes : choix technologiques, exigences de style, budgets de performance — les garde-fous. Critères d'acceptation : conditions spécifiques et testables prouvant que le travail est terminé. Limites techniques : ce que l'agent est autorisé à toucher (fichiers, packages, APIs) et ce qui est interdit. Hors périmètre : choses que l'agent pourrait raisonnablement supposer incluses mais qui sont explicitement exclues. Chaque section a un rôle différent pour garder l'agent sur la bonne voie.",
    },
    {
      type: 'diagram',
      title: 'Structure de la Spec',
      body: 'Les cinq sections forment un entonnoir allant de la vision large aux limites précises.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'goal', label: 'Objectif', sublabel: 'Ce qui existe une fois terminé', shape: 'rounded', highlight: true },
          { id: 'constraints', label: 'Contraintes', sublabel: 'Garde-fous techno et style', shape: 'rect' },
          { id: 'acceptance', label: 'Critères d\'acceptation', sublabel: 'Preuve testable de complétion', shape: 'rect' },
          { id: 'boundaries', label: 'Limites techniques', sublabel: 'Autorisé et interdit', shape: 'rect' },
          { id: 'oos', label: 'Hors périmètre', sublabel: 'Explicitement exclu', shape: 'pill' },
        ],
        edges: [
          { from: 'goal', to: 'constraints' },
          { from: 'constraints', to: 'acceptance' },
          { from: 'acceptance', to: 'boundaries' },
          { from: 'boundaries', to: 'oos' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Anatomie de la spec comprise !',
    },

    // === REAL EXAMPLE ===
    {
      type: 'info',
      title: 'Un vrai exemple : gestionnaire de favoris',
      body: "Parcourons un exemple concret. Vous avez une idée de produit : un gestionnaire de favoris avec des tags. Pas original, mais c'est justement le point — la valeur est dans comment vous le spécifiez pour l'exécution par un agent, pas dans l'idée elle-même. Observez comment chaque section contraint l'agent sans le micro-gérer.",
    },
    {
      type: 'code-demo',
      title: 'Spec du gestionnaire de favoris',
      body: 'Voici le markdown que vous mettriez dans un fichier CLAUDE.md ou passeriez directement à Claude Code. Remarquez : ça dit QUOI, pas COMMENT.',
      language: 'markdown',
      filename: 'SPEC.md',
      code: "# Bookmark Manager — Agent Spec\n\n## Goal\nA working web app where users can save, tag, search, and delete bookmarks.\n\n## Constraints\n- Next.js 15 with App Router\n- TypeScript strict mode\n- SQLite via Drizzle ORM (local file DB, no external services)\n- Tailwind CSS for styling\n- No authentication (single-user, local)\n\n## Acceptance Criteria\n- [ ] User can add a bookmark (URL + optional title)\n- [ ] User can assign multiple tags to a bookmark\n- [ ] User can filter bookmarks by tag\n- [ ] User can full-text search bookmarks by title/URL\n- [ ] User can delete a bookmark\n- [ ] All data persists across server restarts\n- [ ] App runs with `npm run dev` after `npm install`\n\n## Technical Boundaries\n- Create a new project from scratch (not modify existing)\n- Use `src/` directory structure\n- Keep all DB logic in `src/db/` directory\n- Use server actions for mutations (no API routes)\n\n## Out of Scope\n- User authentication / multi-tenancy\n- Bookmark import/export\n- Browser extension\n- Favicon fetching\n- Deployment configuration",
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
      type: 'info',
      title: 'Anti-pattern de spec : trop vague',
      body: "« Construis-moi un gestionnaire de favoris. Fais-le bien. Utilise de la techno moderne. » Ça ne dit presque rien à l'agent. C'est quoi « bien » ? C'est quoi « moderne » ? L'agent va prendre des dizaines de décisions que vous n'avez pas autorisées — choisir une base de données, une approche de style, des patterns de routing, inventer des fonctionnalités. Vous passerez plus de temps à corriger ces décisions que vous n'en avez économisé en étant bref. Le flou n'est pas de la délégation — c'est de l'abandon.",
    },
    {
      type: 'info',
      title: 'Anti-pattern de spec : trop prescriptif',
      body: "Le mode de défaillance opposé. « Crée un fichier à src/components/BookmarkCard.tsx. Il doit exporter un composant React qui prend les props { url: string, title: string, tags: string[] }. Utilise un div avec className 'card p-4 border rounded-lg'. À l'intérieur, rends une balise anchor... » Vous êtes en train d'écrire du code en français. Si vous savez exactement ce que chaque ligne devrait être, écrivez le code directement. Une spec devrait contraindre les décisions, pas les éliminer. Laissez l'agent utiliser son jugement à l'intérieur de vos limites.",
    },
    {
      type: 'info',
      title: 'Anti-pattern de spec : limites manquantes',
      body: "Une spec avec un objectif clair et des critères d'acceptation mais sans limites ni exclusions de périmètre. L'agent construit tout correctement — puis ajoute aussi l'authentification, une API REST, la config Docker, un pipeline CI/CD, et des scripts de déploiement. Il voulait être utile. Sans limites explicites, l'agent optimise pour la complétude. La section Hors périmètre n'est pas optionnelle — c'est votre défense contre le dépassement de périmètre d'un constructeur enthousiaste.",
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
      type: 'info',
      title: 'Comment l\'agent reçoit votre spec',
      body: "Il y a deux méthodes de livraison. Premièrement : mettre la spec dans CLAUDE.md à la racine du projet. L'agent lit ce fichier automatiquement au début de chaque session. Ça fonctionne mieux pour les projets en cours où la spec évolue avec le temps. Deuxièmement : coller la spec directement dans le prompt. Ça fonctionne pour les constructions en une fois où vous voulez que l'agent scaffolde à partir de zéro. Les deux sont valides — le choix dépend de si la spec est un document vivant ou une instruction ponctuelle.",
    },
    {
      type: 'code-demo',
      title: 'Spec via CLAUDE.md',
      body: 'Quand vous construisez un nouveau projet, vous commencez souvent avec la spec dans CLAUDE.md pour que l\'agent ait le contexte à chaque invocation.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Bookmark Manager\n\n## Spec\n[... your full spec here ...]\n\n## Development\n- Run: `npm run dev`\n- Test: `npm test`\n- Lint: `npm run lint`\n\n## Architecture Decisions\n(Agent fills this in as it builds)",
    },
    {
      type: 'code-demo',
      title: 'Spec via prompt direct',
      body: 'Pour les constructions en une fois, vous collez la spec directement. L\'agent l\'exécute en une seule session.',
      language: 'text',
      filename: 'prompt.txt',
      code: "Build this project from scratch according to the following spec:\n\n[paste your full spec]\n\nStart by creating the project structure, then implement\neach acceptance criterion one at a time. After each one,\nverify it works before moving to the next.",
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'diagram',
      title: 'De la vision produit au lancement',
      body: 'Le flux complet de l\'idée au produit déployé. La spec est le pont entre votre vision et l\'exécution par l\'agent.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'vision', label: 'Vision Produit', sublabel: 'Votre idée', shape: 'pill' },
          { id: 'spec', label: 'Écrire la Spec', sublabel: '5 sections', shape: 'rounded', highlight: true },
          { id: 'execute', label: 'L\'Agent Exécute', sublabel: 'Claude Code construit', shape: 'rect' },
          { id: 'review', label: 'Réviser le Résultat', sublabel: 'Vérifier les critères', shape: 'diamond' },
          { id: 'ship', label: 'Livrer', sublabel: 'Déployer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'vision', to: 'spec' },
          { from: 'spec', to: 'execute' },
          { from: 'execute', to: 'review' },
          { from: 'review', to: 'ship', label: 'pass' },
          { from: 'review', to: 'spec', label: 'itérer', dashed: true },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Flux de travail cartographié !',
    },

    // === ITERATION ===
    {
      type: 'info',
      title: 'Itérer après le premier résultat',
      body: "L'agent construit. Vous révisez. Quelque chose cloche — peut-être que la disposition de l'interface n'est pas ce que vous imaginiez, ou l'agent a choisi du filtrage côté client alors que vous vouliez une recherche côté serveur. C'est normal. Le cycle d'itération est : observer ce que l'agent a construit, identifier l'écart entre le résultat et l'intention, mettre à jour la spec (ou donner un prompt de suivi ciblé), et laisser l'agent réviser. Les bonnes specs réduisent les itérations. Les specs parfaites n'existent pas. Prévoyez 2-3 tours.",
    },
    {
      type: 'info',
      title: 'Suivis ciblés vs réécritures de spec',
      body: "Les petites corrections ne nécessitent pas une réécriture de spec. « La recherche devrait être côté serveur avec SQL LIKE, pas du filtrage côté client » est un suivi ciblé. Mais si vous réalisez que toute l'approche est fausse — vous vouliez une extension Chrome, pas une app web — ça nécessite une réécriture de spec. La règle : si la correction est dans les limites existantes, utilisez un prompt de suivi. Si ça change les limites elles-mêmes, réécrivez la spec.",
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
      type: 'code-input',
      instruction: 'Écrivez un critère d\'acceptation pour un gestionnaire de favoris : l\'utilisateur devrait pouvoir chercher des favoris par titre. Écrivez-le comme un élément de checkbox commençant par « [ ] ».',
      placeholder: '[ ] User can...',
      answer: '[ ] User can search bookmarks by title',
      hint: 'Commencez par « [ ] User can » et décrivez le champ de recherche',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'info',
      title: 'L\'état d\'esprit de la spec',
      body: "Écrire des specs est une nouvelle compétence qui semble maladroite au début. Vous êtes habitué à exprimer des idées à travers du code. Maintenant vous les exprimez à travers des contraintes et des critères. Le retour est énorme : une spec bien écrite vous permet de construire en heures ce qui prenait des jours. Mais la spec doit mériter cette vitesse en étant assez précise pour être exécutée. Chaque ambiguïté dans votre spec devient une décision que l'agent prend sans vous. Parfois c'est correct. Parfois c'est coûteux à corriger. Votre travail est de savoir quelles décisions comptent et de les verrouiller.",
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
