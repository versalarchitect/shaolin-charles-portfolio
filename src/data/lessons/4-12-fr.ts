import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-12',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Capstone final : repenser un vrai système pour l\'IA',
      body: "C'est le moment. Tout ce que tu as appris — specs, contraintes, graphes de tâches, pipelines de vérification, jugement d'override, goût, communication avec les parties prenantes — synthétisé en un seul exercice. Tu vas analyser un système complexe, identifier ses faiblesses architecturales, et le repenser pour la constructibilité par flotte d'agents. Ce n'est pas un exercice. C'est le processus exact que tu vas exécuter en production. Quand tu auras terminé, tu auras produit un artéfact que tu pourrais présenter à une vraie équipe d'ingénierie.",
    },
    {
      type: 'info',
      title: 'Le système : plateforme e-commerce ShopFlow',
      body: "ShopFlow est une plateforme e-commerce de taille moyenne construite sur 4 ans par une équipe de 8 ingénieurs qui sont maintenant réduits à 3. Elle gère les commandes, l'inventaire, les paiements, les notifications et l'administration. C'est un monolithe déployé dans un seul conteneur Docker. La base de code fait 120K lignes de TypeScript. La couverture de tests est de 34 %. La fréquence de déploiement est de deux fois par semaine parce que chaque changement risque de casser quelque chose sans rapport. L'équipe se noie. Ils ont besoin de livrer plus vite sans embaucher. C'est ton défi.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Défi capstone accepté !',
    },

    // === PHASE 1: MAP THE SYSTEM ===
    {
      type: 'info',
      title: 'Phase 1 : Cartographier tous les composants et dépendances',
      body: "Avant de repenser, tu dois comprendre. ShopFlow a 6 domaines majeurs : Commandes (panier, checkout, exécution), Inventaire (niveaux de stock, entrepôts, déclencheurs de réapprovisionnement), Paiements (traitement, remboursements, abonnements), Notifications (courriel, SMS, push, in-app), Admin (tableau de bord, rapports, gestion des utilisateurs), et Auth (connexion, sessions, permissions). Ils sont tous dans une seule base de code avec des imports croisés extensifs. Ton premier travail : cartographier ce qui dépend de quoi.",
    },
    {
      type: 'diagram',
      title: 'ShopFlow : Architecture actuelle (emmêlée)',
      body: 'Chaque domaine importe de chaque autre domaine. C\'est pourquoi un changement aux paiements peut casser les notifications.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'orders', label: 'Commandes', sublabel: '28K LOC, 12 % tests', shape: 'rect' },
          { id: 'inventory', label: 'Inventaire', sublabel: '18K LOC, 45 % tests', shape: 'rect' },
          { id: 'payments', label: 'Paiements', sublabel: '22K LOC, 52 % tests', shape: 'rect' },
          { id: 'notifications', label: 'Notifications', sublabel: '15K LOC, 8 % tests', shape: 'rect' },
          { id: 'admin', label: 'Admin', sublabel: '25K LOC, 22 % tests', shape: 'rect' },
          { id: 'auth', label: 'Auth', sublabel: '12K LOC, 61 % tests', shape: 'rect' },
        ],
        edges: [
          { from: 'orders', to: 'inventory', label: 'vérif. stock' },
          { from: 'orders', to: 'payments', label: 'facturation' },
          { from: 'orders', to: 'notifications', label: 'envoi courriels' },
          { from: 'orders', to: 'auth', label: 'contexte utilisateur' },
          { from: 'inventory', to: 'notifications', label: 'alertes stock bas' },
          { from: 'inventory', to: 'orders', label: 'réserver le stock' },
          { from: 'payments', to: 'notifications', label: 'reçus' },
          { from: 'payments', to: 'orders', label: 'mise à jour statut' },
          { from: 'admin', to: 'orders' },
          { from: 'admin', to: 'inventory' },
          { from: 'admin', to: 'payments' },
          { from: 'admin', to: 'auth' },
          { from: 'notifications', to: 'auth', label: 'préf. utilisateur' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'En regardant le diagramme d\'architecture, quel domaine est le PLUS GROS bloqueur pour le développement parallèle par agents ?',
      options: [
        'Auth — il a la meilleure couverture de tests donc les agents auront du mal',
        'Commandes — il a le plus de code et touche chaque autre domaine, créant le couplage le plus élevé',
        'Notifications — il a la couverture de tests la plus basse',
        'Admin — il dépend de tout',
      ],
      correctIndex: 1,
      explanation: 'Commandes a le couplage sortant le plus élevé (importe de 4 autres domaines) ET le couplage entrant le plus élevé (Inventaire et Paiements importent tous les deux de lui). Ce couplage bidirectionnel signifie qu\'aucun agent ne peut travailler sur Commandes sans potentiellement affecter — ou être affecté par — des changements dans Inventaire, Paiements, Notifications et Auth simultanément.',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 1 complétée : système cartographié !',
    },

    // === PHASE 2: SCORE AGENT-BUILDABILITY ===
    {
      type: 'info',
      title: 'Phase 2 : Évaluer chaque composant pour la constructibilité par agents',
      body: "La constructibilité par agents mesure avec quelle efficacité une flotte d'agents peut travailler sur un composant en parallèle avec d'autre travail. Une haute constructibilité signifie : frontières claires, tests indépendants, faible couplage, interface bien définie. Une basse constructibilité signifie : imports emmêlés, état mutable partagé, pas de tests pour vérifier la justesse, portée floue. Évalue chaque domaine de 0 à 10 selon : isolation (0-3), testabilité (0-3), clarté de l'interface (0-2), et documentation (0-2).",
    },
    {
      type: 'code-demo',
      title: 'Évaluation de constructibilité par agents',
      body: 'Applique cette grille d\'évaluation à chaque domaine. Les scores révèlent où l\'investissement architectural aura le meilleur rendement.',
      language: 'markdown',
      filename: 'docs/buildability-assessment.md',
      code: "# ShopFlow Agent-Buildability Assessment\n\n## Scoring Rubric\n- Isolation (0-3): Can this domain be modified without touching others?\n- Testability (0-3): Can an agent verify correctness independently?\n- Interface clarity (0-2): Is the public API well-defined?\n- Documentation (0-2): Can an agent understand scope from docs alone?\n\n## Scores\n\n| Domain | Isolation | Testability | Interface | Docs | Total |\n|--------|-----------|-------------|-----------|------|-------|\n| Orders | 0 | 1 | 0 | 1 | 2/10 |\n| Inventory | 1 | 2 | 1 | 1 | 5/10 |\n| Payments | 1 | 2 | 1 | 2 | 6/10 |\n| Notifications | 1 | 0 | 0 | 0 | 1/10 |\n| Admin | 0 | 1 | 1 | 1 | 3/10 |\n| Auth | 2 | 2 | 2 | 1 | 7/10 |\n\n## Analysis\n- Auth (7/10): Best candidate for first extraction — already semi-isolated\n- Payments (6/10): Good candidate — clear domain, decent tests\n- Notifications (1/10): Worst buildability — no tests, no clear interface,\n  imported by everything. Highest priority for redesign.\n- Orders (2/10): Core domain but deeply entangled. Needs strangler fig.",
    },
    {
      type: 'order',
      instruction: 'Ordonne ces domaines du PREMIER à extraire en package indépendant au DERNIER :',
      items: [
        'Commandes (2/10 constructibilité, couplage le plus élevé)',
        'Auth (7/10 constructibilité, interface claire)',
        'Notifications (1/10 constructibilité, pas de tests)',
        'Paiements (6/10 constructibilité, tests corrects)',
        'Inventaire (5/10 constructibilité, couplage modéré)',
      ],
      correctOrder: [1, 3, 4, 2, 0],
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 2 complétée : constructibilité évaluée !',
    },

    // === PHASE 3: IDENTIFY BLOCKERS ===
    {
      type: 'info',
      title: 'Phase 3 : Identifier les 3 principaux bloqueurs architecturaux',
      body: "Maintenant que tu as les scores, identifie les problèmes structurels qui CAUSENT les scores bas. Ce ne sont pas des symptômes (faible couverture de tests) mais des causes profondes (dépendances circulaires qui rendent les tests impossibles). Un bloqueur est quelque chose qui, une fois résolu, améliorerait les scores de constructibilité de plusieurs domaines simultanément. Corrige les bloqueurs et les problèmes individuels de chaque domaine deviennent gérables.",
    },
    {
      type: 'info',
      title: 'Bloqueur 1 : Couplage bidirectionnel entre Commandes et Inventaire',
      body: "Commandes importe d'Inventaire pour vérifier le stock. Inventaire importe de Commandes pour réserver le stock d'une commande. Cette dépendance circulaire signifie qu'aucun des deux ne peut être extrait indépendamment. La solution : introduire un bus d'événements. Commandes publie des événements « OrderPlaced ». Inventaire s'y abonne et gère la réservation de stock. La dépendance devient unidirectionnelle : les deux dépendent des définitions d'événements, aucun ne dépend des internals de l'autre.",
    },
    {
      type: 'info',
      title: 'Bloqueur 2 : Notifications comme dépendance implicite',
      body: "Chaque domaine appelle directement les fonctions de notification : les commandes envoient des courriels de confirmation, les paiements envoient des reçus, l'inventaire envoie des alertes de stock bas. Ça fait de Notifications un point de couplage caché — change la façon d'envoyer les courriels et tu casses quatre autres domaines. La solution : Notifications devient un service autonome qui S'ABONNE aux événements des domaines. Les domaines publient des événements. Notifications décide quoi envoyer. Zéro couplage des domaines vers Notifications.",
    },
    {
      type: 'info',
      title: 'Bloqueur 3 : Base de données partagée sans frontières de schéma',
      body: "Les 6 domaines interrogent la même base de données sans séparation de schéma. Commandes interroge directement la table d'inventaire. Admin interroge tout. Ça rend tout changement de schéma potentiellement cassant pour chaque domaine. La solution : des frontières de schéma. Chaque domaine possède ses tables. L'accès aux données inter-domaines se fait par des appels API, pas par des requêtes directes. C'est le changement le plus difficile mais il permet un déploiement véritablement indépendant.",
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi « base de données partagée sans frontières de schéma » est le bloqueur le plus difficile à corriger ?',
      options: [
        'Parce que les bases de données sont une technologie complexe',
        'Parce que chaque requête SQL dans la base de code traverse potentiellement les frontières de domaines — le rayon d\'impact de la correction touche la base de code entière simultanément',
        'Parce qu\'il faut migrer les données',
        'Parce que les agents ne savent pas écrire du SQL',
      ],
      correctIndex: 1,
      explanation: 'Les autres bloqueurs peuvent être corrigés de façon incrémentale (ajouter un événement, s\'y abonner). Mais les frontières de base de données exigent d\'auditer chaque requête dans 120K lignes de code pour déterminer à quel domaine elle appartient, puis de router les requêtes inter-domaines à travers des API. Le changement touche tout, rendant la migration incrémentale essentielle.',
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 3 complétée : bloqueurs identifiés !',
    },

    // === PHASE 4: THE REDESIGN ===
    {
      type: 'info',
      title: 'Phase 4 : Le redesign constructible par agents',
      body: "Maintenant tu conçois l'architecture cible. L'objectif : chaque domaine score 8+ en constructibilité par agents. Chaque domaine peut être travaillé par un agent indépendant avec zéro coordination. Le système déploie chaque domaine indépendamment. Un changement aux paiements ne peut pas casser les commandes. Ce n'est pas un exercice théorique — tu écris les vrais protocoles CLAUDE.md, le graphe de tâches, et le pipeline de vérification qui gouverneraient la migration.",
    },
    {
      type: 'diagram',
      title: 'ShopFlow : Architecture proposée (découplée)',
      body: 'Les domaines communiquent à travers un bus d\'événements et des contrats API typés. Aucun import direct inter-domaines.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'events', label: 'Bus d\'événements', sublabel: 'Événements de domaine typés', shape: 'rounded', highlight: true },
          { id: 'types', label: '@shop/shared-types', sublabel: 'Contrats événements + API', shape: 'pill', highlight: true },
          { id: 'orders', label: 'Package Commandes', sublabel: 'Indépendant, 8/10', shape: 'rect' },
          { id: 'inventory', label: 'Package Inventaire', sublabel: 'Indépendant, 9/10', shape: 'rect' },
          { id: 'payments', label: 'Package Paiements', sublabel: 'Indépendant, 9/10', shape: 'rect' },
          { id: 'notifications', label: 'Package Notifications', sublabel: 'Piloté par événements, 8/10', shape: 'rect' },
          { id: 'admin', label: 'Package Admin', sublabel: 'Consommateur d\'API seulement, 8/10', shape: 'rect' },
          { id: 'auth', label: 'Package Auth', sublabel: 'Autonome, 9/10', shape: 'rect' },
        ],
        edges: [
          { from: 'orders', to: 'events', label: 'publie' },
          { from: 'inventory', to: 'events', label: 'publie + s\'abonne' },
          { from: 'payments', to: 'events', label: 'publie + s\'abonne' },
          { from: 'notifications', to: 'events', label: 's\'abonne seulement' },
          { from: 'orders', to: 'types', dashed: true },
          { from: 'inventory', to: 'types', dashed: true },
          { from: 'payments', to: 'types', dashed: true },
          { from: 'notifications', to: 'types', dashed: true },
          { from: 'admin', to: 'types', dashed: true },
          { from: 'auth', to: 'types', dashed: true },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md racine : Protocole au niveau système',
      body: 'Ceci gouverne chaque agent travaillant n\'importe où dans le système. C\'est la constitution — les fichiers CLAUDE.md de chaque package ajoutent des règles mais ne peuvent pas outrepasser celles-ci.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# ShopFlow — Agent Protocol\n\n## System Rules (ALL agents, ALL packages)\n1. **No cross-package imports** except from @shop/shared-types\n2. **Communication between domains**: Event bus OR typed HTTP API only\n3. **Database**: Each package owns its schema. No cross-schema queries.\n4. **Testing**: Package tests must pass with no other package running\n5. **Deployment**: Each package deploys independently via its own pipeline\n\n## Shared Types Contract\nAll domain events and API request/response types live in @shop/shared-types.\nThis is the ONLY cross-cut. Changes here require review.\n\n## Event Bus Protocol\n- Events are immutable facts: OrderPlaced, PaymentProcessed, StockReserved\n- Publishers do not know who subscribes\n- Subscribers do not know who publishes\n- Events are typed in @shop/shared-types\n\n## Verification (every agent, every task)\n1. `bun run typecheck` — must pass\n2. `bun run test --filter={package}` — must pass\n3. `bun run build --filter={package}` — must produce artifact\n4. No lint errors introduced\n\n## Task Assignment Protocol\nEach agent receives: one package, one task, one CLAUDE.md.\nAgent scope = package scope. Never cross the boundary.",
    },
    {
      type: 'code-demo',
      title: 'CLAUDE.md au niveau package — exemple : Paiements',
      body: 'Chaque domaine a son propre CLAUDE.md qui cadre précisément le travail de l\'agent. Un agent assigné aux paiements ne peut littéralement pas affecter les commandes.',
      language: 'markdown',
      filename: 'packages/payments/CLAUDE.md',
      code: "# Payments Package\n\n## Scope\nAll payment processing: charges, refunds, subscriptions, webhooks.\n\n## Owns\n- packages/payments/src/ (all source)\n- packages/payments/prisma/ (own schema + migrations)\n- packages/payments/tests/\n\n## Publishes Events\n- PaymentProcessed { orderId, amount, status }\n- RefundIssued { orderId, amount, reason }\n- SubscriptionChanged { userId, planId, action }\n\n## Subscribes To\n- OrderPlaced → initiate payment processing\n- OrderCancelled → initiate refund\n\n## External Dependencies\n- Stripe SDK (payment processing)\n- @shop/shared-types (event + API contracts)\n\n## Off-Limits\n- Do NOT import from any other package\n- Do NOT query tables outside payments schema\n- Do NOT send notifications directly (publish event, let notifications handle)\n\n## Testing\n- Unit: mock Stripe, test business logic\n- Integration: test against Stripe test mode\n- Contract: verify published events match @shop/shared-types\n\n## Run\n- Dev: `bun run dev --filter=payments`\n- Test: `bun run test --filter=payments`\n- Build: `bun run build --filter=payments`",
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 4 complétée : redesign documenté !',
    },

    // === EXERCICES INTERACTIFS PHASE 4 ===
    {
      type: 'match',
      instruction: 'Associe chaque phase de migration à son livrable principal :',
      leftItems: ['Fondation', 'Extraction', 'Intégration', 'Vérification'],
      rightItems: ['Types partagés + bus d\'événements', 'Implémentations spécifiques aux modules', 'Communication inter-modules', 'Suite de tests de bout en bout'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'La fondation livre l\'infrastructure partagée (types et bus d\'événements) dont tout le reste dépend. L\'extraction produit des implémentations de modules indépendants. L\'intégration met en place la communication inter-modules via le bus d\'événements. La vérification confirme que le système découplé se comporte de façon identique au monolithe via des tests de bout en bout.',
    },
    {
      type: 'compare',
      title: 'Migration naïve vs Migration par phases',
      body: 'Deux approches pour migrer le monolithe ShopFlow. L\'une est tentante. L\'autre fonctionne réellement.',
      left: {
        label: 'Naïve (Big Bang)',
        content: 'Stratégie : Tout réécrire d\'un coup\n\nSemaines 1-4 : Construire les 6 packages simultanément\nSemaine 5 : Bascule big bang — ancien système éteint, nouveau allumé\n\nRisques :\n- Pas de repli si le nouveau système a des bogues\n- TOUT le trafic affecté par un seul bogue\n- Gel de fonctionnalités sur l\'ancien pendant la construction\n- Cas limites découverts seulement après la bascule\n- Retour arrière = redéployer tout le monolithe\n- Zéro confiance jusqu\'à ce que tout soit fini\n\nExpérience de l\'équipe : terrifiante\nTemps de retour arrière : heures à jours\nTaux de succès dans l\'industrie : ~30 %',
        language: 'text',
        filename: 'migration-naive.txt',
      },
      right: {
        label: 'Par phases (Strangler Fig)',
        content: 'Stratégie : Remplacement graduel avec adaptateurs\n\nSemaine 1 : Fondation (types + bus d\'événements)\nSemaine 2 : Extraire 4 domaines en parallèle\nSemaine 3 : Strangler fig pour Commandes\nSemaine 4 : Reconstruction Admin + vérification complète\n\nRisques :\n- Chaque phase a un retour arrière instantané\n- Les bogues n\'affectent que le trafic migré\n- L\'ancien système reste en ligne tout du long\n- Cas limites attrapés par module\n- Retour arrière = basculer un feature flag\n- La confiance se construit de façon incrémentale\n\nExpérience de l\'équipe : contrôlée\nTemps de retour arrière : < 5 minutes\nTaux de succès dans l\'industrie : ~85 %',
        language: 'text',
        filename: 'migration-phases.txt',
      },
      question: 'Quelle approche proposerais-tu pour la migration ShopFlow ?',
      correctSide: 'right',
      explanation: 'L\'approche par phases réussit ~85 % du temps vs ~30 % pour les réécritures big bang. Chaque phase est vérifiable et réversible indépendamment. L\'ancien système reste en ligne comme filet de sécurité. Avec les flottes d\'agents, l\'approche par phases est aussi rapide — 4 agents sur 4 extractions simultanément. Tu obtiens la vitesse d\'un big bang avec la sécurité d\'une migration incrémentale.',
    },
    {
      type: 'code-diff',
      title: 'Avant extraction vs après : le domaine Commandes',
      body: 'Vois comment le module Commandes passe de participant monolithique à couplage fort à package isolé et déployable indépendamment.',
      language: 'typescript',
      filename: 'orders/checkout.ts',
      before: "// AVANT : Monolithique — Commandes accède à chaque autre domaine\nimport { checkStock, reserveStock } from '../inventory/stock'\nimport { chargeCard } from '../payments/processor'\nimport { sendConfirmation } from '../notifications/email'\nimport { getUser } from '../auth/sessions'\n\nexport async function checkout(sessionId: string, cartId: string) {\n  const user = getUser(sessionId)\n  const cart = await loadCart(cartId)\n\n  // Couplage direct aux internals d'inventaire\n  for (const item of cart.items) {\n    if (!checkStock(item.sku, item.qty)) throw new Error('Rupture de stock')\n    reserveStock(item.sku, item.qty)\n  }\n\n  // Couplage direct aux internals de paiements\n  const charge = await chargeCard(user.paymentMethod, cart.total)\n\n  // Couplage direct aux internals de notifications\n  await sendConfirmation(user.email, cart, charge.receiptId)\n}",
      after: "// APRÈS : Isolé — Commandes publie des événements, ne possède rien d'autre\nimport { eventBus } from '@shop/event-bus'\nimport type { OrderPlaced } from '@shop/shared-types'\n\nexport async function checkout(userId: string, cartId: string) {\n  const cart = await loadCart(cartId)\n\n  // Publier l'événement — inventaire, paiements, notifications\n  // chacun s'abonne et gère ses propres préoccupations\n  const event: OrderPlaced = {\n    type: 'OrderPlaced',\n    orderId: crypto.randomUUID(),\n    userId,\n    items: cart.items,\n    total: cart.total,\n    timestamp: new Date().toISOString(),\n  }\n\n  await eventBus.publish(event)\n\n  // Commandes ne gère que l'état des commandes — rien d'autre\n  return { orderId: event.orderId, status: 'processing' }\n}",
      question: 'Quel est le changement structurel clé entre les deux versions ?',
      explanation: 'La version d\'avant importe de 4 autres domaines — tout changement dans inventaire, paiements, notifications ou auth peut casser checkout. La version d\'après n\'importe que des types partagés et du bus d\'événements. Elle publie un événement OrderPlaced et laisse chaque domaine gérer ses propres préoccupations. Commandes ne sait plus et ne se soucie plus de comment le stock est vérifié, les paiements sont traités, ou les courriels sont envoyés. C\'est un vrai découplage.',
    },

    // === PHASE 4 CONTINUED: TASK GRAPH ===
    {
      type: 'info',
      title: 'Le graphe de tâches de migration',
      body: "Tu ne peux pas repenser le système entier d'un coup. Le graphe de tâches définit l'ordre des opérations — quelles migrations peuvent tourner en parallèle et lesquelles ont des dépendances. Le chemin critique passe par le bus d'événements (tout en dépend) et le package de types partagés (tout l'importe). Une fois que ceux-ci existent, les six extractions de domaines peuvent se faire en parallèle.",
    },
    {
      type: 'interactive-diagram',
      title: 'Graphe de tâches de migration',
      body: 'Clique sur chaque phase pour comprendre la séquence de refactorisation et pourquoi elle doit se faire dans cet ordre.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'types', label: '1. Créer @shop/shared-types', sublabel: 'Définir tous les événements + contrats API', shape: 'rounded', highlight: true },
          { id: 'bus', label: '2. Implémenter le bus d\'événements', sublabel: 'Infrastructure pub/sub', shape: 'rounded', highlight: true },
          { id: 'auth', label: '3a. Extraire Auth', sublabel: 'Meilleure constructibilité', shape: 'rect' },
          { id: 'payments', label: '3b. Extraire Paiements', sublabel: 'Deuxième meilleure', shape: 'rect' },
          { id: 'inventory', label: '3c. Extraire Inventaire', sublabel: 'Couplage modéré', shape: 'rect' },
          { id: 'notifications', label: '3d. Réécrire Notifications', sublabel: 'Piloté par événements dès le départ', shape: 'rect' },
          { id: 'orders', label: '4. Refactoriser Commandes', sublabel: 'Strangler fig (en dernier)', shape: 'rect' },
          { id: 'admin', label: '5. Reconstruire Admin', sublabel: 'Consommateur d\'API de tous', shape: 'rect' },
          { id: 'verify', label: '6. Vérification système complète', sublabel: 'Tests de bout en bout', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'types', to: 'bus' },
          { from: 'bus', to: 'auth' },
          { from: 'bus', to: 'payments' },
          { from: 'bus', to: 'inventory' },
          { from: 'bus', to: 'notifications' },
          { from: 'auth', to: 'orders' },
          { from: 'payments', to: 'orders' },
          { from: 'inventory', to: 'orders' },
          { from: 'notifications', to: 'orders', dashed: true },
          { from: 'orders', to: 'admin' },
          { from: 'admin', to: 'verify' },
        ],
      },
      stages: [
        {
          highlightNodes: ['types'],
          highlightEdges: [],
          explanation: 'Phase 1 : Créer le package de types partagés. Tous les événements de domaine et contrats API sont définis ici. C\'est la source de vérité unique dont chaque package dépendra. Sans ça, les agents inventeraient des interfaces incompatibles.',
        },
        {
          highlightNodes: ['types', 'bus'],
          highlightEdges: [{ from: 'types', to: 'bus' }],
          explanation: 'Phase 2 : Implémenter le bus d\'événements avec Redis Streams. C\'est l\'épine dorsale de communication. Les domaines publieront et s\'abonneront à des événements au lieu de s\'importer mutuellement. Le bus dépend des types partagés pour les définitions d\'événements.',
        },
        {
          highlightNodes: ['bus', 'auth', 'payments', 'inventory', 'notifications'],
          highlightEdges: [{ from: 'bus', to: 'auth' }, { from: 'bus', to: 'payments' }, { from: 'bus', to: 'inventory' }, { from: 'bus', to: 'notifications' }],
          explanation: 'Phase 3 : Quatre extractions en parallèle. Chaque agent travaille indépendamment sur un domaine. Auth (7/10 constructibilité) est le plus facile. Notifications (1/10) est entièrement réécrit en événementiel. Les quatre peuvent se faire simultanément car ils ne dépendent que du bus d\'événements, pas les uns des autres.',
        },
        {
          highlightNodes: ['auth', 'payments', 'inventory', 'orders'],
          highlightEdges: [{ from: 'auth', to: 'orders' }, { from: 'payments', to: 'orders' }, { from: 'inventory', to: 'orders' }],
          explanation: 'Phase 4 : Strangler fig pour Commandes. C\'est en dernier parce que Commandes dépend d\'Auth, Paiements et Inventaire. Ceux-ci doivent avoir des interfaces stables et indépendantes avant que Commandes puisse se découpler de leurs internals. Chaque endpoint est migré individuellement avec un adaptateur.',
        },
        {
          highlightNodes: ['orders', 'admin'],
          highlightEdges: [{ from: 'orders', to: 'admin' }],
          explanation: 'Phase 5 : Reconstruire Admin comme un pur consommateur d\'API. Admin est en dernier parce qu\'il a besoin d\'API stables de chaque autre domaine à appeler. Une fois tous les domaines extraits, Admin devient une mince couche d\'UI par-dessus des API versionnées.',
        },
        {
          highlightNodes: ['admin', 'verify'],
          highlightEdges: [{ from: 'admin', to: 'verify' }],
          explanation: 'Phase 6 : Vérification système complète. Les tests de bout en bout valident que le système découplé se comporte de façon identique au monolithe. Le mode shadow compare les sorties. C\'est seulement après que la vérification passe qu\'on retire les adaptateurs legacy.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi l\'extraction de Commandes vient-elle APRÈS Auth, Paiements et Inventaire ?',
      options: [
        'Parce que Commandes a le plus de code',
        'Parce que Commandes dépend des trois — il ne peut pas être découplé tant que ses dépendances n\'ont pas des interfaces stables et indépendantes dont dépendre',
        'Parce que Commandes est moins important que les autres',
        'Parce que Commandes a plus besoin du bus d\'événements que les autres',
      ],
      correctIndex: 1,
      explanation: 'Commandes importe actuellement directement d\'Auth, Paiements et Inventaire. Pour extraire Commandes, ces imports doivent être remplacés par des abonnements à des événements ou des appels API. Mais ces API n\'existent pas tant qu\'Auth, Paiements et Inventaire ne sont pas extraits en premier. Le graphe de dépendances dicte l\'ordre d\'extraction.',
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Graphe de tâches conçu !',
    },

    // === CODE-FILL: SPEC DE MIGRATION ===
    {
      type: 'code-fill',
      instruction: 'Complète cette spec de migration avec les descriptions de phases, les assignations d\'agents et les contrats d\'interface.',
      language: 'markdown',
      filename: 'docs/migration-spec.md',
      template: '# ShopFlow Migration Spec\n\n## Phase 1: Foundation\n- Create {{foundation_package}} with all event type definitions\n- Implement event bus using {{bus_technology}}\n\n## Phase 2: Parallel Extractions\n- Agent A: Extract {{agent_a_domain}} (highest buildability score)\n- Agent B: Extract {{agent_b_domain}} (clear domain boundary)\n- Agent C: Rewrite {{agent_c_domain}} as event-driven\n\n## Phase 3: Core Domain\n- Migrate Orders using {{migration_pattern}} pattern\n- Each endpoint gets its own {{adapter_type}}\n\n## Interface Contract\n- Cross-domain communication via {{comm_method}} only\n- All events typed in {{types_package}}',
      blanks: [
        { id: 'foundation_package', answer: '@shop/shared-types', alternatives: ['shared-types', '@shop/types', 'shared types package'], placeholder: 'nom du package ?', hint: 'Le package de contrat partagé' },
        { id: 'bus_technology', answer: 'Redis Streams', alternatives: ['Redis', 'redis streams', 'Redis Pub/Sub', 'message queue'], placeholder: 'quelle technologie ?', hint: 'Une technologie populaire de streaming de messages' },
        { id: 'agent_a_domain', answer: 'Auth', alternatives: ['auth', 'Authentication', 'authentication'], placeholder: 'quel domaine ?', hint: 'Score de 7/10 en constructibilité' },
        { id: 'agent_b_domain', answer: 'Payments', alternatives: ['payments', 'Payment', 'Billing', 'billing', 'Paiements'], placeholder: 'quel domaine ?', hint: 'Score de 6/10 en constructibilité' },
        { id: 'agent_c_domain', answer: 'Notifications', alternatives: ['notifications', 'Notification'], placeholder: 'quel domaine ?', hint: 'Score de 1/10 — nécessite une réécriture complète' },
        { id: 'migration_pattern', answer: 'strangler fig', alternatives: ['strangler', 'strangler fig pattern', 'incremental replacement'], placeholder: 'quel patron ?', hint: 'Remplacement graduel pendant que l\'ancien système tourne' },
        { id: 'adapter_type', answer: 'adapter', alternatives: ['adapter layer', 'compatibility adapter', 'legacy adapter', 'wrapper', 'adaptateur'], placeholder: 'quoi enveloppe ancien/nouveau ?', hint: 'Fait le pont entre les anciennes et nouvelles interfaces' },
        { id: 'comm_method', answer: 'event bus or typed HTTP API', alternatives: ['events and APIs', 'event bus', 'HTTP API', 'typed API', 'events or HTTP'], placeholder: 'méthode de communication ?', hint: 'Deux canaux de communication approuvés' },
        { id: 'types_package', answer: '@shop/shared-types', alternatives: ['shared-types', '@shop/types', 'the shared types package'], placeholder: 'où sont définis les types ?' },
      ],
      explanation: 'Une spec de migration complète élimine l\'ambiguïté pour chaque agent de la flotte. L\'ordre des phases, les assignations d\'agents et les contrats d\'interface signifient que chaque agent sait exactement quoi construire, de quoi dépendre, et quoi ne pas toucher.',
    },

    // === PROMPT-LAB: PROMPTS D'AGENTS POUR LA MIGRATION ===
    {
      type: 'prompt-lab',
      instruction: 'Écris un prompt pour assigner un agent à l\'extraction d\'un domaine dans la migration ShopFlow. Inclus assez de spécificité pour que l\'agent puisse exécuter immédiatement.',
      scenario: 'Tu assignes un agent pour extraire le domaine Paiements du monolithe ShopFlow en un package indépendant. Le bus d\'événements et @shop/shared-types sont déjà en place. L\'agent a besoin d\'un cadre clair, de contraintes et d\'étapes de vérification.',
      starterPrompt: 'Refactor the app.',
      responses: [
        {
          triggerKeywords: ['payments', 'event', 'shared-types', 'scope', 'test'],
          response: 'I\'ll extract the Payments domain into an independent package.\n\nPlan:\n1. Create packages/payments/ with its own tsconfig and build target\n2. Move all payment-related source files from the monolith\n3. Replace direct imports with event bus subscriptions (OrderPlaced, OrderCancelled)\n4. Publish PaymentProcessed, RefundIssued events via @shop/shared-types\n5. Create adapter for legacy consumers during migration\n6. Verify: package tests pass in isolation, build succeeds independently\n\nStarting extraction...',
          quality: 'excellent',
          feedback: 'Ton prompt incluait le cadre du domaine, les contrats d\'événements, les contraintes de dépendances et les critères de vérification. L\'agent peut exécuter l\'extraction complète sans poser de questions de suivi. C\'est de la direction d\'agents de qualité production.',
        },
        {
          triggerKeywords: ['payments', 'package', 'extract'],
          response: 'I\'ll extract payments into its own package. Should I:\n- Use the existing database schema or create a new one?\n- Keep the current Stripe integration or refactor it?\n- How should payments communicate with orders?\n\nLet me know before I start.',
          quality: 'good',
          feedback: 'Tu as spécifié le domaine et l\'action, ce qui est mieux que « refactoriser l\'app ». Mais l\'agent a encore besoin de demander les patrons de communication, la propriété de la base de données et l\'approche d\'intégration. Ajoute des contraintes sur l\'utilisation du bus d\'événements et la propriété du schéma pour éliminer ces questions.',
        },
      ],
      fallbackResponse: {
        response: 'I\'ll start refactoring the app. Let me analyze the full codebase first... this is a 120K line monolith, so I\'ll need to understand all the dependencies before making changes. This might take a while.\n\nShould I start with the most complex module or the simplest?',
        feedback: 'Sans cadre, l\'agent essaie d\'analyser toute la base de code de 120K lignes. Il demande des questions de stratégie au lieu d\'exécuter. Un bon prompt spécifie : quel domaine (Paiements), quelle action (extraire en package), quelles contraintes (bus d\'événements seulement, schéma propre), et comment vérifier (tests passent en isolation).',
      },
    },

    // === PHASE 5: PROFESSIONAL PRESENTATION ===
    {
      type: 'info',
      title: 'Phase 5 : Présenter comme un document professionnel',
      body: "Le redesign est complet dans ta tête. Maintenant tu dois le communiquer. Un document professionnel de redesign d'architecture contient : un résumé exécutif (un paragraphe pour le leadership), une évaluation de l'état actuel (avec des preuves), l'architecture proposée (avec des diagrammes), un plan de migration (avec calendrier et risques), des métriques de succès (comment tu sauras que ça a marché), et une estimation des coûts. C'est le document que tu remets à un CTO ou VP en disant : voici ce que je recommande.",
    },
    {
      type: 'code-demo',
      title: 'Résumé exécutif',
      body: 'Un paragraphe. C\'est ce que le CTO lit. Si ce paragraphe ne les convainc pas, ils ne liront pas le reste.',
      language: 'markdown',
      filename: 'docs/architecture-redesign.md',
      code: "# ShopFlow Architecture Redesign Proposal\n\n## Executive Summary\n\nShopFlow's monolithic architecture limits development velocity to 2 deploys/week\ndue to cross-domain coupling that makes every change a potential system-wide risk.\nThis proposal restructures the system into 6 independently deployable packages\ncommunicating through a typed event bus, enabling parallel development by\nmultiple agents/developers with zero coordination overhead. Estimated migration:\n4 weeks with a 3-person team + agent fleet. Expected outcome: 10x deploy\nfrequency, 60% reduction in production incidents, and the ability to scale\ndevelopment capacity without proportional hiring.",
    },
    {
      type: 'code-demo',
      title: 'Calendrier de migration et évaluation des risques',
      body: 'Les parties prenantes ont besoin de savoir : combien de temps, qu\'est-ce qui pourrait mal tourner, et comment tu atténues les risques.',
      language: 'markdown',
      filename: 'docs/migration-plan.md',
      code: "# Migration Plan\n\n## Timeline (4 weeks)\n\n### Week 1: Foundation\n- Create @shop/shared-types with all event definitions\n- Implement event bus (Redis Streams)\n- Set up monorepo tooling (Nx, per-package CI)\n- Risk: Low (additive, no existing code modified)\n\n### Week 2: First Extractions (parallel)\n- Agent A: Extract Auth package\n- Agent B: Extract Payments package\n- Agent C: Extract Inventory package\n- Agent D: Rewrite Notifications (event-driven)\n- Risk: Medium (strangler adapters keep old system live)\n\n### Week 3: Core Domain\n- Strangler fig for Orders (gradual migration)\n- Each endpoint migrated individually with adapter\n- Old + new run simultaneously (shadow mode)\n- Risk: Highest (core domain, most coupling)\n\n### Week 4: Integration & Admin\n- Rebuild Admin as pure API consumer\n- Full end-to-end testing\n- Remove legacy adapters\n- Risk: Low (verification-heavy, no new logic)\n\n## Risk Mitigation\n- Strangler fig: old system remains live until new passes all tests\n- Feature flags: route traffic to new/old per endpoint\n- Rollback: revert to monolith by disabling feature flags (< 5 min)\n- Shadow mode: new system processes in parallel, compare outputs\n\n## Success Metrics (measured at 30 days post-migration)\n- Deploy frequency: >2x daily (from 2x weekly)\n- Mean time to recovery: <15 min (from 2-4 hours)\n- Production incidents: <2/month (from 8/month)\n- Developer satisfaction: measured via survey\n- Agent buildability score: all domains >8/10",
    },
    {
      type: 'multiple-choice',
      question: 'Le plan de migration inclut « mode shadow : le nouveau système traite en parallèle, comparaison des sorties ». Pourquoi est-ce critique pour la migration de Commandes ?',
      options: [
        'Parce que Commandes a le plus de code',
        'Parce que Commandes gère des opérations adjacentes à l\'argent (checkout, exécution) où un comportement incorrect a un impact métier immédiat — le mode shadow prouve l\'équivalence avant la bascule',
        'Parce que les agents font plus d\'erreurs sur les grandes bases de code',
        'Parce que l\'équipe a besoin de temps pour apprendre le nouveau système',
      ],
      correctIndex: 1,
      explanation: 'Commandes gère le checkout et l\'exécution — des opérations où les bogues signifient des revenus perdus ou des commandes non remplies. Le mode shadow fait tourner l\'ancien et le nouveau simultanément, en comparant les sorties. Si elles divergent, tu sais que le nouveau système a une différence de comportement AVANT qu\'elle n\'affecte de vrais clients. C\'est une gestion proportionnelle du risque pour un domaine à enjeux élevés.',
    },
    {
      type: 'checkpoint',
      xp: 20,
      message: 'Phase 5 complétée : document professionnel prêt !',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'info',
      title: 'Ce que tu viens de faire',
      body: "Tu as cartographié un système complexe. Évalué ses composants pour la constructibilité par agents. Identifié les bloqueurs structurels. Conçu une architecture cible découplée avec des protocoles CLAUDE.md. Créé un graphe de tâches pour une migration parallèle. Et présenté le tout comme un document professionnel. C'est l'ensemble complet de compétences d'un architecte de systèmes agents. Tu ne fais pas qu'UTILISER des agents — tu CONÇOIS des systèmes qui rendent les flottes d'agents maximalement efficaces. Ton jugement est le fossé défensif.",
    },
    {
      type: 'checklist',
      title: 'Compétences capstone démontrées :',
      items: [
        'Cartographie de système : je peux identifier tous les composants et leurs relations de couplage',
        'Évaluation de constructibilité : je peux évaluer tout composant pour son aptitude au développement par flotte d\'agents',
        'Identification des bloqueurs : je peux trouver les causes profondes structurelles qui bloquent le développement parallèle',
        'Conception d\'architecture : je peux concevoir des systèmes pilotés par événements, déployables indépendamment',
        'Rédaction de protocoles : je peux écrire des fichiers CLAUDE.md qui cadrent précisément le travail des agents',
        'Conception de graphe de tâches : je peux séquencer le travail de migration pour un parallélisme maximal',
        'Pipeline de vérification : je peux définir des portes qualité automatisées par package',
        'Communication professionnelle : je peux présenter des redesigns techniques aux parties prenantes',
        'Évaluation des risques : je peux identifier et atténuer les risques de migration de façon proportionnelle',
        'La synthèse complète : je suis un architecte de systèmes agents, pas juste un utilisateur d\'agents',
      ],
    },
    {
      type: 'checkpoint',
      xp: 65,
      message: 'CAPSTONE COMPLÉTÉ. Tu es un architecte de systèmes agents. Tu conçois les systèmes qui rendent les flottes d\'agents maximalement efficaces. Ton jugement — ton goût, ton instinct d\'override, ta conception de contraintes, ta compétence en communication — est le fossé défensif irremplaçable. Livre en conséquence.',
    },
  ],
}

export default content
