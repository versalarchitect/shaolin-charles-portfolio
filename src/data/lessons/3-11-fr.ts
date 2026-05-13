import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-11',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Surveiller du code construit par l\'IA en production',
      body: "La flotte a livré. Quatre agents ont construit l'authentification, l'API, les paiements et l'interface — tout fusionné, déployé, en ligne. Les utilisateurs y accèdent. Puis à 2h du matin : les erreurs 500 explosent. Tu ouvres Sentry et tu vois une trace de pile dans du code qu'un agent a écrit il y a trois jours. La question n'est pas « qui a écrit ce bogue » — c'est « comment je retrace ça jusqu'à la spec qui l'a produit, et comment je préviens cette classe de bogue la prochaine fois ? »",
    },
    {
      type: 'info',
      title: 'Les bogues introduits par les agents ont des patrons',
      body: "Les agents ne font pas d'erreurs aléatoires. Ils font des erreurs systématiques — des classes prévisibles de bogues qui émergent de la façon dont les agents traitent les instructions. Une fois que tu connais les patrons, tu peux (1) les attraper en révision avant le déploiement, (2) mettre en place une surveillance ajustée pour les détecter, et (3) améliorer les specs pour les prévenir. Cette leçon couvre les trois.",
    },

    // === DIAGRAM 1: The Feedback Loop (interactive) ===
    {
      type: 'interactive-diagram',
      title: 'La boucle de rétroaction en production',
      body: 'Clique sur chaque étape pour voir comment les erreurs de production alimentent de meilleures specs.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'deploy', label: 'Déployer', sublabel: 'Mettre en prod', shape: 'rounded' },
          { id: 'monitor', label: 'Surveiller', sublabel: 'Sentry + journaux', shape: 'rect' },
          { id: 'errors', label: 'Erreurs détectées', sublabel: 'Alertes déclenchées', shape: 'diamond', highlight: true },
          { id: 'analyze', label: 'Analyser les patrons', sublabel: 'Classifier le type de bogue', shape: 'rect' },
          { id: 'improve', label: 'Améliorer la spec', sublabel: 'Prévenir la récurrence', shape: 'pill', highlight: true },
          { id: 'redeploy', label: 'Redéployer', sublabel: 'Livrer le correctif', shape: 'rounded' },
        ],
        edges: [
          { from: 'deploy', to: 'monitor' },
          { from: 'monitor', to: 'errors' },
          { from: 'errors', to: 'analyze' },
          { from: 'analyze', to: 'improve' },
          { from: 'improve', to: 'redeploy' },
          { from: 'redeploy', to: 'monitor', label: 'la boucle continue', dashed: true },
        ],
      },
      stages: [
        {
          highlightNodes: ['deploy'],
          highlightEdges: [],
          explanation: 'La flotte a livré du code en production. Quatre agents ont construit différents modules — auth, API, paiements, UI — tout fusionné et déployé. Les utilisateurs accèdent maintenant au système en ligne.',
        },
        {
          highlightNodes: ['deploy', 'monitor'],
          highlightEdges: [{ from: 'deploy', to: 'monitor' }],
          explanation: 'Sentry, les journaux d\'application et les moniteurs de disponibilité surveillent le code déployé. Les taux d\'erreur, les pics de latence et les exceptions non gérées sont suivis en temps réel.',
        },
        {
          highlightNodes: ['monitor', 'errors'],
          highlightEdges: [{ from: 'monitor', to: 'errors' }],
          explanation: 'Une alerte se déclenche : les erreurs 500 explosent à 2h du matin. Sentry capture un TypeError dans du code qu\'un agent a écrit il y a trois jours. La trace de pile pointe vers un fichier et un numéro de ligne spécifiques.',
        },
        {
          highlightNodes: ['errors', 'analyze'],
          highlightEdges: [{ from: 'errors', to: 'analyze' }],
          explanation: 'Tu classifies le bogue : vérification de null manquante (Patron 2). Git blame révèle quelle session d\'agent l\'a produit. Le commit correspond à une version de spec spécifique qui ne gérait pas les champs nullable.',
        },
        {
          highlightNodes: ['analyze', 'improve'],
          highlightEdges: [{ from: 'analyze', to: 'improve' }],
          explanation: 'Tu ajoutes « tous les champs de réponse API peuvent être null — gérer avec des valeurs par défaut » à la liste de vérification des exigences de spec. Une règle de lint est ajoutée pour attraper les accès de propriétés sans chaînage optionnel.',
        },
        {
          highlightNodes: ['improve', 'redeploy'],
          highlightEdges: [{ from: 'improve', to: 'redeploy' }],
          explanation: 'Le correctif est livré. Plus important encore, la spec améliorée garantit que les futures sessions d\'agent ne produiront plus jamais cette classe de bogue. La boucle continue — chaque erreur rend le prochain déploiement meilleur.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Chaque erreur de production est un retour sur la spec. La boucle te rend meilleur.',
    },

    // === COMMON AGENT-INTRODUCED BUGS ===
    {
      type: 'info',
      title: 'Les cinq bogues les plus courants introduits par les agents',
      body: "Après avoir surveillé des centaines de déploiements construits par agents, ces patrons dominent : (1) Frontières d'erreur manquantes — les agents gèrent le chemin heureux à merveille mais sautent les états d'erreur. (2) Hypothèses erronées sur la forme des données — les agents devinent les champs nullable. (3) Conditions de course dans le code asynchrone — les agents ne pensent pas aux requêtes concurrentes. (4) Validation d'entrée manquante — les agents font confiance à toutes les entrées implicitement. (5) Hypothèses d'environnement codées en dur — les agents intègrent des URL localhost ou des configs pour le développement seulement.",
    },
    {
      type: 'code-demo',
      title: 'Patron 1 : Frontières d\'erreur manquantes',
      body: "Le bogue d'agent le plus courant. L'agent construit un beau composant qui fonctionne parfaitement quand les données chargent — mais lance une exception non gérée quand l'API retourne une erreur ou que la forme des données est inattendue. En production, ça se manifeste par un écran blanc.",
      language: 'typescript',
      filename: 'src/dashboard/stats.tsx',
      code: `// What the agent built (works in happy path):
function DashboardStats() {
  const { data } = useQuery('stats', fetchStats)
  return (
    <div>
      <h2>Revenue: \${data.revenue.toLocaleString()}</h2>
      {/*  data can be undefined while loading */}
      {/*  data.revenue can be null from API */}
      {/*  No loading state, no error state */}
    </div>
  )
}

// What production needs:
function DashboardStats() {
  const { data, isLoading, error } = useQuery('stats', fetchStats)

  if (isLoading) return <StatsSkeleton />
  if (error) return <StatsError message={error.message} onRetry={refetch} />
  if (!data) return null

  return (
    <div>
      <h2>Revenue: \${(data.revenue ?? 0).toLocaleString()}</h2>
    </div>
  )
}`,
    },
    {
      type: 'code-demo',
      title: 'Patron 2 : Hypothèses erronées sur la forme des données',
      body: "Les agents lisent tes définitions de types et supposent que chaque champ est toujours présent. En réalité, les API retournent des données partielles, des champs optionnels, et des valeurs null. Ça plante à l'exécution quand l'agent fait `user.profile.avatar.url` sans vérifications de null.",
      language: 'typescript',
      filename: 'src/api/handlers/user.ts',
      code: `// What the agent built:
export async function getUser(req: Request) {
  const user = await db.users.findUnique({ where: { id: req.params.id } })
  return Response.json({
    name: user.name,           //  user might be null (not found)
    avatar: user.profile.url,  //  profile might be null
    teamName: user.team.name,  //  team might not be loaded
  })
}

// What production needs:
export async function getUser(req: Request) {
  const user = await db.users.findUnique({
    where: { id: req.params.id },
    include: { profile: true, team: true },
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json({
    name: user.name,
    avatar: user.profile?.url ?? null,
    teamName: user.team?.name ?? 'No team',
  })
}`,
    },
    {
      type: 'multiple-choice',
      question: 'Quel ajout à la spec préviendrait le PLUS efficacement les bogues de « frontière d\'erreur manquante » ?',
      options: [
        '« Assure-toi de gérer les erreurs » (instruction générale)',
        '« Chaque composant qui récupère des données doit afficher trois états : squelette de chargement, erreur avec bouton de réessai, et succès avec accès null-safe »',
        '« Utilise try-catch dans toutes les fonctions async »',
        '« Ajoute des frontières d\'erreur autour de tous les composants »',
      ],
      correctIndex: 1,
      explanation: "Des exigences spécifiques et concrètes fonctionnent. « Gérer les erreurs » est trop vague — les agents l'interprètent comme « ajouter un try-catch quelque part ». La deuxième option spécifie exactement à quoi la sortie devrait ressembler : trois états, avec des détails sur chacun. Les agents suivent des patrons concrets de façon fiable.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu connais les cinq patrons. Maintenant, mettons en place la surveillance pour les attraper.',
    },

    // === SENTRY SETUP FOR AGENT-BUILT CODE ===
    {
      type: 'info',
      title: 'Suivi d\'erreurs ajusté pour le code construit par agents',
      body: "Le suivi d'erreurs standard te dit CE QUI a cassé. Pour les systèmes construits par agents, tu as aussi besoin de savoir QUELLE SESSION AGENT a produit le code, pour pouvoir retracer le bogue jusqu'à la spec qui l'a causé. La technique : taguer les déploiements avec des métadonnées d'agent pour que Sentry regroupe les erreurs par la version de spec qui les a produites.",
    },
    {
      type: 'code-demo',
      title: 'Configuration Sentry avec traçabilité des agents',
      body: "Ajoute des tags de version qui correspondent à tes sessions d'agent. Quand une erreur se déclenche, tu peux immédiatement voir : ce code a été produit par l'Agent 3 (payments), durant l'exécution de flotte #7, à partir de la spec version 2.1. Maintenant tu sais exactement quelle spec améliorer.",
      language: 'typescript',
      filename: 'src/lib/monitoring.ts',
      code: `import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Tag with deployment metadata
  release: process.env.COMMIT_SHA,

  // Custom tags for agent traceability
  initialScope: {
    tags: {
      // Which fleet run produced this code
      fleet_run: process.env.FLEET_RUN_ID || 'manual',
      // Deployment timestamp (correlate with agent sessions)
      deployed_at: new Date().toISOString(),
    },
  },

  // Capture unhandled promise rejections (Pattern 1)
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Capture user session replay for error context
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Sample 100% of errors, 10% of transactions
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

// Helper: add agent context to manual error reports
export function reportAgentBug(error: Error, context: {
  component: string
  expectedBehavior: string
  actualBehavior: string
}) {
  Sentry.captureException(error, {
    tags: { bug_type: 'agent_introduced' },
    extra: context,
  })
}`,
    },
    {
      type: 'terminal',
      instruction: 'Installe Sentry pour ton projet React + Node.js :',
      expectedCommand: 'npm install @sentry/react @sentry/node',
      hint: 'Installe @sentry/react (frontend) et @sentry/node (backend)',
    },
    {
      type: 'code-fill',
      instruction: 'Complète la configuration Sentry pour la surveillance du code construit par agents. Remplis le DSN, l\'environnement et les paramètres de taux d\'échantillonnage.',
      language: 'typescript',
      filename: 'src/lib/monitoring.ts',
      template: `import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: {{dsn_value}},
  environment: {{env_value}},

  release: process.env.COMMIT_SHA,

  initialScope: {
    tags: {
      fleet_run: process.env.FLEET_RUN_ID || 'manual',
      deployed_at: new Date().toISOString(),
    },
  },

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate: {{traces_rate}},
  replaysOnErrorSampleRate: 1.0,
})`,
      blanks: [
        { id: 'dsn_value', answer: 'process.env.SENTRY_DSN', alternatives: ['process.env.SENTRY_DSN', 'process.env.NEXT_PUBLIC_SENTRY_DSN'], placeholder: 'variable d\'env pour le DSN', hint: 'Le DSN doit venir d\'une variable d\'environnement, pas codé en dur' },
        { id: 'env_value', answer: 'process.env.NODE_ENV', alternatives: ['process.env.NODE_ENV', "process.env.VERCEL_ENV || 'development'"], placeholder: 'variable d\'env pour l\'environnement', hint: 'Quelle variable d\'env standard contient "production", "development", etc. ?' },
        { id: 'traces_rate', answer: '0.1', alternatives: ['0.1', '0.10'], placeholder: 'taux d\'échantillonnage (0-1)', hint: 'Échantillonner 10% des transactions pour équilibrer coût et visibilité' },
      ],
      explanation: 'Le DSN et l\'environnement doivent venir de variables d\'environnement — les coder en dur est une des erreurs d\'agent les plus courantes. Un taux d\'échantillonnage de transactions à 10% équilibre le coût d\'observabilité avec la couverture. Les replays d\'erreurs à 100% capturent chaque session d\'erreur pour le débogage.',
    },

    // === TRACING ERRORS TO AGENT SESSIONS ===
    {
      type: 'info',
      title: 'Retracer une erreur jusqu\'à sa source',
      body: "Une alerte Sentry se déclenche : `TypeError: Cannot read property 'name' of undefined` dans `src/payments/checkout.ts:47`. Tu dois répondre : quel agent a écrit ça, quelle spec suivait-il, et qu'est-ce qui manquait dans la spec ? Le chemin de traçage : erreur → SHA du commit → git blame → branche du worktree → fichier de spec.",
    },
    {
      type: 'code-demo',
      title: 'La procédure de remontée',
      body: "Ce script automatise le traçage d'une erreur de production jusqu'à la session d'agent qui l'a produite. Il utilise git blame pour trouver le commit, puis mappe le commit à une branche (worktree) et un fichier de spec.",
      language: 'bash',
      filename: 'scripts/trace-to-agent.sh',
      code: `#!/bin/bash
# Trace a production bug to its agent source
FILE=$1  # e.g., "src/payments/checkout.ts"
LINE=$2  # e.g., "47"

echo "=== Tracing $FILE:$LINE ==="

# 1. Find the commit that last modified this line
COMMIT=$(git blame -L "$LINE,$LINE" "$FILE" | awk '{print $1}')
echo "Commit: $COMMIT"

# 2. Find which branch introduced this commit
BRANCH=$(git branch --contains "$COMMIT" | grep -v main | head -1 | xargs)
echo "Branch: $BRANCH"

# 3. Get the commit message (should reference spec/task)
echo "Message: $(git log -1 --format='%s' "$COMMIT")"

# 4. Show the full context of the buggy code
echo ""
echo "=== Code context ==="
git show "$COMMIT" -- "$FILE" | head -50

# 5. Suggest spec improvement
echo ""
echo "=== Action ==="
echo "Update the spec for agent '$BRANCH' to prevent this pattern."
echo "Bug class: check the file for missing null checks, error states, or validation."`,
    },
    {
      type: 'terminal',
      instruction: 'Utilise git blame pour trouver quel commit a introduit la ligne 47 d\'un fichier problématique :',
      expectedCommand: 'git blame -L 47,47 src/payments/checkout.ts',
      hint: 'Utilise git blame avec -L pour cibler une plage de lignes spécifique',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu peux retracer n\'importe quelle erreur de production jusqu\'à la session d\'agent qui l\'a produite.',
    },

    // === THE SPEC IMPROVEMENT FEEDBACK LOOP ===
    {
      type: 'info',
      title: 'Boucler la boucle : des erreurs qui améliorent les specs',
      body: "Chaque erreur de production représente une lacune dans ta spécification. L'erreur te dit exactement ce qui manquait. Une erreur de référence null signifie que tu n'as pas spécifié la gestion des null. Un timeout signifie que tu n'as pas spécifié la logique de réessai. Un plantage sur un tableau vide signifie que tu n'as pas spécifié les états vides. Suis ces patrons et ajoute-les à une liste de vérification d'« exigences de spec » que chaque nouvelle spec doit satisfaire.",
    },
    {
      type: 'code-demo',
      title: 'Exigences de spec dérivées des erreurs de production',
      body: "Ce document vivant grandit avec chaque incident de production. Avant de lancer un agent, tu vérifies la spec contre cette liste. Chaque règle existe parce que son absence a causé un bogue en production. C'est la mémoire institutionnelle du développement dirigé par agents.",
      language: 'markdown',
      filename: 'specs/REQUIREMENTS.md',
      code: `# Spec Requirements Checklist
(Each rule added after a production incident)

## Data Handling
- [ ] All API responses specify behavior for: success, error, empty, null
- [ ] Optional/nullable fields are explicitly listed with defaults
- [ ] Array operations handle empty arrays (no .length on undefined)
- [ ] Date/time values specify timezone handling

## Error States
- [ ] Every data-fetching component has: loading, error, success, empty states
- [ ] API handlers return proper status codes (404, 422, 500)
- [ ] External service calls have timeout + retry configuration
- [ ] Rate limit handling is specified for third-party APIs

## Security
- [ ] Input validation on all user-provided data (query params, body, headers)
- [ ] Authentication check before data access
- [ ] No secrets/keys in client-side code
- [ ] CORS configuration specified explicitly

## Environment
- [ ] No hardcoded URLs (use env vars)
- [ ] Feature flags for gradual rollout
- [ ] Logging includes request ID for traceability`,
    },
    {
      type: 'multiple-choice',
      question: 'Tu as eu trois incidents de production ce mois-ci causés par des agents qui ne gèrent pas les réponses API nullable. Quelle est la correction avec le plus grand effet de levier ?',
      options: [
        'Ajouter des vérifications de null à l\'exécution dans tout le code existant',
        'Ajouter « tous les champs de réponse API peuvent être null — gérer avec des valeurs par défaut » à chaque nouvelle spec',
        'Passer à une configuration TypeScript plus stricte avec noUncheckedIndexedAccess',
        'B et C — l\'amélioration de spec prévient les futurs bogues, les types stricts les attrapent à la compilation',
      ],
      correctIndex: 3,
      explanation: "Défense en profondeur. L'amélioration de spec (B) empêche les agents d'écrire du code non sécuritaire contre les nullable dès le départ. La rigueur TypeScript (C) attrape ceux qui passent à travers à la compilation. Aucune des deux seule ne suffit — les agents essaieront quand même d'accéder aux champs nullable même avec des types stricts si la spec ne leur dit pas de gérer les null explicitement.",
    },

    // === MONITORING DASHBOARDS ===
    {
      type: 'info',
      title: 'Quoi surveiller dans les systèmes construits par agents',
      body: "La surveillance standard (disponibilité, latence, taux d'erreur) s'applique. Mais pour les systèmes construits par agents, ajoute ceci : (1) Taux d'erreur par chemin de fichier — si le code d'un agent a plus d'erreurs que les autres, sa spec était faible. (2) Taux de rejets de promesse non gérés — les agents laissent fréquemment des chaînes de promesses non gérées. (3) Erreurs TypeScript attrapées à l'exécution — signale que l'agent a contourné le système de types.",
    },
    {
      type: 'code-demo',
      title: 'Patrons de surveillance Vercel + Sentry',
      body: "Combine les analytiques intégrées de Vercel avec Sentry pour une surveillance complète du code construit par agents. La frontière d'erreur personnalisée attrape les plantages React et les tague pour la traçabilité des agents.",
      language: 'typescript',
      filename: 'src/components/error-boundary.tsx',
      code: `import * as Sentry from '@sentry/react'
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName: string  // For tracing back to agent
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AgentCodeBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      tags: {
        component: this.props.componentName,
        error_boundary: 'agent_code',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded bg-red-50">
          <p className="text-red-800">Something went wrong in {this.props.componentName}.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Ta surveillance est ajustée pour les patrons d\'échec spécifiques aux agents.',
    },

    // === PREVENTING RECURRENCE ===
    {
      type: 'info',
      title: 'L\'étape de vérification : attraper les bogues avant le déploiement',
      body: "Le meilleur bogue de production est celui qui n'atteint jamais la production. Après qu'un agent a terminé son travail, exécute une passe de vérification ciblant spécifiquement les patrons d'échec connus des agents. Ce n'est pas une révision de code standard — c'est une liste de vérification ajustée à ce que les agents font mal.",
    },
    {
      type: 'checklist',
      title: 'Vérification pré-déploiement pour le code construit par agents',
      items: [
        'Chaque composant/endpoint gère les entrées null et undefined',
        'Les états de chargement et d\'erreur existent pour toutes les opérations asynchrones',
        'Aucune URL, clé ou valeur spécifique à l\'environnement codée en dur',
        'Les appels d\'API externes ont une configuration de timeout et de réessai',
        'Les entrées des utilisateurs/requêtes sont validées avant traitement',
        'Les messages d\'erreur sont adaptés à l\'utilisateur (pas de traces de pile brutes)',
        'Les instructions console.log retirées (les agents laissent du logging de débogage)',
        'Aucun commentaire TODO laissé par l\'agent (ils ajoutent des TODO aspirationnels)',
        'Les tests couvrent les chemins d\'erreur, pas seulement les chemins heureux',
        'Le mode strict TypeScript passe (pas de types any, pas d\'assertions de type)',
      ],
    },
    {
      type: 'code-demo',
      title: 'Script de vérification pré-déploiement automatisé',
      body: "Exécute ceci avant chaque fusion pour attraper les patrons d'agent les plus courants. C'est rapide (moins de 10 secondes) et attrape des problèmes qui deviendraient des bogues de production.",
      language: 'bash',
      filename: 'scripts/agent-code-check.sh',
      code: `#!/bin/bash
# Pre-deploy check for agent-introduced patterns
echo "=== Agent Code Quality Check ==="
ISSUES=0

# Check for console.log (agents leave debug logging)
LOGS=$(grep -r "console.log" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOGS" -gt 0 ]; then
  echo "[WARN] $LOGS files with console.log statements"
  ((ISSUES++))
fi

# Check for hardcoded localhost
LOCALHOST=$(grep -r "localhost" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOCALHOST" -gt 0 ]; then
  echo "[FAIL] $LOCALHOST files with hardcoded localhost"
  ((ISSUES++))
fi

# Check for TODO comments
TODOS=$(grep -r "TODO" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$TODOS" -gt 3 ]; then
  echo "[WARN] $TODOS TODO comments (agents leave aspirational TODOs)"
  ((ISSUES++))
fi

# Check for 'any' type usage
ANYS=$(grep -r ": any" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$ANYS" -gt 0 ]; then
  echo "[WARN] $ANYS uses of 'any' type (agent couldn't resolve types)"
  ((ISSUES++))
fi

# TypeScript strict check
echo ""
echo "Running TypeScript strict check..."
npx tsc --noEmit --strict 2>&1 | tail -5

echo ""
echo "=== $ISSUES issues found ==="
exit $ISSUES`,
    },

    // === PUTTING IT TOGETHER ===
    {
      type: 'order',
      instruction: 'Ordonne correctement la boucle de rétroaction de surveillance en production :',
      items: [
        'Une erreur se déclenche en production (alerte Sentry)',
        'Remonter au commit et à la branche de l\'agent (git blame)',
        'Classifier le patron de bogue (état d\'erreur manquant, hypothèse null, etc.)',
        'Corriger le problème immédiat en urgence',
        'Ajouter le patron à la liste de vérification des exigences de spec',
        'Mettre à jour le script de vérification pré-déploiement pour attraper ce patron',
      ],
      correctOrder: [0, 1, 2, 3, 4, 5],
    },
    {
      type: 'multiple-choice',
      question: 'Après avoir corrigé la même classe de bogue trois fois (vérifications de null manquantes), quelle est la solution la plus efficace à long terme ?',
      options: [
        'Réviser tout le code d\'agent manuellement avant chaque déploiement',
        'Ajouter une règle de lint qui signale les accès de propriétés sans chaînage optionnel',
        'Inclure « tous les champs sont potentiellement null » dans chaque spec',
        'B et C — la détection automatisée + la prévention par spec élimine la classe entière',
      ],
      correctIndex: 3,
      explanation: "La règle de lint l'attrape mécaniquement (aucune attention humaine requise). Le changement de spec empêche l'agent de l'écrire dès le départ. Ensemble, ils éliminent toute la classe de bogue. La révision manuelle ne passe pas à l'échelle et les humains manquent des choses.",
    },
    {
      type: 'checklist',
      title: 'Maîtrise de la surveillance en production',
      items: [
        'Je peux retracer les erreurs de production jusqu\'à la session d\'agent qui les a produites',
        'Je reconnais les cinq patrons de bogues courants introduits par les agents',
        'Je maintiens une liste vivante d\'exigences de spec à partir des incidents de production',
        'J\'exécute une vérification pré-déploiement ajustée aux patrons d\'échec des agents',
        'Je boucle la boucle de rétroaction : chaque erreur améliore la prochaine spec',
        'Je mets en place des frontières d\'erreur avec des tags de traçabilité d\'agent',
        'Je distingue entre les bogues à corriger maintenant et les patrons à prévenir pour toujours',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Surveillance en production apprise ! Chaque erreur t\'enseigne comment écrire de meilleures specs la prochaine fois.',
    },
  ],
}

export default content
