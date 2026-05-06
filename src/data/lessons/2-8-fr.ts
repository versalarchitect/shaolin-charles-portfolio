import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Le problème de confiance',
      body: "Le code généré par un agent a l'air professionnel. Il a des commentaires, suit des patterns, utilise une syntaxe moderne. Il passe un scan visuel rapide. C'est exactement le danger. Des bugs subtils se cachent derrière du code qui semble compétent : boundaries d'erreur manquantes, accès null non vérifié, conditions de concurrence dans les flux asynchrones, injection SQL dans les requêtes dynamiques. L'agent ne teste pas les cas limites sauf si vous les avez spécifiés. « Faire confiance mais vérifier » signifie : supposer que l'agent a fait de son mieux, puis vérifier systématiquement avant de commiter.",
    },
    {
      type: 'info',
      title: 'Pourquoi les agents font des erreurs spécifiques',
      body: "Les agents optimisent pour le chemin heureux parce que c'est ce que montrent la plupart des exemples d'entraînement. Ils produisent du code qui gère correctement l'entrée attendue. Mais le code de production doit gérer : les champs manquants, les valeurs null, les défaillances réseau, les mutations concurrentes, les transitions d'état invalides, les entrées malformées et les timeouts. L'agent n'est pas négligent — il est optimiste. Votre checklist de vérification compense cet optimisme.",
    },

    // === COMMON MISTAKES ===
    {
      type: 'info',
      title: 'Erreur 1 : Gestion d\'erreurs manquante',
      body: "L'erreur d'agent la plus fréquente. Un appel fetch sans try/catch. Une requête de base de données qui suppose le succès. Une lecture de fichier qui ne gère pas « fichier non trouvé ». L'agent écrit la logique pour quand ça marche. Votre travail est de vérifier la logique pour quand ça échoue. Vérifiez chaque appel externe (API, BD, système de fichiers) pour une gestion d'erreurs appropriée.",
    },
    {
      type: 'code-demo',
      title: 'Repérez la gestion d\'erreurs manquante',
      body: 'Ce code a l\'air correct au premier coup d\'oeil mais n\'a pas de chemin d\'échec. Que se passe-t-il quand l\'API retourne 500 ?',
      language: 'typescript',
      filename: 'src/actions/get-user.ts',
      code: "// Agent-generated code — looks clean, but fragile\nexport async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n  const data = await response.json()\n  return data.user\n}\n\n// What you should verify exists:\nexport async function getUserVerified(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n\n  if (!response.ok) {\n    throw new Error(`Failed to fetch user: ${response.status}`)\n  }\n\n  const data = await response.json()\n\n  if (!data.user) {\n    return null // Explicit null instead of undefined access\n  }\n\n  return data.user\n}",
    },
    {
      type: 'info',
      title: 'Erreur 2 : Fausses suppositions sur les données',
      body: "L'agent suppose que les données sont toujours présentes, toujours de la bonne forme, toujours dans la plage attendue. Il écrit `user.profile.avatar.url` sans vérifier si profile ou avatar existent. Il utilise `items[0]` sans vérifier si le tableau est vide. Il parse des dates en supposant le format ISO quand votre API retourne des timestamps Unix. Chaque chaîne d'accès de propriété est un site de crash potentiel.",
    },
    {
      type: 'info',
      title: 'Erreur 3 : Cas limites sautés dans le CRUD',
      body: "Les opérations CRUD construites par un agent gèrent typiquement : créer (avec tous les champs), lire (par ID), mettre à jour (tous les champs), supprimer (par ID). Elles sautent typiquement : créer avec des champs optionnels manquants, lire un ID inexistant, mise à jour partielle de champs, supprimer avec des contraintes de clé étrangère, mises à jour concurrentes (verrouillage optimiste), comportement de soft delete vs hard delete. Ces lacunes deviennent des bugs en production.",
    },
    {
      type: 'multiple-choice',
      question: 'Un agent construit un endpoint DELETE pour les posts. Il exécute `db.delete(posts).where(eq(posts.id, id))`. Quel cas limite est le plus probablement manquant ?',
      options: [
        'Le delete ne retourne pas le post supprimé',
        'Il n\'y a pas de vérification si le post existe avant de supprimer',
        'Les commentaires référençant ce post via clé étrangère causeront une erreur de contrainte',
        'L\'ID n\'est pas validé comme UUID',
      ],
      correctIndex: 2,
      explanation: 'Les contraintes de clé étrangère sont le cas limite le plus couramment manqué dans les suppressions d\'agent. Si une table comments référence posts.id, la suppression échouera avec une violation de contrainte. L\'agent doit soit cascade delete, soft-delete, ou supprimer les enregistrements enfants d\'abord. Les agents ajoutent rarement cette gestion sauf si explicitement spécifié.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Erreurs courantes d\'agent cataloguées !',
    },

    // === VERIFICATION CHECKLIST ===
    {
      type: 'info',
      title: 'Construire votre checklist de vérification',
      body: "Une checklist de vérification est un scan systématique que vous exécutez sur chaque morceau de code généré par un agent avant de commiter. Il ne s'agit pas de lire chaque ligne — il s'agit de vérifier des catégories spécifiques de problèmes que les agents produisent couramment. Vous l'internaliserez avec le temps, mais commencez par le parcourir délibérément.",
    },
    {
      type: 'diagram',
      title: 'Catégories de Vérification',
      body: 'Scannez le code de l\'agent dans cet ordre. Chaque catégorie attrape une classe différente de bug.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'errors', label: 'Gestion d\'Erreurs', sublabel: 'try/catch, vérif. réponse', shape: 'rounded', highlight: true },
          { id: 'null', label: 'Sécurité Null', sublabel: 'Chaînage optionnel, fallbacks', shape: 'rounded' },
          { id: 'edge', label: 'Cas Limites', sublabel: 'Tableaux vides, champs manquants', shape: 'rounded' },
          { id: 'security', label: 'Sécurité', sublabel: 'Validation d\'entrée, vérif. auth', shape: 'rounded' },
          { id: 'data', label: 'Intégrité Données', sublabel: 'Contraintes, cascades, types', shape: 'rounded' },
          { id: 'async', label: 'Justesse Async', sublabel: 'Conditions de concurrence, awaits', shape: 'rounded' },
        ],
        edges: [
          { from: 'errors', to: 'null' },
          { from: 'null', to: 'edge' },
          { from: 'edge', to: 'security' },
          { from: 'security', to: 'data' },
          { from: 'data', to: 'async' },
        ],
      },
    },
    {
      type: 'code-demo',
      title: 'Le scan de vérification — gestion d\'erreurs',
      body: 'Pour chaque appel externe, vérifiez : que se passe-t-il en cas d\'échec ? L\'erreur est-elle capturée ? Est-elle remontée correctement ?',
      language: 'bash',
      filename: 'verification-commands.sh',
      code: "# Find all fetch/axios calls and check for error handling\n# Look for fetch() without .ok check or try/catch\ngrep -rn \"await fetch\" src/ --include=\"*.ts\" --include=\"*.tsx\"\n\n# Find all database operations without try/catch\ngrep -rn \"await db\\.\" src/ --include=\"*.ts\" | grep -v \"try\"\n\n# Find unhandled promise patterns\ngrep -rn \"\\.then(\" src/ --include=\"*.ts\" --include=\"*.tsx\"",
    },
    {
      type: 'terminal',
      instruction: 'Cherchez les appels fetch qui pourraient manquer de gestion d\'erreurs dans le codebase.',
      expectedCommand: 'grep -rn "await fetch" src/ --include="*.ts" --include="*.tsx"',
      hint: 'Utilisez grep pour trouver tous les appels fetch dans les fichiers TypeScript',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Checklist de vérification construite !',
    },

    // === DATA INTEGRITY ===
    {
      type: 'info',
      title: 'Intégrité des données dans le CRUD construit par l\'agent',
      body: "L'agent construit votre schéma de base de données et les opérations CRUD. Maintenant vérifiez : Les contraintes d'unicité sont-elles en place (emails en double, slugs en double) ? Les clés étrangères sont-elles correctement définies ? Les suppressions en cascade fonctionnent-elles comme prévu ? Les timestamps sont-ils auto-définis ? Le soft-delete est-il implémenté si requis ? Vérifiez le fichier de migration — c'est là que vit la vérité, pas dans la définition de schéma TypeScript.",
    },
    {
      type: 'code-demo',
      title: 'Vérification d\'intégrité des données',
      body: 'Exécutez ces vérifications sur le schéma et les opérations CRUD générées par l\'agent.',
      language: 'typescript',
      filename: 'verify-integrity.ts',
      code: "// 1. Check: Can I create a duplicate? (unique constraints)\nawait db.insert(users).values({ email: 'test@test.com', name: 'A' })\nawait db.insert(users).values({ email: 'test@test.com', name: 'B' })\n// Expected: second insert throws unique violation\n\n// 2. Check: Can I delete a parent with children?\nawait db.delete(users).where(eq(users.id, userWithPosts.id))\n// Expected: either cascades (deletes posts) or throws FK violation\n\n// 3. Check: Partial updates preserve existing data\nawait db.update(users)\n  .set({ name: 'New Name' }) // Does NOT passing email null it out?\n  .where(eq(users.id, id))\n// Expected: email field unchanged\n\n// 4. Check: Timestamps auto-update\nawait db.update(posts).set({ title: 'Updated' }).where(eq(posts.id, id))\nconst post = await db.query.posts.findFirst({ where: eq(posts.id, id) })\n// Expected: updatedAt > createdAt",
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a créé une table users avec une colonne email mais sans contrainte unique. Le schéma TypeScript dit `email: text("email").notNull()`. Est-ce sécuritaire ?',
      options: [
        'Oui — notNull empêche les emails vides en double',
        'Non — notNull empêche null mais autorise les emails en double, ce qui causera des bugs d\'auth',
        'Oui — le code applicatif devrait gérer l\'unicité, pas la base de données',
        'Ça dépend de l\'ORM',
      ],
      correctIndex: 1,
      explanation: 'notNull empêche seulement les valeurs NULL, pas les doublons. Sans contrainte d\'unicité, deux utilisateurs peuvent s\'inscrire avec le même email, causant des ambiguïtés de login, des fuites de données et des bugs d\'auth. Vérifiez toujours que les contraintes d\'unicité existent au niveau de la base de données pour les champs comme email, nom d\'utilisateur et slug.',
    },

    // === VERIFY BEFORE COMMIT WORKFLOW ===
    {
      type: 'info',
      title: 'Le flux vérifier-avant-de-commiter',
      body: "Ne commitez jamais du code généré par un agent sans vérification. Le flux : (1) L'agent génère du code, (2) Révisez le diff — pas le fichier entier, juste ce qui a changé, (3) Exécutez votre checklist de vérification sur le code modifié, (4) Lancez la suite de tests, (5) Testez manuellement le chemin heureux ET un cas d'échec, (6) Seulement alors : git add et commit. Ça ajoute 5-10 minutes par commit mais empêche des heures de débogage de mauvais code qui « avait l'air bien ».",
    },
    {
      type: 'code-demo',
      title: 'Script de vérification pré-commit',
      body: 'Automatisez ce que vous pouvez. Ce script attrape les erreurs d\'agent les plus courantes avant qu\'elles n\'atteignent votre historique git.',
      language: 'bash',
      filename: 'scripts/verify.sh',
      code: "#!/bin/bash\nset -e\n\necho \"=== Running verification checks ===\"\n\n# 1. TypeScript type check (catches wrong assumptions)\necho \"\\n--- Type checking ---\"\nnpx tsc --noEmit\n\n# 2. Lint (catches missing awaits, unused vars)\necho \"\\n--- Linting ---\"\nbun run lint\n\n# 3. Test suite\necho \"\\n--- Running tests ---\"\nbun test\n\n# 4. Check for common agent mistakes\necho \"\\n--- Checking for issues ---\"\n\n# Unhandled fetch calls\nUNHANDLED=$(grep -rn \"await fetch\" src/ --include=\"*.ts\" | grep -v \"try\" | grep -v \"response.ok\" | wc -l)\nif [ \"$UNHANDLED\" -gt 0 ]; then\n  echo \"WARNING: $UNHANDLED fetch calls may lack error handling\"\n  grep -rn \"await fetch\" src/ --include=\"*.ts\" | grep -v \"try\" | grep -v \"response.ok\"\nfi\n\n# Any type assertions (often a sign of shortcuts)\nASSERTIONS=$(grep -rn \"as any\" src/ --include=\"*.ts\" --include=\"*.tsx\" | wc -l)\nif [ \"$ASSERTIONS\" -gt 0 ]; then\n  echo \"WARNING: $ASSERTIONS 'as any' assertions found\"\nfi\n\necho \"\\n=== Verification complete ===\"",
    },
    {
      type: 'terminal',
      instruction: 'Lancez une vérification de types rapide pour attraper les erreurs de type dans le code généré par l\'agent avant de commiter.',
      expectedCommand: 'npx tsc --noEmit',
      hint: 'Le compilateur TypeScript en mode vérification seule attrape les erreurs de type sans compiler',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Flux vérifier-avant-de-commiter établi !',
    },

    // === ASYNC CORRECTNESS ===
    {
      type: 'info',
      title: 'Vérification async : le danger caché',
      body: "Les agents produisent fréquemment du code async avec des bugs subtils : await manquant (la fonction retourne une promise au lieu de la valeur), opérations parallèles qui devraient être séquentielles (conditions de concurrence), opérations séquentielles qui pourraient être parallèles (performance), et rejets de promise non gérés. Ces bugs ne causent pas toujours des erreurs — ils causent des défaillances intermittentes qui sont pénibles à déboguer en production.",
    },
    {
      type: 'code-demo',
      title: 'Erreurs async à vérifier',
      body: 'Patterns async courants que les agents ratent. Chacun a l\'air correct au premier coup d\'oeil.',
      language: 'typescript',
      filename: 'async-checks.ts',
      code: "// BUG: Missing await — returns Promise<void>, not void\nasync function saveAndNotify(data: Data) {\n  await db.insert(items).values(data)\n  sendNotification(data.userId) // Missing await! Fire-and-forget\n}\n\n// BUG: Sequential when parallel is safe\nasync function getDashboard(userId: string) {\n  const posts = await db.query.posts.findMany({ where: eq(posts.userId, userId) })\n  const comments = await db.query.comments.findMany({ where: eq(comments.userId, userId) })\n  const likes = await db.query.likes.findMany({ where: eq(likes.userId, userId) })\n  // These 3 queries are independent — should use Promise.all()\n}\n\n// BUG: Parallel when sequential is required\nasync function transferFunds(from: string, to: string, amount: number) {\n  await Promise.all([\n    db.update(accounts).set({ balance: sql`balance - ${amount}` }).where(eq(accounts.id, from)),\n    db.update(accounts).set({ balance: sql`balance + ${amount}` }).where(eq(accounts.id, to)),\n  ])\n  // Race condition! If first succeeds and second fails, money disappears.\n  // Should be in a transaction.\n}",
    },
    {
      type: 'multiple-choice',
      question: 'Un agent écrit : `const users = await Promise.all(userIds.map(id => db.query.users.findFirst({where: eq(users.id, id)})))`. Que devriez-vous vérifier ?',
      options: [
        'Que Promise.all est importé correctement',
        'Que le tableau n\'est pas trop grand — 1000 requêtes BD concurrentes pourraient submerger le pool de connexions',
        'Que findFirst retourne le bon type',
        'Rien — ce pattern est correct',
      ],
      correctIndex: 1,
      explanation: 'Promise.all avec des tableaux non bornés est une erreur courante d\'agent. Si userIds a 500 éléments, vous lancez 500 requêtes concurrentes. Les bases de données ont des limites de connexion (typiquement 10-20 pour le serverless). Vous avez besoin de chunking (traiter 10 à la fois) ou d\'une seule requête WHERE IN à la place.',
    },

    // === SECURITY QUICK-SCAN ===
    {
      type: 'info',
      title: 'Scan de sécurité rapide',
      body: "Les agents ne pensent pas de manière adversariale. Ils construisent pour des utilisateurs légitimes. Vérifications de sécurité rapides : (1) Tous les endpoints API vérifient-ils l'autorisation ? (2) Les entrées utilisateur sont-elles validées/assainies avant utilisation ? (3) Les requêtes SQL sont-elles paramétrées (pas de concaténation de chaînes) ? (4) Les uploads de fichiers sont-ils validés pour le type et la taille ? (5) Les secrets sont-ils dans les variables d'environnement, pas codés en dur ? Un seul contrôle d'auth manquant suffit pour une fuite de données.",
    },
    {
      type: 'code-demo',
      title: 'Commandes grep de vérification de sécurité',
      body: 'Recherches rapides pour trouver les lacunes de sécurité courantes dans le code généré par l\'agent.',
      language: 'bash',
      filename: 'security-scan.sh',
      code: "# Check for hardcoded secrets\ngrep -rn \"sk_live\\|sk_test\\|password.*=.*['\\\"]\" src/ --include=\"*.ts\"\n\n# Check for raw SQL (potential injection)\ngrep -rn \"sql\\`.*\\${\" src/ --include=\"*.ts\"\n\n# Check API routes for auth middleware\n# Every route.ts should check session/auth\nfor f in $(find src/app/api -name \"route.ts\"); do\n  if ! grep -q \"auth\\|session\\|getUser\\|requireAuth\" \"$f\"; then\n    echo \"WARNING: $f may lack auth check\"\n  fi\ndone\n\n# Check for dangerouslySetInnerHTML\ngrep -rn \"dangerouslySetInnerHTML\" src/ --include=\"*.tsx\"",
    },
    {
      type: 'terminal',
      instruction: 'Vérifiez si des routes API manquent de vérifications d\'authentification.',
      expectedCommand: 'find src/app/api -name "route.ts" -exec grep -L "auth\\|session\\|getUser" {} \\;',
      hint: 'Utilisez find avec grep -L pour trouver les fichiers qui NE contiennent PAS de termes liés à l\'auth',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Vérification de sécurité ajoutée au flux !',
    },

    // === PUTTING IT ALL TOGETHER ===
    {
      type: 'info',
      title: 'Votre rituel de vérification complet',
      body: "Après chaque résultat d'agent et avant chaque commit : (1) Lisez le diff, (2) Vérifiez la gestion d'erreurs sur les appels externes, (3) Vérifiez la sécurité null sur les accès de données, (4) Confirmez les cas limites dans le CRUD, (5) Scan de sécurité rapide sur les nouveaux endpoints, (6) Vérifiez la justesse async, (7) Lancez tsc + lint + tests, (8) Test de fumée manuel d'un chemin heureux et d'un échec. Ça prend 10-15 minutes. Ça empêche 2-4 heures de débogage par semaine. Le calcul est clair.",
    },
    {
      type: 'order',
      instruction: 'Ordonnez les étapes du flux vérifier-avant-de-commiter :',
      items: [
        'Lancer les vérifications automatisées (tsc, lint, tests)',
        'Test de fumée manuel : chemin heureux + un échec',
        'Lire le git diff des fichiers modifiés',
        'Scan de sécurité rapide sur les nouveaux endpoints',
        'Vérifier la gestion d\'erreurs et la sécurité null',
        'Git commit le code vérifié',
      ],
      correctOrder: [2, 4, 3, 0, 1, 5],
    },
    {
      type: 'checklist',
      title: 'Habitudes de vérification :',
      items: [
        'Je ne commite jamais du code d\'agent sans réviser le diff',
        'Je vérifie chaque appel externe pour la gestion d\'erreurs',
        'Je vérifie les contraintes d\'unicité et les cascades FK dans le schéma',
        'Je scanne les vérifications d\'auth manquantes sur les nouveaux endpoints',
        'Je cherche les Promise.all non bornés et les awaits manquants',
        'Je lance tsc --noEmit avant de commiter pour attraper les suppositions de type',
        'Je teste au moins un cas d\'échec manuellement, pas juste le chemin heureux',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Maîtrise de la vérification atteinte ! Votre code généré par agent est prêt pour la production.',
    },
  ],
}

export default content
