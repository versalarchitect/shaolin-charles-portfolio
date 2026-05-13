import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Pourquoi les intégrations sont différentes',
      body: "Un agent peut scaffolder une app CRUD rapidement parce que la logique est autonome. Les intégrations tierces sont différentes. Elles impliquent des APIs externes avec leurs propres règles, des webhooks qui arrivent de manière asynchrone, des modes de défaillance que l'agent n'a jamais vus dans ses données d'entraînement, et des exigences d'idempotence faciles à oublier. Quand vous dirigez un agent à travers une intégration Stripe, vous ne lui demandez pas d'écrire du code — vous lui demandez de gérer correctement un système distribué. Ça nécessite un type de spec différent.",
    },
    {
      type: 'info',
      title: 'La différence de la spec d\'intégration',
      body: "Une spec de fonctionnalité normale dit quoi construire. Une spec d'intégration doit aussi décrire ce qui peut mal tourner. Les flux de paiement ont des défaillances partielles (facturé mais pas livré), des webhooks en double (Stripe réessaie sur 5xx), des conditions de concurrence (l'utilisateur clique payer deux fois), et des incohérences d'état (la BD locale dit payé, Stripe dit remboursé). Si votre spec ne liste pas explicitement ces cas, l'agent construira le chemin heureux parfaitement et vous laissera des bugs de production qui coûtent de l'argent réel.",
    },

    // === PAYMENT FLOW SPEC ===
    {
      type: 'interactive-diagram',
      title: 'Flux Stripe Checkout',
      body: 'Le flux de paiement complet du clic utilisateur à la livraison. Chaque flèche est un point de défaillance potentiel.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'click', label: 'L\'utilisateur clique Payer', shape: 'pill' },
          { id: 'session', label: 'Créer Session Checkout', sublabel: 'Côté serveur', shape: 'rounded' },
          { id: 'stripe', label: 'Page Hébergée Stripe', sublabel: 'L\'utilisateur entre sa carte', shape: 'rect' },
          { id: 'webhook', label: 'Webhook Reçu', sublabel: 'checkout.session.completed', shape: 'rounded', highlight: true },
          { id: 'fulfill', label: 'Livrer Commande', sublabel: 'Mise à jour BD, envoi email', shape: 'rect' },
          { id: 'confirm', label: 'Page Succès', sublabel: 'L\'utilisateur voit la confirmation', shape: 'pill' },
        ],
        edges: [
          { from: 'click', to: 'session' },
          { from: 'session', to: 'stripe' },
          { from: 'stripe', to: 'webhook', label: 'async' },
          { from: 'stripe', to: 'confirm', label: 'redirect' },
          { from: 'webhook', to: 'fulfill' },
          { from: 'fulfill', to: 'confirm', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['click', 'session'],
          highlightEdges: [{ from: 'click', to: 'session' }],
          explanation: 'L\'utilisateur clique Payer. Votre serveur crée une Session Stripe Checkout avec le produit, le prix et les métadonnées. Une défaillance ici signifie que votre serveur est en panne — affichez une erreur sur le bouton.',
        },
        {
          highlightNodes: ['session', 'stripe'],
          highlightEdges: [{ from: 'session', to: 'stripe' }],
          explanation: 'L\'utilisateur est redirigé vers la page de paiement hébergée par Stripe. Stripe gère la saisie de carte, la validation et 3D Secure. Vous n\'avez aucun contrôle ici — Stripe est propriétaire de cette étape.',
        },
        {
          highlightNodes: ['stripe', 'confirm'],
          highlightEdges: [{ from: 'stripe', to: 'confirm' }],
          explanation: 'Après le paiement, Stripe redirige l\'utilisateur vers votre page de succès. Mais l\'utilisateur pourrait fermer le navigateur avant que la redirection ne se termine — donc ne livrez jamais sur le redirect seul.',
        },
        {
          highlightNodes: ['stripe', 'webhook'],
          highlightEdges: [{ from: 'stripe', to: 'webhook' }],
          explanation: 'Stripe envoie un webhook de manière asynchrone. C\'est le chemin fiable — Stripe réessaie en cas d\'échec. Le webhook peut arriver avant ou après la redirection. Votre handler doit vérifier la signature.',
        },
        {
          highlightNodes: ['webhook', 'fulfill'],
          highlightEdges: [{ from: 'webhook', to: 'fulfill' }],
          explanation: 'Le webhook déclenche la livraison : mise à jour de la base de données, envoi de l\'email de confirmation, provisionnement de l\'accès. Ceci doit être idempotent — Stripe peut envoyer le même webhook plusieurs fois.',
        },
        {
          highlightNodes: ['fulfill', 'confirm'],
          highlightEdges: [{ from: 'fulfill', to: 'confirm' }],
          explanation: 'La page de succès affiche le statut de la commande. Si le webhook n\'est pas encore arrivé, affichez un état de chargement. Utilisez du polling ou du temps réel pour mettre à jour quand la livraison est terminée.',
        },
      ],
    },
    {
      type: 'code-demo',
      title: 'Spec d\'intégration : Stripe Checkout',
      body: 'Cette spec mentionne explicitement les modes de défaillance et l\'idempotence. Remarquez combien concerne ce qui peut mal tourner, pas ce qui va bien.',
      language: 'markdown',
      filename: 'specs/payments.md',
      code: "# Payment Integration Spec — Stripe Checkout\n\n## Goal\nUsers can purchase a plan via Stripe Checkout. Fulfillment happens\nvia webhook, not on redirect (redirect is unreliable).\n\n## Constraints\n- Stripe SDK (`stripe` npm package)\n- Webhook signature verification (STRIPE_WEBHOOK_SECRET)\n- Idempotent fulfillment (same webhook delivered twice = same result)\n- All prices defined in Stripe Dashboard, not hardcoded\n\n## Acceptance Criteria\n- [ ] POST /api/checkout creates a Stripe Checkout Session\n- [ ] Webhook endpoint verifies signature before processing\n- [ ] checkout.session.completed triggers order fulfillment\n- [ ] Duplicate webhooks do not create duplicate orders\n- [ ] Failed fulfillment does not return 200 (Stripe retries)\n- [ ] Success page works even if webhook hasn't arrived yet\n- [ ] Refund webhook (charge.refunded) updates order status\n\n## Failure Cases (MUST HANDLE)\n1. Webhook arrives before redirect — user sees \"processing\"\n2. Webhook arrives twice — second is no-op\n3. Fulfillment fails (DB error) — return 500, Stripe retries\n4. User refreshes success page — show current order state\n5. Stripe is down — checkout button shows error, no crash\n\n## Out of Scope\n- Subscription billing (one-time only)\n- Promo codes\n- Tax calculation\n- Invoice PDF generation",
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi la spec dit « La livraison se fait via webhook, pas au redirect » ?',
      options: [
        'Les webhooks sont plus rapides que les redirects',
        'Les redirects peuvent échouer (l\'utilisateur ferme le navigateur) — les webhooks garantissent la livraison',
        'Stripe exige une livraison basée sur webhook',
        'C\'est plus facile à implémenter',
      ],
      correctIndex: 1,
      explanation: 'Le redirect vers votre site dépend du navigateur de l\'utilisateur. Il pourrait fermer l\'onglet, perdre la connexion, ou naviguer ailleurs. Stripe garantit la livraison des webhooks (avec réessais). La livraison doit utiliser le chemin fiable. C\'est le genre de décision architecturale que vous devez spécifier — un agent pourrait par défaut livrer au redirect parce que ça semble plus simple.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Structure de spec d\'intégration comprise !',
    },

    // === DIRECTING THE BUILD ===
    {
      type: 'info',
      title: 'Diriger l\'agent : approche par phases',
      body: "Ne remettez pas toute la spec à l'agent en disant « construis ». Le travail d'intégration devrait être phasé : (1) Configurer le SDK Stripe et les variables d'environnement, (2) Construire l'endpoint de création de session checkout, (3) Construire le handler de webhook avec vérification de signature, (4) Ajouter la livraison idempotente, (5) Gérer les cas de défaillance. Chaque phase produit un résultat testable. Vous vérifiez avant de passer à la phase suivante.",
    },
    {
      type: 'code-demo',
      title: 'Prompt phase 1 : configuration du SDK',
      body: 'Commencez par les fondations. Vérifiez que l\'environnement et le SDK fonctionnent avant de construire la logique.',
      language: 'text',
      filename: 'prompt-phase-1.txt',
      code: "Install the Stripe SDK and set up environment variables.\n\nRequirements:\n- Add `stripe` package\n- Create `src/lib/stripe.ts` that exports an initialized Stripe client\n- Read STRIPE_SECRET_KEY from env\n- Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.example\n- Do NOT create any endpoints yet — just the SDK setup\n\nWhen done, I should be able to import { stripe } from '@/lib/stripe'\nand call stripe.customers.list() without errors.",
    },
    {
      type: 'terminal',
      instruction: 'Après que l\'agent a configuré Stripe, vérifiez que le SDK fonctionne en lançant le CLI Stripe pour confirmer votre configuration locale.',
      expectedCommand: 'stripe listen --forward-to localhost:3000/api/webhooks/stripe',
      hint: 'Utilisez stripe listen pour transmettre les événements webhook à votre serveur local',
    },
    {
      type: 'code-demo',
      title: 'Prompt phase 3 : handler de webhook',
      body: 'Le handler de webhook est là où vivent la plupart des bugs d\'intégration. Soyez explicite sur la vérification et les codes de réponse.',
      language: 'text',
      filename: 'prompt-phase-3.txt',
      code: "Build the webhook handler at `src/app/api/webhooks/stripe/route.ts`.\n\nCritical requirements:\n1. Read raw body (NOT parsed JSON) for signature verification\n2. Verify webhook signature using STRIPE_WEBHOOK_SECRET\n3. Return 400 immediately if signature fails\n4. Handle event type: checkout.session.completed\n5. Return 200 ONLY after successful processing\n6. Return 500 if processing fails (triggers Stripe retry)\n7. Log the event ID for debugging\n\nDo NOT implement fulfillment logic yet — just log\n\"Fulfilling order for session {id}\" and return 200.\nI want to test the webhook pipeline first.",
    },
    {
      type: 'terminal',
      instruction: 'Déclenchez un webhook de test pour vérifier que le handler reçoit et traite les événements correctement.',
      expectedCommand: 'stripe trigger checkout.session.completed',
      hint: 'Utilisez stripe trigger pour envoyer un événement test à votre handler de webhook',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Direction d\'intégration par phases maîtrisée !',
    },

    // === IDEMPOTENCY ===
    {
      type: 'info',
      title: 'Idempotence : le non-négociable',
      body: "Stripe livre les webhooks au moins une fois — ce qui veut dire que le même événement peut arriver plusieurs fois. Si votre logique de livraison crée un enregistrement à chaque livraison, vous obtenez des commandes en double, des emails en double, ou des crédits en double. Idempotent signifie : traiter la même entrée deux fois produit le même résultat que la traiter une fois. L'agent va presque certainement sauter ça à moins que vous ne le spécifiiez. C'est le bug le plus courant dans le code de paiement généré par un agent.",
    },
    {
      type: 'code-demo',
      title: 'Pattern de livraison idempotente',
      body: 'La clé d\'idempotence est l\'ID d\'événement Stripe ou l\'ID de session checkout. Vérifier-puis-créer avec une contrainte unique.',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      code: "import { db } from '@/db'\nimport { orders } from '@/db/schema'\nimport { eq } from 'drizzle-orm'\n\nexport async function fulfillOrder(sessionId: string, data: OrderData) {\n  // Check if already fulfilled (idempotency)\n  const existing = await db.query.orders.findFirst({\n    where: eq(orders.stripeSessionId, sessionId),\n  })\n\n  if (existing) {\n    // Already fulfilled — this is a retry, not a new order\n    console.log(`Order already fulfilled for session ${sessionId}`)\n    return existing\n  }\n\n  // Fulfill: create order + send email\n  // The stripeSessionId column has a UNIQUE constraint as a safety net\n  const order = await db.insert(orders).values({\n    stripeSessionId: sessionId,\n    email: data.customerEmail,\n    amount: data.amountTotal,\n    status: 'fulfilled',\n  }).returning()\n\n  await sendConfirmationEmail(order[0])\n  return order[0]\n}",
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent construit un handler de webhook qui utilise l\'ID d\'événement Stripe comme clé d\'idempotence. Est-ce correct ?',
      options: [
        'Non — vous devriez utiliser l\'ID de session checkout parce que les événements peuvent être renvoyés avec de nouveaux IDs',
        'Oui — chaque livraison d\'événement a le même ID d\'événement, ce qui en fait une clé d\'idempotence fiable',
        'Non — vous devriez utiliser un UUID généré sur votre serveur',
        'Ça dépend de si vous utilisez Stripe Connect',
      ],
      correctIndex: 1,
      explanation: 'Les réessais Stripe utilisent le même ID d\'événement (evt_xxx). Quand Stripe réessaie une livraison de webhook échouée, il envoie le même objet événement avec le même ID. Ça en fait une clé d\'idempotence fiable. L\'ID de session checkout fonctionne aussi mais est moins granulaire si vous gérez plusieurs types d\'événements par session.',
    },
    {
      type: 'compare',
      title: 'Webhook sans vs avec idempotence',
      body: 'Stripe envoie les webhooks au moins une fois — parfois plusieurs fois. Votre handler doit gérer les doublons.',
      question: 'Quel handler est sûr quand Stripe réessaie le même webhook ?',
      correctSide: 'right',
      left: {
        label: 'Non idempotent',
        content: 'async function handleCheckout(session) {\n  // Danger: creates duplicate on retry!\n  await db.insert(orders).values({\n    userId: session.metadata.userId,\n    amount: session.amount_total,\n    status: "paid"\n  })\n  await sendConfirmationEmail(session)\n}',
        language: 'typescript',
      },
      right: {
        label: 'Idempotent',
        content: 'async function handleCheckout(session) {\n  // Safe: check before creating\n  const existing = await db.query.orders\n    .findFirst({\n      where: eq(orders.sessionId, session.id)\n    })\n  if (existing) return // Already processed\n\n  await db.insert(orders).values({\n    sessionId: session.id,\n    userId: session.metadata.userId,\n    amount: session.amount_total,\n    status: "paid"\n  })\n  await sendConfirmationEmail(session)\n}',
        language: 'typescript',
      },
      explanation: 'La version idempotente vérifie si la commande existe déjà en utilisant l\'ID de session Stripe comme clé unique. Si Stripe réessaie le webhook, le handler retourne immédiatement au lieu de créer un doublon.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez la logique de livraison idempotente :',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      template: 'async function fulfillOrder(session: Stripe.Checkout.Session) {\n  const existing = await db.query.orders.findFirst({\n    where: eq(orders.{{unique_key}}, session.{{session_field}})\n  })\n  if ({{guard_check}}) return existing\n\n  return await db.insert(orders).values({\n    sessionId: session.id,\n    userId: session.metadata.userId,\n    status: "{{initial_status}}"\n  })\n}',
      blanks: [
        { id: 'unique_key', answer: 'sessionId', alternatives: ['session_id', 'stripeSessionId'], placeholder: 'quelle colonne ?', hint: 'La colonne qui stocke l\'identifiant de session Stripe' },
        { id: 'session_field', answer: 'id', placeholder: 'quel champ ?', hint: 'L\'identifiant unique sur l\'objet session Stripe' },
        { id: 'guard_check', answer: 'existing', alternatives: ['existing !== null', 'existing != null'], placeholder: 'que vérifier ?', hint: 'Si cette valeur est vraie, la commande a déjà été traitée' },
        { id: 'initial_status', answer: 'paid', alternatives: ['completed', 'fulfilled'], placeholder: 'statut de commande ?' },
      ],
      explanation: 'L\'ID de session est la clé d\'idempotence. Si une commande avec cet ID de session existe, on saute — empêchant les doublons peu importe combien de fois Stripe réessaie.',
    },

    // === FAILURE VERIFICATION ===
    {
      type: 'info',
      title: 'Vérifier la gestion des défaillances',
      body: "Le chemin heureux fonctionne. Maintenant cassez-le. Dirigez l'agent pour vous aider à vérifier les cas de défaillance : Que se passe-t-il si la BD est en panne pendant la livraison ? Le webhook retourne-t-il 500 pour que Stripe réessaie ? Que se passe-t-il si l'utilisateur arrive sur la page de succès avant l'arrivée du webhook ? La page fait-elle du polling ou affiche un état de chargement ? Testez tout ça explicitement — ne faites pas confiance que l'agent les a implémentés juste parce que la spec les listait.",
    },
    {
      type: 'code-demo',
      title: 'Tester les scénarios de défaillance',
      body: 'Utilisez le CLI Stripe pour simuler les cas limites. Chaque test vérifie un mode de défaillance spécifique.',
      language: 'bash',
      filename: 'test-failures.sh',
      code: "# Test 1: Duplicate webhook (idempotency)\nstripe trigger checkout.session.completed\nstripe trigger checkout.session.completed\n# Expected: second call logs \"already fulfilled\", no duplicate order\n\n# Test 2: Check signature verification\ncurl -X POST http://localhost:3000/api/webhooks/stripe \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"type\": \"checkout.session.completed\"}'\n# Expected: 400 response (no valid signature)\n\n# Test 3: Verify retry behavior\n# Temporarily make fulfillment throw an error\n# Expected: webhook returns 500, Stripe will retry",
    },
    {
      type: 'terminal',
      instruction: 'Envoyez un webhook de test sans signature valide pour vérifier que votre handler le rejette.',
      expectedCommand: 'curl -X POST http://localhost:3000/api/webhooks/stripe -H "Content-Type: application/json" -d \'{"type":"checkout.session.completed"}\'',
      hint: 'Utilisez curl pour envoyer un POST brut sans les en-têtes de signature Stripe',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Vérification des défaillances terminée !',
    },

    // === PARTIAL FAILURES ===
    {
      type: 'info',
      title: 'Défaillances partielles : le cas le plus difficile',
      body: "La livraison implique souvent plusieurs étapes : mettre à jour la base de données, envoyer un email de confirmation, provisionner l'accès. Et si la mise à jour BD réussit mais l'email échoue ? Vous avez une commande dans le système mais l'utilisateur n'a jamais reçu de confirmation. L'agent doit gérer ça : soit rendre toute l'opération atomique (transaction + rollback), soit rendre chaque étape indépendamment réessayable. Spécifiez quelle approche vous voulez — l'agent ne demandera pas.",
    },
    {
      type: 'code-demo',
      title: 'Gérer les défaillances partielles',
      body: 'Séparez les opérations critiques (doivent réussir) des non-critiques (peuvent être réessayées plus tard).',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      code: "export async function fulfillOrder(sessionId: string, data: OrderData) {\n  // Critical: must succeed or webhook returns 500\n  const order = await db.transaction(async (tx) => {\n    const [order] = await tx.insert(orders).values({\n      stripeSessionId: sessionId,\n      email: data.customerEmail,\n      amount: data.amountTotal,\n      status: 'fulfilled',\n    }).returning()\n\n    await tx.insert(accessGrants).values({\n      orderId: order.id,\n      userId: data.userId,\n      expiresAt: addYears(new Date(), 1),\n    })\n\n    return order\n  })\n\n  // Non-critical: queue for retry if it fails\n  try {\n    await sendConfirmationEmail(order)\n  } catch (error) {\n    // Log but don't fail the webhook\n    // A background job will retry failed emails\n    await queueFailedEmail(order.id, error)\n  }\n\n  return order\n}",
    },

    // === APPLYING THE PATTERN ===
    {
      type: 'info',
      title: 'Ce pattern s\'applique à chaque intégration',
      body: "Stripe est l'exemple, mais le pattern est universel. Chaque intégration tierce a : un appel API qui peut échouer, un callback asynchrone (webhook/polling) qui peut arriver plusieurs fois, des états de succès partiel, et des cas limites que l'agent n'anticipera pas sauf si vous les spécifiez. Flux OAuth, services d'email (Resend, SendGrid), processeurs de paiement, stockage de fichiers (URLs signées S3) — tous suivent la même structure de spec : chemin heureux + cas de défaillance explicites + exigence d'idempotence.",
    },
    {
      type: 'order',
      instruction: 'Ordonnez les étapes pour diriger un agent à travers n\'importe quelle intégration tierce :',
      items: [
        'Vérifier les cas de défaillance avec de vrais scénarios de test',
        'Ajouter la logique de livraison idempotente',
        'Configurer le SDK et les variables d\'environnement',
        'Construire le handler asynchrone (webhook/callback)',
        'Spécifier l\'intégration avec les modes de défaillance explicites',
        'Tester le chemin heureux de bout en bout',
      ],
      correctOrder: [4, 2, 3, 5, 1, 0],
    },
    {
      type: 'checklist',
      title: 'Liste de vérification pour la direction d\'intégration :',
      items: [
        'Ma spec liste les cas de défaillance, pas juste les exigences du chemin heureux',
        'Je phase la construction : config SDK, endpoint, webhook, livraison, gestion des défaillances',
        'Je vérifie chaque phase avant de passer à la suivante',
        'La livraison est idempotente (les webhooks en double sont des no-ops)',
        'Je distingue les opérations critiques (doivent réussir) des non-critiques',
        'Je teste les scénarios de défaillance explicitement, pas juste le chemin heureux',
      ],
    },
    {
      type: 'checkpoint',
      xp: 13,
      message: 'Maîtrise de l\'intégration débloquée ! Vous pouvez diriger un agent à travers n\'importe quelle intégration tierce avec confiance.',
    },
  ],
}

export default content
