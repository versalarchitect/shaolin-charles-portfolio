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
      type: 'compare',
      title: 'Symptome : contredire les decisions anterieures',
      body: 'L\'agent fait des choix en debut de session, puis fait les choix opposes plus tard. Ce n\'est pas de l\'indecision — c\'est une perte de memoire.',
      question: 'Quel cote montre l\'epuisement de contexte ?',
      correctSide: 'right',
      left: {
        label: 'Debut de session (etape 3)',
        content: "// L'agent met en place un store Zustand\nimport { create } from 'zustand'\n\nconst useAuthStore = create((set) => ({\n  user: null,\n  setUser: (user) => set({ user }),\n}))\n\n// Utilise Tailwind pour l'espacement\n<div className=\"p-6 mt-4 gap-3\">",
        language: 'typescript',
      },
      right: {
        label: 'Fin de session (etape 15)',
        content: "// L'agent cree un React Context pour le MEME etat\nconst AuthContext = createContext(null)\n\nfunction AuthProvider({ children }) {\n  const [user, setUser] = useState(null)\n  // ...\n}\n\n// Maintenant utilise des styles inline\n<div style={{ padding: 24, marginTop: 16 }}>",
        language: 'typescript',
      },
      explanation: 'L\'agent a mis en place Zustand et Tailwind au debut, puis est passe a React Context et styles inline plus tard. Il n\'a pas change d\'avis — il a perdu l\'acces a ces decisions anterieures. Cette contradiction est le signal le plus clair d\'epuisement de contexte.',
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent demande "quelle base de donnees utilisez-vous ?" alors qu\'il a deja configure Drizzle avec SQLite il y a une heure. Qu\'est-ce que cela indique ?',
      options: [
        'L\'agent veut confirmer votre choix avant de continuer',
        'L\'agent suggere que vous pourriez vouloir changer de base de donnees',
        'Epuisement de contexte — la conversation de configuration anterieure a ete compactee',
        'L\'agent teste votre connaissance du projet',
      ],
      correctIndex: 2,
      explanation: 'Quand l\'agent re-pose des questions dont les reponses existent plus tot dans la conversation, le contexte anterieur a ete compacte. Combine avec la baisse de qualite du code (types stricts devenant des casts `any`, gestion d\'erreurs manquante), ce sont les trois symptomes cles : contradictions, questions repetees, et declin de qualite.',
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
      type: 'multiple-choice',
      question: 'Quand devez-vous etablir vos decisions architecturales les plus importantes dans une session agent ?',
      options: [
        'Au milieu de la session quand l\'agent s\'est echauffe',
        'A la toute fin pour qu\'elles soient les plus fraiches dans le contexte',
        'Dans les premiers 20% de la session quand le contexte est le plus complet et detaille',
        'Peu importe — l\'agent se souvient de tout de maniere egale',
      ],
      correctIndex: 2,
      explanation: 'Placez les decisions critiques en premier. Le schema de BD, le design d\'API et les patterns de gestion d\'erreurs etablis dans les premiers 20% de la session ont la meilleure chance de survivre a la compaction du contexte. L\'agent construit son modele mental a partir du contexte initial — assurez-vous que ce modele contient vos patterns prioritaires avant que la fenetre se remplisse.',
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
      type: 'multiple-choice',
      question: 'Pourquoi devriez-vous decouper une construction en blocs a travers des sessions fraiches au lieu d\'une session marathon ?',
      options: [
        'Les agents travaillent plus vite dans des sessions courtes',
        'Ca reduit vos couts d\'API',
        'Le code sur le disque devient la source de verite — l\'historique de conversation est compacte mais le code commite persiste',
        'L\'agent refuse de travailler sur de longues sessions',
      ],
      correctIndex: 2,
      explanation: 'Chaque bloc produit du code fonctionnel et commite. Quand vous commencez une session fraiche, l\'agent lit votre codebase et CLAUDE.md — pas la conversation compactee. Le code sur le disque est toujours la source de verite authoritative, immune aux limites de la fenetre de contexte.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez ce plan de session avec les bons criteres de completion pour chaque bloc :',
      language: 'markdown',
      filename: 'session-plan.md',
      template: '# Plan de Construction : Generateur de Factures\n\n## Bloc 1 (session fraiche)\n- Config projet : Next.js + Drizzle + SQLite\n- Definir schema : invoices, line_items, clients\n- Commit quand : `{{chunk1_done}}` fonctionne + seed tourne\n\n## Bloc 2 (session fraiche)\n- API CRUD pour factures (tous les endpoints)\n- Pattern erreur : { success, data, error }\n- Commit quand : tous les endpoints testes via {{chunk2_tool}}\n\n## Bloc 3 (session fraiche)\n- Generation PDF facture + email via {{email_service}}\n- Commit quand : PDF rend correctement + email envoye\n\n## Bloc 4 (session fraiche)\n- Frontend : liste factures, formulaire creation, vue detail\n- Commit quand : flux complet fonctionne dans le {{chunk4_where}}',
      blanks: [
        { id: 'chunk1_done', answer: 'bun run db:push', alternatives: ['npm run db:push', 'npx drizzle-kit push'], placeholder: 'quelle commande ?', hint: 'La commande qui applique le schema a la base de donnees' },
        { id: 'chunk2_tool', answer: 'curl', alternatives: ['Postman', 'httpie', 'insomnia'], placeholder: 'outil de test ?', hint: 'Client HTTP en ligne de commande' },
        { id: 'email_service', answer: 'Resend', alternatives: ['resend', 'SendGrid', 'sendgrid'], placeholder: 'quel service ?', hint: 'Service d\'API email moderne' },
        { id: 'chunk4_where', answer: 'navigateur', alternatives: ['browser', 'Browser', 'Navigateur'], placeholder: 'ou ?', hint: 'Ou les utilisateurs finaux interagissent avec le frontend' },
      ],
      explanation: 'Chaque bloc a un critere de completion clair — un test verifiable qui prouve que le travail est fait. Ca empeche les blocs a moitie finis de deborder dans la session suivante et vous donne confiance que le code est solide avant de passer a la suite.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Patterns de structuration de tâches appris !',
    },

    // === WHEN TO START FRESH ===
    {
      type: 'multiple-choice',
      question: 'A quel moment devriez-vous definitivement commencer une session fraiche ?',
      options: [
        'Apres chaque 10 messages pour etre sur',
        'Seulement quand l\'agent vous dit explicitement que le contexte est plein',
        'Quand vous voyez des contradictions, une baisse de qualite, ou vous etes sur le point de changer de zone du codebase (surtout apres ~50 echanges)',
        'Jamais — des sessions plus longues sont toujours meilleures pour la continuite',
      ],
      correctIndex: 2,
      explanation: 'Repartez a neuf quand l\'agent contredit des decisions anterieures, que la qualite decline, que vous changez de zone du codebase, ou que la conversation depasse ~50 echanges. Le cout de repartir a neuf est faible (l\'agent lit CLAUDE.md au demarrage). Le cout de continuer dans un contexte epuise est eleve — du mauvais code qui a l\'air plausible.',
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
      type: 'multiple-choice',
      question: 'Pourquoi CLAUDE.md est-il le meilleur endroit pour les decisions architecturales ?',
      options: [
        'C\'est le seul fichier que l\'agent peut lire',
        'Il est lu au demarrage de session et n\'est jamais compacte — contrairement a l\'historique de conversation qui est avec pertes',
        'Il est automatiquement synchronise dans le cloud',
        'L\'agent le priorise par rapport a tous les autres fichiers de code',
      ],
      correctIndex: 1,
      explanation: 'CLAUDE.md est lu au debut de chaque session. Contrairement a l\'historique de conversation, il n\'est jamais compacte. Ca en fait l\'endroit parfait pour les decisions qui doivent survivre entre les sessions : choix de stack, patterns de code, conventions de structure de fichiers, regles de nommage. Tout ce que vous repetez a l\'agent appartient a CLAUDE.md.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez ce CLAUDE.md pour ancrer les decisions critiques entre les sessions :',
      language: 'markdown',
      filename: 'CLAUDE.md',
      template: '# Generateur de Factures\n\n## Decisions d\'Architecture (NE PAS DEVIER)\n- Toutes les reponses API : `{ success: boolean, data?: T, error?: string }`\n- Gestion erreurs : {{error_pattern}} dans chaque server action, jamais throw au client\n- Styling : {{styling_tool}} seulement — pas de CSS modules, pas de styles inline\n- Etat : {{state_lib}} pour l\'etat client, server actions pour les mutations\n- Fichiers : {{naming_convention}}, un composant par fichier',
      blanks: [
        { id: 'error_pattern', answer: 'try/catch', alternatives: ['try-catch', 'try catch'], placeholder: 'pattern d\'erreur ?', hint: 'Le mecanisme standard de gestion d\'erreurs JS' },
        { id: 'styling_tool', answer: 'Tailwind', alternatives: ['tailwind', 'TailwindCSS', 'Tailwind CSS'], placeholder: 'quel outil ?', hint: 'Framework CSS utility-first' },
        { id: 'state_lib', answer: 'Zustand', alternatives: ['zustand'], placeholder: 'quelle librairie ?', hint: 'Librairie legere de gestion d\'etat React' },
        { id: 'naming_convention', answer: 'kebab-case', alternatives: ['kebab case', 'kebab_case'], placeholder: 'style de nommage ?', hint: 'mots-separes-par-des-tirets' },
      ],
      explanation: 'Ces decisions dans CLAUDE.md servent de memoire persistante. Quand l\'agent demarre une nouvelle session, il lit ceci et connait immediatement les conventions du projet — pas besoin de re-expliquer, pas de risque de perte par compaction du contexte.',
    },
    {
      type: 'compare',
      title: 'Spec monolithique vs specs modulaires',
      body: 'Pour les projets plus gros, comment vous organisez les specs affecte la consommation de contexte.',
      question: 'Quelle approche utilise le contexte plus efficacement ?',
      correctSide: 'right',
      left: {
        label: 'Tout dans CLAUDE.md',
        content: '# CLAUDE.md (2000 lignes)\n\n## Flux de Paiement\n[500 lignes de spec paiement...]\n\n## Templates Email\n[400 lignes de spec email...]\n\n## Generation PDF\n[300 lignes de spec PDF...]\n\n## Flux Auth\n[400 lignes de spec auth...]\n\n// L\'agent lit TOUT ca au demarrage\n// Meme s\'il travaille sur une seule feature\n// Gaspille du contexte sur des specs non pertinentes',
        language: 'markdown',
      },
      right: {
        label: 'Fichiers spec modulaires',
        content: '# CLAUDE.md (50 lignes)\n\nAvant de travailler sur une feature, lis sa spec :\n- Paiement : `specs/payments.md`\n- Email : `specs/emails.md`\n- PDF : `specs/pdf.md`\n\n// L\'agent lit seulement CLAUDE.md au demarrage\n// Charge la spec specifique a la demande :\n// "Lis specs/payments.md avant de commencer"\n// Contexte utilise seulement pour la feature pertinente',
        language: 'markdown',
      },
      explanation: 'Les specs modulaires permettent a l\'agent de charger seulement ce dont il a besoin. Un CLAUDE.md de 2000 lignes gaspille du contexte a chaque session. Gardez CLAUDE.md court (decisions, conventions) et liez vers des fichiers de spec detailles que l\'agent lit a la demande pour des features specifiques.',
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
      type: 'multiple-choice',
      question: 'Que devriez-vous faire EN PREMIER au demarrage d\'une nouvelle session agent ?',
      options: [
        'Commencer a coder immediatement pour gagner du temps',
        'Demander a l\'agent de lire chaque fichier du projet',
        'Mettre a jour CLAUDE.md avec le travail complete de la derniere session, puis verifier la comprehension de l\'agent',
        'Supprimer l\'historique de conversation de la session precedente',
      ],
      correctIndex: 2,
      explanation: 'Avant de commencer : mettez a jour CLAUDE.md avec le travail complete. Au demarrage : verifiez le contexte de l\'agent en lui demandant de resumer sa comprehension. En cours de session : essayez des rappels cibles pour la derive. Si la derive persiste, commitez et repartez a neuf. En fin de session : commitez le code fonctionnel et mettez a jour CLAUDE.md avec les nouvelles decisions.',
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
