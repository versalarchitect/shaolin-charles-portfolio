import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-1',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Votre codebase est la carte de l\'agent',
      body: "Vous n'écrivez plus du code pour que des humains le maintiennent. Vous concevez une codebase que des flottes d'agents vont naviguer, modifier et étendre — souvent en parallèle. La décision architecturale la plus impactante que vous pouvez prendre est celle-ci : un agent peut-il TROUVER ce qu'il cherche en moins de trois recherches ? Si oui, votre structure fonctionne. Si non, chaque tâche coûte des tokens supplémentaires, du temps supplémentaire et un risque accru que l'agent modifie le mauvais fichier. Cette leçon vous apprend à évaluer et concevoir des structures de répertoires comme des systèmes de navigation.",
    },
    {
      type: 'info',
      title: 'Pourquoi la navigabilité compte plus que l\'élégance',
      body: "Les développeurs humains construisent des modèles mentaux au fil des mois. Ils savent où se trouvent les choses parce qu'ils les ont mises là. Les agents repartent à zéro chaque session. Ils n'ont aucun souvenir de l'organisation de votre codebase à moins que vous ne le leur disiez — ou que l'organisation soit auto-documentée. Une architecture joliment abstraite qui nécessite des connaissances tribales pour naviguer est PIRE pour les agents qu'une structure plate et évidente. La métrique n'est pas « est-ce que ça paraît propre » — c'est « à quelle vitesse un agent frais peut-il trouver le bon fichier à modifier. »",
    },

    // === THE AUDIT FRAMEWORK ===
    {
      type: 'info',
      title: 'L\'audit en 3 recherches',
      body: "Voici comment tester la navigabilité. Choisissez n'importe quelle fonctionnalité dans votre codebase. Demandez-vous : si un agent doit modifier cette fonctionnalité, combien de recherches (grep, find, listing de fichiers) faut-il pour localiser TOUS les fichiers pertinents ? Comptez les recherches. Si c'est 1-2 : excellent. La structure guide l'agent directement. Si c'est 3 : acceptable. Une recherche pour trouver le domaine, une pour trouver le fichier, une pour confirmer les dépendances. Si c'est 4+ : votre structure travaille contre l'agent. Chaque recherche supplémentaire, c'est des tokens gaspillés, un risque accru que l'agent se perde, et un potentiel de modification du mauvais fichier.",
    },
    {
      type: 'diagram',
      title: 'Bonne structure vs mauvaise structure',
      body: 'Un agent qui cherche la fonctionnalité « paiements ». Chemin de gauche : trouvé en 2 étapes. Chemin de droite : encore en train de deviner après 5.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'start', label: 'Agent : « modifier paiements »', shape: 'pill', highlight: true },
          { id: 'good1', label: 'src/features/payments/', sublabel: 'Emplacement évident', shape: 'rounded' },
          { id: 'good2', label: 'Trouvé : handler, schema, test', sublabel: '2 recherches au total', shape: 'rounded', highlight: true },
          { id: 'bad1', label: 'src/utils/helpers.ts?', sublabel: 'Peut-être ici...', shape: 'rect' },
          { id: 'bad2', label: 'src/shared/services/?', sublabel: 'Ou ici...', shape: 'rect' },
          { id: 'bad3', label: 'lib/core/payment-utils?', sublabel: 'Cherche encore...', shape: 'rect' },
          { id: 'bad4', label: 'src/modules/billing/?', sublabel: '5 recherches, toujours perdu', shape: 'rect' },
        ],
        edges: [
          { from: 'start', to: 'good1', label: 'par fonctionnalité' },
          { from: 'good1', to: 'good2' },
          { from: 'start', to: 'bad1', label: 'dispersé' },
          { from: 'bad1', to: 'bad2', dashed: true },
          { from: 'bad2', to: 'bad3', dashed: true },
          { from: 'bad3', to: 'bad4', dashed: true },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Cadre d\'audit compris !',
    },

    // === GOOD PATTERNS ===
    {
      type: 'info',
      title: 'Patron 1 : Modules par fonctionnalité',
      body: "Regroupez par domaine, pas par couche technique. Au lieu de src/controllers/, src/services/, src/models/ (où la logique de paiement est dispersée dans 3 répertoires), utilisez src/features/payments/ contenant tout ce qui touche aux paiements : le handler, le schéma, la validation, les tests. Un agent qui cherche « payments » trouve un seul répertoire avec tout ce qu'il faut. C'est la décision structurelle ayant le plus grand impact sur la navigabilité pour les agents.",
    },
    {
      type: 'code-demo',
      title: 'Structure par fonctionnalité',
      body: 'Tout ce qui concerne un domaine vit ensemble. Un agent trouve TOUS les fichiers pertinents en un seul listing de répertoire.',
      language: 'text',
      filename: 'directory-structure',
      code: "src/\n├── features/\n│   ├── payments/\n│   │   ├── payments.handler.ts      # Route handler\n│   │   ├── payments.schema.ts       # Validation schema\n│   │   ├── payments.service.ts      # Business logic\n│   │   ├── payments.test.ts         # Tests\n│   │   └── index.ts                 # Public API\n│   ├── users/\n│   │   ├── users.handler.ts\n│   │   ├── users.schema.ts\n│   │   ├── users.service.ts\n│   │   ├── users.test.ts\n│   │   └── index.ts\n│   └── orders/\n│       ├── orders.handler.ts\n│       ├── orders.schema.ts\n│       ├── orders.service.ts\n│       ├── orders.test.ts\n│       └── index.ts\n├── shared/\n│   ├── database.ts                  # DB connection only\n│   └── auth-middleware.ts           # Auth only\n└── app.ts                           # Wiring",
    },
    {
      type: 'info',
      title: 'Patron 2 : Conventions de nommage cohérentes',
      body: "Si votre handler de paiements s'appelle payments.handler.ts, votre handler d'utilisateurs DOIT s'appeler users.handler.ts — pas userController.ts, pas handle-users.ts, pas UsersAPI.ts. La cohérence permet à l'agent de PRÉDIRE les noms de fichiers sans chercher. Dès qu'il apprend le patron d'une fonctionnalité, il peut naviguer vers n'importe quelle fonctionnalité instantanément. Un nommage incohérent force une recherche pour chaque fichier. Ça se compose : 10 fonctionnalités avec un nommage incohérent, c'est des dizaines de recherches supplémentaires par session.",
    },
    {
      type: 'info',
      title: 'Patron 3 : Tests colocalisés',
      body: "Les tests vivent à côté du code qu'ils testent. Pas dans un arbre __tests__/ séparé qui reflète src/. Quand un agent modifie payments.service.ts, il doit mettre à jour payments.test.ts. Si le test est dans le même répertoire, il le trouve immédiatement. Si les tests sont dans un arbre de répertoires parallèle (__tests__/features/payments/payments.service.test.ts), l'agent doit chercher, et il pourrait trouver le mauvais fichier de test ou manquer des tests d'intégration connexes.",
    },
    {
      type: 'compare',
      title: 'Structure en couches vs par fonctionnalité',
      body: 'L\'organisation en couches disperse les fichiers liés dans tout l\'arbre. La colocalisation par fonctionnalité met tout ce dont un agent a besoin au même endroit.',
      left: {
        label: 'Par couche (Emmêlé)',
        content: 'src/\n  controllers/\n    paymentController.ts\n    userController.ts\n    orderController.ts\n  services/\n    paymentService.ts\n    userService.ts\n    orderService.ts\n  models/\n    Payment.ts\n    User.ts\n    Order.ts\n  validators/\n    paymentValidator.ts\n    userValidator.ts\n    orderValidator.ts\n  hooks/\n    usePayment.ts\n    useUser.ts\n    useOrder.ts\n  utils/\n    formatCurrency.ts\n    formatDate.ts\n    helpers.ts',
        language: 'text',
        filename: 'layer-based.txt',
      },
      right: {
        label: 'Par fonctionnalité (Colocalisé)',
        content: 'src/features/\n  payments/\n    payments.handler.ts\n    payments.service.ts\n    payments.schema.ts\n    payments.test.ts\n    index.ts\n  users/\n    users.handler.ts\n    users.service.ts\n    users.schema.ts\n    users.test.ts\n    index.ts\n  orders/\n    orders.handler.ts\n    orders.service.ts\n    orders.schema.ts\n    orders.test.ts\n    index.ts\nsrc/shared/\n  database.ts\n  auth-middleware.ts',
        language: 'text',
        filename: 'feature-based.txt',
      },
      question: 'Quelle structure permet à un agent de trouver TOUS les fichiers liés aux paiements en un seul listing de répertoire ?',
      correctSide: 'right',
      explanation: 'Dans la structure par fonctionnalité, un agent qui cherche « payments » trouve un seul répertoire avec tous les fichiers pertinents. Dans la structure par couche, la logique de paiement est dispersée dans controllers/, services/, models/, validators/, hooks/ et utils/ — nécessitant 6+ recherches pour tout localiser.',
    },
    {
      type: 'code-diff',
      title: 'Avant/après : des couches aux fonctionnalités',
      body: 'Refactoring d\'une structure par couches vers une structure par fonctionnalité. Voyez comment les fichiers dispersés convergent en un seul endroit.',
      language: 'text',
      filename: 'directory-structure',
      before: 'src/\n├── controllers/\n│   ├── paymentController.ts\n│   ├── userController.ts\n│   └── orderController.ts\n├── services/\n│   ├── paymentService.ts\n│   ├── userService.ts\n│   └── orderService.ts\n├── models/\n│   ├── Payment.ts\n│   ├── User.ts\n│   └── Order.ts\n├── validators/\n│   ├── paymentValidator.ts\n│   └── orderValidator.ts\n├── __tests__/\n│   ├── payment.test.ts\n│   └── order.test.ts\n└── utils/\n    ├── formatCurrency.ts\n    └── helpers.ts',
      after: 'src/\n├── features/\n│   ├── payments/\n│   │   ├── payments.handler.ts\n│   │   ├── payments.service.ts\n│   │   ├── payments.schema.ts\n│   │   ├── payments.test.ts\n│   │   └── index.ts\n│   ├── users/\n│   │   ├── users.handler.ts\n│   │   ├── users.service.ts\n│   │   ├── users.test.ts\n│   │   └── index.ts\n│   └── orders/\n│       ├── orders.handler.ts\n│       ├── orders.service.ts\n│       ├── orders.schema.ts\n│       ├── orders.test.ts\n│       └── index.ts\n├── shared/\n│   ├── database.ts\n│   └── auth-middleware.ts\n└── app.ts',
      question: 'Dans combien de répertoires un agent doit-il chercher dans la structure AVANT pour trouver tous les fichiers de paiement ?',
      explanation: 'Dans la structure AVANT, les fichiers de paiement sont dispersés dans controllers/, services/, models/, validators/, __tests__/ et utils/ — au moins 5 répertoires. Dans la structure APRÈS, tout est dans features/payments/ — un seul répertoire, une seule recherche.',
    },
    {
      type: 'multiple-choice',
      question: 'Un agent doit ajouter une nouvelle règle de validation à la fonctionnalité « orders ». Quelle structure lui permet de trouver TOUS les fichiers pertinents en un seul listing de répertoire ?',
      options: [
        'src/validators/orders.ts + src/handlers/orders.ts + tests/validators/orders.test.ts',
        'src/features/orders/ contenant orders.handler.ts, orders.schema.ts, orders.test.ts',
        'src/modules/validation/orders/ + src/modules/handlers/orders/',
        'lib/orders.ts contenant toute la logique orders dans un seul fichier',
      ],
      correctIndex: 1,
      explanation: 'La colocalisation par fonctionnalité signifie qu\'un seul listing de répertoire révèle tous les fichiers pertinents. L\'agent n\'a pas besoin de chercher dans plusieurs répertoires ni de deviner où se trouve le fichier de test.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Bons patrons assimilés !',
    },

    // === BAD PATTERNS ===
    {
      type: 'info',
      title: 'Anti-patron 1 : Le dépotoir « shared »',
      body: "Un répertoire shared/ ou utils/ ou helpers/ qui grandit à 50+ fichiers. Au début, il contenait du code véritablement partagé — la connexion à la base de données, un formateur de dates. Au fil du temps, les développeurs y déposent tout ce qu'ils ne savent pas catégoriser. Maintenant l'agent cherche la validation de paiement et la trouve dans shared/validators/payment-validator.ts à côté de 30 autres validateurs sans rapport. Le nom de répertoire « shared » ne communique aucune information sur son contenu. Il force une recherche complète de son contenu à chaque fois.",
    },
    {
      type: 'code-demo',
      title: 'Le dépotoir shared/',
      body: 'Quand « shared » signifie « je ne savais pas où mettre ça. » Chaque fichier ici nécessite une recherche pour le découvrir.',
      language: 'text',
      filename: 'anti-pattern-shared',
      code: "src/shared/\n├── validators/\n│   ├── payment-validator.ts     # Why not in features/payments?\n│   ├── user-validator.ts        # Why not in features/users?\n│   ├── order-validator.ts       # Why not in features/orders?\n│   ├── email-validator.ts       # Actually shared\n│   └── string-helpers.ts        # Not even a validator\n├── services/\n│   ├── email-service.ts         # Legitimately shared\n│   ├── payment-processor.ts     # Should be in features/payments\n│   ├── user-lookup.ts           # Should be in features/users\n│   └── cache.ts                 # Legitimately shared\n├── utils/\n│   ├── format-date.ts\n│   ├── format-currency.ts\n│   ├── handle-errors.ts\n│   ├── parse-query.ts\n│   └── ... 40 more files\n└── types/\n    └── ... 25 type files",
    },
    {
      type: 'info',
      title: 'Anti-patron 2 : Imports circulaires',
      body: "Le Module A importe du Module B, qui importe du Module A. Ce n'est pas juste un code smell — c'est un cauchemar de navigation pour les agents. Quand un agent modifie le Module A, il doit comprendre que le Module B en dépend. Mais le Module B renvoie aussi vers le Module A, donc comprendre l'impact nécessite de tracer une boucle. Les agents gèrent bien les arbres. Ils gèrent mal les boucles. Les dépendances circulaires augmentent le risque que l'agent fasse un changement qui casse quelque chose qu'il ne peut pas voir.",
    },
    {
      type: 'info',
      title: 'Anti-patron 3 : Noms de fichiers ambigus',
      body: "manager.ts, handler.ts, service.ts, processor.ts, helper.ts — sans préfixe de domaine, ces noms ne communiquent rien. Un agent qui cherche « traitement de paiement » ne peut pas distinguer processor.ts (nom générique) de payments.service.ts (nom spécifique au domaine). Chaque nom ambigu est une recherche forcée. Nommez les fichiers pour ce qu'ils FONT dans le contexte du DOMAINE qu'ils servent : payments.handler.ts dit à la fois le domaine (payments) et le rôle (handler) instantanément.",
    },
    {
      type: 'multiple-choice',
      question: 'Votre répertoire shared/utils/ contient 47 fichiers. Un agent doit trouver le formateur de devises. Quel est l\'échec architectural ?',
      options: [
        'Le formateur de devises devrait être dans un package npm séparé',
        'Avoir 47 fichiers utilitaires signifie que le projet est trop gros',
        'Les utilitaires spécifiques au domaine devraient vivre dans leur module de fonctionnalité ; seuls les éléments véritablement transversaux appartiennent à shared/',
        'L\'agent devrait utiliser de meilleures requêtes de recherche pour le trouver',
      ],
      correctIndex: 2,
      explanation: 'L\'échec est de placer du code spécifique au domaine dans un répertoire fourre-tout. Si le formatage de devises n\'est utilisé que par la fonctionnalité de paiements, il appartient à features/payments/. Seules les choses utilisées par 3+ fonctionnalités sans rapport (comme un formateur de dates générique) justifient un emplacement partagé.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Anti-patrons identifiés !',
    },

    // === REFACTORING FOR NAVIGABILITY ===
    {
      type: 'info',
      title: 'Stratégie de refactoring : le chemin de migration',
      body: "Vous ne pouvez pas refactorer une grande codebase du jour au lendemain. La stratégie : (1) Identifiez les fonctionnalités les plus touchées — celles que les agents modifient le plus souvent. (2) Migrez celles-là en premier vers des modules par fonctionnalité. (3) Laissez le code rarement touché là où il est. (4) Mettez à jour CLAUDE.md pour documenter la nouvelle structure. Ce n'est pas une question de pureté. C'est réduire la friction de recherche pour les 20% de la codebase qui reçoivent 80% des modifications.",
    },
    {
      type: 'code-demo',
      title: 'Avant et après : fonctionnalité paiements',
      body: 'Refactoring de la structure par couche vers la structure par fonctionnalité. Tous les fichiers de paiement migrent dans un seul répertoire.',
      language: 'typescript',
      filename: 'migration-example.ts',
      code: "// BEFORE: Layer-based (agent needs 4 searches)\n// src/controllers/paymentController.ts\n// src/services/paymentService.ts\n// src/validators/paymentValidator.ts\n// src/models/Payment.ts\n// tests/services/paymentService.test.ts\n\n// AFTER: Feature-based (agent needs 1 search)\n// src/features/payments/payments.handler.ts\n// src/features/payments/payments.service.ts\n// src/features/payments/payments.schema.ts\n// src/features/payments/payments.model.ts\n// src/features/payments/payments.test.ts\n// src/features/payments/index.ts\n\n// The index.ts defines the public API:\nexport { createPayment, refundPayment } from './payments.service'\nexport { PaymentSchema } from './payments.schema'\nexport type { Payment } from './payments.model'",
    },
    {
      type: 'info',
      title: 'Le contrat index.ts',
      body: "Chaque module de fonctionnalité expose exactement une API publique via son index.ts. Les autres modules importent depuis la fonctionnalité — jamais depuis les fichiers internes. Ça veut dire qu'un agent qui travaille sur la fonctionnalité orders et qui a besoin de quelque chose de payments importe depuis features/payments (l'index), pas depuis features/payments/payments.service.ts (un fichier interne). Ça crée des frontières claires : l'agent sait ce qui est public et ce qui est interne. Si ce n'est pas dans index.ts, ce n'est pas censé être utilisé de l'extérieur.",
    },
    {
      type: 'order',
      instruction: 'Ordonnez les étapes de refactoring pour migrer vers une structure par fonctionnalité :',
      items: [
        'Déplacer le code spécifique au domaine de shared/ dans le module de fonctionnalité',
        'Identifier les fonctionnalités les plus modifiées (les plus touchées par les agents)',
        'Mettre à jour CLAUDE.md pour documenter la nouvelle structure et les conventions',
        'Créer le répertoire de fonctionnalité avec la nouvelle convention de nommage',
        'Mettre à jour les imports dans toute la codebase pour utiliser l\'index.ts de la fonctionnalité',
      ],
      correctOrder: [1, 3, 0, 4, 2],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Stratégie de refactoring maîtrisée !',
    },

    // === PRACTICAL EVALUATION ===
    {
      type: 'info',
      title: 'Exécuter l\'audit de navigabilité',
      body: "Voici comment noter votre propre codebase. Choisissez 5 tâches récentes d'agents — fonctionnalités ajoutées, bugs corrigés, refactors effectués. Pour chaque tâche, comptez combien de recherches de fichiers l'agent a eu besoin pour trouver tous les fichiers pertinents. Faites la moyenne de ces nombres. Sous 2,5 en moyenne : excellente navigabilité. 2,5-4,0 en moyenne : acceptable mais avec des points de friction. Au-dessus de 4,0 : votre structure lutte activement contre les agents. Concentrez-vous sur les pires cas — ce sont vos cibles de refactoring les plus rentables.",
    },
    {
      type: 'multiple-choice',
      question: 'Votre audit de navigabilité montre : paiements (2 recherches), utilisateurs (2 recherches), notifications (6 recherches), commandes (3 recherches), auth (7 recherches). Par où refactorer en premier ?',
      options: [
        'Commencer par paiements puisque c\'est déjà bon — le rendre encore meilleur',
        'Refactorer auth (7 recherches) et notifications (6 recherches) — les pires délinquants',
        'Refactorer les 5 en même temps pour la cohérence',
        'Se concentrer sur commandes (3 recherches) puisque c\'est proche du seuil',
      ],
      correctIndex: 1,
      explanation: 'Ciblez les pires délinquants en premier — ils ont les comptes de recherche les plus élevés, ce qui veut dire que les agents perdent le plus de temps à les naviguer. Auth (7) et notifications (6) offrent la plus grande amélioration par effort de refactoring. Paiements est déjà correct. Tout faire en même temps est risqué et inutile.',
    },
    {
      type: 'code-demo',
      title: 'Structure auto-documentée pour les agents',
      body: 'Une structure de projet complète conçue pour la navigabilité des agents. Remarquez : aucune ambiguïté sur l\'emplacement de quoi que ce soit.',
      language: 'text',
      filename: 'ideal-structure',
      code: "project-root/\n├── CLAUDE.md                        # Agent coordination protocol\n├── src/\n│   ├── features/                    # Domain logic (one dir per feature)\n│   │   ├── payments/\n│   │   │   ├── payments.handler.ts\n│   │   │   ├── payments.service.ts\n│   │   │   ├── payments.schema.ts\n│   │   │   ├── payments.test.ts\n│   │   │   └── index.ts\n│   │   ├── users/\n│   │   ├── orders/\n│   │   └── notifications/\n│   ├── infrastructure/              # Cross-cutting (DB, cache, queue)\n│   │   ├── database.ts\n│   │   ├── cache.ts\n│   │   └── queue.ts\n│   ├── middleware/                  # HTTP middleware (auth, logging)\n│   │   ├── auth.ts\n│   │   └── logging.ts\n│   └── app.ts                       # Composition root\n├── scripts/                         # Operational scripts\n│   ├── migrate.ts\n│   └── seed.ts\n└── package.json",
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'Le principe de navigabilité',
      body: "Architecturer pour la navigabilité des agents ne consiste pas à suivre un patron unique de façon dogmatique. C'est suivre un seul principe : réduire le nombre de recherches qu'un agent a besoin pour trouver et modifier du code connexe. Les modules par fonctionnalité y parviennent par la colocalisation. Le nommage cohérent y parvient par la prédictibilité. Les API publiques claires y parviennent en éliminant l'ambiguïté entre ce qui est interne et externe. Chaque décision structurelle devrait être évaluée à travers ce prisme : est-ce que ça rend plus facile ou plus difficile pour un agent frais de trouver ce dont il a besoin ?",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification de navigabilité de la codebase :',
      items: [
        'Je peux exécuter l\'audit en 3 recherches sur n\'importe quelle fonctionnalité de ma codebase',
        'Je comprends pourquoi le regroupement par fonctionnalité bat le regroupement par couche pour les agents',
        'Je peux identifier les dépotoirs shared/ et planifier leur décomposition',
        'J\'utilise des conventions de nommage cohérentes dans toutes les fonctionnalités',
        'Je colocalise les tests avec le code qu\'ils testent',
        'Je définis des API publiques claires via index.ts pour chaque module de fonctionnalité',
        'Je sais quelles fonctionnalités de ma codebase ont les pires scores de navigabilité',
      ],
    },
    {
      type: 'checkpoint',
      xp: 18,
      message: 'Architecture de codebase pour la navigabilité des agents maîtrisée ! Votre structure de répertoires est maintenant une carte adaptée aux agents.',
    },
  ],
}

export default content
