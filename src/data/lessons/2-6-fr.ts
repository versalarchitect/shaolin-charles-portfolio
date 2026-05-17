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
      type: 'code-fill',
      instruction: 'Completez cette spec d\'integration avec les exigences critiques qu\'un agent manquerait sinon :',
      language: 'markdown',
      filename: 'specs/payments.md',
      template: '# Spec d\'Integration Paiement\n\n## Objectif\nLes utilisateurs achetent via Stripe Checkout. La livraison se fait\nvia {{fulfillment_method}}, pas au redirect (le redirect n\'est pas fiable).\n\n## Contraintes\n- Verification de signature webhook ({{secret_env}})\n- Livraison {{idempotency_req}} (meme webhook deux fois = meme resultat)\n- Tous les prix definis dans le Dashboard Stripe, pas en dur\n\n## Cas de Defaillance (DOIVENT ETRE GERES)\n1. Webhook arrive deux fois — le second est un {{duplicate_behavior}}\n2. Livraison echoue (erreur BD) — retourner {{error_code}}, Stripe reessaie',
      blanks: [
        { id: 'fulfillment_method', answer: 'webhook', alternatives: ['webhooks', 'Webhook'], placeholder: 'quelle methode ?', hint: 'La notification asynchrone fiable de Stripe' },
        { id: 'secret_env', answer: 'STRIPE_WEBHOOK_SECRET', alternatives: ['stripe_webhook_secret'], placeholder: 'nom de var env ?', hint: 'Le secret utilise pour verifier les signatures webhook' },
        { id: 'idempotency_req', answer: 'idempotente', alternatives: ['idempotent', 'Idempotente'], placeholder: 'quelle propriete ?', hint: 'Traiter la meme entree deux fois produit le meme resultat' },
        { id: 'duplicate_behavior', answer: 'no-op', alternatives: ['a no-op', 'noop', 'no op', 'ignore'], placeholder: 'que se passe-t-il ?', hint: 'Le doublon ne devrait avoir aucun effet' },
        { id: 'error_code', answer: '500', alternatives: ['500 error', 'HTTP 500'], placeholder: 'code de statut ?', hint: 'Code erreur serveur qui declenche le reessai Stripe' },
      ],
      explanation: 'Une spec d\'integration doit definir explicitement : livraison via webhook (pas redirect), verification de signature, exigence d\'idempotence, et comment les echecs doivent se comporter (500 declenche le reessai, 200 signifie termine). Sans ceux-ci, l\'agent construit seulement le chemin heureux.',
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
      type: 'multiple-choice',
      question: 'Comment devez-vous diriger un agent a travers une integration Stripe ?',
      options: [
        'Remettre toute la spec a l\'agent et dire "construis"',
        'Phaser : config SDK d\'abord, puis endpoint, puis handler webhook, puis livraison idempotente, puis cas de defaillance',
        'Laisser l\'agent decider de l\'ordre de construction selon la complexite',
        'Tout construire d\'un coup et tester a la fin',
      ],
      correctIndex: 1,
      explanation: 'Le travail d\'integration doit etre phase. Chaque phase produit un resultat testable que vous verifiez avant de continuer. Phase 1 : SDK + vars env. Phase 2 : endpoint checkout. Phase 3 : handler webhook avec verification signature. Phase 4 : livraison idempotente. Phase 5 : gestion des cas de defaillance. Tester chaque phase attrape les problemes tot.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez ce prompt Phase 1 pour configurer correctement le SDK Stripe :',
      language: 'text',
      filename: 'prompt-phase-1.txt',
      template: "Installer le SDK Stripe et configurer les variables d'environnement.\n\nExigences :\n- Ajouter le package `{{package_name}}`\n- Creer `src/lib/stripe.ts` qui exporte un client Stripe initialise\n- Lire {{secret_key_env}} depuis l'env\n- Ajouter {{secret_key_env}} et STRIPE_WEBHOOK_SECRET a {{env_file}}\n- NE PAS creer d'endpoints encore — juste la config SDK",
      blanks: [
        { id: 'package_name', answer: 'stripe', alternatives: ['@stripe/stripe-js'], placeholder: 'package npm ?', hint: 'Le nom du package SDK Stripe cote serveur' },
        { id: 'secret_key_env', answer: 'STRIPE_SECRET_KEY', alternatives: ['stripe_secret_key'], placeholder: 'var env ?', hint: 'La variable d\'environnement pour la cle API Stripe' },
        { id: 'env_file', answer: '.env.example', alternatives: ['.env.local', '.env'], placeholder: 'quel fichier ?', hint: 'Le fichier env template qui documente les variables requises' },
      ],
      explanation: 'La Phase 1 est uniquement les fondations. Verifiez que le SDK et l\'environnement fonctionnent avant de construire la moindre logique. La contrainte "NE PAS creer d\'endpoints encore" est critique — elle empeche l\'agent de sauter en avant et de construire des flux de paiement non testes.',
    },
    {
      type: 'terminal',
      instruction: 'Après que l\'agent a configuré Stripe, vérifiez que le SDK fonctionne en lançant le CLI Stripe pour confirmer votre configuration locale.',
      expectedCommand: 'stripe listen --forward-to localhost:3000/api/webhooks/stripe',
      hint: 'Utilisez stripe listen pour transmettre les événements webhook à votre serveur local',
    },
    {
      type: 'code-fill',
      instruction: 'Completez le prompt du handler webhook avec les exigences critiques de securite et fiabilite :',
      language: 'text',
      filename: 'prompt-phase-3.txt',
      template: "Construire le handler webhook a `src/app/api/webhooks/stripe/route.ts`.\n\nExigences critiques :\n1. Lire le {{body_type}} (PAS du JSON parse) pour la verification de signature\n2. Verifier la signature webhook avec STRIPE_WEBHOOK_SECRET\n3. Retourner {{sig_fail_code}} immediatement si la signature echoue\n4. Gerer le type d'evenement : {{event_type}}\n5. Retourner 200 SEULEMENT apres traitement reussi\n6. Retourner {{process_fail_code}} si le traitement echoue (declenche reessai Stripe)",
      blanks: [
        { id: 'body_type', answer: 'body brut', alternatives: ['raw body', 'corps brut', 'body raw'], placeholder: 'quel format ?', hint: 'La verification de signature necessite le body non parse' },
        { id: 'sig_fail_code', answer: '400', alternatives: ['400 Bad Request', 'HTTP 400'], placeholder: 'code de statut ?', hint: 'Erreur client — mauvaise requete' },
        { id: 'event_type', answer: 'checkout.session.completed', alternatives: ['checkout.session.completed event'], placeholder: 'quel evenement ?', hint: 'L\'evenement Stripe pour un paiement reussi' },
        { id: 'process_fail_code', answer: '500', alternatives: ['500 Internal Server Error', 'HTTP 500'], placeholder: 'code de statut ?', hint: 'Erreur serveur qui declenche le reessai Stripe' },
      ],
      explanation: 'Le handler webhook doit : lire le body brut pour la verification de signature (le JSON parse casse la signature), retourner 400 pour les signatures invalides, retourner 500 sur les echecs de traitement (pour que Stripe reessaie), et retourner 200 SEULEMENT en cas de succes. Se tromper sur ces codes de reponse signifie soit accepter des webhooks falsifies soit perdre des commandes.',
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
      type: 'multiple-choice',
      question: 'Pourquoi l\'idempotence est-elle l\'exigence la plus critique pour les handlers de webhook ?',
      options: [
        'Stripe l\'exige dans ses conditions d\'utilisation',
        'Stripe livre les webhooks au moins une fois — les doublons creent des commandes en double, des emails en double et des charges en double si votre handler n\'est pas idempotent',
        'Ca rend le code plus facile a tester',
        'Sans ca, Stripe n\'enverra aucun webhook',
      ],
      correctIndex: 1,
      explanation: 'Stripe livre les webhooks au moins une fois. Le meme evenement peut arriver plusieurs fois. Si votre logique de livraison cree un enregistrement a chaque livraison, vous obtenez des commandes en double. Idempotent signifie : traiter la meme entree deux fois produit le meme resultat que la traiter une fois. C\'est le bug le plus courant dans le code de paiement genere par agent — l\'agent le sautera sauf si vous le specifiez.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez le pattern de livraison idempotente avec la logique verifier-puis-creer :',
      language: 'typescript',
      filename: 'src/lib/fulfill-order.ts',
      template: "export async function fulfillOrder(sessionId: string, data: OrderData) {\n  // Verifier si deja livre (idempotence)\n  const existing = await db.query.orders.{{find_method}}({\n    where: eq(orders.stripeSessionId, {{lookup_param}}),\n  })\n\n  if ({{guard_clause}}) {\n    console.log(`Commande deja livree pour la session ${sessionId}`)\n    return existing\n  }\n\n  // La colonne stripeSessionId a une contrainte {{constraint_type}}\n  const order = await db.insert(orders).values({\n    stripeSessionId: sessionId,\n    email: data.customerEmail,\n    status: 'fulfilled',\n  }).returning()\n\n  return order[0]\n}",
      blanks: [
        { id: 'find_method', answer: 'findFirst', alternatives: ['findOne'], placeholder: 'methode de requete ?', hint: 'Trouver un seul enregistrement correspondant' },
        { id: 'lookup_param', answer: 'sessionId', alternatives: ['session_id'], placeholder: 'valeur de recherche ?', hint: 'Le parametre de fonction a verifier' },
        { id: 'guard_clause', answer: 'existing', alternatives: ['existing !== null', 'existing != null'], placeholder: 'que verifier ?', hint: 'Si vrai, la commande a deja ete traitee' },
        { id: 'constraint_type', answer: 'UNIQUE', alternatives: ['unique'], placeholder: 'quelle contrainte ?', hint: 'Empeche les IDs de session en double au niveau BD' },
      ],
      explanation: 'Le pattern verifier-puis-creer : chercher par ID de session d\'abord, retourner tot si trouve (webhook en double), inserer seulement si nouveau. La contrainte UNIQUE sur stripeSessionId est un filet de securite — meme si le verifier-puis-creer a une condition de course, la BD empeche les doublons.',
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
      type: 'multiple-choice',
      question: 'Le chemin heureux fonctionne. Que devez-vous tester ENSUITE ?',
      options: [
        'Deployer en production et surveiller les erreurs',
        'Ecrire des tests unitaires pour la fonction checkout',
        'Casser le systeme : tester les webhooks en double, les signatures invalides et les pannes BD pour verifier que votre gestion des defaillances fonctionne',
        'Ajouter plus de fonctionnalites comme les codes promo et les abonnements',
      ],
      correctIndex: 2,
      explanation: 'Apres que le chemin heureux fonctionne, cassez-le. Testez : Que se passe-t-il avec des webhooks en double ? (verification idempotence). Des signatures invalides ? (devrait retourner 400). Si la BD est en panne pendant la livraison ? (devrait retourner 500 pour que Stripe reessaie). Ne faites pas confiance que l\'agent les a implementes juste parce que la spec les listait.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez ces scenarios de test de defaillance avec le comportement attendu :',
      language: 'bash',
      filename: 'test-failures.sh',
      template: '# Test 1 : Webhook en double (idempotence)\nstripe trigger checkout.session.completed\nstripe trigger checkout.session.completed\n# Attendu : le second appel log "{{duplicate_result}}"\n\n# Test 2 : Verification de signature\ncurl -X POST http://localhost:3000/api/webhooks/stripe \\\n  -H "Content-Type: application/json" \\\n  -d \'{"type": "checkout.session.completed"}\'\n# Attendu : reponse {{sig_fail_response}} (pas de signature valide)\n\n# Test 3 : Panne BD pendant la livraison\n# Attendu : webhook retourne {{db_fail_response}}, Stripe va {{retry_action}}',
      blanks: [
        { id: 'duplicate_result', answer: 'already fulfilled', alternatives: ['Already fulfilled', 'deja livre', 'already processed'], placeholder: 'que est logge ?', hint: 'Le message de garde d\'idempotence' },
        { id: 'sig_fail_response', answer: '400', alternatives: ['400 Bad Request', 'HTTP 400'], placeholder: 'code de statut ?', hint: 'Mauvaise requete — pas de signature valide' },
        { id: 'db_fail_response', answer: '500', alternatives: ['500 Internal Server Error', 'HTTP 500'], placeholder: 'code de statut ?', hint: 'Erreur serveur declenche le reessai' },
        { id: 'retry_action', answer: 'reessayer', alternatives: ['retry', 'retry the webhook', 'renvoyer'], placeholder: 'que fera Stripe ?', hint: 'Stripe reessaie sur les reponses 5xx' },
      ],
      explanation: 'Chaque test verifie un mode de defaillance specifique : les doublons doivent etre des no-ops, les signatures manquantes doivent etre rejetees avec 400, et les echecs de traitement doivent retourner 500 pour que Stripe reessaie plus tard. Ne faites jamais confiance que l\'agent les a implementes — verifiez toujours.',
    },
    {
      type: 'terminal',
      instruction: 'Envoyez un webhook de test sans signature valide pour vérifier que votre handler le rejette.',
      expectedCommand: 'curl -X POST http://localhost:3000/api/webhooks/stripe -H "Content-Type: application/json" -d \'{"type":"checkout.session.completed"}\'',
      hint: 'Utilisez curl pour envoyer un POST brut sans les en-têtes de signature Stripe',
      platforms: {
        windows: {
          instruction: 'Envoyez un webhook de test sans signature valide depuis PowerShell pour vérifier que votre handler le rejette.',
          expectedCommand: 'Invoke-WebRequest -Method POST -Uri http://localhost:3000/api/webhooks/stripe -ContentType "application/json" -Body \'{"type":"checkout.session.completed"}\'',
          hint: 'Utilisez Invoke-WebRequest dans PowerShell pour envoyer un POST brut sans les en-têtes de signature Stripe',
        },
      },
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Vérification des défaillances terminée !',
    },

    // === PARTIAL FAILURES ===
    {
      type: 'multiple-choice',
      question: 'La livraison a 3 etapes : mise a jour BD, email et provisionnement d\'acces. La mise a jour BD reussit mais l\'email echoue. Que devrait-il se passer ?',
      options: [
        'Tout rollback — l\'utilisateur n\'a pas recu de confirmation donc la commande ne devrait pas exister',
        'Retourner 500 pour que Stripe reessaie toute la livraison depuis le debut',
        'Garder la mise a jour BD (critique), mettre l\'email en file d\'attente pour reessai (non-critique), et retourner 200',
        'Ignorer l\'echec email — l\'utilisateur s\'en sortira',
      ],
      correctIndex: 2,
      explanation: 'Separez les operations critiques (BD + acces) des non-critiques (email). Les operations critiques tournent dans une transaction — si l\'une echoue, les deux sont rollback et le webhook retourne 500 pour reessai. Les operations non-critiques sont dans un try/catch et mises en file pour reessai en arriere-plan. L\'utilisateur obtient son acces immediatement ; l\'email arrive plus tard.',
    },
    {
      type: 'compare',
      title: 'Gestion de defaillance critique vs non-critique',
      body: 'Les defaillances partielles necessitent de separer les operations qui doivent reussir de celles qui peuvent reessayer plus tard.',
      question: 'Quelle approche gere correctement un email echoue pendant la livraison ?',
      correctSide: 'right',
      left: {
        label: 'Tout-ou-rien (fragile)',
        content: "async function fulfillOrder(session) {\n  // Si UNE etape echoue, tout echoue\n  await db.insert(orders).values({...})\n  await db.insert(accessGrants).values({...})\n  await sendConfirmationEmail(order)\n  // Echec email = webhook retourne 500\n  // Stripe reessaie = inserts BD en double !\n  return order\n}",
        language: 'typescript',
      },
      right: {
        label: 'Separation critique/non-critique',
        content: "async function fulfillOrder(session) {\n  // Critique : transaction BD (atomique)\n  const order = await db.transaction(async (tx) => {\n    const [order] = await tx.insert(orders)...\n    await tx.insert(accessGrants)...\n    return order\n  })\n  // Non-critique : file d'attente pour reessai\n  try {\n    await sendConfirmationEmail(order)\n  } catch (e) {\n    await queueFailedEmail(order.id, e)\n  }\n  return order\n}",
        language: 'typescript',
      },
      explanation: 'La bonne approche encapsule les operations critiques (BD + acces) dans une transaction qui rollback atomiquement en cas d\'echec. Les operations non-critiques (email) sont catchees et mises en file pour reessai en arriere-plan. Le webhook retourne 200 parce que le travail critique a reussi.',
    },

    // === APPLYING THE PATTERN ===
    {
      type: 'multiple-choice',
      question: 'Le pattern Stripe (specer les defaillances, phaser la construction, verifier l\'idempotence) s\'applique a quelles autres integrations ?',
      options: [
        'Seulement les processeurs de paiement comme PayPal et Paddle',
        'Seulement les services bases sur webhook',
        'Chaque integration tierce : OAuth, services email, stockage fichiers, toute API avec callbacks asynchrones ou modes de defaillance',
        'Seulement les services qui utilisent des APIs REST',
      ],
      correctIndex: 2,
      explanation: 'Le pattern est universel. Chaque integration tierce a : un appel API qui peut echouer, un callback asynchrone qui peut arriver plusieurs fois, des etats de succes partiel, et des cas limites que l\'agent n\'anticipera pas. Flux OAuth, services email, stockage fichiers (URLs signees S3) — tous suivent la meme structure : chemin heureux + cas de defaillance explicites + idempotence.',
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
