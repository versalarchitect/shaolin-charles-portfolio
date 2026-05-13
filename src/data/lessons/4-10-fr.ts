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
      type: 'info',
      title: 'Facteur 1 : Score de couplage',
      body: "Combien d'autres composants dépendent de celui-ci ? Une fonction utilitaire utilisée à 3 endroits peut être réécrite facilement — on change l'import, c'est fait. Un module d'auth que 47 composants importent, que le middleware référence, que 3 services appellent via HTTP — ça, c'est un couplage élevé. Un couplage élevé favorise la refactorisation parce qu'une réécriture exige de mettre à jour chaque point de contact simultanément. Même avec des agents, coordonner 47 changements de fichiers lors d'une réécriture est source d'erreurs. Le patron strangler fig (refactoriser par remplacement graduel) gère bien mieux le couplage élevé.",
    },
    {
      type: 'info',
      title: 'Facteur 2 : Couverture de tests',
      body: "Une couverture de tests élevée favorise la refactorisation. Si le composant a 90 % de couverture, tu peux refactoriser agressivement — les tests attrapent les régressions immédiatement. Un agent peut faire des changements audacieux en sachant que la suite de tests va crier si quelque chose casse. À l'inverse, une faible couverture de tests favorise la réécriture : si tu ne peux pas modifier le code en toute sécurité (pas de tests pour valider le comportement), il vaut peut-être mieux écrire la nouvelle version avec des tests dès le départ plutôt que d'essayer d'ajouter des tests à du code que tu ne comprends pas complètement.",
    },
    {
      type: 'info',
      title: 'Facteur 3 : Sévérité de la dette',
      body: "La dette est-elle structurelle ou cosmétique ? La dette cosmétique — nommage incohérent, async en style callback, types manquants — est refactorisable. Un agent peut moderniser le code sans changer son architecture. La dette structurelle — dépendances circulaires, god objects, violation de chaque principe SOLID, impossibilité de tester de façon isolée — nécessite souvent une réécriture parce que la structure elle-même est le problème. Tu ne peux pas refactoriser une dépendance circulaire en un DAG propre sans fondamentalement repenser les relations entre modules.",
    },
    {
      type: 'info',
      title: 'Facteur 4 : Constructibilité par agents',
      body: "Un agent peut-il reconstruire ça à partir d'une spec claire ? Certains composants sont de la logique métier pure avec des entrées et sorties bien définies — hautement constructibles par agents. D'autres encodent des années de gestion de cas limites appris à travers des incidents en production — documentés nulle part sauf dans le code lui-même. Si la connaissance est UNIQUEMENT dans le code et ne peut pas être extraite dans une spec, réécrire signifie perdre cette connaissance. Ça favorise la refactorisation : garder la connaissance, améliorer la structure autour.",
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
      type: 'info',
      title: 'Le strangler fig avec des agents',
      body: "Le patron strangler fig — construire le nouveau système autour de l'ancien, rediriger graduellement le trafic vers les nouveaux composants jusqu'à ce que l'ancien système puisse être retiré — a toujours été la voie de migration la plus sûre. Avec des agents, c'est aussi la plus rapide. Assigne un agent par remplacement de composant. Chaque agent construit la nouvelle version, ajoute une couche d'adaptation, et l'ancien composant se réduit à mesure que les consommateurs migrent. Cinq agents peuvent étouffer cinq composants simultanément. L'ancien système meurt gracieusement, pas violemment.",
    },
    {
      type: 'code-demo',
      title: 'Patron d\'adaptation strangler fig',
      body: 'L\'adaptateur permet aux anciens consommateurs de continuer à fonctionner pendant que les nouveaux consommateurs utilisent directement la version réécrite. Les agents peuvent construire les deux chemins en parallèle.',
      language: 'typescript',
      filename: 'packages/auth/src/adapter.ts',
      code: "// Old interface (callback-based, used by 12 consumers)\nexport interface LegacyAuth {\n  authenticate(token: string, cb: (err: Error | null, user?: User) => void): void\n  authorize(user: User, permission: string, cb: (err: Error | null, allowed?: boolean) => void): void\n}\n\n// New interface (async, clean)\nexport interface ModernAuth {\n  authenticate(token: string): Promise<User>\n  authorize(user: User, permission: string): Promise<boolean>\n}\n\n// Adapter: wraps new implementation in old interface\n// Consumers migrate at their own pace\nexport function createLegacyAdapter(modern: ModernAuth): LegacyAuth {\n  return {\n    authenticate(token, cb) {\n      modern.authenticate(token)\n        .then(user => cb(null, user))\n        .catch(err => cb(err))\n    },\n    authorize(user, permission, cb) {\n      modern.authorize(user, permission)\n        .then(allowed => cb(null, allowed))\n        .catch(err => cb(err))\n    },\n  }\n}\n\n// Migration tracker: when all consumers use ModernAuth directly,\n// remove the adapter and the old interface\nexport const migrationStatus = {\n  totalConsumers: 12,\n  migratedToModern: 7, // Update as consumers switch\n  remainingLegacy: 5,\n}",
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
      type: 'info',
      title: 'Quand la réécriture EST le bon choix',
      body: "Réécris quand tout ceci est vrai : (1) le composant est mal testé donc tu ne peux pas refactoriser en toute sécurité, (2) la logique métier est bien comprise et peut être spécifiée complètement, (3) le couplage est assez faible pour faire l'échange sans changements en cascade, et (4) la dette structurelle rend l'amélioration incrémentale impossible — c'est le design entier qui est mauvais, pas juste le style du code. Quand ces quatre conditions s'alignent, une réécriture est plus rapide, plus sûre, et produit un meilleur résultat que d'essayer de réparer ce qui ne peut pas être réparé de façon incrémentale.",
    },
    {
      type: 'info',
      title: 'La liste de vérification pour la réécriture',
      body: "Avant d'approuver une réécriture : Peux-tu écrire une spec complète qui capture chaque cas limite que l'ancien code gère ? Sinon, tu vas perdre des comportements. As-tu des tests d'intégration qui valident le comportement externe indépendamment de l'implémentation interne ? Sinon, tu ne peux pas vérifier que la réécriture est équivalente. Le composant est-il assez isolé pour que le remplacement ne nécessite pas de changements dans plus de 3 autres fichiers ? Sinon, le coût de coordination peut dépasser le bénéfice de la réécriture.",
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
      type: 'info',
      title: 'Quand la dette vaut la peine d\'être portée',
      body: "Pas toute la dette technique a besoin d'être remboursée. Certaines dettes sont peu coûteuses à porter : le module d'auth laid-mais-fonctionnel ne te coûte rien au quotidien. Le code est stable. Personne ne le modifie. Sa laideur est invisible pour les utilisateurs. Le corriger ferait du bien mais n'apporterait aucune valeur métier. Le porter intentionnellement — en documentant POURQUOI tu ne le corriges pas — est une décision d'ingénierie légitime. La question n'est jamais « est-ce que ce code est parfait ? » C'est « est-ce que corriger ce code vaut plus que la prochaine fonctionnalité que je pourrais construire à la place ? »",
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
      type: 'info',
      title: 'Les métriques qui éclairent la décision',
      body: "Ne décide pas sur l'instinct seul. Mesure : Lignes de code (le module est-il disproportionnellement gros pour ce qu'il fait ?). Complexité cyclomatique (y a-t-il trop de branches pour raisonner clairement ?). Couplage (combien d'autres modules importent de celui-ci ?). Fréquence de changement (est-il modifié souvent, rendant la dette coûteuse, ou jamais, rendant la dette gratuite ?). Couverture de tests (peux-tu le modifier en toute sécurité ?). Ces chiffres ne prennent pas la décision à ta place — mais ils ancrent la conversation dans la réalité plutôt que dans le ressenti.",
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
