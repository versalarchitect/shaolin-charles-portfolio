import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-5',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Le Teardown : rétro-ingénierie pour la constructibilité par agents',
      body: "Prenez n'importe quel système en production — une plateforme de commerce en ligne, un produit SaaS, un outil interne. Maintenant posez une seule question : une flotte d'agents coordonnée pourrait-elle construire et maintenir ça ? Pas « est-ce qu'un agent pourrait écrire une partie du code » — mais est-ce que des agents pourraient en être propriétaires de bout en bout ? Construire de nouvelles fonctionnalités en parallèle. Corriger des bugs sans casser des modules non reliés. L'étendre sans connaissances tribales. La méthodologie Teardown vous donne une façon systématique de répondre à cette question et de produire une proposition de refonte actionnable.",
    },
    {
      type: 'info',
      title: 'Pourquoi les teardowns comptent',
      body: "Chaque codebase que vous héritez, rejoignez ou qui grandit au-delà d'une certaine taille a besoin de cette analyse. La plupart des systèmes en production ont été conçus pour des équipes humaines — ils reposent sur des connaissances tribales, des conventions implicites et des modèles mentaux partagés auxquels les agents ne peuvent pas accéder. Le Teardown révèle exactement où vivent ces hypothèses dépendantes de l'humain et vous donne un plan concret pour les éliminer. Le résultat n'est pas une réécriture — c'est un ensemble ciblé de changements qui transforment un système human-native en un système agent-native.",
    },

    // === THE METHODOLOGY ===
    {
      type: 'diagram',
      title: 'La méthodologie Teardown',
      body: 'Quatre phases, chacune produisant un artéfact spécifique. La sortie finale est un rapport noté avec des recommandations de refonte.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'map', label: 'Phase 1 : Cartographier', sublabel: 'Inventaire des composants', shape: 'rounded' },
          { id: 'score', label: 'Phase 2 : Noter', sublabel: 'Constructibilité par composant', shape: 'rounded' },
          { id: 'blockers', label: 'Phase 3 : Blocages', sublabel: 'Ce qui empêche le travail d\'agent', shape: 'rounded' },
          { id: 'redesign', label: 'Phase 4 : Refonte', sublabel: 'Améliorations ciblées', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'map', to: 'score' },
          { from: 'score', to: 'blockers' },
          { from: 'blockers', to: 'redesign' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Vue d\'ensemble de la méthodologie complète !',
    },

    // === PHASE 1: MAP ===
    {
      type: 'info',
      title: 'Phase 1 : Cartographier les composants',
      body: "Listez chaque composant du système. Pas les classes ou les fonctions — les composants système. Un composant est une unité cohésive qui pourrait théoriquement être possédée par un seul agent. Exemples : authentification des utilisateurs, traitement des paiements, gestion des commandes, notifications par courriel, tableau de bord admin, passerelle API. Pour chaque composant, documentez : sa responsabilité (une phrase), ses dépendances (ce qu'il appelle), ses dépendants (ce qui l'appelle) et ses entrepôts de données (quelles bases de données/caches il lit/écrit).",
    },
    {
      type: 'code-demo',
      title: 'Sortie de Phase 1 : Carte des composants',
      body: 'Une vraie carte de composants pour une plateforme de commerce en ligne. Chaque composant est documenté avec ses frontières et dépendances.',
      language: 'markdown',
      filename: 'teardown-phase1.md',
      code: "# Component Map: E-Commerce Platform\n\n## 1. User Auth\n- Responsibility: Registration, login, session management, password reset\n- Dependencies: Email Service (sends verification emails)\n- Dependents: ALL other components (check auth state)\n- Data: users table, sessions table\n- Files: 12 files across 3 directories\n\n## 2. Product Catalog\n- Responsibility: CRUD products, categories, search, filtering\n- Dependencies: Image Service (product photos)\n- Dependents: Orders, Cart, Admin Dashboard\n- Data: products table, categories table, product_images table\n- Files: 18 files across 2 directories\n\n## 3. Shopping Cart\n- Responsibility: Add/remove items, calculate totals, apply coupons\n- Dependencies: Product Catalog (price lookup), User Auth (cart ownership)\n- Dependents: Checkout/Orders\n- Data: carts table, cart_items table\n- Files: 8 files in 1 directory\n\n## 4. Orders & Checkout\n- Responsibility: Place orders, track status, handle fulfillment\n- Dependencies: Cart, Payments, Inventory, Email Service\n- Dependents: Admin Dashboard, Analytics\n- Data: orders table, order_items table, order_events table\n- Files: 24 files across 4 directories\n\n## 5. Payments\n- Responsibility: Charge cards, process refunds, handle webhooks\n- Dependencies: Stripe SDK, User Auth\n- Dependents: Orders\n- Data: payments table, refunds table\n- Files: 9 files in 1 directory\n\n## 6. Email Service\n- Responsibility: Send transactional emails (verification, receipts, shipping)\n- Dependencies: Template engine, SMTP provider\n- Dependents: Auth, Orders, Marketing\n- Data: email_logs table\n- Files: 14 files across 2 directories",
    },
    {
      type: 'multiple-choice',
      question: 'Dans la carte de composants ci-dessus, quel composant est probablement le plus difficile pour que des agents y travaillent indépendamment ?',
      options: [
        'Paiements — parce qu\'il gère de l\'argent',
        'Commandes & Checkout — parce qu\'il dépend de 4 autres composants et est dispersé dans 4 répertoires',
        'Auth utilisateur — parce que tous les autres composants en dépendent',
        'Panier — parce qu\'il a le moins de fichiers',
      ],
      correctIndex: 1,
      explanation: 'Commandes & Checkout a 4 dépendances (Panier, Paiements, Inventaire, Courriel) ET est dispersé dans 4 répertoires. Ça veut dire qu\'un agent travaillant sur les Commandes doit comprendre 4 autres systèmes et naviguer dans 4 emplacements différents. Nombre élevé de dépendances + fichiers dispersés = constructibilité par agent la plus basse.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Phase 1 complète !',
    },

    // === PHASE 2: SCORE ===
    {
      type: 'info',
      title: 'Phase 2 : Noter la constructibilité par agent',
      body: "Pour chaque composant, notez-le sur cinq facteurs qui déterminent si un agent peut efficacement le construire et le maintenir. Chaque facteur noté de 1 à 5 (1 = hostile aux agents, 5 = favorable aux agents). Les facteurs : (1) Frontières claires — un agent peut-il savoir quels fichiers appartiennent à ce composant sans deviner ? (2) Patrons cohérents — tous les fichiers suivent-ils la même structure ? (3) Contrats testables — les interfaces sont-elles bien définies et testables ? (4) Pas de connaissances tribales — un agent peut-il comprendre ça sans demander à un humain ? (5) Isolation — peut-il être modifié sans affecter d'autres composants ?",
    },
    {
      type: 'code-demo',
      title: 'Sortie de Phase 2 : Fiche de scores',
      body: 'Noter chaque composant révèle exactement où la constructibilité par agent se dégrade.',
      language: 'markdown',
      filename: 'teardown-phase2.md',
      code: "# Agent-Buildability Scores\n\n## Scoring Key\n- Boundaries: Can agent find all files? (1-5)\n- Patterns: Consistent file structure? (1-5)\n- Contracts: Well-defined testable interfaces? (1-5)\n- Knowledge: Zero tribal knowledge needed? (1-5)\n- Isolation: Modifiable without side effects? (1-5)\n\n| Component       | Bounds | Pattern | Contract | Knowledge | Isolation | TOTAL |\n|-----------------|--------|---------|----------|-----------|-----------|-------|\n| User Auth       |   4    |    4    |    3     |     3     |     2     |  16   |\n| Product Catalog |   3    |    3    |    4     |     4     |     4     |  18   |\n| Shopping Cart   |   5    |    5    |    4     |     5     |     3     |  22   |\n| Orders          |   2    |    2    |    2     |     2     |     1     |   9   |\n| Payments        |   5    |    5    |    5     |     4     |     4     |  23   |\n| Email Service   |   3    |    3    |    3     |     2     |     3     |  14   |\n\n## Interpretation\n- 20-25: Agent-native. Agents can own this component.\n- 15-19: Workable. Minor improvements needed.\n- 10-14: Friction. Agents struggle, need guidance.\n-  5-9:  Agent-hostile. Requires redesign for agent ownership.\n\n## Priority Targets: Orders (9), Email Service (14)",
    },
    {
      type: 'info',
      title: 'Ce que chaque score signifie',
      body: "Un score de Frontières à 2 signifie que les fichiers sont dispersés dans plusieurs répertoires sans propriété claire. Un score de Patrons à 2 signifie que chaque fichier utilise des conventions différentes (certains utilisent des classes, d'autres des fonctions, le nommage est incohérent). Un score de Contrats à 2 signifie que l'interface du module est implicite — il faut lire l'implémentation pour savoir ce qu'il expose. Un score de Connaissances à 2 signifie qu'il y a des hypothèses non documentées qu'un agent va manquer (« on ne supprime jamais les commandes » ou « ce champ est toujours en UTC »). Un score d'Isolation à 1 signifie que modifier ce composant casse de façon fiable les autres.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Phase 2 notée !',
    },

    // === PHASE 3: BLOCKERS ===
    {
      type: 'info',
      title: 'Phase 3 : Identifier les blocages',
      body: "Pour chaque composant mal noté, identifiez les blocages spécifiques — les choses concrètes qui le rendent hostile aux agents. Ce ne sont pas des observations vagues (« c'est complexe ») mais des constatations actionnables : « La machine à états des commandes n'est documentée nulle part — un agent ne connaîtra pas les transitions d'état valides. » « Les fichiers de commande sont dans src/controllers/, src/services/, src/jobs/ et src/events/ — quatre répertoires sans connexion claire. » « Le calcul du total dépend de 3 règles métier non documentées stockées dans un utilitaire partagé. » Chaque blocage devient une tâche en Phase 4.",
    },
    {
      type: 'code-demo',
      title: 'Sortie de Phase 3 : Analyse des blocages pour le composant Commandes',
      body: 'Chaque blocage est spécifique, mesurable et directement actionnable. Pas d\'observations vagues.',
      language: 'markdown',
      filename: 'teardown-phase3.md',
      code: "# Blockers: Orders & Checkout (Score: 9/25)\n\n## Boundary Blockers (Score: 2)\n- B1: Order files split across 4 dirs: controllers/, services/, jobs/, events/\n- B2: No feature directory — agent cannot list \"all order files\" in one command\n- B3: Shared utility `calculateOrderTotal` in lib/utils.ts (not owned by Orders)\n\n## Pattern Blockers (Score: 2)\n- P1: Controller uses class syntax, service uses functions, job uses factory pattern\n- P2: Some files use camelCase, others kebab-case (orderService vs order-events)\n- P3: Tests in 2 locations: __tests__/orders/ AND orders.test.ts files\n\n## Contract Blockers (Score: 2)\n- C1: No defined interface between Orders ↔ Payments (direct function imports)\n- C2: Order status changes via direct DB update (no state machine or validation)\n- C3: Three callers reach into order internals (bypass public methods)\n\n## Knowledge Blockers (Score: 2)\n- K1: \"Orders with status 'shipped' cannot be cancelled\" — undocumented rule\n- K2: Total calculation includes tax logic that varies by state — buried in utility\n- K3: Webhook from Stripe updates order status — not obvious from order code\n\n## Isolation Blockers (Score: 1)\n- I1: Modifying order total logic breaks cart display (shared function)\n- I2: Order events trigger 5 side effects in other modules (tightly coupled)\n- I3: Order table has foreign keys to 4 other tables with cascade deletes",
    },
    {
      type: 'multiple-choice',
      question: 'Le blocage K1 indique : « Les commandes avec le statut shipped ne peuvent pas être annulées — règle non documentée. » Où cette connaissance devrait-elle vivre dans un système agent-natif ?',
      options: [
        'Dans un README que les développeurs lisent pendant l\'intégration',
        'Dans un commentaire de code au-dessus de la fonction d\'annulation',
        'Dans le CLAUDE.md du module Commandes ET appliquée dans le code via une machine à états avec des transitions valides explicites',
        'Dans le wiki du projet',
      ],
      correctIndex: 2,
      explanation: 'Les connaissances tribales doivent être (1) documentées là où les agents les liront (CLAUDE.md) ET (2) appliquées dans le code pour que les agents ne puissent pas les violer même s\'ils manquent la documentation. Une machine à états qui définit explicitement les transitions valides rend les transitions invalides une erreur de compilation ou d\'exécution — l\'agent ne peut physiquement pas annuler une commande expédiée.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Blocages identifiés !',
    },

    // === PHASE 4: REDESIGN ===
    {
      type: 'info',
      title: 'Phase 4 : Proposer la refonte',
      body: "Pour chaque blocage, proposez un correctif spécifique. Pas une réécriture — une intervention ciblée. Les blocages de frontières obtiennent une restructuration de répertoire (déplacer les fichiers dans un seul répertoire de fonctionnalité). Les blocages de patrons obtiennent un document de conventions plus une passe de refactoring. Les blocages de contrats obtiennent des définitions d'interface explicites. Les blocages de connaissances obtiennent de la documentation dans CLAUDE.md plus une application dans le code. Les blocages d'isolation obtiennent du découplage (événements au lieu d'appels directs). Priorisez par impact : quels correctifs débloquent le plus de travail parallèle d'agents ?",
    },
    {
      type: 'code-demo',
      title: 'Sortie de Phase 4 : Proposition de refonte (Commandes)',
      body: 'Chaque correctif cible un blocage spécifique. Priorisé par impact sur la constructibilité par agent.',
      language: 'markdown',
      filename: 'teardown-phase4.md',
      code: "# Redesign Proposal: Orders & Checkout\n\n## Priority 1: Boundaries (unlocks findability)\n- Move all order files to src/features/orders/\n- Extract `calculateOrderTotal` from lib/utils.ts into orders/\n- Estimated effort: 2 hours\n- Impact: Boundaries score 2 → 5\n\n## Priority 2: Contracts (unlocks parallel work)\n- Define OrderPaymentContract (types + interface)\n- Implement state machine: Order.transition(from, to) with validation\n- Replace direct imports with contract-based communication\n- Estimated effort: 4 hours\n- Impact: Contracts score 2 → 4, Isolation 1 → 3\n\n## Priority 3: Knowledge (unlocks autonomous agent work)\n- Create src/features/orders/CLAUDE.md with all business rules\n- Document state machine transitions (which states can reach which)\n- Document tax calculation rules with examples\n- Estimated effort: 1 hour\n- Impact: Knowledge score 2 → 5\n\n## Priority 4: Patterns (unlocks consistency)\n- Refactor all order files to function-based pattern\n- Rename to consistent convention: orders.handler.ts, orders.service.ts\n- Collocate tests: orders.test.ts in same directory\n- Estimated effort: 2 hours\n- Impact: Patterns score 2 → 5\n\n## Priority 5: Isolation (unlocks independence)\n- Replace direct side effects with event emissions\n- Other modules subscribe to order events (do not call order functions)\n- Remove cascade deletes — use soft-delete with cleanup job\n- Estimated effort: 6 hours\n- Impact: Isolation score 1 → 4\n\n## Projected Final Score: 9 → 23 (from agent-hostile to agent-native)\n## Total Estimated Effort: 15 hours",
    },
    {
      type: 'order',
      instruction: 'Ordonnez les priorités de refonte par impact (corriger en premier puis en dernier) :',
      items: [
        'Cohérence des patrons (renommer les fichiers, standardiser les conventions)',
        'Restructuration des frontières (déplacer les fichiers dans le répertoire de fonctionnalité)',
        'Documentation des connaissances (CLAUDE.md avec les règles métier)',
        'Contrats d\'interface (définir des frontières typées entre les modules)',
        'Améliorations de l\'isolation (événements au lieu de couplage direct)',
      ],
      correctOrder: [1, 3, 2, 0, 4],
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Refonte proposée !',
    },

    // === AGENT-BUILDABILITY FACTORS DEEP DIVE ===
    {
      type: 'info',
      title: 'Facteur : Élimination des connaissances tribales',
      body: "Les connaissances tribales sont tout ce qu'un humain « sait juste » qui n'est pas dans le code ou documenté. Règles métier (« on arrondit toujours vers le haut pour les taxes »). Conventions implicites (« les handlers n'appellent jamais d'autres handlers directement »). Contexte historique (« on utilise cette API dépréciée parce que la nouvelle a un bug dans les cas limites »). Particularités de déploiement (« ne jamais déployer le vendredi — la tâche batch roule samedi matin »). Chaque morceau de connaissance tribale est une mine pour les agents. Ils la violeront, causeront des bugs et vous passerez du temps à déboguer quelque chose que « tout le monde sait. » Documentez-la ou appliquez-la dans le code.",
    },
    {
      type: 'info',
      title: 'Facteur : Contrats testables',
      body: "Si vous ne pouvez pas tester la frontière entre deux modules, un agent ne peut pas vérifier que son travail est correct. Un contrat testable signifie : (1) L'interface est typée — TypeScript attrape les incompatibilités à la compilation. (2) Le comportement est spécifié — il y a des tests qui vérifient que le contrat est honoré. (3) Le contrat est mockable indépendamment — un agent peut tester son module sans exécuter le système entier. Chaque module devrait être testable en isolation. Si tester le Module A nécessite d'exécuter le Module B, la frontière entre eux n'est pas assez propre.",
    },
    {
      type: 'multiple-choice',
      question: 'Vous faites un teardown d\'un outil interne. Le processus de déploiement nécessite d\'exécuter 3 scripts dans un ordre spécifique avec des vérifications manuelles entre eux. Comment ça affecte la constructibilité par agent ?',
      options: [
        'Ça n\'affecte pas — le déploiement est séparé de l\'architecture du code',
        'Ça baisse le score de Connaissances — les agents ne peuvent pas déployer sans connaissance tribale des étapes manuelles et de l\'ordre',
        'Ça ne concerne que les agents CI/CD, pas les agents de codage',
        'Ça augmente la constructibilité parce que les scripts sont automatisables',
      ],
      correctIndex: 1,
      explanation: 'Les processus manuels non documentés sont des connaissances tribales. Même si les agents de codage ne déploient pas directement, ils doivent comprendre les contraintes de déploiement lors de la conception de fonctionnalités (par ex., « ceci nécessite une migration qui doit s\'exécuter avant le déploiement du code »). Le processus manuel devrait être documenté dans CLAUDE.md et idéalement automatisé en un seul script que les agents peuvent comprendre.',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'Quand exécuter un teardown',
      body: "Exécutez un teardown quand : (1) Vous héritez d'une codebase et prévoyez d'utiliser des agents intensivement. (2) Les taux de conflits des agents dépassent 15% malgré une bonne documentation CLAUDE.md. (3) Les agents produisent systématiquement du code incorrect dans des zones spécifiques (indique des connaissances tribales ou des frontières floues). (4) Vous planifiez une nouvelle fonctionnalité significative et voulez assurer une architecture favorable aux agents. Le teardown prend 2-4 heures pour un système de taille moyenne. L'implémentation de la refonte prend des jours à des semaines — mais le retour est une amélioration permanente de la productivité des agents.",
    },
    {
      type: 'info',
      title: 'L\'état d\'esprit du teardown',
      body: "Le Teardown ne consiste pas à juger le code legacy. Le code legacy a été construit pour des équipes humaines avec des hypothèses humaines. C'était approprié à l'époque. Le Teardown reconnaît la nouvelle réalité : les agents sont maintenant vos constructeurs, et ils ont des besoins différents. Des frontières claires au lieu de connaissances tribales. Des contrats explicites au lieu de conventions implicites. Des règles documentées au lieu de culture d'équipe. Ce n'est pas une critique de l'ancienne façon — c'est une adaptation à une nouvelle capacité.",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification de la méthodologie Teardown :',
      items: [
        'Je peux cartographier tous les composants d\'un système avec leurs dépendances et entrepôts de données',
        'Je peux noter chaque composant sur les 5 facteurs de constructibilité par agent',
        'Je peux identifier des blocages spécifiques et actionnables (pas des observations vagues)',
        'Je peux proposer des refontes ciblées avec des estimations d\'effort et des projections d\'impact',
        'Je priorise les correctifs par impact sur le parallélisme et l\'autonomie des agents',
        'Je sais quand un teardown est justifié (héritage, taux de conflits élevé, échecs d\'agents)',
        'Je peux produire un rapport de teardown complet comme livrable',
      ],
    },
    {
      type: 'checkpoint',
      xp: 22,
      message: 'La méthodologie Teardown est maîtrisée ! Vous pouvez maintenant évaluer et refondre systématiquement n\'importe quel système pour la constructibilité par agent.',
    },
  ],
}

export default content
