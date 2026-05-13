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
      type: 'multiple-choice',
      question: 'Quel est le patron de bogue #1 le plus courant dans le code construit par les agents ?',
      options: [
        'Problèmes de performance — les agents écrivent des algorithmes lents',
        'Frontières d\'erreur manquantes — les agents gèrent le chemin heureux mais sautent les états d\'erreur, de chargement et null',
        'Vulnérabilités de sécurité — les agents exposent des secrets dans le code client',
        'Fuites mémoire — les agents créent des objets sans nettoyage',
      ],
      correctIndex: 1,
      explanation: "Après avoir surveillé des centaines de déploiements construits par agents, les frontières d'erreur manquantes dominent. Les agents construisent de beaux composants qui fonctionnent parfaitement quand les données chargent mais lancent des exceptions non gérées quand l'API retourne une erreur ou null. Les quatre autres patrons courants : hypothèses erronées sur la forme des données, conditions de course dans le code async, validation d'entrée manquante, et hypothèses d'environnement codées en dur.",
    },
    {
      type: 'compare',
      title: 'Patron 1 vs Patron 2 : frontières d\'erreur vs hypothèses de forme de données',
      body: 'Les deux sont des bogues d\'agent majeurs. Les deux plantent en production. Corrections différentes.',
      question: 'Quel patron cause un écran blanc quand l\'API retourne une erreur ?',
      correctSide: 'left',
      left: {
        label: 'Frontières d\'erreur manquantes',
        content: '// L\'agent construit le chemin heureux seul :\nfunction DashboardStats() {\n  const { data } = useQuery("stats", fetchStats)\n  return (\n    <div>\n      <h2>Revenue: ${data.revenue.toLocaleString()}</h2>\n    </div>\n  )\n}\n// data est undefined pendant le chargement -> CRASH\n// data.revenue est null depuis l\'API -> CRASH\n// Pas d\'état de chargement, pas d\'état d\'erreur\n\n// Correction : Trois états (chargement, erreur, succès)\n// Plus accès null-safe avec valeurs par défaut ??',
        language: 'typescript',
      },
      right: {
        label: 'Mauvaise forme de données',
        content: '// L\'agent suppose que tous les champs existent :\nexport async function getUser(req: Request) {\n  const user = await db.users.findUnique({\n    where: { id: req.params.id }\n  })\n  return Response.json({\n    name: user.name,\n    avatar: user.profile.url,\n    teamName: user.team.name,\n  })\n}\n// user peut être null (non trouvé) -> CRASH\n// profile peut être null -> CRASH\n// team peut ne pas être chargé -> CRASH\n\n// Correction : vérif null + chaînage optionnel\n// user.profile?.url ?? null',
        language: 'typescript',
      },
      explanation: 'Les frontières d\'erreur manquantes causent des écrans blancs dans les composants React. Les mauvaises hypothèses de forme de données causent des erreurs 500 dans les handlers API. Les deux viennent du fait que les agents supposent que chaque champ est toujours présent. La correction de spec : « Chaque composant qui récupère des données doit afficher trois états : chargement, erreur, et succès avec accès null-safe. »',
    },
    {
      type: 'code-fill',
      instruction: 'Corrige le composant construit par l\'agent en ajoutant la gestion correcte du chargement, de l\'erreur et de la sécurité null. Remplis les états manquants.',
      language: 'typescript',
      filename: 'src/dashboard/stats.tsx',
      template: `function DashboardStats() {
  const { data, isLoading, error } = useQuery('stats', fetchStats)

  if (___BLANK_1___) return <StatsSkeleton />
  if (___BLANK_2___) return <StatsError message={error.message} onRetry={refetch} />
  if (!data) return null

  return (
    <div>
      <h2>Revenue: \${(data.revenue ___BLANK_3___ 0).toLocaleString()}</h2>
    </div>
  )
}`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'isLoading',
          alternatives: ['isLoading'],
          hint: 'L\'état du hook de requête qui indique que les données sont encore en cours de récupération',
          placeholder: 'vérification de chargement',
        },
        {
          id: 'BLANK_2',
          answer: 'error',
          alternatives: ['error', '!!error'],
          hint: 'L\'état du hook de requête qui indique un échec de récupération',
          placeholder: 'vérification d\'erreur',
        },
        {
          id: 'BLANK_3',
          answer: '??',
          alternatives: ['??'],
          hint: 'L\'opérateur de coalescence null — retourne le côté droit seulement si le gauche est null ou undefined',
          placeholder: 'opérateur null-safe',
        },
      ],
      explanation: 'Trois états sont obligatoires pour chaque composant qui récupère des données : chargement (squelette), erreur (avec réessai), et succès (avec accès null-safe via ??). L\'opérateur de coalescence null `??` fournit une valeur par défaut seulement pour null/undefined, contrairement à `||` qui attrape aussi 0 et les chaînes vides.',
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
      type: 'multiple-choice',
      question: 'Le suivi d\'erreurs standard te dit CE QUI a cassé. Pour les systèmes construits par agents, quelle info supplémentaire te faut-il ?',
      options: [
        'Quel langage de programmation a été utilisé',
        'Quelle session d\'agent a produit le code, pour retracer le bogue à la spec',
        'Combien d\'utilisateurs ont été affectés par l\'erreur',
        'Quelle suite de tests couvre le code cassé',
      ],
      correctIndex: 1,
      explanation: "Pour les systèmes construits par agents, tu as besoin de savoir QUELLE SESSION AGENT a produit le code pour retracer le bogue à la spec qui l'a causé. Tague les déploiements avec des métadonnées d'agent (ID d'exécution de flotte, SHA du commit) pour que Sentry regroupe les erreurs par la version de spec qui les a produites.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète le Sentry init avec des tags de traçabilité des agents. Remplis les tags personnalisés qui mappent les erreurs aux sessions d\'agent.',
      language: 'typescript',
      filename: 'src/lib/monitoring.ts',
      template: `import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.COMMIT_SHA,

  initialScope: {
    tags: {
      fleet_run: process.env.___BLANK_1___ || 'manual',
      deployed_at: new Date().___BLANK_2___(),
    },
  },

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: ___BLANK_3___,
})`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'FLEET_RUN_ID',
          alternatives: ['FLEET_RUN_ID'],
          hint: 'La variable d\'env qui identifie quelle exécution de flotte a produit ce déploiement',
          placeholder: 'var d\'env identifiant de flotte',
        },
        {
          id: 'BLANK_2',
          answer: 'toISOString',
          alternatives: ['toISOString'],
          hint: 'Méthode Date qui retourne une chaîne de timestamp standardisée',
          placeholder: 'méthode de sérialisation de date',
        },
        {
          id: 'BLANK_3',
          answer: '1.0',
          alternatives: ['1.0', '1'],
          hint: 'Capturer 100% des replays d\'erreurs — chaque session d\'erreur compte pour le débogage',
          placeholder: 'taux d\'échantillonnage de replay d\'erreur',
        },
      ],
      explanation: 'FLEET_RUN_ID corrèle les erreurs avec des exécutions de flotte spécifiques. toISOString() donne un timestamp standardisé pour corréler avec les journaux de sessions d\'agent. Un taux de replay d\'erreur de 100% (1.0) garantit que tu captures chaque session d\'erreur pour le débogage.',
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
      type: 'code-fill',
      instruction: 'Complète le script de remontée qui mappe une erreur de production à la session d\'agent qui l\'a produite. Remplis les commandes git.',
      language: 'bash',
      filename: 'scripts/trace-to-agent.sh',
      template: `#!/bin/bash
# Trace a production bug to its agent source
FILE=$1  # e.g., "src/payments/checkout.ts"
LINE=$2  # e.g., "47"

echo "=== Tracing $FILE:$LINE ==="

# 1. Find the commit that last modified this line
COMMIT=$(___BLANK_1___ | awk '{print $1}')
echo "Commit: $COMMIT"

# 2. Find which branch introduced this commit
BRANCH=$(___BLANK_2___ | grep -v main | head -1 | xargs)
echo "Branch: $BRANCH"

# 3. Get the commit message
echo "Message: $(___BLANK_3___)"

echo ""
echo "=== Action ==="
echo "Update the spec for agent '$BRANCH' to prevent this pattern."`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'git blame -L "$LINE,$LINE" "$FILE"',
          alternatives: ['git blame -L "$LINE,$LINE" "$FILE"'],
          hint: 'Commande git qui montre qui a modifié en dernier une plage de lignes spécifique dans un fichier',
          placeholder: 'commande git blame',
        },
        {
          id: 'BLANK_2',
          answer: 'git branch --contains "$COMMIT"',
          alternatives: ['git branch --contains "$COMMIT"'],
          hint: 'Commande git qui liste les branches contenant un commit spécifique',
          placeholder: 'trouver la branche du commit',
        },
        {
          id: 'BLANK_3',
          answer: 'git log -1 --format=\'%s\' "$COMMIT"',
          alternatives: ['git log -1 --format=\'%s\' "$COMMIT"', 'git log -1 --format="%s" "$COMMIT"'],
          hint: 'Montrer juste la ligne de sujet d\'un commit spécifique',
          placeholder: 'commande du message de commit',
        },
      ],
      explanation: 'Le chemin de traçage : erreur -> git blame (trouve le commit) -> git branch --contains (trouve la branche de l\'agent) -> git log (trouve la référence de spec). Ça mappe un TypeError de production directement à la session d\'agent et la spec qui l\'a produit.',
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
      type: 'multiple-choice',
      question: 'Une erreur de référence null se déclenche en production. Qu\'est-ce que ça te dit sur ta spec ?',
      options: [
        'L\'agent a introduit un bogue — les agents ne sont pas fiables',
        'La spec n\'a pas spécifié la gestion des null pour ce chemin de données — chaque erreur est une lacune de spec',
        'Les types TypeScript étaient faux — corrige les définitions de type',
        'La suite de tests était incomplète — ajoute plus de tests',
      ],
      correctIndex: 1,
      explanation: "Chaque erreur de production représente une lacune dans ta spécification. Une erreur de référence null signifie que tu n'as pas spécifié la gestion des null. Un timeout signifie que tu n'as pas spécifié la logique de réessai. Un plantage sur un tableau vide signifie que tu n'as pas spécifié les états vides. Suis ces patrons et ajoute-les à une liste de vérification d'exigences de spec.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète la liste de vérification des exigences de spec dérivées des erreurs de production. Remplis les exigences manquantes pour la gestion des données et les états d\'erreur.',
      language: 'markdown',
      filename: 'specs/REQUIREMENTS.md',
      template: `# Spec Requirements Checklist
(Each rule added after a production incident)

## Data Handling
- [ ] All API responses specify behavior for: success, error, empty, ___BLANK_1___
- [ ] Optional/nullable fields are explicitly listed with defaults
- [ ] Array operations handle empty arrays (no .length on undefined)

## Error States
- [ ] Every data-fetching component has: loading, error, success, ___BLANK_2___ states
- [ ] API handlers return proper status codes (404, 422, 500)
- [ ] External service calls have ___BLANK_3___ configuration

## Security
- [ ] Input validation on all user-provided data
- [ ] No secrets/keys in client-side code

## Environment
- [ ] No hardcoded URLs (use env vars)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'null',
          alternatives: ['null'],
          hint: 'Le quatrième état que les réponses API doivent gérer — quand un champ n\'a pas de valeur',
          placeholder: 'état de données manquantes',
        },
        {
          id: 'BLANK_2',
          answer: 'empty',
          alternatives: ['empty', 'vide'],
          hint: 'Le quatrième état UI quand la récupération réussit mais retourne aucun résultat (ex: liste vide)',
          placeholder: 'état sans résultats',
        },
        {
          id: 'BLANK_3',
          answer: 'timeout + retry',
          alternatives: ['timeout + retry', 'timeout and retry', 'timeout et retry'],
          hint: 'Les services externes peuvent être lents ou instables — deux configs nécessaires pour la résilience',
          placeholder: 'configs de résilience',
        },
      ],
      explanation: 'Ce document vivant grandit avec chaque incident de production. Chaque règle existe parce que son absence a causé un bogue. La gestion des null, les états vides, et la configuration timeout + retry sont les trois exigences de spec les plus souvent manquantes. Avant de lancer un agent, vérifie la spec contre cette liste.',
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
      type: 'multiple-choice',
      question: 'Au-delà de la surveillance standard (disponibilité, latence, taux d\'erreur), que faut-il ajouter pour les systèmes construits par agents ?',
      options: [
        'Métriques de complexité du code et complexité cyclomatique',
        'Taux d\'erreur par chemin de fichier, taux de rejets de promesse non gérés, et erreurs TypeScript à l\'exécution',
        'Fréquence de commits git et lignes de code par agent',
        'Utilisation mémoire par composant et suivi de la taille du bundle',
      ],
      correctIndex: 1,
      explanation: "Pour les systèmes construits par agents, ajoute : (1) Taux d'erreur par chemin de fichier — si le code d'un agent a plus d'erreurs, sa spec était faible. (2) Taux de rejets de promesse non gérés — les agents laissent fréquemment des chaînes de promesses non gérées. (3) Erreurs TypeScript à l'exécution — signale que l'agent a contourné le système de types.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète la frontière d\'erreur React qui attrape les plantages dans le code construit par agents et les tague pour la traçabilité Sentry.',
      language: 'typescript',
      filename: 'src/components/error-boundary.tsx',
      template: `import * as Sentry from '@sentry/react'
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName: string
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
    Sentry.___BLANK_1___(error, {
      tags: {
        component: this.props.___BLANK_2___,
        error_boundary: 'agent_code',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render() {
    if (this.state.___BLANK_3___) {
      return this.props.fallback || (
        <div>Something went wrong in {this.props.componentName}.</div>
      )
    }
    return this.props.children
  }
}`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'captureException',
          alternatives: ['captureException'],
          hint: 'La méthode Sentry qui rapporte une erreur au tableau de bord',
          placeholder: 'méthode de capture d\'erreur Sentry',
        },
        {
          id: 'BLANK_2',
          answer: 'componentName',
          alternatives: ['componentName'],
          hint: 'La prop qui identifie quel composant (module agent) a planté — pour la traçabilité',
          placeholder: 'prop d\'identifiant de composant',
        },
        {
          id: 'BLANK_3',
          answer: 'hasError',
          alternatives: ['hasError'],
          hint: 'Le booléen d\'état qui suit si une erreur a été attrapée',
          placeholder: 'flag d\'état d\'erreur',
        },
      ],
      explanation: 'La frontière d\'erreur attrape les plantages React et les tague avec le componentName — mappant le plantage au module agent qui l\'a produit. `captureException` envoie l\'erreur à Sentry avec des tags personnalisés pour le filtrage. Le flag d\'état `hasError` déclenche l\'UI de fallback au lieu d\'un écran blanc.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Ta surveillance est ajustée pour les patrons d\'échec spécifiques aux agents.',
    },

    // === PREVENTING RECURRENCE ===
    {
      type: 'multiple-choice',
      question: 'Quel est le meilleur bogue de production ?',
      options: [
        'Un qui est attrapé rapidement par Sentry avec le contexte complet',
        'Un qui n\'affecte qu\'un petit pourcentage d\'utilisateurs',
        'Un qui n\'atteint jamais la production — attrapé dans la vérification pré-déploiement',
        'Un qui a une correction évidente que tu peux livrer en minutes',
      ],
      correctIndex: 2,
      explanation: "Le meilleur bogue de production est celui qui n'atteint jamais la production. Après qu'un agent a terminé son travail, exécute une passe de vérification ciblant les patrons d'échec connus des agents. Ce n'est pas une révision de code standard — c'est une liste de vérification ajustée à ce que les agents font mal : vérifications null manquantes, URL codées en dur, logging de débogage, et tests chemin-heureux-seulement.",
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
      type: 'code-fill',
      instruction: 'Complète le script de vérification pré-déploiement qui attrape les patrons d\'agent courants. Remplis les patrons grep qui détectent le logging de débogage, les URL codées en dur, et les échappatoires de type.',
      language: 'bash',
      filename: 'scripts/agent-code-check.sh',
      template: `#!/bin/bash
echo "=== Agent Code Quality Check ==="
ISSUES=0

# Check for debug logging (agents leave console.log)
LOGS=$(grep -r "___BLANK_1___" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOGS" -gt 0 ]; then
  echo "[WARN] $LOGS files with console.log statements"
  ((ISSUES++))
fi

# Check for hardcoded URLs
LOCALHOST=$(grep -r "___BLANK_2___" src/ --include="*.ts" --include="*.tsx" -l | wc -l)
if [ "$LOCALHOST" -gt 0 ]; then
  echo "[FAIL] $LOCALHOST files with hardcoded localhost"
  ((ISSUES++))
fi

# Check for type escape hatches
ANYS=$(grep -r "___BLANK_3___" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$ANYS" -gt 0 ]; then
  echo "[WARN] $ANYS uses of 'any' type"
  ((ISSUES++))
fi

echo "=== $ISSUES issues found ==="
exit $ISSUES`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'console.log',
          alternatives: ['console.log', '"console.log"'],
          hint: 'La fonction de logging de débogage JavaScript que les agents laissent derrière eux',
          placeholder: 'patron de logging de débogage',
        },
        {
          id: 'BLANK_2',
          answer: 'localhost',
          alternatives: ['localhost', '"localhost"'],
          hint: 'Le nom d\'hôte du développement local qui ne devrait jamais apparaître dans le code de production',
          placeholder: 'patron d\'URL codée en dur',
        },
        {
          id: 'BLANK_3',
          answer: ': any',
          alternatives: [': any', '": any"'],
          hint: 'L\'annotation de type TypeScript que les agents utilisent quand ils ne peuvent pas résoudre les types',
          placeholder: 'patron d\'échappatoire de type',
        },
      ],
      explanation: 'Ce script s\'exécute en moins de 10 secondes et attrape les patrons d\'agent les plus courants : `console.log` (logging de débogage laissé derrière), `localhost` (URL de développement codées en dur), et `: any` (échappatoires de type où l\'agent a abandonné la sécurité des types). Exécute-le avant chaque fusion.',
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
