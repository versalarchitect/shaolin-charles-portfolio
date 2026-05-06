import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Quand outrepasser les conseils confiants mais erronés de l\'IA',
      body: "Tu demandes à cinq agents d'évaluer une décision d'architecture. Les cinq sont d'accord : migrer vers des microservices. Leur raisonnement est solide, leur confiance est élevée, et ils citent les meilleures pratiques de l'industrie. Mais tu sais quelque chose qu'ils ignorent — ton équipe, c'est trois personnes, ton pipeline de déploiement ne peut pas gérer 12 services, et tes patrons de trafic rendent un monolithe modulaire dix fois plus simple. Cette leçon porte sur la compétence la plus difficile en développement assisté par agents : savoir quand chaque agent dans la salle a tort, et avoir la conviction de les outrepasser.",
    },
    {
      type: 'info',
      title: 'Pourquoi le consensus de l\'IA échoue',
      body: "Les agents sont entraînés sur Internet. Internet surreprésente certains patrons : les microservices pour la mise à l'échelle, GraphQL pour les API, l'événementiel pour le découplage. Ce sont de vraies solutions — à des problèmes précis. Mais les agents les généralisent en conseils universels. Quand cinq agents sont d'accord, ça veut souvent dire qu'ils puisent tous dans la même distribution d'entraînement biaisée, pas qu'ils ont raisonné indépendamment vers la même conclusion. Le consensus entre agents n'est pas la même chose que le consensus entre experts diversifiés avec des contextes différents.",
    },

    // === FAILURE MODES ===
    {
      type: 'info',
      title: 'Trois catégories où les agents échouent',
      body: "Premièrement : les problèmes nouveaux. Si personne n'a écrit sur ton ensemble de contraintes spécifiques sur Internet, les agents interpolent à partir d'exemples adjacents — mal. Deuxièmement : les cas limites de ton domaine. L'agent ne sait pas que ton SLA est de 50 ms, que ta base de données tourne sur un serveur de 2015 avec 4 Go de RAM, ou que ton équipe de conformité refuse tout ce qui touche aux données personnelles. Troisièmement : les contraintes organisationnelles. Les réalités politiques, les compétences de l'équipe, les budgets de migration et le contexte de dette technique qu'aucun modèle ne peut déduire d'un prompt.",
    },
    {
      type: 'diagram',
      title: 'Consensus des agents vs Ton jugement',
      body: 'Quand plusieurs agents sont d\'accord, ton évaluation est le point de contrôle critique.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'agents', label: 'Consensus des agents', sublabel: '5/5 d\'accord', shape: 'rect' },
          { id: 'eval', label: 'Ton évaluation', sublabel: 'Contexte + expérience', shape: 'diamond', highlight: true },
          { id: 'accept', label: 'Accepter', sublabel: 'Procéder tel que conseillé', shape: 'pill' },
          { id: 'override', label: 'Outrepasser', sublabel: 'Ton jugement l\'emporte', shape: 'pill', highlight: true },
          { id: 'doc', label: 'Documenter la décision', sublabel: 'Suivre le résultat', shape: 'rounded' },
        ],
        edges: [
          { from: 'agents', to: 'eval' },
          { from: 'eval', to: 'accept', label: 'les agents ont le contexte' },
          { from: 'eval', to: 'override', label: 'tu as le contexte' },
          { from: 'override', to: 'doc' },
          { from: 'accept', to: 'doc' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Modes de défaillance identifiés!',
    },

    // === OVERRIDE CRITERIA ===
    {
      type: 'info',
      title: 'Construire des critères d\'outrepassement',
      body: "Il te faut un cadre, pas des intuitions vagues. Pose-toi quatre questions. Un : est-ce que l'agent a accès à la contrainte qui compte le plus ? Si tu ne lui as pas parlé de ton équipe de 4 personnes ou de tes exigences de conformité, sa recommandation repose sur des données incomplètes — outrepasse. Deux : est-ce que la recommandation se base sur une bonne pratique générale ou une analyse spécifique de ta codebase ? Les conseils généraux échouent à l'échelle spécifique. Trois : as-tu déjà vu ce patron échouer dans des contextes similaires ? Ton expérience vécue est une donnée que le modèle n'a pas. Quatre : quel est le coût de se tromper ? Si c'est réversible, essaie la voie de l'agent. Si c'est irréversible, fie-toi à ton instinct.",
    },
    {
      type: 'code-demo',
      title: 'Journal de décisions d\'outrepassement',
      body: 'Consigne chaque décision d\'outrepassement et son résultat. Ça calibre ton jugement au fil du temps — tu apprends quand tu avais raison d\'outrepasser et quand tu aurais dû écouter.',
      language: 'markdown',
      filename: 'OVERRIDE_LOG.md',
      code: "# Override Decision Log\n\n## 2026-04-28: Database choice\n- **Agent recommendation**: PostgreSQL with read replicas\n- **My override**: SQLite with Litestream replication\n- **Rationale**: Single-server deployment, <1000 concurrent users,\n  ops team is one person (me). Postgres overhead not justified.\n- **Outcome (30 days)**: Correct. Zero ops incidents. p99 latency 12ms.\n  Agent's recommendation would have added 3 services to maintain.\n\n## 2026-04-15: API design\n- **Agent recommendation**: REST with OpenAPI spec\n- **My override**: tRPC with end-to-end types\n- **Rationale**: Full-stack TypeScript, no external consumers,\n  team already knows tRPC. OpenAPI overhead adds no value here.\n- **Outcome (30 days)**: Correct. Ship velocity 2x what REST would allow.\n\n## 2026-04-02: State management\n- **Agent recommendation**: Zustand for client state\n- **My override**: React Query + URL state only\n- **Outcome (30 days)**: Partially wrong. Needed local UI state for\n  a complex form wizard. Added Zustand in week 3. Should have listened.",
    },
    {
      type: 'multiple-choice',
      question: 'Les cinq agents recommandent GraphQL pour ton nouveau projet. Ton équipe n\'a jamais utilisé GraphQL, ton API a 4 endpoints, et tu livres dans 2 semaines. Que fais-tu ?',
      options: [
        'Fais confiance aux agents — cinq qui sont d\'accord, c\'est un signal fort',
        'Outrepasse — les agents manquent de contexte sur les compétences de l\'équipe, la simplicité de l\'API et l\'échéancier',
        'Demande à un sixième agent pour départager',
        'Utilise GraphQL mais génère le schéma avec un agent pour gagner du temps',
      ],
      correctIndex: 1,
      explanation: 'Les agents recommandent en se basant sur les meilleures pratiques générales (GraphQL s\'adapte bien, a un excellent outillage). Mais ils ne savent pas que ton équipe a zéro expérience avec GraphQL, que ton API est triviale, et que ton échéancier est immuable. Ces contraintes contextuelles l\'emportent sur les meilleures pratiques théoriques. Outrepasse et documente pourquoi.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Critères d\'outrepassement intégrés!',
    },

    // === THE PARADOX ===
    {
      type: 'info',
      title: 'Le paradoxe de l\'outrepassement',
      body: "Voici la tension : tu as besoin que les agents soient utiles. Si tu outrepasses chaque recommandation, pourquoi les utiliser ? La réponse, c'est l'asymétrie. Les agents ont raison 90 % du temps sur les détails d'implémentation — comment structurer un composant, quelle API appeler, comment écrire un test. Ils se trompent 30 à 40 % du temps sur les décisions architecturales qui dépendent d'un contexte qu'ils ne peuvent pas voir. Ton travail, c'est de savoir dans quelle catégorie tu te trouves. Laisse les agents gérer l'implémentation. Outrepasse sur l'architecture, la stratégie, et tout ce qui nécessite du contexte sur ton équipe, tes échéanciers ou tes contraintes.",
    },
    {
      type: 'info',
      title: 'Calibration de la confiance',
      body: "La confiance de l'agent ne corrèle pas avec la justesse sur les problèmes nouveaux. Un modèle va dire « la meilleure approche est X » avec la même confiance linguistique, que X soit bien établi ou une extrapolation hallucinée. Tu ne peux pas utiliser le niveau de confiance de l'agent comme signal. Utilise plutôt ta propre confiance : si tu as une expérience directe du domaine du problème et que la recommandation de l'agent contredit cette expérience, ton expérience l'emporte. Si tu es en terrain inconnu et que l'agent cite un raisonnement spécifique et vérifiable, penche vers l'agent.",
    },
    {
      type: 'multiple-choice',
      question: 'Tu as 8 ans d\'expérience en systèmes de paiement. Un agent recommande de stocker les tokens de carte d\'une manière que tu n\'as jamais vue. Quel est le bon réflexe ?',
      options: [
        'Fais confiance à l\'agent — il connaît peut-être un patron plus récent que tu n\'as pas rencontré',
        'Outrepasse immédiatement — ton expérience du domaine l\'emporte toujours',
        'Investigue la recommandation spécifique, mais penche fortement vers ton expérience vu le coût élevé d\'une erreur dans les paiements',
        'Demande à un autre agent de valider le premier',
      ],
      correctIndex: 2,
      explanation: 'Les paiements sont un domaine à forts enjeux et fortement réglementé. Tes 8 ans de connaissance du domaine sont un contexte critique. Mais tu devrais quand même évaluer la recommandation spécifique — peut-être que c\'EST un patron plus récent conforme à PCI. L\'essentiel, c\'est que ton expérience crée une barre haute que l\'agent doit franchir, pas que tu l\'ignores complètement.',
    },

    // === PRACTICAL SCENARIOS ===
    {
      type: 'info',
      title: 'Scénario : le refactoring qui ne devrait pas avoir lieu',
      body: "Ta flotte d'agents analyse ta codebase et recommande de refactoriser ton module d'authentification. Le code est laid, utilise des callbacks au lieu d'async/await, et n'a pas de tests. Par chaque métrique objective, il a besoin d'un refactoring. Mais tu sais : ce code n'a pas eu de bogue depuis 18 mois. Il gère 50K requêtes d'auth par jour. L'équipe de conformité a approuvé exactement cette implémentation. Refactoriser introduit du risque avec zéro bénéfice côté utilisateur. Les agents ne peuvent pas savoir que la stabilité et l'approbation de conformité ont plus de valeur que l'esthétique du code ici.",
    },
    {
      type: 'multiple-choice',
      question: 'Trois agents recommandent de casser ton monolithe en services. Ton monolithe se déploie en 30 secondes, a 95 % de couverture de tests, et ton équipe de deux livre des fonctionnalités chaque jour. Outrepasser ?',
      options: [
        'Non — les microservices sont objectivement une meilleure architecture',
        'Oui — les agents optimisent pour la scalabilité théorique, pas pour ta vélocité de déploiement réelle et la taille de ton équipe',
        'Partiellement — extrais un service comme test',
        'Redemande aux agents avec plus de contexte',
      ],
      correctIndex: 1,
      explanation: 'C\'est un scénario d\'outrepassement classique. Les agents recommandent les microservices parce que c\'est le patron dominant dans leurs données d\'entraînement pour « mettre à l\'échelle » des systèmes. Mais ton système n\'a pas de problème de mise à l\'échelle — il a un avantage de vélocité de livraison que les microservices détruiraient pour une équipe de deux.',
    },
    {
      type: 'info',
      title: 'Scénario : le choix technologique qui semble mauvais',
      body: "Tu choisis SQLite pour une application web en production. Chaque agent te dit que c'est une erreur — utilise PostgreSQL, ça s'adapte mieux, ça gère mieux la concurrence. Mais tu sais : ton app sert 500 utilisateurs, tourne sur un seul VPS à 20 $/mois, et SQLite en mode WAL gère 10x ta charge prévue. La simplicité opérationnelle de zéro serveur de base de données, zéro connection pooling, zéro scripts de sauvegarde (juste copier un fichier) vaut plus que la scalabilité théorique dont tu n'auras jamais besoin. Les agents optimisent pour le cas général. Toi, tu optimises pour TON cas.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Jugement de scénario développé!',
    },

    // === DOCUMENTING OVERRIDES ===
    {
      type: 'info',
      title: 'Pourquoi la documentation est importante',
      body: "Les décisions d'outrepassement sont invisibles par défaut. Dans six mois, un nouveau membre de l'équipe (ou toi, ayant oublié) regardera ton choix SQLite et pensera que c'est une erreur. Sans documentation, il va le « corriger » — en introduisant exactement la complexité que tu as évitée. Chaque outrepassement a besoin de trois choses : ce qui était recommandé, pourquoi tu as outrepassé, et quel résultat tu attends. Puis reviens-y à 30, 60 et 90 jours. Ça crée une boucle de rétroaction qui calibre ton jugement au fil du temps.",
    },
    {
      type: 'code-demo',
      title: 'Architecture Decision Record avec contexte d\'outrepassement',
      body: 'Les ADR sont le format standard. Ajouter une section « Outrepassement d\'agent » rend le raisonnement explicite et vérifiable.',
      language: 'markdown',
      filename: 'docs/adr/003-database-choice.md',
      code: "# ADR-003: SQLite for production database\n\n## Status: Accepted\n\n## Context\nWe need a database for user data (~500 users, ~10K records).\n\n## Agent Recommendation\nAll consulted agents recommended PostgreSQL citing:\n- Better concurrency model\n- Broader ecosystem (extensions, tooling)\n- Industry standard for production web apps\n\n## Decision: Override — Use SQLite with WAL mode\n\n## Rationale for Override\n1. **Agents lack deployment context**: Single VPS, no container\n   orchestration, one-person ops team\n2. **Agents optimize for scale we do not have**: 500 users is\n   well within SQLite's capabilities (tested to 10K concurrent reads)\n3. **Operational simplicity**: No connection pooling, no separate\n   backup system, no version management\n4. **Cost**: $0/month vs $15-50/month for managed Postgres\n\n## Expected Outcome\n- Zero database-related ops incidents in first 6 months\n- Sub-10ms query times for all operations\n- Backup = copy one file to S3\n\n## Revisit: 2026-10-28 (6 months)\n## Escalation trigger: >2000 concurrent users OR write contention",
    },
    {
      type: 'order',
      instruction: 'Ordonne les étapes d\'un bon processus de décision d\'outrepassement :',
      items: [
        'Revisiter à 30/60/90 jours pour calibrer',
        'Identifier le contexte qui manque à l\'agent',
        'Documenter ta justification et le résultat attendu',
        'Recevoir la recommandation de l\'agent avec haute confiance',
        'Évaluer le coût de se tromper (réversible vs irréversible)',
      ],
      correctOrder: [3, 1, 4, 2, 0],
    },

    // === CALIBRATION OVER TIME ===
    {
      type: 'info',
      title: 'Calibrer ton instinct d\'outrepassement',
      body: "Suis tes outrepassements. Après 20 à 30 décisions consignées, des patrons émergent. Peut-être que tu outrepasses correctement 85 % du temps sur les décisions d'infrastructure, mais incorrectement 60 % du temps sur l'architecture frontend. Ces données te disent où ton jugement est fort (continue d'outrepasser) et où il est faible (écoute davantage les agents). Le but n'est pas d'outrepasser plus ou moins — c'est d'outrepasser avec précision. Ton journal d'outrepassement est ton instrument de calibration.",
    },
    {
      type: 'multiple-choice',
      question: 'Ton journal d\'outrepassement montre que tu avais tort 4 fois sur 5 en outrepassant les recommandations d\'agents sur l\'architecture CSS. Que devrais-tu changer ?',
      options: [
        'Arrêter d\'outrepasser complètement — les agents en savent plus que toi',
        'Pour l\'architecture CSS spécifiquement, relever la barre pour outrepasser — tes instincts sont mal calibrés dans ce domaine',
        'Supprimer les entrées du journal où tu avais tort',
        'Demander à plus d\'agents pour augmenter la confiance avant d\'outrepasser',
      ],
      correctIndex: 1,
      explanation: 'Le journal révèle un problème de calibration spécifique à un domaine. Tu n\'as pas tort d\'outrepasser en général — juste dans ce domaine précis. La solution est de faire davantage confiance aux agents sur l\'architecture CSS tout en maintenant ton autorité d\'outrepassement dans les domaines où ton journal montre une bonne précision.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Cadre de calibration établi!',
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'La méta-compétence',
      body: "Le jugement d'outrepassement est la compétence qui sépare un opérateur d'agents d'un architecte d'agents. Les opérateurs prennent ce que les agents leur donnent. Les architectes évaluent, filtrent et parfois rejettent — pas par ego, mais par un contexte durement acquis qu'aucun modèle ne peut accéder. Ton expérience, ta connaissance de ton équipe, ta compréhension de tes contraintes — ce ne sont pas des bogues dans le processus. C'EST le processus. L'agent est un conseiller puissant. Toi, tu es le décideur. N'abdique jamais ce rôle, peu importe à quel point le conseiller semble confiant.",
    },
    {
      type: 'checklist',
      title: 'Checklist du jugement d\'outrepassement :',
      items: [
        'Je sais identifier quand le consensus des agents provient d\'un biais d\'entraînement plutôt que d\'un raisonnement indépendant',
        'J\'applique le cadre des quatre questions avant d\'accepter ou de rejeter des recommandations',
        'Je documente chaque outrepassement avec la justification et les résultats attendus',
        'Je revisite les décisions d\'outrepassement pour calibrer mon jugement au fil du temps',
        'Je connais mes domaines forts et faibles grâce à mon journal d\'outrepassement',
        'Je comprends le paradoxe : les agents doivent être utiles ET je dois savoir quand les ignorer',
      ],
    },
    {
      type: 'checkpoint',
      xp: 12,
      message: 'Jugement d\'outrepassement maîtrisé. Tu sais quand faire confiance et quand outrepasser — et tu peux le prouver.',
    },
  ],
}

export default content
