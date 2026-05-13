import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Pourquoi des règles claires font travailler les agents IA plus vite',
      body: "Vérité contre-intuitive : plus tu imposes de règles à ta flotte d'agents, plus elle avance vite. Un agent sans contraintes gaspille des tokens à délibérer, fait des choix incompatibles et produit du contenu qui entre en conflit avec les autres agents. Un agent contraint sait exactement ce qu'il peut et ne peut pas faire — alors il exécute immédiatement dans sa voie. Les contraintes au niveau système, c'est pas de la bureaucratie. Ce sont les rails qui permettent à ta flotte de rouler à pleine vitesse sans dérailler.",
    },
    {
      type: 'info',
      title: 'Pourquoi les systèmes sans contraintes sont lents',
      body: "Imagine cinq agents qui travaillent sur la même codebase sans contraintes. L'agent A choisit Zustand pour l'état. L'agent B choisit Jotai. L'agent C invente son propre patron de contexte. L'agent D importe depuis un chemin que l'agent E vient de renommer. Chaque agent est individuellement productif mais collectivement incohérent. Tu passes plus de temps à résoudre des conflits qu'à profiter du parallélisme. Les contraintes éliminent la surcharge de coordination en faisant des choix compatibles les SEULS choix disponibles.",
    },

    // === THE CONSTRAINT PARADOX ===
    {
      type: 'diagram',
      title: 'Le paradoxe des contraintes',
      body: 'Plus de règles signifie moins de délibération, moins de conflits et une exécution parallèle plus rapide.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'unconstrained', label: 'Système sans contraintes', sublabel: 'Peu de règles', shape: 'rect' },
          { id: 'slow', label: 'Exécution lente', sublabel: 'Conflits, délibération, retravail', shape: 'rounded' },
          { id: 'constrained', label: 'Système contraint', sublabel: 'Limites explicites', shape: 'rect', highlight: true },
          { id: 'fast', label: 'Exécution parallèle rapide', sublabel: 'Aucun conflit, voies claires', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'unconstrained', to: 'slow', label: 'mène à' },
          { from: 'constrained', to: 'fast', label: 'permet' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Paradoxe des contraintes compris!',
    },

    // === COMPARE: OUVERT VS CONTRAINT ===
    {
      type: 'compare',
      title: 'Spec ouverte vs Spec contrainte',
      body: 'Vois comment les contraintes éliminent la délibération et font exécuter les agents immédiatement.',
      left: {
        label: 'Ouverte',
        content: 'Prompt : "Construis l\'auth pour l\'app"\n\nRéponse de l\'agent :\n"Je vais configurer l\'authentification.\nLaisse-moi explorer les options :\n- JWT ou sessions ?\n- Fournisseurs OAuth ou email/mdp ?\n- Et les magic links ?\n- Je devrais ajouter le MFA ?\n- Quelle lib — Passport, Lucia, Auth.js ?"\n\n→ 5 questions de suivi\n→ 3 allers-retours avant tout code\n→ L\'agent choisit un stack que tu voulais pas',
        language: 'text',
        filename: 'spec-ouverte.txt',
      },
      right: {
        label: 'Contrainte',
        content: 'Prompt : "Utilise Supabase Auth, OAuth\nseulement (Google + GitHub), pas de JWT\ncustom, pas de magic links, pas de MFA\npour la v1"\n\nRéponse de l\'agent :\n"Configuration de Supabase Auth avec\nles fournisseurs OAuth.\n\n1. Configurer Google OAuth\n2. Configurer GitHub OAuth\n3. Ajouter le handler de callback auth\n4. Créer le middleware de route protégée\n\nDébut de l\'implémentation..."\n\n→ 0 question de suivi\n→ Exécution immédiate\n→ Exactement ce que tu as spécifié',
        language: 'text',
        filename: 'spec-contrainte.txt',
      },
      question: 'Quelle spec mène à une exécution plus rapide de l\'agent ?',
      correctSide: 'right',
      explanation: 'La spec contrainte élimine chaque point de décision. L\'agent ne demande pas JWT vs sessions parce que tu as dit « pas de JWT custom ». Il ne demande pas les magic links parce que tu les as exclus. Chaque contrainte que tu ajoutes supprime une question que l\'agent poserait autrement, transformant la délibération en exécution immédiate.',
    },

    // === CODE-FILL: AJOUTER DES CONTRAINTES ===
    {
      type: 'code-fill',
      instruction: 'Ajoute des contraintes à cette spec ouverte. Remplis les blancs avec des choix technologiques spécifiques, des limites et des exclusions pour éliminer la délibération de l\'agent.',
      language: 'markdown',
      filename: 'specs/constrained-feature.md',
      template: '# Feature: User Dashboard\n\n## Technology Constraints\n- Framework: {{framework}}\n- Styling: {{styling}}\n- Data fetching: {{data_fetching}}\n\n## Boundaries\n- This feature lives in {{feature_path}}\n- No imports from {{excluded_imports}}\n\n## Exclusions (do NOT build)\n- No {{exclusion_1}}\n- No {{exclusion_2}}\n- No {{exclusion_3}}',
      blanks: [
        { id: 'framework', answer: 'React', alternatives: ['Next.js', 'Vue', 'Svelte', 'react'], placeholder: 'quel framework ?', hint: 'La bibliothèque UI que tu utilises' },
        { id: 'styling', answer: 'Tailwind CSS', alternatives: ['tailwind', 'Tailwind', 'CSS modules', 'styled-components'], placeholder: 'quelle solution de style ?' },
        { id: 'data_fetching', answer: 'React Query', alternatives: ['TanStack Query', 'SWR', 'react-query', 'tRPC'], placeholder: 'quelle lib de data fetching ?', hint: 'Une bibliothèque populaire d\'état serveur' },
        { id: 'feature_path', answer: 'src/features/dashboard/', alternatives: ['src/pages/dashboard/', 'src/modules/dashboard/', 'packages/dashboard/'], placeholder: 'quel répertoire ?' },
        { id: 'excluded_imports', answer: 'other feature directories', alternatives: ['other features', 'other modules', 'internal modules of other packages'], placeholder: 'quoi ne pas importer ?', hint: 'Garder les fonctionnalités isolées' },
        { id: 'exclusion_1', answer: 'custom chart library', alternatives: ['custom charts', 'chart library', 'data visualization library', 'custom graphing'], placeholder: 'exclusion 1', hint: 'Un scope creep courant pour les tableaux de bord' },
        { id: 'exclusion_2', answer: 'real-time updates', alternatives: ['websockets', 'live updates', 'real-time', 'WebSocket connections'], placeholder: 'exclusion 2', hint: 'Une fonctionnalité coûteuse souvent ajoutée prématurément' },
        { id: 'exclusion_3', answer: 'export to PDF', alternatives: ['PDF export', 'CSV export', 'data export', 'report generation'], placeholder: 'exclusion 3', hint: 'Une fonctionnalité qui ajoute une complexité significative' },
      ],
      explanation: 'Chaque blanc rempli supprime une décision que l\'agent prendrait seul. Les choix technologiques empêchent la délibération sur le stack. Les limites de chemin empêchent le couplage inter-fonctionnalités. Les exclusions empêchent le scope creep. Plus c\'est spécifique, plus l\'agent exécute vite.',
    },

    // === PROMPT-LAB: SPEC CONTRAINTE ===
    {
      type: 'prompt-lab',
      instruction: 'Écris une spec contrainte pour un système de notifications. Spécifie la technologie, les limites de fichiers et ce qui est explicitement exclu. Plus tu ajoutes de contraintes, plus l\'agent exécutera vite.',
      scenario: 'Tu as besoin d\'un système de notifications pour ton application. Il devrait utiliser Supabase Realtime pour les notifications in-app, être contenu dans un seul répertoire, et ne doit PAS inclure l\'intégration email, SMS ou push notification pour cette version. Écris une spec qui élimine toute délibération de l\'agent.',
      starterPrompt: 'Construis les notifications.',
      responses: [
        {
          triggerKeywords: ['Supabase', 'modifier seulement', 'pas d\'email', 'pas de SMS', 'pas de push', 'limite', 'exclure', 'temps de réponse', 'performance', 'ms', 'only modify', 'no email', 'no SMS'],
          response: 'Spec claire reçue. Implémentation du système de notifications avec ces contraintes :\n\n1. Technologie : Abonnements Supabase Realtime uniquement\n2. Portée : src/features/notifications/ — tous les fichiers ici\n3. Exclu : email, SMS, push notifications, services tiers\n4. Interface : subscribe(userId) -> Observable<Notification>\n5. Stockage : table notifications dans Supabase\n\nDébut de l\'implémentation avec types, service et hook d\'abonnement.',
          quality: 'excellent',
          feedback: 'Remarquable. Tu as spécifié la technologie (Supabase Realtime), la limite de fichiers (un seul répertoire), les exclusions de portée (pas d\'email/SMS/push), et l\'agent peut exécuter immédiatement avec zéro question de suivi. Chaque contrainte a supprimé un point de décision.',
        },
        {
          triggerKeywords: ['notification', 'in-app', 'temps réel', 'realtime', 'Supabase'],
          response: 'Je vais construire un système de notifications in-app. Laisse-moi clarifier quelques points :\n- Dois-je aussi gérer les notifications par email ?\n- Et les push notifications pour le mobile ?\n- Dans quel répertoire ça devrait vivre ?\n\nUne fois confirmé, je commence l\'implémentation.',
          quality: 'good',
          feedback: 'Tu as mentionné la technologie mais laissé des lacunes qui ont causé des questions de suivi. Ajoute des exclusions explicites (« pas d\'email, pas de SMS, pas de push ») et des limites de fichiers (« modifier seulement src/features/notifications/ ») pour éliminer toute délibération.',
        },
      ],
      fallbackResponse: {
        response: 'Je vais construire un système de notifications. Laisse-moi explorer les options :\n- Notifications in-app via WebSocket ou polling ?\n- Notifications par email via SendGrid ou Resend ?\n- Push notifications via Firebase ?\n- Dois-je créer une page de préférences de notification ?\n- Où la logique de notification devrait-elle vivre ?\n\nC\'est une grosse fonctionnalité — laisse-moi d\'abord rédiger un doc d\'architecture.',
        feedback: 'L\'agent a généré 5 questions et veut écrire un document de conception avant tout code. Ta spec était trop ouverte. Ajoute des contraintes : « Utilise Supabase Realtime uniquement. Modifier seulement src/lib/notifications.ts. Pas d\'intégration email. Pas de SMS. Pas de push notifications. Temps de réponse max 100ms. » Chaque contrainte supprime une question et te rapproche de l\'exécution immédiate.',
      },
    },
    {
      type: 'match',
      instruction: 'Associe chaque type de contrainte à un exemple concret :',
      leftItems: [
        'Contrainte technologique',
        'Limite de fichier',
        'Exclusion de portée',
        'Budget de performance',
      ],
      rightItems: [
        'Utiliser Supabase Realtime uniquement',
        'Modifier seulement src/lib/notifications.ts',
        'Pas d\'intégration email',
        'Temps de réponse max 100ms',
      ],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Chaque type de contrainte élimine une catégorie différente de délibération de l\'agent. Les contraintes technologiques empêchent l\'exploration de stack (l\'agent n\'évaluera pas 5 bibliothèques WebSocket). Les limites de fichiers empêchent les décisions architecturales (l\'agent sait exactement où écrire le code). Les exclusions de portée empêchent le scope creep (pas de temps perdu sur des templates d\'email). Les budgets de performance empêchent la sur-ingénierie (l\'agent n\'ajoutera pas de couches de cache pour une cible de 100ms).',
    },
    {
      type: 'code-diff',
      title: 'Resserrer une spec ouverte',
      body: 'Voyez comment une spec ouverte est transformée en spec contrainte en ajoutant des contraintes spécifiques ligne par ligne.',
      language: 'markdown',
      filename: 'specs/notification-system.md',
      before: "# Feature: Notification System\n\n## Description\nBuild a notification system for the app.\nUsers should be able to receive notifications.\n\n## Requirements\n- Users get notified about important events\n- Notifications should be reliable\n- Good user experience",
      after: "# Feature: Notification System\n\n## Technology Constraints\n- Transport: Supabase Realtime subscriptions ONLY\n- Storage: notifications table in existing Supabase project\n- Frontend: React hook useNotifications() in src/hooks/\n\n## File Boundaries\n- Backend: src/lib/notifications.ts (single file)\n- Frontend: src/hooks/use-notifications.ts\n- Types: src/types/notifications.ts\n- NO new directories, NO new packages\n\n## Scope Exclusions (do NOT build)\n- No email notifications\n- No SMS or push notifications\n- No notification preferences UI\n- No notification grouping or batching\n- No read/unread tracking (v2)\n\n## Performance Budget\n- Notification delivery: < 500ms end-to-end\n- Hook re-render: < 16ms (one frame)\n- Max 50 notifications in memory per user",
      question: 'Combien de points de décision ont été éliminés en ajoutant des contraintes ?',
      highlightLines: [3, 4, 5, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22, 23],
      explanation: 'La spec contrainte élimine au moins 12 points de décision : choix de transport, emplacement de stockage, patron frontend, emplacements de fichiers, structure de répertoires, support email, support SMS, support push, UI de préférences, logique de groupement, suivi lu/non lu et cibles de performance. Chaque ligne supprime une question que l\'agent poserait autrement ou un choix qu\'il ferait seul — potentiellement de manière incompatible avec ton système existant.',
    },

    // === MONOREPO BOUNDARIES ===
    {
      type: 'info',
      title: 'Les limites de monorepo comme garde-fous d\'agents',
      body: "Un monorepo sans limites, c'est juste un dossier avec plusieurs projets dedans. Les limites de packages — déclarations de dépendances explicites, cibles de build isolées, restrictions d'import renforcées — le transforment en un système où les agents peuvent travailler en parallèle sans se marcher sur les pieds. Si l'agent A travaille dans packages/auth et l'agent B dans packages/billing, et qu'aucun ne peut importer les modules internes de l'autre, ils ne peuvent pas créer de conflits. La limite EST ce qui permet le parallélisme.",
    },
    {
      type: 'code-demo',
      title: 'Application des limites de packages',
      body: 'Cette configuration de projet Nx empêche les agents de franchir les limites entre packages. Chaque package déclare son API publique explicitement.',
      language: 'json',
      filename: 'packages/auth/project.json',
      code: "{\n  \"name\": \"auth\",\n  \"tags\": [\"scope:auth\", \"type:domain\"],\n  \"implicitDependencies\": [],\n  \"targets\": {\n    \"build\": { \"executor\": \"@nx/tsc:tsc\" },\n    \"test\": { \"executor\": \"@nx/jest:jest\" },\n    \"lint\": { \"executor\": \"@nx/eslint:lint\" }\n  }\n}",
    },
    {
      type: 'code-demo',
      title: 'Règle de lint empêchant les imports inter-limites',
      body: 'Les règles de limites de modules Nx font des imports invalides une erreur de build — les agents ne peuvent littéralement pas violer la contrainte.',
      language: 'json',
      filename: '.eslintrc.json',
      code: "{\n  \"rules\": {\n    \"@nx/enforce-module-boundaries\": [\n      \"error\",\n      {\n        \"depConstraints\": [\n          {\n            \"sourceTag\": \"scope:auth\",\n            \"onlyDependOnLibsWithTags\": [\"scope:shared\", \"scope:auth\"]\n          },\n          {\n            \"sourceTag\": \"scope:billing\",\n            \"onlyDependOnLibsWithTags\": [\"scope:shared\", \"scope:billing\"]\n          },\n          {\n            \"sourceTag\": \"scope:shared\",\n            \"onlyDependOnLibsWithTags\": [\"scope:shared\"]\n          }\n        ]\n      }\n    ]\n  }\n}",
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi les limites de modules renforcées sont-elles plus précieuses quand les agents construisent que quand les humains construisent ?',
      options: [
        'Parce que les agents écrivent du code de moins bonne qualité que les humains',
        'Parce que les agents travaillent plus vite, donc les violations de limites s\'accumulent plus rapidement sans application',
        'Parce que les agents ne peuvent pas lire les règles de lint',
        'Parce que les humains ne violent jamais les limites',
      ],
      correctIndex: 1,
      explanation: 'Les agents sont rapides. Un humain pourrait franchir une limite une fois et se faire prendre en revue de code. Un agent peut la franchir 50 fois en 5 minutes avant que quiconque ne le remarque. Les limites renforcées (erreurs de lint, échecs de build) attrapent les violations à la vitesse où les agents les créent — immédiatement, automatiquement, avant la fusion.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Contraintes de monorepo maîtrisées!',
    },

    // === DEPLOYMENT CONTRACTS ===
    {
      type: 'info',
      title: 'Les contrats de déploiement qui forcent des interfaces propres',
      body: "Un contrat de déploiement dit : ce package se déploie indépendamment. Cette seule affirmation force une discipline énorme. Si auth se déploie sans billing, alors auth ne peut pas importer les modules internes de billing. Si billing se déploie sans le frontend, alors billing doit exposer une API versionnée. L'indépendance de déploiement force la propreté des interfaces — et des interfaces propres, c'est ce qui permet aux agents de construire des composants en isolation sans avoir besoin de comprendre tout le système.",
    },
    {
      type: 'code-demo',
      title: 'Contrat de déploiement dans CLAUDE.md',
      body: 'Cette contrainte dans ton CLAUDE.md dit à chaque agent : ton travail doit être déployable indépendamment. Pas question de traverser les unités de déploiement.',
      language: 'markdown',
      filename: 'packages/billing/CLAUDE.md',
      code: "# Billing Service\n\n## Deployment Contract\nThis package deploys independently via its own CI pipeline.\n\n### Rules for all agents:\n1. **No imports from other packages** except `@repo/shared-types`\n2. **All external communication** via HTTP API or message queue\n3. **Database**: Own schema, own migrations, own connection\n4. **Environment**: Must boot with only its own .env variables\n5. **Tests**: Must pass with no other service running\n\n### Public API (what other packages consume):\n- POST /api/billing/create-subscription\n- POST /api/billing/cancel-subscription\n- GET  /api/billing/status/:userId\n- Webhook: billing.subscription.changed\n\n### Off-limits:\n- Direct database queries from other services\n- Importing internal modules (use the HTTP API)\n- Shared mutable state",
    },
    {
      type: 'multiple-choice',
      question: 'Un contrat de déploiement force que « toute communication externe passe par une API HTTP ou une file de messages ». Comment ça aide le parallélisme des agents ?',
      options: [
        'HTTP est plus rapide que les imports directs',
        'Les agents peuvent construire les deux côtés de l\'API indépendamment — ils n\'ont qu\'à s\'entendre sur le contrat, pas sur l\'implémentation',
        'Les files de messages sont requises pour les microservices',
        'Ça empêche les agents de faire des requêtes à la base de données',
      ],
      correctIndex: 1,
      explanation: 'Quand la communication passe par un contrat d\'API défini, l\'agent A qui construit le service de facturation et l\'agent B qui construit le frontend n\'ont qu\'à s\'entendre sur la forme de l\'endpoint. Ils peuvent travailler de façon complètement indépendante. Sans ça, ils doivent se coordonner sur les structures de modules internes — ce qui tue le parallélisme.',
    },

    // === API VERSIONING ===
    {
      type: 'info',
      title: 'Le versionnage d\'API permet l\'évolution parallèle',
      body: "Sans versionnage, modifier une API casse tous les consommateurs simultanément. Avec le versionnage, l'agent A peut construire la v2 d'un endpoint pendant que l'agent B continue de consommer la v1. Quand l'agent B est prêt à migrer, il passe à la v2 selon son propre calendrier. Aucune coordination, aucun blocage, aucun conflit de fusion. Le versionnage est la contrainte temporelle — il permet à différentes parties du système d'évoluer à différentes vitesses sans se casser mutuellement.",
    },
    {
      type: 'code-demo',
      title: 'Contrat d\'API versionné',
      body: 'Les deux versions coexistent. L\'agent qui construit le nouveau flux de paiement utilise la v2. L\'agent qui maintient l\'ancien checkout utilise la v1. Aucun conflit.',
      language: 'typescript',
      filename: 'packages/api/src/routes/subscriptions.ts',
      code: "// v1 — stable, consumed by legacy checkout\nrouter.post('/v1/subscriptions', async (req, res) => {\n  const { planId, userId } = req.body\n  const sub = await createSubscription({ planId, userId })\n  return res.json({ id: sub.id, status: sub.status })\n})\n\n// v2 — new response shape, consumed by new dashboard\nrouter.post('/v2/subscriptions', async (req, res) => {\n  const { planId, userId, metadata } = req.body\n  const sub = await createSubscription({ planId, userId, metadata })\n  return res.json({\n    subscription: {\n      id: sub.id,\n      status: sub.status,\n      plan: sub.plan,\n      currentPeriodEnd: sub.currentPeriodEnd,\n    },\n    actions: {\n      cancel: `/v2/subscriptions/${sub.id}/cancel`,\n      upgrade: `/v2/subscriptions/${sub.id}/upgrade`,\n    },\n  })\n})",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Contraintes de déploiement et de versionnage verrouillées!',
    },

    // === EVALUATING CONSTRAINTS ===
    {
      type: 'info',
      title: 'Cette contrainte aide-t-elle ou nuit-elle ?',
      body: "Toutes les contraintes ne sont pas bonnes. Une contrainte qui force les agents à écrire du code passe-partout sans prévenir d'erreurs, c'est de la friction pure. Une contrainte qui prévient des catégories d'erreurs sans ajouter de cérémonie, c'est de la valeur pure. Le test : est-ce que cette contrainte prévient un vrai problème qui est survenu (ou surviendrait probablement) durant le développement parallèle par agents ? Si oui, garde-la. Si elle n'existe que parce que « c'est une bonne pratique » mais n'a jamais rien attrapé — supprime-la. Les contraintes mortes ralentissent ta flotte sans bénéfice.",
    },
    {
      type: 'info',
      title: 'Signes d\'une contrainte utile',
      body: "Les contraintes utiles partagent trois propriétés. Premièrement : elles sont automatisables — le système les applique, pas la revue humaine. Deuxièmement : elles attrapent de vraies erreurs — tu peux pointer un incident spécifique qu'elles auraient prévenu. Troisièmement : elles ne nécessitent pas la conscience de l'agent — la contrainte fonctionne même si l'agent ne la connaît pas (comme une règle de lint qui fait échouer le build). Si ta contrainte nécessite que l'agent « se souvienne » de faire quelque chose, c'est pas une contrainte — c'est un souhait.",
    },
    {
      type: 'multiple-choice',
      question: 'Quelle contrainte NUIT à la vélocité des agents sans apporter de valeur ?',
      options: [
        'Tous les fichiers doivent passer TypeScript en mode strict avant la fusion',
        'Chaque PR doit inclure une entrée de changelog décrivant le changement en langage orienté utilisateur',
        'Aucun package ne peut importer depuis le répertoire /internal d\'un autre package',
        'Les migrations de base de données doivent être rétrocompatibles (pas de suppression de colonnes sans dépréciation)',
      ],
      correctIndex: 1,
      explanation: 'Les entrées de changelog nécessitent de comprendre l\'impact côté utilisateur — quelque chose avec lequel les agents ont du mal pour les refactorings internes. Cette contrainte ajoute de la cérémonie à chaque PR sans attraper d\'erreurs. Les trois autres sont applicables, automatisées et préviennent de vrais problèmes (erreurs de types, violations de limites, perte de données).',
    },
    {
      type: 'info',
      title: 'Signes d\'une contrainte nuisible',
      body: "Les contraintes nuisibles ressemblent à : commentaires de code obligatoires (les agents génèrent des commentaires verbeux qui n'apportent rien), documents de conception requis avant l'implémentation (les agents construisent plus vite qu'ils n'écrivent de la doc), flux d'approbation forcés pour les chemins non critiques (bloque le travail parallèle). Le test est toujours : est-ce que cette contrainte prévient un problème qui compte, ou est-ce qu'elle freine la vélocité sans bénéfice compensatoire ? Sois impitoyable pour supprimer les contraintes qui servaient aux humains mais qui obstruent les agents.",
    },
    {
      type: 'order',
      instruction: 'Ordonne ces contraintes de la PLUS précieuse à la MOINS précieuse pour le parallélisme d\'une flotte d\'agents :',
      items: [
        'Limites de modules renforcées via des règles de lint',
        'Commentaires JSDoc requis sur toutes les fonctions exportées',
        'Pipelines de déploiement indépendants par package',
        'Descriptions de PR obligatoires avec captures d\'écran',
        'Contrats d\'API versionnés entre services',
      ],
      correctOrder: [0, 2, 4, 1, 3],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Évaluation des contraintes maîtrisée!',
    },

    // === CONSTRAINT ARCHITECTURE ===
    {
      type: 'info',
      title: 'Concevoir les contraintes comme un système',
      body: "Les contraintes individuelles sont utiles. Les contraintes conçues comme un système imbriqué sont transformatrices. Les limites de modules empêchent les imports inter-packages. Les contrats de déploiement empêchent l'état partagé. Le versionnage d'API empêche les changements cassants. Le mode strict de TypeScript empêche les erreurs de types. Ensemble, ils créent un environnement où N'IMPORTE QUEL agent peut travailler sur N'IMPORTE QUEL package à N'IMPORTE QUEL moment sans coordination. C'est le but : le parallélisme à zéro coordination grâce à des contraintes systématiques.",
    },
    {
      type: 'code-demo',
      title: 'Vue d\'ensemble du système de contraintes',
      body: 'Un système de contraintes bien conçu dans CLAUDE.md donne à chaque agent une autonomie complète dans sa portée désignée.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# System Constraints (applies to ALL agents)\n\n## Layer 1: Isolation\n- Each package has its own CLAUDE.md with scope-specific rules\n- No package may import another package's internal modules\n- Each package has independent test suite that runs in isolation\n\n## Layer 2: Communication\n- Cross-package communication: HTTP API or event bus ONLY\n- All APIs are versioned (v1, v2, etc.) — never break consumers\n- Shared types live in @repo/shared-types — the only cross-cut\n\n## Layer 3: Verification\n- TypeScript strict mode — no `any`, no implicit returns\n- 80% test coverage minimum on business logic\n- Build must succeed independently per package\n\n## Layer 4: Evolution\n- New packages: create with `nx g @repo/plugin:package`\n- Deprecation: mark old version, add new version, migrate callers\n- Removal: only after zero imports of old version for 30 days\n\n## What this enables:\n- Any agent can work on any package without coordination\n- 5 agents on 5 packages simultaneously = zero conflicts\n- Merge order does not matter if all packages pass independently",
    },
    {
      type: 'multiple-choice',
      question: 'Ton système de contraintes dit « les types partagés vivent dans @repo/shared-types — le seul point de croisement ». Pourquoi cette SEULE exception est-elle importante ?',
      options: [
        'Ça rend le code DRY',
        'Sans types partagés, les agents inventeraient des interfaces incompatibles — c\'est le point de coordination minimal qui permet à tout le reste d\'être indépendant',
        'TypeScript exige des types partagés',
        'C\'est plus facile pour les agents de trouver les types au même endroit',
      ],
      correctIndex: 1,
      explanation: 'Le package de types partagés est la couche de contrat. C\'est la SEULE chose sur laquelle les agents doivent s\'entendre. Tout le reste — implémentation, tests, déploiement — est indépendant. Un seul point de coordination étroit permet une indépendance complète partout ailleurs. C\'est la conception de contraintes : la surface partagée minimale qui débloque le parallélisme maximal.',
    },

    // === REAL-WORLD APPLICATION ===
    {
      type: 'info',
      title: 'De la théorie à ta codebase',
      body: "Commence par une seule contrainte. La contrainte de plus haute valeur pour toute équipe qui adopte des flottes d'agents, c'est l'application des limites de modules. Ça prévient immédiatement le mode de défaillance le plus courant du développement parallèle par agents : les imports conflictuels. Ajoute-la, applique-la avec de l'outillage (pas juste de la documentation), et observe comment le parallélisme des agents s'améliore. Ensuite ajoute les contrats de déploiement. Puis le versionnage d'API. Couche par couche, tu construis un environnement où les agents peuvent sprinter sans se faire trébucher.",
    },
    {
      type: 'info',
      title: 'Les contraintes comme avantage compétitif',
      body: "Ton compétiteur a 10 ingénieurs qui écrivent du code manuellement. Toi, tu as 2 ingénieurs qui dirigent des flottes d'agents à travers un système bien contraint. Leurs ingénieurs ont besoin de réunions, de revues de code et de coordination pour éviter les conflits. Tes agents n'ont besoin de rien de tout ça — les contraintes gèrent la coordination automatiquement. Ta fréquence de livraison est 5x la leur. Ton taux de défauts est plus bas parce que les contraintes attrapent les erreurs au moment de l'écriture, pas au moment de la revue. Le système de contraintes n'est pas une surcharge — c'est l'architecture qui rend la vélocité des flottes d'agents possible. C'est ton avantage défensif.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Avantage compétitif compris!',
    },

    // === SYNTHESIS ===
    {
      type: 'checklist',
      title: 'Checklist des contraintes au niveau système :',
      items: [
        'Je comprends le paradoxe des contraintes : plus de règles = plus de liberté pour les agents',
        'Je sais concevoir des limites de modules qui préviennent les conflits inter-packages',
        'J\'utilise des contrats de déploiement pour forcer des interfaces propres entre services',
        'J\'implémente le versionnage d\'API pour permettre l\'évolution parallèle',
        'J\'évalue les contraintes avec le test des trois propriétés (automatisable, attrape de vraies erreurs, aucune conscience de l\'agent nécessaire)',
        'Je conçois les contraintes comme des systèmes imbriqués, pas comme des règles isolées',
        'Je supprime les contraintes qui ajoutent de la cérémonie sans attraper d\'erreurs',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Contraintes au niveau système maîtrisées. Ton architecture permet la vélocité — les contraintes sont ton avantage compétitif.',
    },
  ],
}

export default content
