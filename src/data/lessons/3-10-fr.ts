import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-10',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Quoi faire quand un agent IA déraille',
      body: "Tu as quatre agents qui tournent en parallèle. Trois produisent du code propre et conforme aux spécifications. Un est en vrille — il a mal compris la spec, introduit une dépendance circulaire, ou est coincé dans une boucle à réécrire le même fichier. Dans un flux à agent unique, tu arrêterais et redémarrerais. Dans une flotte, tu as besoin d'une intervention chirurgicale : détecter, isoler, récupérer — sans perturber les agents en santé.",
    },
    {
      type: 'info',
      title: 'Pourquoi les échecs de flotte sont différents',
      body: "Un seul agent qui échoue, c'est agaçant. Un agent dans une flotte qui échoue, c'est dangereux — s'il corrompt des fichiers partagés, pousse des types cassés vers une interface partagée, ou monopolise les ressources, ça peut cascader et faire tomber toute la flotte. La compétence clé n'est pas d'empêcher tous les échecs (impossible), c'est de les détecter vite et de les isoler avant qu'ils se propagent.",
    },

    // === DIAGRAM 1: Fleet Failure Detection (Interactif) ===
    {
      type: 'interactive-diagram',
      title: 'Cycle de vie d\'un échec de flotte',
      body: "Chaque échec de flotte suit ce cycle de vie. Plus tu détectes et isoles vite, moins les dégâts se propagent. L'objectif : moins de 2 minutes entre l'échec et l'isolation. La récupération peut prendre plus de temps — l'important c'est que les agents en santé continuent de tourner sans perturbation.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'running', label: 'Flotte en marche', sublabel: '4 agents', shape: 'rounded' },
          { id: 'detect', label: 'Détecter', sublabel: 'Signaux', shape: 'diamond', highlight: true },
          { id: 'isolate', label: 'Isoler', sublabel: 'Contenir', shape: 'rect' },
          { id: 'analyze', label: 'Analyser', sublabel: 'Cause racine', shape: 'rect' },
          { id: 'recover', label: 'Récupérer', sublabel: 'Nouvel agent', shape: 'rect' },
          { id: 'continue', label: 'La flotte continue', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'running', to: 'detect', label: 'anomalie' },
          { from: 'detect', to: 'isolate', label: 'confirmé' },
          { from: 'isolate', to: 'analyze' },
          { from: 'analyze', to: 'recover' },
          { from: 'recover', to: 'continue' },
        ],
      },
      stages: [
        {
          highlightNodes: ['running'],
          explanation: 'La flotte tourne normalement — 4 agents travaillent en parallèle sur des worktrees séparés. Des scripts de vérification de santé surveillent chaque agent toutes les 2-3 minutes.',
        },
        {
          highlightNodes: ['running', 'detect'],
          highlightEdges: [{ from: 'running', to: 'detect' }],
          explanation: 'Une anomalie est détectée : remous élevé de fichiers sans commits, erreurs TypeScript qui s\'accumulent, ou l\'agent qui édite le même fichier à répétition. Le check de santé le signale.',
        },
        {
          highlightNodes: ['detect', 'isolate'],
          highlightEdges: [{ from: 'detect', to: 'isolate' }],
          explanation: 'Échec confirmé. Isoler immédiatement : arrêter le processus de l\'agent, stasher ses modifications pour analyse, et réinitialiser le worktree. Les 3 autres agents continuent sans perturbation.',
        },
        {
          highlightNodes: ['isolate', 'analyze'],
          highlightEdges: [{ from: 'isolate', to: 'analyze' }],
          explanation: 'Analyser la cause racine depuis le travail stashé. Était-ce du scope creep (fichiers modifiés hors de son domaine) ? Des éditions circulaires (même fichier modifié à répétition) ? Une mauvaise abstraction (spec mal comprise) ?',
        },
        {
          highlightNodes: ['analyze', 'recover'],
          highlightEdges: [{ from: 'analyze', to: 'recover' }],
          explanation: 'Écrire une spec améliorée avec des contraintes explicites apprises de l\'échec. Lancer un nouvel agent de récupération sur le worktree propre avec des limites plus strictes.',
        },
        {
          highlightNodes: ['recover', 'continue'],
          highlightEdges: [{ from: 'recover', to: 'continue' }],
          explanation: 'L\'agent de récupération complète le travail dans ses limites. La flotte continue avec les 4 agents qui produisent du résultat. Un échec n\'a pas cascadé en perturbation de toute la flotte.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Détecter vite, isoler immédiatement, récupérer à ton rythme.',
    },

    // === PROMPT LAB: Écrire une directive de récupération ===
    {
      type: 'prompt-lab',
      instruction: 'L\'agent d\'authentification est coincé dans une boucle, éditant le même fichier à répétition. Écris une directive de récupération.',
      scenario: 'Ta flotte de 4 agents construit une app SaaS. L\'agent auth tourne depuis 20 minutes et son git log montre que le même fichier (src/lib/auth.ts) a été édité 15 fois avec des modifications contradictoires. Les 3 autres agents fonctionnent bien.',
      starterPrompt: 'Fix the auth agent.',
      responses: [
        {
          triggerKeywords: ['stash', 'reset', 'constraint', 'only'],
          response: 'Recovery plan:\n1. Stashing the agent\'s changes for analysis\n2. Resetting to last known good state\n3. Restarting with tighter constraints\n\nRoot cause: the agent was trying to satisfy conflicting requirements in the spec. Adding explicit "DO NOT modify session.ts" boundary to prevent the loop.\n\nRestarting agent with focused scope...',
          quality: 'excellent',
          feedback: 'Tu as identifié le besoin de : (1) préserver le travail pour analyse, (2) réinitialiser à un état propre, et (3) ajouter des contraintes pour prévenir la récurrence. C\'est le pattern de récupération standard.',
        },
        {
          triggerKeywords: ['stop', 'restart'],
          response: 'I\'ll stop the auth agent and restart it. Should I use the same spec or modify it?',
          quality: 'good',
          feedback: 'Arrêter et redémarrer est nécessaire, mais sans analyser pourquoi il a bouclé et ajouter des contraintes, il va probablement re-boucler. Ajoute stash-puis-analyser et des limites de scope plus strictes.',
        },
      ],
      fallbackResponse: {
        response: 'Which agent is having issues? Can you share more details about the problem?',
        feedback: 'Ta directive était trop vague. Spécifie : (1) stasher ou sauver les modifications actuelles, (2) réinitialiser à un état connu et bon, (3) quelles contraintes ajouter pour prévenir la boucle, et (4) quel scope restreindre.',
      },
    },

    // === DETECTION SIGNALS ===
    {
      type: 'multiple-choice',
      question: 'Quels sont les trois indicateurs les plus clairs qu\'un agent de ta flotte est en échec ?',
      options: [
        'Temps d\'exécution lent, haute utilisation mémoire, et gros fichiers',
        'La sortie ne correspond pas à la structure de la spec, les tests échouent, et l\'agent édite le même fichier à répétition',
        'Pas de commits git, pas de sortie terminal, et pas d\'activité réseau',
        'Erreurs de types, avertissements de lint, et dépendances manquantes',
      ],
      correctIndex: 1,
      explanation: "Tu ne peux pas surveiller quatre terminaux simultanément. Les trois signaux automatisés les plus clairs : (1) la sortie ne correspond pas à la structure de la spec, (2) des tests échouent qui devraient passer vu la spec, (3) l'agent est coincé dans une boucle — il édite le même fichier à répétition ou produit une sortie de plus en plus incohérente.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète le script de vérification de santé de flotte. Remplis les commandes git qui détectent les problèmes d\'agent : remous de fichiers, erreurs TypeScript, et activité de commits.',
      language: 'bash',
      filename: 'scripts/fleet-health.sh',
      template: `#!/bin/bash
# Quick fleet health check -- run every 2-3 minutes

WORKTREES=("auth" "api" "ui" "payments")

for wt in "\${WORKTREES[@]}"; do
  echo "=== Agent: $wt ==="
  cd "../worktree-$wt" 2>/dev/null || { echo "  [MISSING]"; continue; }

  # Signal 1: Uncommitted file churn
  CHURN=$(___BLANK_1___ | wc -l)
  if [ "$CHURN" -gt 20 ]; then
    echo "  [WARN] High churn: $CHURN files modified without commit"
  fi

  # Signal 2: TypeScript errors
  ERRORS=$(___BLANK_2___ 2>&1 | grep "error TS" | wc -l)
  if [ "$ERRORS" -gt 0 ]; then
    echo "  [WARN] $ERRORS TypeScript errors"
  fi

  # Signal 3: Recent commit activity
  LAST_COMMIT=$(___BLANK_3___ 2>/dev/null)
  echo "  Last commit: $LAST_COMMIT"

  cd - > /dev/null
done`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'git diff --stat',
          alternatives: ['git diff --stat'],
          hint: 'Commande git qui montre un résumé des fichiers modifiés (noms et compteurs)',
          placeholder: 'commande git diff',
        },
        {
          id: 'BLANK_2',
          answer: 'npx tsc --noEmit',
          alternatives: ['npx tsc --noEmit', 'bunx tsc --noEmit'],
          hint: 'Exécute le compilateur TypeScript en mode vérification seule',
          placeholder: 'commande de vérification de types',
        },
        {
          id: 'BLANK_3',
          answer: 'git log -1 --format="%cr"',
          alternatives: ['git log -1 --format="%cr"', "git log -1 --format='%cr'"],
          hint: 'Montre le temps relatif du commit le plus récent (ex: « il y a 3 minutes »)',
          placeholder: 'commande du dernier commit',
        },
      ],
      explanation: '`git diff --stat` montre le remous de fichiers non commités — plus de 20 fichiers modifiés sans commit signale un problème. `npx tsc --noEmit` attrape les erreurs de types qui s\'accumulent. `git log -1 --format="%cr"` montre quand était le dernier commit — les agents en santé commitent toutes les quelques minutes.',
    },
    {
      type: 'multiple-choice',
      question: 'Un agent a modifié 35 fichiers sans faire un seul commit en 8 minutes. Qu\'est-ce que ça signale ?',
      options: [
        'L\'agent travaille sur une grosse fonctionnalité — donne-lui plus de temps',
        'L\'agent est probablement coincé dans une boucle ou a dévié de la spec — investigue immédiatement',
        'C\'est normal pour les tâches complexes',
        'L\'agent attend une entrée de l\'utilisateur',
      ],
      correctIndex: 1,
      explanation: "Les agents en santé commitent de façon incrémentale. 35 fichiers modifiés sans commits en 8 minutes signifie presque toujours que l'agent est soit coincé dans une boucle (essayant de corriger des erreurs en cascade), a mal compris la spec (construit la mauvaise chose à grande échelle), ou a atteint une impasse et s'agite. Investigue maintenant — plus tu attends, plus la récupération sera difficile.",
    },

    // === ISOLATION TECHNIQUES ===
    {
      type: 'multiple-choice',
      question: 'Tu as détecté un agent en échec. Quel est l\'objectif principal de l\'étape d\'isolation ?',
      options: [
        'Comprendre pourquoi l\'agent a échoué avant de prendre toute action',
        'Empêcher le mauvais état de l\'agent d\'affecter les autres agents ou la branche principale',
        'Redémarrer l\'agent avec la même spec pour voir si ça marche la deuxième fois',
        'Supprimer le worktree de l\'agent et recommencer de zéro',
      ],
      correctIndex: 1,
      explanation: "Isole immédiatement pour empêcher le mauvais état d'affecter les autres agents ou main. Avec les worktrees git, l'isolation est propre — chaque agent travaille dans son propre worktree. Stash ou reset le mauvais worktree sans toucher à rien d'autre. L'analyse vient après l'isolation, pas avant.",
    },
    {
      type: 'terminal',
      instruction: 'L\'agent « payments » a dévié. D\'abord, vérifie ce qu\'il a fait — affiche tous les fichiers modifiés dans son worktree :',
      expectedCommand: 'git -C ../worktree-payments diff --stat',
      hint: 'Utilise git -C pour cibler le worktree spécifique, puis diff --stat pour voir les fichiers modifiés',
    },
    {
      type: 'terminal',
      instruction: 'Les dégâts sont contenus dans le worktree. Stash toutes les mauvaises modifications pour pouvoir les inspecter plus tard si nécessaire :',
      expectedCommand: 'git -C ../worktree-payments stash push -m "failed-attempt-1"',
      hint: 'Utilise git stash push avec un message descriptif dans le worktree payments',
    },
    {
      type: 'terminal',
      instruction: 'Maintenant, réinitialise le worktree à un état propre correspondant au point de branchement :',
      expectedCommand: 'git -C ../worktree-payments checkout -- .',
      hint: 'Utilise git checkout -- . pour abandonner toutes les modifications du répertoire de travail',
    },
    {
      type: 'code-fill',
      instruction: 'Complète le script d\'isolation qui préserve le travail de l\'agent en échec, vérifie les mauvais commits, et réinitialise à un état propre.',
      language: 'bash',
      filename: 'scripts/isolate-agent.sh',
      template: `#!/bin/bash
AGENT=$1  # e.g., "payments"
WORKTREE="../worktree-$AGENT"

echo "Isolating agent: $AGENT"

# 1. Preserve the failed state for analysis
git -C "$WORKTREE" ___BLANK_1___

# 2. Check if any commits were made
BAD_COMMITS=$(git -C "$WORKTREE" ___BLANK_2___ | wc -l)
if [ "$BAD_COMMITS" -gt 0 ]; then
  echo "  $BAD_COMMITS commits to review before merging"
fi

# 3. Reset to clean state
git -C "$WORKTREE" ___BLANK_3___

echo "Worktree clean. Ready for recovery agent."`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'stash push -m "failed-attempt-$(date +%s)"',
          alternatives: ['stash push -m "failed-attempt-$(date +%s)"', 'stash push -m "failed-attempt"', 'stash'],
          hint: 'Commande git pour sauver les modifications avec un message descriptif contenant un timestamp',
          placeholder: 'commande stash avec message',
        },
        {
          id: 'BLANK_2',
          answer: 'log main..HEAD --oneline',
          alternatives: ['log main..HEAD --oneline', 'log main..HEAD'],
          hint: 'Montrer les commits sur cette branche qui ne sont pas sur main (une ligne chacun)',
          placeholder: 'commande log pour commits de branche',
        },
        {
          id: 'BLANK_3',
          answer: 'reset --hard main',
          alternatives: ['reset --hard main'],
          hint: 'Réinitialiser de force pour correspondre exactement à la branche main',
          placeholder: 'commande de reset hard',
        },
      ],
      explanation: 'Le stash préserve les preuves pour l\'analyse post-mortem. `log main..HEAD` montre les commits que l\'agent a faits (pourraient nécessiter un revert). `reset --hard main` ramène le worktree à un état propre. La séquence : préserver -> inspecter -> réinitialiser. Ne saute jamais le stash — tu as besoin de comprendre POURQUOI l\'agent a échoué.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu peux isoler un agent en échec sans perturber la flotte.',
    },

    // === RECOVERY STRATEGIES ===
    {
      type: 'compare',
      title: 'Récupération : relancer la même spec vs spec améliorée',
      body: 'Après avoir isolé un agent en échec, tu dois compléter le travail. Deux approches :',
      question: 'Quelle approche empêche le même échec de se reproduire ?',
      correctSide: 'right',
      left: {
        label: 'Relancer la même spec',
        content: '# Juste redémarrer l\'agent\nclaude --worktree ../worktree-payments \\\n  "Follow specs/payments.md"\n\n# Problèmes :\n# - Même spec = même mode d\'échec\n# - Pas de contraintes apprises de l\'échec\n# - L\'agent peut boucler sur le même problème\n# - Pas de limites de fichiers ajoutées\n# - Pas d\'exemples concrets fournis\n\n# Résultat : 70 % de chance du même échec',
        language: 'bash',
      },
      right: {
        label: 'Spec améliorée avec contraintes',
        content: '# 1. Analyser le stash d\'abord\ngit -C ../worktree-payments stash show -p\n\n# 2. Identifier le patron d\'échec :\n# - Éditions circulaires ? Ajouter type/interface à la spec\n# - Scope creep ? Ajouter liste NE PAS MODIFIER\n# - Mauvaise abstraction ? Ajouter exemple concret\n\n# 3. Lancer avec spec améliorée\nclaude --worktree ../worktree-payments \\\n  "Follow specs/payments-recovery.md"\n\n# Résultat : Mode d\'échec éliminé',
        language: 'bash',
      },
      explanation: "Ne relance jamais la même spec — l'agent a échoué pour une raison. Analyse le travail stashé pour trouver le patron d'échec, puis améliore la spec avec des contraintes explicites, des limites de fichiers et des exemples concrets. Corrections courantes : des limites de fichiers plus explicites, un exemple concret de la sortie attendue, ou découper la tâche en sous-tâches plus petites.",
    },
    {
      type: 'multiple-choice',
      question: 'Tu inspectes le stash et tu vois que l\'agent payments a modifié `src/auth/session.ts` et `src/types/contracts.ts`. Qu\'est-ce qui a mal tourné ?',
      options: [
        'L\'agent payments a trouvé des bogues dans auth et les a corrigés gentiment',
        'L\'agent a violé les limites de propriété de fichiers — il a modifié des fichiers qui ne lui appartiennent pas',
        'Le fichier contracts devait être mis à jour pour les types de paiement',
        'C\'est normal — les agents ont parfois besoin de modifier des fichiers partagés',
      ],
      correctIndex: 1,
      explanation: "C'est du scope creep — le tueur #1 de flottes. L'agent payments devrait UNIQUEMENT modifier les fichiers dans src/payments/*. Modifier le fichier de contrats partagé pourrait casser tous les autres agents. Modifier le code d'auth pourrait entrer en conflit avec l'agent auth. Pour la récupération, indique explicitement : « Tu NE DOIS PAS modifier de fichier en dehors de src/payments/. »",
    },

    // === IMPROVED SPEC FOR RECOVERY ===
    {
      type: 'code-fill',
      instruction: 'Complète la spec de récupération avec des contraintes explicites apprises de l\'échec. Remplis les règles de propriété de fichiers et les restrictions NE PAS FAIRE.',
      language: 'markdown',
      filename: 'specs/payments-recovery.md',
      template: `## Recovery: Payments Agent (Attempt 2)

### Task
Build Stripe payment integration in src/payments/

### File Ownership (STRICT)
You own: ___BLANK_1___
You may READ: src/types/contracts.ts, src/auth/types.ts
You MUST NOT MODIFY: ___BLANK_2___

### DO NOT
- Modify src/types/contracts.ts (use it as-is)
- Import from src/auth/ internals (only from ___BLANK_3___)
- Create new top-level directories
- Install new dependencies without noting them

### Expected Output Structure
src/payments/
  index.ts          # Public API: createCheckout, getSubscription
  stripe-client.ts  # Stripe SDK wrapper
  webhooks.ts       # Stripe webhook handler
  types.ts          # Internal payment types
  __tests__/
    checkout.test.ts
    webhooks.test.ts`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'src/payments/**',
          alternatives: ['src/payments/**', 'src/payments/*'],
          hint: 'L\'agent possède tout sous le répertoire payments',
          placeholder: 'glob du chemin possédé',
        },
        {
          id: 'BLANK_2',
          answer: 'anything outside src/payments/',
          alternatives: ['anything outside src/payments/', 'anything outside src/payments', 'tout en dehors de src/payments/'],
          hint: 'L\'agent ne doit pas modifier les fichiers en dehors de son répertoire possédé',
          placeholder: 'portée de modification interdite',
        },
        {
          id: 'BLANK_3',
          answer: 'src/auth/types.ts',
          alternatives: ['src/auth/types.ts'],
          hint: 'Le seul fichier auth que l\'agent est autorisé à importer — seulement les types publics',
          placeholder: 'import auth autorisé',
        },
      ],
      explanation: 'La spec de récupération ajoute des contraintes explicites apprises de l\'échec : propriété stricte des fichiers (`src/payments/**` uniquement), accès en lecture seule aux contrats partagés, et une liste concrète NE PAS FAIRE. Ces contraintes éliminent les modes d\'échec trouvés dans le post-mortem.',
    },
    {
      type: 'terminal',
      instruction: 'Lance l\'agent de récupération sur le worktree propre avec la spec améliorée :',
      expectedCommand: 'claude --worktree ../worktree-payments "Follow specs/payments-recovery.md exactly. Build the Stripe payment integration."',
      hint: 'Utilise claude --worktree pointant vers le worktree payments avec une instruction claire référençant la spec de récupération',
    },

    // === CASCADE PREVENTION ===
    {
      type: 'multiple-choice',
      question: 'L\'agent API n\'arrive pas à résoudre une erreur de type, alors il modifie le fichier de contrats partagé. Que se passe-t-il pour les autres agents ?',
      options: [
        'Rien — chaque agent travaille dans son propre worktree',
        'Les agents UI et payments construisent maintenant silencieusement sur les mauvais types — un échec en cascade',
        'Les autres agents récupèrent automatiquement les changements de contrat',
        'Le pipeline attrape ça avant que ça affecte qui que ce soit',
      ],
      correctIndex: 1,
      explanation: "C'est le pire scénario de cascade. Les agents UI et payments (qui travaillent avec l'ancien contrat) construisent maintenant silencieusement sur les mauvais types. Leur code compilera mais produira des erreurs à l'exécution. La prévention est une question d'architecture : les contrats partagés doivent être en lecture seule pour les agents.",
    },
    {
      type: 'interactive-diagram',
      title: 'Architecture de prévention des cascades',
      body: "La défense structurelle clé : les agents importent depuis les contrats partagés mais ne les modifient jamais. L'orchestrateur (toi) est le seul qui modifie les ressources partagées.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'contracts', label: 'Contrats partagés', sublabel: 'Lecture seule pour les agents', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Agent Auth', sublabel: 'src/auth/*', shape: 'rect' },
          { id: 'api', label: 'Agent API', sublabel: 'src/api/*', shape: 'rect' },
          { id: 'ui', label: 'Agent UI', sublabel: 'src/ui/*', shape: 'rect' },
          { id: 'pay', label: 'Agent Payments', sublabel: 'src/payments/*', shape: 'rect' },
          { id: 'orch', label: 'Orchestrateur', sublabel: 'Toi (seul à écrire)', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'contracts', to: 'auth', label: 'lit', dashed: true },
          { from: 'contracts', to: 'api', label: 'lit', dashed: true },
          { from: 'contracts', to: 'ui', label: 'lit', dashed: true },
          { from: 'contracts', to: 'pay', label: 'lit', dashed: true },
          { from: 'orch', to: 'contracts', label: 'écrit' },
        ],
      },
      stages: [
        {
          highlightNodes: ['contracts'],
          explanation: 'Les contrats partagés (types, interfaces, configs) sont la fondation sur laquelle tous les agents construisent. Ils définissent les accords entre les modules.',
        },
        {
          highlightNodes: ['contracts', 'auth', 'api', 'ui', 'pay'],
          highlightEdges: [{ from: 'contracts', to: 'auth' }, { from: 'contracts', to: 'api' }, { from: 'contracts', to: 'ui' }, { from: 'contracts', to: 'pay' }],
          explanation: 'Les quatre agents LISENT depuis les contrats partagés. Chaque agent possède son propre répertoire (src/auth/*, src/api/*, etc.) et ne modifie que les fichiers dans cette limite.',
        },
        {
          highlightNodes: ['orch', 'contracts'],
          highlightEdges: [{ from: 'orch', to: 'contracts' }],
          explanation: 'Seul l\'orchestrateur (toi) peut ÉCRIRE dans les contrats partagés. Si un contrat doit changer, mets en pause tous les agents concernés d\'abord, mets à jour le contrat, puis reprends. Ça prévient les décalages de types en cascade.',
        },
      ],
    },
    {
      type: 'checklist',
      title: 'Règles de prévention des cascades',
      items: [
        'Les fichiers partagés (types, contrats, configs) sont en lecture seule pour les agents',
        'Seul l\'orchestrateur modifie les ressources partagées',
        'Chaque spec d\'agent inclut des limites explicites NE PAS MODIFIER',
        'Les agents ne peuvent pas installer de nouvelles dépendances sans approbation',
        'Les contrats d\'interface sont figés avant le lancement de la flotte',
        'Si un contrat doit changer, mettre en pause tous les agents concernés d\'abord',
      ],
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu peux empêcher un seul échec d\'en devenir cinq.',
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'order',
      instruction: 'Ordonne correctement la procédure de réponse à un échec de flotte :',
      items: [
        'Détecter l\'anomalie (remous élevé, erreurs de types, pas de commits)',
        'Arrêter le processus de l\'agent en échec',
        'Stasher le travail échoué pour l\'analyse post-mortem',
        'Analyser le patron d\'échec (scope creep, éditions circulaires, mauvaise abstraction)',
        'Écrire une spec améliorée avec des contraintes explicites',
        'Lancer l\'agent de récupération sur un worktree propre',
        'Vérifier que l\'agent de récupération reste dans ses limites',
      ],
      correctOrder: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      type: 'multiple-choice',
      question: 'Tu détectes un agent en échec mais les trois autres tournent bien. Devrais-tu arrêter toute la flotte ?',
      options: [
        'Oui — tout échec pourrait être le signe d\'un problème plus large',
        'Non — isole l\'agent en échec et laisse les agents en santé continuer',
        'Oui — tu dois replanifier toute la décomposition des tâches',
        'Non — ignore l\'agent en échec et concentre-toi sur ceux qui marchent',
      ],
      correctIndex: 1,
      explanation: "Tout le point de l'isolation par worktree est que l'échec d'un agent est contenu dans son worktree. Laisse les agents en santé continuer à produire de la valeur pendant que tu gères la récupération. Arrête la flotte seulement si l'échec révèle un problème avec les contrats partagés ou l'architecture qui affecte tout le monde.",
    },
    {
      type: 'checklist',
      title: 'Maîtrise de la récupération d\'échec de flotte',
      items: [
        'Je peux détecter les agents en échec en 2-3 minutes grâce aux signaux de santé',
        'J\'isole les agents en échec sans perturber ceux en santé',
        'Je préserve le travail échoué pour l\'analyse post-mortem',
        'Je diagnostique la cause racine (scope creep, éditions circulaires, mauvaise abstraction)',
        'J\'écris des specs de récupération avec des contraintes explicites apprises de l\'échec',
        'Je préviens les échecs en cascade grâce aux contrats partagés en lecture seule',
        'Je sais quand isoler un agent vs arrêter toute la flotte',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Récupération d\'échec apprise ! Un agent cassé n\'a pas à tout casser.',
    },
  ],
}

export default content
