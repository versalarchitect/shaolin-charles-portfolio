import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-6',
  steps: [
    // === INTRODUCTION (garder le premier passif) ===
    {
      type: 'info',
      title: "Utiliser un agent IA pour vérifier le travail d'un autre",
      body: "L'Agent A construit une fonctionnalité. Tu pourrais la réviser toi-même. Mais il y a un meilleur coup : envoyer l'Agent B vérifier systématiquement la sortie de l'Agent A par rapport au cahier des charges. C'est pas une revue de code — c'est de la vérification structurée. L'Agent B a un contexte frais, aucun biais d'investissement, et peut attraper ce que l'Agent A a manqué parce qu'il n'était pas émotionnellement attaché à l'implémentation.",
    },
    // CONVERTI : info → multiple-choice (#1)
    {
      type: 'multiple-choice',
      question: 'Pourquoi un deuxième agent vérifie-t-il mieux que l\'agent constructeur ?',
      options: [
        'Le deuxième agent a plus de puissance de calcul disponible',
        "Le deuxième agent lit le code à froid sans présupposés ni contamination de contexte, évaluant purement par rapport au cahier des charges",
        'Le deuxième agent a été spécifiquement entraîné pour la revue de code',
        'Le deuxième agent peut exécuter le code alors que le premier ne peut pas',
      ],
      correctIndex: 1,
      explanation: "Quand tu construis quelque chose, tu développes des angles morts. Tu sais ce que tu voulais faire, alors tu vois l'intention plutôt que ce qui est vraiment là. Un deuxième agent lit le code à froid — sans présupposés, sans contamination de contexte. Il évalue purement par rapport au cahier des charges. C'est le même principe que la revue de code, mais automatisé et systématique.",
    },

    // === DIAGRAMME 1 (déjà interactif) ===
    {
      type: 'interactive-diagram',
      title: 'La boucle de vérification',
      body: "L'agent de construction produit une sortie. L'agent de vérification l'évalue par rapport au cahier des charges. Il retourne un verdict structuré : réussite, échec avec raisons, ou réussite partielle avec les écarts précis. Tu prends la décision finale.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Cahier des charges', sublabel: 'Exigences', shape: 'rounded' },
          { id: 'build', label: 'Agent constructeur', sublabel: 'Crée le code', shape: 'rect' },
          { id: 'output', label: 'Sortie', sublabel: 'Branche/PR', shape: 'rect' },
          { id: 'verify', label: 'Agent vérificateur', sublabel: 'Vérifie le cahier', shape: 'rect', highlight: true },
          { id: 'verdict', label: 'Verdict', sublabel: 'Réussite/Échec', shape: 'diamond' },
          { id: 'human', label: 'Toi', sublabel: 'Décision finale', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'build', label: 'implémente' },
          { from: 'build', to: 'output' },
          { from: 'spec', to: 'verify', label: 'vérifie contre' },
          { from: 'output', to: 'verify', label: 'évalue' },
          { from: 'verify', to: 'verdict' },
          { from: 'verdict', to: 'human' },
        ],
      },
      stages: [
        { highlightNodes: ['spec', 'build'], highlightEdges: [{ from: 'spec', to: 'build' }], explanation: "L'agent constructeur reçoit le cahier des charges et implémente la fonctionnalité. Il produit du code basé sur les exigences." },
        { highlightNodes: ['build', 'output'], highlightEdges: [{ from: 'build', to: 'output' }], explanation: "Le constructeur génère une sortie — une branche ou PR contenant l'implémentation." },
        { highlightNodes: ['spec', 'output', 'verify'], highlightEdges: [{ from: 'spec', to: 'verify' }, { from: 'output', to: 'verify' }], explanation: "L'agent vérificateur reçoit le cahier des charges ET la sortie. Il vérifie la sortie contre chaque exigence — aucun contexte partagé avec le constructeur." },
        { highlightNodes: ['verify', 'verdict'], highlightEdges: [{ from: 'verify', to: 'verdict' }], explanation: "Le vérificateur retourne un verdict structuré : RÉUSSITE, ÉCHEC (avec raisons), ou PARTIEL (avec les écarts précis). Aucune ambiguïté." },
        { highlightNodes: ['verdict', 'human'], highlightEdges: [{ from: 'verdict', to: 'human' }], explanation: "Tu prends la décision finale basée sur le verdict. Corrige les petits problèmes toi-même, envoie des corrections au constructeur, ou re-spécifie si le constructeur a fondamentalement mal compris." },
      ],
    },
    { type: 'checkpoint', xp: 3, message: 'Tu vois la boucle de vérification : construire, vérifier, décider.' },

    // === PROMPT LAB (déjà interactif) ===
    {
      type: 'prompt-lab',
      instruction: "Écris un prompt de vérification qui demande à un agent vérificateur de contrôler l'implémentation d'authentification de l'agent constructeur.",
      scenario: "Un agent constructeur vient d'implémenter login/signup avec Supabase Auth. Tu as besoin d'un second agent pour vérifier : politiques RLS correctes, aucune clé de service exposée, gestion de session correcte, et états d'erreur.",
      starterPrompt: 'Check the auth code.',
      responses: [
        { triggerKeywords: ['rls', 'service', 'key', 'session'], response: "Verification report for auth implementation:\n\n✅ RLS enabled on all user-facing tables\n✅ Service role key only used in server actions\n⚠️ Session refresh not implemented — tokens will expire\n❌ Missing error handling on signup — no duplicate email check\n\n2 issues found, 1 critical.", quality: 'excellent', feedback: "Ton prompt a spécifié les domaines de vérification exacts : politiques RLS, exposition de clés, gestion de session, et états d'erreur. L'agent vérificateur savait exactement quoi vérifier." },
        { triggerKeywords: ['auth', 'check', 'security'], response: "I reviewed the auth code. It looks good overall. The login flow works and users can sign up. I'd suggest adding some tests.\n\nVerdict: Approved.", quality: 'poor', feedback: "Sans critères de vérification spécifiques, le vérificateur a juste survolé et approuvé. Spécifie exactement quoi vérifier : politiques RLS, patterns d'exposition de clés, cycle de vie des sessions, et gestion d'erreurs." },
      ],
      fallbackResponse: { response: 'What specifically should I check? The auth system has many components.', feedback: "Ton prompt était trop vague. Un bon prompt de vérification spécifie : (1) quels fichiers vérifier, (2) quelles propriétés de sécurité contrôler, (3) quels patterns chercher, et (4) ce qui constitue une réussite vs un échec." },
    },

    // CONVERTI : info → compare (#2)
    {
      type: 'compare',
      title: 'Vérification vs Revue de code',
      body: "Ce sont deux activités différentes avec des objectifs différents. Comprendre la distinction est critique pour écrire des prompts de vérification efficaces.",
      question: 'Lequel vérifie la conformité par rapport au cahier des charges ?',
      correctSide: 'right',
      left: {
        label: 'Revue de code',
        content: "Demande : Est-ce du bon code ?\n\nVérifie :\n- Style et conventions (var vs const)\n- Structure des composants (trop de props ?)\n- Patterns de performance\n- Lisibilité et maintenabilité\n- Conventions de nommage\n\nRésultat :\n- Suggestions d'amélioration\n- Remarques de style et bonnes pratiques\n- Jugements de qualité subjectifs",
      },
      right: {
        label: 'Vérification',
        content: "Demande : Est-ce que ça respecte le cahier des charges ?\n\nVérifie :\n- Chaque exigence a une implémentation\n- Les types correspondent aux contrats convenus\n- Les cas limites du cahier sont gérés\n- Les points d'intégration fonctionnent\n\nRésultat :\n- RÉUSSITE / ÉCHEC par exigence\n- Rapport de conformité objectif\n- Écarts actionnables à corriger",
      },
      explanation: "Une fonction peut avoir un code magnifique mais rater une exigence. Ou du code laid qui satisfait parfaitement chaque contrainte. La vérification évalue la complétude et l'exactitude par rapport à un standard défini — pas le style, pas l'élégance, pas l'astuce.",
    },
    { type: 'multiple-choice', question: 'Lequel est une préoccupation de vérification vs une préoccupation de revue de code ?', options: ['La fonction utilise var au lieu de const (revue de code)', "L'endpoint de login ne retourne pas un JWT comme spécifié (vérification)", 'Le composant a trop de props (revue de code)', 'A et C sont de la revue de code ; B est de la vérification'], correctIndex: 3, explanation: "La vérification contrôle par rapport au cahier des charges : est-ce que le login retourne un JWT ? C'est une exigence réussite/échec. Les questions de style (var vs const, nombre de props) relèvent de la revue de code — c'est important, mais c'est distinct de la conformité au cahier des charges." },

    // CONVERTI : info → multiple-choice (#3)
    {
      type: 'multiple-choice',
      question: "De quelles entrées l'agent vérificateur a-t-il besoin ?",
      options: [
        "L'historique de conversation de l'agent constructeur et la sortie",
        "Seulement la sortie (branche/PR) — il peut deviner le reste",
        "Le cahier des charges (ce qui devait être construit) et la sortie (ce qui a été réellement construit) — PAS la conversation de construction",
        "Une description de l'architecture du codebase et une liste de bugs courants",
      ],
      correctIndex: 2,
      explanation: "L'agent vérificateur a besoin d'exactement deux entrées : le cahier des charges et la sortie. Il n'a PAS besoin de l'historique de conversation de l'agent constructeur — ça contaminerait sa perspective fraîche. Donne-lui la branche, donne-lui le cahier des charges, demande-lui de vérifier.",
    },
    // CONVERTI : code-demo → code-fill (#4)
    {
      type: 'code-fill',
      instruction: 'Complète ce modèle de prompt de vérification qui force une vérification systématique :',
      language: 'markdown',
      filename: 'VERIFY-PROMPT.md',
      template: "# Verification Task\n\n## Your Role\nYou are a {{role}} agent. Your job is to systematically check\nwhether the implementation meets every requirement in the spec.\nYou have NO knowledge of how or why it was built this way.\nEvaluate only what exists against what was required.\n\n## The Spec (what should exist)\n[paste the original task spec here]\n\n## The Output (what to verify)\nBranch: feat/auth\nFiles to check: src/auth/*\n\n## Verification Checklist\nFor each requirement in the spec, report:\n- {{passLabel}}: requirement fully met\n- {{failLabel}}: requirement not met (explain what's missing)\n- PARTIAL: partially met (explain the gap)\n\n## Output Format\nReturn a structured {{outputType}} with pass/fail per requirement.",
      blanks: [
        { id: 'role', answer: 'verification', alternatives: ['verifier', 'verify'], placeholder: "rôle de l'agent ?", hint: 'Cet agent vérifie, il ne construit pas' },
        { id: 'passLabel', answer: 'PASS', placeholder: 'label de réussite ?', hint: 'Le label quand une exigence est pleinement satisfaite' },
        { id: 'failLabel', answer: 'FAIL', placeholder: "label d'échec ?", hint: "Le label quand une exigence n'est pas satisfaite" },
        { id: 'outputType', answer: 'verdict', alternatives: ['report'], placeholder: 'type de sortie ?', hint: 'Un jugement ou une décision structurée' },
      ],
      explanation: "Le prompt est structuré pour forcer une vérification systématique plutôt qu'un balayage impressionniste. Chaque exigence obtient un rating PASS/FAIL/PARTIAL explicite. Aucune ambiguïté sur ce qui fonctionne et ce qui ne fonctionne pas.",
    },
    { type: 'checkpoint', xp: 5, message: 'Tu sais configurer un agent de vérification avec les bonnes entrées.' },

    // CONVERTI : info → multiple-choice (#5)
    {
      type: 'multiple-choice',
      question: 'Un fichier compile sans erreurs. Est-ce que ça veut dire qu\'il passe la vérification ?',
      options: [
        'Oui — la compilation prouve que le code est correct',
        "Non — la compilation est la barre la plus basse ; la vérification contrôle les exigences fonctionnelles, les cas limites, les contraintes architecturales et la préparation à l'intégration",
        'Oui — si TypeScript est content, le cahier des charges est satisfait',
        "Ça dépend s'il y a des tests",
      ],
      correctIndex: 1,
      explanation: "La compilation est la barre la plus basse. Un fichier peut compiler et être complètement faux. La vérification va plus loin : est-ce que ça répond aux exigences fonctionnelles ? Est-ce que ça gère les cas limites ? Est-ce que ça respecte les contraintes architecturales du CLAUDE.md ? Est-ce que ça s'intègre proprement avec le reste du système ?",
    },
    // CONVERTI : code-demo → code-fill (#6)
    {
      type: 'code-fill',
      instruction: 'Complète ces critères de vérification structurés ordonnés par gravité :',
      language: 'markdown',
      filename: 'verification-criteria.md',
      template: "# Verification Criteria (ordered by severity)\n\n## 1. {{topCriteria}}\n- Every requirement in the spec has a corresponding implementation\n- No spec item is missing or only partially implemented\n- Edge cases mentioned in the spec are handled\n\n## 2. Contract Compliance\n- Types match src/types/{{contractFile}} exactly\n- API responses use the correct wrapper format\n- Function signatures match agreed interfaces\n\n## 3. {{archCriteria}} (CLAUDE.md)\n- Uses specified libraries (not alternatives)\n- Follows file naming conventions\n- No forbidden patterns (any, barrel files, etc.)\n\n## 4. Integration Readiness\n- Exports are named correctly for {{consumers}}\n- No implicit dependencies on unbuilt features\n\n## 5. {{testCriteria}}\n- Tests exist for each public function/endpoint\n- Tests cover both happy path and error cases",
      blanks: [
        { id: 'topCriteria', answer: 'Functional Completeness', alternatives: ['Functional completeness'], placeholder: 'le plus critique ?', hint: "Est-ce que l'implémentation couvre toutes les exigences du cahier ?" },
        { id: 'contractFile', answer: 'contracts.ts', alternatives: ['contracts'], placeholder: 'fichier de types partagé ?', hint: 'Le fichier où les contrats de types partagés sont définis' },
        { id: 'archCriteria', answer: 'Architectural Compliance', alternatives: ['Architectural compliance', 'Architecture Compliance'], placeholder: "contrôle d'architecture ?", hint: 'Vérification contre les règles architecturales du projet' },
        { id: 'consumers', answer: 'consumers', alternatives: ['importers', 'other agents'], placeholder: 'qui utilise les exports ?', hint: "Les autres modules qui vont importer depuis ce code" },
        { id: 'testCriteria', answer: 'Testability', alternatives: ['Test Coverage', 'Testing'], placeholder: 'catégorie tests ?', hint: 'Si le code a des tests appropriés' },
      ],
      explanation: "Les critères de vérification sont ordonnés par gravité : complétude fonctionnelle d'abord (est-ce que ça fait ce que le cahier dit ?), puis conformité des contrats, règles architecturales, préparation à l'intégration, et enfin testabilité.",
    },
    { type: 'order', instruction: 'Classe les critères de vérification du PLUS critique (haut) au MOINS critique :', items: ['Complétude fonctionnelle (tous les items du cahier des charges implémentés)', 'Conformité des contrats (les types correspondent aux interfaces convenues)', 'Le style de code suit les conventions du projet', "Préparation à l'intégration (les exports fonctionnent pour les consommateurs)"], correctOrder: [0, 1, 3, 2] },

    // CONVERTI : info → multiple-choice (#7)
    {
      type: 'multiple-choice',
      question: "Quel est le rôle le PLUS précieux de l'agent vérificateur dans le travail de flotte ?",
      options: [
        'Vérifier le style de code et la cohérence du formatage',
        "Lancer les tests automatisés que le constructeur a oubliés",
        "Détecter les décalages d'intégration entre les sorties d'agents parallèles qui n'apparaissent que quand on les combine",
        "S'assurer que tous les commentaires sont en anglais",
      ],
      correctIndex: 2,
      explanation: "Le rôle le plus précieux de l'agent vérificateur : détecter les problèmes qui n'apparaissent que quand tu combines les sorties de plusieurs agents. L'Agent A exporte une fonction. L'Agent B l'importe avec des paramètres attendus différents. Aucun agent n'a tort individuellement — le décalage n'apparaît qu'à l'intégration. L'agent vérificateur contrôle ces coutures.",
    },
    // CONVERTI : code-demo → code-fill (#8)
    {
      type: 'code-fill',
      instruction: "Complète ce prompt de vérification d'intégration qui contrôle les coutures entre les sorties des agents :",
      language: 'markdown',
      filename: 'VERIFY-INTEGRATION.md',
      template: "# Integration Verification\n\n## Check These Seams\n\n### Auth -> API ({{seamType1}})\n- src/api/routes/tasks.ts imports from src/auth/{{middlewareFile}}\n- Verify: does the import path exist? Does the middleware\n  export match what the API expects?\n\n### API -> UI ({{seamType2}})\n- src/components/task-list.tsx consumes GET /tasks response\n- Verify: does the component's type annotation match the\n  actual API response shape?\n\n## For Each Seam, Report:\n- Exporter: what's actually exported (function signature, type)\n- Consumer: what's expected by the {{importerRole}}\n- Match: {{yesLabel}} (compatible) or NO (explain the mismatch)",
      blanks: [
        { id: 'seamType1', answer: 'middleware import', alternatives: ['middleware'], placeholder: 'que traverse cette frontière ?', hint: "Le composant auth que l'API doit importer" },
        { id: 'middlewareFile', answer: 'middleware.ts', alternatives: ['middleware'], placeholder: 'fichier auth ?', hint: 'Le fichier contenant le middleware de vérification JWT' },
        { id: 'seamType2', answer: 'response shapes', alternatives: ['response types', 'data shapes'], placeholder: 'que faut-il faire correspondre ?', hint: "Les formes de données circulant de l'API vers l'UI" },
        { id: 'importerRole', answer: 'importer', alternatives: ['consumer'], placeholder: 'qui importe ?', hint: "Le module qui récupère l'export" },
        { id: 'yesLabel', answer: 'YES', placeholder: 'label compatible ?', hint: "Le label affirmatif pour une couture correspondante" },
      ],
      explanation: "La vérification d'intégration contrôle les coutures — les endroits où la sortie d'un agent se connecte à celle de l'autre. Pour chaque couture, compare ce qui est exporté vs ce qui est attendu. Les décalages détectés ici préviennent les erreurs runtime après fusion.",
    },
    { type: 'multiple-choice', question: "L'Agent A exporte `getUser(id: string): Promise<User>`. L'Agent B appelle `getUser(id: string, includeProfile: boolean)`. L'agent vérificateur devrait :", options: ["Signaler l'Agent B comme fautif — ça ne correspond pas à l'export", "Signaler l'Agent A comme fautif — il manque le paramètre", "Signaler un décalage de contrat — le cahier des charges doit clarifier l'interface", 'Ignorer — TypeScript va le détecter à la compilation'], correctIndex: 2, explanation: "Aucun agent n'a individuellement tort — chacun a interprété l'exigence différemment. C'est un trou dans le contrat. L'agent vérificateur le signale pour que toi (l'orchestrateur) puisses décider : ajouter le paramètre au contrat, ou retirer l'hypothèse de l'Agent B. TypeScript VA le détecter, mais l'agent vérificateur le détecte plus tôt et avec le contexte du pourquoi." },
    { type: 'checkpoint', xp: 5, message: "Tu sais vérifier les coutures d'intégration entre les sorties d'agents parallèles." },

    // CONVERTI : info → compare (#9)
    {
      type: 'compare',
      title: 'Répondre aux échecs de vérification',
      body: 'Quand la vérification trouve des problèmes, ta réponse dépend de la gravité. Voici deux scénarios du même rapport de vérification.',
      question: 'Quelle réponse est appropriée pour quel niveau de gravité ?',
      correctSide: 'left',
      left: {
        label: 'Échecs mineurs (correction rapide)',
        content: "Rapport de vérification :\n- [FAIL] Payload JWT manque le champ 'role'\n- [PARTIAL] Schéma signup manque la validation email\n\nRéponse : Corrige-le toi-même (2 minutes)\n- Ajoute 'role' à l'objet payload JWT\n- Ajoute .email() au schéma Zod de signup\n- Pas besoin de relancer l'agent constructeur\n\nQuand utiliser :\n- Un champ ou une validation manquante\n- Mauvaise annotation de type\n- Export oublié",
      },
      right: {
        label: 'Échecs majeurs (relance nécessaire)',
        content: "Rapport de vérification :\n- [FAIL] Utilisé Firebase Auth au lieu de Supabase Auth\n- [FAIL] Pas de politiques RLS — toutes les données lisibles publiquement\n- [FAIL] Mots de passe stockés en clair\n\nRéponse : Relancer avec un cahier plus clair\n- Le constructeur a fondamentalement mal compris la tâche\n- Échecs en cascade multiples\n- Corriger individuellement prendrait plus de temps qu'une relance\n\nQuand utiliser :\n- Mauvaise technologie/approche choisie\n- Violations de sécurité\n- Incompréhension fondamentale des exigences",
      },
      explanation: "La plupart des échecs de vérification sont mineurs — un champ manquant, un mauvais type. Corrige-les toi-même en quelques minutes. Les échecs majeurs (mauvaise approche, problèmes de sécurité, incompréhension fondamentale) justifient une relance avec un cahier plus clair. L'agent vérificateur te donne les données pour faire ce jugement.",
    },
    // CONVERTI : code-demo → code-fill (#10)
    {
      type: 'code-fill',
      instruction: 'Complète ce vrai rapport de vérification. Remplis le verdict pour chaque item selon la description :',
      language: 'markdown',
      filename: 'verification-report.md',
      template: "# Verification Report: Auth Agent Output\n\n## Functional Completeness\n- [{{v1}}] Login returns JWT on valid credentials\n- [PASS] Signup creates user and returns JWT\n- [{{v2}}] Middleware rejects expired tokens — no expiry check found\n- [{{v3}}] Zod schemas — login schema exists, signup missing email format\n\n## Contract Compliance\n- [PASS] User type matches contracts.ts\n- [PASS] ApiResponse wrapper used correctly\n- [{{v4}}] JWT payload missing 'role' field (spec requires userId, email, role)\n\n## Summary\n4 PASS | 3 {{failWord}} | 1 PARTIAL",
      blanks: [
        { id: 'v1', answer: 'PASS', placeholder: 'verdict ?', hint: 'Le login fonctionne correctement selon le cahier' },
        { id: 'v2', answer: 'FAIL', placeholder: 'verdict ?', hint: "Pas de vérification d'expiration signifie que cette exigence N'EST PAS satisfaite" },
        { id: 'v3', answer: 'PARTIAL', placeholder: 'verdict ?', hint: "Le schéma login existe mais le signup manque de validation — partiellement satisfait" },
        { id: 'v4', answer: 'FAIL', placeholder: 'verdict ?', hint: 'Un champ requis manque dans le payload JWT' },
        { id: 'failWord', answer: 'FAIL', placeholder: "label d'échec ?", hint: 'Le mot utilisé pour les exigences non satisfaites' },
      ],
      explanation: "Un rapport de vérification structuré élimine l'ambiguïté. Chaque exigence obtient un verdict clair PASS, FAIL, ou PARTIAL. Le résumé donne une vue d'ensemble : 4 réussite, 3 échec, 1 partiel. Tu peux immédiatement voir ce qui doit être corrigé.",
    },

    // CONVERTI : diagram → interactive-diagram (#11)
    {
      type: 'interactive-diagram',
      title: 'Vérification croisée dans une flotte',
      body: "Dans une flotte de 4 agents, tu peux utiliser un seul agent de vérification dédié qui contrôle toutes les sorties séquentiellement. Ou tu peux faire de la vérification croisée.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'b1', label: 'Build 1', sublabel: 'Auth', shape: 'rect' },
          { id: 'b2', label: 'Build 2', sublabel: 'API', shape: 'rect' },
          { id: 'b3', label: 'Build 3', sublabel: 'UI', shape: 'rect' },
          { id: 'v', label: 'Agent vérificateur', sublabel: 'Vérifie tout', shape: 'rect', highlight: true },
          { id: 'report', label: 'Rapport', sublabel: 'Réussite/Échec par agent', shape: 'rounded' },
          { id: 'you', label: 'Toi', sublabel: 'Agit sur le rapport', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'b1', to: 'v', label: 'sortie 1' },
          { from: 'b2', to: 'v', label: 'sortie 2' },
          { from: 'b3', to: 'v', label: 'sortie 3' },
          { from: 'v', to: 'report' },
          { from: 'report', to: 'you' },
        ],
      },
      stages: [
        { highlightNodes: ['b1', 'b2', 'b3'], explanation: "Trois agents constructeurs terminent leur travail en parallèle. Chacun produit une sortie sur sa propre branche." },
        { highlightNodes: ['b1', 'b2', 'b3', 'v'], highlightEdges: [{ from: 'b1', to: 'v' }, { from: 'b2', to: 'v' }, { from: 'b3', to: 'v' }], explanation: "Un agent vérificateur dédié reçoit TOUTES les sorties plus les cahiers des charges. Il vérifie le travail de chaque agent séquentiellement." },
        { highlightNodes: ['v', 'report'], highlightEdges: [{ from: 'v', to: 'report' }], explanation: "L'agent vérificateur produit un rapport consolidé avec RÉUSSITE/ÉCHEC par agent et par exigence." },
        { highlightNodes: ['report', 'you'], highlightEdges: [{ from: 'report', to: 'you' }], explanation: "Tu agis sur le rapport : corrige les problèmes mineurs toi-même, envoie des corrections pour les problèmes moyens, ou re-spécifie pour les incompréhensions fondamentales." },
      ],
    },

    { type: 'terminal', instruction: "Vérifie ce que l'agent d'authentification a réellement produit (lister les fichiers) :", expectedCommand: 'find src/auth -type f -name "*.ts" | sort', hint: 'Utilise find pour lister tous les fichiers TypeScript dans le répertoire auth' },
    { type: 'code-input', instruction: "Écris le premier critère de vérification. Il doit vérifier si l'endpoint de login retourne ce que le cahier des charges exige :", placeholder: '- [?] Login endpoint returns ...', answer: '- [ ] Login endpoint returns ApiResponse<{ token: string }> on valid credentials', hint: "Vérifie l'exigence fonctionnelle : est-ce que le login retourne la bonne forme de réponse ?" },
    { type: 'multiple-choice', question: "Tu reçois le rapport de vérification. 2 items sont ÉCHEC, 8 sont RÉUSSITE. Que fais-tu ?", options: ["Rejeter toute la sortie et relancer l'agent constructeur", "Corriger les 2 échecs toi-même — c'est probablement petit", "Envoyer les 2 échecs spécifiques à l'agent constructeur pour correction, puis re-vérifier", "N'importe laquelle de ces options selon la gravité des échecs"], correctIndex: 3, explanation: "Le contexte compte. Si les échecs sont mineurs (un champ manquant, un oubli d'export), corrige-les toi-même ou envoie des corrections ciblées. S'ils sont fondamentaux (mauvaise approche, mauvaise compréhension du domaine), relance avec un cahier des charges plus clair. Y'a pas de réponse universelle." },
    { type: 'checklist', title: 'Liste de vérification inter-agents', items: ["L'agent vérificateur reçoit le cahier des charges + la sortie, PAS la conversation de construction", "La vérification contrôle d'abord la complétude fonctionnelle", 'La conformité des contrats est vérifiée contre les types partagés', 'Les règles architecturales du CLAUDE.md sont vérifiées', "Les coutures d'intégration sont contrôlées entre les sorties des agents", 'Verdict structuré avec RÉUSSITE/ÉCHEC par exigence', "L'humain prend la décision finale de fusion/rejet basée sur le rapport"] },
    { type: 'checkpoint', xp: 7, message: "Vérification maîtrisée ! Tu as maintenant de l'IA qui vérifie de l'IA. Fais confiance, mais vérifie." },
  ],
}

export default content
