import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '1-5',
  steps: [
    // === INTRO ===
    {
      type: 'info',
      title: 'Des prompts vagues produisent du code vague',
      body: "Tu as appris comment les modèles traitent le texte et gèrent le contexte. Maintenant vient la discipline qui sépare les sessions d'agent productives des sessions frustrantes : écrire une spec avant de construire. Le Principe 2 de la direction d'agents IA est simple — spec avant de construire. Une spec est un court document qui dit à l'agent exactement quoi construire, quelles contraintes suivre, et comment savoir quand c'est terminé. Sans spec, tu paries que l'agent interprète correctement ton intention.",
    },
    {
      type: 'info',
      title: 'Le coût de sauter la spec',
      body: "Sans spec, une session d'agent typique ressemble à ça : tu demandes une fonctionnalité, l'agent construit quelque chose de proche mais pas tout à fait, tu corriges, il surcorrige, tu recorriges, et trente minutes plus tard tu as brûlé la moitié de ta fenêtre de contexte en révisions. La spec élimine la majeure partie de ce ping-pong. Quinze minutes d'écriture économisent une heure de débogage.",
    },

    // === WHAT A SPEC IS NOT ===
    {
      type: 'info',
      title: 'Ce qu\'une spec n\'est PAS',
      body: "Une spec n'est pas un roman. Ce n'est pas un document d'exigences produit avec une analyse des parties prenantes et une étude de marché. Ce n'est pas un PRD de 20 pages. Ces documents sont écrits pour des humains qui ont besoin de contexte organisationnel. Ton agent n'a pas besoin de savoir pourquoi l'entreprise veut cette fonctionnalité. Il a besoin de savoir exactement quoi construire, quelles entrées il reçoit, quelles sorties il produit, et quand s'arrêter.",
    },
    {
      type: 'multiple-choice',
      question: 'Lequel de ces éléments appartient à une spec pour un agent IA ?',
      options: [
        'Étude de marché sur les produits concurrents',
        'Critères d\'acceptation que l\'agent peut vérifier',
        'Un historique de l\'évolution de la codebase',
        'Exigences de validation des parties prenantes',
      ],
      correctIndex: 1,
      explanation: 'Les agents ont besoin de critères concrets et vérifiables — pas de contexte business. Les critères d\'acceptation donnent à l\'agent une check-list claire pour valider sa propre sortie, ce qui prévient exactement la dérive de périmètre et les exigences manquées.',
    },

    // === WHAT A SPEC IS ===
    {
      type: 'info',
      title: 'Ce qu\'une spec EST',
      body: "Une spec est un court document — typiquement 20 à 60 lignes de markdown — avec cinq sections : Titre, Objectif (une phrase), Entrées, Sorties, Contraintes et Critères d'acceptation. C'est tout. Chaque section est concrète et spécifique. L'objectif tient en une phrase. Les entrées listent exactement quelles données la fonctionnalité reçoit. Les sorties décrivent exactement ce que la fonctionnalité produit. Les contraintes sont les garde-fous. Les critères d'acceptation sont la check-list qui détermine terminé vs pas terminé.",
    },

    // === DIAGRAM 2: ANATOMY OF A SPEC ===
    {
      type: 'diagram',
      title: 'Anatomie d\'une spec',
      body: 'Une spec a une hiérarchie claire. Le document de spec se décompose en trois préoccupations parallèles — entrées, sorties et contraintes — qui ensemble définissent les critères d\'acceptation.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'spec', label: 'Doc de spec', sublabel: 'Titre + Objectif', shape: 'rounded', highlight: true },
          { id: 'inputs', label: 'Entrées', sublabel: 'Ce qui entre' },
          { id: 'outputs', label: 'Sorties', sublabel: 'Ce qui sort' },
          { id: 'constraints', label: 'Contraintes', sublabel: 'Garde-fous' },
          { id: 'criteria', label: 'Acceptation', sublabel: 'Définition de terminé', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'inputs' },
          { from: 'spec', to: 'outputs' },
          { from: 'spec', to: 'constraints' },
          { from: 'inputs', to: 'criteria' },
          { from: 'outputs', to: 'criteria' },
          { from: 'constraints', to: 'criteria' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Structure de spec comprise !',
    },

    // === THE TEMPLATE ===
    {
      type: 'code-demo',
      title: 'Le template de spec',
      body: 'Voici le template que tu utiliseras pour chaque fonctionnalité que tu diriges un agent à construire. Copie cette structure et remplis les blancs. Remarque comment chaque section est concrète — aucune place pour l\'interprétation.',
      language: 'markdown',
      filename: 'spec-template.md',
      code: '# Feature: [Title]\n\n## Goal\n[One sentence describing what this feature does.]\n\n## Inputs\n- [What data does this feature receive?]\n- [What format? What types?]\n- [Where does the data come from?]\n\n## Outputs\n- [What does this feature produce?]\n- [What format? What types?]\n- [Where does the output go?]\n\n## Constraints\n- [Technology restrictions]\n- [Performance requirements]\n- [What this feature must NOT do]\n- [Dependencies or compatibility rules]\n\n## Acceptance Criteria\n- [ ] [Criterion 1 -- specific and verifiable]\n- [ ] [Criterion 2 -- specific and verifiable]\n- [ ] [Criterion 3 -- specific and verifiable]',
    },

    // === REAL EXAMPLE ===
    {
      type: 'info',
      title: 'Exemple : page de paramètres utilisateur',
      body: "Parcourons une spec réelle. Tu veux qu'un agent construise une page de paramètres utilisateur. Sans spec, tu pourrais dire « construis-moi une page de paramètres » et obtenir une page avec des champs aléatoires, aucune validation, et des données sauvegardées on ne sait où. Avec une spec, tu définis exactement quels champs apparaissent, quelles règles de validation s'appliquent, et où les données persistent.",
    },
    {
      type: 'code-demo',
      title: 'Une vraie spec : page de paramètres utilisateur',
      body: 'Étudie cette spec attentivement. Chaque ligne supprime de l\'ambiguïté. L\'agent sait exactement quoi construire et, surtout, quoi NE PAS construire.',
      language: 'markdown',
      filename: 'specs/user-settings.md',
      code: '# Feature: User Settings Page\n\n## Goal\nLet users update their display name, email, and notification preferences.\n\n## Inputs\n- Current user profile from Supabase auth (id, email, display_name)\n- User form input: display_name (string), email (string), notify_email (bool)\n\n## Outputs\n- Updated user record in Supabase `profiles` table\n- Toast notification on success/failure\n- No page reload -- optimistic UI update\n\n## Constraints\n- React + TypeScript only, no new dependencies\n- Use existing Button, Input components from @/components/ui\n- Display name: 2-50 chars, alphanumeric + spaces only\n- Email: must pass standard email regex\n- Save to Supabase `profiles` table via existing client\n- Must NOT add password change (separate feature)\n- Must NOT add avatar upload (separate feature)\n\n## Acceptance Criteria\n- [ ] Settings page renders at /settings route\n- [ ] Form loads current values from user profile\n- [ ] Display name validates 2-50 chars\n- [ ] Email validates standard format\n- [ ] Invalid input shows inline error, submit disabled\n- [ ] Save calls Supabase update on profiles table\n- [ ] Success shows toast, updates UI without reload\n- [ ] Failure shows error toast, form retains input',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi la spec dit-elle explicitement « Must NOT add password change » et « Must NOT add avatar upload » ?',
      options: [
        'Pour gagner du temps en écrivant la spec',
        'Parce que ces fonctionnalités sont impossibles à construire',
        'Pour empêcher l\'agent d\'ajouter des fonctionnalités au-delà du périmètre',
        'Parce que le client ne les a pas demandées',
      ],
      correctIndex: 2,
      explanation: 'Les exclusions explicites empêchent la dérive de périmètre. Sans elles, un agent pourrait ajouter un formulaire de changement de mot de passe ou un téléchargement d\'avatar parce que ce sont des fonctionnalités « typiques » de paramètres. La spec contraint l\'agent à exactement ce dont tu as besoin — rien de plus.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Spec du monde réel maîtrisée !',
    },

    // === HOW SPECS PREVENT SCOPE CREEP ===
    {
      type: 'info',
      title: 'Comment les specs empêchent la dérive de périmètre',
      body: "Sans contraintes, les agents sont empressés d'aider. Ils vont ajouter des error boundaries que tu n'as pas demandés, créer des fonctions utilitaires « au cas où », ajouter des états d'UI supplémentaires, et refactoriser du code adjacent pour être « cohérent ». Chaque ajout semble raisonnable isolément, mais ensemble ils gonflent la sortie, introduisent du code non testé et rendent la revue plus difficile. Une spec avec des critères d'acceptation clairs donne à l'agent une condition d'arrêt. Quand tous les critères sont cochés, le travail est terminé.",
    },

    // === DIAGRAM 1: SPEC-DRIVEN WORKFLOW ===
    {
      type: 'diagram',
      title: 'Workflow piloté par la spec',
      body: 'La spec se situe au début d\'une boucle itérative. Si la sortie ne correspond pas, tu affines la spec — pas le code. Ça garde la source de vérité dans le document, pas dans des corrections de prompt éparpillées.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'write', label: 'Écrire la spec', shape: 'rounded', highlight: true },
          { id: 'build', label: 'L\'agent construit' },
          { id: 'review', label: 'Réviser la sortie' },
          { id: 'match', label: 'Correspond ?', shape: 'diamond' },
          { id: 'ship', label: 'Livrer', shape: 'pill', highlight: true },
          { id: 'refine', label: 'Affiner la spec' },
        ],
        edges: [
          { from: 'write', to: 'build' },
          { from: 'build', to: 'review' },
          { from: 'review', to: 'match' },
          { from: 'match', to: 'ship', label: 'Oui' },
          { from: 'match', to: 'refine', label: 'Non', dashed: true },
          { from: 'refine', to: 'build', dashed: true },
        ],
      },
    },
    {
      type: 'info',
      title: 'Affiner la spec, pas le code',
      body: "Quand la sortie de l'agent ne correspond pas à tes attentes, résiste à l'envie de modifier manuellement le code ou d'empiler des prompts de suivi. À la place, mets à jour la spec. Ajoute la contrainte manquante. Clarifie la sortie ambiguë. Puis redonne la spec mise à jour à l'agent. Ça maintient une seule source de vérité et évite la spirale de corrections successives qui mange le contexte.",
    },

    // === REVIEWING AGAINST A SPEC ===
    {
      type: 'info',
      title: 'Comment réviser la sortie d\'un agent',
      body: "Ne révise pas la sortie d'un agent en demandant « est-ce que ça a l'air bien ? ». Révise-la en parcourant chaque critère d'acceptation et en le cochant. C'est binaire — chaque critère passe ou échoue. Il n'y a pas de « presque bon ». Si un critère échoue, la sortie n'est pas terminée. Cette discipline t'empêche d'accepter du code qui marche dans le happy path mais rate les cas limites.",
    },
    {
      type: 'order',
      instruction: 'Ordonne ces étapes de révision de la première à la dernière :',
      items: [
        'Ouvrir la check-list des critères d\'acceptation',
        'Tester chaque critère individuellement',
        'Marquer passe/échoue pour chaque critère',
        'Si un critère échoue, mettre à jour la spec avec une clarification',
        'Redonner la spec mise à jour à l\'agent',
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },

    // === PRACTICE: WRITE A SPEC ===
    {
      type: 'info',
      title: 'Pratique : écris ta propre spec',
      body: "C'est l'heure de pratiquer. Tu vas écrire une spec pour une fonctionnalité simple : un toggle de mode sombre. Ce toggle devrait basculer le site entre les thèmes clair et sombre. Réfléchis aux entrées qu'il reçoit, aux sorties qu'il produit, aux contraintes qui s'appliquent, et aux critères d'acceptation que tu vérifierais.",
    },
    {
      type: 'code-input',
      instruction: 'La section Objectif d\'une spec doit faire exactement une phrase. Écris un objectif pour une fonctionnalité de toggle de mode sombre :',
      placeholder: 'Allow users to...',
      answer: 'Allow users to switch between light and dark themes with a toggle button in the header',
      hint: 'Une phrase : qui peut faire quoi, où',
    },
    {
      type: 'multiple-choice',
      question: 'Quel est le meilleur critère d\'acceptation pour un toggle de mode sombre ?',
      options: [
        'Le toggle est joli',
        'Cliquer sur le toggle met à jour le thème',
        'Cliquer sur le toggle ajoute/supprime la classe "dark" sur l\'élément html et persiste le choix dans localStorage',
        'Le mode sombre fonctionne',
      ],
      correctIndex: 2,
      explanation: 'Les bons critères d\'acceptation sont spécifiques et vérifiables. « Est joli » et « fonctionne » sont subjectifs. La bonne réponse spécifie exactement ce qui se passe (changement de classe), où (élément html), et ce qui persiste (localStorage). Un agent peut vérifier tout ça de façon programmatique.',
    },

    // === EVALUATE SAMPLE OUTPUT ===
    {
      type: 'info',
      title: 'Évaluer la sortie d\'un agent par rapport à une spec',
      body: "Pratiquons la révision. Imagine que tu as donné la spec du mode sombre à un agent et qu'il a retourné du code qui bascule le thème mais ne persiste pas dans localStorage, et il a aussi ajouté un sélecteur de couleur pour des couleurs d'accent personnalisées. Comment évalues-tu ça ? Parcours les critères d'acceptation : toggle fonctionne (passe), persiste dans localStorage (échoue), seulement un toggle clair/sombre sans extras (échoue — dérive de périmètre). Deux échecs signifient que cette sortie n'est pas terminée.",
    },
    {
      type: 'checklist',
      title: 'Check-list de révision de spec pour la sortie du mode sombre :',
      items: [
        'Le bouton toggle s\'affiche dans le header',
        'Cliquer sur le toggle bascule entre clair et sombre',
        'Le choix de thème persiste dans localStorage',
        'La page se charge avec le thème persisté (pas de flash)',
        'Aucune fonctionnalité supplémentaire ajoutée (sélecteur de couleur = dérive de périmètre)',
        'Utilise uniquement les composants UI existants (pas de nouvelles dépendances)',
      ],
    },

    // === TERMINAL PRACTICE ===
    {
      type: 'terminal',
      instruction: 'Crée un fichier de spec pour une fonctionnalité en utilisant Claude Code. Tape cette commande pour commencer :',
      expectedCommand: 'claude "Write a spec in markdown for a search bar component. Include: Goal, Inputs, Outputs, Constraints, and Acceptance Criteria. Save to specs/search-bar.md"',
      hint: 'Utilise claude pour générer un fichier de spec avec les cinq sections',
    },

    // === FINAL SYNTHESIS ===
    {
      type: 'checklist',
      title: 'Habitudes d\'écriture de spec à adopter :',
      items: [
        'Écrire la spec AVANT de prompter l\'agent pour construire',
        'Garder l\'objectif à une seule phrase',
        'Lister les entrées avec types et sources',
        'Lister les sorties avec types et destinations',
        'Ajouter des exclusions explicites pour empêcher la dérive de périmètre',
        'Écrire des critères d\'acceptation binaires passe/échoue',
        'Réviser la sortie en vérifiant les critères, pas au feeling',
        'Quand la sortie échoue, mettre à jour la spec d\'abord, pas le code',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Écriture de spec débloquée ! Tu peux maintenant contraindre la sortie d\'un agent avec des specs claires.',
    },

    // === FINAL QUIZ ===
    {
      type: 'multiple-choice',
      question: 'Un agent construit une fonctionnalité qui marche parfaitement mais inclut deux fonctions helper supplémentaires que tu n\'as pas demandées. Selon le développement piloté par la spec, que devrais-tu faire ?',
      options: [
        'Les garder — du code en plus est un bonus',
        'Supprimer les helpers manuellement',
        'Ajouter « Must NOT create helper functions beyond those specified » à la section Contraintes et relancer',
        'Ignorer et passer à autre chose',
      ],
      correctIndex: 2,
      explanation: 'Le développement piloté par la spec signifie que la spec est la source de vérité. Si l\'agent a ajouté du code au-delà de la spec, la solution est de mettre à jour la spec avec une contrainte explicite et de relancer. Ça t\'apprend à écrire de meilleures specs et empêche la même dérive de périmètre la prochaine fois.',
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Leçon terminée ! Tu écris maintenant des specs qui contraignent la sortie d\'un agent et tu révises comme un pro.',
    },
  ],
}

export default content
