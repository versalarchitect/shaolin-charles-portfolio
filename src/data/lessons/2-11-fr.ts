import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-11',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Mettre ton produit en ligne sur Internet',
      body: "Un produit qui roule sur localhost est un prototype. Un produit qui roule en production est un produit. L'écart entre les deux, c'est là où la plupart des projets dirigés par agent meurent — pas parce que le code est mauvais, mais parce que la configuration de déploiement, les variables d'environnement, le DNS et les préoccupations de sécurité sont traités à la légère. Dans cette leçon, tu vas diriger un agent à travers le pipeline complet de déploiement : configurer, auditer, prévisualiser et livrer. C'est la dernière compétence avant de prouver la boucle complète dans le projet final.",
    },
    {
      type: 'info',
      title: 'L\'écart de préparation à la production',
      body: "Les agents sont excellents pour écrire du code applicatif mais produisent fréquemment des déploiements avec des problèmes : des URLs en dur qui marchent sur localhost mais cassent en production, des variables d'environnement référencées mais jamais configurées, des clés API committées dans le dépôt, des headers CORS manquants, et des routes qui sautent l'authentification. Ton travail, c'est de savoir à quoi ressemble la préparation à la production et de diriger l'agent pour l'atteindre — pas d'espérer que l'agent s'en souvienne tout seul.",
    },
    {
      type: 'compare',
      title: 'Variables d\'environnement : mauvais vs correct',
      body: 'La façon dont tu gères les variables d\'environnement détermine si ton app fonctionne en production et si les secrets fuient.',
      question: 'Quelle approche est sécuritaire pour la production ?',
      correctSide: 'right',
      left: {
        label: 'Mauvais',
        content: '// Hardcoded in code — exposed in bundle!\nconst API_URL = "https://api.example.com"\n\n// Service key in client — admin access!\nconst supabase = createClient(\n  "https://abc.supabase.co",\n  "eyJhbG...service_role_key"\n)',
        language: 'typescript',
      },
      right: {
        label: 'Correct',
        content: '// Public vars use NEXT_PUBLIC_ prefix\nconst API_URL = process.env.NEXT_PUBLIC_API_URL\n\n// Secret keys stay server-side only\nconst supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.SUPABASE_SERVICE_ROLE_KEY!\n)',
        language: 'typescript',
      },
      explanation: 'Les variables NEXT_PUBLIC_ sont sécuritaires pour le navigateur. Les variables sans ce préfixe restent sur le serveur. Ne mets jamais d\'URLs ou de clés en dur — elles changent par environnement et fuient dans l\'historique git.',
    },

    // === VERCEL CONFIGURATION ===
    {
      type: 'multiple-choice',
      question: 'Que doit produire l\'agent pour une configuration de déploiement Vercel appropriée ?',
      options: [
        'Uniquement un fichier vercel.json',
        'Un vercel.json (si nécessaire), la config de commande de build, les déclarations de variables d\'environnement, et les paramètres spécifiques au framework',
        'Uniquement les variables d\'environnement',
        'Un Dockerfile et docker-compose.yml',
      ],
      correctIndex: 1,
      explanation: "Vercel est la cible de déploiement pour ce cours. L'agent doit produire : un vercel.json (si nécessaire), la configuration de la commande de build appropriée, les déclarations de variables d'environnement, et les paramètres spécifiques au framework. T'as pas besoin de connaître chaque option Vercel — t'as besoin de savoir quelles questions poser et quoi vérifier dans la sortie.",
    },
    {
      type: 'match',
      instruction: 'Associe chaque variable d\'environnement à sa classification correcte :',
      leftItems: ['NEXT_PUBLIC_APP_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SESSION_SECRET'],
      rightItems: ['Secret : serveur seulement, 32+ caractères pour la signature de cookies', 'Publique : sûre pour le navigateur, URL canonique', 'Secret : serveur seulement, accès admin à la base de données', 'Publique : sûre pour le navigateur, clé anonyme/publique'],
      correctPairs: { 0: 1, 1: 2, 2: 3, 3: 0 },
      explanation: 'Les variables avec le préfixe NEXT_PUBLIC_ sont exposées au navigateur et sûres pour le code côté client. Les variables sans ce préfixe sont des secrets serveur qui ne doivent jamais apparaître dans les composants client. Se tromper mène soit à des fonctionnalités cassées (vars publiques manquantes) soit à des brèches de sécurité (secrets exposés).',
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour créer un template .env.local approprié avec des valeurs de remplacement et un .env.example sécuritaire à committer.',
      expectedCommand: 'claude "Create two files: (1) .env.example with all environment variables listed with placeholder values like YOUR_SUPABASE_URL_HERE — this is committed to git as documentation. (2) .env.local with the actual structure matching .env.example but blank values. Verify .env.local is in .gitignore. Variables needed: NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET."',
      hint: 'L\'agent devrait créer le fichier d\'exemple (sécuritaire à committer) et le fichier local (dans le gitignore).',
    },
    {
      type: 'code-fill',
      instruction: 'Complète le fichier .env.example. Les variables publiques utilisent le préfixe NEXT_PUBLIC_, les secrets non.',
      language: 'shell',
      filename: '.env.example',
      template: '# Public (safe for browser)\n{{public_url}}=https://your-app.vercel.app\n{{public_supabase}}=https://abc.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...\n\n# Secret (server only — NEVER prefix with NEXT_PUBLIC_)\n{{secret_service}}=eyJ...\n{{secret_webhook}}=whsec_...',
      blanks: [
        { id: 'public_url', answer: 'NEXT_PUBLIC_APP_URL', alternatives: ['NEXT_PUBLIC_URL', 'NEXT_PUBLIC_SITE_URL'], placeholder: 'variable URL publique ?', hint: 'Commence par NEXT_PUBLIC_' },
        { id: 'public_supabase', answer: 'NEXT_PUBLIC_SUPABASE_URL', placeholder: 'variable Supabase publique ?', hint: 'Commence par NEXT_PUBLIC_' },
        { id: 'secret_service', answer: 'SUPABASE_SERVICE_ROLE_KEY', alternatives: ['SUPABASE_SERVICE_KEY'], placeholder: 'variable Supabase secrète ?', hint: 'Pas de préfixe NEXT_PUBLIC_ — serveur seulement' },
        { id: 'secret_webhook', answer: 'STRIPE_WEBHOOK_SECRET', alternatives: ['STRIPE_WEBHOOK_SIGNING_SECRET'], placeholder: 'variable Stripe secrète ?', hint: 'Secret de signature webhook Stripe' },
      ],
      explanation: 'Le .env.example documente toutes les variables requises sans valeurs réelles. Les variables publiques ont le préfixe NEXT_PUBLIC_. Les secrets jamais — ils sont invisibles pour le code côté client.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Configuration d\'environnement comprise !',
    },

    // === SECURITY AUDIT ===
    {
      type: 'order',
      instruction: 'Ordonne ces trois catégories d\'audit de sécurité du risque le plus élevé au plus bas :',
      items: [
        'Surexposition de données : retourner des enregistrements BD complets avec des champs sensibles',
        'Secrets qui fuient : clés API, tokens, ou chaînes de connexion dans le code client ou git',
        'Routes non protégées : mutations sans vérifications d\'authentification',
      ],
      correctOrder: [1, 2, 0],
    },
    {
      type: 'code-fill',
      instruction: 'Complète ces prompts d\'audit de sécurité pour diriger l\'agent avant de déployer :',
      language: 'text',
      filename: 'security-audit.txt',
      template: 'AUDIT 1 : Fuite de secrets\n"Cherche dans le code tout {{secret_types}} codé en dur.\nVérifie toute variable d\'env serveur accédée dans un composant {{client_marker}}."\n\nAUDIT 2 : Routes non protégées\n"Liste chaque route API et server action. Signale toute route qui effectue un\n{{mutation_types}} sans valider la {{auth_check}}."\n\nAUDIT 3 : Surexposition de données\n"Signale toute réponse API qui retourne des enregistrements BD complets sans\nsélectionner des champs spécifiques. Cherche : {{sensitive_fields}}."',
      blanks: [
        { id: 'secret_types', answer: 'clés API, tokens, mots de passe, ou chaînes de connexion', alternatives: ['clés API, tokens, ou mots de passe', 'secrets codés en dur'], placeholder: 'que chercher ?', hint: 'Types de secrets qui ne devraient jamais être dans le code' },
        { id: 'client_marker', answer: "'use client'", alternatives: ['use client', '"use client"'], placeholder: 'marqueur composant client ?', hint: 'La directive React qui marque les composants client' },
        { id: 'mutation_types', answer: 'POST/PUT/DELETE/server action', alternatives: ['mutation (POST, PUT, DELETE)', 'opération d\'écriture'], placeholder: 'types de mutation ?', hint: 'Méthodes HTTP qui modifient les données' },
        { id: 'auth_check', answer: 'session', alternatives: ['session', 'authentification', 'auth'], placeholder: 'quoi valider ?', hint: 'Ce qui prouve qu\'un utilisateur est bien qui il prétend être' },
        { id: 'sensitive_fields', answer: 'passwordHash, email dans les réponses publiques', alternatives: ['passwordHash, email, IDs internes'], placeholder: 'champs sensibles ?', hint: 'Champs qui ne devraient jamais être dans les réponses API publiques' },
      ],
      explanation: "Ces trois prompts d'audit attrapent les problèmes de sécurité les plus courants dans le code généré par agent. Dirige l'agent pour corriger ces problèmes AVANT de déployer, pas après. Les secrets qui fuient sont catastrophiques, les routes non protégées sont exploitables, et la surexposition de données viole la confiance des utilisateurs.",
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a construit une app Next.js avec une server action qui supprime des données utilisateur. L\'action marche correctement mais n\'a aucune vérification de session — n\'importe quelle requête HTTP peut la déclencher. Quel type de problème de sécurité est-ce ?',
      options: [
        'Fuite de secrets',
        'Route de mutation non protégée',
        'Surexposition de données',
        'Mauvaise configuration CORS',
      ],
      correctIndex: 1,
      explanation: 'Une mutation (suppression) sans authentification est une route non protégée. N\'importe quel utilisateur — ou bot — peut déclencher la suppression. Les server actions ont quand même besoin de vérifications d\'auth même si ce ne sont pas des routes API traditionnelles.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Compétences d\'audit de sécurité acquises !',
    },

    // === PREVIEW DEPLOYMENT WORKFLOW ===
    {
      type: 'multiple-choice',
      question: 'Pourquoi ne jamais déployer directement en production sans un déploiement de prévisualisation d\'abord ?',
      options: [
        'Les déploiements de prévisualisation sont plus rapides à construire',
        'Vercel exige des déploiements de prévisualisation avant la production',
        'Les déploiements de prévisualisation attrapent les bugs spécifiques à l\'environnement (vars d\'env, fonctions serveur, DNS) que localhost ne révèle jamais',
        'Les déploiements de prévisualisation coûtent moins cher à exécuter',
      ],
      correctIndex: 2,
      explanation: "Vercel crée automatiquement des déploiements de prévisualisation pour chaque push sur une branche non-main. Le workflow : pousse sur une branche, obtiens un URL de prévisualisation, vérifie que le déploiement marche avec les vraies variables d'environnement, vérifie les fonctionnalités côté serveur, puis fusionne dans main. Les prévisualisations attrapent les bugs spécifiques à l'environnement que localhost ne révèle jamais.",
    },
    {
      type: 'interactive-diagram',
      title: 'Pipeline de déploiement',
      body: 'Chaque changement passe par des étapes de vérification avant d\'atteindre la production. Clique sur chaque étape.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'local', label: 'Dev local', sublabel: 'localhost:3000', shape: 'pill' },
          { id: 'preview', label: 'Déploiement preview', sublabel: 'URL preview Vercel', shape: 'rounded', highlight: true },
          { id: 'verify', label: 'Vérifier', sublabel: 'Manuel + automatisé', shape: 'diamond' },
          { id: 'prod', label: 'Production', sublabel: 'charlesjackson.dev', shape: 'pill', highlight: true },
          { id: 'rollback', label: 'Rollback', sublabel: 'Déploiement précédent', shape: 'rounded' },
        ],
        edges: [
          { from: 'local', to: 'preview', label: 'push branche' },
          { from: 'preview', to: 'verify' },
          { from: 'verify', to: 'prod', label: 'merge dans main' },
          { from: 'verify', to: 'local', label: 'problèmes trouvés', dashed: true },
          { from: 'prod', to: 'rollback', label: 'ça casse', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['local'],
          highlightEdges: [{ from: 'local', to: 'preview' }],
          explanation: 'Le développement commence en local. Tu construis les fonctionnalités sur localhost, tu exécutes les tests, et tu vérifies que l\'app marche dans ton environnement de dev avant de pousser quoi que ce soit.',
        },
        {
          highlightNodes: ['preview'],
          highlightEdges: [{ from: 'preview', to: 'verify' }],
          explanation: 'Pousser sur une branche de fonctionnalité déclenche un déploiement preview Vercel. C\'est la première fois que ton code roule avec les vraies variables d\'environnement, le vrai DNS, et les vraies fonctions serveur.',
        },
        {
          highlightNodes: ['verify'],
          highlightEdges: [{ from: 'verify', to: 'prod' }, { from: 'verify', to: 'local' }],
          explanation: 'Vérifie le déploiement preview : les variables d\'env marchent, les fonctions serveur répondent, les flux d\'auth se complètent, et l\'UI s\'affiche correctement. Si des problèmes sont trouvés, corrige en local et pousse à nouveau.',
        },
        {
          highlightNodes: ['prod'],
          highlightEdges: [{ from: 'prod', to: 'rollback' }],
          explanation: 'Fusionner dans main déclenche un déploiement en production. Ton app est live. Si quelque chose casse, pas de panique — utilise le chemin de rollback.',
        },
        {
          highlightNodes: ['rollback'],
          highlightEdges: [{ from: 'prod', to: 'rollback' }],
          explanation: 'Le rollback promeut instantanément le déploiement précédent qui marchait. Ça restaure le service en quelques secondes. Puis débogue calmement sur une branche sans que les utilisateurs subissent l\'état cassé.',
        },
      ],
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour créer une branche de déploiement, la pousser, et expliquer comment vérifier le déploiement de prévisualisation.',
      expectedCommand: 'claude "Create a branch called deploy/feedback-board, push it to origin, and then explain: (1) where to find the Vercel preview URL, (2) what to test on the preview that cannot be tested on localhost (env vars, server functions, edge cases with production URLs), (3) how to verify the build log has no warnings."',
      hint: 'L\'agent devrait gérer les opérations git et fournir des instructions de vérification pour la prévisualisation.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Workflow de prévisualisation maîtrisé !',
    },

    // === DNS AND DOMAIN ===
    {
      type: 'order',
      instruction: 'Ordonne les étapes pour configurer un domaine personnalisé sur Vercel :',
      items: [
        'Attendre la propagation DNS (jusqu\'à 48 heures, habituellement quelques minutes)',
        'Ajouter le domaine dans le tableau de bord Vercel',
        'Configurer les enregistrements DNS chez ton registraire (enregistrement A et/ou CNAME)',
        'Vérifier que le certificat SSL a été auto-provisionné correctement',
        'Mettre à jour NEXT_PUBLIC_APP_URL et les URLs de callback OAuth',
      ],
      correctOrder: [1, 2, 0, 3, 4],
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette documentation DNS que l\'agent devrait produire pour ta configuration de domaine :',
      language: 'markdown',
      filename: 'DEPLOY.md',
      template: '## Configuration DNS\n\n### Domaine de production : feedback.myapp.com\n\nAjoute cet enregistrement chez ton fournisseur DNS :\n\n| Type | Nom | Valeur | TTL |\n|------|-----|--------|-----|\n| {{record_type}} | feedback | {{record_value}} | 3600 |\n\n### Vérification\n- Après avoir ajouté les enregistrements, vérifie avec : `{{verify_cmd}}`\n- Le certificat SSL s\'auto-provisionne une fois le DNS propagé',
      blanks: [
        { id: 'record_type', answer: 'CNAME', alternatives: ['cname'], placeholder: 'type d\'enregistrement DNS ?', hint: 'Pointe un sous-domaine vers un autre hostname' },
        { id: 'record_value', answer: 'cname.vercel-dns.com', alternatives: ['cname.vercel-dns.com.'], placeholder: 'valeur DNS Vercel ?', hint: 'Vercel fournit cette cible CNAME' },
        { id: 'verify_cmd', answer: 'dig feedback.myapp.com CNAME', alternatives: ['nslookup feedback.myapp.com', 'dig +short feedback.myapp.com CNAME'], placeholder: 'commande de vérification ?', hint: 'Commande de recherche DNS pour vérifier l\'enregistrement CNAME' },
      ],
      explanation: 'Dirige l\'agent pour documenter les enregistrements DNS exacts nécessaires. Ne le laisse pas deviner ou halluciner des enregistrements DNS. L\'agent peut te dire quels enregistrements sont nécessaires mais ne peut pas configurer ton registraire.',
    },

    // === ROLLBACK STRATEGY ===
    {
      type: 'compare',
      title: 'Stratégie de rollback quand les choses cassent',
      body: 'Des bris en production, ça arrive. Ton plan de rollback devrait être plus rapide que ton temps de correction.',
      question: 'Quelle approche restaure le service le plus rapidement quand la production casse ?',
      correctSide: 'right',
      left: {
        label: 'Déboguer d\'abord',
        content: '1. Investiguer le bug\n2. Écrire un correctif\n3. Pousser le correctif\n4. Attendre le build + déploiement\n5. Vérifier que le correctif marche\n\nTemps de restauration : 30-60 minutes\nUtilisateurs affectés tout le temps',
        language: 'text',
      },
      right: {
        label: 'Rollback d\'abord',
        content: '1. Rollback au dernier déploiement qui marche\n   (instantané via dashboard/CLI Vercel)\n2. Service restauré en quelques secondes\n3. Déboguer calmement sur une branche\n4. Pousser le correctif quand prêt et testé\n\nTemps de restauration : secondes\nUtilisateurs non affectés pendant le débogage',
        language: 'text',
      },
      explanation: "Le rollback, c'est pas un échec. C'est une stratégie délibérée qui sépare « arrêter l'hémorragie » de « corriger le bug ». Vercel garde chaque déploiement immuable — tu peux instantanément revenir à n'importe quel déploiement précédent.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour documenter la procédure de rollback en utilisant les commandes du CLI Vercel.',
      expectedCommand: 'claude "Add a Rollback section to DEPLOY.md with these steps: (1) identify the last working deployment with vercel ls --prod, (2) promote it with vercel promote <deployment-url>, (3) verify the rollback with curl to the production URL, (4) create a fix branch from main to debug the issue. Include the actual CLI commands."',
      hint: 'L\'agent devrait fournir des commandes concrètes du CLI Vercel pour lister les déploiements et promouvoir un précédent.',
    },
    {
      type: 'multiple-choice',
      question: 'Ton déploiement de production casse à 15h. Les utilisateurs sont affectés. Quel est le bon ordre des opérations ?',
      options: [
        'Déboguer le problème → le corriger → pousser un nouveau déploiement → vérifier',
        'Faire un rollback au déploiement précédent immédiatement → puis déboguer sur une branche → pousser le correctif quand c\'est prêt',
        'Mettre le site hors ligne → déboguer → redéployer → remettre en ligne',
        'Demander à l\'agent de corriger le code de production directement via un prompt d\'urgence',
      ],
      correctIndex: 1,
      explanation: 'Rollback d\'abord, débogage ensuite. Le rollback instantané de Vercel restaure le service en quelques secondes. Déboguer sous pression avec des utilisateurs affectés mène à des correctifs pressés et bâclés. Sépare la réponse d\'urgence (rollback) de la correction calme (branche + débogage + test + déploiement).',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Stratégie de rollback prête !',
    },

    // === PRODUCTION CHECKLIST ===
    {
      type: 'match',
      instruction: 'Associe chaque catégorie de préparation à la production à ce que tu dois vérifier :',
      leftItems: ['Environnement', 'Sécurité', 'Performance', 'Gestion des erreurs'],
      rightItems: ['Les erreurs montrent des messages conviviaux, pas des stack traces', 'Toutes les variables définies dans Vercel, aucun URL localhost en dur', 'Pas de secrets qui fuient, toutes les mutations authentifiées', 'Pas de récupération côté client de gros ensembles de données, images optimisées'],
      correctPairs: { 0: 1, 1: 2, 2: 3, 3: 0 },
      explanation: "Avant de fusionner dans main, vérifie : (1) Environnement — toutes les variables définies, aucun URL localhost. (2) Sécurité — pas de secrets qui fuient, toutes les mutations authentifiées. (3) Performance — pas de gros fetch côté client, images optimisées. (4) Gestion des erreurs — messages conviviaux, pas de stack traces. (5) SEO/Meta — titre, description, image OG si c'est public.",
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour effectuer une vérification de préparation à la production — scanner pour les références localhost en dur, les error boundaries manquantes et les images non optimisées.',
      expectedCommand: 'claude "Run a production readiness check: (1) grep the codebase for localhost or 127.0.0.1 in any non-config file — report findings. (2) Check that every page or layout has an error boundary or error.tsx. (3) Verify all <img> tags use next/image or have explicit width/height. (4) Check that no console.log statements remain in production code paths. Report all findings as a checklist with pass/fail."',
      hint: 'Fais chercher à l\'agent les problèmes courants de préparation à la production et les rapporter en checklist.',
    },
    {
      type: 'checklist',
      title: 'Vérification pré-déploiement :',
      items: [
        'Toutes les variables d\'environnement définies dans le tableau de bord Vercel',
        'Aucun URL localhost en dur dans le code source',
        'Audit de sécurité réussi (secrets, auth, exposition de données)',
        'Déploiement de prévisualisation testé et fonctionnel',
        'Gestion des erreurs montre des messages conviviaux, pas des stack traces',
        'Le build se complète sans avertissements',
        'Procédure de rollback documentée et testée',
      ],
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'Dans le workflow de déploiement, quel est le rôle de l\'agent vs ton rôle ?',
      options: [
        'L\'agent gère tout, y compris les décisions de jugement',
        'Tu fais tout manuellement, l\'agent regarde juste',
        'L\'agent fait le travail mécanique (config, templates, audits). Tu fournis le jugement (prévisualisation vs déploiement, évaluation de sécurité, quand faire un rollback)',
        'L\'agent déploie, tu approuves ou rejettes simplement',
      ],
      correctIndex: 2,
      explanation: "Le déploiement, c'est pas une seule commande — c'est un processus de vérification en plusieurs étapes que tu diriges. L'agent fait le travail mécanique : créer les fichiers de config, écrire les templates d'environnement, effectuer les audits. Toi, tu fournis le jugement : décider ce qui a besoin d'une prévisualisation vs un déploiement direct, évaluer les trouvailles de sécurité, choisir quand faire un rollback.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Compétences de déploiement maîtrisées ! Tu peux mettre en ligne n\'importe quel projet construit par IA.',
    },
  ],
}

export default content
