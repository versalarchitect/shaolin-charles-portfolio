import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Quand reconstruire vs améliorer le code existant',
      body: "Avant les flottes d'agents, les réécritures étaient terrifiantes. Des mois de travail. Des systèmes parallèles qui tournent en même temps. Un gel de fonctionnalités sur l'ancien système pendant que le nouveau rattrape. Cette peur était justifiée — les heures-humains rendaient les réécritures coûteuses. Avec les flottes d'agents, une réécriture qui prenait 6 mois à une équipe peut prendre 2 semaines à 5 agents. L'économie a changé radicalement. Mais la DÉCISION de quand réécrire versus refactoriser ? Ça demande toujours du jugement humain. Des réécritures bon marché ne veulent pas dire que chaque réécriture est la bonne.",
    },
    {
      type: 'info',
      title: 'La séduction des réécritures bon marché',
      body: "Quand les réécritures sont peu coûteuses, la tentation est de tout réécrire. Module d'auth legacy avec des callbacks ? Réécrire. Gestion d'état emmêlée ? Réécrire. Couche API qui a poussé de manière organique ? Réécrire. Mais les réécritures comportent des coûts cachés qui ne se mesurent pas en heures-agents : la connaissance institutionnelle enfouie dans les commentaires du code, les cas limites subtils que l'ancien code gère mais que personne n'a documentés, et la charge de tests d'intégration quand on remplace un composant dont tout dépend. Bon marché à CONSTRUIRE ne veut pas dire bon marché à DÉPLOYER.",
    },

    // === THE DECISION FRAMEWORK ===
    {
      type: 'interactive-diagram',
      title: 'Cadre de décision : Refactoriser vs Réécrire',
      body: 'Clique sur chaque critère d\'évaluation pour comprendre comment il influence la décision.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'assess', label: 'Évaluer le composant', sublabel: 'Recueillir les métriques', shape: 'rounded', highlight: true },
          { id: 'coupling', label: 'Score de couplage', sublabel: 'À quel point c\'est emmêlé ?', shape: 'rect' },
          { id: 'coverage', label: 'Couverture de tests', sublabel: 'Un filet de sécurité existe ?', shape: 'rect' },
          { id: 'debt', label: 'Sévérité de la dette', sublabel: 'Structurelle ou cosmétique ?', shape: 'rect' },
          { id: 'buildability', label: 'Constructibilité par agents', sublabel: 'Les agents peuvent reconstruire proprement ?', shape: 'rect' },
          { id: 'decision', label: 'Décision', sublabel: 'Refactoriser ou Réécrire ?', shape: 'diamond', highlight: true },
          { id: 'refactor', label: 'Voie Refactorisation', sublabel: 'Amélioration incrémentale', shape: 'pill' },
          { id: 'rewrite', label: 'Voie Réécriture', sublabel: 'Remplacement propre', shape: 'pill' },
        ],
        edges: [
          { from: 'assess', to: 'coupling' },
          { from: 'assess', to: 'coverage' },
          { from: 'assess', to: 'debt' },
          { from: 'assess', to: 'buildability' },
          { from: 'coupling', to: 'decision' },
          { from: 'coverage', to: 'decision' },
          { from: 'debt', to: 'decision' },
          { from: 'buildability', to: 'decision' },
          { from: 'decision', to: 'refactor', label: 'couplage faible, couverture élevée' },
          { from: 'decision', to: 'rewrite', label: 'couplage élevé, couverture faible', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['assess'],
          highlightEdges: [],
          explanation: 'Commence par recueillir les métriques du composant à évaluer. Tu as besoin de données objectives avant de prendre la décision refactoriser-vs-réécrire.',
        },
        {
          highlightNodes: ['assess', 'coupling'],
          highlightEdges: [{ from: 'assess', to: 'coupling' }],
          explanation: 'Score de couplage : combien d\'autres composants dépendent de celui-ci ? Un couplage élevé (10+ dépendants) favorise la refactorisation parce qu\'une réécriture exige de mettre à jour chaque point de contact simultanément.',
        },
        {
          highlightNodes: ['assess', 'coverage'],
          highlightEdges: [{ from: 'assess', to: 'coverage' }],
          explanation: 'Couverture de tests : une couverture élevée (80%+) favorise la refactorisation parce que les tests attrapent les régressions immédiatement. Une faible couverture favorise la réécriture avec des tests dès le départ.',
        },
        {
          highlightNodes: ['assess', 'debt'],
          highlightEdges: [{ from: 'assess', to: 'debt' }],
          explanation: 'Sévérité de la dette : la dette cosmétique (nommage, style callback) est refactorisable. La dette structurelle (dépendances circulaires, god objects) nécessite souvent une réécriture parce que le design lui-même est le problème.',
        },
        {
          highlightNodes: ['assess', 'buildability'],
          highlightEdges: [{ from: 'assess', to: 'buildability' }],
          explanation: 'Constructibilité par agents : un agent peut-il reconstruire à partir d\'une spec ? Si la connaissance est UNIQUEMENT dans le code (cas limites non documentés), réécrire signifie la perdre. Ça favorise la refactorisation.',
        },
        {
          highlightNodes: ['coupling', 'coverage', 'debt', 'buildability', 'decision'],
          highlightEdges: [{ from: 'coupling', to: 'decision' }, { from: 'coverage', to: 'decision' }, { from: 'debt', to: 'decision' }, { from: 'buildability', to: 'decision' }],
          explanation: 'Les quatre facteurs alimentent la décision. Aucun facteur seul n\'est décisif. Couplage faible + couverture faible + dette structurelle + haute constructibilité = réécriture. Couplage élevé + couverture élevée + dette cosmétique = refactorisation.',
        },
        {
          highlightNodes: ['decision', 'refactor', 'rewrite'],
          highlightEdges: [{ from: 'decision', to: 'refactor' }, { from: 'decision', to: 'rewrite' }],
          explanation: 'La décision se divise : refactoriser pour une amélioration incrémentale quand tu as un filet de sécurité, réécrire pour un remplacement propre quand la structure elle-même est cassée et le couplage est gérable.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Cadre de décision cartographié !',
    },

    // === THE METRICS ===
    {
      type: 'multiple-choice',
      question: 'Un module d\'auth est importé par 47 composants, référencé par le middleware et appelé par 3 services via HTTP. Cela favorise-t-il la refactorisation ou la réécriture ?',
      options: [
        'Réécriture — repartir de zéro avec une implémentation propre',
        'Refactorisation — un couplage élevé signifie qu\'une réécriture exige de mettre à jour 47 fichiers simultanément, ce qui est source d\'erreurs même avec des agents. Le patron strangler fig gère ça mieux.',
        'Aucun des deux — le laisser tranquille',
        'Réécriture avec une couche d\'adaptation',
      ],
      correctIndex: 1,
      explanation: "Facteur 1 : Score de couplage. Un couplage élevé favorise la refactorisation parce qu'une réécriture exige de mettre à jour chaque point de contact simultanément. Même avec des agents, coordonner 47 changements de fichiers est source d'erreurs. Le patron strangler fig gère bien mieux le couplage élevé.",
    },
    {
      type: 'multiple-choice',
      question: 'Un composant a 90 % de couverture de tests mais du code laid (callbacks, nommage incohérent). Un autre a 10 % de couverture mais une architecture propre. Lequel favorise la refactorisation vs la réécriture ?',
      options: [
        'Les deux devraient être refactorisés',
        'Le composant à 90 % de couverture favorise la refactorisation (les tests attrapent les régressions). Le composant à 10 % favorise la réécriture (pas de filet de sécurité pour les modifications).',
        'Les deux devraient être réécrits',
        'La couverture n\'a pas d\'importance pour cette décision',
      ],
      correctIndex: 1,
      explanation: "Facteur 2 : Couverture de tests. Une couverture élevée favorise la refactorisation — les tests attrapent les régressions immédiatement. Une faible couverture favorise la réécriture : si tu ne peux pas modifier le code en toute sécurité, écris la nouvelle version avec des tests dès le départ.",
    },
    {
      type: 'multiple-choice',
      question: 'Un module a des dépendances circulaires et des god objects (dette structurelle). Un autre a un nommage incohérent et du async en style callback (dette cosmétique). Lequel nécessite une réécriture ?',
      options: [
        'Les deux ont besoin de réécritures',
        'Le module à dette structurelle nécessite une réécriture (le design lui-même est le problème). Le module à dette cosmétique peut être refactorisé de façon incrémentale sans changer l\'architecture.',
        'Aucun n\'a besoin de réécriture — les deux peuvent être refactorisés',
        'Le cosmétique est pire parce qu\'il affecte la lisibilité',
      ],
      correctIndex: 1,
      explanation: "Facteur 3 : Sévérité de la dette. La dette cosmétique est refactorisable. La dette structurelle nécessite souvent une réécriture parce que la structure elle-même est le problème. Tu ne peux pas refactoriser une dépendance circulaire en un DAG propre sans fondamentalement repenser les relations entre modules.",
    },
    {
      type: 'multiple-choice',
      question: 'Un composant encode des années de gestion de cas limites appris en production, documentés nulle part sauf dans le code. Devrais-tu le réécrire ?',
      options: [
        'Oui — les agents peuvent tout reconstruire à partir d\'une spec',
        'Non — si la connaissance est UNIQUEMENT dans le code et ne peut pas être extraite dans une spec, réécrire signifie perdre cette connaissance. Refactorise plutôt : garder la connaissance, améliorer la structure autour.',
        'Oui, mais copie tous les commentaires d\'abord',
        'Oui, si tu as une couverture de tests élevée',
      ],
      correctIndex: 1,
      explanation: "Facteur 4 : Constructibilité par agents. Certains composants sont de la logique métier pure avec des entrées et sorties bien définies. D'autres encodent des années de gestion de cas limites documentés nulle part. Si la connaissance est UNIQUEMENT dans le code, réécrire signifie la perdre. La refactorisation garde la connaissance en améliorant la structure.",
    },
    {
      type: 'multiple-choice',
      question: 'Un module de traitement des paiements a : 12 dépendants, 92 % de couverture de tests, des callbacks au lieu de async/await, et des cas limites bien documentés dans les commentaires du code. Refactoriser ou réécrire ?',
      options: [
        'Réécrire — les callbacks sont dépassés et les agents peuvent facilement construire des versions async/await',
        'Refactoriser — couplage élevé + couverture élevée + cas limites documentés favorisent tous l\'amélioration incrémentale',
        'Réécrire les internals mais garder la même interface',
        'Aucun des deux — si ça marche, on n\'y touche pas',
      ],
      correctIndex: 1,
      explanation: 'Chaque facteur pointe vers la refactorisation. Le couplage élevé (12 dépendants) signifie qu\'une réécriture exige de coordonner 12 changements de fichiers. La couverture de tests élevée permet de refactoriser en toute sécurité. Les cas limites documentés signifient que le code contient des connaissances institutionnelles qui pourraient être perdues dans une réécriture. Le seul problème (callbacks) est cosmétique et facilement corrigeable de façon incrémentale.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Facteurs d\'évaluation maîtrisés !',
    },

    // === THE STRANGLER FIG PATTERN ===
    {
      type: 'multiple-choice',
      question: 'Le patron strangler fig construit le nouveau système autour de l\'ancien. Pourquoi est-il particulièrement puissant avec les flottes d\'agents ?',
      options: [
        'Les agents préfèrent le travail incrémental',
        'Assigne un agent par remplacement de composant — cinq agents peuvent étouffer cinq composants simultanément pendant que l\'ancien système reste en ligne. L\'ancien meurt gracieusement, pas violemment.',
        'Les agents ne peuvent pas faire de grandes réécritures',
        'Le patron a été conçu pour les systèmes IA',
      ],
      correctIndex: 1,
      explanation: "Le patron strangler fig a toujours été la voie de migration la plus sûre. Avec des agents, c'est aussi la plus rapide. Assigne un agent par remplacement de composant. Chaque agent construit la nouvelle version, ajoute une couche d'adaptation, et l'ancien composant se réduit à mesure que les consommateurs migrent.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cet adaptateur strangler fig. Remplis la fonction d\'adaptation qui enveloppe l\'implémentation async moderne dans l\'ancienne interface callback.',
      language: 'typescript',
      filename: 'packages/auth/src/adapter.ts',
      template: "// Old interface (callback-based, used by 12 consumers)\nexport interface LegacyAuth {\n  authenticate(token: string, cb: (err: Error | null, user?: User) => void): void\n}\n\n// New interface (async, clean)\nexport interface ModernAuth {\n  authenticate(token: string): Promise<User>\n}\n\n// Adapter: wraps new implementation in old interface\nexport function {{adapter_name}}(modern: ModernAuth): LegacyAuth {\n  return {\n    authenticate(token, cb) {\n      modern.authenticate(token)\n        .then(user => cb({{success_args}}))\n        .catch(err => cb({{error_args}}))\n    },\n  }\n}",
      blanks: [
        { id: 'adapter_name', answer: 'createLegacyAdapter', alternatives: ['createAdapter', 'legacyAdapter', 'wrapModern'], placeholder: 'nom de la fonction d\'adaptation ?', hint: 'Une fonction qui crée un wrapper compatible avec l\'ancien' },
        { id: 'success_args', answer: 'null, user', alternatives: ['null, user', 'null,user'], placeholder: 'args callback succès ?', hint: 'Convention callback Node.js : erreur d\'abord (null en cas de succès), puis résultat' },
        { id: 'error_args', answer: 'err', alternatives: ['err', 'error'], placeholder: 'args callback erreur ?', hint: 'Convention callback Node.js : passer l\'erreur comme premier argument' },
      ],
      explanation: 'L\'adaptateur permet aux anciens consommateurs de continuer à fonctionner pendant que les nouveaux consommateurs utilisent directement la version réécrite. Les consommateurs migrent à leur propre rythme.',
    },
    {
      type: 'multiple-choice',
      question: 'Le patron strangler fig est particulièrement puissant avec les flottes d\'agents parce que :',
      options: [
        'Les agents sont meilleurs pour écrire des adaptateurs que les humains',
        'Plusieurs agents peuvent remplacer plusieurs composants en parallèle pendant que le système reste en ligne — migration zéro temps d\'arrêt à haute vitesse',
        'Les agents préfèrent le travail incrémental aux grandes réécritures',
        'Le patron a été conçu pour les systèmes IA',
      ],
      correctIndex: 1,
      explanation: 'La combinaison strangler fig + flottes d\'agents est puissante parce que chaque remplacement de composant est une tâche indépendante. Cinq agents sur cinq composants signifie que la migration se fait en parallèle. L\'ancien système tourne tout au long. Pas de bascule big-bang, pas de gel de fonctionnalités, pas de coordination nécessaire entre l\'agent qui construit le nouveau auth et l\'agent qui construit la nouvelle facturation.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Strangler fig avec des agents — compris !',
    },

    // === STRANGLER FIG EN PRATIQUE ===
    {
      type: 'code-fill',
      instruction: 'Complète ce plan de migration strangler fig en remplissant les blancs pour chaque étape.',
      language: 'markdown',
      filename: 'docs/strangler-fig-plan.md',
      template: '# Plan de migration Strangler Fig\n\n## Étape 1 : Identifier la cible\n- Ancien module à envelopper : {{old_module}}\n- Raison : à base de callbacks, 12 dépendants, couplage élevé\n\n## Étape 2 : Construire le nouveau module\n- Chemin du nouveau module : {{new_module_path}}\n- Patron : async/await, interfaces typées, tests indépendants\n\n## Étape 3 : Faire le pont\n- Interface d\'adaptation : {{adapter_interface}}\n- But : laisser les anciens consommateurs fonctionner via l\'API legacy\n\n## Étape 4 : Filet de sécurité\n- Stratégie de retour arrière : {{rollback_strategy}}\n- Assure une bascule zéro risque pour chaque consommateur',
      blanks: [
        { id: 'old_module', answer: 'LegacyAuth', alternatives: ['legacy auth', 'auth module', 'old auth', 'le module auth'], placeholder: 'quel module ?', hint: 'Le module auth à base de callbacks référencé dans l\'exemple d\'adaptateur' },
        { id: 'new_module_path', answer: 'packages/auth/src/modern-auth.ts', alternatives: ['packages/auth/src/modern.ts', 'packages/auth/modern-auth.ts', 'src/modern-auth.ts', 'packages/auth/'], placeholder: 'chemin du fichier ?', hint: 'Où vit la nouvelle implémentation async ?' },
        { id: 'adapter_interface', answer: 'createLegacyAdapter', alternatives: ['legacy adapter', 'LegacyAdapter', 'adapter function', 'createAdapter', 'adaptateur legacy'], placeholder: 'nom de l\'adaptateur ?', hint: 'La fonction qui enveloppe ModernAuth dans l\'ancienne interface callback' },
        { id: 'rollback_strategy', answer: 'revert to old module by removing adapter', alternatives: ['switch back to legacy', 'disable adapter', 'route back to old', 'feature flag to old module', 'revert the import', 'revenir à l\'ancien module'], placeholder: 'comment revenir en arrière ?', hint: 'Que fais-tu si le nouveau module a des problèmes ?' },
      ],
      explanation: 'Un plan strangler fig rend chaque étape explicite : quel module envelopper, où vit le nouveau code, comment les anciens consommateurs font le pont vers le nouveau code, et comment revenir en arrière en toute sécurité. Ça élimine l\'ambiguïté pour tout agent ou développeur exécutant la migration.',
    },
    {
      type: 'match',
      instruction: 'Associe chaque indicateur de reconstruction à sa décision recommandée :',
      leftItems: ['Couverture de tests >80 %', 'Couverture de tests <20 %', 'Frontières de modules claires', 'État global partout'],
      rightItems: ['Sûr de refactoriser de façon incrémentale', 'Envisager une réécriture complète', 'Strangler fig viable', 'Réécriture probablement nécessaire'],
      correctPairs: { 0: 0, 1: 1, 2: 2, 3: 3 },
      explanation: 'Une couverture de tests élevée signifie que tu peux refactoriser en toute sécurité — les tests attrapent les régressions immédiatement. Une faible couverture signifie qu\'une réécriture avec des tests dès le départ peut être plus sûre. Des frontières claires rendent le patron strangler fig viable. L\'état global signifie que le design lui-même est cassé et que l\'amélioration incrémentale est quasi impossible.',
    },
    {
      type: 'code-diff',
      title: 'Avant et après l\'enveloppement strangler fig',
      body: 'Vois comment un module passe de l\'utilisation directe (couplage fort) à l\'utilisation via adaptateur (découplé et migrable).',
      language: 'typescript',
      filename: 'checkout-service.ts',
      before: "// AVANT : Utilisation directe — checkout est couplé aux internals d'auth\nimport { authenticate, authorize } from '../auth/legacy-auth'\n\nasync function processCheckout(token: string, cartId: string) {\n  // Appel direct — si auth change de signature, checkout casse\n  authenticate(token, (err, user) => {\n    if (err) throw err\n    authorize(user!, 'checkout', (err, allowed) => {\n      if (err) throw err\n      if (!allowed) throw new Error('Forbidden')\n      // ... procéder au checkout\n    })\n  })\n}",
      after: "// APRÈS : Patron adaptateur — checkout dépend de l'interface, pas de l'implémentation\nimport type { ModernAuth } from '@shop/auth'\n\nasync function processCheckout(\n  auth: ModernAuth,\n  token: string,\n  cartId: string\n) {\n  // Appel async propre — l'implémentation d'auth peut changer librement\n  const user = await auth.authenticate(token)\n  const allowed = await auth.authorize(user, 'checkout')\n  if (!allowed) throw new Error('Forbidden')\n  // ... procéder au checkout\n}",
      question: 'Quelle amélioration structurelle le patron adaptateur apporte-t-il ?',
      explanation: 'La version d\'avant importe directement des internals d\'auth — tout changement de signature dans auth casse checkout. La version d\'après dépend d\'une interface typée (ModernAuth). L\'implémentation réelle derrière cette interface peut être échangée (adaptateur legacy ou nouveau module) sans changer checkout du tout. C\'est le pouvoir fondamental du strangler fig : les consommateurs migrent à leur propre rythme.',
    },

    // === WHEN TO ACTUALLY REWRITE ===
    {
      type: 'multiple-choice',
      question: 'Les quatre conditions doivent être vraies pour justifier une réécriture : (1) mal testé, (2) logique métier bien comprise, (3) couplage faible, (4) dette structurelle. Un module a 92 % de couverture mais des callbacks laids. Devrais-tu réécrire ?',
      options: [
        'Oui — les callbacks sont dépassés',
        'Non — la condition 1 échoue (bien testé). La couverture élevée signifie que tu PEUX refactoriser en sécurité. Ne réécris que quand tu NE PEUX PAS refactoriser.',
        'Oui, si les agents peuvent le faire vite',
        'Ça dépend du couplage seul',
      ],
      correctIndex: 1,
      explanation: "Réécris quand toutes les conditions sont vraies : mal testé, logique bien comprise, couplage faible, et dette structurelle. Quand même une condition échoue — comme avoir une couverture élevée — la refactorisation est le meilleur chemin.",
    },
    {
      type: 'multiple-choice',
      question: 'Avant d\'approuver une réécriture, tu dois vérifier : peux-tu écrire une spec complète capturant chaque cas limite ? Tu trouves 15 cas limites documentés uniquement en commentaires de code, sans spec externe. Que dit cela ?',
      options: [
        'Le code est bien documenté, procède à la réécriture',
        'Tu vas perdre des comportements — si la connaissance est uniquement dans le code, réécrire à partir d\'une spec manquera ces 15 cas limites. Extrais la connaissance d\'abord ou refactorise plutôt.',
        'Les commentaires suffisent pour la spec',
        'Les cas limites ne comptent pas dans une réécriture',
      ],
      correctIndex: 1,
      explanation: "Avant d'approuver une réécriture : Peux-tu écrire une spec complète qui capture chaque cas limite ? Sinon, tu perdras des comportements. As-tu des tests d'intégration ? Sinon, tu ne peux pas vérifier l'équivalence. Le composant est-il assez isolé ? Sinon, le coût de coordination peut dépasser le bénéfice.",
    },
    {
      type: 'code-demo',
      title: 'Évaluation de faisabilité de réécriture',
      body: 'Lance cette évaluation avant d\'approuver toute réécriture. Si ton score est en dessous de 7, refactorise plutôt.',
      language: 'markdown',
      filename: 'docs/rewrite-assessment.md',
      code: "# Rewrite Feasibility: [Component Name]\n\n## Scoring (0-2 per factor, 10 max)\n\n### 1. Specification Completeness (0-2)\nCan all behavior be specified without reading the source?\n- 0: Behavior is only documented in the code itself\n- 1: Partial spec exists, some edge cases undocumented\n- 2: Complete spec with all edge cases captured\nScore: ___\n\n### 2. Test Safety Net (0-2)\nDo integration tests validate external behavior?\n- 0: No tests or only unit tests of internals\n- 1: Some integration tests, incomplete coverage\n- 2: Full integration suite testing all external contracts\nScore: ___\n\n### 3. Coupling Level (0-2)\nHow isolated is this component?\n- 0: >10 direct dependents, deeply integrated\n- 1: 4-10 dependents, moderate integration\n- 2: <4 dependents, clear interface boundary\nScore: ___\n\n### 4. Structural Severity (0-2)\nIs the problem structural or cosmetic?\n- 0: Cosmetic only (naming, style, async patterns)\n- 1: Mixed (some structural issues, some cosmetic)\n- 2: Fundamental (circular deps, god object, untestable)\nScore: ___\n\n### 5. Agent Buildability (0-2)\nCan an agent rebuild this from a spec?\n- 0: Requires tribal knowledge not in any document\n- 1: Mostly specifiable, some implicit knowledge\n- 2: Pure logic, fully specifiable, no hidden context\nScore: ___\n\n## Total: ___ / 10\n- 8-10: Rewrite is clearly justified\n- 5-7: Case-by-case, consider strangler fig\n- 0-4: Refactor instead",
    },
    {
      type: 'order',
      instruction: 'Ordonne ces composants du PLUS justifié à réécrire au MOINS justifié :',
      items: [
        'Module auth : 12 dépendants, 92 % couverture, callbacks, cas limites bien documentés',
        'Générateur PDF : 0 dépendant, 10 % couverture, god object, spec bien comprise',
        'Routeur API : 30 dépendants, 45 % couverture, désordonné mais fonctionnel, pas de spec',
        'Service courriel : 2 dépendants, 0 % couverture, interface simple, exigences claires',
        'Parseur de config : 8 dépendants, 80 % couverture, fonctionne parfaitement, code laid',
      ],
      correctOrder: [1, 3, 2, 0, 4],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Critères de réécriture verrouillés !',
    },

    // === COMPARE: STRANGLER FIG VS BIG BANG ===
    {
      type: 'compare',
      title: 'Strangler fig vs Réécriture big bang',
      body: 'Deux stratégies de migration avec des profils de risque et des calendriers très différents.',
      left: {
        label: 'Strangler Fig (Incrémental)',
        content: 'Semaine 1: Construire le nouveau auth à côté\nSemaine 2: Router 20 % du trafic vers le nouveau\nSemaine 3: Router 60 % vers le nouveau\nSemaine 4: Router 100 %, retirer l\'ancien\n\nProfil de risque :\n- Le système reste en ligne tout du long\n- Retour arrière = rediriger le trafic\n- Les bogues n\'affectent qu\'un trafic partiel\n- Chaque étape est vérifiable indépendamment\n- L\'ancien code sert de référence\n\nCalendrier : 4 semaines, zéro temps d\'arrêt\nTemps de retour arrière : < 5 minutes',
        language: 'text',
        filename: 'strangler-fig.txt',
      },
      right: {
        label: 'Réécriture Big Bang',
        content: 'Semaines 1-3: Construire le système entier\nSemaine 4: Gel des fonctionnalités\nSemaine 5: Bascule le week-end\n\nProfil de risque :\n- Ancien système gelé pendant la construction\n- La bascule est tout-ou-rien\n- Les bogues affectent TOUT le trafic d\'un coup\n- Pas de retour arrière partiel possible\n- L\'ancien code diverge pendant le gel\n\nCalendrier : 5 semaines + gel\nTemps de retour arrière : heures à jours',
        language: 'text',
        filename: 'big-bang.txt',
      },
      question: 'Quelle approche est plus sûre pour les systèmes en production ?',
      correctSide: 'left',
      explanation: 'Le strangler fig garde l\'ancien système en fonctionnement comme filet de sécurité. Le trafic est graduellement redirigé vers les nouveaux composants. Si quelque chose casse, tu redirige en arrière. La réécriture big bang exige une bascule complète sans retour arrière partiel. Avec les flottes d\'agents, le strangler fig est aussi PLUS RAPIDE parce que plusieurs agents peuvent étouffer plusieurs composants simultanément.',
    },

    // === CARRYING DEBT INTENTIONALLY ===
    {
      type: 'multiple-choice',
      question: 'Un module d\'auth laid-mais-fonctionnel n\'a aucun bogue, personne ne le modifie, et les utilisateurs ne voient jamais son code. Devrais-tu le corriger ?',
      options: [
        'Oui — le code laid devrait toujours être nettoyé',
        'Non — certaines dettes sont peu coûteuses à porter. La question n\'est jamais « est-ce que ce code est parfait ? » mais « est-ce que le corriger vaut plus que la prochaine fonctionnalité ? » Porte la dette intentionnellement et documente POURQUOI.',
        'Oui, mais seulement pendant un sprint dédié à la dette technique',
        'Demande aux agents de le corriger pendant les temps morts',
      ],
      correctIndex: 1,
      explanation: "Pas toute la dette technique a besoin d'être remboursée. Certaines dettes sont peu coûteuses à porter. Le code est stable, personne ne le modifie, et sa laideur est invisible pour les utilisateurs. Le corriger ferait du bien mais n'apporterait aucune valeur métier. Le porter intentionnellement — en documentant POURQUOI — est une décision d'ingénierie légitime.",
    },
    {
      type: 'multiple-choice',
      question: 'Tu as un module de 400 lignes de code à base de callbacks, sans tests, mais d\'une stabilité à toute épreuve (zéro bogue en 14 mois). Une flotte d\'agents pourrait le réécrire en 2 heures. Devrais-tu le faire ?',
      options: [
        'Oui — le temps d\'agent est peu cher et la nouvelle version sera plus propre',
        'Non — la stabilité a plus de valeur que la propreté, et la réécriture risque d\'introduire des bogues dans un composant qui n\'en a actuellement aucun',
        'Oui, mais écris des tests d\'intégration d\'abord pour vérifier l\'équivalence',
        'Seulement si tu as besoin de modifier le module pour une nouvelle fonctionnalité',
      ],
      correctIndex: 3,
      explanation: 'La meilleure réponse est « seulement si tu as besoin de le modifier ». Si le module est stable et inchangé, une réécriture est un coût sans bénéfice — tu risques d\'introduire des bogues pour une amélioration esthétique. Mais SI tu as besoin d\'ajouter une fonctionnalité, le manque de tests et le style callback rendent la modification risquée. À ce moment-là, réécris (avec des tests) dans le cadre du travail sur la fonctionnalité.',
    },

    // === DATA-DRIVEN DECISIONS ===
    {
      type: 'multiple-choice',
      question: 'Un module a 0 commits en 6 mois et 0 bogue. Un autre a 45 commits en 6 mois et 12 bogues. La dette technique de quel module est la PLUS coûteuse à porter ?',
      options: [
        'Le premier — zéro activité signifie qu\'il est abandonné et risqué',
        'Le deuxième — une fréquence de changement élevée rend la dette coûteuse car chaque modification risque des régressions. La dette du premier module est gratuite car personne ne le touche.',
        'Les deux sont aussi coûteux',
        'Aucun — la dette devrait toujours être corrigée',
      ],
      correctIndex: 1,
      explanation: "Ne décide pas sur l'instinct seul. Mesure la fréquence de changement : est-il modifié souvent (rendant la dette coûteuse) ou jamais (rendant la dette gratuite) ? Mesure aussi les LOC, la complexité cyclomatique, le couplage et la couverture de tests. Ces chiffres ne prennent pas la décision à ta place — mais ils ancrent la conversation dans la réalité.",
    },
    {
      type: 'code-demo',
      title: 'Script d\'évaluation rapide',
      body: 'Utilise des agents pour recueillir ces métriques avant de prendre toute décision refactorisation-vs-réécriture. Les données d\'abord, puis le jugement.',
      language: 'bash',
      filename: 'scripts/assess-module.sh',
      code: "#!/bin/bash\n# Quick module health assessment\nMODULE=$1\n\necho \"=== Module Assessment: $MODULE ===\"\necho \"\"\n\n# Lines of code\necho \"LOC: $(find $MODULE -name '*.ts' | xargs wc -l | tail -1)\"\n\n# Number of files\necho \"Files: $(find $MODULE -name '*.ts' | wc -l)\"\n\n# Dependents (who imports from this module)\necho \"Dependents: $(grep -r \"from.*$MODULE\" --include='*.ts' -l | wc -l)\"\n\n# Test coverage (if coverage report exists)\nif [ -f coverage/lcov.info ]; then\n  echo \"Coverage: $(grep -A 3 \"$MODULE\" coverage/lcov.info | grep 'LF\\|LH' | head -2)\"\nfi\n\n# Change frequency (commits in last 6 months)\necho \"Commits (6mo): $(git log --since='6 months ago' --oneline -- $MODULE | wc -l)\"\n\n# Complexity (if ts-complexity available)\nif command -v npx &> /dev/null; then\n  echo \"Complexity: run 'npx ts-complexity $MODULE' for details\"\nfi",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Prise de décision basée sur les données — complétée !',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'La décision, c\'est la valeur',
      body: "Les flottes d'agents rendent la refactorisation et la réécriture moins coûteuses. Ça ne rend pas la décision entre les deux plus facile — ça la rend PLUS importante. Quand l'exécution est bon marché, la mauvaise décision te coûte des échecs d'intégration, des cas limites perdus, et des risques de déploiement — pas des heures économisées. Ton jugement sur QUEL chemin prendre a plus de valeur que la capacité à exécuter l'un ou l'autre. L'exécution est banalisée. La décision ne l'est pas.",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification : évaluation Refactoriser vs Réécrire :',
      items: [
        'J\'évalue le couplage, la couverture, la sévérité de la dette et la constructibilité par agents avant de décider',
        'J\'utilise le patron strangler fig pour les composants à fort couplage',
        'J\'approuve les réécritures uniquement quand la spécification est complète et le couplage est faible',
        'Je porte la dette intentionnellement quand la corriger n\'apporte aucune valeur utilisateur',
        'Je recueille des métriques (LOC, complexité, fréquence de changement) avant de prendre des décisions',
        'Je comprends que l\'exécution bon marché rend la DÉCISION plus importante, pas moins',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Refactoriser vs Réécrire maîtrisé. Tu prends des décisions basées sur les données concernant la dette technique dans un monde agent-first.',
    },
  ],
}

export default content
