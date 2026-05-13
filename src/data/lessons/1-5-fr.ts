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
      type: 'multiple-choice',
      question: 'De quoi un agent IA n\'a-t-il PAS besoin dans une spec ?',
      options: [
        'Des critères d\'acceptation qu\'il peut vérifier',
        'Des entrées et sorties spécifiques',
        'Du contexte business sur pourquoi les parties prenantes veulent la fonctionnalité',
        'Des contraintes claires sur ce qu\'il ne faut pas construire',
      ],
      correctIndex: 2,
      explanation: 'Une spec n\'est pas un document d\'exigences produit avec une analyse des parties prenantes et une étude de marché. Ton agent n\'a pas besoin de savoir pourquoi l\'entreprise veut cette fonctionnalité. Il a besoin de savoir exactement quoi construire, quelles entrées il reçoit, quelles sorties il produit, et quand s\'arrêter.',
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
      type: 'multiple-choice',
      question: 'Combien de sections a une bonne spec d\'agent, et lesquelles ?',
      options: [
        '3 sections : Titre, Description, Exemples de code',
        '5 sections : Titre/Objectif, Entrées, Sorties, Contraintes, Critères d\'acceptation',
        '2 sections : Exigences et Calendrier',
        '7 sections : Résumé exécutif, Contexte, Exigences, Design, Calendrier, Budget, Annexe',
      ],
      correctIndex: 1,
      explanation: 'Une spec est un court document — typiquement 20 à 60 lignes de markdown — avec cinq sections : Titre, Objectif (une phrase), Entrées, Sorties, Contraintes et Critères d\'acceptation. Chaque section est concrète et spécifique. L\'objectif tient en une phrase. Les contraintes sont les garde-fous. Les critères d\'acceptation déterminent terminé vs pas terminé.',
    },

    // === DIAGRAM 2: ANATOMY OF A SPEC ===
    {
      type: 'interactive-diagram',
      title: 'Anatomie d\'une spec',
      body: 'Clique sur chaque couche pour comprendre comment une spec se décompose en préoccupations parallèles qui ensemble définissent les critères d\'acceptation.',
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
      stages: [
        {
          highlightNodes: ['spec'],
          highlightEdges: [],
          explanation: 'Commence par le Titre et l\'Objectif. L\'objectif tient en exactement une phrase décrivant ce que cette fonctionnalité fait. Si tu ne peux pas le dire en une phrase, le périmètre est trop large — décompose.',
        },
        {
          highlightNodes: ['spec', 'inputs', 'outputs', 'constraints'],
          highlightEdges: [{ from: 'spec', to: 'inputs' }, { from: 'spec', to: 'outputs' }, { from: 'spec', to: 'constraints' }],
          explanation: 'La spec se décompose en trois préoccupations parallèles : Entrées (quelles données arrivent, quel format, quels types), Sorties (ce que la fonctionnalité produit et où ça va), et Contraintes (restrictions techniques, ce qu\'il NE faut PAS construire).',
        },
        {
          highlightNodes: ['inputs', 'outputs', 'constraints', 'criteria'],
          highlightEdges: [{ from: 'inputs', to: 'criteria' }, { from: 'outputs', to: 'criteria' }, { from: 'constraints', to: 'criteria' }],
          explanation: 'Les trois préoccupations convergent vers les Critères d\'acceptation : la check-list binaire passe/échoue qui détermine quand le travail est terminé. Chaque critère doit être assez spécifique pour être testé immédiatement. « Ça marche » n\'est pas un critère. « Le formulaire valide le format email et affiche une erreur en ligne » en est un.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Structure de spec comprise !',
    },

    // === THE TEMPLATE ===
    {
      type: 'code-fill',
      instruction: 'Complète le template de spec en remplissant les en-têtes de section. C\'est la structure que tu utiliseras pour chaque fonctionnalité que tu diriges un agent à construire.',
      language: 'markdown',
      filename: 'spec-template.md',
      template: '# Feature: [Title]\n\n## {{section_1}}\n[One sentence describing what this feature does.]\n\n## Inputs\n- [What data does this feature receive?]\n- [What format? What types?]\n\n## {{section_2}}\n- [What does this feature produce?]\n- [Where does the output go?]\n\n## Constraints\n- [Technology restrictions]\n- [What this feature must NOT do]\n\n## {{section_3}}\n- [ ] [Criterion 1 -- specific and verifiable]\n- [ ] [Criterion 2 -- specific and verifiable]\n- [ ] [Criterion 3 -- specific and verifiable]',
      blanks: [
        { id: 'section_1', answer: 'Goal', alternatives: ['goal', 'Objective', 'objective', 'Objectif', 'objectif'], placeholder: '______', hint: 'Une phrase décrivant le but' },
        { id: 'section_2', answer: 'Outputs', alternatives: ['outputs', 'Output', 'output', 'Sorties', 'sorties'], placeholder: '______', hint: 'Ce que la fonctionnalité produit' },
        { id: 'section_3', answer: 'Acceptance Criteria', alternatives: ['acceptance criteria', 'Acceptance criteria', 'Definition of Done', 'Critères d\'acceptation'], placeholder: '______', hint: 'La check-list binaire passe/échoue' },
      ],
      explanation: 'Les cinq sections sont : Objectif (une phrase), Entrées (ce qui entre), Sorties (ce qui sort), Contraintes (garde-fous), et Critères d\'acceptation (définition de terminé). Chaque section est concrète — aucune place pour l\'interprétation.',
    },

    // === COMPARE: VAGUE VS SPECIFIC ===
    {
      type: 'compare',
      title: 'Vague vs Spécifique : trouve la différence',
      body: 'Regarde ces deux instructions pour la même fonctionnalité. L\'une laisse l\'agent deviner. L\'autre supprime l\'ambiguïté.',
      question: 'Quelle instruction produira une sortie d\'agent plus fiable ?',
      correctSide: 'right',
      left: {
        label: 'Vague',
        content: 'Construis-moi une page de paramètres.\nFais que ça ait l\'air bien.\nUtilise de la tech moderne.\nAjoute les champs habituels.',
        language: 'text',
      },
      right: {
        label: 'Spécifique',
        content: 'Construis une page /settings avec 3 champs :\n- display_name (string, 2-50 chars)\n- email (format email valide)\n- notify_email (toggle boolean)\n\nSauvegarde dans la table Supabase profiles.\nUtilise les Button/Input existants de @/components/ui.\nNe PAS ajouter mot de passe ou avatar.',
        language: 'text',
      },
      explanation: 'La version spécifique contraint chaque point de décision : quels champs, quelle validation, où sauvegarder, quels composants utiliser, et quoi NE PAS construire. La version vague force l\'agent à deviner sur tous ces points, menant à une sortie qui correspond rarement à ton intention.',
    },

    // === REAL EXAMPLE ===
    {
      type: 'multiple-choice',
      question: 'Tu demandes à un agent de « construis-moi une page de paramètres » sans spec. Quel est le résultat le plus probable ?',
      options: [
        'Une page de paramètres parfaitement adaptée du premier coup',
        'Une page avec des champs aléatoires, aucune validation, et des données sauvegardées on ne sait où',
        'Un message d\'erreur disant que l\'agent a besoin de plus d\'informations',
        'L\'agent te demandera une spec avant de commencer',
      ],
      correctIndex: 1,
      explanation: 'Sans spec, l\'agent devine sur chaque décision : quels champs montrer, quelle validation appliquer, où sauvegarder les données. Tu pourrais obtenir une page qui « marche » mais avec des champs aléatoires, aucune validation, et des données sauvegardées on ne sait où. Une spec élimine toutes ces devinettes.',
    },
    {
      type: 'code-fill',
      instruction: 'Étudie cette vraie spec et remplis les contraintes clés. Chaque ligne supprime de l\'ambiguïté. L\'agent sait exactement quoi construire et, surtout, quoi NE PAS construire.',
      language: 'markdown',
      filename: 'specs/user-settings.md',
      template: '# Feature: User Settings Page\n\n## Goal\nLet users update their display name, email, and notification preferences.\n\n## Inputs\n- Current user profile from Supabase auth (id, email, display_name)\n- User form input: display_name (string), email (string), notify_email (bool)\n\n## Outputs\n- Updated user record in Supabase `{{output_table}}` table\n- Toast notification on success/failure\n- No page reload -- optimistic UI update\n\n## Constraints\n- React + TypeScript only, no new dependencies\n- Display name: {{name_validation}} chars, alphanumeric + spaces only\n- Must NOT add {{exclusion_1}} (separate feature)\n- Must NOT add avatar upload (separate feature)\n\n## Acceptance Criteria\n- [ ] Settings page renders at /settings route\n- [ ] Form loads current values from user profile\n- [ ] Invalid input shows inline error, submit disabled',
      blanks: [
        { id: 'output_table', answer: 'profiles', alternatives: ['profile', 'users'], placeholder: '______', hint: 'La table Supabase qui stocke les données utilisateur' },
        { id: 'name_validation', answer: '2-50', alternatives: ['2 to 50', '2–50'], placeholder: '____', hint: 'Longueur min et max de caractères pour le nom d\'affichage' },
        { id: 'exclusion_1', answer: 'password change', alternatives: ['password', 'password reset', 'change password'], placeholder: '______', hint: 'Une fonctionnalité de paramètres courante qui devrait être une fonctionnalité séparée' },
      ],
      explanation: 'Chaque ligne de cette spec supprime une décision que l\'agent prendrait autrement de son propre chef. Les exclusions explicites (« Must NOT add password change ») empêchent la dérive de périmètre. Les règles de validation (« 2-50 chars ») empêchent les devinettes. Le nom de la table dit à l\'agent exactement où vont les données.',
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
      type: 'multiple-choice',
      question: 'Sans contraintes dans une spec, les agents ont tendance à :',
      options: [
        'Produire une sortie minimale et incomplète',
        'Ajouter des fonctionnalités, des fonctions utilitaires et des refactorings supplémentaires non demandés',
        'Refuser de démarrer tant qu\'ils n\'ont pas plus de détails',
        'Produire exactement ce que tu as demandé, rien de plus',
      ],
      correctIndex: 1,
      explanation: 'Sans contraintes, les agents sont empressés d\'aider. Ils vont ajouter des error boundaries que tu n\'as pas demandés, créer des fonctions utilitaires « au cas où », ajouter des états d\'UI supplémentaires, et refactoriser du code adjacent pour être « cohérent ». Chaque ajout semble raisonnable isolément, mais ensemble ils gonflent la sortie, introduisent du code non testé et rendent la revue plus difficile. Une spec avec des critères d\'acceptation donne à l\'agent une condition d\'arrêt.',
    },

    // === DIAGRAM 1: SPEC-DRIVEN WORKFLOW ===
    {
      type: 'interactive-diagram',
      title: 'Workflow piloté par la spec',
      body: 'Clique sur chaque étape de la boucle itérative. Si la sortie ne correspond pas, tu affines la spec — pas le code.',
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
      stages: [
        {
          highlightNodes: ['write', 'build'],
          highlightEdges: [{ from: 'write', to: 'build' }],
          explanation: 'Commence par écrire la spec, puis donne-la à l\'agent. La spec est ta seule source de vérité — tout ce que l\'agent a besoin de savoir est dans ce document.',
        },
        {
          highlightNodes: ['build', 'review', 'match'],
          highlightEdges: [{ from: 'build', to: 'review' }, { from: 'review', to: 'match' }],
          explanation: 'Révise la sortie en parcourant chaque critère d\'acceptation. Coche chacun comme passe ou échoue. C\'est binaire — pas de « presque bon ». Si un critère échoue, la sortie n\'est pas terminée.',
        },
        {
          highlightNodes: ['match', 'ship'],
          highlightEdges: [{ from: 'match', to: 'ship' }],
          explanation: 'Tous les critères passent ? Livre. La spec a donné à l\'agent une condition d\'arrêt claire, et tu l\'as vérifié contre cette même spec. Pas d\'ambiguïté, pas de devinette.',
        },
        {
          highlightNodes: ['match', 'refine', 'build'],
          highlightEdges: [{ from: 'match', to: 'refine' }, { from: 'refine', to: 'build' }],
          explanation: 'Des critères échouent ? Affine la spec — pas le code. Ajoute la contrainte manquante, clarifie la sortie ambiguë, puis redonne la spec mise à jour à l\'agent. Ça garde la source de vérité dans le document, pas dans des corrections de prompt éparpillées.',
        },
      ],
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a produit du code qui ne correspond pas à ta spec. Que devrais-tu faire ?',
      options: [
        'Modifier manuellement le code généré pour le corriger',
        'Envoyer un prompt de suivi avec des corrections',
        'Mettre à jour la spec avec la contrainte manquante, puis la redonner à l\'agent',
        'Accepter la sortie et passer à autre chose',
      ],
      correctIndex: 2,
      explanation: 'Quand la sortie de l\'agent ne correspond pas à tes attentes, résiste à l\'envie de modifier manuellement le code ou d\'empiler des prompts de suivi. À la place, mets à jour la spec. Ajoute la contrainte manquante. Clarifie la sortie ambiguë. Puis redonne la spec mise à jour à l\'agent. Ça maintient une seule source de vérité et évite la spirale de corrections successives qui mange le contexte.',
    },

    // === REVIEWING AGAINST A SPEC ===
    {
      type: 'multiple-choice',
      question: 'Comment devrais-tu réviser la sortie d\'un agent par rapport à une spec ?',
      options: [
        'Demander « est-ce que ça a l\'air bien ? » et faire confiance à ton instinct',
        'Parcourir chaque critère d\'acceptation et le marquer passe ou échoue — binaire, pas de « presque bon »',
        'Lancer le code une fois et si ça marche, livrer',
        'Demander à l\'agent s\'il a bien suivi la spec',
      ],
      correctIndex: 1,
      explanation: 'Ne révise pas la sortie d\'un agent en demandant « est-ce que ça a l\'air bien ? ». Révise-la en parcourant chaque critère d\'acceptation et en le cochant. C\'est binaire — chaque critère passe ou échoue. Il n\'y a pas de « presque bon ». Si un critère échoue, la sortie n\'est pas terminée. Cette discipline t\'empêche d\'accepter du code qui marche dans le happy path mais rate les cas limites.',
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
      title: 'Pratique : complète ta propre spec',
      body: "C'est l'heure de pratiquer. Tu vas compléter une spec pour une fonctionnalité simple : un toggle de mode sombre. Ce toggle devrait basculer le site entre les thèmes clair et sombre. Réfléchis aux entrées qu'il reçoit, aux sorties qu'il produit, aux contraintes qui s'appliquent, et aux critères d'acceptation que tu vérifierais.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette spec en remplissant les blancs. Chaque blanc nécessite une réponse spécifique et concrète.',
      language: 'markdown',
      filename: 'specs/dark-mode.md',
      template: '# Feature: Dark Mode Toggle\n\n## Goal\nAllow users to {{goal_action}} with a toggle button in the {{goal_location}}.\n\n## Inputs\n- Current theme from {{input_source}}\n- User click on toggle button\n\n## Outputs\n- Updated CSS class on the {{output_target}} element\n- Theme preference saved to {{output_storage}}\n\n## Constraints\n- Must NOT add {{constraint_exclusion}}\n- Use existing UI components only\n\n## Acceptance Criteria\n- [ ] Toggle renders in the header\n- [ ] Clicking switches between light and dark\n- [ ] Choice persists across {{criteria_persist}}',
      blanks: [
        { id: 'goal_action', answer: 'switch between light and dark themes', alternatives: ['toggle between light and dark themes', 'switch between light and dark mode'], placeholder: 'quelle action ?', hint: 'Que font les utilisateurs avec les thèmes ?' },
        { id: 'goal_location', answer: 'header', alternatives: ['navbar', 'navigation bar', 'nav'], placeholder: 'où ?' },
        { id: 'input_source', answer: 'localStorage', alternatives: ['local storage', 'localstorage', 'browser storage'], placeholder: 'stocké où ?', hint: 'Stockage clé-valeur côté client' },
        { id: 'output_target', answer: 'html', alternatives: ['document', 'body', 'root'], placeholder: 'quel élément ?', hint: 'L\'élément racine de la page' },
        { id: 'output_storage', answer: 'localStorage', alternatives: ['local storage', 'localstorage'], placeholder: 'persisté où ?' },
        { id: 'constraint_exclusion', answer: 'custom color picker', alternatives: ['color picker', 'accent colors', 'custom themes', 'a color picker'], placeholder: 'quelle fonctionnalité exclure ?', hint: 'Un élément courant de dérive de périmètre pour les thèmes' },
        { id: 'criteria_persist', answer: 'page reloads', alternatives: ['page refreshes', 'refreshes', 'reloads', 'browser sessions', 'sessions'], placeholder: 'à travers quoi ?' },
      ],
      explanation: 'Chaque blanc supprime une décision que l\'agent prendrait autrement de son propre chef. Plus ta spec est spécifique, moins tu as besoin de cycles de révision.',
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

    // === PROMPT LAB : ÉCRIRE UN PROMPT DE SPEC ===
    {
      type: 'prompt-lab',
      instruction: 'Écris un prompt qui demande à un agent IA de construire une fonctionnalité. Inclus les éléments clés d\'une bonne spec.',
      scenario: 'Tu as besoin d\'un formulaire de contact sur ton site web. Il doit avoir des champs nom, email et message, valider les entrées, et envoyer les soumissions dans une table Supabase. Tu veux donner ça à Claude Code en un seul prompt.',
      starterPrompt: 'Construis-moi un formulaire de contact.',
      responses: [
        {
          triggerKeywords: ['acceptance criteria', 'constraint', 'goal'],
          response: '✅ Je vais construire le formulaire de contact selon ta spec.\n\nPlan :\n1. Créer la route /contact avec un composant formulaire\n2. Ajouter les champs nom (requis, 2-50 caractères), email (format valide), message (requis, 10-500 caractères)\n3. Valider à la soumission, afficher les erreurs en ligne\n4. Insérer dans la table Supabase `contact_submissions`\n5. Afficher un toast de succès à la fin\n\nDémarrage de l\'implémentation...',
          quality: 'excellent',
          feedback: 'Ton prompt incluait les trois piliers d\'une bonne spec : un objectif clair, des contraintes spécifiques, et des critères d\'acceptation testables. L\'agent peut exécuter ça avec un minimum d\'allers-retours.',
        },
        {
          triggerKeywords: ['name', 'email', 'message', 'supabase'],
          response: 'Je vais créer un formulaire de contact avec des champs nom, email et message qui sauvegarde dans Supabase. J\'ajouterai la validation et un message de succès.\n\nDois-je aussi ajouter :\n- Du rate limiting ?\n- Des notifications par email ?\n- Un captcha ?\n\nDis-moi avant que je commence.',
          quality: 'good',
          feedback: 'Tu as spécifié les entrées et la destination, c\'est un bon début. Mais sans contraintes explicites et critères d\'acceptation, l\'agent pose des questions de suivi au lieu d\'exécuter. Ajoute des limites pour éliminer ces questions.',
        },
        {
          triggerKeywords: ['contact', 'form'],
          response: 'Je vais construire un formulaire de contact pour toi ! Je mets en place une page de contact complète avec :\n- Champs nom, email, téléphone, sujet et message\n- Validation du formulaire avec états d\'erreur\n- Envoi d\'email via Resend API\n- Rate limiting avec Redis\n- Pages de succès/erreur\n- Design responsive\n\nCréation de la structure du projet...',
          quality: 'poor',
          feedback: 'Trop vague. L\'agent a inventé des champs (téléphone, sujet), choisi des technologies que tu n\'as pas demandées (Resend, Redis), et ajouté du périmètre non demandé. Une spec avec des contraintes explicites et une section Hors Périmètre empêcherait ça.',
        },
      ],
      fallbackResponse: {
        response: 'Je vais construire un formulaire de contact. Je vais déterminer les détails au fur et à mesure...',
        feedback: 'Ton prompt n\'incluait pas assez d\'éléments de spec. Essaie d\'inclure : un objectif en une phrase, les champs spécifiques nécessaires, où les données doivent être sauvegardées, et ce que l\'agent ne doit PAS construire.',
      },
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
