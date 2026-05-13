import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Pourquoi les tâches ciblées donnent de meilleurs résultats avec l\'IA',
      body: "Donne à un agent une tâche ciblée — implémenter un formulaire de connexion — et il livre du code propre et correct. Donne-lui « construis tout le système d'authentification incluant la connexion, l'inscription, la réinitialisation du mot de passe, la vérification par courriel, la gestion des sessions et le contrôle d'accès par rôle » dans un seul prompt, et la qualité se dégrade. Les réponses deviennent plus longues mais moins précises. L'agent prend des décisions incohérentes à travers la base de code. Il oublie les contraintes du début du prompt avant d'arriver à la fin. Un scope large, c'est pas de l'ambition — c'est une taxe sur la qualité.",
    },
    {
      type: 'info',
      title: 'Pourquoi limiter le scope améliore la sortie',
      body: "Trois mécanismes expliquent pourquoi un scope plus étroit produit de meilleurs résultats. Premièrement : l'attention. L'attention du transformer est limitée — plus il y a de contexte qui compétitionne pour la pertinence, plus les détails critiques risquent d'être dilués. Deuxièmement : la cohérence. Les tâches étroites produisent une sortie auto-cohérente parce qu'il y a moins de décisions à garder alignées. Troisièmement : la vérifiabilité. Tu peux évaluer « est-ce que ce formulaire de connexion marche ? » immédiatement. Tu ne peux pas évaluer « est-ce que tout le système d'auth marche ? » sans le décomposer en parties de toute façon. Contraindre le scope en amont te sauve du travail de décomposition plus tard.",
    },
    {
      type: 'compare',
      title: 'Scope large vs tâches ciblées',
      body: 'La largeur de ton prompt affecte directement la qualité de la sortie.',
      question: 'Quelle approche produit du code de meilleure qualité ?',
      correctSide: 'right',
      left: {
        label: 'Large (un prompt)',
        content: '« Construis le système d\'authentification complet :\nconnexion, inscription, réinitialisation du\nmot de passe, OAuth, gestion des sessions,\nroutes protégées, accès par rôle et panel admin. »\n\nRésultat : 30+ fichiers, patterns incohérents,\ncas limites manquants, contexte épuisé',
        language: 'text',
      },
      right: {
        label: 'Ciblé (quatre prompts)',
        content: 'Prompt 1 : « Crée le schéma de base de données\n  pour users et sessions. Touche uniquement src/db/ »\nPrompt 2 : « Ajoute les server actions login/signup.\n  Modifie uniquement src/actions/auth.ts »\nPrompt 3 : « Construis la page de connexion à /login\n  en utilisant les composants Button et Input existants »\nPrompt 4 : « Ajoute le middleware de vérification de session.\n  Modifie uniquement src/middleware.ts »',
        language: 'text',
      },
      explanation: 'Les prompts ciblés contraignent le scope avec des limites de fichiers (« touche uniquement src/db/ ») et des cibles de sortie spécifiques. Chaque prompt obtient toute l\'attention de l\'agent au lieu de la diviser entre 8 préoccupations.',
    },

    // === SCOPE DEGRADATION DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Scope vs Qualité de la sortie',
      body: 'À mesure que le scope de la tâche s\'étend, la qualité de sortie de l\'agent se dégrade. Clique sur chaque niveau.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'narrow', label: 'Scope étroit', sublabel: '"Implémente validateSession"', shape: 'pill', highlight: true },
          { id: 'medium', label: 'Scope moyen', sublabel: '"Construis la gestion de sessions"', shape: 'rounded' },
          { id: 'broad', label: 'Scope large', sublabel: '"Construis tout le système d\'auth"', shape: 'rect' },
          { id: 'precise', label: 'Sortie précise', sublabel: 'Cohérente, testable', shape: 'pill', highlight: true },
          { id: 'decent', label: 'Sortie correcte', sublabel: 'Plutôt cohérente', shape: 'rounded' },
          { id: 'degraded', label: 'Sortie dégradée', sublabel: 'Incohérente, verbeuse', shape: 'rect' },
        ],
        edges: [
          { from: 'narrow', to: 'precise' },
          { from: 'medium', to: 'decent' },
          { from: 'broad', to: 'degraded' },
        ],
      },
      stages: [
        {
          highlightNodes: ['narrow', 'precise'],
          highlightEdges: [{ from: 'narrow', to: 'precise' }],
          explanation: 'Un scope étroit (« implémente cette seule fonction ») obtient toute l\'attention de l\'agent. La sortie est cohérente, testable et facile à réviser. C\'est le point idéal.',
        },
        {
          highlightNodes: ['medium', 'decent'],
          highlightEdges: [{ from: 'medium', to: 'decent' }],
          explanation: 'Un scope moyen (« construis la gestion de sessions ») étire l\'attention sur plusieurs fonctions. La sortie est plutôt cohérente mais peut avoir des lacunes dans les cas limites ou des patterns incohérents.',
        },
        {
          highlightNodes: ['broad', 'degraded'],
          highlightEdges: [{ from: 'broad', to: 'degraded' }],
          explanation: 'Un scope large (« construis tout le système d\'auth ») épuise le contexte et divise l\'attention en 8 directions. La sortie est verbeuse, incohérente et nécessite un débogage extensif. C\'est la taxe sur la qualité du sur-scoping.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Tu comprends pourquoi les tâches ciblées donnent de meilleurs résultats. La qualité avant la quantité.',
    },

    // === FILE BOUNDARIES ===
    {
      type: 'multiple-choice',
      question: 'Quelle est la manière la plus concrète de contraindre le scope d\'une tâche d\'agent ?',
      options: [
        'Dire à l\'agent de « faire attention »',
        'Limiter le nombre de tokens dans ton prompt',
        'Spécifier des limites de fichiers exactes : « Modifie uniquement les fichiers dans src/components/auth/ »',
        'Demander à l\'agent de travailler lentement',
      ],
      correctIndex: 2,
      explanation: "La contrainte de scope la plus concrète, c'est de dire à l'agent quels fichiers il peut toucher. « Modifie uniquement les fichiers dans src/components/auth/ » est sans ambiguïté. Les limites de fichiers préviennent deux problèmes : les effets secondaires non intentionnels (l'agent casse quelque chose ailleurs) et le scope creep (il commence à améliorer du code tangentiel).",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce prompt avec les bonnes limites de fichiers pour empêcher l\'agent de toucher du code non relié :',
      language: 'text',
      filename: 'prompt.txt',
      template: 'Implémente le flux de réinitialisation de mot de passe.\n\nLIMITES :\n- Crée/modifie uniquement les fichiers dans : {{allowed_dirs}}\n- Ne PAS toucher : {{forbidden_dirs}}\n- Les nouveaux fichiers sont autorisés dans les répertoires permis\n- Si tu as besoin de changements hors de ces répertoires, {{escape_clause}}',
      blanks: [
        { id: 'allowed_dirs', answer: 'src/components/auth/ et src/lib/auth/', alternatives: ['src/components/auth/, src/lib/auth/', 'src/components/auth/ + src/lib/auth/'], placeholder: 'quels répertoires autorisés ?', hint: 'Les répertoires de composants auth et de la lib auth' },
        { id: 'forbidden_dirs', answer: 'src/components/dashboard/, src/lib/db/, src/app/api/', alternatives: ['src/components/dashboard/ src/lib/db/ src/app/api/'], placeholder: 'quels répertoires interdits ?', hint: 'Les répertoires dashboard, base de données et API' },
        { id: 'escape_clause', answer: 'dis-moi ce que tu as besoin de changer et je le ferai séparément', alternatives: ['arrête et explique pourquoi', 'ARRÊTE et explique pourquoi au lieu de le faire'], placeholder: 'que doit faire l\'agent ?', hint: 'L\'agent devrait demander, pas agir hors des limites' },
      ],
      explanation: 'Les limites de fichiers explicites empêchent l\'agent de toucher du code non relié. La clause d\'échappatoire est critique — elle donne à l\'agent un moyen sûr de signaler quand il a vraiment besoin de quelque chose hors de sa zone.',
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour implémenter un composant de cloche de notification, en le contraignant explicitement au répertoire des notifications uniquement.',
      expectedCommand: 'claude "Implement a NotificationBell component. BOUNDARIES: Only create/modify files in src/components/notifications/. Do NOT touch any files outside this directory. If you need a hook or utility that does not exist, create it inside src/components/notifications/utils.ts. Do NOT modify the global layout or header components."',
      hint: 'Définis une limite de fichiers claire, spécifie où les nouveaux fichiers vont, et exclus explicitement les autres répertoires.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Limites de fichiers établies !',
    },

    // === FUNCTION BOUNDARIES ===
    {
      type: 'compare',
      title: 'Limites de fonctions : une tâche par prompt',
      body: 'Même à l\'intérieur d\'un seul fichier, tu peux contraindre le scope à une seule fonction.',
      question: 'Quel prompt produit une sortie plus ciblée et révisable ?',
      correctSide: 'right',
      left: {
        label: 'Sans limites',
        content: '« Ajoute la validation de session au système\nd\'auth. Assure-toi que ça marche avec le\nmiddleware et gère le rafraîchissement\nde token aussi. »',
        language: 'text',
      },
      right: {
        label: 'Scope au niveau fonction',
        content: '« Implémente validateSession dans session.ts.\nSignature : (token: string) => Session | null\nComportement : décode JWT, vérifie expiration,\ncherche session en BD, retourne Session ou null.\n\nNe PAS implémenter : rafraîchissement de\ntoken, création de session, ou middleware. »',
        language: 'text',
      },
      explanation: "Contraindre à une seule fonction empêche l'agent d'anticiper ta prochaine demande et de pré-construire des choses que t'as pas encore spécifiées. Ça rend aussi la sortie triviale à réviser : t'as demandé une fonction, t'évalues une fonction. La section « Ne PAS implémenter » est critique.",
    },
    {
      type: 'multiple-choice',
      question: 'Tu demandes à l\'agent d\'implémenter validateSession. Il crée aussi une fonction refreshToken et connecte les deux dans un middleware. Quel principe as-tu violé ?',
      options: [
        'Tu n\'as pas défini de limite de fichiers',
        'Tu n\'as pas explicitement exclu le travail supplémentaire — l\'agent a optimisé pour la complétude',
        'L\'agent ne peut pas s\'empêcher de toujours en faire trop',
        'Les limites de fonctions ne marchent pas avec les agents de code',
      ],
      correctIndex: 1,
      explanation: 'Les agents ont un biais vers l\'aide maximale. Sans une section « Ne PAS implémenter » explicite, l\'agent va anticiper tes prochaines étapes et les pré-construire. La contrainte de scope doit inclure à la fois ce qu\'il faut faire ET ce qu\'il ne faut pas faire.',
    },
    {
      type: 'code-fill',
      instruction: 'Complétez ce prompt à scope étroit avec les bonnes limites de fichiers et de scope :',
      language: 'text',
      template: 'Implémente la fonction validateSession.\n\nLIMITES :\n- Crée/modifie uniquement les fichiers dans {{allowed_dir}}\n- Ne PAS toucher {{forbidden_1}} ou {{forbidden_2}}\n- Utilise la fonction existante {{existing_fn}} de src/lib/auth.ts\n\nCRITÈRES D\'ACCEPTATION :\n- Retourne l\'objet utilisateur si la session est valide\n- Retourne null si la session est expirée ou invalide\n- Lève une exception en cas d\'échec de connexion à la base de données',
      blanks: [
        { id: 'allowed_dir', answer: 'src/lib/', alternatives: ['src/lib', 'src/lib/auth.ts'], placeholder: 'quel répertoire ?', hint: 'Où vit la logique d\'auth ?' },
        { id: 'forbidden_1', answer: 'src/components/', alternatives: ['src/components', 'components'], placeholder: 'ne pas toucher quoi ?', hint: 'La couche UI' },
        { id: 'forbidden_2', answer: 'src/db/', alternatives: ['src/db', 'database', 'migrations'], placeholder: 'autre zone interdite ?', hint: 'La couche base de données' },
        { id: 'existing_fn', answer: 'getSessionToken', alternatives: ['parseToken', 'getToken', 'verifyToken'], placeholder: 'quelle fonction existante ?', hint: 'Une fonction qui extrait le token' },
      ],
      explanation: 'Les limites de fichiers empêchent l\'agent de modifier « gentiment » les composants ou le code de base de données en implémentant une fonction utilitaire. Ça garde les changements révisables et réversibles.',
    },

    // === TOKEN BUDGETS ===
    {
      type: 'compare',
      title: 'Budgets de tokens : garder les prompts concentrés',
      body: 'Chaque token de contexte compétitionne pour l\'attention de l\'agent. Inclus uniquement ce qui est pertinent.',
      question: 'Quel prompt donne à l\'agent les meilleures chances de produire une sortie correcte ?',
      correctSide: 'right',
      left: {
        label: 'Tout inclure',
        content: '« Voici mon schéma complet : [500 lignes]\nVoici mon système d\'auth : [200 lignes]\nVoici mon design system : [300 lignes]\n\nMaintenant implémente validateSession. »',
        language: 'text',
      },
      right: {
        label: 'Contexte ciblé',
        content: '« Implémente validateSession dans session.ts.\n\nTypes pertinents :\n  Session { id, userId, expiresAt }\n\nAppel BD pertinent (existe déjà) :\n  db.query.sessions.findFirst({...})\n\nBibliothèque JWT : jose (installée) »',
        language: 'text',
      },
      explanation: 'Inclure 1000 lignes de contexte non pertinent dilue l\'attention de l\'agent sur les 10 lignes qui comptent. Mets l\'information la plus importante en premier. Si l\'agent a besoin de plus, il va le demander.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Discipline du contexte acquise !',
    },

    // === SPLITTING LARGE TASKS ===
    {
      type: 'multiple-choice',
      question: 'Comment construire un système complexe à partir de tâches à scope étroit sans que ça semble disjoint ?',
      options: [
        'Laisser l\'agent deviner comment les pièces se connectent',
        'Écrire un spec partagé une fois (la vision d\'ensemble), puis extraire des sous-tâches ciblées qui citent chacune la section pertinente',
        'Tout construire dans un seul gros prompt pour garder la cohérence',
        'Construire chaque pièce indépendamment et espérer qu\'elles s\'assemblent',
      ],
      correctIndex: 1,
      explanation: "La réponse, c'est un spec partagé que chaque sous-tâche référence. Tu écris le spec complet du système une fois (la vision d'ensemble), puis tu extrais des sous-tâches ciblées qui citent chacune la section pertinente. Chaque sous-tâche connaît sa place dans l'ensemble — mais n'exécute que sa partie étroite. L'agent a juste assez de contexte pour être cohérent sans être submergé.",
    },
    {
      type: 'match',
      instruction: 'Associe chaque sous-tâche du système d\'auth à sa bonne limite de fichiers :',
      leftItems: ['Schéma de base de données (tables uniquement)', 'Helpers de session (créer, valider, supprimer)', 'Utilitaires de mot de passe (hacher, vérifier)', 'Routes API d\'auth (login, inscription, déconnexion)'],
      rightItems: ['src/lib/auth/password.ts — standalone, pas d\'appels BD', 'src/db/schema/auth.ts — pas de logique applicative', 'src/app/api/auth/ — importe des helpers, ne les MODIFIE PAS', 'src/lib/auth/session.ts — utilise le schéma, ne CRÉE PAS de routes API'],
      correctPairs: { 0: 1, 1: 3, 2: 0, 3: 2 },
      explanation: 'Chaque sous-tâche a sa propre limite de fichiers et des exclusions explicites. La tâche de schéma crée uniquement des tables. Les helpers de session utilisent le schéma mais ne créent pas de routes. Les utilitaires de mot de passe sont standalone. Les routes API importent des helpers mais ne les modifient jamais.',
    },
    {
      type: 'order',
      instruction: 'Ordonne ces tâches du scope le plus étroit (le plus contraint) au plus large :',
      items: [
        'Construire le système d\'authentification complet avec UI, API et base de données',
        'Implémenter la fonction utilitaire hashPassword',
        'Créer les routes API d\'auth en utilisant les helpers de session et de mot de passe existants',
        'Construire le composant de formulaire de connexion',
      ],
      correctOrder: [1, 3, 2, 0],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Décomposition de tâches maîtrisée !',
    },

    // === PRINCIPLE 5 ===
    {
      type: 'multiple-choice',
      question: 'Quand tu écris « touche uniquement src/components/auth/ » dans un prompt, tu communiques à :',
      options: [
        'Uniquement l\'agent — pour qu\'il sache où travailler',
        'Trois audiences : l\'agent (zone de travail), toi-même (rayon d\'impact), et ton futur toi (ce qui a été modifié)',
        'Uniquement ton futur toi — comme documentation',
        'Uniquement le réviseur de code — pour qu\'il sache quoi vérifier',
      ],
      correctIndex: 1,
      explanation: "Les contraintes de scope communiquent trois choses simultanément. À l'agent : ta zone de travail. À toi-même : le rayon d'impact de ce changement. À ton futur toi : ce qui a été modifié dans cette itération. Ce sont de la documentation, des garde-fous de sécurité et des aides à la concentration — tout en une seule ligne.",
    },
    {
      type: 'order',
      instruction: 'Ordonne ces étapes de pensée architecturale que les contraintes de scope te forcent à faire :',
      items: [
        'Définir les contrats d\'interface entre les pièces d\'avance',
        'Identifier quelles pièces peuvent être construites indépendamment (travail parallèle)',
        'Déterminer ce qui dépend de quoi (séquençage)',
        'Écrire le spec complet du système comme vision d\'ensemble',
      ],
      correctOrder: [3, 2, 1, 0],
    },

    // === REAL CLAUDE CODE FLAGS ===
    {
      type: 'match',
      instruction: 'Associe chaque mécanisme de contrainte de scope à quand tu l\'utiliserais :',
      leftItems: ['Fichier CLAUDE.md', 'Instructions en ligne dans le prompt', 'Références de chemin de fichier dans le prompt', 'Section « Ne PAS implémenter »'],
      rightItems: ['Contraintes par tâche pour un seul prompt', 'Limites persistantes pour tout le projet qui s\'appliquent à chaque tâche', 'Empêcher l\'agent de pré-construire des choses que t\'as pas demandées', 'Pointer l\'agent vers exactement le bon fichier à modifier'],
      correctPairs: { 0: 1, 1: 0, 2: 3, 3: 2 },
      explanation: "Le scope n'est pas une fonctionnalité de l'outil — c'est une discipline dans comment tu écris tes prompts. CLAUDE.md pour les règles de projet, instructions en ligne pour les contraintes par tâche, chemins de fichiers pour le ciblage précis, et sections « Ne PAS » pour empêcher la livraison excessive. Tout système d'agent bénéficie d'un scope explicite.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour ajouter une fonctionnalité « marquer comme lu » aux notifications, mais UNIQUEMENT en modifiant le store de notifications existant — pas de nouveaux fichiers, pas de changements UI.',
      expectedCommand: 'claude "Add a markAsRead(notificationId: string) method to the existing notification store in src/stores/notifications.ts. It should update the notification\'s read field to true and persist to the database via the existing db.notifications.update call. Do NOT create new files. Do NOT modify any UI components. Do NOT add new imports from external packages. Only modify src/stores/notifications.ts."',
      hint: 'Contrains à un seul fichier, une seule méthode, en utilisant uniquement les patrons existants dans ce fichier.',
    },
    {
      type: 'terminal',
      instruction: 'L\'agent a construit tout le système d\'auth d\'un coup et il y a des incohérences. Maintenant, réapproche en dirigeant UNIQUEMENT le schéma de base de données comme tâche isolée.',
      expectedCommand: 'claude "Create the auth database schema in src/db/schema/auth.ts. Define three tables: users (id, email, passwordHash, createdAt), sessions (id, userId, expiresAt, createdAt), and password_resets (id, userId, token, expiresAt). Use Drizzle ORM syntax matching the existing schema files in src/db/schema/. Export all tables. Do NOT create any application logic, API routes, or utility functions. Only the schema file."',
      hint: 'Isole le schéma de base de données comme sa propre tâche — pas de logique, pas d\'API, pas d\'UI. Juste les définitions de tables.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Discipline de scope en pratique !',
    },

    // === WHEN TO BROADEN SCOPE ===
    {
      type: 'compare',
      title: 'Quand un scope plus large est justifié',
      body: 'Pas toutes les tâches devraient être micro-scopées. Parfois le couplage rend un scope plus large plus efficace.',
      question: 'Quel scénario justifie un seul prompt à scope large ?',
      correctSide: 'right',
      left: {
        label: 'Découper en tâches étroites',
        content: 'Tâche A : Construire le formulaire de connexion (UI)\nTâche B : Implémenter le hachage de mot de passe\nTâche C : Ajouter validation d\'email à l\'inscription\nTâche D : Ajouter validation de téléphone au profil\n\nCeux-ci ne partagent AUCUNE interface —\nles découper est gratuit et chaque tâche\nest révisable.',
        language: 'text',
      },
      right: {
        label: 'Garder en une seule tâche',
        content: 'Renommer le type UserProfile en Account\net mettre à jour les 12 fichiers qui le\nréférencent.\n\nC\'est étroitement couplé — chaque référence\ndoit changer en synchronisation sinon le\ncode casse. Découper ça en 12 tâches\nest pire.',
        language: 'text',
      },
      explanation: 'Élargis le scope seulement quand le couplage entre les changements est si serré que les séparer te demanderait de spécifier les contrats d\'interface plus en détail que juste laisser l\'agent faire les deux côtés. Si deux changements ne partagent aucune interface, ce sont des tâches séparées. S\'ils partagent une interface serrée, c\'est peut-être une seule tâche.',
    },
    {
      type: 'multiple-choice',
      question: 'Quelle tâche est mieux faite en UN SEUL prompt à scope large plutôt que découpée en tâches étroites ?',
      options: [
        'Construire le formulaire de connexion + implémenter le hachage de mot de passe',
        'Renommer un type de UserProfile à Account et mettre à jour les 12 fichiers qui le référencent',
        'Créer le schéma de base de données + construire les routes API + concevoir les composants UI',
        'Ajouter la validation de courriel au formulaire d\'inscription + ajouter la validation de téléphone au formulaire de profil',
      ],
      correctIndex: 1,
      explanation: 'Un renommage dans 12 fichiers est étroitement couplé — chaque référence doit changer en synchronisation sinon le code casse. C\'est mieux en une seule tâche atomique. Les autres impliquent des préoccupations distinctes qui bénéficient de prompts séparés et ciblés.',
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'Quel est le retour sur investissement de passer une minute à définir les contraintes de scope dans un prompt ?',
      options: [
        'Ça gaspille du temps — les agents travaillent mieux avec de la liberté créative',
        'Ça sauve environ cinq minutes à corriger des incohérences plus tard',
        'Ça ne fait aucune différence sur la qualité de la sortie',
        'Ça n\'aide que pour les petites tâches, pas les systèmes complexes',
      ],
      correctIndex: 1,
      explanation: "Chaque minute que tu passes à définir le scope en sauve cinq à corriger des incohérences. Chaque limite que tu établis est une décision que t'auras pas à défaire. Les meilleurs directeurs ne sont pas ceux qui demandent le plus — ce sont ceux qui demandent exactement la bonne chose au bon moment.",
    },
    {
      type: 'prompt-lab',
      instruction: 'Écrivez un prompt à scope étroit qui dirige l\'agent pour implémenter uniquement la fonction validateSession.',
      scenario: 'Vous avez besoin d\'une fonction qui vérifie si la session d\'un utilisateur est encore valide. Elle doit utiliser le helper existant getSessionToken() de src/lib/auth.ts, interroger la table sessions, et retourner l\'objet utilisateur ou null. Vous ne voulez PAS que l\'agent touche d\'autres fichiers.',
      starterPrompt: 'Ajoute la validation de session à l\'app.',
      responses: [
        {
          triggerKeywords: ['uniquement', 'src/lib', 'ne pas', 'getSessionToken'],
          response: 'Je vais implémenter validateSession dans src/lib/auth.ts en utilisant le helper getSessionToken existant.\n\nScope : modification de src/lib/auth.ts uniquement\n\nImplémentation :\n1. Appeler getSessionToken() pour extraire le token\n2. Requêter la table sessions pour un token correspondant\n3. Vérifier l\'expiration\n4. Retourner l\'objet utilisateur ou null\n\nJe commence...',
          quality: 'excellent',
          feedback: 'Votre prompt a spécifié : quel fichier modifier, quelle fonction existante utiliser, ce qu\'il ne faut PAS toucher, et des critères d\'acceptation clairs. L\'agent peut exécuter sans poser de questions.',
        },
        {
          triggerKeywords: ['session', 'valider', 'utilisateur'],
          response: 'Je vais ajouter la validation de session ! Je vais :\n1. Créer un middleware pour les routes protégées\n2. Ajouter un composant de vérification de session\n3. Mettre à jour le flux de connexion pour créer des sessions\n4. Ajouter un cron job de nettoyage de sessions\n\nJe commence par le middleware...',
          quality: 'poor',
          feedback: 'Sans limites de scope, l\'agent a étendu au middleware, composants, flux de connexion et cron jobs. Vous avez demandé une seule fonction — ajoutez des limites de fichiers et des contraintes « ne PAS toucher ».',
        },
      ],
      fallbackResponse: {
        response: 'Je vais mettre en place la validation de session dans l\'app. Par où je commence ?',
        feedback: 'Votre prompt était trop ouvert. Spécifiez : (1) la fonction exacte à implémenter, (2) quel fichier modifier, (3) quels utilitaires existants réutiliser, et (4) ce qu\'il ne faut PAS toucher.',
      },
    },
    {
      type: 'checklist',
      title: 'Checklist de contraintes de scope :',
      items: [
        'Je comprends pourquoi un scope large dégrade la qualité de sortie de l\'agent',
        'Je sais définir des limites de fichiers qui préviennent les effets secondaires non intentionnels',
        'Je sais contraindre les tâches à des fonctions uniques avec des exclusions explicites',
        'J\'inclus uniquement le contexte pertinent dans les prompts (pas le tout-inclus)',
        'Je sais décomposer les gros systèmes en sous-tâches séquentielles ciblées',
        'Je sais quand un scope plus large est justifié (changements étroitement couplés)',
      ],
    },
    {
      type: 'checkpoint',
      xp: 6,
      message: 'Discipline de scope apprise ! Les instructions ciblées battent les instructions larges à tout coup.',
    },
  ],
}

export default content
