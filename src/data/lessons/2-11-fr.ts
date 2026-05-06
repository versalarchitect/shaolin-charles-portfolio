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

    // === VERCEL CONFIGURATION ===
    {
      type: 'info',
      title: 'Diriger l\'agent à travers la configuration Vercel',
      body: "Vercel est la cible de déploiement pour ce cours. L'agent doit produire : un vercel.json (si nécessaire), la configuration de la commande de build appropriée, les déclarations de variables d'environnement, et les paramètres spécifiques au framework. T'as pas besoin de connaître chaque option Vercel — t'as besoin de savoir quelles questions poser et quoi vérifier dans la sortie.",
    },
    {
      type: 'code-demo',
      title: 'Spécification des variables d\'environnement',
      body: 'Dirige l\'agent pour créer une spécification claire des variables d\'environnement qui sépare les variables publiques des secrètes.',
      language: 'markdown',
      filename: 'ENV_SPEC.md',
      code: "## Environment Variables\n\n### Public (exposed to client via NEXT_PUBLIC_ prefix)\n- NEXT_PUBLIC_APP_URL — canonical URL (https://myapp.com in prod)\n- NEXT_PUBLIC_SUPABASE_URL — Supabase project URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anonymous/public key\n\n### Secret (server-only, never in client bundle)\n- SUPABASE_SERVICE_ROLE_KEY — admin access, server actions only\n- SESSION_SECRET — 32+ char random string for cookie signing\n- RESEND_API_KEY — email sending (Resend.com)\n\n### Per-Environment Values\n- Development: .env.local (gitignored)\n- Preview: Vercel preview environment settings\n- Production: Vercel production environment settings\n\n### CRITICAL: Never expose\n- SERVICE_ROLE_KEY in any client component\n- SESSION_SECRET in any API response\n- Raw database connection strings in error messages",
    },
    {
      type: 'terminal',
      instruction: 'Dirige l\'agent pour créer un template .env.local approprié avec des valeurs de remplacement et un .env.example sécuritaire à committer.',
      expectedCommand: 'claude "Create two files: (1) .env.example with all environment variables listed with placeholder values like YOUR_SUPABASE_URL_HERE — this is committed to git as documentation. (2) .env.local with the actual structure matching .env.example but blank values. Verify .env.local is in .gitignore. Variables needed: NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET."',
      hint: 'L\'agent devrait créer le fichier d\'exemple (sécuritaire à committer) et le fichier local (dans le gitignore).',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Configuration d\'environnement comprise !',
    },

    // === SECURITY AUDIT ===
    {
      type: 'info',
      title: 'Audit de sécurité : ce que les agents manquent',
      body: "Avant de déployer, tu audites le code de l'agent pour trois catégories de problèmes de sécurité. Premièrement : les secrets qui fuient — clés API, chaînes de connexion, ou tokens qui se retrouvent dans le code côté client ou committés dans git. Deuxièmement : les routes non protégées — des endpoints API ou des server actions qui sautent les vérifications d'authentification. Troisièmement : la surexposition de données — retourner des enregistrements complets de la base de données (incluant les champs sensibles) quand le client a besoin seulement d'un sous-ensemble. Dirige l'agent pour corriger ces problèmes avant de déployer, pas après.",
    },
    {
      type: 'code-demo',
      title: 'Prompts d\'audit de sécurité',
      body: 'Ces trois prompts attrapent les problèmes de sécurité les plus courants dans le code généré par agent.',
      language: 'text',
      filename: 'security-audit.txt',
      code: "AUDIT 1: Secret leakage\n\"Search the codebase for any hardcoded API keys, tokens, passwords,\nor connection strings. Check: (1) any string that looks like a key\ncommitted in source files, (2) any server-only env var accessed in\na file under src/app/ that is a client component ('use client'),\n(3) any .env file tracked by git. Report findings.\"\n\nAUDIT 2: Unprotected routes\n\"List every API route in src/app/api/ and every server action.\nFor each one, verify it checks authentication before proceeding.\nFlag any route that performs a mutation (POST/PUT/DELETE/server action)\nwithout validating the session. Report unprotected routes.\"\n\nAUDIT 3: Data over-exposure\n\"Check all API responses and server action returns. Flag any that\nreturn full database records without selecting specific fields.\nSpecifically look for: passwordHash, email in public-facing responses,\nfull user objects where only name+id are needed. Report findings.\"",
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
      type: 'info',
      title: 'Déploiement de prévisualisation : vérifier avant la production',
      body: "Ne déploie jamais directement en production sans prévisualisation. Vercel crée automatiquement des déploiements de prévisualisation pour chaque push sur une branche non-main. Le workflow : pousse sur une branche de fonctionnalité, obtiens un URL de prévisualisation, vérifie que le déploiement marche avec les vraies variables d'environnement (pas localhost), vérifie que les fonctionnalités côté serveur fonctionnent correctement, puis fusionne dans main pour la production. Les déploiements de prévisualisation attrapent les bugs spécifiques à l'environnement que localhost ne révèle jamais.",
    },
    {
      type: 'diagram',
      title: 'Pipeline de déploiement',
      body: 'Chaque changement passe par des étapes de vérification avant d\'atteindre la production.',
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
      type: 'info',
      title: 'DNS et domaines personnalisés',
      body: "Si ton projet a besoin d'un domaine personnalisé, dirige l'agent pour documenter la configuration DNS requise — ne le laisse pas deviner ou halluciner des enregistrements DNS. Le patron : (1) ajoute le domaine dans le tableau de bord Vercel, (2) Vercel fournit les enregistrements DNS requis (habituellement un enregistrement A et/ou CNAME), (3) tu configures ceux-ci chez ton registraire, (4) attends la propagation (jusqu'à 48 heures, habituellement quelques minutes). L'agent peut te dire quels enregistrements sont nécessaires mais ne peut pas configurer ton registraire.",
    },
    {
      type: 'code-demo',
      title: 'Documentation DNS que l\'agent devrait produire',
      body: 'Dirige l\'agent pour documenter les enregistrements DNS exacts nécessaires pour ta configuration de domaine.',
      language: 'markdown',
      filename: 'DEPLOY.md',
      code: "## DNS Configuration\n\n### Production Domain: feedback.myapp.com\n\nAdd these records at your DNS provider:\n\n| Type  | Name     | Value              | TTL  |\n|-------|----------|--------------------|------|\n| CNAME | feedback | cname.vercel-dns.com | 3600 |\n\n### Verification\n- After adding records, verify with: `dig feedback.myapp.com CNAME`\n- Vercel dashboard shows verification status\n- SSL certificate auto-provisions once DNS propagates\n\n### Environment URL Updates\n- Update NEXT_PUBLIC_APP_URL to https://feedback.myapp.com\n- Update any OAuth callback URLs to use the new domain\n- Update CORS allowed origins if applicable",
    },

    // === ROLLBACK STRATEGY ===
    {
      type: 'info',
      title: 'Stratégie de rollback quand les choses cassent',
      body: "Des bris en production, ça arrive. Ton plan de rollback devrait être plus rapide que ton temps de correction. Vercel garde chaque déploiement immuable — tu peux instantanément revenir à n'importe quel déploiement précédent via le tableau de bord ou le CLI. L'insight clé : le rollback, c'est pas un échec. C'est une stratégie délibérée qui sépare « arrêter l'hémorragie » de « corriger le bug ». Fais le rollback immédiatement, puis débogue calmement sur une branche sans que les utilisateurs subissent l'état cassé.",
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
      type: 'info',
      title: 'La checklist de préparation à la production',
      body: "Avant de fusionner dans main et déclencher un déploiement en production, vérifie ces catégories : (1) Environnement — toutes les variables définies dans Vercel pour la production, aucun URL localhost en dur. (2) Sécurité — pas de secrets qui fuient, toutes les mutations authentifiées, pas de surexposition de données. (3) Performance — pas de récupération côté client de gros ensembles de données, images optimisées, pas de scripts tiers bloquants. (4) Gestion des erreurs — les erreurs montrent des messages conviviaux, pas des stack traces. (5) SEO/Meta — titre, description, image OG configurés si c'est public.",
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
      type: 'info',
      title: 'Le déploiement comme compétence dirigée',
      body: "Le déploiement, c'est pas une seule commande — c'est un processus de vérification en plusieurs étapes que tu diriges. L'agent fait le travail mécanique : créer les fichiers de config, écrire les templates d'environnement, effectuer les audits. Toi, tu fournis le jugement : décider ce qui a besoin d'une prévisualisation vs un déploiement direct, évaluer les trouvailles de sécurité, choisir quand faire un rollback. Après cette leçon, tu peux prendre n'importe quel projet construit par agent depuis localhost jusqu'à un URL de production avec la confiance que rien de critique n'a été manqué.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Compétences de déploiement maîtrisées ! Tu peux mettre en ligne n\'importe quel projet construit par IA.',
    },
  ],
}

export default content
