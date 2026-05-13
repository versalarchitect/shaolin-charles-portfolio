import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-5',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'La falaise invisible',
      body: "Chaque agent a une fenêtre de contexte — une quantité fixe de texte qu'il peut garder en mémoire de travail. Quand vous dirigez une longue session de construction, la fenêtre se remplit. Les décisions précoces, les contenus de fichiers et votre spec originale sont poussés dehors à mesure que nouveau code, erreurs et conversation s'accumulent. L'agent ne vous avertit pas. Il commence simplement à prendre des décisions qui contredisent ce qu'il avait décidé 30 minutes auparavant. La qualité du résultat se dégrade silencieusement. Reconnaître cette falaise avant de la frapper est la compétence la plus importante pour les longues sessions.",
    },
    {
      type: 'info',
      title: 'Comment les fenêtres de contexte fonctionnent vraiment',
      body: "Pensez au contexte comme un tampon de taille fixe. Chaque message que vous envoyez, chaque fichier que l'agent lit, chaque bloc de code qu'il génère — tout ça consomme des tokens. La fenêtre de contexte de Claude Code est grande mais finie. Quand elle se remplit, le système compacte les anciens messages — les résumant ou les supprimant. L'agent perd en fidélité sur les décisions précoces. Il fonctionne toujours, mais il travaille à partir d'un résumé avec pertes de ce qui s'est passé avant, pas de l'image complète.",
    },

    // === SYMPTOMS ===
    {
      type: 'info',
      title: 'Symptôme 1 : Contredire les décisions antérieures',
      body: "L'agent a mis en place un store Zustand à l'étape 3, puis à l'étape 15 crée un React Context pour le même état. Il a choisi des classes Tailwind pour l'espacement au début, puis commence à utiliser des styles inline. Ces contradictions sont le signal le plus clair d'épuisement de contexte — l'agent a perdu l'accès à son raisonnement antérieur.",
    },
    {
      type: 'info',
      title: 'Symptôme 2 : Re-poser des questions déjà répondues',
      body: "L'agent demande « quelle base de données utilisez-vous ? » alors qu'il a déjà configuré Drizzle avec SQLite il y a une heure. Ou il propose une structure de fichiers que vous aviez déjà validée. Quand l'agent pose des questions dont les réponses existent plus tôt dans la conversation, le contexte antérieur a été compacté.",
    },
    {
      type: 'info',
      title: 'Symptôme 3 : Qualité de code en déclin',
      body: "La gestion des erreurs devient incohérente. Les types qui étaient stricts deviennent des casts `any` lâches. Les fonctions qui étaient bien documentées plus tôt n'ont plus de commentaires. L'agent n'est pas paresseux — il a perdu le contexte stylistique du début de la session où ces patterns avaient été établis.",
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a construit une API REST avec de bonnes réponses d\'erreur pour les 4 premiers endpoints, mais le 5e retourne des erreurs brutes au client. Que se passe-t-il probablement ?',
      options: [
        'L\'agent a décidé qu\'une stratégie d\'erreur différente était meilleure',
        'Le cinquième endpoint est intentionnellement différent',
        'Épuisement de contexte — l\'agent a perdu le pattern de gestion d\'erreurs du début',
        'L\'agent a manqué de tokens et est bref',
      ],
      correctIndex: 2,
      explanation: 'L\'incohérence dans des patterns qui étaient cohérents avant est la marque de l\'épuisement de contexte. L\'agent n\'a pas changé d\'avis — il a perdu l\'accès au pattern qu\'il avait établi. C\'est pourquoi vous voyez la qualité se dégrader vers la fin des longues sessions.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Symptômes d\'épuisement de contexte reconnus !',
    },

    // === STRUCTURING TASKS ===
    {
      type: 'info',
      title: 'Stratégie : placer les décisions critiques en premier',
      body: "Mettez vos décisions architecturales les plus importantes au début de la session quand le contexte est frais. Ne gardez pas les choses difficiles pour plus tard. Si votre schéma de base de données, votre design d'API et vos patterns de gestion d'erreurs sont établis dans les premiers 20% de la session, ils ont la meilleure chance de survivre à la compaction. L'agent construit un modèle mental à partir du contexte initial — assurez-vous que ce modèle contient vos patterns de plus haute priorité.",
    },
    {
      type: 'interactive-diagram',
      title: 'Décroissance du Contexte Durant une Session',
      body: 'Les décisions précoces sont compactées en premier. Structurez votre session pour que les patterns les plus critiques soient renforcés, pas juste énoncés une fois.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'start', label: 'Début de Session', sublabel: 'Contexte complet', shape: 'pill', highlight: true },
          { id: 'arch', label: 'Architecture', sublabel: 'Schéma, patterns, types', shape: 'rounded' },
          { id: 'impl', label: 'Implémentation', sublabel: 'Fonctionnalités construites', shape: 'rect' },
          { id: 'mid', label: 'Mi-Session', sublabel: 'Contexte compactant', shape: 'diamond' },
          { id: 'late', label: 'Fin de Session', sublabel: 'Contexte initial perdu', shape: 'rect' },
          { id: 'degrade', label: 'Qualité Baisse', sublabel: 'Contradictions apparaissent', shape: 'pill' },
        ],
        edges: [
          { from: 'start', to: 'arch' },
          { from: 'arch', to: 'impl' },
          { from: 'impl', to: 'mid' },
          { from: 'mid', to: 'late', label: 'compaction' },
          { from: 'late', to: 'degrade', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['start', 'arch'],
          highlightEdges: [{ from: 'start', to: 'arch' }],
          explanation: 'La session commence avec le contexte complet. Les décisions d\'architecture — schéma, patterns, types — sont établies avec une fidélité maximale.',
        },
        {
          highlightNodes: ['arch', 'impl'],
          highlightEdges: [{ from: 'arch', to: 'impl' }],
          explanation: 'Les fonctionnalités sont construites en utilisant les patterns établis. Le contexte se remplit mais l\'agent a encore accès à toutes les décisions antérieures.',
        },
        {
          highlightNodes: ['mid'],
          highlightEdges: [{ from: 'impl', to: 'mid' }],
          explanation: 'La fenêtre de contexte est pleine. Le système commence à compacter — résumant ou supprimant les anciens messages. Les décisions architecturales initiales perdent en détail.',
        },
        {
          highlightNodes: ['late'],
          highlightEdges: [{ from: 'mid', to: 'late' }],
          explanation: 'Le contexte initial est perdu. L\'agent travaille à partir d\'un résumé avec pertes. Il peut ne plus se souvenir du pattern de gestion d\'erreurs ou de la convention de style du début.',
        },
        {
          highlightNodes: ['degrade'],
          highlightEdges: [{ from: 'late', to: 'degrade' }],
          explanation: 'La qualité baisse visiblement. L\'agent contredit des décisions antérieures, re-pose des questions déjà répondues, et produit du code incohérent. Il est temps de démarrer une session fraîche.',
        },
      ],
    },
    {
      type: 'info',
      title: 'Stratégie : travailler par blocs ciblés',
      body: "Au lieu d'une session marathon, divisez la construction en blocs logiques : « Mettre en place la couche base de données », « Construire les endpoints API », « Brancher le frontend ». Chaque bloc devrait être complétable dans une fenêtre de contexte confortable. Quand un bloc est terminé, commitez le travail, puis repartez à neuf pour le bloc suivant. Le code sur le disque devient la source de vérité, pas l'historique de conversation.",
    },
    {
      type: 'code-demo',
      title: 'Découper une session de construction',
      body: 'Planifiez vos prompts comme des unités discrètes et complétables. Chaque bloc devrait produire du code fonctionnel et commité.',
      language: 'markdown',
      filename: 'session-plan.md',
      code: "# Build Plan: Invoice Generator\n\n## Chunk 1 (fresh session)\n- Set up project: Next.js + Drizzle + SQLite\n- Define schema: invoices, line_items, clients\n- Seed with test data\n- Commit when: `bun run db:push` works + seed runs\n\n## Chunk 2 (fresh session)\n- CRUD API for invoices (all endpoints)\n- Error handling pattern: { success, data, error }\n- Commit when: all endpoints tested via curl\n\n## Chunk 3 (fresh session)\n- Invoice PDF generation\n- Email sending via Resend\n- Commit when: PDF renders correctly + email sends\n\n## Chunk 4 (fresh session)\n- Frontend: invoice list, create form, detail view\n- Commit when: full flow works in browser",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Patterns de structuration de tâches appris !',
    },

    // === WHEN TO START FRESH ===
    {
      type: 'info',
      title: 'Quand repartir à neuf vs continuer',
      body: "Repartez à neuf quand : (1) l'agent contredit des décisions antérieures, (2) vous remarquez une baisse de qualité, (3) vous êtes sur le point de changer de zone dans le codebase, (4) la conversation a dépassé environ 50 échanges. Continuez quand : l'agent est en pleine tâche et produit un résultat cohérent, vous itérez sur un seul fichier ou fonction, la session est encore jeune. Le coût de repartir à neuf est faible — l'agent lit votre CLAUDE.md et les fichiers du codebase au démarrage. Le coût de continuer dans un contexte épuisé est élevé — du mauvais code qui a l'air plausible.",
    },
    {
      type: 'terminal',
      instruction: 'Vérifiez votre utilisation du contexte dans Claude Code avec la commande /compact. Ça force une compaction manuelle et vous montre combien de contexte a été consommé.',
      expectedCommand: '/compact',
      hint: 'Tapez /compact pour déclencher une compaction manuelle du contexte',
    },
    {
      type: 'multiple-choice',
      question: 'Vous êtes à 40 messages dans une session. L\'agent vient de construire un composant utilisant des CSS modules, mais votre projet utilise Tailwind (comme indiqué dans CLAUDE.md). Que devriez-vous faire ?',
      options: [
        'Dire à l\'agent de refactorer vers Tailwind et continuer la session',
        'Commencer une nouvelle session — l\'agent a perdu votre contexte de style',
        'Ajouter un rappel sur Tailwind et continuer',
        'B ou C — mais vérifiez d\'abord si d\'autres patterns dérivent aussi',
      ],
      correctIndex: 3,
      explanation: 'Une seule contradiction pourrait être un accident. Mais si l\'agent a aussi dérivé sur d\'autres patterns (gestion d\'erreurs, structure de fichiers, nommage), le contexte est épuisé et une nouvelle session est préférable. Si c\'est une erreur isolée, un rappel pourrait suffire. Vérifiez toujours les signaux de dérive multiples avant de décider.',
    },

    // === CLAUDE.MD AS PERSISTENT CONTEXT ===
    {
      type: 'info',
      title: 'CLAUDE.md : votre mémoire persistante',
      body: "CLAUDE.md est lu au début de chaque session. Contrairement à l'historique de conversation, il n'est jamais compacté. Ça en fait l'endroit parfait pour les décisions qui doivent survivre entre les sessions : choix de stack technique, patterns de code, conventions de structure de fichiers, règles de nommage. Tout ce que vous vous retrouvez à répéter à l'agent appartient à CLAUDE.md. Voyez-le comme du contexte persistant de session qui transcende les conversations individuelles.",
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md comme ancre de contexte',
      body: 'Les patterns et décisions clés vont ici pour que l\'agent ne les perde jamais, quelle que soit la longueur de la session.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Invoice Generator\n\n## Architecture Decisions (DO NOT DEVIATE)\n- All API responses: `{ success: boolean, data?: T, error?: string }`\n- Error handling: try/catch in every server action, never throw to client\n- Styling: Tailwind only — no CSS modules, no inline styles\n- State: Zustand for client state, server actions for mutations\n- Files: kebab-case, one component per file\n\n## Completed\n- [x] Database schema + migrations\n- [x] CRUD API with proper error responses\n- [ ] PDF generation\n- [ ] Frontend views\n\n## Current Conventions\n- Toast notifications via sonner (already installed)\n- Form validation via zod schemas in `src/schemas/`\n- All dates stored as ISO strings, displayed via date-fns",
    },
    {
      type: 'info',
      title: 'Fichiers spec comme suppléments de contexte',
      body: "Pour les projets plus gros, CLAUDE.md lie à des fichiers de spec. Vous pouvez dire à l'agent : « Lis SPEC.md avant de commencer. » Ces fichiers sont lus à la demande — ils consomment du contexte mais fournissent à l'agent des spécifications complètes quand nécessaire. Gardez les specs modulaires : un fichier par zone de fonctionnalité. L'agent lit seulement ce dont il a besoin pour la tâche en cours.",
    },
    {
      type: 'code-demo',
      title: 'Référencer des specs depuis CLAUDE.md',
      body: 'Liez vers des specs détaillées pour que l\'agent puisse les charger à la demande sans gonfler chaque session.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Project Specs\n\nBefore working on a feature, read the relevant spec:\n- Payment flow: `specs/payments.md`\n- Email templates: `specs/emails.md`\n- PDF generation: `specs/pdf.md`\n\nAlways check the spec before making architectural decisions\nin that feature area.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Contexte persistant maîtrisé !',
    },

    // === EXERCICES INTERACTIFS ===
    {
      type: 'compare',
      title: 'Planification de session : chaos vs contrôle',
      body: 'Comment vous planifiez votre session détermine si l\'agent maintient la qualité tout au long.',
      question: 'Quel plan de session garde l\'agent efficace plus longtemps ?',
      correctSide: 'right',
      left: {
        label: 'Sans plan',
        content: 'TODO:\n- Build auth\n- Build database\n- Build API\n- Build frontend\n- Build tests\n- Fix bugs\n- Deploy\n- Write docs\n- Add monitoring\n- Optimize performance',
        language: 'text',
      },
      right: {
        label: 'Plan découpé',
        content: 'Session 1: Database + Auth\n  Done when: migrations run, login works\n  Then: update CLAUDE.md with decisions\n\nSession 2: API routes\n  Done when: all endpoints return correct data\n  Then: update CLAUDE.md with API patterns\n\nSession 3: Frontend\n  Done when: pages render with real data\n\nSession 4: Tests + Deploy\n  Done when: CI passes, live URL works',
        language: 'text',
      },
      explanation: 'Les plans découpés donnent à chaque session un périmètre clair et des critères de complétion. La mise à jour de CLAUDE.md entre les sessions préserve les décisions pour que la session suivante démarre informée.',
    },
    {
      type: 'match',
      instruction: 'Associez chaque symptôme d\'épuisement de contexte à sa cause sous-jacente :',
      leftItems: ['L\'agent contredit des décisions antérieures', 'L\'agent re-pose des questions déjà répondues', 'La qualité du code décline en milieu de session', 'L\'agent ignore les conventions du projet'],
      rightItems: ['Les instructions antérieures ont été compressées hors du contexte', 'Vos réponses ont été perdues pendant la compaction du contexte', 'L\'attention est trop dispersée sur les tokens restants', 'Les conventions de CLAUDE.md ont été supprimées de la mémoire active'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Les quatre symptômes remontent aux limites de la fenêtre de contexte. La solution est la même : terminer la session, mettre à jour CLAUDE.md avec les décisions, et démarrer une session fraîche avec un contexte propre.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez cette section CLAUDE.md pour préserver les décisions entre les sessions :',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '## Architecture Decisions\n\n- Rendering: {{rendering}} components by default\n- Data fetching: use {{fetching}} (not API routes)\n- Auth: {{auth_provider}} with email/password\n- Database: {{database}} with row-level security\n\n## Completed\n- [x] Database schema and migrations\n- [x] Auth flow (login, signup, logout)\n- [ ] API routes\n- [ ] Frontend pages',
      blanks: [
        { id: 'rendering', answer: 'Server', alternatives: ['server', 'RSC', 'React Server'], placeholder: 'type de composant ?', hint: 'Next.js utilise ce mode de rendu par défaut' },
        { id: 'fetching', answer: 'server actions', alternatives: ['Server Actions', 'server action'], placeholder: 'quel pattern ?', hint: 'Le pattern de mutation intégré de Next.js' },
        { id: 'auth_provider', answer: 'Supabase Auth', alternatives: ['supabase auth', 'Supabase'], placeholder: 'quel fournisseur ?', hint: 'Le service d\'authentification dans la stack du projet' },
        { id: 'database', answer: 'Supabase', alternatives: ['PostgreSQL', 'Postgres', 'supabase'], placeholder: 'quelle base de données ?', hint: 'Service Postgres managé' },
      ],
      explanation: 'Cette section CLAUDE.md sert de mémoire persistante. Quand vous démarrez une nouvelle session, l\'agent lit ceci et reprend là où la dernière session s\'est arrêtée — pas besoin de tout ré-expliquer.',
    },

    // === PRACTICAL WORKFLOW ===
    {
      type: 'info',
      title: 'Le flux d\'hygiène de session',
      body: "Avant de commencer : mettez à jour CLAUDE.md avec le travail complété de la dernière session. Au démarrage : vérifiez que l'agent a le bon contexte en lui demandant de résumer sa compréhension. En cours de session : si vous remarquez de la dérive, essayez d'abord un rappel ciblé. Si la dérive persiste sur plusieurs patterns, commitez ce qui fonctionne, puis repartez à neuf. En fin de session : commitez tout le code fonctionnel, mettez à jour CLAUDE.md avec les nouvelles décisions prises, notez ce qui reste à faire.",
    },
    {
      type: 'order',
      instruction: 'Ordonnez le flux de gestion de contexte du début à la fin de session :',
      items: [
        'Commiter le code fonctionnel et mettre à jour CLAUDE.md',
        'Vérifier la compréhension de l\'agent en lui demandant de résumer la tâche',
        'Mettre à jour CLAUDE.md avec le travail complété de la dernière session',
        'Surveiller les signaux de dérive de contexte pendant la construction',
        'Repartir à neuf si plusieurs patterns dérivent',
      ],
      correctOrder: [2, 1, 3, 4, 0],
    },
    {
      type: 'terminal',
      instruction: 'Après avoir complété un bloc de travail, commitez-le pour que la prochaine session puisse démarrer proprement. Le code sur le disque est toujours autoritaire.',
      expectedCommand: 'git add -A && git commit -m "feat: complete invoice CRUD API"',
      hint: 'Stagez et commitez votre bloc de travail complété',
    },
    {
      type: 'checklist',
      title: 'Habitudes de gestion de contexte :',
      items: [
        'Je place les décisions architecturales critiques en début de session',
        'Je découpe les constructions en blocs qui tiennent confortablement dans une session',
        'Je garde CLAUDE.md à jour avec les décisions qui doivent persister',
        'Je reconnais les trois symptômes d\'épuisement de contexte',
        'Je commite le code fonctionnel avant de repartir à neuf',
        'J\'utilise des fichiers spec pour les exigences détaillées de fonctionnalités',
      ],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Gestion de contexte maîtrisée ! Vous pouvez maintenant mener de longues sessions sans dégradation de qualité.',
    },
  ],
}

export default content
