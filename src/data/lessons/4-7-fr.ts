import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Quand outrepasser les conseils confiants mais erronés de l\'IA',
      body: "Tu demandes à cinq agents d'évaluer une décision d'architecture. Les cinq sont d'accord : migrer vers des microservices. Leur raisonnement est solide, leur confiance est élevée, et ils citent les meilleures pratiques de l'industrie. Mais tu sais quelque chose qu'ils ignorent — ton équipe, c'est trois personnes, ton pipeline de déploiement ne peut pas gérer 12 services, et tes patrons de trafic rendent un monolithe modulaire dix fois plus simple. Cette leçon porte sur la compétence la plus difficile en développement assisté par agents : savoir quand chaque agent dans la salle a tort, et avoir la conviction de les outrepasser.",
    },
    {
      type: 'info',
      title: 'Pourquoi le consensus de l\'IA échoue',
      body: "Les agents sont entraînés sur Internet. Internet surreprésente certains patrons : les microservices pour la mise à l'échelle, GraphQL pour les API, l'événementiel pour le découplage. Ce sont de vraies solutions — à des problèmes précis. Mais les agents les généralisent en conseils universels. Quand cinq agents sont d'accord, ça veut souvent dire qu'ils puisent tous dans la même distribution d'entraînement biaisée, pas qu'ils ont raisonné indépendamment vers la même conclusion. Le consensus entre agents n'est pas la même chose que le consensus entre experts diversifiés avec des contextes différents.",
    },

    // === FAILURE MODES ===
    {
      type: 'multiple-choice',
      question: 'Un agent recommande une stratégie de cache pour ton système. Il ne sait pas que ton SLA est de 50 ms, que ta base de données tourne sur un serveur de 2015 avec 4 Go de RAM, et que ton équipe de conformité refuse tout ce qui touche aux données personnelles. Quelle catégorie de défaillance cela représente-t-il ?',
      options: [
        'Problème nouveau — personne n\'a écrit sur ce scénario',
        'Cas limite de ton domaine — l\'agent manque de contexte critique sur tes contraintes spécifiques',
        'Contrainte organisationnelle — l\'agent ne peut pas déduire les réalités politiques',
        'Biais d\'entraînement — l\'agent puise dans des données biaisées',
      ],
      correctIndex: 1,
      explanation: "Les agents échouent dans trois catégories. Premièrement : les problèmes nouveaux où personne n'a écrit sur ton ensemble de contraintes spécifiques. Deuxièmement : les cas limites de ton domaine — l'agent ne connaît pas ton SLA, les specs de ton serveur ou tes règles de conformité. Troisièmement : les contraintes organisationnelles comme les compétences de l'équipe, les budgets de migration et les réalités politiques. Ce scénario est un cas limite du domaine : la recommandation de l'agent ignore les limitations matérielles, les exigences de performance et les règles de conformité dont on ne lui a jamais parlé.",
    },
    {
      type: 'interactive-diagram',
      title: 'Flux de décision d\'outrepassement',
      body: 'Parcours chaque étape de l\'évaluation d\'une recommandation d\'agent. Clique pour voir comment la décision se déroule.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'recommend', label: 'L\'agent recommande', sublabel: 'Suggestion confiante', shape: 'rect' },
          { id: 'evidence', label: 'Évaluer les preuves', sublabel: 'Vérifier sources + raisonnement', shape: 'diamond' },
          { id: 'domain', label: 'Vérifier le savoir du domaine', sublabel: 'Ton contexte + expérience', shape: 'diamond', highlight: true },
          { id: 'override', label: 'Outrepasser', sublabel: 'Ton jugement l\'emporte', shape: 'pill', highlight: true },
          { id: 'accept', label: 'Accepter', sublabel: 'Procéder tel que conseillé', shape: 'pill' },
        ],
        edges: [
          { from: 'recommend', to: 'evidence' },
          { from: 'evidence', to: 'domain', label: 'preuves vérifiées' },
          { from: 'domain', to: 'override', label: 'tu as le contexte manquant' },
          { from: 'domain', to: 'accept', label: 'l\'agent a le tableau complet' },
        ],
      },
      stages: [
        {
          highlightNodes: ['recommend'],
          highlightEdges: [],
          explanation: 'L\'agent livre une recommandation avec haute confiance. Ça sonne autoritaire et cite les meilleures pratiques. Mais la confiance n\'est pas la même chose que la justesse.',
        },
        {
          highlightNodes: ['recommend', 'evidence'],
          highlightEdges: [{ from: 'recommend', to: 'evidence' }],
          explanation: 'Évalue les preuves. La recommandation est-elle basée sur une bonne pratique générale ou une analyse spécifique de TA codebase ? Les conseils généraux échouent à l\'échelle spécifique.',
        },
        {
          highlightNodes: ['evidence', 'domain'],
          highlightEdges: [{ from: 'evidence', to: 'domain' }],
          explanation: 'Vérifie contre ton savoir du domaine. L\'agent connaît-il la taille de ton équipe, tes exigences de SLA, tes contraintes de conformité et ton environnement de déploiement ? Ton expérience vécue est une donnée que le modèle n\'a pas.',
        },
        {
          highlightNodes: ['domain', 'override'],
          highlightEdges: [{ from: 'domain', to: 'override' }],
          explanation: 'Chemin d\'outrepassement : l\'agent manque de contexte critique. Ton équipe de 4 personnes, tes exigences de conformité ou tes contraintes de déploiement rendent la recommandation mauvaise pour TA situation.',
        },
        {
          highlightNodes: ['domain', 'accept'],
          highlightEdges: [{ from: 'domain', to: 'accept' }],
          explanation: 'Chemin d\'acceptation : après vérification, l\'agent a le tableau complet. Sa recommandation s\'aligne avec tes contraintes et ton savoir du domaine. Procède tel que conseillé et documente la décision.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Modes de défaillance identifiés!',
    },

    // === OVERRIDE CRITERIA ===
    {
      type: 'multiple-choice',
      question: 'Tu construis des critères d\'outrepassement. Un agent recommande des réplicas en lecture PostgreSQL mais ne sait pas que ton équipe ops, c\'est une seule personne. Laquelle des quatre questions d\'outrepassement échoue ici ?',
      options: [
        'Est-ce que la recommandation se base sur une analyse spécifique de ta codebase ?',
        'Est-ce que l\'agent a accès à la contrainte qui compte le plus ?',
        'As-tu déjà vu ce patron échouer dans des contextes similaires ?',
        'Quel est le coût de se tromper ?',
      ],
      correctIndex: 1,
      explanation: "Il te faut un cadre, pas des intuitions vagues. Pose-toi quatre questions. Un : est-ce que l'agent a accès à la contrainte qui compte le plus ? Si tu ne lui as pas parlé de ton équipe de 4 personnes ou de tes exigences de conformité, sa recommandation repose sur des données incomplètes — outrepasse. Deux : est-ce que la recommandation se base sur une bonne pratique générale ou une analyse spécifique ? Trois : as-tu déjà vu ce patron échouer ? Quatre : quel est le coût de se tromper — si c'est réversible, essaie la voie de l'agent ; si c'est irréversible, fie-toi à ton instinct. Ce scénario échoue à la question un : l'agent manque la contrainte critique (équipe ops d'une personne).",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce journal de décisions d\'outrepassement. Remplis les blancs pour documenter chaque outrepassement avec sa justification et son résultat — ça calibre ton jugement au fil du temps.',
      language: 'markdown',
      filename: 'OVERRIDE_LOG.md',
      template: '# Override Decision Log\n\n## 2026-04-28: Database choice\n- **Agent recommendation**: PostgreSQL with read replicas\n- **My override**: {{db_override}}\n- **Rationale**: Single-server deployment, <1000 concurrent users,\n  ops team is one person (me). Postgres overhead not justified.\n- **Outcome (30 days)**: {{db_outcome}}\n\n## 2026-04-15: API design\n- **Agent recommendation**: REST with OpenAPI spec\n- **My override**: {{api_override}}\n- **Rationale**: Full-stack TypeScript, no external consumers,\n  team already knows tRPC. OpenAPI overhead adds no value here.\n- **Outcome (30 days)**: Correct. Ship velocity 2x what REST would allow.',
      blanks: [
        { id: 'db_override', answer: 'SQLite with Litestream replication', alternatives: ['SQLite', 'sqlite', 'SQLite with Litestream', 'Litestream'], placeholder: 'ton choix de base de données ?', hint: 'Une base de données embarquée légère avec réplication en streaming' },
        { id: 'db_outcome', answer: 'Correct. Zero ops incidents. p99 latency 12ms.', alternatives: ['Correct', 'correct', 'Zero ops incidents', 'zero incidents'], placeholder: 'que s\'est-il passé après 30 jours ?', hint: 'L\'outrepassement a été validé — zéro problème opérationnel' },
        { id: 'api_override', answer: 'tRPC with end-to-end types', alternatives: ['tRPC', 'trpc', 'tRPC with types', 'end-to-end typed RPC'], placeholder: 'ton choix d\'API ?', hint: 'Un framework RPC TypeScript-first avec sécurité de types complète' },
      ],
      explanation: 'Consigner chaque décision d\'outrepassement et son résultat calibre ton jugement au fil du temps. Tu apprends quand tu avais raison d\'outrepasser (choix de base de données, design d\'API) et quand tu aurais dû écouter. Le journal crée une boucle de rétroaction qui rend tes futurs outrepassements plus précis.',
    },
    {
      type: 'multiple-choice',
      question: 'Les cinq agents recommandent GraphQL pour ton nouveau projet. Ton équipe n\'a jamais utilisé GraphQL, ton API a 4 endpoints, et tu livres dans 2 semaines. Que fais-tu ?',
      options: [
        'Fais confiance aux agents — cinq qui sont d\'accord, c\'est un signal fort',
        'Outrepasse — les agents manquent de contexte sur les compétences de l\'équipe, la simplicité de l\'API et l\'échéancier',
        'Demande à un sixième agent pour départager',
        'Utilise GraphQL mais génère le schéma avec un agent pour gagner du temps',
      ],
      correctIndex: 1,
      explanation: 'Les agents recommandent en se basant sur les meilleures pratiques générales (GraphQL s\'adapte bien, a un excellent outillage). Mais ils ne savent pas que ton équipe a zéro expérience avec GraphQL, que ton API est triviale, et que ton échéancier est immuable. Ces contraintes contextuelles l\'emportent sur les meilleures pratiques théoriques. Outrepasse et documente pourquoi.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Critères d\'outrepassement intégrés!',
    },

    // === THE PARADOX ===
    {
      type: 'compare',
      title: 'Le paradoxe de l\'outrepassement : quand faire confiance vs quand outrepasser',
      body: 'Les agents ont raison 90 % du temps sur l\'implémentation, tort 30-40 % sur l\'architecture. Ton travail, c\'est de savoir dans quelle catégorie tu te trouves.',
      left: {
        label: 'Faire confiance à l\'agent (Implémentation)',
        content: 'L\'agent a RAISON 90 % du temps sur :\n\n- Comment structurer un composant\n- Quelle API appeler\n- Comment écrire un test\n- Syntaxe et patrons\n- Usage spécifique aux bibliothèques\n\nPourquoi : c\'est bien documenté,\nlargement couvert dans les données\nd\'entraînement. L\'agent a vu des\nmilliers d\'exemples et peut faire\nde la correspondance de patrons\navec précision.\n\nTon rôle : accepter et avancer vite.',
        language: 'text',
        filename: 'confiance-agent.txt',
      },
      right: {
        label: 'Outrepasser l\'agent (Architecture)',
        content: 'L\'agent a TORT 30-40 % du temps sur :\n\n- Décisions d\'architecture\n- Choix technologiques pour TON contexte\n- Compromis équipe/échéancier/contraintes\n- Décisions construire vs acheter\n- Quand NE PAS construire quelque chose\n\nPourquoi : ça dépend d\'un contexte que\nl\'agent ne peut pas voir — taille de\nl\'équipe, SLA, conformité, budget,\nréalité politique. Les données\nd\'entraînement biaisent vers la\n« meilleure pratique », pas TA pratique.\n\nTon rôle : évaluer et outrepasser.',
        language: 'text',
        filename: 'outrepasser-agent.txt',
      },
      question: 'Quand devrais-tu pencher vers l\'outrepassement ?',
      correctSide: 'right',
      explanation: "Le paradoxe de l'outrepassement : tu as besoin que les agents soient utiles, mais tu dois savoir quand les ignorer. La réponse, c'est l'asymétrie. Fais confiance aux agents sur les détails d'implémentation. Outrepasse sur l'architecture, la stratégie, et tout ce qui nécessite du contexte sur ton équipe, tes échéanciers ou tes contraintes. La confiance de l'agent ne corrèle pas avec la justesse sur les problèmes nouveaux — utilise TA confiance, pas la leur, comme signal décisif.",
    },
    {
      type: 'multiple-choice',
      question: 'Tu as 8 ans d\'expérience en systèmes de paiement. Un agent recommande de stocker les tokens de carte d\'une manière que tu n\'as jamais vue. Quel est le bon réflexe ?',
      options: [
        'Fais confiance à l\'agent — il connaît peut-être un patron plus récent que tu n\'as pas rencontré',
        'Outrepasse immédiatement — ton expérience du domaine l\'emporte toujours',
        'Investigue la recommandation spécifique, mais penche fortement vers ton expérience vu le coût élevé d\'une erreur dans les paiements',
        'Demande à un autre agent de valider le premier',
      ],
      correctIndex: 2,
      explanation: 'Les paiements sont un domaine à forts enjeux et fortement réglementé. Tes 8 ans de connaissance du domaine sont un contexte critique. Mais tu devrais quand même évaluer la recommandation spécifique — peut-être que c\'EST un patron plus récent conforme à PCI. L\'essentiel, c\'est que ton expérience crée une barre haute que l\'agent doit franchir, pas que tu l\'ignores complètement.',
    },

    // === MATCH: SCÉNARIOS D'OUTREPASSEMENT ===
    {
      type: 'match',
      instruction: 'Associe chaque scénario d\'outrepassement à la bonne décision et son raisonnement :',
      leftItems: [
        'L\'agent choisit NoSQL pour des données relationnelles',
        'L\'agent suggère d\'ajouter du cache avant de profiler',
        'L\'agent recommande des microservices pour une petite équipe',
      ],
      rightItems: [
        'Outrepasser — les données relationnelles ont besoin de SQL',
        'Outrepasser — optimisation prématurée',
        'Outrepasser — les microservices ajoutent de la complexité pour les petites équipes',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2 },
      explanation: 'Chaque scénario représente un cas où l\'agent optimise pour une bonne pratique générale en ignorant des contraintes spécifiques. NoSQL pour des données relationnelles ignore les besoins de structure de données. Le cache avant le profilage, c\'est de l\'optimisation prématurée. Les microservices pour une équipe de 3 ajoutent de la surcharge de coordination qui tue la vélocité.',
    },

    // === PROMPT-LAB: OUTREPASSER UN MAUVAIS CONSEIL ===
    {
      type: 'prompt-lab',
      instruction: 'Écris un prompt outrepassant un agent qui recommande avec confiance MongoDB pour une app qui a clairement besoin de jointures relationnelles. L\'agent a tort — tes données sont hautement relationnelles (utilisateurs, commandes, produits avec des relations many-to-many). Repousse avec un raisonnement spécifique.',
      scenario: 'Tu construis une plateforme de commerce en ligne avec des utilisateurs, commandes, produits, catégories et avis — tous fortement interconnectés. Un agent recommande MongoDB parce que « ça s\'adapte mieux ». Tu sais que ces données sont profondément relationnelles et nécessiteront des jointures complexes pour les rapports, tableaux de bord et historiques de commandes. Outrepasse l\'agent avec une réponse claire et raisonnée.',
      starterPrompt: 'Ça marche, utilise MongoDB.',
      responses: [
        {
          triggerKeywords: ['PostgreSQL', 'relationnel', 'jointures', 'clé étrangère', 'SQL', 'normaliser', 'relations', 'relational', 'joins'],
          response: 'Compris. Passage à PostgreSQL. Tu as raison que le modèle de données est fondamentalement relationnel :\n\n- Les utilisateurs ont plusieurs commandes (1:N)\n- Les commandes ont plusieurs produits (M:N via order_items)\n- Les produits appartiennent à des catégories (M:N)\n- Les avis lient les utilisateurs aux produits (M:N)\n\nMongoDB nécessiterait de la dénormalisation et des jointures au niveau applicatif, ajoutant complexité et risque d\'incohérence. PostgreSQL gère ça nativement avec les opérations JOIN et les contraintes de clé étrangère.\n\nJe vais configurer PostgreSQL avec un schéma propre, des index sur les clés étrangères et un outillage de migration.',
          quality: 'excellent',
          feedback: 'Outrepassement parfait. Tu as identifié les relations de données spécifiques (1:N, M:N) qui rendent ça relationnel, expliqué pourquoi MongoDB aurait du mal (dénormalisation, jointures applicatives), et dirigé l\'agent vers la bonne technologie avec un raisonnement. C\'est exactement comment l\'expertise du domaine outrepasse le biais d\'entraînement.',
        },
        {
          triggerKeywords: ['pas MongoDB', 'tort', 'non', 'désaccord', 'différent', 'plutôt', 'not MongoDB', 'wrong', 'disagree'],
          response: 'Je comprends que tu préfères une base de données différente. Peux-tu partager plus sur ce que tu voudrais utiliser à la place et pourquoi ?',
          quality: 'good',
          feedback: 'Tu as repoussé, ce qui est le bon instinct. Mais tu dois être plus spécifique. Explique POURQUOI MongoDB est le mauvais choix pour ce cas d\'usage : les données sont relationnelles (utilisateurs, commandes, produits avec clés étrangères), tu as besoin d\'opérations JOIN pour les rapports, et la dénormalisation causerait des incohérences de données. Nomme l\'alternative (PostgreSQL) et les raisons spécifiques.',
        },
      ],
      fallbackResponse: {
        response: 'Parfait, je vais configurer MongoDB avec des collections pour les utilisateurs, commandes et produits. Je vais intégrer les articles de commande directement dans les documents de commande pour des lectures rapides.',
        feedback: 'Tu as accepté la recommandation de l\'agent sans repousser. Ce modèle de données est profondément relationnel — les utilisateurs ont des commandes, les commandes référencent des produits, les produits appartiennent à des catégories. MongoDB te forcerait à dénormaliser, dupliquer des données et implémenter les jointures dans le code applicatif. Outrepasse en spécifiant PostgreSQL et en expliquant la structure relationnelle : clés étrangères, opérations JOIN et exigences de cohérence des données.',
      },
    },
    {
      type: 'compare',
      title: 'Céder au consensus des agents vs appliquer l\'expertise du domaine',
      body: 'Quand tous les agents sont d\'accord sur MongoDB pour tes données clairement relationnelles, vois la différence entre céder et appliquer ton propre jugement.',
      left: {
        label: 'Céder au consensus des agents',
        content: 'Toi : "Quelle base de données utiliser ?"\n\nAgent 1 : MongoDB — s\'adapte horizontalement\nAgent 2 : MongoDB — schéma flexible\nAgent 3 : MongoDB — choix populaire\n\nToi : "OK, MongoDB alors."\n\nRésultat après 3 mois :\n- 47 pipelines d\'agrégation remplaçant des JOINs SQL\n- Duplication de données dans 6 collections\n- 3 bugs d\'incohérence de données en production\n- Les rapports prennent 8 secondes (vs 200ms avec SQL)\n- Migration vers PostgreSQL coûte 3 semaines',
        language: 'text',
        filename: 'ceder.txt',
      },
      right: {
        label: 'Appliquer l\'expertise du domaine',
        content: 'Toi : "Quelle base de données utiliser ?"\n\nAgent 1 : MongoDB — s\'adapte horizontalement\nAgent 2 : MongoDB — schéma flexible\nAgent 3 : MongoDB — choix populaire\n\nToi : "Outrepassé. Les données sont relationnelles :\n  utilisateurs -> commandes -> produits (JOINs).\n  Utilise PostgreSQL."\n\nRésultat après 3 mois :\n- Schéma normalisé propre, 12 tables\n- Contraintes de clé étrangère préviennent les mauvaises données\n- Zéro bug d\'incohérence de données\n- Les rapports tournent en 180ms avec des JOINs indexés\n- Les migrations de schéma sont simples',
        language: 'text',
        filename: 'expertise-domaine.txt',
      },
      question: 'Quelle approche mène à un meilleur résultat pour des données relationnelles ?',
      correctSide: 'right',
      explanation: 'Le consensus des agents avait tort parce que les trois agents puisaient dans le même biais d\'entraînement (MongoDB est fréquemment recommandé pour la « mise à l\'échelle »). Ton expertise du domaine — savoir que les utilisateurs, commandes et produits sont intrinsèquement relationnels — l\'emporte sur trois recommandations identiques. Le résultat à 3 mois le prouve : le chemin de l\'outrepassement a zéro bug d\'incohérence de données et des rapports rapides, tandis que céder crée 47 agrégations de contournement et 3 bugs en production.',
    },

    // === PRACTICAL SCENARIOS ===
    {
      type: 'multiple-choice',
      question: 'Ta flotte d\'agents recommande de refactoriser un module auth laid (callbacks, pas de tests). Mais ce code n\'a eu aucun bogue en 18 mois, gère 50K requêtes quotidiennes, et la conformité a approuvé cette implémentation exacte. Que fais-tu ?',
      options: [
        'Refactoriser — les métriques de qualité de code montrent clairement qu\'il faut améliorer',
        'Outrepasser — la stabilité et l\'approbation de conformité l\'emportent sur l\'esthétique du code quand il y a zéro bénéfice côté utilisateur',
        'Refactoriser mais garder l\'ancien code en sauvegarde',
        'Demander aux agents d\'ajouter des tests d\'abord, puis refactoriser',
      ],
      correctIndex: 1,
      explanation: "Les agents ne peuvent pas savoir que la stabilité et l'approbation de conformité ont plus de valeur que l'esthétique du code ici. Par chaque métrique objective, le code a besoin d'un refactoring — il est laid, utilise des callbacks, et n'a pas de tests. Mais ton savoir du domaine te dit : 18 mois de zéro bogues, 50K requêtes quotidiennes gérées de façon fiable, et la conformité a approuvé exactement cette implémentation. Refactoriser introduit du risque avec zéro bénéfice côté utilisateur. Outrepasse.",
    },
    {
      type: 'multiple-choice',
      question: 'Trois agents recommandent de casser ton monolithe en services. Ton monolithe se déploie en 30 secondes, a 95 % de couverture de tests, et ton équipe de deux livre des fonctionnalités chaque jour. Outrepasser ?',
      options: [
        'Non — les microservices sont objectivement une meilleure architecture',
        'Oui — les agents optimisent pour la scalabilité théorique, pas pour ta vélocité de déploiement réelle et la taille de ton équipe',
        'Partiellement — extrais un service comme test',
        'Redemande aux agents avec plus de contexte',
      ],
      correctIndex: 1,
      explanation: 'C\'est un scénario d\'outrepassement classique. Les agents recommandent les microservices parce que c\'est le patron dominant dans leurs données d\'entraînement pour « mettre à l\'échelle » des systèmes. Mais ton système n\'a pas de problème de mise à l\'échelle — il a un avantage de vélocité de livraison que les microservices détruiraient pour une équipe de deux.',
    },
    {
      type: 'multiple-choice',
      question: 'Tu choisis SQLite pour une app web en production. Chaque agent dit d\'utiliser PostgreSQL pour un meilleur passage à l\'échelle et la concurrence. Ton app sert 500 utilisateurs sur un VPS à 20 $/mois. SQLite en mode WAL gère 10x ta charge. Qui a raison ?',
      options: [
        'Les agents — PostgreSQL est objectivement meilleur pour la production',
        'Toi — la simplicité opérationnelle (zéro serveur de BD, zéro connection pooling, sauvegarde = copier un fichier) l\'emporte sur la scalabilité théorique dont tu n\'auras jamais besoin',
        'Compromis — utiliser PostgreSQL mais sur le même VPS',
        'Aucun — utiliser un service de base de données gérée à la place',
      ],
      correctIndex: 1,
      explanation: "Les agents optimisent pour le cas général. Toi, tu optimises pour TON cas. Ton app sert 500 utilisateurs, tourne sur un seul serveur, et SQLite en mode WAL gère 10x ta charge prévue. La simplicité opérationnelle de zéro serveur de base de données, zéro connection pooling et sauvegarde-par-copie-de-fichier vaut plus que la scalabilité théorique dont tu n'auras jamais besoin. C'est un outrepassement classique : les agents manquent de contexte sur tes contraintes spécifiques.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Jugement de scénario développé!',
    },

    // === DOCUMENTING OVERRIDES ===
    {
      type: 'multiple-choice',
      question: 'Dans six mois, un nouveau membre de l\'équipe voit ton choix SQLite et pense que c\'est une erreur. Sans documentation, que se passe-t-il ?',
      options: [
        'Rien — il va te demander',
        'Il le « corrige » en migrant vers PostgreSQL, introduisant exactement la complexité que tu as évitée',
        'Il l\'améliore en ajoutant du connection pooling',
        'Il écrit des tests pour le code SQLite',
      ],
      correctIndex: 1,
      explanation: "Les décisions d'outrepassement sont invisibles par défaut. Sans documentation, quelqu'un va « corriger » ton choix intentionnel — en introduisant exactement la complexité que tu as évitée. Chaque outrepassement a besoin de trois choses : ce qui était recommandé, pourquoi tu as outrepassé, et quel résultat tu attends. Puis reviens-y à 30, 60 et 90 jours. Ça crée une boucle de rétroaction qui calibre ton jugement au fil du temps.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cet Architecture Decision Record. Remplis les blancs pour la justification d\'outrepassement et les résultats attendus afin de rendre le raisonnement explicite et vérifiable.',
      language: 'markdown',
      filename: 'docs/adr/003-database-choice.md',
      template: '# ADR-003: SQLite for production database\n\n## Status: Accepted\n\n## Context\nWe need a database for user data (~500 users, ~10K records).\n\n## Agent Recommendation\nAll consulted agents recommended PostgreSQL.\n\n## Decision: Override — Use SQLite with WAL mode\n\n## Rationale for Override\n1. **Agents lack context**: {{context_gap}}\n2. **Agents optimize for scale we do not have**: {{scale_reality}}\n3. **Operational simplicity**: {{ops_benefit}}\n\n## Expected Outcome\n- {{expected_metric}}\n- Backup = copy one file to S3\n\n## Revisit: 2026-10-28 (6 months)',
      blanks: [
        { id: 'context_gap', answer: 'Single VPS, one-person ops team', alternatives: ['single server', 'one person ops', 'no container orchestration', 'single VPS, no orchestration'], placeholder: 'quel contexte manque aux agents ?', hint: 'Tes contraintes de déploiement et d\'équipe' },
        { id: 'scale_reality', answer: '500 users is well within SQLite capabilities', alternatives: ['500 users', 'well within SQLite limits', 'SQLite handles our scale', 'we only have 500 users'], placeholder: 'pourquoi l\'échelle n\'est pas un problème ?', hint: 'Ton nombre réel d\'utilisateurs vs la capacité de SQLite' },
        { id: 'ops_benefit', answer: 'No connection pooling, no separate backup system', alternatives: ['no connection pooling', 'zero operational overhead', 'no separate database server', 'no backup scripts needed'], placeholder: 'quelle complexité opérationnelle évites-tu ?', hint: 'Quelle infrastructure SQLite élimine-t-il ?' },
        { id: 'expected_metric', answer: 'Zero database-related ops incidents in 6 months', alternatives: ['zero ops incidents', 'no database incidents', 'zero incidents in 6 months', 'sub-10ms query times'], placeholder: 'quel résultat mesurable attends-tu ?', hint: 'Une métrique spécifique pour valider l\'outrepassement' },
      ],
      explanation: 'Les ADR avec une section « Outrepassement d\'agent » rendent ton raisonnement explicite et vérifiable. Ils protègent contre les futurs membres de l\'équipe qui « corrigeraient » ton choix intentionnel, et créent un registre pour calibrer ton jugement d\'outrepassement au fil du temps.',
    },
    {
      type: 'order',
      instruction: 'Ordonne les étapes d\'un bon processus de décision d\'outrepassement :',
      items: [
        'Revisiter à 30/60/90 jours pour calibrer',
        'Identifier le contexte qui manque à l\'agent',
        'Documenter ta justification et le résultat attendu',
        'Recevoir la recommandation de l\'agent avec haute confiance',
        'Évaluer le coût de se tromper (réversible vs irréversible)',
      ],
      correctOrder: [3, 1, 4, 2, 0],
    },

    // === CALIBRATION OVER TIME ===
    {
      type: 'multiple-choice',
      question: 'Après avoir consigné 25 décisions d\'outrepassement, tu constates que tu outrepasses correctement 85 % du temps sur l\'infrastructure, mais incorrectement 60 % du temps sur l\'architecture frontend. Que te disent ces données ?',
      options: [
        'Tu devrais arrêter d\'outrepasser complètement',
        'Tu devrais outrepasser plus souvent pour acquérir de l\'expérience',
        'Ton jugement est fort sur l\'infrastructure (continue d\'outrepasser) et faible sur le frontend (écoute davantage les agents dans ce domaine)',
        'Les agents sont meilleurs sur tout ce qui touche au frontend',
      ],
      correctIndex: 2,
      explanation: "Suis tes outrepassements. Après 20 à 30 décisions consignées, des patrons émergent. Les données te disent où ton jugement est fort (continue d'outrepasser) et où il est faible (écoute davantage les agents). Le but n'est pas d'outrepasser plus ou moins — c'est d'outrepasser avec précision. Ton journal d'outrepassement est ton instrument de calibration. La précision par domaine compte plus que la fréquence globale d'outrepassement.",
    },
    {
      type: 'multiple-choice',
      question: 'Ton journal d\'outrepassement montre que tu avais tort 4 fois sur 5 en outrepassant les recommandations d\'agents sur l\'architecture CSS. Que devrais-tu changer ?',
      options: [
        'Arrêter d\'outrepasser complètement — les agents en savent plus que toi',
        'Pour l\'architecture CSS spécifiquement, relever la barre pour outrepasser — tes instincts sont mal calibrés dans ce domaine',
        'Supprimer les entrées du journal où tu avais tort',
        'Demander à plus d\'agents pour augmenter la confiance avant d\'outrepasser',
      ],
      correctIndex: 1,
      explanation: 'Le journal révèle un problème de calibration spécifique à un domaine. Tu n\'as pas tort d\'outrepasser en général — juste dans ce domaine précis. La solution est de faire davantage confiance aux agents sur l\'architecture CSS tout en maintenant ton autorité d\'outrepassement dans les domaines où ton journal montre une bonne précision.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Cadre de calibration établi!',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'Quelle est la différence clé entre un « opérateur d\'agents » et un « architecte d\'agents » ?',
      options: [
        'Les opérateurs utilisent plus d\'agents que les architectes',
        'Les architectes écrivent de meilleurs prompts que les opérateurs',
        'Les opérateurs prennent ce que les agents leur donnent ; les architectes évaluent, filtrent et parfois rejettent basé sur un contexte durement acquis qu\'aucun modèle ne peut accéder',
        'Les architectes construisent leurs propres modèles d\'IA',
      ],
      correctIndex: 2,
      explanation: "Le jugement d'outrepassement est la méta-compétence qui sépare les opérateurs des architectes. Les opérateurs prennent ce que les agents leur donnent. Les architectes évaluent, filtrent et parfois rejettent — pas par ego, mais par un contexte qu'aucun modèle ne peut accéder. Ton expérience, ta connaissance de ton équipe, ta compréhension de tes contraintes — ce ne sont pas des bogues dans le processus. C'EST le processus. L'agent est un conseiller puissant. Toi, tu es le décideur.",
    },
    {
      type: 'checklist',
      title: 'Checklist du jugement d\'outrepassement :',
      items: [
        'Je sais identifier quand le consensus des agents provient d\'un biais d\'entraînement plutôt que d\'un raisonnement indépendant',
        'J\'applique le cadre des quatre questions avant d\'accepter ou de rejeter des recommandations',
        'Je documente chaque outrepassement avec la justification et les résultats attendus',
        'Je revisite les décisions d\'outrepassement pour calibrer mon jugement au fil du temps',
        'Je connais mes domaines forts et faibles grâce à mon journal d\'outrepassement',
        'Je comprends le paradoxe : les agents doivent être utiles ET je dois savoir quand les ignorer',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Jugement d\'outrepassement maîtrisé. Tu sais quand faire confiance et quand outrepasser — et tu peux le prouver.',
    },
  ],
}

export default content
