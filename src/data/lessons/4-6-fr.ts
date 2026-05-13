import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Architecture au niveau système pour les flottes d\'agents',
      body: "Les frontières de modules gèrent les fonctionnalités individuelles. Mais qu'en est-il de l'architecture globale du système ? Comment concevoir un système où ajouter un agent supplémentaire à la flotte rend les choses PLUS RAPIDES plutôt que plus lentes ? C'est la question de mise à l'échelle. Certaines architectures ont un plafond naturel — après 3 agents concurrents, ajouter un 4e crée plus de surcoût de coordination que de gain de vitesse. D'autres architectures se mettent à l'échelle linéairement : 10 agents travaillant 10x plus vite avec zéro coût de coordination supplémentaire. La différence est dans les patrons au niveau système.",
    },
    {
      type: 'info',
      title: 'La fonction de coût de coordination',
      body: "Dans un système couplé, le coût de coordination croît de façon quadratique avec la taille de l'équipe. 2 agents ont besoin d'1 chemin de coordination. 3 agents en ont besoin de 3. 5 agents en ont besoin de 10. 10 agents en ont besoin de 45. C'est pourquoi les architectures fortement couplées s'effondrent avec plus d'agents — le surcoût de coordination finit par dépasser le travail effectué. Dans un système découplé, le coût de coordination reste plat : chaque agent travaille indépendamment contre un contrat. Ajouter l'agent #11 ne nécessite aucune communication avec les agents 1-10. C'est l'architecture que vous concevez.",
    },

    // === ARCHITECTURAL PATTERNS ===
    {
      type: 'diagram',
      title: 'Couplé vs découplé à l\'échelle',
      body: 'Dans un système couplé, les agents communiquent entre eux (N*N chemins). Dans un système découplé, les agents communiquent uniquement avec les contrats (N chemins).',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'coupled', label: 'Système couplé', sublabel: 'Les agents dépendent les uns des autres', shape: 'rounded' },
          { id: 'c_a1', label: 'Agent 1', shape: 'rect' },
          { id: 'c_a2', label: 'Agent 2', shape: 'rect' },
          { id: 'c_a3', label: 'Agent 3', shape: 'rect' },
          { id: 'decoupled', label: 'Système découplé', sublabel: 'Les agents dépendent des contrats seulement', shape: 'rounded', highlight: true },
          { id: 'contract', label: 'Contrats', sublabel: 'Définitions d\'interface partagées', shape: 'diamond', highlight: true },
          { id: 'd_a1', label: 'Agent 1', shape: 'rect' },
          { id: 'd_a2', label: 'Agent 2', shape: 'rect' },
          { id: 'd_a3', label: 'Agent 3', shape: 'rect' },
        ],
        edges: [
          { from: 'coupled', to: 'c_a1' },
          { from: 'coupled', to: 'c_a2' },
          { from: 'coupled', to: 'c_a3' },
          { from: 'c_a1', to: 'c_a2', dashed: true },
          { from: 'c_a2', to: 'c_a3', dashed: true },
          { from: 'c_a1', to: 'c_a3', dashed: true },
          { from: 'decoupled', to: 'contract' },
          { from: 'contract', to: 'd_a1' },
          { from: 'contract', to: 'd_a2' },
          { from: 'contract', to: 'd_a3' },
        ],
      },
    },
    {
      type: 'compare',
      title: 'Couplé vs découplé : mise à l\'échelle avec les agents',
      body: 'Voyez comment le coût de coordination diffère quand vous ajoutez plus d\'agents à chaque style d\'architecture.',
      left: {
        label: 'Couplé (Casse à 3+ agents)',
        content: '2 agents : 1 chemin de coordination\n  A <-> B\n\n3 agents : 3 chemins de coordination\n  A <-> B\n  A <-> C\n  B <-> C\n\n5 agents : 10 chemins de coordination\n  A <-> B, A <-> C, A <-> D, A <-> E\n  B <-> C, B <-> D, B <-> E\n  C <-> D, C <-> E\n  D <-> E\n\n10 agents : 45 chemins de coordination\n  Surcoût de coordination > travail réel\n  Système PLUS LENT avec plus d\'agents\n\nFormule : N*(N-1)/2 chemins\nCroît de façon QUADRATIQUE',
        language: 'text',
        filename: 'coupled-scaling.txt',
      },
      right: {
        label: 'Découplé (Croît linéairement)',
        content: '2 agents : 2 lectures de contrat\n  A -> Contrat\n  B -> Contrat\n\n3 agents : 3 lectures de contrat\n  A -> Contrat\n  B -> Contrat\n  C -> Contrat\n\n5 agents : 5 lectures de contrat\n  Chaque agent lit les contrats seulement\n  Zéro communication agent-à-agent\n\n10 agents : 10 lectures de contrat\n  Chaque nouvel agent ajoute ZÉRO surcoût\n  Système PLUS RAPIDE avec plus d\'agents\n\nFormule : N chemins\nCroît LINÉAIREMENT',
        language: 'text',
        filename: 'decoupled-scaling.txt',
      },
      question: 'Quelle architecture permet d\'ajouter un 10e agent sans ralentir les agents 1-9 ?',
      correctSide: 'right',
      explanation: 'Dans le système découplé, l\'agent #10 lit les contrats et travaille sur son module indépendamment. Il ne communique jamais avec les agents 1-9. Zéro surcoût de coordination supplémentaire. Dans le système couplé, l\'agent #10 ajoute 9 nouveaux chemins de coordination (un vers chaque agent existant), augmentant le total de 36 à 45 — presque le double du surcoût initial à 2 agents.',
    },
    {
      type: 'interactive-diagram',
      title: 'Croissance couplée vs découplée',
      body: 'Voyez étape par étape comment l\'ajout d\'agents affecte chaque architecture différemment.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'coupled', label: 'Système couplé', sublabel: 'Les agents dépendent les uns des autres', shape: 'rounded' },
          { id: 'c_a1', label: 'Agent 1', shape: 'rect' },
          { id: 'c_a2', label: 'Agent 2', shape: 'rect' },
          { id: 'c_a3', label: 'Agent 3', shape: 'rect' },
          { id: 'decoupled', label: 'Système découplé', sublabel: 'Les agents dépendent des contrats seulement', shape: 'rounded', highlight: true },
          { id: 'contract', label: 'Contrats', sublabel: 'Définitions d\'interface partagées', shape: 'diamond', highlight: true },
          { id: 'd_a1', label: 'Agent 1', shape: 'rect' },
          { id: 'd_a2', label: 'Agent 2', shape: 'rect' },
          { id: 'd_a3', label: 'Agent 3', shape: 'rect' },
        ],
        edges: [
          { from: 'coupled', to: 'c_a1' },
          { from: 'coupled', to: 'c_a2' },
          { from: 'coupled', to: 'c_a3' },
          { from: 'c_a1', to: 'c_a2', dashed: true },
          { from: 'c_a2', to: 'c_a3', dashed: true },
          { from: 'c_a1', to: 'c_a3', dashed: true },
          { from: 'decoupled', to: 'contract' },
          { from: 'contract', to: 'd_a1' },
          { from: 'contract', to: 'd_a2' },
          { from: 'contract', to: 'd_a3' },
        ],
      },
      stages: [
        {
          highlightNodes: ['coupled', 'c_a1', 'c_a2'],
          highlightEdges: [{ from: 'coupled', to: 'c_a1' }, { from: 'coupled', to: 'c_a2' }, { from: 'c_a1', to: 'c_a2' }],
          explanation: 'Avec 2 agents dans un système couplé, il y a 1 chemin de coordination entre eux. Le travail se fait, mais les agents doivent être conscients des changements de l\'autre. Gérable mais pas idéal.',
        },
        {
          highlightNodes: ['coupled', 'c_a1', 'c_a2', 'c_a3'],
          highlightEdges: [{ from: 'coupled', to: 'c_a1' }, { from: 'coupled', to: 'c_a2' }, { from: 'coupled', to: 'c_a3' }, { from: 'c_a1', to: 'c_a2' }, { from: 'c_a2', to: 'c_a3' }, { from: 'c_a1', to: 'c_a3' }],
          explanation: 'Ajouter l\'Agent 3 triple les chemins de coordination (1 à 3). Chaque agent doit maintenant être conscient de 2 autres. Les conflits deviennent courants. Le plafond est proche — ajouter l\'Agent 4 créerait 6 chemins.',
        },
        {
          highlightNodes: ['decoupled', 'contract', 'd_a1', 'd_a2'],
          highlightEdges: [{ from: 'decoupled', to: 'contract' }, { from: 'contract', to: 'd_a1' }, { from: 'contract', to: 'd_a2' }],
          explanation: 'Dans le système découplé, les deux agents communiquent uniquement avec les contrats. Ils n\'ont jamais besoin de connaître l\'existence de l\'autre. 2 chemins au total — un par agent vers les contrats.',
        },
        {
          highlightNodes: ['decoupled', 'contract', 'd_a1', 'd_a2', 'd_a3'],
          highlightEdges: [{ from: 'decoupled', to: 'contract' }, { from: 'contract', to: 'd_a1' }, { from: 'contract', to: 'd_a2' }, { from: 'contract', to: 'd_a3' }],
          explanation: 'Ajouter l\'Agent 3 ajoute exactement 1 nouveau chemin (agent vers contrats). Le total est toujours juste 3 — croissance linéaire. L\'Agent 3 n\'a aucun impact sur les Agents 1 et 2. Vous pourriez ajouter les Agents 4 à 100 avec le même patron. C\'est pourquoi l\'architecture découplée se met à l\'échelle.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Modèle de mise à l\'échelle compris !',
    },

    // === EVENT-DRIVEN ARCHITECTURE ===
    {
      type: 'info',
      title: 'Patron 1 : Architecture événementielle',
      body: "Dans un système événementiel, les modules émettent des événements — ils ne s'appellent pas directement. Quand une commande est passée, le module Commandes émet un événement OrderPlaced. Le module Paiements écoute cet événement et traite le paiement. Le module Courriel écoute et envoie une confirmation. Le module Inventaire écoute et décrémente le stock. Aucun module n'a besoin de savoir que les autres existent. Ça veut dire : les agents qui construisent Paiements n'ont jamais besoin de lire le code de Commandes. Les agents qui construisent Courriel n'ont jamais besoin de se coordonner avec Paiements. Chaque agent travaille contre des événements, pas contre d'autres modules.",
    },
    {
      type: 'code-demo',
      title: 'Indépendance des modules événementiels',
      body: 'Les modules communiquent par événements. Pas d\'appels directs, pas d\'état mutable partagé, pas de coordination nécessaire entre les agents construisant différents modules.',
      language: 'typescript',
      filename: 'event-driven-pattern.ts',
      code: "// === Event Definitions (the shared contract) ===\n// src/events/order.events.ts\nexport interface OrderEvents {\n  'order.placed': {\n    orderId: string\n    customerId: string\n    items: Array<{ productId: string; quantity: number; priceCents: number }>\n    totalCents: number\n  }\n  'order.cancelled': {\n    orderId: string\n    reason: string\n  }\n  'order.shipped': {\n    orderId: string\n    trackingNumber: string\n  }\n}\n\n// === Orders module (Agent A builds this) ===\n// src/features/orders/orders.service.ts\nimport { eventBus } from '@/infrastructure/event-bus'\n\nexport async function placeOrder(input: PlaceOrderInput) {\n  const order = await db.orders.create(input)\n  \n  // Emit event — Orders does NOT know who listens\n  eventBus.emit('order.placed', {\n    orderId: order.id,\n    customerId: input.customerId,\n    items: input.items,\n    totalCents: order.totalCents,\n  })\n  \n  return order\n}\n\n// === Payments module (Agent B builds this) ===\n// src/features/payments/payments.listeners.ts\nimport { eventBus } from '@/infrastructure/event-bus'\n\neventBus.on('order.placed', async (event) => {\n  await chargeCustomer(event.customerId, event.totalCents)\n})\n\n// === Email module (Agent C builds this) ===\n// src/features/emails/email.listeners.ts\nimport { eventBus } from '@/infrastructure/event-bus'\n\neventBus.on('order.placed', async (event) => {\n  await sendOrderConfirmation(event.customerId, event.orderId)\n})",
    },
    {
      type: 'info',
      title: 'Pourquoi l\'événementiel permet le parallélisme des agents',
      body: "Avec des appels de fonction directs, ajouter une notification quand une commande est passée nécessite de modifier le module Commandes (ajouter un appel au service de notification). Ça veut dire que l'agent qui construit les notifications DOIT aussi toucher le code de Commandes — risque de conflit. Avec les événements, l'agent qui construit les notifications ajoute juste un nouveau listener. Il ne touche jamais Commandes. Ne touche jamais Paiements. N'entre jamais en conflit avec aucun autre agent. Le bus d'événements est le mécanisme de coordination qui remplace le couplage direct module-à-module.",
    },
    {
      type: 'multiple-choice',
      question: 'Un nouveau besoin métier : quand une commande est passée, mettre à jour les points de fidélité du client. Dans un système événementiel, quels fichiers l\'agent doit-il modifier ?',
      options: [
        'orders.service.ts (pour appeler la mise à jour de fidélité) et loyalty.service.ts (pour l\'implémenter)',
        'Seulement loyalty.listeners.ts (s\'abonner à l\'événement order.placed) et loyalty.service.ts (implémenter la logique)',
        'order.events.ts (ajouter les données de fidélité à l\'événement), orders.service.ts et loyalty.service.ts',
        'La configuration du bus d\'événements et le module de fidélité',
      ],
      correctIndex: 1,
      explanation: 'Dans un système correctement événementiel, l\'événement order.placed contient déjà toutes les données nécessaires (customerId, totalCents). Le module de fidélité s\'abonne simplement à cet événement existant et implémente sa propre logique. Zéro changement au module Commandes. Zéro risque de conflit avec d\'autres agents travaillant sur Commandes ou d\'autres fonctionnalités écoutant le même événement.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Architecture événementielle maîtrisée !',
    },

    // === CONTRACT-FIRST DEVELOPMENT ===
    {
      type: 'info',
      title: 'Patron 2 : Développement contrat-d\'abord',
      body: "Définissez toutes les interfaces AVANT toute implémentation. L'architecte (vous) écrit les contrats : schémas d'API, types d'événements, interfaces de base de données, frontières de modules. Puis vous envoyez les agents — chaque agent implémente un module contre les contrats. Aucun agent n'a besoin d'attendre un autre. Aucun agent n'a besoin de lire l'implémentation d'un autre. Les contrats sont le SEUL mécanisme de coordination. C'est le patron qui permet le parallélisme maximum : N agents construisant N modules simultanément avec zéro conflit.",
    },
    {
      type: 'code-demo',
      title: 'Flux de travail contrat-d\'abord',
      body: 'Vous écrivez les contrats d\'abord. Puis N agents implémentent en parallèle. Chaque agent lit seulement les contrats et son propre module.',
      language: 'typescript',
      filename: 'contract-first.ts',
      code: "// === STEP 1: Architect writes ALL contracts ===\n\n// src/contracts/api.contract.ts\nexport interface API {\n  'POST /orders': {\n    body: { items: CartItem[]; shippingAddress: Address }\n    response: { orderId: string; estimatedDelivery: Date }\n  }\n  'GET /orders/:id': {\n    params: { id: string }\n    response: Order\n  }\n  'POST /payments/charge': {\n    body: { orderId: string; paymentMethod: string }\n    response: { transactionId: string; status: 'success' | 'failed' }\n  }\n}\n\n// src/contracts/events.contract.ts\nexport interface SystemEvents {\n  'order.placed': { orderId: string; customerId: string; totalCents: number }\n  'payment.completed': { orderId: string; transactionId: string }\n  'shipment.created': { orderId: string; trackingNumber: string }\n}\n\n// src/contracts/repositories.contract.ts\nexport interface OrderRepository {\n  create(input: CreateOrderInput): Promise<Order>\n  findById(id: string): Promise<Order | null>\n  updateStatus(id: string, status: OrderStatus): Promise<void>\n}\n\n// === STEP 2: Dispatch agents in parallel ===\n// Agent A: Implement Orders (builds to API + Events + Repository contracts)\n// Agent B: Implement Payments (builds to API + Events contracts)\n// Agent C: Implement Notifications (builds to Events contract)\n// Agent D: Implement Shipping (builds to Events contract)\n// All work simultaneously. Zero coordination needed.",
    },
    {
      type: 'info',
      title: 'Le livrable de l\'architecte',
      body: "Dans le développement contrat-d'abord, votre sortie principale n'est pas du code — ce sont des contrats. Vous écrivez : des schémas d'API (quels endpoints existent, quelles données circulent), des définitions d'événements (quels événements sont émis, quelles données ils transportent), des interfaces de module (ce que chaque module expose aux autres) et des schémas de données (quelles tables existent, quelles colonnes elles ont). Ça prend 1-2 heures. Puis 5 agents implémentent le système entier en parallèle — chacun construisant contre vos contrats indépendamment. Temps total écoulé : le plus long module individuel, pas la somme de tous les modules.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Contrat-d\'abord assimilé !',
    },

    // === MODULAR MONOLITH ===
    {
      type: 'info',
      title: 'Patron 3 : Le monolithe modulaire avec des coutures claires',
      body: "Vous n'avez pas besoin de microservices pour obtenir le parallélisme des agents. Un monolithe modulaire — une unité de déploiement avec des frontières de modules strictement appliquées — vous donne tous les avantages du parallélisme sans aucun surcoût opérationnel. La clé : les modules communiquent uniquement par des interfaces définies. Pas d'accès aux entrailles d'un autre module. Pas de tables de base de données partagées entre modules. Pas de dépendances circulaires. Chaque module est déployé ensemble mais développé indépendamment. C'est souvent l'architecture idéale pour les flottes d'agents : parallélisme de développement maximum, complexité opérationnelle minimum.",
    },
    {
      type: 'code-demo',
      title: 'Monolithe modulaire avec frontières appliquées',
      body: 'Une unité déployable. Isolation de module stricte appliquée par les règles d\'import. Chaque module est constructible indépendamment par un agent.',
      language: 'typescript',
      filename: 'modular-monolith.ts',
      code: "// === Architecture: Modular Monolith ===\n//\n// Rules (enforced in CLAUDE.md + linter):\n// 1. Modules ONLY import from other modules via their index.ts\n// 2. No module accesses another module's database tables\n// 3. Cross-module communication via event bus OR defined interfaces\n// 4. Each module owns its own migrations\n\n// src/features/orders/index.ts — PUBLIC API\nexport { placeOrder, cancelOrder, getOrder } from './orders.service'\nexport type { Order, OrderStatus } from './orders.types'\n// Everything else is internal — other modules cannot import it\n\n// src/features/payments/index.ts — PUBLIC API  \nexport { chargePayment, refundPayment } from './payments.service'\nexport type { Payment, PaymentStatus } from './payments.types'\n\n// Enforcement via ESLint rule:\n// eslint-plugin-boundaries or custom rule:\n{\n  \"rules\": {\n    \"boundaries/element-types\": [\n      \"error\",\n      {\n        \"default\": {\n          \"allow\": [\"[same-module]\"]\n        },\n        \"rules\": [\n          {\n            \"from\": \"features/*\",\n            \"allow\": [\"features/*/index\", \"contracts/*\", \"infrastructure/*\"]\n          }\n        ]\n      }\n    ]\n  }\n}\n\n// If Agent A tries to import from features/payments/payments.service.ts\n// (bypassing the index), the linter catches it immediately.",
    },
    {
      type: 'multiple-choice',
      question: 'Quel est le principal avantage d\'un monolithe modulaire par rapport aux microservices pour le développement en flotte d\'agents ?',
      options: [
        'Meilleure performance grâce à l\'absence d\'appels réseau entre modules',
        'Même parallélisme de développement (modules indépendants) mais complexité opérationnelle drastiquement plus basse (un seul déploiement, une seule base de données, un seul setup de monitoring)',
        'Plus facile à comprendre pour les agents parce que c\'est une seule codebase',
        'Les microservices nécessitent des containers que les agents ne peuvent pas configurer',
      ],
      correctIndex: 1,
      explanation: 'Le monolithe modulaire vous donne l\'isolation au niveau du développement qui permet le travail parallèle des agents (chaque module est indépendant) sans la taxe opérationnelle des microservices (déploiements multiples, fiabilité réseau, traçage distribué, découverte de services). Vous obtenez les avantages du parallélisme au niveau du code sans la complexité d\'infrastructure au niveau opérationnel.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Patron du monolithe modulaire maîtrisé !',
    },

    // === EVENT SOURCING & CQRS ===
    {
      type: 'info',
      title: 'Patron 4 : Event sourcing pour la gestion d\'état sûre pour les agents',
      body: "Avec l'event sourcing, vous ne mutez jamais l'état directement. À la place, vous enregistrez des événements : OrderPlaced, PaymentCharged, ItemShipped. L'état actuel est dérivé en rejouant les événements. Pourquoi c'est favorable aux agents ? Parce que les événements sont en append-only. Deux agents ne peuvent jamais entrer en conflit sur une mutation d'état — ils ajoutent juste de nouveaux événements. Et le journal d'événements fournit une piste d'audit complète que les agents peuvent lire pour comprendre ce qui s'est passé, sans avoir besoin de connaissances tribales sur les transitions d'état.",
    },
    {
      type: 'code-demo',
      title: 'L\'event sourcing élimine les conflits d\'état',
      body: 'Plusieurs agents peuvent ajouter des événements simultanément sans conflits. L\'état est dérivé, jamais muté directement.',
      language: 'typescript',
      filename: 'event-sourcing.ts',
      code: "// === Event Store (append-only, never conflicts) ===\n\ninterface DomainEvent {\n  id: string\n  aggregateId: string\n  type: string\n  data: Record<string, unknown>\n  timestamp: Date\n  version: number\n}\n\n// Agent A works on order placement:\nawait eventStore.append({\n  aggregateId: orderId,\n  type: 'OrderPlaced',\n  data: { customerId, items, totalCents },\n})\n\n// Agent B works on payment processing (simultaneously, no conflict):\nawait eventStore.append({\n  aggregateId: orderId,\n  type: 'PaymentCharged',\n  data: { transactionId, amountCents },\n})\n\n// Agent C works on shipping (simultaneously, no conflict):\nawait eventStore.append({\n  aggregateId: orderId,\n  type: 'ShipmentCreated',\n  data: { trackingNumber, carrier },\n})\n\n// Current state derived by replaying events:\nfunction deriveOrderState(events: DomainEvent[]): OrderState {\n  return events.reduce((state, event) => {\n    switch (event.type) {\n      case 'OrderPlaced':\n        return { ...state, status: 'placed', ...event.data }\n      case 'PaymentCharged':\n        return { ...state, status: 'paid', transactionId: event.data.transactionId }\n      case 'ShipmentCreated':\n        return { ...state, status: 'shipped', tracking: event.data.trackingNumber }\n      default:\n        return state\n    }\n  }, {} as OrderState)\n}",
    },
    {
      type: 'info',
      title: 'Quand l\'event sourcing est excessif',
      body: "L'event sourcing ajoute de la complexité : vous avez besoin de magasins d'événements, de logique de rejeu, de gestion de cohérence éventuelle et de stratégies de snapshots pour les longs flux d'événements. C'est justifié quand : (1) vous avez besoin d'une piste d'audit complète, (2) plusieurs agents modifient fréquemment le même agrégat, (3) vous avez besoin de requêtes temporelles (« quel était l'état au temps X ? »). Ce n'est PAS justifié pour du CRUD simple avec peu de contention en écriture. Utilisez le cadre d'évaluation de la Leçon 4-4 : est-ce que le problème nécessite vraiment ça, ou une approche plus simple suffit-elle ?",
    },

    // === SCALE FACTOR ===
    {
      type: 'info',
      title: 'Le facteur d\'échelle : est-ce qu\'ajouter des agents aide ou nuit ?',
      body: "Voici le test décisif ultime pour votre architecture. Imaginez que vous utilisez actuellement 3 agents. Vous en ajoutez un 4e. Le système se construit-il PLUS VITE ou PLUS LENTEMENT ? Plus vite : votre architecture se met à l'échelle. Chaque agent travaille sur une unité indépendante. Aucun surcoût de coordination n'augmente. Plus lentement : votre architecture a atteint un plafond. Le 4e agent crée des conflits, attend les autres ou duplique du travail. Mesurez ça empiriquement : chronométrez combien N agents prennent pour compléter M tâches, puis essayez N+1 agents sur la même charge.",
    },
    {
      type: 'multiple-choice',
      question: 'Vous utilisez 4 agents en parallèle. Ajouter un 5e agent rend le temps total de construction PLUS LONG. Quelle est la cause architecturale la plus probable ?',
      options: [
        'Le 5e agent est plus lent que les autres',
        'Il n\'y a que 4 modules indépendants — le 5e agent n\'a rien sur quoi travailler qui n\'entre pas en conflit avec les 4 autres',
        'Le bus d\'événements ne peut pas gérer 5 éditeurs simultanés',
        'Les fenêtres de contexte des agents sont trop petites pour 5 sessions concurrentes',
      ],
      correctIndex: 1,
      explanation: 'Si vous avez 4 unités de travail indépendantes et 5 agents, un agent sera soit inactif soit tentera de travailler sur un module qu\'un autre agent est déjà en train de modifier — causant des conflits qui prennent du temps à résoudre. Le correctif est architectural : décomposer davantage pour créer plus d\'unités de travail indépendantes, ou accepter que 4 est votre plafond de parallélisme pour cette architecture.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Facteur d\'échelle compris !',
    },

    // === PATTERN SELECTION ===
    {
      type: 'info',
      title: 'Choisir le bon patron',
      body: "Tous les systèmes n'ont pas besoin de chaque patron. Le choix dépend de vos besoins de mise à l'échelle. Pour une flotte de 2-3 agents : un monolithe modulaire avec des frontières claires est généralement suffisant. Pour 4-8 agents : ajoutez la communication événementielle entre modules. Pour 8+ agents : envisagez l'event sourcing pour les agrégats à forte contention et un flux de travail de développement contrat-d'abord. Commencez plus simple et ajoutez de la complexité seulement quand vous mesurez que votre plafond de parallélisme a été atteint. Sur-ingénierer la couche de coordination est autant un échec que la sous-ingénierer.",
    },
    {
      type: 'order',
      instruction: 'Ordonnez ces patrons architecturaux du plus simple (moins d\'agents) au plus complexe (plus grandes flottes) :',
      items: [
        'Event sourcing pour l\'état à forte contention',
        'Répertoires par fonctionnalité avec modules clairs',
        'Contrat-d\'abord complet avec communication événementielle',
        'Monolithe modulaire avec frontières appliquées',
        'Appels de fonctions directs entre modules bien nommés',
      ],
      correctOrder: [4, 1, 3, 2, 0],
    },
    {
      type: 'code-demo',
      title: 'Guide de sélection de patron',
      body: 'Faites correspondre votre architecture à la taille de votre flotte d\'agents. La sur-ingénierie est aussi nuisible que la sous-ingénierie.',
      language: 'markdown',
      filename: 'pattern-selection.md',
      code: "# Pattern Selection Guide\n\n## 1-2 Agents (solo or pair)\n- Feature-based directories\n- Consistent naming conventions\n- Collocated tests\n- Simple CLAUDE.md\n- Direct function calls between modules\n\n## 3-5 Agents (small fleet)\n- Modular monolith with index.ts public APIs\n- ESLint boundary enforcement\n- Module-specific CLAUDE.md files\n- Per-module database migrations\n- Interface contracts for adjacent modules\n\n## 5-8 Agents (medium fleet)\n- Event-driven communication between modules\n- Contract-first development workflow\n- Event bus for decoupling\n- Separate test suites per module\n- Conflict rate monitoring (<5% target)\n\n## 8+ Agents (large fleet)\n- Event sourcing for high-contention areas\n- CQRS where read/write patterns differ\n- Full contract suite (API, events, repos)\n- Automated boundary violation detection\n- Parallelism ceiling monitoring",
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'L\'architecture système comme multiplicateur',
      body: "Votre architecture EST la limite de combien d'agents peuvent travailler productivement en parallèle. Un système bien conçu avec des frontières événementielles et des contrats clairs se met à l'échelle linéairement — chaque agent supplémentaire ajoute une vitesse proportionnelle. Un système mal conçu avec un état partagé et un couplage serré atteint un plafond à 2-3 agents, après quoi plus d'agents rendent les choses plus lentes. Le travail de l'architecte dans un monde agent-natif est de pousser ce plafond aussi haut que possible en choisissant des patrons qui minimisent le coût de coordination et maximisent les unités de travail indépendantes.",
    },
    {
      type: 'multiple-choice',
      question: 'Un monolithe modulaire événementiel avec 6 modules de fonctionnalités indépendants. Vous voulez ajouter une 7e fonctionnalité qui a besoin de données de 3 modules existants. Comment la concevoir pour maintenir le parallélisme ?',
      options: [
        'Faire importer le nouveau module directement depuis les 3 modules existants',
        'Le nouveau module s\'abonne aux événements de ces 3 modules — pas d\'imports directs, pas de modifications au code existant',
        'Fusionner les 3 modules en un super-module que la nouvelle fonctionnalité étend',
        'Créer une vue de base de données partagée qui combine les données des 3 modules',
      ],
      correctIndex: 1,
      explanation: 'L\'abonnement aux événements est la clé. Le nouveau module écoute les événements déjà émis par les 3 modules existants. Il ne modifie jamais leur code. L\'agent construisant le module 7 n\'entre pas en conflit avec les agents travaillant sur les modules 1-6. Aucun changement de code existant. Pas d\'état mutable partagé. Le bus d\'événements transporte les données sans couplage.',
    },
    {
      type: 'checklist',
      title: 'Liste de vérification de l\'architecture parallèle au niveau système :',
      items: [
        'Je comprends que le coût de coordination croît de façon quadratique dans les systèmes couplés',
        'Je peux concevoir des systèmes événementiels où les modules émettent des événements au lieu de s\'appeler',
        'Je pratique le développement contrat-d\'abord : définir les interfaces, puis envoyer les agents en parallèle',
        'Je sais quand utiliser un monolithe modulaire vs ajouter la complexité de l\'event sourcing',
        'Je mesure le facteur d\'échelle : est-ce qu\'ajouter un agent accélère ou ralentit la flotte ?',
        'Je fais correspondre la complexité architecturale à la taille de la flotte (ne pas sur-ingénierer pour 2 agents)',
        'Je peux identifier mon plafond de parallélisme et sais quel patron le relève',
      ],
    },
    {
      type: 'checkpoint',
      xp: 19,
      message: 'Architecture parallèle au niveau système maîtrisée ! Vous pouvez maintenant concevoir des systèmes où les flottes d\'agents se mettent à l\'échelle linéairement.',
    },
  ],
}

export default content
