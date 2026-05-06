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

    // === DIAGRAM 1: Fleet Failure Detection ===
    {
      type: 'diagram',
      title: 'Cycle de vie d\'un échec de flotte',
      body: "Chaque échec de flotte suit ce cycle de vie. Plus tu détectes et isoles vite, moins les dégâts se propagent. L'objectif : moins de 2 minutes entre l'échec et l'isolation. La récupération peut prendre plus de temps — l'important c'est que les agents en santé continuent de tourner sans perturbation.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'running', label: 'Flotte en marche', sublabel: '4 agents', shape: 'rounded' },
          { id: 'detect', label: 'Détecter', sublabel: 'Signaux', shape: 'diamond', highlight: true },
          { id: 'isolate', label: 'Isoler', sublabel: 'Contenir', shape: 'rect' },
          { id: 'recover', label: 'Récupérer', sublabel: 'Nouvel agent', shape: 'rect' },
          { id: 'continue', label: 'La flotte continue', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'running', to: 'detect', label: 'anomalie' },
          { from: 'detect', to: 'isolate', label: 'confirmé' },
          { from: 'isolate', to: 'recover' },
          { from: 'recover', to: 'continue' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Détecter vite, isoler immédiatement, récupérer à ton rythme.',
    },

    // === DETECTION SIGNALS ===
    {
      type: 'info',
      title: 'Signaux de détection : comment savoir qu\'un agent échoue',
      body: "Tu ne peux pas surveiller quatre fenêtres de terminal simultanément. Tu as besoin de signaux automatisés. Les trois indicateurs les plus clairs d'un agent en échec : (1) la sortie ne correspond pas à la structure de la spec, (2) des tests échouent qui devraient passer vu la spec, (3) l'agent est coincé dans une boucle — il édite le même fichier à répétition ou produit une sortie de plus en plus incohérente.",
    },
    {
      type: 'code-demo',
      title: 'Script de vérification rapide de la santé d\'une flotte',
      body: "Exécute ceci périodiquement pendant que ta flotte travaille. Il vérifie chaque worktree pour des signes de problèmes : des modifications non commitées excessives (mêmes fichiers modifiés à répétition), des échecs de tests, et des erreurs TypeScript. Un agent en santé produit des commits réguliers. Un agent en échec produit du remous.",
      language: 'bash',
      filename: 'scripts/fleet-health.sh',
      code: `#!/bin/bash
# Quick fleet health check — run every 2-3 minutes

WORKTREES=("auth" "api" "ui" "payments")

for wt in "\${WORKTREES[@]}"; do
  echo "=== Agent: $wt ==="
  cd "../worktree-$wt" 2>/dev/null || { echo "  [MISSING]"; continue; }

  # Signal 1: Uncommitted file churn (same files modified 3+ times)
  CHURN=$(git diff --stat | wc -l)
  if [ "$CHURN" -gt 20 ]; then
    echo "  [WARN] High churn: $CHURN files modified without commit"
  fi

  # Signal 2: TypeScript errors
  ERRORS=$(npx tsc --noEmit 2>&1 | grep "error TS" | wc -l)
  if [ "$ERRORS" -gt 0 ]; then
    echo "  [WARN] $ERRORS TypeScript errors"
  fi

  # Signal 3: Recent commit activity (healthy = commits every few minutes)
  LAST_COMMIT=$(git log -1 --format="%cr" 2>/dev/null)
  echo "  Last commit: $LAST_COMMIT"

  cd - > /dev/null
done`,
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
      type: 'info',
      title: 'Isolation : contenir les dégâts',
      body: "Une fois que tu as détecté un agent en échec, isole-le immédiatement. L'objectif : empêcher son mauvais état d'affecter les autres agents ou la branche principale. Avec les worktrees git, l'isolation est propre — chaque agent travaille dans son propre worktree. Tu stash ou reset le mauvais worktree sans toucher à rien d'autre.",
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
      type: 'code-demo',
      title: 'Procédure d\'isolation complète',
      body: "Voici la séquence d'isolation complète. Arrête l'agent, préserve son travail pour l'analyse post-mortem, puis nettoie le worktree. Le stash préserve les preuves — tu voudras comprendre POURQUOI l'agent a échoué pour écrire une meilleure spec pour la tentative de récupération.",
      language: 'bash',
      filename: 'scripts/isolate-agent.sh',
      code: `#!/bin/bash
# Isolate a failing agent's worktree
AGENT=$1  # e.g., "payments"
WORKTREE="../worktree-$AGENT"

echo "Isolating agent: $AGENT"

# 1. Stop the agent process (if running via claude --worktree)
# The agent's terminal session — Ctrl+C or kill the process

# 2. Preserve the failed state for analysis
git -C "$WORKTREE" stash push -m "failed-attempt-$(date +%s)"

# 3. Check if any commits were made (might need to revert)
BAD_COMMITS=$(git -C "$WORKTREE" log main..HEAD --oneline | wc -l)
if [ "$BAD_COMMITS" -gt 0 ]; then
  echo "  $BAD_COMMITS commits to review before merging"
  git -C "$WORKTREE" log main..HEAD --oneline
fi

# 4. Reset to clean state
git -C "$WORKTREE" reset --hard main

echo "Worktree clean. Ready for recovery agent."`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu peux isoler un agent en échec sans perturber la flotte.',
    },

    // === RECOVERY STRATEGIES ===
    {
      type: 'info',
      title: 'Récupération : lancer un nouvel agent avec un meilleur contexte',
      body: "L'isolation est faite. Maintenant tu as besoin que le travail soit complété. Ne relance pas juste la même spec — l'agent a échoué pour une raison. Analyse le travail stashé pour comprendre ce qui a mal tourné, puis améliore la spec. Corrections courantes : des limites de fichiers plus explicites, un exemple concret de la sortie attendue, ou découper la tâche en sous-tâches plus petites.",
    },
    {
      type: 'code-demo',
      title: 'Post-mortem : diagnostiquer l\'échec d\'un agent',
      body: "Avant de relancer, comprends POURQUOI l'agent a échoué. Regarde le diff du stash pour des patrons. Ces trois patrons couvrent 90 % des échecs d'agents dans les opérations de flotte.",
      language: 'bash',
      filename: 'scripts/diagnose-failure.sh',
      code: `# Inspect the failed attempt
git -C ../worktree-payments stash show -p

# Common failure patterns to look for:

# Pattern 1: Circular edits (same file modified repeatedly)
# Look for: file appears multiple times in stash, contradictory changes
# Cause: Agent couldn't resolve a type error or test failure
# Fix: Provide the correct type/interface in the spec

# Pattern 2: Scope creep (agent modified files outside its domain)
# Look for: changes in src/auth/* or src/api/* from the payments agent
# Cause: Agent decided it needed to "fix" something in another domain
# Fix: Explicitly list forbidden files in the recovery spec

# Pattern 3: Wrong abstraction (built something completely different)
# Look for: file structure doesn't match spec at all
# Cause: Agent misinterpreted the task
# Fix: Include a concrete example of expected file output`,
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
      type: 'code-demo',
      title: 'Spec de récupération : quoi ajouter après un échec',
      body: "La spec de récupération inclut tout ce que la spec originale avait, PLUS des contraintes explicites apprises de l'échec. Remarque la section « NE PAS FAIRE » et l'exemple concret de sortie — ceux-ci empêchent le même mode d'échec de se reproduire.",
      language: 'markdown',
      filename: 'specs/payments-recovery.md',
      code: `## Recovery: Payments Agent (Attempt 2)

### Task
Build Stripe payment integration in src/payments/

### File Ownership (STRICT)
You own: src/payments/**
You may READ: src/types/contracts.ts, src/auth/types.ts
You MUST NOT MODIFY: anything outside src/payments/

### DO NOT
- Modify src/types/contracts.ts (use it as-is)
- Import from src/auth/ internals (only from src/auth/types.ts)
- Create new top-level directories
- Install new dependencies without noting them

### Expected Output Structure
\`\`\`
src/payments/
├── index.ts          # Public API: createCheckout, getSubscription
├── stripe-client.ts  # Stripe SDK wrapper
├── webhooks.ts       # Stripe webhook handler
├── types.ts          # Internal payment types
└── __tests__/
    ├── checkout.test.ts
    └── webhooks.test.ts
\`\`\`

### Concrete Example
Here's what src/payments/index.ts should look like:
\`\`\`typescript
import type { User } from '@/types/contracts'
import { stripe } from './stripe-client'

export async function createCheckout(user: User, priceId: string) {
  // ...implementation
}
\`\`\``,
    },
    {
      type: 'terminal',
      instruction: 'Lance l\'agent de récupération sur le worktree propre avec la spec améliorée :',
      expectedCommand: 'claude --worktree ../worktree-payments "Follow specs/payments-recovery.md exactly. Build the Stripe payment integration."',
      hint: 'Utilise claude --worktree pointant vers le worktree payments avec une instruction claire référençant la spec de récupération',
    },

    // === CASCADE PREVENTION ===
    {
      type: 'info',
      title: 'Prévenir les échecs en cascade',
      body: "Le pire scénario : un agent échoue, et en essayant de se corriger, il casse quelque chose qui affecte les autres agents. Exemple : l'agent API n'arrive pas à résoudre une erreur de type, alors il modifie le fichier de contrats partagé — maintenant les agents UI et payments (qui travaillent avec l'ancien contrat) construisent silencieusement sur les mauvais types. La prévention est une question d'architecture, pas de chance.",
    },
    {
      type: 'diagram',
      title: 'Architecture de prévention des cascades',
      body: "La défense structurelle clé : les agents importent depuis les contrats partagés mais ne les modifient jamais. Chaque agent possède un périmètre (son répertoire) et n'expose que ce qu'il exporte explicitement. L'orchestrateur (toi) est le seul qui modifie les ressources partagées.",
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
