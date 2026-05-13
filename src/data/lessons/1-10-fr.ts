import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Capstone : de la spec à la production',
      body: "C'est ici que tout se connecte. Tu vas combiner chaque compétence du Tier 1 — le prompting structuré, le développement itératif, la gestion du contexte, CLAUDE.md, les workflows multi-étapes — en un flux continu. Le projet : un Générateur de Messages de Commit. Une application web mono-page où les utilisateurs collent un git diff et obtiennent un message de commit conventionnel. Tu vas spécifier, diriger un agent pour le construire, vérifier la sortie et le déployer en ligne sur une URL publique. Un vrai outil utile, un vrai déploiement, une vraie pièce de portfolio.",
    },

    // === PIPELINE DIAGRAM (INTERACTIF) ===
    {
      type: 'interactive-diagram',
      title: 'Le pipeline Spec-Build-Deploy',
      body: 'Ton capstone suit ce pipeline en cinq étapes. Parcours chaque étape pour voir quelle compétence du Tier 1 elle exerce.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Spec', sublabel: 'Écrire les exigences', shape: 'rounded', highlight: true },
          { id: 'scaffold', label: 'Scaffold', sublabel: 'L\'agent crée le projet', shape: 'rect' },
          { id: 'implement', label: 'Implémenter', sublabel: 'L\'agent écrit la logique', shape: 'rect' },
          { id: 'verify', label: 'Vérifier', sublabel: 'Tu révises et testes', shape: 'rect' },
          { id: 'deploy', label: 'Déployer', sublabel: 'Pousser en production', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'scaffold', label: 'prompt' },
          { from: 'scaffold', to: 'implement', label: 'itérer' },
          { from: 'implement', to: 'verify', label: 'réviser' },
          { from: 'verify', to: 'deploy', label: 'livrer' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [],
          explanation: 'Spec : Définir les exigences exactes, les contraintes et les limites hors périmètre. C\'est le prompting structuré — la compétence la plus importante du Tier 1.',
        },
        {
          highlightNodes: ['spec', 'scaffold'],
          highlightEdges: [{ from: 'spec', to: 'scaffold' }],
          explanation: 'Scaffold : Prompter l\'agent pour créer la structure de fichiers uniquement — pas de logique encore. C\'est la gestion du contexte : garder chaque prompt focalisé sur une seule préoccupation.',
        },
        {
          highlightNodes: ['scaffold', 'implement'],
          highlightEdges: [{ from: 'scaffold', to: 'implement' }],
          explanation: 'Implémenter : Construire la logique un composant à la fois. C\'est le développement itératif — réviser chaque pièce avant de construire la couche suivante par-dessus.',
        },
        {
          highlightNodes: ['implement', 'verify'],
          highlightEdges: [{ from: 'implement', to: 'verify' }],
          explanation: 'Vérifier : Réviser la sortie de l\'agent pour les erreurs de logique, la conformité à la spec et la sécurité. Tu es la porte de qualité — l\'agent construit, tu valides.',
        },
        {
          highlightNodes: ['verify', 'deploy'],
          highlightEdges: [{ from: 'verify', to: 'deploy' }],
          explanation: 'Déployer : Pousser en production avec les variables d\'env appropriées et la documentation CLAUDE.md. Le projet est en ligne, maintenable et prêt pour le portfolio.',
        },
      ],
    },

    // === PHASE 1: SPEC ===
    {
      type: 'code-demo',
      title: 'Phase 1 : Écrire la spec',
      body: "La spec est le prompt le plus important que tu écriras. Ce n'est pas une liste de souhaits vague — c'est un contrat précis : le flux utilisateur exact, les contraintes techniques, les critères d'acceptation et les limites hors périmètre. L'agent ne peut pas lire tes pensées. La spec est ton esprit, externalisé.",
      language: 'markdown',
      filename: 'SPEC.md',
      code: "# Commit Message Generator — Spec\n\n## Overview\nSingle-page web tool. User pastes a git diff, gets a conventional commit message.\n\n## User Flow\n1. User lands on page — sees a textarea labeled \"Paste your git diff\"\n2. User pastes diff, clicks \"Generate\"\n3. Loading state shows while API processes\n4. Result appears in a readonly output box with a \"Copy\" button\n5. User can edit the diff and regenerate\n\n## Technical Constraints\n- Framework: Vite + React + TypeScript\n- Styling: Tailwind CSS\n- API: Single serverless function (Vercel API route)\n- LLM: Anthropic Claude API (claude-sonnet-4-20250514)\n- No database, no auth, no state persistence\n\n## Acceptance Criteria\n- [ ] Generates valid conventional commit format (type: description)\n- [ ] Handles empty input gracefully (error message, not crash)\n- [ ] Loading state visible during generation\n- [ ] Copy button works on all browsers\n- [ ] Deployed to a public Vercel URL\n- [ ] Responsive on mobile\n\n## Out of Scope\n- User accounts or history\n- Multiple LLM providers\n- Syntax highlighting in the diff input\n- Rate limiting (for now)",
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi la spec inclut-elle une section « Out of Scope » ?',
      options: [
        'Pour documenter les fonctionnalités du prochain sprint',
        'Pour empêcher l\'agent de trop construire — les agents adorent ajouter des fonctionnalités non demandées',
        'C\'est requis par le standard des commits conventionnels',
        'Pour donner un air plus professionnel au document de spec',
      ],
      correctIndex: 1,
      explanation: 'Les agents ont tendance à anticiper les besoins et ajouter des fonctionnalités que tu n\'as pas demandées. Indiquer explicitement ce qui est hors périmètre crée une frontière dure. Sans ça, tu pourrais te retrouver avec un middleware d\'auth, des schémas de base de données et du rate limiting alors que tout ce que tu voulais était un textarea et un bouton.',
    },
    {
      type: 'code-input',
      instruction: 'Dans les commits conventionnels, quel préfixe indique une nouvelle fonctionnalité ? (ex. : "___: add commit generator")',
      placeholder: 'Enter the prefix',
      answer: 'feat',
      hint: 'Abréviation de "feature" — le type de commit conventionnel le plus courant',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Spec écrite — l\'agent a ses ordres de marche !',
    },

    // === INTERACTIF : PROMPT-LAB, COMPARE ===
    {
      type: 'prompt-lab',
      instruction: 'Écris un prompt pour démarrer l\'implémentation du capstone. Inclus les éléments de spec que tu as appris dans ce tier.',
      scenario: 'Tu as une spec pour un outil de raccourcissement d\'URL. Tu dois diriger Claude Code pour scaffolder le projet. La spec dit : Next.js App Router, TypeScript strict, SQLite via Drizzle ORM, Tailwind CSS, pas d\'auth nécessaire.',
      starterPrompt: 'Build me a URL shortener.',
      responses: [
        {
          triggerKeywords: ['next.js', 'typescript', 'sqlite', 'drizzle', 'tailwind'],
          response: 'I\'ll scaffold the URL shortener with your exact stack.\n\nCreating:\n1. Next.js 15 App Router project with TypeScript strict\n2. Drizzle ORM + SQLite for the database\n3. Tailwind CSS for styling\n4. src/ directory structure\n\nStarting with the database schema...',
          quality: 'excellent',
          feedback: 'Tu as spécifié la stack technologique exacte de la spec. L\'agent n\'a pas besoin de prendre de décisions technologiques — il peut commencer à construire immédiatement.',
        },
        {
          triggerKeywords: ['url', 'shortener', 'next'],
          response: 'I\'ll build a URL shortener with Next.js! Should I use:\n- Prisma or Drizzle for the database?\n- PostgreSQL or SQLite?\n- Should I add authentication?\n\nLet me know your preferences.',
          quality: 'good',
          feedback: 'Tu as mentionné Next.js mais laissé les choix technologiques ouverts. L\'agent pose des questions de suivi au lieu de construire. Inclus toutes les contraintes de ta spec pour éliminer les points de décision.',
        },
      ],
      fallbackResponse: {
        response: 'Sure, I\'ll build a URL shortener. Let me set up a full-stack app with Express, React, PostgreSQL, Redis for caching, and Docker for deployment...',
        feedback: 'Sans contraintes de spec, l\'agent a inventé sa propre stack. Inclus : framework, mode de langage, base de données, ORM et styling de ta spec pour obtenir exactement la sortie voulue.',
      },
    },
    {
      type: 'compare',
      title: 'Tout d\'un coup vs construction phasée',
      body: 'Deux approches pour construire un projet complet avec un agent IA.',
      question: 'Quelle approche te donne plus de contrôle sur la sortie ?',
      correctSide: 'right',
      left: {
        label: 'Tout d\'un coup',
        content: 'Un seul prompt :\n"Build the entire URL shortener"\n\nRésultat :\n- 20+ fichiers créés d\'un coup\n- Difficile à réviser\n- Les erreurs s\'accumulent\n- Difficile à rediriger\n- Contexte épuisé rapidement',
        language: 'text',
      },
      right: {
        label: 'Phasé',
        content: 'Quatre prompts focalisés :\n1. "Scaffold project structure"\n2. "Implement database schema + API"\n3. "Build the frontend UI"\n4. "Add tests and verify"\n\nRésultat :\n- Révision après chaque phase\n- Erreurs détectées tôt\n- Facile à rediriger\n- Contexte reste frais',
        language: 'text',
      },
      explanation: 'La construction phasée te permet de vérifier chaque couche avant de construire la suivante. Si le schéma de base de données est faux, tu le détectes avant que le frontend soit construit par-dessus.',
    },

    // === PHASE 2: SCAFFOLD ===
    {
      type: 'terminal',
      instruction: 'Crée un nouveau projet Vite appelé commit-gen avec le template React TypeScript :',
      expectedCommand: 'npx create-vite commit-gen --template react-ts',
      hint: 'Utilise npx create-vite avec le flag --template',
    },
    {
      type: 'terminal',
      instruction: 'Installe Tailwind CSS et son plugin Vite comme dépendances de développement :',
      expectedCommand: 'npm install -D tailwindcss @tailwindcss/vite',
      hint: 'Deux packages en dépendances dev : tailwindcss et @tailwindcss/vite',
    },
    {
      type: 'code-demo',
      title: 'Prompter Claude Code pour créer la structure',
      body: 'Donne à l\'agent une instruction unique et focalisée qui référence ta spec. Scaffold seulement — pas de logique encore.',
      language: 'text',
      filename: 'prompt-to-claude-code.txt',
      code: "You: Read SPEC.md, then create the project file structure.\n     Scaffold only — no implementation yet. I want:\n     - src/App.tsx (empty component shell)\n     - src/components/DiffInput.tsx\n     - src/components/CommitOutput.tsx\n     - api/generate.ts (Vercel serverless function stub)\n     - vercel.json (route the API)\n     Do not write any logic. Just the file skeletons with\n     TypeScript interfaces for the props.",
    },

    // === PROJECT STRUCTURE DIAGRAM ===
    {
      type: 'diagram',
      title: 'Structure de fichiers du projet',
      body: 'Séparation propre : frontend dans src/, API serverless à la racine, config au premier niveau.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'root', label: 'commit-gen/', sublabel: 'Racine du projet', shape: 'rounded', highlight: true },
          { id: 'src', label: 'src/', sublabel: 'Frontend', shape: 'rect' },
          { id: 'app', label: 'App.tsx', sublabel: 'Page principale', shape: 'rect' },
          { id: 'diff', label: 'DiffInput.tsx', sublabel: 'Composant textarea', shape: 'rect' },
          { id: 'output', label: 'CommitOutput.tsx', sublabel: 'Affichage du résultat', shape: 'rect' },
          { id: 'api', label: 'api/', sublabel: 'Serverless', shape: 'rect' },
          { id: 'generate', label: 'generate.ts', sublabel: 'Appel API Claude', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'root', to: 'src' },
          { from: 'root', to: 'api' },
          { from: 'src', to: 'app' },
          { from: 'src', to: 'diff' },
          { from: 'src', to: 'output' },
          { from: 'api', to: 'generate' },
        ],
      },
    },

    // === PHASE 3: IMPLEMENT ===
    {
      type: 'code-demo',
      title: 'Prompt : implémenter la route API',
      body: 'Ce prompt donne à Claude Code exactement quoi construire pour la fonction serverless. Il spécifie le modèle, le prompt système et le format de réponse — aucune ambiguïté.',
      language: 'text',
      filename: 'prompt-api-route.txt',
      code: "You: Implement api/generate.ts as a Vercel serverless function.\n\n     Requirements:\n     - POST endpoint, accepts JSON body: { diff: string }\n     - Validate that diff is non-empty, return 400 if missing\n     - Call Anthropic API with claude-sonnet-4-20250514\n     - System prompt: \"You are a commit message generator.\n       Given a git diff, produce a single conventional commit\n       message. Format: type(scope): description. Types:\n       feat, fix, refactor, docs, test, chore. Keep under\n       72 chars. No explanation, just the message.\"\n     - Return JSON: { message: string }\n     - Handle API errors, return 500 with { error: string }\n     - Use ANTHROPIC_API_KEY from process.env",
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi prompter l\'agent pour implémenter un composant à la fois au lieu de toute l\'app d\'un coup ?',
      options: [
        'Claude Code a une limite de taille de fichier et ne peut pas écrire de gros fichiers',
        'Des sorties plus petites sont plus faciles à réviser, attrapent les erreurs tôt et permettent de corriger le cap avant qu\'elles ne s\'accumulent',
        'Les commits conventionnels exigent une fonctionnalité par commit',
        'Les déploiements Vercel échouent si trop de fichiers changent d\'un coup',
      ],
      correctIndex: 1,
      explanation: 'Le prompting incrémental te donne un point de révision après chaque pièce. Si la route API a un bug, tu le détectes avant que le frontend soit construit par-dessus. Les grosses sorties tout-en-un cachent les erreurs au fond du code où tu pourrais ne pas les remarquer avant que le déploiement échoue.',
    },
    {
      type: 'code-demo',
      title: 'Prompt : implémenter le frontend',
      body: 'Après avoir révisé la route API, prompte pour l\'UI. Sois spécifique sur la gestion d\'état, la gestion des erreurs et l\'interaction copier-dans-le-presse-papier.',
      language: 'text',
      filename: 'prompt-frontend.txt',
      code: "You: Now implement the frontend components.\n\n     DiffInput.tsx:\n     - Textarea with monospace font, min-height 200px\n     - Placeholder: \"Paste your git diff here...\"\n     - \"Generate\" button below, disabled when textarea is empty\n     - Pass diff text up via onChange prop\n\n     CommitOutput.tsx:\n     - Readonly textarea showing the generated message\n     - \"Copy to clipboard\" button using navigator.clipboard\n     - Show a brief \"Copied!\" confirmation that fades after 2s\n     - Hidden when no message has been generated yet\n\n     App.tsx:\n     - Wire both components together\n     - Manage state: diff, message, loading, error\n     - POST to /api/generate on submit\n     - Show loading spinner during fetch\n     - Display error inline if API returns non-200",
    },
    {
      type: 'order',
      instruction: 'Ordonne les prompts d\'implémentation du premier au dernier pour ce projet :',
      items: [
        'Connecter les composants ensemble dans App.tsx',
        'Implémenter la route API (api/generate.ts)',
        'Ajouter la gestion des erreurs et les états de chargement',
        'Construire le composant DiffInput',
        'Construire le composant CommitOutput',
      ],
      correctOrder: [1, 3, 4, 0, 2],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Implémentation dirigée — l\'agent a fait le gros du travail !',
    },

    // === PHASE 4: VERIFY ===
    {
      type: 'checklist',
      title: 'Réviser la sortie de l\'agent — vérifie chaque élément :',
      items: [
        'La route API valide les entrées vides et retourne 400',
        'ANTHROPIC_API_KEY est lu depuis env, pas codé en dur',
        'Le prompt système correspond exactement à la spec',
        'Le frontend affiche un état de chargement pendant le fetch',
        'Le bouton copier utilise navigator.clipboard.writeText()',
        'Les messages d\'erreur s\'affichent pour l\'utilisateur, pas juste console.log',
        'Aucun import inutilisé ni code mort',
        'TypeScript compile sans erreurs (lancer tsc --noEmit)',
      ],
    },
    {
      type: 'terminal',
      instruction: 'Lance le compilateur TypeScript pour vérifier les erreurs de type sans émettre de fichiers :',
      expectedCommand: 'npx tsc --noEmit',
      hint: 'Utilise npx tsc avec le flag --noEmit pour vérifier les types uniquement',
    },
    {
      type: 'multiple-choice',
      question: 'Tu remarques que l\'agent a codé en dur le modèle comme "claude-3-opus" au lieu de "claude-sonnet-4-20250514" de ta spec. Que devrais-tu faire ?',
      options: [
        'Déployer quand même — les deux modèles fonctionnent',
        'Supprimer le fichier et reprompter de zéro',
        'Dire à l\'agent : "Change the model to claude-sonnet-4-20250514 in api/generate.ts line 15"',
        'Modifier manuellement le fichier toi-même sans le dire à l\'agent',
      ],
      correctIndex: 2,
      explanation: 'La correction ciblée est le bon réflexe. Donne à l\'agent le fichier exact, la ligne et le changement. C\'est plus rapide que de reprompter de zéro, et contrairement aux modifications manuelles silencieuses, ça garde l\'agent au courant de la correction pour qu\'il ne répète pas l\'erreur dans les prochains tours.',
    },
    {
      type: 'code-input',
      instruction: 'Quelle commande git te montre le diff complet de tous les changements stagés pour vérifier ce que l\'agent a modifié ?',
      placeholder: 'git ___',
      answer: 'git diff --staged',
      hint: 'git diff avec un flag qui montre uniquement les changements stagés (ajoutés)',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Code révisé et vérifié — prêt à livrer !',
    },

    // === PHASE 5: DEPLOY ===
    {
      type: 'terminal',
      instruction: 'Initialise un repo git et fais le premier commit :',
      expectedCommand: 'git init && git add -A && git commit -m "feat: initial commit message generator"',
      hint: 'Chaîne git init, git add et git commit avec &&',
    },
    {
      type: 'code-demo',
      title: 'Déployer sur Vercel',
      body: 'Définis ta clé API comme variable d\'environnement (jamais dans git), puis déploie. Le répertoire api/ est automatiquement détecté comme fonctions serverless.',
      language: 'bash',
      filename: 'deploy.sh',
      code: "# First deploy — links project to Vercel\nvercel deploy\n\n# Set the API key for production environment\nvercel env add ANTHROPIC_API_KEY production\n# Paste your key when prompted\n\n# Deploy to production\nvercel deploy --prod\n\n# Verify it's live\ncurl -X POST https://your-app.vercel.app/api/generate \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"diff\": \"+ console.log(hello)\"}'",
    },
    {
      type: 'multiple-choice',
      question: 'Ton déploiement échoue avec "Error: ANTHROPIC_API_KEY is not defined." Que s\'est-il passé ?',
      options: [
        'Le build Vite ne peut pas accéder aux variables d\'environnement côté serveur',
        'Tu dois préfixer la clé avec VITE_ pour qu\'elle fonctionne',
        'La variable d\'env n\'a pas été ajoutée à Vercel, ou a été ajoutée au mauvais environnement (ex. : Development seulement, pas Production)',
        'Vercel ne supporte pas les variables d\'environnement dans les fonctions serverless',
      ],
      correctIndex: 2,
      explanation: 'Les variables d\'environnement Vercel sont scopées aux environnements : Production, Preview et Development. Si tu as ajouté la clé uniquement pour Development mais déployé en Production, la fonction ne peut pas y accéder. Vérifie toujours que la variable d\'env est définie pour le bon environnement.',
    },

    // === PHASE 6: DOCUMENT & SYNTHESIZE ===
    {
      type: 'code-demo',
      title: 'Documenter avec CLAUDE.md',
      body: 'Écris un CLAUDE.md pour que toi du futur (ou l\'agent) puissiez maintenir le projet. C\'est aussi une preuve de portfolio que tu as dirigé la construction intentionnellement — pas juste généré du code à l\'aveugle.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Commit Message Generator\n\n## Architecture\n- Frontend: Vite + React + TypeScript + Tailwind\n- API: Single Vercel serverless function (api/generate.ts)\n- LLM: Anthropic Claude (claude-sonnet-4-20250514)\n\n## Development\n```bash\nnpm run dev          # Start Vite dev server\nvercel dev           # Start with serverless functions locally\nnpx tsc --noEmit     # Type check\n```\n\n## Deployment\n- Hosted on Vercel, auto-deploys on push to main\n- ANTHROPIC_API_KEY set in Vercel environment variables\n- No database, no auth\n\n## Key Decisions\n- No streaming: simple request/response is sufficient for <100 token outputs\n- No rate limiting: personal tool, low traffic expected\n- Tailwind over CSS modules: faster iteration, single-page app",
    },
    {
      type: 'code-input',
      instruction: 'Quel fichier devrais-tu créer à la racine de ton projet pour que Claude Code comprenne automatiquement le contexte du projet ?',
      placeholder: 'Enter the filename',
      answer: 'CLAUDE.md',
      hint: 'Le fichier markdown que Claude Code lit pour le contexte du projet — nommé d\'après l\'IA elle-même',
    },
    {
      type: 'order',
      instruction: 'Ordonne les compétences du Tier 1 telles qu\'elles ont été appliquées dans ce capstone :',
      items: [
        'Gestion du contexte (garder les prompts focalisés)',
        'Spécification structurée (exigences claires)',
        'Développement itératif (implémenter par morceaux)',
        'Vérification (réviser la sortie de l\'agent de façon critique)',
        'Mémoire de projet (CLAUDE.md pour la continuité)',
        'Déploiement (livrer en production)',
      ],
      correctOrder: [1, 2, 0, 3, 4, 5],
    },
    {
      type: 'checklist',
      title: 'Complétion du capstone — confirme que tu as fait tout ça :',
      items: [
        'Document de spec écrit avec les 5 sections',
        'Projet scaffoldé avec une structure de fichiers claire',
        'Route API implémentée et vérifiée au niveau types',
        'Composants frontend connectés et fonctionnels',
        'Déployé sur une URL Vercel publique',
        'CLAUDE.md documente le projet',
        'Variable d\'environnement définie de façon sécurisée (pas dans git)',
        'L\'outil génère des messages de commit conventionnels valides',
        'Toute la construction dirigée via Claude Code',
      ],
    },
    {
      type: 'checkpoint',
      xp: 30,
      message: 'CAPSTONE TIER 1 TERMINÉ ! Tu as déployé un outil construit par agent en production. Bienvenue au niveau suivant.',
    },
  ],
}

export default content
