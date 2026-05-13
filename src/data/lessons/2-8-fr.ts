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
      type: 'multiple-choice',
      question: 'Quelle est l\'erreur la plus fréquente dans le code généré par un agent ?',
      options: [
        'Utiliser des APIs dépréciées',
        'Gestion d\'erreurs manquante sur les appels externes (fetch, BD, fichiers)',
        'Conventions de nommage incorrectes',
        'Oublier d\'ajouter des commentaires',
      ],
      correctIndex: 1,
      explanation: "L'erreur d'agent la plus fréquente est la gestion d'erreurs manquante. Un appel fetch sans try/catch. Une requête de base de données qui suppose le succès. Une lecture de fichier qui ne gère pas « fichier non trouvé ». L'agent écrit la logique pour quand ça marche. Votre travail est de vérifier la logique pour quand ça échoue. Vérifiez chaque appel externe (API, BD, système de fichiers) pour une gestion d'erreurs appropriée.",
    },
    {
      type: 'code-fill',
      instruction: 'Cette fonction générée par un agent n\'a pas de chemin d\'échec. Ajoutez les vérifications manquantes :',
      language: 'typescript',
      filename: 'src/actions/get-user.ts',
      template: 'export async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n\n  if ({{response_check}}) {\n    throw new Error(`Failed to fetch user: ${response.status}`)\n  }\n\n  const data = await {{parse_body}}\n\n  if ({{null_check}}) {\n    return null\n  }\n\n  return data.user\n}',
      blanks: [
        { id: 'response_check', answer: '!response.ok', alternatives: ['response.status >= 400', 'response.status !== 200'], placeholder: 'vérifier la réponse ?', hint: 'Vérifiez si la réponse HTTP indique une erreur' },
        { id: 'parse_body', answer: 'response.json()', alternatives: ['response.json()', 'res.json()'], placeholder: 'parser le corps ?', hint: 'Parsez le corps JSON de la réponse' },
        { id: 'null_check', answer: '!data.user', alternatives: ['data.user === null', 'data.user === undefined', '!data.user'], placeholder: 'vérif. null ?', hint: 'Et si le champ user est absent ?' },
      ],
      explanation: 'Deux vérifications ajoutées : !response.ok attrape les erreurs HTTP (404, 500). La vérification null sur data.user empêche les erreurs "Cannot read property of undefined" en aval. L\'agent a écrit le chemin heureux — vous avez ajouté les chemins d\'échec.',
    },
    {
      type: 'code-diff',
      title: 'Avant et après : ajout de la gestion d\'erreurs',
      body: 'L\'agent a généré une fonction de récupération de données sans gestion d\'erreurs. Voici la correction.',
      language: 'typescript',
      filename: 'src/actions/get-user.ts',
      before: 'export async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n  const data = await response.json()\n  return data.user\n}',
      after: 'export async function getUser(id: string) {\n  const response = await fetch(`/api/users/${id}`)\n  if (!response.ok) {\n    throw new Error(`Failed to fetch user: ${response.status}`)\n  }\n  const data = await response.json()\n  if (!data.user) {\n    throw new Error(`User not found: ${id}`)\n  }\n  return data.user\n}',
      explanation: 'Deux vérifications ajoutées : response.ok attrape les erreurs HTTP (404, 500). La vérification null sur data.user empêche les erreurs "Cannot read property of undefined" en aval.',
    },
    {
      type: 'compare',
      title: 'Erreur 2 : Fausses suppositions sur les données',
      body: 'L\'agent suppose que les données sont toujours présentes et bien formées. Comparez l\'approche dangereuse vs sécuritaire.',
      question: 'Quel code gère correctement les données imbriquées potentiellement manquantes ?',
      correctSide: 'right',
      left: {
        label: 'Dangereux (défaut de l\'agent)',
        content: '// Suppose que les données sont toujours présentes\nconst url = user.profile.avatar.url\nconst first = items[0].name\nconst date = new Date(record.createdAt)',
        language: 'typescript',
      },
      right: {
        label: 'Sécuritaire (votre vérification)',
        content: '// Se protège contre les données manquantes\nconst url = user?.profile?.avatar?.url ?? null\nconst first = items.length > 0 ? items[0].name : null\nconst date = record.createdAt\n  ? new Date(record.createdAt) : null',
        language: 'typescript',
      },
      explanation: 'L\'agent écrit user.profile.avatar.url sans vérifier si profile ou avatar existent. Il utilise items[0] sans vérifier si le tableau est vide. Chaque chaîne d\'accès de propriété est un site de crash potentiel. Le chaînage optionnel (?.) et les vérifications de longueur sont votre filet de sécurité.',
    },
    {
      type: 'multiple-choice',
      question: 'Les opérations CRUD construites par un agent gèrent le chemin heureux. Quel cas limite est le PLUS souvent sauté ?',
      options: [
        'Créer avec tous les champs requis présents',
        'Lire par un ID valide et existant',
        'Supprimer un enregistrement qui a des enregistrements enfants le référençant via clé étrangère',
        'Mettre à jour tous les champs en une fois',
      ],
      correctIndex: 2,
      explanation: "Les opérations CRUD construites par un agent gèrent typiquement : créer (tous les champs), lire (par ID), mettre à jour (tous les champs), supprimer (par ID). Elles sautent : créer avec des champs optionnels manquants, lire un ID inexistant, mise à jour partielle, supprimer avec des contraintes de clé étrangère, mises à jour concurrentes, soft delete vs hard delete. Ces lacunes deviennent des bugs en production.",
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
      type: 'interactive-diagram',
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
      stages: [
        {
          highlightNodes: ['errors'],
          highlightEdges: [{ from: 'errors', to: 'null' }],
          explanation: 'Commencez par la gestion d\'erreurs : vérifiez chaque fetch, appel BD et lecture de fichier pour les try/catch et les vérifications response.ok. Ça attrape l\'erreur d\'agent la plus courante.',
        },
        {
          highlightNodes: ['null'],
          highlightEdges: [{ from: 'null', to: 'edge' }],
          explanation: 'Ensuite, vérifiez la sécurité null : cherchez le chaînage optionnel (?.) manquant, les fallbacks absents et les accès de tableau non vérifiés comme items[0] sans vérification de longueur.',
        },
        {
          highlightNodes: ['edge'],
          highlightEdges: [{ from: 'edge', to: 'security' }],
          explanation: 'Puis scannez les cas limites : tableaux vides, champs optionnels manquants, mises à jour concurrentes et valeurs limites que l\'agent n\'a pas considérées.',
        },
        {
          highlightNodes: ['security'],
          highlightEdges: [{ from: 'security', to: 'data' }],
          explanation: 'Scan de sécurité : vérifiez les routes API sans auth, les entrées non assainies, les secrets codés en dur et la concaténation de chaînes SQL brutes.',
        },
        {
          highlightNodes: ['data'],
          highlightEdges: [{ from: 'data', to: 'async' }],
          explanation: 'Intégrité des données : vérifiez les contraintes d\'unicité, les cascades de clés étrangères, les mises à jour automatiques de timestamps et que les mises à jour partielles préservent les données existantes.',
        },
        {
          highlightNodes: ['async'],
          explanation: 'Finalement, la justesse async : cherchez les await manquants, les Promise.all non bornés, les requêtes séquentielles qui devraient être parallèles et les opérations qui nécessitent des transactions.',
        },
      ],
    },
    {
      type: 'match',
      instruction: 'Associez chaque catégorie de vérification au pattern à rechercher :',
      leftItems: ['Lacunes de gestion d\'erreurs', 'Problèmes de sécurité null', 'Vulnérabilités de sécurité', 'Justesse async'],
      rightItems: ['grep pour Promise.all avec tableaux non bornés, await manquant', 'grep pour .env, clés codées en dur, innerHTML, as any', 'grep pour try/catch manquant autour de fetch, appels BD', 'grep pour ?. chaînage optionnel manquant, pas de fallbacks par défaut'],
      correctPairs: { 0: 2, 1: 3, 2: 1, 3: 0 },
      explanation: 'Chaque catégorie a des patterns révélateurs dans le code. Gestion d\'erreurs : try/catch manquant. Sécurité null : chaînage optionnel manquant. Sécurité : secrets codés en dur. Async : Promise.all non borné.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ces commandes grep pour trouver les appels externes non gérés dans le code généré par l\'agent :',
      language: 'bash',
      filename: 'verification-commands.sh',
      template: '# Trouver tous les appels fetch et vérifier la gestion d\'erreurs\ngrep -rn "{{fetch_pattern}}" src/ --include="*.ts" --include="*.tsx"\n\n# Trouver les opérations BD sans try/catch\ngrep -rn "{{db_pattern}}" src/ --include="*.ts" | grep -v "try"\n\n# Trouver les patterns de promise non gérés\ngrep -rn "{{promise_pattern}}" src/ --include="*.ts" --include="*.tsx"',
      blanks: [
        { id: 'fetch_pattern', answer: 'await fetch', alternatives: ['fetch('], placeholder: 'pattern fetch ?', hint: 'À quoi ressemble un appel fetch asynchrone ?' },
        { id: 'db_pattern', answer: 'await db\\.', alternatives: ['await db.', 'db\\.query', 'db.insert\\|db.update\\|db.delete'], placeholder: 'pattern BD ?', hint: 'Comment commencent les appels de base de données ?' },
        { id: 'promise_pattern', answer: '\\.then(', alternatives: ['.then(', '.then\\('], placeholder: 'pattern promise ?', hint: 'Méthode de chaînage de promesses à l\'ancienne' },
      ],
      explanation: 'Pour chaque appel externe, vérifiez : que se passe-t-il en cas d\'échec ? L\'erreur est-elle capturée ? Est-elle remontée correctement ? Ces patterns grep trouvent les sites d\'appel non gérés les plus courants.',
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
      type: 'match',
      instruction: 'Associez chaque vérification d\'intégrité des données à son comportement attendu en base de données :',
      leftItems: ['Insérer un email en double', 'Supprimer un utilisateur qui a des posts', 'Mettre à jour uniquement le nom', 'Mettre à jour n\'importe quel champ d\'une ligne'],
      rightItems: ['Le timestamp updatedAt se met à jour automatiquement', 'Lance une violation de contrainte d\'unicité', 'Le champ email reste inchangé (pas annulé)', 'Soit cascade soit lance une violation de clé étrangère'],
      correctPairs: { 0: 1, 1: 3, 2: 2, 3: 0 },
      explanation: 'L\'agent construit votre schéma et vos opérations CRUD. Vérifiez : les contraintes d\'unicité empêchent les doublons, les clés étrangères cascadent ou bloquent correctement, les mises à jour partielles préservent les champs non touchés, et les timestamps se mettent à jour automatiquement. Vérifiez le fichier de migration — c\'est là que vit la vérité.',
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
      type: 'multiple-choice',
      question: 'Quel est le flux correct de vérification avant commit pour le code généré par un agent ?',
      options: [
        'Lancer les tests, puis commiter s\'ils passent',
        'Lire tout le fichier, vérifier que ça a l\'air bien, commiter',
        'Réviser le diff, exécuter la checklist de vérification sur le code modifié, lancer les tests, tester manuellement le chemin heureux ET un cas d\'échec, puis commiter',
        'Demander à l\'agent si le code est correct, puis commiter',
      ],
      correctIndex: 2,
      explanation: "Ne commitez jamais du code généré par un agent sans vérification. Le flux : (1) L'agent génère du code, (2) Révisez le diff — pas le fichier entier, juste ce qui a changé, (3) Exécutez votre checklist sur le code modifié, (4) Lancez la suite de tests, (5) Testez manuellement le chemin heureux ET un cas d'échec, (6) Seulement alors : git add et commit. Ça ajoute 5-10 minutes par commit mais empêche des heures de débogage.",
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ce script de vérification pré-commit qui attrape les erreurs courantes d\'agent :',
      language: 'bash',
      filename: 'scripts/verify.sh',
      template: '#!/bin/bash\nset -e\n\n# 1. Vérification de types TypeScript\n{{type_check}}\n\n# 2. Lint (attrape les awaits manquants, les vars inutilisées)\n{{lint_cmd}}\n\n# 3. Vérifier les appels fetch non gérés\nUNHANDLED=$(grep -rn "await fetch" src/ --include="*.ts" | grep -v "try" | grep -v "response.ok" | wc -l)\nif [ "$UNHANDLED" -gt 0 ]; then\n  echo "WARNING: $UNHANDLED fetch calls may lack error handling"\nfi\n\n# 4. Vérifier les échappatoires de type\nASSERTIONS=$(grep -rn "{{type_escape}}" src/ --include="*.ts" --include="*.tsx" | wc -l)\nif [ "$ASSERTIONS" -gt 0 ]; then\n  echo "WARNING: $ASSERTIONS type assertions found"\nfi',
      blanks: [
        { id: 'type_check', answer: 'npx tsc --noEmit', alternatives: ['tsc --noEmit', 'bunx tsc --noEmit'], placeholder: 'commande de vérification de types ?', hint: 'Compilateur TypeScript en mode vérification seulement' },
        { id: 'lint_cmd', answer: 'bun run lint', alternatives: ['npm run lint', 'npx eslint src/'], placeholder: 'commande de lint ?', hint: 'Lancez le linter du projet' },
        { id: 'type_escape', answer: 'as any', alternatives: ['as any', '// @ts-ignore'], placeholder: 'échappatoire de type ?', hint: 'L\'échappatoire TypeScript que les agents adorent' },
      ],
      explanation: 'Automatisez ce que vous pouvez. Ce script attrape les erreurs de type, les problèmes de lint, les appels fetch non gérés et les échappatoires de type avant qu\'elles n\'atteignent votre historique git.',
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
      type: 'order',
      instruction: 'Classez ces bugs async du plus dangereux (le plus difficile à détecter) au moins dangereux :',
      items: [
        'Mutations parallèles qui devraient être dans une transaction (condition de concurrence)',
        'Await manquant sur un appel de notification (fire-and-forget)',
        'Requêtes séquentielles qui pourraient être parallèles (performance seulement)',
        'Promise.all non borné sur un tableau fourni par l\'utilisateur (épuisement de connexions)',
      ],
      correctOrder: [0, 3, 1, 2],
    },
    {
      type: 'multiple-choice',
      question: 'Un agent écrit getDashboard() qui exécute 3 requêtes BD indépendantes séquentiellement avec await. Quel est le problème ?',
      options: [
        'Ça va planter parce que les requêtes ne peuvent pas être séquentielles',
        'Rien — les requêtes séquentielles sont toujours plus sûres',
        'Performance : les requêtes indépendantes devraient utiliser Promise.all() pour tourner en parallèle',
        'La base de données va se verrouiller entre les requêtes',
      ],
      correctIndex: 2,
      explanation: "Les agents produisent fréquemment des opérations séquentielles qui pourraient être parallèles. Trois requêtes indépendantes avec await s'exécutent l'une après l'autre, triplant le temps de réponse. Utilisez Promise.all() pour les requêtes indépendantes. Mais rappelez-vous : les mutations qui dépendent l'une de l'autre (comme transferFunds) ne devraient PAS être parallèles — elles ont besoin d'une transaction.",
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
      type: 'match',
      instruction: 'Associez chaque vulnérabilité de sécurité à la commande grep qui la détecte :',
      leftItems: ['Clés API codées en dur', 'Risque d\'injection SQL', 'Routes API non protégées', 'Vulnérabilité XSS'],
      rightItems: ['grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx"', 'grep -rn "sk_live\\|sk_test\\|password.*=" src/ --include="*.ts"', 'find src/app/api -name "route.ts" -exec grep -L "auth\\|session" {} \\;', 'grep -rn "sql\\`.*\\${" src/ --include="*.ts"'],
      correctPairs: { 0: 1, 1: 3, 2: 2, 3: 0 },
      explanation: 'Les agents ne pensent pas de manière adversariale. Ils construisent pour des utilisateurs légitimes. Ces patterns grep attrapent les lacunes les plus dangereuses : secrets codés en dur, SQL brut avec interpolation, routes sans vérification d\'auth, et injection HTML dangereuse. Un seul contrôle manquant suffit pour une fuite de données.',
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
      type: 'multiple-choice',
      question: 'Combien de temps le rituel de vérification complet ajoute-t-il par commit, et combien de temps de débogage empêche-t-il par semaine ?',
      options: [
        '1-2 minutes par commit, empêche 30 minutes/semaine',
        '10-15 minutes par commit, empêche 2-4 heures/semaine',
        '30+ minutes par commit, empêche 1 heure/semaine',
        'Aucun coût en temps — c\'est entièrement automatisé',
      ],
      correctIndex: 1,
      explanation: "Après chaque résultat d'agent et avant chaque commit : (1) Lisez le diff, (2) Vérifiez la gestion d'erreurs, (3) Vérifiez la sécurité null, (4) Confirmez les cas limites CRUD, (5) Scan de sécurité rapide, (6) Vérifiez la justesse async, (7) Lancez tsc + lint + tests, (8) Test de fumée manuel. Ça prend 10-15 minutes. Ça empêche 2-4 heures de débogage par semaine. Le calcul est clair.",
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
