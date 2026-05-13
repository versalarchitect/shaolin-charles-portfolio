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
      type: 'diagram',
      title: 'Scope vs Qualité de la sortie',
      body: 'À mesure que le scope de la tâche s\'étend, la qualité de sortie de l\'agent se dégrade de façon non linéaire. Le point idéal est une sous-tâche ciblée.',
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
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Tu comprends pourquoi les tâches ciblées donnent de meilleurs résultats. La qualité avant la quantité.',
    },

    // === FILE BOUNDARIES ===
    {
      type: 'info',
      title: 'Limites de fichiers : contraindre où l\'agent travaille',
      body: "La contrainte de scope la plus concrète, c'est de dire à l'agent quels fichiers il peut toucher. « Modifie uniquement les fichiers dans src/components/auth/ » est sans ambiguïté. L'agent ne va pas refactorer ta couche de base de données, ne va pas mettre à jour des composants non reliés, ne va pas « gentiment » améliorer des fichiers hors de sa zone. Les limites de fichiers préviennent deux problèmes : les effets secondaires non intentionnels (l'agent casse quelque chose ailleurs) et le scope creep (il commence à améliorer du code tangentiel parce qu'il a remarqué une opportunité).",
    },
    {
      type: 'code-demo',
      title: 'Limite de fichiers en pratique',
      body: 'Des limites de fichiers explicites dans ton prompt empêchent l\'agent de toucher du code non relié.',
      language: 'text',
      filename: 'prompt.txt',
      code: "Implement the password reset flow.\n\nBOUNDARIES:\n- Only create/modify files in: src/components/auth/ and src/lib/auth/\n- Do NOT touch: src/components/dashboard/, src/lib/db/, src/app/api/\n- New files are allowed within the boundary directories\n- If you need changes outside these directories, tell me what\n  you need changed and I will do it separately.\n\nThis is important: if you find yourself wanting to modify\na file outside the boundary, STOP and explain why instead\nof doing it.",
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
      type: 'info',
      title: 'Limites de fonctions : une tâche par prompt',
      body: "Même à l'intérieur d'un seul fichier, tu peux contraindre le scope à une seule fonction ou module. « Implémente uniquement le helper validateSession — n'implémente pas le middleware d'auth complet, juste cette seule fonction. » Ça empêche l'agent d'anticiper ta prochaine demande et de pré-construire des choses que t'as pas encore spécifiées. Ça rend aussi la sortie triviale à réviser : t'as demandé une fonction, t'évalues une fonction.",
    },
    {
      type: 'code-demo',
      title: 'Contrainte de scope au niveau fonction',
      body: 'Contraindre à une seule fonction produit une sortie ciblée et révisable.',
      language: 'text',
      filename: 'prompt.txt',
      code: "Implement the `validateSession` function in src/lib/auth/session.ts.\n\nSignature:\n  async function validateSession(token: string): Promise<Session | null>\n\nBehavior:\n- Decode the JWT token (use jose library)\n- Check expiry — return null if expired\n- Look up the session in the database via sessionId from payload\n- Return the Session object if valid, null otherwise\n\nDo NOT implement:\n- Token refresh logic (separate task)\n- Session creation (already done)\n- Middleware that calls this function (separate task)\n- Error handling beyond returning null (keep it simple for now)\n\nJust this one function. Nothing else.",
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
      type: 'info',
      title: 'Budgets de tokens : garder les prompts concentrés',
      body: "Chaque token de contexte compétitionne pour l'attention de l'agent. Un prompt qui inclut le contexte de tout le projet, le schéma complet de la base de données, chaque route API, et le design system au complet — puis demande une seule fonction utilitaire — gaspille de l'attention sur du contexte non pertinent. Inclus uniquement le contexte directement pertinent à la tâche en cours. Si l'agent a besoin de plus, il va le demander (ou tu peux le fournir en suivis). Mets l'information la plus importante en premier.",
    },
    {
      type: 'code-demo',
      title: 'Contexte ciblé vs tout inclure',
      body: 'Inclus uniquement le contexte dont l\'agent a besoin pour CETTE tâche spécifique.',
      language: 'text',
      filename: 'focused-prompt.txt',
      code: "❌ KITCHEN SINK (wastes attention on irrelevant context):\n\nHere's my full schema: [500 lines of SQL]\nHere's my auth system: [200 lines of code]\nHere's my design system: [300 lines of tokens]\nNow implement the validateSession function.\n\n✅ FOCUSED (relevant context only):\n\nImplement validateSession in src/lib/auth/session.ts.\n\nRelevant types:\n  interface Session { id: string; userId: string; expiresAt: Date }\n\nRelevant DB call (already exists):\n  db.query.sessions.findFirst({ where: eq(sessions.id, sessionId) })\n\nJWT library: jose (already installed)\n\n[spec follows...]",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Discipline du contexte acquise !',
    },

    // === SPLITTING LARGE TASKS ===
    {
      type: 'info',
      title: 'Découper les grosses tâches sans perdre la cohérence',
      body: "Le défi avec un scope étroit : comment construire un système complexe à partir de pièces isolées sans que ça semble disjoint ? La réponse, c'est un spec partagé que chaque sous-tâche référence. Tu écris le spec complet du système une fois (la vision d'ensemble), puis tu extrais des sous-tâches ciblées qui citent chacune la section pertinente. Chaque sous-tâche connaît sa place dans l'ensemble — mais n'exécute que sa partie étroite. L'agent a juste assez de contexte pour être cohérent sans être submergé.",
    },
    {
      type: 'code-demo',
      title: 'Patron de décomposition de tâches',
      body: 'Découpe un gros système en tâches séquentielles ciblées, chacune avec sa propre limite.',
      language: 'markdown',
      filename: 'auth-tasks.md',
      code: "# Auth System — Task Breakdown\n\n## Task 1: Database Schema (src/db/schema/auth.ts)\nCreate users, sessions, and password_resets tables.\nDo NOT implement any application logic.\n\n## Task 2: Session Helpers (src/lib/auth/session.ts)\nImplement: createSession, validateSession, deleteSession.\nUse the schema from Task 1. Do NOT create API routes.\n\n## Task 3: Password Utilities (src/lib/auth/password.ts)\nImplement: hashPassword, verifyPassword, generateResetToken.\nStandalone utilities — no database calls in this file.\n\n## Task 4: Auth API Routes (src/app/api/auth/)\nCreate login, register, logout routes.\nImport from Task 2 and Task 3. Do NOT modify those files.\n\n## Task 5: Auth UI Components (src/components/auth/)\nCreate LoginForm, RegisterForm, ResetPasswordForm.\nCall API routes from Task 4. Do NOT modify API logic.",
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
      type: 'info',
      title: 'Principe 5 : Les limites forcent de meilleures décisions',
      body: "C'est pas juste une question de qualité de l'agent. Les contraintes de scope forcent de meilleures décisions de TA part en tant que directeur. Quand tu peux pas tout mettre dans un seul prompt, tu dois réfléchir au séquençage : qu'est-ce qui dépend de quoi ? Qu'est-ce qui peut être construit indépendamment ? Quels contrats d'interface doivent être définis d'avance ? Cette pensée de décomposition est la compétence centrale de l'architecture logicielle. Les agents ne l'ont pas inventée — ils ont juste rendu ça viscéralement évident quand tu la sautes.",
    },
    {
      type: 'info',
      title: 'Les limites comme communication',
      body: "Quand tu écris « touche uniquement src/components/auth/ », tu communiques trois choses simultanément. À l'agent : ta zone de travail. À toi-même : le rayon d'impact de ce changement. À ton futur toi : ce qui a été modifié dans cette itération. Les contraintes de scope sont de la documentation, des garde-fous de sécurité et des aides à la concentration — tout en une seule ligne. Elles ne coûtent rien à écrire et sauvent un temps de débogage énorme.",
    },

    // === REAL CLAUDE CODE FLAGS ===
    {
      type: 'info',
      title: 'Patrons de scope dans Claude Code',
      body: "Claude Code supporte plusieurs patrons pour contraindre le scope. Tu peux utiliser CLAUDE.md pour établir des limites persistantes pour un projet. Tu peux utiliser des instructions en ligne dans le prompt pour des contraintes par tâche. Et tu peux structurer tes prompts pour référencer des fichiers spécifiques par chemin. L'insight clé : le scope n'est pas une fonctionnalité de l'outil — c'est une discipline dans comment tu écris tes prompts. Tout système d'agent bénéficie d'un scope explicite.",
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
      type: 'info',
      title: 'Quand un scope plus large est justifié',
      body: "Pas toutes les tâches devraient être micro-scopées. Quand les changements sont étroitement couplés — un changement de type qui se propage dans 5 fichiers — un scope étroit crée plus de travail qu'il en sauve. La règle : élargis le scope seulement quand le couplage entre les changements est si serré que les séparer te demanderait de spécifier le contrat d'interface plus en détail que juste laisser l'agent faire les deux côtés. Si deux changements ne partagent aucune interface, ce sont des tâches séparées. S'ils partagent une interface serrée, c'est peut-être une seule tâche.",
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
      type: 'info',
      title: 'L\'état d\'esprit de la contrainte',
      body: "Contraindre le scope semble contre-intuitif quand les agents promettent de « tout faire ». Mais le chemin le plus rapide vers un système fonctionnel, c'est une séquence de sous-tâches ciblées et de haute qualité — pas une tentative tentaculaire qui nécessite un débogage extensif. Chaque minute que tu passes à définir le scope en sauve cinq à corriger des incohérences. Chaque limite que tu établis est une décision que t'auras pas à défaire. Les meilleurs directeurs ne sont pas ceux qui demandent le plus — ce sont ceux qui demandent exactement la bonne chose au bon moment.",
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
