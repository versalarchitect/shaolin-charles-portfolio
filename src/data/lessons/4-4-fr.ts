import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-4',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Vous êtes l\'évaluateur, pas l\'exécutant',
      body: "L'agent suggère des microservices. Il semble confiant. Le raisonnement est articulé. Les exemples de code sont propres. Mais est-ce que c'est CORRECT pour votre système ? Au Tier 4, votre rôle passe de « personne qui utilise des agents » à « personne qui évalue la sortie des agents au niveau architectural. » Les agents sont excellents pour générer des architectures plausibles. Ils sont faibles pour évaluer si cette architecture convient à VOS contraintes, la taille de VOTRE équipe, VOS besoins de mise à l'échelle et VOTRE budget de maintenance. Cette évaluation est votre travail — et elle nécessite un cadre systématique, pas des impressions.",
    },
    {
      type: 'info',
      title: 'Pourquoi les agents sur-architecturent',
      body: "Les agents IA sont entraînés sur tout l'internet — y compris des milliers de billets de blogue sur les microservices, l'event sourcing, le CQRS et d'autres patrons conçus pour des entreprises de 500+ ingénieurs. Quand vous demandez à un agent de concevoir un système, il puise dans ce corpus. Le résultat : des architectures qui sont techniquement correctes mais follement inappropriées pour une équipe de 3 personnes ou un MVP. L'agent ne connaît pas la taille de votre équipe, votre calendrier ou votre capacité opérationnelle. Il optimise pour la « correction » architecturale dans l'abstrait. Votre travail est d'évaluer contre la réalité.",
    },

    // === THE EVALUATION FRAMEWORK ===
    {
      type: 'diagram',
      title: 'Flux d\'évaluation des suggestions d\'agent',
      body: 'Chaque suggestion architecturale d\'un agent passe par cette évaluation avant acceptation.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'suggestion', label: 'Suggestion de l\'agent', sublabel: '« Utilisez des microservices »', shape: 'pill' },
          { id: 'fit', label: 'Correspond aux besoins ?', sublabel: 'Résout-il le vrai problème ?', shape: 'diamond' },
          { id: 'constraints', label: 'Contraintes respectées ?', sublabel: 'Taille d\'équipe, calendrier, budget ops', shape: 'diamond' },
          { id: 'simpler', label: 'Alternative plus simple ?', sublabel: 'Pourrait-on faire moins et quand même gagner ?', shape: 'diamond' },
          { id: 'accept', label: 'Accepter', shape: 'rounded', highlight: true },
          { id: 'modify', label: 'Modifier', sublabel: 'Prendre le noyau, simplifier', shape: 'rounded' },
          { id: 'reject', label: 'Rejeter', sublabel: 'Trop complexe pour le contexte', shape: 'rounded' },
        ],
        edges: [
          { from: 'suggestion', to: 'fit' },
          { from: 'fit', to: 'constraints', label: 'oui' },
          { from: 'fit', to: 'reject', label: 'non' },
          { from: 'constraints', to: 'simpler', label: 'oui' },
          { from: 'constraints', to: 'modify', label: 'partiellement' },
          { from: 'simpler', to: 'accept', label: 'pas plus simple' },
          { from: 'simpler', to: 'modify', label: 'plus simple existe' },
        ],
      },
    },
    {
      type: 'info',
      title: 'Question 1 : Est-ce que ça correspond aux besoins réels ?',
      body: "Pas les besoins futurs imaginés. Pas les besoins « et si on scale à 10M d'utilisateurs ». Les besoins réels, actuels, prouvés. Un agent suggère l'event sourcing parce que « vous pourriez vouloir une piste d'audit plus tard. » Mais vous avez 50 utilisateurs et aucune exigence d'audit. La suggestion est techniquement valide mais ne correspond pas à ce dont vous avez réellement besoin aujourd'hui. Architecturez pour les besoins actuels avec des points d'extension pour demain — pas une architecture pour des lendemains imaginés.",
    },
    {
      type: 'info',
      title: 'Question 2 : Les contraintes sont-elles respectées ?',
      body: "Vos contraintes sont réelles et non négociables. Une équipe de 2 ne peut pas opérer 8 microservices. Une startup avec 3 mois de runway ne peut pas passer 6 semaines sur l'infrastructure. Un développeur solo ne peut pas maintenir un cluster Kubernetes. Quand l'agent suggère une architecture, vérifiez-la contre : taille d'équipe, calendrier, capacité opérationnelle, budget et expertise existante. Si l'architecture nécessite des capacités que vous n'avez pas, elle est fausse — peu importe son élégance.",
    },
    {
      type: 'info',
      title: 'Question 3 : Existe-t-il une alternative plus simple ?',
      body: "C'est la question la plus importante et celle que les agents ne se posent presque jamais. Pour chaque architecture complexe suggérée, il existe généralement une plus simple qui résout 90% du problème avec 20% de la complexité. Microservices ? Peut-être un monolithe modulaire avec des coutures claires. Event sourcing ? Peut-être une table de logs en append-only. CQRS ? Peut-être des repositories séparés lecture/écriture dans le même service. L'alternative plus simple n'est peut-être pas aussi pure théoriquement, mais si elle livre plus vite et est maintenable par votre équipe, elle gagne.",
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Cadre d\'évaluation assimilé !',
    },

    // === COMMON AI ANTI-PATTERNS ===
    {
      type: 'info',
      title: 'Anti-patron IA : Sur-abstraction',
      body: "Les agents adorent les abstractions. Ils créent des interfaces pour des choses qui n'ont qu'une seule implémentation. Ils construisent des systèmes de plugins qui n'auront jamais qu'un seul plugin. Ils écrivent des fonctions factory qui produisent un seul type d'objet. Chaque abstraction ajoute de la charge cognitive, augmente le nombre de fichiers et rend la codebase plus difficile à naviguer pour le prochain agent. La règle : pas d'abstraction sans au moins 3 consommateurs prouvés. Un consommateur veut dire inline. Deux, c'est peut-être. Trois, c'est le moment d'abstraire.",
    },
    {
      type: 'code-demo',
      title: 'La sur-abstraction en action',
      body: 'L\'agent a créé 4 fichiers pour quelque chose qui devrait en être 1. Chaque couche d\'abstraction ajoute un coût de navigation pour le prochain agent.',
      language: 'typescript',
      filename: 'over-abstraction.ts',
      code: "// ❌ Agent's suggestion: \"Clean Architecture\" with 1 implementation\n// src/features/users/domain/user.entity.ts\n// src/features/users/domain/user.repository.interface.ts\n// src/features/users/infrastructure/user.repository.impl.ts\n// src/features/users/application/create-user.use-case.ts\n// src/features/users/application/create-user.use-case.interface.ts\n// src/features/users/presentation/user.controller.ts\n// src/features/users/presentation/user.dto.ts\n// src/features/users/presentation/user.mapper.ts\n// = 8 files, 1 feature, 1 implementation of each interface\n\n// ✅ What you actually need:\n// src/features/users/users.handler.ts   (HTTP + validation)\n// src/features/users/users.service.ts   (business logic + DB)\n// src/features/users/users.test.ts      (tests)\n// src/features/users/index.ts           (public API)\n// = 4 files, same feature, fully functional\n\n// The abstraction is only justified WHEN you have a second\n// implementation (e.g., switching from Postgres to DynamoDB).\n// Until then, it is pure overhead.",
    },
    {
      type: 'info',
      title: 'Anti-patron IA : Optimisation prématurée',
      body: "« Ajoutons du cache Redis pour cet endpoint. » « On devrait implémenter du connection pooling pour la base de données. » « Cette liste devrait être virtualisée pour la performance. » Tout ça est potentiellement valide — mais pas avant d'avoir la preuve d'un problème de performance. Les agents suggèrent des optimisations parce qu'ils les ont vues dans leurs données d'entraînement associées au « bon » code. Mais l'optimisation prématurée ajoute de la complexité, augmente le fardeau opérationnel et optimise souvent la mauvaise chose. Demandez : « Quelle preuve avons-nous que c'est lent ? » Pas de preuve = pas d'optimisation.",
    },
    {
      type: 'info',
      title: 'Anti-patron IA : Cargo-culting de patrons',
      body: "L'agent suggère des patrons parce qu'il les a vus associés au code « production » ou « entreprise » — pas parce qu'ils résolvent un problème spécifique dans votre système. GraphQL quand vous avez 3 endpoints et un seul client. Kubernetes quand vous déployez deux fois par mois. Une file de messages quand vous traitez 10 événements par heure. Ces patrons résolvent de vrais problèmes à une vraie échelle — mais les appliquer sans cette échelle, c'est du cargo-culting. Le patron devient le fardeau qu'il était censé soulager.",
    },
    {
      type: 'multiple-choice',
      question: 'Un agent suggère d\'implémenter CQRS (modèles lecture/écriture séparés) pour votre plateforme de blogue qui a 100 utilisateurs actifs quotidiens et des opérations CRUD standards. Quelle est votre évaluation ?',
      options: [
        'Accepter — le CQRS est une bonne pratique pour les systèmes évolutifs',
        'Rejeter — le CQRS résout des conflits de mise à l\'échelle lecture/écriture qui n\'existent pas à cette échelle. Une couche service standard gère ça trivialement.',
        'Modifier — implémenter une version simplifiée du CQRS',
        'Accepter mais reporter — l\'implémenter maintenant pour être prêt quand on scale',
      ],
      correctIndex: 1,
      explanation: 'Le CQRS ajoute une complexité significative (modèles séparés, problèmes de cohérence éventuelle, infrastructure additionnelle). Il résout un vrai problème : quand les lectures et les écritures ont des besoins de mise à l\'échelle fondamentalement différents ou des formes de données différentes. Un blogue de 100 utilisateurs n\'a ni l\'un ni l\'autre. Une couche service standard avec un modèle de données unique est plus simple, maintenable et suffisante. Rejetez et expliquez pourquoi à l\'agent.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Anti-patrons IA identifiés !',
    },

    // === BUILDING A REVIEW CHECKLIST ===
    {
      type: 'info',
      title: 'La liste de vérification de revue systématique',
      body: "N'évaluez pas les suggestions d'architecture sur des impressions. Utilisez une liste de vérification — la même à chaque fois. Ça vous donne de la constance et empêche la confiance de l'agent de surpasser votre jugement. Un agent confiant n'est pas un agent correct. Votre liste évalue : adéquation problème-solution, conformité aux contraintes, simplicité, coût opérationnel, capacité de l'équipe et réversibilité. Notez chaque dimension. Si plus de 2 dimensions ont un score faible, la suggestion a besoin de modification ou de rejet.",
    },
    {
      type: 'code-demo',
      title: 'Liste de vérification de revue d\'architecture',
      body: 'Utilisez ce template pour évaluer chaque suggestion architecturale significative d\'un agent. Notez chaque critère.',
      language: 'markdown',
      filename: 'arch-review-template.md',
      code: "# Architecture Review: [Agent Suggestion]\n\n## Problem-Solution Fit (1-5)\n- What specific problem does this solve?\n- Do we actually HAVE this problem today?\n- Is the problem proven (measured) or imagined (speculated)?\n- Score: ___\n\n## Constraint Compliance (1-5)\n- Team size can maintain this? (currently: ___ engineers)\n- Fits timeline? (deadline: ___)\n- Operational capacity exists? (monitoring, on-call, deploys)\n- Budget allows? (infrastructure cost estimate: $___/mo)\n- Score: ___\n\n## Simplicity (1-5)\n- Is there a simpler alternative that solves 90%?\n- How many new concepts does this introduce?\n- Can a new team member understand this in < 1 hour?\n- Score: ___\n\n## Operational Cost (1-5)\n- What new infrastructure is needed?\n- What new failure modes are introduced?\n- What monitoring/alerting is required?\n- Score: ___\n\n## Reversibility (1-5)\n- If this is wrong, how hard is it to undo?\n- Can we migrate incrementally or is it all-or-nothing?\n- Score: ___\n\n## Verdict: Accept / Modify / Reject\n## If Modify: what simplification?",
    },
    {
      type: 'multiple-choice',
      question: 'Un agent suggère d\'ajouter une file de messages (RabbitMQ) pour gérer les notifications par courriel dans votre app qui envoie environ 50 courriels/jour. Scores : Adéquation : 2, Conformité aux contraintes : 3, Simplicité : 2, Coût opérationnel : 2, Réversibilité : 3. Quel est votre verdict ?',
      options: [
        'Accepter — les files de messages sont un standard de l\'industrie pour le traitement asynchrone',
        'Modifier — utiliser une approche asynchrone plus simple (par ex., une table de tâches en arrière-plan avec un worker cron)',
        'Rejeter — 50 courriels/jour peuvent être envoyés de façon synchrone dans le handler de requête',
        'Reporter — l\'ajouter quand le volume de courriels augmente',
      ],
      correctIndex: 2,
      explanation: 'À 50 courriels/jour (environ 2 par heure), le volume ne justifie AUCUN traitement asynchrone. Envoyer de façon synchrone dans le handler ajoute <500ms par requête et zéro complexité opérationnelle. Les scores (2/5 en adéquation, 2/5 en simplicité, 2/5 en coût ops) indiquent clairement le rejet. L\'agent résout un problème de mise à l\'échelle qui n\'existe pas.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Liste de vérification de revue construite !',
    },

    // === OVERRIDE SCENARIOS ===
    {
      type: 'info',
      title: 'Quand surcharger l\'agent',
      body: "Faites confiance à l'agent pour les détails d'implémentation — structure de fonction, nommage de variable, choix d'algorithme pour des problèmes bien définis. Surpassez l'agent sur les décisions stratégiques — patrons d'architecture, choix technologiques, décisions de portée et tout ce qui implique du contexte organisationnel. L'agent ne connaît pas : les forces de votre équipe, votre processus de déploiement, votre rotation d'astreinte, vos priorités de dette technique ou votre feuille de route produit. Ce sont exactement les entrées qui déterminent si une architecture est correcte. Sans elles, l'agent devine — avec confiance.",
    },
    {
      type: 'info',
      title: 'Scénario de surcharge : l\'agent veut séparer le service',
      body: "Agent : « Ce service gère à la fois la gestion des utilisateurs et l'authentification. Ceux-ci devraient être des microservices séparés pour la séparation des préoccupations. » VOTRE évaluation : L'équipe est de 2 ingénieurs. Séparer signifie déployer, surveiller et maintenir 2 services. La « séparation des préoccupations » existe déjà au niveau du module — répertoires séparés, tests séparés, interface claire entre eux. Le seul bénéfice de séparer en services est la mise à l'échelle indépendante, ce qui est non pertinent à la charge actuelle. Surcharge : garder comme monolithe modulaire. La frontière de module vous donne la séparation des préoccupations. La frontière de service vous donne un surcoût opérationnel pour zéro bénéfice.",
    },
    {
      type: 'info',
      title: 'Scénario de surcharge : l\'agent rejette la simplicité',
      body: "Agent : « Utiliser un fichier JSON pour la configuration n'est pas production-ready. On devrait utiliser un service de configuration propre avec des surcharges par environnement, du chiffrement pour les secrets et du hot-reload. » VOTRE évaluation : L'app a 5 valeurs de config. Elle déploie une fois par semaine. Les secrets sont déjà dans les variables d'environnement. Le fichier JSON se lit au démarrage et ne change jamais. La solution « propre » ajoute une dépendance de service de config, de la complexité de chiffrement et de la logique de hot-reload pour 5 valeurs qui changent annuellement. Surcharge : garder le fichier JSON. Réévaluer quand vous avez 50+ valeurs de config ou besoin de hot-reload.",
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent suggère le mode strict TypeScript avec no-explicit-any pour un prototype rapide qui doit livrer en 3 jours. Vous êtes le seul développeur. Quelle est votre évaluation ?',
      options: [
        'Accepter — les types stricts préviennent les bugs indépendamment du calendrier',
        'C\'est un appel de jugement — le mode strict est idéal mais `any` comme soupape de sécurité pour les prototypes de 3 jours est un compromis raisonnable selon que ce prototype pourrait devenir du code de production',
        'Rejeter — les prototypes ne devraient jamais utiliser TypeScript',
        'Accepter et ajouter des règles de linting de types supplémentaires pour la sécurité',
      ],
      correctIndex: 1,
      explanation: 'C\'est un véritable appel de jugement qui dépend du contexte que l\'agent n\'a pas. Si ce prototype sera jeté, le mode strict ajoute de la friction pour zéro bénéfice. S\'il pourrait évoluer en code de production, le mode strict prévient de la douleur future. L\'agent ne peut pas faire cet appel — VOUS savez si ce prototype a des jambes. C\'est exactement le genre de décision stratégique où votre jugement surpasse celui de l\'agent.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Jugement de surcharge développé !',
    },

    // === PRACTICAL APPLICATION ===
    {
      type: 'order',
      instruction: 'Ordonnez ces critères de revue d\'architecture par priorité (évaluer en premier puis en dernier) :',
      items: [
        'Réversibilité — peut-on annuler si c\'est faux ?',
        'Adéquation problème-solution — est-ce que ça résout un problème réel et mesuré ?',
        'Simplicité — existe-t-il une alternative plus simple ?',
        'Coût opérationnel — quelle nouvelle infrastructure et surveillance est nécessaire ?',
        'Conformité aux contraintes — est-ce que ça convient à la taille de l\'équipe, au calendrier et au budget ?',
      ],
      correctOrder: [1, 4, 2, 3, 0],
    },
    {
      type: 'info',
      title: 'Communiquer les surcharges aux agents',
      body: "Quand vous surpassez la suggestion d'un agent, ne dites pas juste « non. » Expliquez POURQUOI en termes que l'agent peut utiliser pour de futures décisions. « N'utilisez pas de microservices parce que notre équipe de 2 ne peut pas maintenir des déploiements multiples. Utilisez un monolithe modulaire à la place. » Ça enseigne à l'agent vos contraintes. Dans CLAUDE.md, codifiez les surcharges récurrentes comme des contraintes : « L'architecture doit être opérationnellement gérable par une équipe de 2. » Ça empêche l'agent de faire la même suggestion à répétition.",
    },

    // === SYNTHESIS ===
    {
      type: 'info',
      title: 'L\'état d\'esprit d\'évaluateur',
      body: "Votre valeur n'est plus dans l'écriture de code ni même dans la conception de systèmes à partir de zéro. Elle est dans l'ÉVALUATION de systèmes proposés face à la réalité. L'agent génère des options. Vous les évaluez contre des contraintes que l'agent ne peut pas voir. C'est une compétence différente de la construction — c'est du jugement, pas de l'artisanat. Ça nécessite de comprendre à la fois les compromis techniques ET le contexte organisationnel. Entraînez cette compétence délibérément : pour chaque suggestion d'agent, exécutez la liste de vérification. Avec le temps, l'évaluation devient instantanée — vous développez une intuition architecturale qui opère plus vite que toute liste de vérification.",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification d\'évaluation d\'architecture :',
      items: [
        'J\'ai un cadre systématique pour évaluer les suggestions d\'agents (pas juste des impressions)',
        'Je peux identifier la sur-abstraction, l\'optimisation prématurée et le cargo-culting',
        'J\'évalue contre des contraintes réelles : taille d\'équipe, calendrier, capacité opérationnelle',
        'Je demande toujours : existe-t-il une alternative plus simple ?',
        'Je sais quand faire confiance à l\'agent (implémentation) vs surcharger (stratégie)',
        'Je communique les surcharges avec des raisons et les codifie dans CLAUDE.md',
        'Je note les suggestions sur 5 dimensions avant d\'accepter, modifier ou rejeter',
      ],
    },
    {
      type: 'checkpoint',
      xp: 19,
      message: 'Maîtrise de l\'évaluation d\'architecture atteinte ! Vous pouvez maintenant évaluer et surcharger systématiquement les décisions d\'architecture générées par l\'IA.',
    },
  ],
}

export default content
