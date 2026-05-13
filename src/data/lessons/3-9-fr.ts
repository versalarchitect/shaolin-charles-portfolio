import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-9',
  steps: [
    { type: 'info', title: 'Au-delà du requête-réponse : systèmes événementiels', body: "Vos agents peuvent construire des endpoints CRUD toute la journée. Mais les vrais produits ont besoin de tâches en arrière-plan, de webhooks, de tâches planifiées et de workflows durables qui survivent aux crashs. Aujourd'hui vous apprenez à diriger les agents pour construire une architecture événementielle — des systèmes où les choses arrivent de façon asynchrone, réessaient en cas d'échec, et ne perdent jamais de données." },
    { type: 'info', title: 'Pourquoi les agents ont du mal avec l\'async par défaut', body: "Les agents prennent le chemin le plus simple par défaut : recevoir la requête, faire le travail, retourner la réponse. Mais qu'en est-il d'envoyer un email de bienvenue après l'inscription ? Traiter un upload vidéo ? Synchroniser des données avec une API tierce qui vous limite le débit ? Ces cas nécessitent du traitement en arrière-plan avec gestion d'erreurs — et les agents ne construiront pas ça sauf si vous le spécifiez explicitement." },
    // === COMPARE: Synchrone vs événementiel ===
    {
      type: 'compare',
      title: 'Exécution synchrone vs événementielle',
      body: 'Les tâches en arrière-plan peuvent s\'exécuter de façon synchrone (bloquante) ou événementielle (résiliente).',
      question: 'Quelle approche survit à un redémarrage serveur en pleine exécution ?',
      correctSide: 'right',
      left: {
        label: 'Synchrone',
        content: 'async function processOrder(order) {\n  await chargePayment(order)  // step 1\n  await createInvoice(order)  // step 2\n  await sendEmail(order)      // step 3\n  await updateInventory(order)// step 4\n}\n// If server crashes at step 3:\n// ❌ Payment charged\n// ❌ Invoice created\n// ❌ No email sent\n// ❌ Inventory not updated\n// ❌ No way to resume',
        language: 'typescript',
      },
      right: {
        label: 'Événementiel',
        content: 'const processOrder = inngest.createFunction(\n  { id: "process-order" },\n  { event: "order/created" },\n  async ({ step }) => {\n    await step.run("charge", () => chargePayment())\n    await step.run("invoice", () => createInvoice())\n    await step.run("email", () => sendEmail())\n    await step.run("inventory", () => updateInventory())\n  }\n)\n// If server crashes at step 3:\n// ✅ Steps 1-2 recorded\n// ✅ Resumes from step 3\n// ✅ No duplicate charges',
        language: 'typescript',
      },
      explanation: 'Les workflows événementiels enregistrent la complétion de chaque étape. En cas de crash, ils reprennent depuis la dernière étape réussie au lieu de recommencer. Ça empêche les doubles facturations et le travail perdu.',
    },
    // === DIAGRAM 1: Flux événementiel (Interactif) ===
    {
      type: 'interactive-diagram',
      title: 'Flux d\'architecture événementielle',
      body: "Chaque système événementiel suit ce patron. Les événements entrent dans une file, les handlers les traitent, et les échecs sont routés vers une logique de réessai ou une file de lettres mortes pour inspection manuelle. L'insight clé : aucun événement n'est jamais perdu. Il réussit, réessaie, ou est signalé pour revue humaine.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'event', label: 'Événement', sublabel: 'user.signup', shape: 'rounded' },
          { id: 'queue', label: 'File', sublabel: 'Durable', shape: 'rect' },
          { id: 'handler', label: 'Handler', sublabel: 'Traitement', shape: 'rect', highlight: true },
          { id: 'success', label: 'Succès', shape: 'pill', highlight: true },
          { id: 'retry', label: 'Réessai', sublabel: '3 tentatives', shape: 'diamond' },
          { id: 'dlq', label: 'Lettres mortes', sublabel: 'Revue manuelle', shape: 'rect' },
        ],
        edges: [
          { from: 'event', to: 'queue' },
          { from: 'queue', to: 'handler' },
          { from: 'handler', to: 'success', label: 'ok' },
          { from: 'handler', to: 'retry', label: 'échec' },
          { from: 'retry', to: 'handler', label: 'réessai' },
          { from: 'retry', to: 'dlq', label: 'épuisé' },
        ],
      },
      stages: [
        {
          highlightNodes: ['event', 'queue'],
          highlightEdges: [{ from: 'event', to: 'queue' }],
          explanation: 'Un événement est émis (ex: user.signup) et entre dans la file durable. La file persiste l\'événement — même si le serveur crash maintenant, l\'événement est en sécurité.',
        },
        {
          highlightNodes: ['queue', 'handler'],
          highlightEdges: [{ from: 'queue', to: 'handler' }],
          explanation: 'La file délivre l\'événement à une fonction handler. Le handler le traite étape par étape — chaque étape individuellement durable et réessayable.',
        },
        {
          highlightNodes: ['handler', 'success'],
          highlightEdges: [{ from: 'handler', to: 'success' }],
          explanation: 'Chemin heureux : toutes les étapes se terminent avec succès. L\'événement est marqué comme traité et retiré de la file.',
        },
        {
          highlightNodes: ['handler', 'retry'],
          highlightEdges: [{ from: 'handler', to: 'retry' }],
          explanation: 'Une étape échoue (timeout réseau, erreur API). L\'événement passe à la logique de réessai. Le système attend, puis re-délivre l\'événement au handler.',
        },
        {
          highlightNodes: ['retry', 'handler'],
          highlightEdges: [{ from: 'retry', to: 'handler' }],
          explanation: 'Le réessai relance le handler. Avec les fonctions à étapes durables, seule l\'étape échouée se relance — les étapes déjà complétées sont ignorées.',
        },
        {
          highlightNodes: ['retry', 'dlq'],
          highlightEdges: [{ from: 'retry', to: 'dlq' }],
          explanation: 'Après épuisement de toutes les tentatives (ex: 3 échecs), l\'événement passe dans la file de lettres mortes pour inspection manuelle. Aucune donnée n\'est jamais silencieusement perdue.',
        },
      ],
    },
    { type: 'checkpoint', xp: 3, message: 'Vous voyez le flux : événement → file → traiter → réessai ou lettres mortes. Pas de perte de données.' },
    {
      type: 'code-fill',
      instruction: 'Complétez la fonction durable Inngest pour l\'inscription utilisateur. Chaque step.run() est individuellement réessayable. Remplissez la config de la fonction, le déclencheur d\'événement et la clé d\'idempotence.',
      language: 'typescript',
      filename: 'src/inngest/functions/user-signup.ts',
      template: `import { inngest } from '../client'

export const handleUserSignup = inngest.createFunction(
  { id: 'user-signup', retries: ___BLANK_1___ },
  { event: '___BLANK_2___' },
  async ({ event, step }) => {
    const user = await step.run('create-user-record', async () => {
      return await db.users.upsert({
        where: { email: event.data.email },
        create: { email: event.data.email, name: event.data.name },
        update: {},
      })
    })

    const customer = await step.run('create-stripe-customer', async () => {
      return await stripe.customers.create(
        { email: user.email, name: user.name },
        { idempotencyKey: \\\`___BLANK_3___\\\` }
      )
    })

    await step.run('send-welcome-email', async () => {
      await resend.emails.send({
        to: user.email,
        subject: 'Welcome!',
        template: 'welcome',
        data: { name: user.name },
      })
    })

    return { userId: user.id, customerId: customer.id }
  }
)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: '3',
          alternatives: ['3'],
          hint: 'Un nombre raisonnable de tentatives de réessai avant d\'abandonner',
          placeholder: 'nombre de réessais',
        },
        {
          id: 'BLANK_2',
          answer: 'user/signup',
          alternatives: ['user/signup', '"user/signup"'],
          hint: 'Le nom d\'événement qui déclenche cette fonction — convention namespace/action',
          placeholder: 'nom d\'événement',
        },
        {
          id: 'BLANK_3',
          answer: 'signup-${user.id}',
          alternatives: ['signup-${user.id}'],
          hint: 'Une clé unique combinant le type d\'opération et l\'ID utilisateur pour empêcher les clients Stripe en double',
          placeholder: 'patron de clé d\'idempotence',
        },
      ],
      explanation: 'Les fonctions durables Inngest donnent des étapes individuellement réessayables. 3 réessais est standard. Le nom d\'événement `user/signup` suit la convention namespace/action. La clé d\'idempotence `signup-${user.id}` empêche les clients Stripe en double lors des réessais.',
    },
    { type: 'multiple-choice', question: 'Si l\'email de bienvenue échoue à la troisième tentative, que se passe-t-il pour l\'enregistrement utilisateur et le client Stripe ?', options: ['Ils sont annulés — la fonction entière échoue', 'Ils restent intacts — seule l\'étape email entre dans la file de lettres mortes', 'La fonction entière réessaie depuis le début', 'Inngest met la fonction en pause et attend une intervention manuelle'], correctIndex: 1, explanation: "Chaque étape est indépendamment durable. Les étapes 1 et 2 se sont terminées avec succès et leurs résultats sont persistés. Seule l'étape 3 réessaie. Si elle épuise ses réessais, elle échoue indépendamment — l'utilisateur et le client Stripe sont saufs." },
    {
      type: 'multiple-choice',
      question: 'Quelles quatre choses votre spec doit-elle définir explicitement pour que les agents construisent des systèmes événementiels (pas synchrones) ?',
      options: [
        'Schéma de base de données, endpoints API, composants UI, config de déploiement',
        'Quelles actions déclenchent des événements, étapes des handlers, gestion d\'échec par étape, et exigences d\'idempotence',
        'Noms d\'événements, technologie de file, nombre de réessais, tableau de bord de surveillance',
        'Code des handlers, fichiers de tests, config CI, et documentation',
      ],
      correctIndex: 1,
      explanation: "Les agents construisent du code synchrone par défaut sauf si on leur dit autrement. Votre spec doit définir : (1) quelles actions déclenchent des événements, (2) ce que chaque handler fait étape par étape, (3) ce qui se passe en cas d'échec à chaque étape, et (4) les exigences d'idempotence. Sans ces quatre éléments, les agents construisent des implémentations chemin-heureux-seulement qui cassent en production.",
    },
    {
      type: 'code-fill',
      instruction: 'Complétez la spec d\'agent pour un job de traitement de commande événementiel. Remplissez l\'événement déclencheur, la stratégie d\'idempotence et la gestion d\'échec pour l\'étape critique de paiement.',
      language: 'markdown',
      filename: 'specs/agent-background-jobs.md',
      template: `## Background Job: Order Processing

### Trigger
Event: \`___BLANK_1___\` -- fired when checkout completes

### Steps (each independently retryable)
1. Validate inventory (check stock, reserve items)
2. Charge payment (Stripe, use idempotency key: \`___BLANK_2___\`)
3. Send confirmation email
4. Notify warehouse (webhook to fulfillment API)
5. Update analytics (increment daily_orders counter)

### Failure Requirements
- Step 1 fails: Cancel order, notify user. DO NOT proceed.
- Step 2 fails: ___BLANK_3___. Notify user.
- Step 3 fails: Retry 3x, then log to dead letter. Order still valid.
- Step 4 fails: Retry 5x (warehouse API is flaky). Alert ops after 3rd.
- Step 5 fails: Retry silently. Analytics lag is acceptable.`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'order/placed',
          alternatives: ['order/placed', '"order/placed"'],
          hint: 'Le nom d\'événement suivant la convention namespace/action quand un checkout se termine',
          placeholder: 'nom d\'événement',
        },
        {
          id: 'BLANK_2',
          answer: 'order-{orderId}',
          alternatives: ['order-{orderId}', 'order-${orderId}'],
          hint: 'Combinez le type d\'opération avec l\'ID de commande unique pour empêcher les doubles facturations',
          placeholder: 'clé d\'idempotence',
        },
        {
          id: 'BLANK_3',
          answer: 'Release inventory reservation',
          alternatives: ['Release inventory reservation', 'Release inventory', 'Libérer la réservation d\'inventaire'],
          hint: 'Si le paiement échoue, quelle ressource précédemment réservée doit être libérée ?',
          placeholder: 'action de compensation',
        },
      ],
      explanation: 'Le nom d\'événement `order/placed` suit la convention namespace/action. La clé d\'idempotence `order-{orderId}` empêche la double facturation lors des réessais. Si le paiement échoue, vous devez libérer la réservation d\'inventaire de l\'étape 1 — c\'est la logique de compensation que les agents ne construisent jamais sauf si vous la spécifiez explicitement.',
    },
    { type: 'checkpoint', xp: 5, message: 'Vous pouvez spécifier des flux événementiels avec gestion d\'échec explicite pour chaque étape.' },
    {
      type: 'multiple-choice',
      question: 'Dans les systèmes événementiels, les handlers seront appelés plusieurs fois. Quelle propriété chaque handler doit-il avoir ?',
      options: [
        'Atomicité — toutes les étapes réussissent ou échouent ensemble',
        'Idempotence — produire le même résultat qu\'il soit appelé une fois ou dix fois',
        'Immutabilité — ne jamais modifier les données existantes',
        'Concurrence — gérer plusieurs événements simultanément',
      ],
      correctIndex: 1,
      explanation: "L'idempotence est le #1 des choses que les agents font mal. Les timeouts réseau, les redémarrages de déploiement et la logique de réessai font que les handlers SERONT appelés plusieurs fois. Chaque handler doit produire le même résultat qu'il soit appelé une fois ou dix fois. Dites toujours à l'agent : « Ce handler doit être idempotent. »",
    },
    {
      type: 'compare',
      title: 'Patrons d\'idempotence : écritures en base vs APIs externes',
      body: 'Différents contextes nécessitent différentes stratégies d\'idempotence.',
      question: 'Quel patron devez-vous utiliser pour écrire dans votre propre base de données ?',
      correctSide: 'left',
      left: {
        label: 'Upsert (écritures en base)',
        content: '// Patron : Upsert — insérer ou mettre à jour\n// Sûr à appeler plusieurs fois\nawait db.subscription.upsert({\n  where: {\n    userId_planId: { userId, planId }\n  },\n  create: {\n    userId, planId, status: "active"\n  },\n  update: {\n    status: "active"  // Relancer est un no-op\n  },\n})\n\n// Aussi : vérifier-avant-agir pour les effets de bord\nconst sent = await db.emailLog.findFirst({\n  where: { orderId, type: "confirmation" }\n})\nif (!sent) {\n  await sendEmail(order.email, "confirmation")\n  await db.emailLog.create({ data: { orderId, type: "confirmation" } })\n}',
        language: 'typescript',
      },
      right: {
        label: 'Clé d\'idempotence (APIs externes)',
        content: '// Patron : Clé d\'idempotence — même clé = même résultat\n// Stripe, processeurs de paiement, etc.\nawait stripe.charges.create(\n  {\n    amount: 2000,\n    currency: "usd",\n    customer: customerId\n  },\n  {\n    // Même clé garantit même résultat\n    idempotencyKey: `charge-order-${orderId}`\n  }\n)\n\n// Le fournisseur d\'API stocke le résultat\n// Appeler à nouveau avec la même clé retourne\n// le résultat en cache, pas de double facturation',
        language: 'typescript',
      },
      explanation: 'Pour votre propre base de données, utilisez le patron upsert (insérer-ou-mettre-à-jour) ou vérifier-avant-agir — vous contrôlez la logique. Pour les APIs externes comme Stripe, utilisez les clés d\'idempotence — le fournisseur gère la déduplication. Donnez les deux patrons à vos agents comme référence dans la spec.',
    },
    { type: 'code-input', instruction: 'Vous avez besoin d\'une clé d\'idempotence pour un webhook qui provisionne un espace de travail utilisateur. L\'ID utilisateur est `usr_123` et l\'événement est `workspace.create`. Écrivez la chaîne de clé d\'idempotence :', placeholder: 'workspace-...', answer: 'workspace-create-usr_123', hint: 'Combinez le type d\'événement et l\'ID utilisateur pour créer une clé unique et reproductible' },
    {
      type: 'multiple-choice',
      question: 'L\'étape 1 réussit, l\'étape 2 réussit, l\'étape 3 échoue. Vous avez un enregistrement utilisateur et un client Stripe mais pas d\'email de bienvenue. Comment s\'appelle ce scénario ?',
      options: [
        'Échec complet — la fonction entière devrait être annulée',
        'Échec partiel — certaines étapes ont réussi, une a échoué en cours de route',
        'Erreur transitoire — il suffit de réessayer la fonction entière',
        'Incohérence des données — la base de données est corrompue',
      ],
      correctIndex: 1,
      explanation: "C'est un échec partiel, l'état par défaut des systèmes distribués. Votre spec doit dire à l'agent ce que « partiellement terminé » signifie et s'il faut compenser (annuler les étapes 1-2) ou continuer (réessayer l'étape 3 plus tard). Les agents ne gèrent jamais ce scénario sauf si vous le spécifiez explicitement.",
    },
    { type: 'multiple-choice', question: 'Un flux de commande en 5 étapes échoue à l\'étape 4 (notifier l\'entrepôt). Les étapes 1-3 (valider, facturer, email) ont réussi. Que devrait-il se passer ?', options: ['Tout annuler — rembourser la charge, dé-envoyer l\'email', 'Marquer la commande comme « en attente de fulfillment » et réessayer l\'étape 4 avec backoff exponentiel', 'Compléter la commande sans notification d\'entrepôt', 'Annuler la commande et notifier l\'utilisateur de réessayer'], correctIndex: 1, explanation: "Vous ne pouvez pas dé-envoyer un email ou facilement rembourser une charge pour une commande valide. L'approche correcte est la récupération avant : marquer l'état, réessayer l'étape échouée. La commande est valide — l'entrepôt n'a juste pas été notifié encore. Spécifiez ça explicitement ou les agents implémenteront une logique de rollback fragile." },
    {
      type: 'interactive-diagram',
      title: 'Récupération avant vs Rollback',
      body: "Deux stratégies pour l'échec partiel. Récupération avant (préférée) : garder les étapes terminées, réessayer celle échouée. Rollback (compensation) : annuler les étapes précédentes.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'fail', label: 'Étape 3 échoue', shape: 'diamond', highlight: true },
          { id: 'forward', label: 'Récupération avant', sublabel: 'Réessayer étape 3', shape: 'rect' },
          { id: 'rollback', label: 'Rollback', sublabel: 'Annuler étapes 1-2', shape: 'rect' },
          { id: 'resume', label: 'Reprendre', sublabel: 'Continuer le flux', shape: 'pill', highlight: true },
          { id: 'compensate', label: 'Compenser', sublabel: 'Rembourser, supprimer', shape: 'pill' },
        ],
        edges: [
          { from: 'fail', to: 'forward', label: 'préféré' },
          { from: 'fail', to: 'rollback', label: 'quand requis' },
          { from: 'forward', to: 'resume' },
          { from: 'rollback', to: 'compensate' },
        ],
      },
      stages: [
        {
          highlightNodes: ['fail'],
          explanation: 'L\'étape 3 échoue. Les étapes 1 et 2 se sont terminées avec succès. Vous avez maintenant un workflow partiellement terminé. Deux stratégies sont disponibles.',
        },
        {
          highlightNodes: ['fail', 'forward'],
          highlightEdges: [{ from: 'fail', to: 'forward' }],
          explanation: 'Récupération avant (préférée) : garder les étapes terminées, réessayer seulement l\'étape échouée. Ça fonctionne parce que les étapes 1 et 2 sont déjà durables — leurs résultats sont persistés.',
        },
        {
          highlightNodes: ['forward', 'resume'],
          highlightEdges: [{ from: 'forward', to: 'resume' }],
          explanation: 'Après que le réessai réussit, le flux continue normalement. Aucune donnée perdue, aucun travail dupliqué. C\'est l\'approche préférée pour les workflows async.',
        },
        {
          highlightNodes: ['fail', 'rollback'],
          highlightEdges: [{ from: 'fail', to: 'rollback' }],
          explanation: 'Rollback (utiliser seulement quand requis) : annuler les étapes précédentes. Nécessaire quand l\'échec de l\'étape 3 rend les étapes 1-2 sans objet (ex: inventaire réservé mais paiement refusé).',
        },
        {
          highlightNodes: ['rollback', 'compensate'],
          highlightEdges: [{ from: 'rollback', to: 'compensate' }],
          explanation: 'La compensation signifie inverser les effets de bord : rembourser les charges, supprimer les enregistrements, libérer les réservations. Beaucoup d\'effets de bord sont irréversibles (emails envoyés), rendant le rollback difficile. La récupération avant est presque toujours meilleure.',
        },
      ],
    },
    { type: 'checkpoint', xp: 5, message: 'Vous comprenez la récupération avant vs le rollback pour les échecs partiels.' },
    { type: 'terminal', instruction: 'Installez Inngest dans votre projet pour activer les fonctions durables en arrière-plan :', expectedCommand: 'npm install inngest', hint: 'Utilisez npm install inngest (ou bun add inngest)' },
    {
      type: 'code-fill',
      instruction: 'Complétez la configuration du client Inngest avec des définitions d\'événements typées. C\'est la fondation depuis laquelle toutes les fonctions importent.',
      language: 'typescript',
      filename: 'src/inngest/client.ts',
      template: `import { Inngest } from 'inngest'

type Events = {
  '___BLANK_1___': { data: { email: string; name: string } }
  'order/placed': { data: { orderId: string; userId: string; amount: number } }
  '___BLANK_2___': { data: { orderId: string; trackingNumber: string } }
  'webhook/received': { data: { source: string; payload: ___BLANK_3___ } }
}

export const inngest = new Inngest({
  id: 'my-app',
  schemas: new EventSchemas().fromRecord<Events>(),
})`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'user/signup',
          alternatives: ['user/signup', '"user/signup"'],
          hint: 'Le nom d\'événement quand un utilisateur s\'inscrit — convention namespace/action',
          placeholder: 'nom d\'événement inscription',
        },
        {
          id: 'BLANK_2',
          answer: 'order/fulfilled',
          alternatives: ['order/fulfilled', '"order/fulfilled"'],
          hint: 'L\'événement quand une commande est expédiée — même namespace que order/placed',
          placeholder: 'nom d\'événement fulfillment',
        },
        {
          id: 'BLANK_3',
          answer: 'unknown',
          alternatives: ['unknown'],
          hint: 'Le type le plus sûr pour un payload webhook non structuré — pas `any`',
          placeholder: 'type sûr pour données inconnues',
        },
      ],
      explanation: 'Les noms d\'événements suivent la convention namespace/action : `user/signup`, `order/placed`, `order/fulfilled`. Utiliser `unknown` au lieu de `any` pour le payload webhook force les handlers à valider les données avant de les utiliser — une mesure de sécurité critique que les agents sautent souvent.',
    },
    { type: 'terminal', instruction: 'Créez la structure de répertoires pour votre architecture événementielle :', expectedCommand: 'mkdir -p src/inngest/functions src/inngest/events', hint: 'Créez les répertoires src/inngest/functions et src/inngest/events' },
    {
      type: 'multiple-choice',
      question: 'Après qu\'un agent a construit du code événementiel, lequel de ces éléments manque-t-il le PLUS fréquemment ?',
      options: [
        'Conventions de nommage des fonctions et formatage du code',
        'Configuration de réessai, idempotence sur les appels externes, et gestion des lettres mortes',
        'Instructions d\'import et résolution de modules',
        'Définitions de types TypeScript et interfaces',
      ],
      correctIndex: 1,
      explanation: "Les agents manquent fréquemment les exigences de production dans le code événementiel : configuration de réessai, idempotence sur les appels externes, classification correcte des erreurs (transitoires vs permanentes), et gestion des lettres mortes. Utilisez une checklist de vérification sur chaque handler d'événement que l'agent produit.",
    },
    { type: 'checklist', title: 'Liste de vérification des handlers d\'événements', items: ['Chaque étape est individuellement réessayable (enveloppée dans step.run ou équivalent)', 'Les appels API externes utilisent des clés d\'idempotence', 'Les écritures en base utilisent upsert ou vérifier-avant-insérer', 'Le nombre de réessais est configuré par étape (pas juste globalement)', 'Les échecs permanents (4xx) sont distingués des transitoires (5xx, timeout)', 'Une file de lettres mortes existe pour les réessais épuisés', 'L\'état d\'échec partiel est géré (récupération avant ou compensation)', 'Le payload de l\'événement est validé à l\'entrée du handler (vérification de schéma)', 'Un timeout est défini par étape (pas le défaut infini)', 'Le logging inclut l\'ID d\'événement et le nom d\'étape pour la traçabilité'] },
    {
      type: 'code-fill',
      instruction: 'Complétez les handlers d\'événements chaînés. Le Handler A émet un événement qui déclenche le Handler B. Remplissez les noms d\'événements et l\'étape qui émet l\'événement aval.',
      language: 'typescript',
      filename: 'src/inngest/functions/onboarding-chain.ts',
      template: `// Handler 1: Signup triggers onboarding
export const onSignup = inngest.createFunction(
  { id: 'signup-handler' },
  { event: '___BLANK_1___' },
  async ({ event, step }) => {
    const user = await step.run('create-user', async () => {
      return await createUser(event.data)
    })

    await step.___BLANK_2___('trigger-onboarding', {
      name: 'user/onboarding.start',
      data: { userId: user.id, plan: 'free' },
    })
  }
)

// Handler 2: Onboarding creates workspace
export const onOnboardingStart = inngest.createFunction(
  { id: 'onboarding-handler' },
  { event: '___BLANK_3___' },
  async ({ event, step }) => {
    await step.run('create-workspace', async () => {
      return await createWorkspace(event.data.userId)
    })

    await step.run('seed-sample-data', async () => {
      return await seedSampleProject(event.data.userId)
    })

    await step.sendEvent('trigger-welcome', {
      name: 'user/onboarding.complete',
      data: { userId: event.data.userId },
    })
  }
)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'user/signup',
          alternatives: ['user/signup', '"user/signup"'],
          hint: 'L\'événement qui démarre la chaîne — quand un utilisateur s\'inscrit',
          placeholder: 'événement déclencheur',
        },
        {
          id: 'BLANK_2',
          answer: 'sendEvent',
          alternatives: ['sendEvent'],
          hint: 'La méthode d\'étape Inngest qui émet un nouvel événement pour déclencher les handlers aval',
          placeholder: 'méthode d\'émission d\'événement',
        },
        {
          id: 'BLANK_3',
          answer: 'user/onboarding.start',
          alternatives: ['user/onboarding.start', '"user/onboarding.start"'],
          hint: 'L\'événement émis par le Handler 1 qui déclenche ce handler',
          placeholder: 'nom d\'événement aval',
        },
      ],
      explanation: 'Les chaînes d\'événements découplent les handlers — le Handler A émet `user/onboarding.start` via `step.sendEvent()`, qui déclenche le Handler B. Vous pouvez ajouter, supprimer ou modifier les handlers aval sans toucher le code amont. C\'est le Principe Ouvert-Fermé appliqué aux workflows.',
    },
    { type: 'multiple-choice', question: 'Pourquoi émettre des événements entre handlers au lieu d\'appeler les fonctions handler directement ?', options: ['C\'est plus rapide parce que les événements sont traités en parallèle', 'Ça découple les handlers — vous pouvez ajouter, supprimer ou modifier les handlers aval sans changer le code amont', 'Les appels de fonction directs ne fonctionnent pas dans les environnements serverless', 'Les événements sont typés alors que les appels de fonction ne le sont pas'], correctIndex: 1, explanation: "Le découplage événementiel signifie que vous pouvez ajouter un nouveau handler pour `user/signup` (comme un tracker analytics) sans toucher le handler d'inscription lui-même. Vous pouvez désactiver des handlers, en ajouter de nouveaux, ou changer l'ordre de traitement — tout sans modifier le code existant. C'est le Principe Ouvert-Fermé appliqué aux workflows." },
    { type: 'checkpoint', xp: 5, message: 'Vous pouvez spécifier, vérifier et composer des systèmes événementiels pour que les agents les construisent.' },
    { type: 'order', instruction: 'Ordonnez ces étapes pour spécifier un système événementiel pour un agent :', items: ['Définir les types et payloads d\'événements (schémas typés)', 'Identifier quelles actions utilisateur déclenchent du traitement en arrière-plan', 'Spécifier la gestion d\'échec par étape (nombre de réessais, récupération avant vs rollback)', 'Mapper la chaîne d\'événements (quels handlers émettent quels événements aval)', 'Définir la stratégie d\'idempotence pour chaque appel externe'], correctOrder: [1, 0, 3, 4, 2] },
    { type: 'checklist', title: 'Maîtrise de l\'architecture événementielle construite par agent', items: ['Je peux identifier quand du code synchrone devrait être événementiel à la place', 'Je spécifie des fonctions à étapes avec sémantique de réessai individuelle par étape', 'J\'exige des clés d\'idempotence sur tous les appels API externes', 'Je spécifie la gestion d\'échec partiel (récupération avant préférée)', 'Je vérifie le résultat de l\'agent contre la checklist de handler en 10 points', 'Je compose des chaînes d\'événements pour les workflows complexes multi-étapes', 'Je distingue les échecs transitoires (réessai) des échecs permanents (lettres mortes)'] },
    { type: 'checkpoint', xp: 7, message: 'Leçon terminée. Vos agents construisent maintenant des systèmes qui survivent aux crashs, pas juste aux journées ensoleillées.' },
  ],
}

export default content
