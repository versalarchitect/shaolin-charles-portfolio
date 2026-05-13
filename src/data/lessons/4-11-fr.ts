import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-11',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Expliquer l\'architecture AI-first à ton équipe',
      body: "Tu as intériorisé le développement agent-first. Tu penses en graphes de tâches, worktrees, protocoles CLAUDE.md, et pipelines de vérification. Mais quand tu présentes des propositions d'architecture aux parties prenantes — gestionnaires d'ingénierie, CTO, responsables produit — ils pensent en heures-ingénieur, capacité de sprint, et vélocité d'équipe. Si tu expliques ton architecture dans TES termes, ils ne comprendront pas, ne la financeront pas, et ne la soutiendront pas. Traduire, ce n'est pas simplifier. C'est connecter ta réalité technique à leur cadre de décision.",
    },
    {
      type: 'info',
      title: 'Le problème de traduction',
      body: "Quand tu dis « 5 agents sur des worktrees parallèles », ton gestionnaire entend du risque. Quand tu dis « des protocoles CLAUDE.md pour chaque package », ils entendent de la surcharge de processus. Quand tu dis « des frontières de modules constructibles par agents », ils entendent de la sur-ingénierie. Aucune de ces interprétations n'est correcte — mais elles sont raisonnables compte tenu du modèle mental de l'auditeur. Ton travail est de présenter la même architecture en utilisant un langage qui correspond aux résultats qu'ils valorisent déjà : vitesse de livraison, taux de défauts, coût par fonctionnalité, et scalabilité de l'équipe.",
    },

    // === THE TRANSLATION FRAMEWORK ===
    {
      type: 'diagram',
      title: 'De la réalité technique à la valeur métier',
      body: 'Chaque choix technique doit se connecter à un résultat qui intéresse les parties prenantes.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'tech', label: 'Réalité technique', sublabel: 'Comment ça marche vraiment', shape: 'rect' },
          { id: 'translate', label: 'Couche de traduction', sublabel: 'Ta compétence en communication', shape: 'diamond', highlight: true },
          { id: 'value', label: 'Valeur métier', sublabel: 'Ce que les parties prenantes entendent', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'tech', to: 'translate' },
          { from: 'translate', to: 'value' },
        ],
      },
    },
    {
      type: 'info',
      title: 'Le tableau de traduction',
      body: "Chaque concept agent-first a une traduction métier. « 5 agents en worktrees parallèles » devient « 5x la capacité de développement avec un minimum de coordination ». « CLAUDE.md par package » devient « architecture auto-documentée qui permet à tout développeur de contribuer immédiatement ». « Application des frontières de modules » devient « garde-fous architecturaux qui préviennent les conflits inter-équipes ». « Pipeline de vérification » devient « porte qualité automatisée qui attrape les problèmes avant qu'ils atteignent la production ». Même architecture. Langage différent. Réception radicalement différente.",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Cadre de traduction établi !',
    },

    // === COMPARE: JARGON VS MÉTIER ===
    {
      type: 'compare',
      title: 'Jargon technique vs Traduction métier',
      body: 'Les mêmes décisions, communiquées de deux façons différentes. L\'une obtient du financement, l\'autre des regards vides.',
      left: {
        label: 'Jargon technique',
        content: '"On a découplé le monolithe en\nmicroservices avec un bus d\'événements"\n\n"On a renforcé les frontières de modules\nvia des règles eslint et des tags Nx"\n\n"On a implémenté le patron strangler fig\npour la migration du legacy"\n\n"On a ajouté TypeScript en mode strict\navec zéro usage de any"\n\n"On a déployé des protocoles CLAUDE.md\npar package pour le cadrage des agents"',
        language: 'text',
        filename: 'jargon.txt',
      },
      right: {
        label: 'Traduction métier',
        content: '"On peut maintenant livrer des\nfonctionnalités 3x plus vite sans\ncasser des parties non liées de l\'app"\n\n"Les nouveaux membres de l\'équipe sont\nproductifs en heures au lieu de semaines"\n\n"On a migré vers une technologie moderne\navec zéro temps d\'arrêt et\nzéro impact client"\n\n"Notre taux de défauts a baissé de 60 %\nparce que les erreurs sont attrapées\nautomatiquement avant la mise en prod"\n\n"La capacité de développement augmente\nsans embauche proportionnelle"',
        language: 'text',
        filename: 'metier.txt',
      },
      question: 'Quel cadrage un VP d\'ingénierie financerait-il ?',
      correctSide: 'right',
      explanation: 'Les parties prenantes financent des résultats, pas des mécanismes. « On a découplé le monolithe » décrit COMMENT. « On peut livrer 3x plus vite » décrit POURQUOI C\'EST IMPORTANT. La traduction métier connecte chaque décision technique à un résultat que la partie prenante valorise déjà : vitesse, coût, qualité ou réduction des risques.',
    },

    // === CONCRETE TRANSLATIONS ===
    {
      type: 'code-demo',
      title: 'Proposition d\'architecture : version technique (ce que tu penses)',
      body: 'Voici comment tu pourrais décrire l\'architecture à toi-même ou à un autre praticien agent-first. Exact, mais impénétrable pour la plupart des parties prenantes.',
      language: 'markdown',
      filename: 'docs/architecture-internal.md',
      code: "# Architecture: Agent-Fleet Optimized Monorepo\n\n## Design\n- Nx monorepo with enforced module boundaries via eslint\n- CLAUDE.md per package defining scope, constraints, and verification\n- Task graph decomposition for parallel agent execution\n- Git worktrees enabling 5+ simultaneous agent sessions\n- Automated verification pipeline: typecheck → test → build per package\n\n## Deployment\n- Independent deploy pipelines per package\n- API versioning enabling parallel evolution\n- Strangler fig pattern for legacy migration\n\n## Agent Protocol\n- Each agent scoped to single package via CLAUDE.md\n- No cross-package imports except @repo/shared-types\n- Agents self-verify via package-level test + build",
    },
    {
      type: 'code-demo',
      title: 'Proposition d\'architecture : version parties prenantes (ce qu\'ils entendent)',
      body: 'Même architecture, traduite pour le leadership d\'ingénierie. Se concentre sur les résultats, les coûts et la réduction des risques.',
      language: 'markdown',
      filename: 'docs/architecture-proposal.md',
      code: "# Architecture Proposal: Scalable Development Platform\n\n## Business Case\nOur current architecture requires manual coordination between developers\nworking on related features. This proposal eliminates coordination overhead\nthrough architectural boundaries, enabling parallel development at 3-5x\ncurrent velocity.\n\n## Key Outcomes\n- **Ship velocity**: 5x feature throughput without hiring\n- **Quality**: Automated verification catches 94% of defects pre-merge\n- **Onboarding**: New contributors productive in hours, not weeks\n  (self-documenting packages with clear scope definitions)\n- **Risk reduction**: Independent packages deploy independently —\n  a billing change cannot break authentication\n\n## Cost\n- 2 weeks initial setup (package boundaries + CI pipelines)\n- Zero ongoing maintenance — boundaries are enforced by tooling\n- Net savings: eliminates ~15hrs/week of cross-team coordination\n\n## Evidence\n- Pilot: billing module rebuilt in 3 days (previously estimated 3 weeks)\n- Defect rate in pilot: 0 production bugs in 45 days\n- Deploy frequency in pilot: 4x daily vs 2x weekly",
    },
    {
      type: 'multiple-choice',
      question: 'La version parties prenantes ne mentionne jamais « agents », « CLAUDE.md » ou « worktrees ». Pourquoi ?',
      options: [
        'Parce que les parties prenantes n\'approuveraient pas les dépenses liées à l\'IA',
        'Parce que ce sont des détails d\'implémentation — les parties prenantes se soucient des résultats (vitesse, qualité, coût), pas des mécanismes',
        'Parce que mentionner l\'IA rend la proposition risquée en apparence',
        'Parce que la version technique est fausse',
      ],
      correctIndex: 1,
      explanation: 'Les parties prenantes prennent des décisions basées sur les résultats : est-ce que ça va nous rendre plus rapides, moins chers, ou meilleurs ? COMMENT tu atteins ces résultats est un détail d\'implémentation qu\'ils te font confiance pour gérer. Mener avec les mécanismes (« agents en worktrees ») les force à évaluer un paradigme qu\'ils ne comprennent pas. Mener avec les résultats (« 5x la vélocité ») leur permet d\'évaluer sur des critères qu\'ils COMPRENNENT.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Compétence de traduction en développement !',
    },

    // === CODE-FILL: TRADUCTION PARTIES PRENANTES ===
    {
      type: 'code-fill',
      instruction: 'Complète ce tableau de traduction pour les parties prenantes en remplissant le résultat métier de chaque décision technique.',
      language: 'markdown',
      filename: 'docs/translation-table.md',
      template: '# Technical Decision → Business Outcome\n\n| Technical Decision | Business Outcome |\n|---|---|\n| Module boundary enforcement | {{boundary_outcome}} |\n| Independent deploy pipelines | {{deploy_outcome}} |\n| Automated verification pipeline | {{verify_outcome}} |\n| API versioning between services | {{version_outcome}} |\n| Self-documenting packages (CLAUDE.md) | {{docs_outcome}} |',
      blanks: [
        { id: 'boundary_outcome', answer: 'Teams work in parallel without conflicts', alternatives: ['No cross-team conflicts', 'Parallel development without coordination', 'Zero coordination overhead between teams', 'developers work independently'], placeholder: 'quel résultat métier ?', hint: 'Que se passe-t-il quand les équipes ne peuvent pas se marcher sur les pieds ?' },
        { id: 'deploy_outcome', answer: 'A billing change cannot break authentication', alternatives: ['Changes to one area cannot break another', 'Reduced blast radius of changes', 'Independent releases reduce risk', 'isolated deployments reduce risk'], placeholder: 'quel résultat métier ?', hint: 'Que se passe-t-il quand les services se déploient indépendamment ?' },
        { id: 'verify_outcome', answer: 'Defects caught before reaching production', alternatives: ['94% of bugs caught pre-merge', 'Fewer production incidents', 'Automated quality gate catches issues early', 'bugs caught automatically'], placeholder: 'quel résultat métier ?', hint: 'Que prévient la vérification automatisée ?' },
        { id: 'version_outcome', answer: 'Features ship without waiting on other teams', alternatives: ['No blocking between teams', 'Parallel feature development', 'Teams evolve at their own pace', 'independent evolution'], placeholder: 'quel résultat métier ?', hint: 'Que se passe-t-il quand les API peuvent évoluer indépendamment ?' },
        { id: 'docs_outcome', answer: 'New contributors productive in hours not weeks', alternatives: ['Fast onboarding', 'Faster onboarding for new team members', 'Reduced ramp-up time', 'instant developer onboarding'], placeholder: 'quel résultat métier ?', hint: 'Qu\'est-ce que l\'auto-documentation permet pour les nouvelles personnes ?' },
      ],
      explanation: 'Chaque décision technique correspond à un résultat métier qui intéresse les parties prenantes. Mener avec les résultats (« les équipes travaillent en parallèle ») au lieu des mécanismes (« application des frontières de modules ») fait résonner la proposition auprès des décideurs non techniques.',
    },

    // === DEFENDING UNDER SCRUTINY ===
    {
      type: 'info',
      title: 'Les questions auxquelles tu feras face',
      body: "Les parties prenantes vont résister. « Comment tu sais que les agents n'introduiront pas de bogues ? » Montre les résultats de ton pipeline de vérification — zéro défaut en production lors du pilote. « Et si l'IA fait une erreur ? » Montre ton journal d'overrides et la porte de révision humaine. « C'est juste une mode ? » Montre ta fréquence de déploiement avant et après. « On peut engager à la place ? » Montre la comparaison des coûts : 5 agents coûtent moins par mois qu'un développeur junior, produisent du travail 24/7, et ne nécessitent aucune gestion. Chaque objection a une réponse appuyée par des données.",
    },
    {
      type: 'info',
      title: 'Montre des résultats livrés, pas de la théorie',
      body: "La défense la plus puissante est : ça marche déjà. Avant de proposer l'architecture agent-first au leadership, fais un pilote. Construis une fonctionnalité avec des agents, mesure les résultats, et présente les PREUVES. « Voici ce qu'on a livré la semaine dernière avec cette approche. Ça a pris 3 jours au lieu de 3 semaines. Zéro bogue en production. Voici l'historique de commits montrant 5 flux de travail parallèles. » La théorie est débattable. Du logiciel livré ne l'est pas.",
    },
    {
      type: 'code-demo',
      title: 'Dossier de preuves pour la revue des parties prenantes',
      body: 'Prépare ceci avant toute réunion de proposition d\'architecture. Les chiffres concrets font taire les objections théoriques.',
      language: 'markdown',
      filename: 'docs/pilot-results.md',
      code: "# Pilot Results: Agent-First Architecture\n\n## Scope\nRebuilt the billing module using the proposed architecture.\n\n## Timeline Comparison\n| Metric | Traditional (est.) | Agent-First (actual) |\n|--------|-------------------|---------------------|\n| Calendar days | 15-20 | 3 |\n| Developer hours | 80-120 | 12 (direction + review) |\n| PRs merged | 8-12 | 23 (small, focused) |\n| Production bugs (30 days) | 2-4 (historical avg) | 0 |\n\n## Quality Metrics\n- Test coverage: 94% (vs 67% team average)\n- Type safety: strict mode, zero `any` usage\n- Build time: 8s (vs 45s for legacy module)\n\n## Cost\n- Agent compute: $47 total for entire rebuild\n- Human time: 12 hours @ blended rate\n- Total cost: ~$850 vs estimated $8,000-12,000 traditional\n\n## What This Means at Scale\nIf we apply this to remaining 8 modules:\n- Estimated 6 weeks total (vs 6+ months traditional)\n- Cost: ~$7,000 (vs ~$80,000 traditional)\n- Result: Modern, tested, documented, independently deployable",
    },
    {
      type: 'multiple-choice',
      question: 'Un VP demande : « Que se passe-t-il si Claude tombe en panne ? Sommes-nous dépendants d\'un seul fournisseur d\'IA ? » La meilleure réponse ?',
      options: [
        'Claude ne tombe jamais en panne — Anthropic a une excellente disponibilité',
        'L\'architecture qu\'on a construite est indépendante du fournisseur — les frontières de modules, les suites de tests et les pipelines de déploiement fonctionnent avec n\'importe quel assistant IA ou avec des développeurs humains. On a choisi le meilleur outil disponible aujourd\'hui, mais on n\'est pas enfermés.',
        'On pourrait passer à GPT-4 si nécessaire',
        'Les pannes d\'IA sont rares et on peut juste attendre',
      ],
      correctIndex: 1,
      explanation: 'Ceci recadre la préoccupation positivement : l\'architecture elle-même est la valeur, pas l\'outil IA spécifique. Les frontières de modules aident tout développeur (humain ou IA). Les tests valident le travail de n\'importe quel auteur. Les pipelines de déploiement sont indépendants de l\'outil. Tu reconnais la préoccupation, montres que tu y as réfléchi, et démontres que les décisions architecturales ont de la valeur indépendamment de tout fournisseur IA spécifique.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Défense sous examen — préparé !',
    },

    // === BUILDING CREDIBILITY ===
    {
      type: 'info',
      title: 'La crédibilité se gagne en déploiements',
      body: "Aucun talent de présentation ne remplace les résultats. L'architecte qui déploie quotidiennement avec zéro retour arrière a plus de crédibilité que l'architecte avec de belles diapositives. Ta crédibilité pour proposer l'architecture agent-first vient de la démonstration que ça fonctionne dans TON contexte, avec TA base de code, sous TES contraintes. Commence petit. Livre quelque chose. Mesure. Puis propose d'élargir. La proposition appuyée par « voici ce qu'on a déjà livré » est irrésistible.",
    },
    {
      type: 'info',
      title: 'L\'échelle de crédibilité',
      body: "Étape 1 : Utilise des agents personnellement pour tes propres tâches. Remarque l'augmentation de vélocité. Étape 2 : Reconstruis un petit composant en utilisant les principes agent-first. Mesure les résultats. Étape 3 : Partage les résultats de façon informelle avec ton équipe. Laisse la curiosité grandir. Étape 4 : Propose un pilote formel sur un projet de taille moyenne. Étape 5 : Présente les résultats du pilote au leadership avec le dossier de preuves. Étape 6 : Propose l'adoption complète de l'architecture. Chaque étape s'appuie sur des résultats prouvés de l'étape précédente. Tu ne demandes jamais de permission basée sur la théorie seule.",
    },
    {
      type: 'order',
      instruction: 'Ordonne les étapes de construction de crédibilité de la première à la dernière :',
      items: [
        'Proposer l\'adoption complète de l\'architecture au leadership',
        'Reconstruire un composant avec des agents, mesurer les résultats',
        'Présenter les résultats du pilote avec le dossier de preuves',
        'Utiliser des agents personnellement, remarquer les gains de vélocité',
        'Mener un pilote formel sur un projet de taille moyenne',
      ],
      correctOrder: [3, 1, 4, 2, 0],
    },

    // === COMMON STAKEHOLDER PERSONAS ===
    {
      type: 'info',
      title: 'Connais ton audience',
      body: "Différentes parties prenantes ont besoin de traductions différentes. Le CTO se soucie du risque technique et de la maintenabilité à long terme. Le VP d'ingénierie se soucie de la productivité de l'équipe et des coûts d'embauche. Le responsable produit se soucie de la vitesse de livraison des fonctionnalités. Le directeur financier se soucie du coût par fonctionnalité. Une architecture, quatre conversations. Prépare les traductions pour chaque audience avant la réunion, pas pendant.",
    },
    {
      type: 'code-demo',
      title: 'Points de discussion par audience',
      body: 'Même architecture, quatre cadrages différents. Prépare les quatre avant toute réunion interfonctionnelle.',
      language: 'markdown',
      filename: 'docs/talking-points.md',
      code: "# Agent-First Architecture: Audience Translations\n\n## For the CTO\n- \"Enforced module boundaries reduce architectural entropy\"\n- \"Independent deployment reduces blast radius of any single change\"\n- \"We are building on standard patterns (monorepo, CI/CD) with better enforcement\"\n- \"Vendor-agnostic: the architecture works with any AI or with humans\"\n\n## For VP Engineering\n- \"5x throughput without proportional headcount growth\"\n- \"New contributors are productive in hours due to self-documenting packages\"\n- \"15 hours/week coordination overhead eliminated by architectural boundaries\"\n- \"Pilot team shipping 4x daily vs org average of 2x weekly\"\n\n## For Product Manager\n- \"Feature X that was estimated at 3 weeks can ship in 3 days\"\n- \"Parallel development: features do not block each other\"\n- \"Faster iteration: we can try 5 approaches in the time 1 used to take\"\n- \"Quality maintained: zero production bugs in 45-day pilot\"\n\n## For CFO\n- \"$47 compute cost vs $8,000 traditional development cost for same output\"\n- \"Hiring 5 engineers = $750K/year. Agent fleet = ~$5K/year for equivalent output\"\n- \"Reduced coordination overhead = fewer meetings = more build time\"\n- \"Lower defect rate = less emergency response cost\"",
    },
    {
      type: 'multiple-choice',
      question: 'Tu présentes au directeur financier. Avec quelle métrique tu commences ?',
      options: [
        'L\'amélioration de la couverture de tests (67 % à 94 %)',
        'La fréquence de déploiement (2x par semaine à 4x par jour)',
        'La réduction du coût par fonctionnalité (8 000 $ à 850 $)',
        'Le taux d\'application des frontières de modules',
      ],
      correctIndex: 2,
      explanation: 'Le directeur financier pense en dollars. Commence par la métrique qui parle son langage : le coût par fonctionnalité. Les autres métriques sont des preuves complémentaires (les améliorations de qualité et de vélocité justifient le chiffre de coût) mais le titre qui capte l\'attention du directeur financier est la réduction de coût de 10x.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Communication avec les parties prenantes maîtrisée !',
    },

    // === HANDLING RESISTANCE ===
    {
      type: 'info',
      title: 'Quand ils disent non',
      body: "Parfois la réponse est non. Peut-être que l'organisation n'est pas prête. Peut-être qu'il y a un gel d'embauche qui rend « remplacer l'embauche par des agents » politiquement toxique. Peut-être que le VP a eu une mauvaise expérience avec du code généré par IA. Quand la réponse est non : n'argumente pas. Dis « compris ». Puis continue à livrer avec des agents personnellement. Continue à construire tes preuves. Reviens dans 3 mois avec des résultats encore plus solides. La persévérance appuyée par des données est persuasive. L'argumentation ne l'est pas.",
    },
    {
      type: 'info',
      title: 'Le jeu à long terme',
      body: "L'architecture agent-first deviendra la norme. Tu es en avance. Être en avance signifie que tu fais face à de la résistance qui n'existera plus dans 2 ans. Ton travail n'est pas de convaincre tout le monde aujourd'hui — c'est de construire des résultats tellement indéniables que l'adoption devient évidente. Chaque fonctionnalité que tu livres avec des agents, chaque bogue que tu évites grâce aux pipelines de vérification, chaque échéance que tu dépasses grâce à l'exécution parallèle — tout ça s'accumule en un argument qui se défend tout seul. Joue le jeu à long terme.",
    },

    // === SYNTHESIS ===
    {
      type: 'checklist',
      title: 'Liste de vérification : communication avec les parties prenantes :',
      items: [
        'Je traduis les mécanismes techniques en résultats métier',
        'Je prépare des dossiers de preuves avec des métriques concrètes avant de proposer',
        'Je fais des pilotes d\'abord et propose l\'expansion basée sur les résultats',
        'J\'adapte le message à chaque audience (CTO, VP, PM, directeur financier)',
        'Je défends les décisions avec des résultats livrés, pas de la théorie',
        'Je gère le « non » avec patience et construction continue de preuves',
        'Je suis l\'échelle de crédibilité : usage personnel → pilote → proposition',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Communication maîtrisée. Tu peux concevoir pour les agents ET emmener les parties prenantes dans l\'aventure.',
    },
  ],
}

export default content
