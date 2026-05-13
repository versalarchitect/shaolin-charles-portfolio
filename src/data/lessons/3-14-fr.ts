import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-14',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Le sprint de flotte : livrer un produit avec des agents coordonnés',
      body: "Tout ce que tu as appris converge ici. Décomposition, worktrees, spécifications, contrats, surveillance, récupération d'erreurs, gestion du contexte — tout est synthétisé en un sprint complet. Tu vas orchestrer 4 agents construisant un tableau de bord d'équipe à partir de zéro : statut des projets, métriques de vélocité, contributions des membres et fil d'activité. À la fin, c'est fusionné et déployable.",
    },
    {
      type: 'info',
      title: 'Ce qui rend ceci différent des exercices',
      body: "Les leçons précédentes enseignaient des compétences individuelles. Ce projet de synthèse est l'orchestration complète : tu prendras des décisions en temps réel sur les dépendances, géreras de vrais conflits de fusion, interviendras quand un agent dérive, et vérifieras l'intégration inter-agents. Ce n'est pas une simulation — c'est un sprint d'ingénierie compressé où tu es le lead technique qui dirige une équipe IA.",
    },

    // === PHASE 1: DECOMPOSITION ===
    {
      type: 'info',
      title: 'Phase 1 : Décomposer le tableau de bord d\'équipe',
      body: "Le produit a quatre surfaces principales : (1) Statut des projets — des cartes montrant les projets actifs, leur progression et leur statut. (2) Métriques de vélocité — des graphiques montrant la production de l'équipe dans le temps. (3) Contributions des membres — qui a fait quoi, nombre d'activités, travaux récents. (4) Fil d'activité — flux en temps réel des actions de l'équipe. Chacun correspond à un agent.",
    },
    {
      type: 'diagram',
      title: 'Graphe de dépendances des tâches : tableau de bord d\'équipe',
      body: "La décomposition révèle les dépendances. Les modules API et Auth sont indépendants (démarrage immédiat). L'UI dépend des contrats API. Le module temps réel dépend du modèle de données d'activité. Les contrats définis en amont débloquent le parallélisme maximum.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'contracts', label: 'Contrats', sublabel: 'Tu écris en premier', shape: 'rounded', highlight: true },
          { id: 'auth', label: 'Agent 1 : Auth', sublabel: 'Connexion, rôles, sessions', shape: 'rect' },
          { id: 'api', label: 'Agent 2 : API', sublabel: 'Endpoints + BD', shape: 'rect' },
          { id: 'ui', label: 'Agent 3 : UI', sublabel: 'Composants + pages', shape: 'rect' },
          { id: 'rt', label: 'Agent 4 : Temps réel', sublabel: 'WebSocket + fil', shape: 'rect' },
          { id: 'merge', label: 'Intégration', sublabel: 'Fusion + vérification', shape: 'rect' },
          { id: 'ship', label: 'Livraison', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'contracts', to: 'auth', label: 'indépendant' },
          { from: 'contracts', to: 'api', label: 'indépendant' },
          { from: 'contracts', to: 'ui', label: 'utilise les contrats' },
          { from: 'contracts', to: 'rt', label: 'utilise les contrats' },
          { from: 'auth', to: 'merge' },
          { from: 'api', to: 'merge' },
          { from: 'ui', to: 'merge' },
          { from: 'rt', to: 'merge' },
          { from: 'merge', to: 'ship' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'En regardant ce graphe de dépendances, quels agents peuvent démarrer simultanément si tu définis les contrats en premier ?',
      options: [
        'Seulement Auth et API (UI et Temps réel ont des dépendances)',
        'Les quatre — les contrats définis en amont signifient que tout le monde a ce qu\'il faut',
        'Auth, API et UI — le Temps réel dépend du modèle de données API',
        'Aucun — tu devrais les démarrer séquentiellement par sécurité',
      ],
      correctIndex: 1,
      explanation: "Quand les contrats sont définis en amont, chaque agent a les formes de données dont il a besoin dès le départ. L'UI sait à quoi ressemblent les réponses API. Le temps réel connaît la forme des événements d'activité. Les quatre agents peuvent démarrer simultanément. C'est la puissance de la décomposition contrats-d'abord.",
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 1 complétée. Tu as un graphe de tâches avec un parallélisme maximum.',
    },

    // === PHASE 2: WORKTREE SETUP ===
    {
      type: 'info',
      title: 'Phase 2 : Configurer l\'espace de travail',
      body: "Quatre agents ont besoin de quatre environnements isolés. Les worktrees Git donnent à chaque agent son propre répertoire de travail sur sa propre branche — isolation complète avec historique partagé. Configure-les depuis une branche main propre.",
    },
    {
      type: 'terminal',
      instruction: 'Crée le premier worktree pour l\'agent Auth sur sa propre branche :',
      expectedCommand: 'git worktree add ../worktree-auth -b feat/auth',
      hint: 'Utilise git worktree add avec -b pour créer une nouvelle branche pour l\'agent auth',
    },
    {
      type: 'terminal',
      instruction: 'Crée le worktree de l\'agent API :',
      expectedCommand: 'git worktree add ../worktree-api -b feat/api',
      hint: 'Même patron : git worktree add avec un nom de branche descriptif',
    },
    {
      type: 'terminal',
      instruction: 'Crée le worktree de l\'agent UI :',
      expectedCommand: 'git worktree add ../worktree-ui -b feat/ui',
      hint: 'git worktree add ../worktree-ui -b feat/ui',
    },
    {
      type: 'terminal',
      instruction: 'Crée le worktree de l\'agent Temps réel :',
      expectedCommand: 'git worktree add ../worktree-realtime -b feat/realtime',
      hint: 'git worktree add ../worktree-realtime -b feat/realtime',
    },
    {
      type: 'terminal',
      instruction: 'Vérifie que tous les worktrees sont bien configurés :',
      expectedCommand: 'git worktree list',
      hint: 'Utilise git worktree list pour voir tous les worktrees actifs',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 2 complétée. Quatre worktrees isolés prêts pour les agents.',
    },

    // === PHASE 3: WRITE CONTRACTS AND SPECS ===
    {
      type: 'info',
      title: 'Phase 3 : Définir les contrats et les spécifications par agent',
      body: "Avant de lancer quelque agent que ce soit, tu écris : (1) les contrats d'interface qui définissent chaque frontière inter-modules, et (2) les spécifications par agent qui disent à chaque agent exactement quoi construire, quels fichiers lui appartiennent, et quelles contraintes suivre. Ça prend 10-15 minutes et sauve des heures de douleur d'intégration.",
    },
    {
      type: 'code-demo',
      title: 'Contrats d\'interface pour le tableau de bord d\'équipe',
      body: "Chaque agent importe ces types. Aucun agent ne modifie ce fichier. Il définit : ce que l'API produit, ce que l'UI consomme, ce que l'auth fournit, et à quoi ressemblent les événements temps réel.",
      language: 'typescript',
      filename: 'src/contracts/dashboard.ts',
      code: `// === Shared Contracts: Team Dashboard ===
// Written by orchestrator. READ-ONLY for all agents.

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'member' | 'viewer'
  avatarUrl: string | null
  teamId: string
}

export interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'archived'
  progress: number  // 0-100
  memberIds: string[]
  updatedAt: string
}

export interface VelocityData {
  date: string        // YYYY-MM-DD
  tasksCompleted: number
  pointsDelivered: number
}

export interface MemberContribution {
  userId: string
  name: string
  avatarUrl: string | null
  tasksCompleted: number
  reviewsGiven: number
  commitsCount: number
  lastActiveAt: string
}

export interface ActivityEvent {
  id: string
  userId: string
  userName: string
  action: 'created' | 'completed' | 'reviewed' | 'commented' | 'deployed'
  target: string
  targetType: 'task' | 'pr' | 'deploy' | 'comment'
  timestamp: string
}

export interface ApiResponse<T> {
  data: T | null
  error: { code: string; message: string } | null
}

export interface WsMessage {
  type: 'activity' | 'presence' | 'update'
  payload: unknown
  timestamp: string
}`,
    },
    {
      type: 'code-demo',
      title: 'Spécification par agent : exemple agent UI',
      body: "Chaque agent reçoit une spécification ciblée. Celle-ci pour l'agent UI référence les contrats, précise la propriété exacte des fichiers, décrit quoi construire, et inclut des contraintes explicites. Copie ce patron pour les quatre agents.",
      language: 'markdown',
      filename: 'specs/ui-agent.md',
      code: `# UI Agent Spec: Team Dashboard Components

## File Ownership (STRICT)
You own: src/components/dashboard/**
You may READ: src/contracts/*, src/lib/*
You MUST NOT MODIFY: anything outside src/components/dashboard/

## What to Build
1. ProjectStatusGrid — displays Project[] as cards with progress bars
2. VelocityChart — line chart from VelocityData[] (use recharts)
3. MemberList — ranked list of MemberContribution[]
4. ActivityFeed — scrollable feed of ActivityEvent[]
5. DashboardLayout — page layout composing all four components

## Data Fetching
- Use React Query hooks (useQuery)
- Endpoint paths: /api/projects, /api/velocity, /api/members, /api/activity
- Response type: ApiResponse<T> from contracts

## Required States (EVERY component)
- Loading: Skeleton placeholder matching final layout
- Error: Error message with retry button
- Empty: Helpful message ("No projects yet")
- Success: Full data rendering with null-safe access

## Constraints
- Import types ONLY from src/contracts/
- Use Tailwind CSS (no inline styles, no CSS modules)
- Responsive: mobile-first, grid cols adapt at md/lg breakpoints
- Accessible: proper aria labels, keyboard navigation`,
    },
    {
      type: 'checklist',
      title: 'Liste de vérification pré-lancement',
      items: [
        'Contrats d\'interface écrits et commités dans tous les worktrees',
        'CLAUDE.md mis à jour avec les conventions spécifiques au tableau de bord',
        'Spécification par agent écrite pour chacun des 4 agents',
        'Utilitaires partagés (lib/) créés avec les helpers communs',
        'Chaque spécification inclut des frontières de propriété de fichiers explicites',
        'Chaque spécification inclut une section « NE PAS MODIFIER »',
        'Chaque spécification exige les états chargement/erreur/vide/succès',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 3 complétée. Contrats gelés, spécifications écrites. Prêt à lancer.',
    },

    // === PHASE 4: LAUNCH THE FLEET ===
    {
      type: 'info',
      title: 'Phase 4 : Lancer les quatre agents',
      body: "C'est le moment. Quatre fenêtres de terminal (ou processus en arrière-plan). Chaque agent est pointé vers son worktree avec sa spécification. Ils vont tous commencer à construire simultanément. Ton travail passe de l'écriture à la surveillance.",
    },
    {
      type: 'code-demo',
      title: 'Commandes de lancement de la flotte',
      body: "Ouvre quatre terminaux (ou utilise tmux/screen). Chaque agent démarre dans son propre worktree avec une instruction claire pointant vers sa spécification. Le flag --worktree assure l'isolation des fichiers.",
      language: 'bash',
      filename: 'scripts/launch-fleet.sh',
      code: `#!/bin/bash
# Launch all 4 agents — run each in a separate terminal

# Terminal 1: Auth Agent
claude --worktree ../worktree-auth \
  "Follow specs/auth-agent.md. Build the authentication module. Read contracts from src/contracts/."

# Terminal 2: API Agent
claude --worktree ../worktree-api \
  "Follow specs/api-agent.md. Build all API endpoints. Read contracts from src/contracts/."

# Terminal 3: UI Agent
claude --worktree ../worktree-ui \
  "Follow specs/ui-agent.md. Build dashboard components. Read contracts from src/contracts/."

# Terminal 4: Real-time Agent
claude --worktree ../worktree-realtime \
  "Follow specs/realtime-agent.md. Build WebSocket server and activity feed. Read contracts from src/contracts/."`,
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce script de configuration de flotte. Remplis les assignations d\'agents, les chemins de worktrees et l\'ordre de fusion.',
      language: 'bash',
      filename: 'scripts/fleet-config.sh',
      template: `#!/bin/bash
# Fleet Configuration — Team Dashboard Sprint

# Agent 1: Auth module
AGENT1_WORKTREE="{{auth_path}}"
AGENT1_SPEC="specs/auth-agent.md"
AGENT1_SCOPE="src/auth/**"

# Agent 2: API module
AGENT2_WORKTREE="../worktree-api"
AGENT2_SPEC="specs/api-agent.md"
AGENT2_SCOPE="{{api_scope}}"

# Agent 3: UI module
AGENT3_WORKTREE="../worktree-ui"
AGENT3_SPEC="specs/ui-agent.md"
AGENT3_SCOPE="src/components/dashboard/**"

# Merge order (dependency-first)
MERGE_ORDER="{{merge_order}}"`,
      blanks: [
        { id: 'auth_path', answer: '../worktree-auth', alternatives: ['../worktree-auth'], placeholder: 'chemin du worktree pour auth', hint: 'Suis le même patron que les autres agents : ../worktree-{module}' },
        { id: 'api_scope', answer: 'src/api/**', alternatives: ['src/api/**', 'src/api/*'], placeholder: 'patron de propriété de fichiers API', hint: 'Quel répertoire l\'agent API possède-t-il ? Utilise un patron glob.' },
        { id: 'merge_order', answer: 'auth api ui realtime', alternatives: ['auth api ui realtime', 'auth api ui rt', 'feat/auth feat/api feat/ui feat/realtime'], placeholder: 'séquence de fusion dépendances-d\'abord', hint: 'Fondation (auth) d\'abord, puis couche de données (api), puis consommateurs (ui, realtime)' },
      ],
      explanation: 'La configuration de flotte capture les trois décisions critiques : où chaque agent travaille (isolation par worktree), ce qu\'il possède (portée des fichiers), et dans quel ordre fusionner (dépendances d\'abord). Se tromper dans l\'ordre de fusion amplifie les erreurs de types entre les branches.',
    },
    {
      type: 'terminal',
      instruction: 'Lance l\'agent auth sur son worktree (tu ferais ça dans un terminal séparé) :',
      expectedCommand: 'claude --worktree ../worktree-auth "Follow specs/auth-agent.md exactly. Build authentication with login, roles, and session management."',
      hint: 'Utilise claude --worktree en pointant vers le worktree auth avec la référence à la spécification',
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 4 complétée. La flotte est en marche. Maintenant tu surveilles.',
    },

    // === PHASE 5: MONITOR AND INTERVENE ===
    {
      type: 'info',
      title: 'Phase 5 : Surveiller la flotte',
      body: "Pendant que les agents construisent, tu es la tour de contrôle. Vérifie chaque worktree toutes les 3-5 minutes pour les signaux de santé : fréquence des commits, erreurs TypeScript, violations de frontières de fichiers. La plupart des exécutions se terminent proprement. Mais quand quelque chose tourne mal, tu le détectes tôt.",
    },
    {
      type: 'code-demo',
      title: 'Boucle de surveillance de la flotte',
      body: "Lance ceci dans un cinquième terminal. Ça te donne une vue tableau de bord de la santé des quatre agents. Vert signifie en santé (commits récents, pas d'erreurs). Jaune signifie investiguer. Rouge signifie intervenir.",
      language: 'bash',
      filename: 'scripts/monitor-fleet.sh',
      code: `#!/bin/bash
# Fleet health monitor — run in a 5th terminal

while true; do
  clear
  echo "=== FLEET STATUS $(date +%H:%M:%S) ==="
  echo ""

  for WT in auth api ui realtime; do
    DIR="../worktree-$WT"
    [ ! -d "$DIR" ] && continue

    # Last commit time
    LAST=$(git -C "$DIR" log -1 --format="%cr" 2>/dev/null || echo "no commits")

    # Uncommitted changes
    CHANGES=$(git -C "$DIR" status --porcelain | wc -l | xargs)

    # TypeScript health
    TS_ERRORS=$(cd "$DIR" && npx tsc --noEmit 2>&1 | grep -c "error TS" 2>/dev/null || echo "0")

    # Boundary check (files outside agent's domain)
    VIOLATIONS=$(git -C "$DIR" diff --name-only main 2>/dev/null | grep -v "^src/$WT" | grep -v "^src/contracts" | wc -l | xargs)

    # Status color logic
    STATUS="OK"
    [ "$TS_ERRORS" -gt 5 ] && STATUS="WARN"
    [ "$VIOLATIONS" -gt 0 ] && STATUS="BOUNDARY VIOLATION"

    printf "  %-12s | %-20s | %s changes | %s TS errors | %s\\n" \
      "$WT" "$LAST" "$CHANGES" "$TS_ERRORS" "$STATUS"
  done

  echo ""
  echo "Press Ctrl+C to stop monitoring"
  sleep 30
done`,
    },
    {
      type: 'multiple-choice',
      question: 'Le moniteur montre que l\'agent API a 12 erreurs TypeScript et son dernier commit date d\'il y a 7 minutes. L\'agent auth a 0 erreur et a commité il y a 1 minute. Que fais-tu ?',
      options: [
        'Arrêter les deux agents — les erreurs TypeScript pourraient venir d\'un mauvais contrat',
        'Investiguer l\'agent API (12 erreurs + commits stagnants = boucle potentielle), laisser auth continuer',
        'Attendre 5 minutes de plus — les 12 erreurs pourraient se résoudre pendant que l\'agent travaille',
        'Arrêter tous les agents et replanifier la décomposition',
      ],
      correctIndex: 1,
      explanation: "12 erreurs + 7 minutes sans commit est un signal fort que l'agent API est coincé. Il est probablement dans une boucle essayant de corriger des erreurs de types en cascade. Investigue immédiatement. L'agent auth est en santé (0 erreur, commit récent) — laisse-le continuer. N'arrête la flotte que si le problème est dans les contrats partagés.",
    },
    {
      type: 'checkpoint',
      xp: 10,
      message: 'Phase 5 complétée. Tu as surveillé la flotte et maintenu le cap.',
    },

    // === PHASE 6: CROSS-AGENT VERIFICATION ===
    {
      type: 'info',
      title: 'Phase 6 : Vérification inter-agents',
      body: "Les quatre agents ont terminé leur travail. Avant de fusionner, vérifie que leurs sorties sont réellement compatibles. Les contrats devraient garantir la compatibilité — mais les agents dévient parfois. Lance des vérifications inter-agents : est-ce que les endpoints API retournent ce que l'UI attend ? Est-ce que l'auth fournit ce dont les autres modules ont besoin ? Est-ce que le module temps réel émet des événements dans la forme que l'UI consomme ?",
    },
    {
      type: 'code-demo',
      title: 'Vérification de compatibilité inter-agents',
      body: "Ce script vérifie que la sortie de l'Agent A correspond aux attentes de l'Agent B. C'est essentiellement un test d'intégration que tu lances avant l'étape de fusion. Attrape les incompatibilités ici — pas après avoir fusionné 4 branches.",
      language: 'bash',
      filename: 'scripts/verify-compatibility.sh',
      code: `#!/bin/bash
# Cross-agent compatibility verification
echo "=== Cross-Agent Verification ==="

# 1. Check: API endpoints match what UI fetches
echo ""
echo "--- API ↔ UI Contract Check ---"
# Extract fetch URLs from UI code
UI_ENDPOINTS=$(grep -roh "fetch.*'/api/[^']*'" ../worktree-ui/src/ | sort -u)
# Extract route definitions from API code
API_ROUTES=$(grep -roh "router\.\(get\|post\).*'/api/[^']*'" ../worktree-api/src/ | sort -u)
echo "UI expects: $UI_ENDPOINTS"
echo "API provides: $API_ROUTES"

# 2. Check: Auth session shape matches what others import
echo ""
echo "--- Auth Session Shape Check ---"
AUTH_EXPORTS=$(grep "export" ../worktree-auth/src/auth/types.ts 2>/dev/null)
echo "Auth exports: $AUTH_EXPORTS"

# 3. Check: Real-time events match UI event handlers
echo ""
echo "--- Real-time ↔ UI Event Check ---"
RT_EVENTS=$(grep -roh "type:.*'[^']*'" ../worktree-realtime/src/ | sort -u)
UI_HANDLERS=$(grep -roh "case.*'[^']*'" ../worktree-ui/src/ | sort -u)
echo "RT emits: $RT_EVENTS"
echo "UI handles: $UI_HANDLERS"

# 4. TypeScript check across all worktrees
echo ""
echo "--- TypeScript Health ---"
for WT in auth api ui realtime; do
  ERRORS=$(cd "../worktree-$WT" && npx tsc --noEmit 2>&1 | grep -c "error TS")
  echo "  $WT: $ERRORS errors"
done`,
    },
    {
      type: 'checklist',
      title: 'Liste de vérification inter-agents',
      items: [
        'Les chemins d\'endpoints API correspondent aux appels fetch de l\'UI',
        'Les formes de réponses correspondent aux attentes des composants UI',
        'Le type de session auth correspond à ce que tous les modules importent',
        'Les types d\'événements temps réel correspondent aux handlers UI',
        'Aucune erreur TypeScript dans aucun worktree',
        'Aucun fichier modifié en dehors des frontières assignées',
        'Tous les états requis implémentés (chargement, erreur, vide, succès)',
        'Aucune URL codée en dur ou valeur spécifique à l\'environnement',
      ],
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 6 complétée. Tous les agents vérifiés compatibles avant la fusion.',
    },

    // === PHASE 7: RESOLVE CONFLICTS AND MERGE ===
    {
      type: 'info',
      title: 'Phase 7 : Fusionner la flotte',
      body: "Quatre branches, un main. Fusionne-les une à la fois dans l'ordre des dépendances : Auth d'abord (les autres peuvent en dépendre), puis API, puis UI, puis Temps réel. Après chaque fusion, lance une vérification TypeScript pour attraper les problèmes d'intégration avant qu'ils ne s'accumulent.",
    },
    {
      type: 'interactive-diagram',
      title: 'Stratégie d\'ordre de fusion de la flotte',
      body: 'Clique sur chaque étape de fusion pour voir la chronologie d\'intégration ordonnée par dépendances.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'auth', label: '1. Fusion Auth', sublabel: 'Fondation', shape: 'rect' },
          { id: 'check1', label: 'vérif tsc', shape: 'diamond' },
          { id: 'api', label: '2. Fusion API', sublabel: 'Couche de données', shape: 'rect' },
          { id: 'check2', label: 'vérif tsc', shape: 'diamond' },
          { id: 'ui', label: '3. Fusion UI', sublabel: 'Consommateur', shape: 'rect' },
          { id: 'rt', label: '4. Fusion TR', sublabel: 'Consommateur', shape: 'rect' },
          { id: 'final', label: 'Vérif finale', sublabel: 'Build + déploiement', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'auth', to: 'check1' },
          { from: 'check1', to: 'api', label: 'passe' },
          { from: 'api', to: 'check2' },
          { from: 'check2', to: 'ui', label: 'passe' },
          { from: 'ui', to: 'rt' },
          { from: 'rt', to: 'final' },
        ],
      },
      stages: [
        {
          highlightNodes: ['auth'],
          highlightEdges: [],
          explanation: 'Fusionne Auth en premier. C\'est la fondation — types de session, définitions de rôles et helpers d\'auth dont les autres modules dépendent. Lance : git merge feat/auth --no-ff',
        },
        {
          highlightNodes: ['auth', 'check1'],
          highlightEdges: [{ from: 'auth', to: 'check1' }],
          explanation: 'Lance npx tsc --noEmit après avoir fusionné auth. Si les types sont cassés ici, chaque fusion suivante amplifiera les erreurs. Corrige tout problème avant de continuer.',
        },
        {
          highlightNodes: ['check1', 'api'],
          highlightEdges: [{ from: 'check1', to: 'api' }],
          explanation: 'Fusionne l\'API ensuite. Elle importe les types auth pour la validation de session et produit les formes de réponses que l\'UI va consommer. C\'est la couche de données entre auth et consommateurs.',
        },
        {
          highlightNodes: ['api', 'check2'],
          highlightEdges: [{ from: 'api', to: 'check2' }],
          explanation: 'Encore une vérif tsc. Le module API doit passer la vérification de types proprement contre le module auth déjà fusionné. Toute incompatibilité de contrat se révèle ici — pas après avoir fusionné les quatre branches.',
        },
        {
          highlightNodes: ['check2', 'ui'],
          highlightEdges: [{ from: 'check2', to: 'ui' }],
          explanation: 'Fusionne l\'UI. Elle consomme les types de réponses API et les types de session auth. Comme les deux producteurs sont déjà fusionnés, toute incompatibilité entre les attentes de l\'UI et les formes API réelles est attrapée immédiatement.',
        },
        {
          highlightNodes: ['ui', 'rt'],
          highlightEdges: [{ from: 'ui', to: 'rt' }],
          explanation: 'Fusionne le Temps réel en dernier. Il dépend des formes d\'événements d\'activité et des types de session auth. Les conflits devraient être minimaux — principalement des fichiers de config partagés comme package.json.',
        },
        {
          highlightNodes: ['rt', 'final'],
          highlightEdges: [{ from: 'rt', to: 'final' }],
          explanation: 'Vérification finale : npx tsc --noEmit, npm run lint, npm run build. Les quatre modules compilent ensemble comme un produit unifié. Si ça passe, tu es prêt à livrer.',
        },
      ],
    },
    {
      type: 'terminal',
      instruction: 'Fusionne la branche auth dans main en premier (module fondation) :',
      expectedCommand: 'git merge feat/auth --no-ff -m "Merge auth module from fleet"',
      hint: 'Utilise git merge avec --no-ff pour préserver l\'historique des commits de fusion',
    },
    {
      type: 'terminal',
      instruction: 'Après avoir fusionné auth, lance une vérification TypeScript avant de fusionner la branche suivante :',
      expectedCommand: 'npx tsc --noEmit',
      hint: 'Lance npx tsc --noEmit pour vérifier les erreurs de types après la fusion',
    },
    {
      type: 'terminal',
      instruction: 'Fusionne la branche API (couche de données, dépend des types auth) :',
      expectedCommand: 'git merge feat/api --no-ff -m "Merge API module from fleet"',
      hint: 'Même patron de fusion pour la branche API',
    },
    {
      type: 'terminal',
      instruction: 'Fusionne la branche UI (consomme les réponses API) :',
      expectedCommand: 'git merge feat/ui --no-ff -m "Merge UI module from fleet"',
      hint: 'Fusionne feat/ui avec un message descriptif',
    },
    {
      type: 'terminal',
      instruction: 'Fusionne la branche temps réel en dernier :',
      expectedCommand: 'git merge feat/realtime --no-ff -m "Merge real-time module from fleet"',
      hint: 'Fusionne feat/realtime comme dernière branche',
    },
    {
      type: 'info',
      title: 'Gérer les conflits de fusion',
      body: "Si les contrats ont été respectés, les conflits devraient être minimaux — principalement dans les fichiers de configuration partagés (package.json, tsconfig). Résous-les manuellement : combine les ajouts de dépendances, fusionne les alias de chemins. Si tu vois des conflits dans le code source, un agent a violé sa frontière — vérifie le journal de violations de frontières de ton moniteur.",
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 7 complétée. Les quatre branches sont fusionnées. Le produit est assemblé.',
    },

    // === PHASE 8: SHIP ===
    {
      type: 'info',
      title: 'Phase 8 : Vérification finale et livraison',
      body: "Le code est fusionné. Lance la suite complète de vérification : vérification TypeScript, lint, build, et un test de fumée manuel des parcours utilisateur clés. Si tout passe, pousse sur main et déploie. Tu viens de livrer un produit construit par une flotte d'agents coordonnés.",
    },
    {
      type: 'code-demo',
      title: 'Séquence de livraison finale',
      body: "La procédure complète de livraison. Le build vérifie que tous les modules compilent ensemble. Le lint attrape les problèmes de style. Le push déclenche ton pipeline de déploiement. C'est le moment de vérité.",
      language: 'bash',
      filename: 'scripts/ship.sh',
      code: `#!/bin/bash
# Final verification and ship
set -e  # Exit on any error

echo "=== Final Verification ==="

# 1. TypeScript — full project type check
echo "Running TypeScript check..."
npx tsc --noEmit
echo "  TypeScript: PASS"

# 2. Lint — code style consistency
echo "Running linter..."
npm run lint
echo "  Lint: PASS"

# 3. Build — production bundle
echo "Running production build..."
npm run build
echo "  Build: PASS"

# 4. Tests (if available)
echo "Running tests..."
npm test -- --passWithNoTests
echo "  Tests: PASS"

echo ""
echo "=== All Checks Passed ==="
echo ""

# 5. Ship it
echo "Pushing to main..."
git push origin main

echo ""
echo "Deployed. Team Dashboard built by 4 coordinated agents."
echo "Total fleet time: ~15 minutes"
echo "Equivalent serial time: ~60 minutes"`,
    },
    {
      type: 'terminal',
      instruction: 'Lance le build de production pour vérifier que tous les modules compilent ensemble :',
      expectedCommand: 'npm run build',
      hint: 'Utilise npm run build pour vérifier le bundle de production complet',
    },
    {
      type: 'terminal',
      instruction: 'Pousse sur main pour déclencher le déploiement :',
      expectedCommand: 'git push origin main',
      hint: 'git push origin main déploie via ton pipeline CI/CD',
    },
    {
      type: 'terminal',
      instruction: 'Nettoie les worktrees maintenant que tout est fusionné :',
      expectedCommand: 'git worktree remove ../worktree-auth && git worktree remove ../worktree-api && git worktree remove ../worktree-ui && git worktree remove ../worktree-realtime',
      hint: 'Supprime les quatre worktrees avec git worktree remove',
    },
    {
      type: 'checkpoint',
      xp: 20,
      message: 'Phase 8 complétée. Produit livré. Opération de flotte réussie.',
    },

    // === RETROSPECTIVE ===
    {
      type: 'info',
      title: 'Rétrospective : ce que tu viens de faire',
      body: "Tu as décomposé un produit en graphe de tâches, configuré des worktrees isolés, écrit des contrats et des spécifications, lancé 4 agents en parallèle, surveillé leur progression, vérifié la compatibilité inter-agents, résolu des conflits de fusion, et livré un produit déployable. C'est la maîtrise de l'orchestration — la compétence qui transforme les agents IA de jouets en force d'ingénierie de production.",
    },
    {
      type: 'diagram',
      title: 'Le sprint de flotte complet',
      body: "Le flux d'orchestration complet que tu viens d'exécuter. Chaque phase s'appuie sur la précédente. L'orchestrateur (toi) est la constante — dirigeant, surveillant, intervenant et livrant.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'decompose', label: '1. Décomposer', shape: 'rect' },
          { id: 'setup', label: '2. Worktrees', shape: 'rect' },
          { id: 'specs', label: '3. Spécifications', shape: 'rect' },
          { id: 'launch', label: '4. Lancer', shape: 'rect', highlight: true },
          { id: 'monitor', label: '5. Surveiller', shape: 'rect' },
          { id: 'verify', label: '6. Vérifier', shape: 'rect' },
          { id: 'merge', label: '7. Fusionner', shape: 'rect' },
          { id: 'ship', label: '8. Livrer', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'decompose', to: 'setup' },
          { from: 'setup', to: 'specs' },
          { from: 'specs', to: 'launch' },
          { from: 'launch', to: 'monitor' },
          { from: 'monitor', to: 'verify' },
          { from: 'verify', to: 'merge' },
          { from: 'merge', to: 'ship' },
        ],
      },
    },
    {
      type: 'checklist',
      title: 'Maîtrise de l\'orchestration de flotte — liste de vérification complète',
      items: [
        'Je décompose les produits en tâches indépendantes, de taille agent, avec des frontières claires',
        'Je définis les contrats d\'interface AVANT de lancer quelque agent que ce soit',
        'Je configure des worktrees isolés pour que les agents ne puissent pas interférer entre eux',
        'J\'écris des spécifications par agent ciblées avec propriété de fichiers et contraintes explicites',
        'Je surveille la santé de la flotte et détecte les défaillances en quelques minutes',
        'J\'isole les agents défaillants sans perturber la flotte en santé',
        'Je vérifie la compatibilité inter-agents avant de fusionner',
        'Je fusionne dans l\'ordre des dépendances avec des vérifications de types entre chaque fusion',
        'Je résous les conflits provenant des fichiers de configuration partagés',
        'Je lance la vérification complète (types, lint, build, tests) avant de livrer',
        'Je compresse un flux séquentiel de 60 minutes en 15 minutes d\'exécution parallèle',
        'Je boucle la boucle : les observations en production améliorent les spécifications futures',
      ],
    },
    {
      type: 'checkpoint',
      xp: 30,
      message: 'PALIER 3 COMPLÉTÉ ! Tu peux orchestrer plusieurs agents IA qui construisent en parallèle. C\'est du niveau avancé.',
    },
  ],
}

export default content
