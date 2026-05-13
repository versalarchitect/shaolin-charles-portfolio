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
      type: 'multiple-choice',
      question: 'Le tableau de bord d\'équipe a 4 surfaces : Statut des projets, Métriques de vélocité, Contributions des membres et Fil d\'activité. Comment assigner les agents ?',
      options: [
        'Un agent construit les quatre surfaces séquentiellement',
        'Chaque surface correspond à un agent — quatre flux de travail parallèles',
        'Deux agents se partagent le travail : un pour les données, un pour l\'UI',
        'Utiliser un patron essaim avec 8 agents pour la vitesse maximale',
      ],
      correctIndex: 1,
      explanation: "Le produit a quatre surfaces principales, et chacune correspond à un agent. Ça donne le parallélisme maximum : les quatre agents peuvent construire simultanément quand les contrats sont définis en amont.",
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
      type: 'multiple-choice',
      question: 'Pourquoi quatre agents parallèles ont-ils chacun besoin de leur propre worktree git ?',
      options: [
        'Les worktrees s\'exécutent plus vite que les branches régulières',
        'Chaque agent a besoin d\'une isolation complète des fichiers sur sa propre branche — les worktrees fournissent des répertoires de travail séparés avec un historique partagé',
        'Les worktrees permettent aux agents de communiquer via des fichiers partagés',
        'Git exige des worktrees pour plus de 2 branches',
      ],
      correctIndex: 1,
      explanation: "Quatre agents ont besoin de quatre environnements isolés. Les worktrees Git donnent à chaque agent son propre répertoire de travail sur sa propre branche — isolation complète avec historique partagé. Sans worktrees, les agents écraseraient les modifications des autres dans le même répertoire de travail.",
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
      type: 'multiple-choice',
      question: 'Avant de lancer quelque agent que ce soit, quelles deux choses l\'orchestrateur doit-il écrire ?',
      options: [
        'Des suites de tests et des pipelines CI/CD',
        'Des contrats d\'interface (frontières inter-modules) et des spécifications par agent (quoi construire, propriété des fichiers, contraintes)',
        'CLAUDE.md et README.md',
        'Des migrations de base de données et de la documentation API',
      ],
      correctIndex: 1,
      explanation: "Avant de lancer quelque agent que ce soit, tu écris : (1) les contrats d'interface qui définissent chaque frontière inter-modules, et (2) les spécifications par agent qui disent à chaque agent exactement quoi construire, quels fichiers lui appartiennent, et quelles contraintes suivre. Ça prend 10-15 minutes et sauve des heures de douleur d'intégration.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ces contrats partagés pour le tableau de bord d\'équipe. Remplis les définitions de types critiques dont les quatre agents dépendent.',
      language: 'typescript',
      filename: 'src/contracts/dashboard.ts',
      template: `// === Shared Contracts: Team Dashboard ===
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
  status: {{project_status_type}}
  progress: number  // 0-100
  memberIds: string[]
  updatedAt: string
}

export interface ActivityEvent {
  id: string
  userId: string
  userName: string
  action: {{action_union}}
  target: string
  targetType: 'task' | 'pr' | 'deploy' | 'comment'
  timestamp: string
}

export interface WsMessage {
  type: {{ws_type_union}}
  payload: unknown
  timestamp: string
}`,
      blanks: [
        { id: 'project_status_type', answer: "'active' | 'completed' | 'archived'", alternatives: ["'active' | 'completed' | 'archived'", '"active" | "completed" | "archived"'], placeholder: 'union de statut de projet', hint: 'Trois états possibles : actif, complété ou archivé' },
        { id: 'action_union', answer: "'created' | 'completed' | 'reviewed' | 'commented' | 'deployed'", alternatives: ["'created' | 'completed' | 'reviewed' | 'commented' | 'deployed'"], placeholder: 'types d\'actions d\'activité', hint: 'Cinq actions : created, completed, reviewed, commented, deployed' },
        { id: 'ws_type_union', answer: "'activity' | 'presence' | 'update'", alternatives: ["'activity' | 'presence' | 'update'"], placeholder: 'types de messages WebSocket', hint: 'Trois catégories : événements d\'activité, statut de présence, mises à jour de données' },
      ],
      explanation: "Chaque agent importe ces types. Aucun agent ne modifie ce fichier. Il définit : ce que l'API produit, ce que l'UI consomme, ce que l'auth fournit, et à quoi ressemblent les événements temps réel.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette spécification d\'agent UI. Remplis les frontières de propriété de fichiers, les patrons de récupération de données et les états requis des composants.',
      language: 'markdown',
      filename: 'specs/ui-agent.md',
      template: `# UI Agent Spec: Team Dashboard Components

## File Ownership (STRICT)
You own: {{ui_ownership}}
You may READ: src/contracts/*, src/lib/*
You MUST NOT MODIFY: anything outside src/components/dashboard/

## What to Build
1. ProjectStatusGrid — displays Project[] as cards with progress bars
2. VelocityChart — line chart from VelocityData[] (use recharts)
3. MemberList — ranked list of MemberContribution[]
4. ActivityFeed — scrollable feed of ActivityEvent[]
5. DashboardLayout — page layout composing all four components

## Data Fetching
- Use {{data_fetching_lib}} hooks (useQuery)
- Endpoint paths: /api/projects, /api/velocity, /api/members, /api/activity
- Response type: ApiResponse<T> from contracts

## Required States (EVERY component)
- Loading: Skeleton placeholder matching final layout
- Error: Error message with retry button
- Empty: {{empty_state}}
- Success: Full data rendering with null-safe access`,
      blanks: [
        { id: 'ui_ownership', answer: 'src/components/dashboard/**', alternatives: ['src/components/dashboard/**', 'src/components/dashboard/*'], placeholder: 'patron glob de répertoire', hint: 'L\'agent UI possède tout dans le répertoire des composants dashboard' },
        { id: 'data_fetching_lib', answer: 'React Query', alternatives: ['React Query', 'TanStack Query', 'react-query'], placeholder: 'bibliothèque de récupération de données', hint: 'La bibliothèque de gestion d\'état serveur qui fournit les hooks useQuery' },
        { id: 'empty_state', answer: 'Helpful message ("No projects yet")', alternatives: ['Helpful message ("No projects yet")', 'Helpful message', '"No projects yet"'], placeholder: 'quoi afficher quand pas de données', hint: 'Un message convivial expliquant qu\'il n\'y a pas encore de données' },
      ],
      explanation: "Chaque agent reçoit une spécification ciblée. Celle-ci pour l'agent UI référence les contrats, précise la propriété exacte des fichiers, décrit quoi construire, et inclut des contraintes explicites.",
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
      type: 'multiple-choice',
      question: 'Quand tu lances les quatre agents, vers quoi ton rôle bascule-t-il ?',
      options: [
        'Écrire plus de code en parallèle des agents',
        'La surveillance — tu guettes les signaux de santé et tu interviens quand c\'est nécessaire',
        'Attendre que tous les agents finissent, puis tout réviser d\'un coup',
        'Tester manuellement la sortie de chaque agent au fur et à mesure',
      ],
      correctIndex: 1,
      explanation: "Une fois la flotte lancée, ton travail passe de l'écriture à la surveillance. Quatre fenêtres de terminal, quatre agents qui construisent simultanément. Tu vérifies les signaux de santé : fréquence des commits, erreurs TypeScript, violations de frontières.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce script de lancement de flotte. Remplis les chemins de worktrees et les références de spécifications pour chaque agent.',
      language: 'bash',
      filename: 'scripts/launch-fleet.sh',
      template: `#!/bin/bash
# Launch all 4 agents — run each in a separate terminal

# Terminal 1: Auth Agent
claude --worktree {{auth_worktree}} \\
  "Follow specs/auth-agent.md. Build the authentication module. Read contracts from src/contracts/."

# Terminal 2: API Agent
claude --worktree ../worktree-api \\
  "Follow {{api_spec}}. Build all API endpoints. Read contracts from src/contracts/."

# Terminal 3: UI Agent
claude --worktree ../worktree-ui \\
  "Follow specs/ui-agent.md. Build dashboard components. Read contracts from src/contracts/."

# Terminal 4: Real-time Agent
claude --worktree {{realtime_worktree}} \\
  "Follow specs/realtime-agent.md. Build WebSocket server and activity feed. Read contracts from src/contracts/."`,
      blanks: [
        { id: 'auth_worktree', answer: '../worktree-auth', alternatives: ['../worktree-auth'], placeholder: 'chemin worktree auth', hint: 'Suis la convention : ../worktree-{module}' },
        { id: 'api_spec', answer: 'specs/api-agent.md', alternatives: ['specs/api-agent.md'], placeholder: 'chemin spéc API', hint: 'Suis la convention : specs/{module}-agent.md' },
        { id: 'realtime_worktree', answer: '../worktree-realtime', alternatives: ['../worktree-realtime'], placeholder: 'chemin worktree temps réel', hint: 'Suis la convention : ../worktree-{module}' },
      ],
      explanation: "Ouvre quatre terminaux. Chaque agent démarre dans son propre worktree avec une instruction claire pointant vers sa spécification. Le flag --worktree assure l'isolation des fichiers.",
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
      type: 'multiple-choice',
      question: 'Quels trois signaux de santé dois-tu vérifier toutes les 3-5 minutes pendant que les agents construisent ?',
      options: [
        'Couverture de code, taille du bundle et statut de déploiement',
        'Fréquence des commits, erreurs TypeScript et violations de frontières de fichiers',
        'Utilisation CPU des agents, consommation mémoire et nombre de tokens',
        'Révisions de PR, statut du pipeline CI et conflits de fusion',
      ],
      correctIndex: 1,
      explanation: "Pendant que les agents construisent, tu es la tour de contrôle. Vérifie chaque worktree toutes les 3-5 minutes : fréquence des commits (l'agent progresse-t-il ?), erreurs TypeScript (le code compile-t-il ?), et violations de frontières de fichiers (l'agent reste-t-il dans son couloir ?). La détection précoce sauve des heures.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce script de surveillance de flotte. Remplis les commandes de vérification de santé qui détectent les agents bloqués et les violations de frontières.',
      language: 'bash',
      filename: 'scripts/monitor-fleet.sh',
      template: `#!/bin/bash
# Fleet health monitor — run in a 5th terminal

while true; do
  clear
  echo "=== FLEET STATUS $(date +%H:%M:%S) ==="

  for WT in auth api ui realtime; do
    DIR="../worktree-$WT"
    [ ! -d "$DIR" ] && continue

    # Last commit time
    LAST=$(git -C "$DIR" log -1 --format="{{commit_format}}" 2>/dev/null || echo "no commits")

    # TypeScript health
    TS_ERRORS=$(cd "$DIR" && {{tsc_command}} 2>&1 | grep -c "error TS" 2>/dev/null || echo "0")

    # Boundary check (files outside agent's domain)
    VIOLATIONS=$(git -C "$DIR" diff --name-only main 2>/dev/null | grep -v "^src/$WT" | grep -v "^src/contracts" | wc -l | xargs)

    # Status logic
    STATUS="OK"
    [ "$TS_ERRORS" -gt 5 ] && STATUS="WARN"
    [ "{{violation_check}}" ] && STATUS="BOUNDARY VIOLATION"
  done

  sleep 30
done`,
      blanks: [
        { id: 'commit_format', answer: '%cr', alternatives: ['%cr', '--format="%cr"'], placeholder: 'format git log', hint: 'Le placeholder de format git pour la « date relative du commit » (ex. « il y a 3 minutes »)' },
        { id: 'tsc_command', answer: 'npx tsc --noEmit', alternatives: ['npx tsc --noEmit', 'tsc --noEmit'], placeholder: 'commande de vérification TypeScript', hint: 'Lance le compilateur TypeScript sans émettre de fichiers — juste vérifier les erreurs' },
        { id: 'violation_check', answer: '$VIOLATIONS" -gt 0', alternatives: ['$VIOLATIONS" -gt 0', '"$VIOLATIONS" -gt 0'], placeholder: 'condition de frontière', hint: 'Vérifie si le nombre de violations est supérieur à zéro' },
      ],
      explanation: "Lance ceci dans un cinquième terminal. Ça te donne une vue tableau de bord de la santé des quatre agents. Vert signifie en santé, jaune signifie investiguer, rouge signifie intervenir.",
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
      type: 'multiple-choice',
      question: 'Les quatre agents ont fini. Pourquoi dois-tu vérifier la compatibilité inter-agents AVANT de fusionner ?',
      options: [
        'La fusion résout automatiquement toutes les incompatibilités de types',
        'Git rejettera les branches incompatibles pendant la fusion',
        'Les agents dévient parfois des contrats — attraper les incompatibilités avant la fusion empêche les erreurs de se multiplier à travers 4 branches',
        'La vérification inter-agents est optionnelle si les contrats étaient bien définis',
      ],
      correctIndex: 2,
      explanation: "Les contrats devraient garantir la compatibilité, mais les agents dévient parfois. Lance des vérifications inter-agents avant la fusion : est-ce que les endpoints API retournent ce que l'UI attend ? Attraper les incompatibilités avant la fusion empêche qu'elles se multiplient à travers 4 branches.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète ce script de vérification inter-agents. Remplis les patrons grep qui détectent les problèmes de compatibilité entre agents.',
      language: 'bash',
      filename: 'scripts/verify-compatibility.sh',
      template: `#!/bin/bash
# Cross-agent compatibility verification
echo "=== Cross-Agent Verification ==="

# 1. Check: API endpoints match what UI fetches
echo "--- API ↔ UI Contract Check ---"
UI_ENDPOINTS=$(grep -roh "{{ui_fetch_pattern}}" ../worktree-ui/src/ | sort -u)
API_ROUTES=$(grep -roh "router\\.\\(get\\|post\\).*'/api/[^']*'" ../worktree-api/src/ | sort -u)
echo "UI expects: $UI_ENDPOINTS"
echo "API provides: $API_ROUTES"

# 2. Check: Auth exports
AUTH_EXPORTS=$(grep "export" ../worktree-auth/src/auth/types.ts 2>/dev/null)

# 3. TypeScript check across all worktrees
echo "--- TypeScript Health ---"
for WT in {{worktree_list}}; do
  ERRORS=$(cd "../worktree-$WT" && npx tsc --noEmit 2>&1 | grep -c "error TS")
  echo "  $WT: $ERRORS errors"
done`,
      blanks: [
        { id: 'ui_fetch_pattern', answer: "fetch.*'/api/[^']*'", alternatives: ["fetch.*'/api/[^']*'"], placeholder: 'patron grep pour les appels fetch UI', hint: 'Correspond aux appels fetch() qui référencent des chemins /api/ entre guillemets simples' },
        { id: 'worktree_list', answer: 'auth api ui realtime', alternatives: ['auth api ui realtime'], placeholder: 'tous les noms de worktrees', hint: 'Liste les quatre noms de modules séparés par des espaces' },
      ],
      explanation: "Ce script vérifie que la sortie de l'Agent A correspond aux attentes de l'Agent B. C'est un test d'intégration avant la fusion. Attrape les incompatibilités ici — pas après avoir fusionné 4 branches.",
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
      type: 'multiple-choice',
      question: 'Dans quel ordre fusionner les quatre branches (Auth, API, UI, Temps réel) ?',
      options: [
        'Fusionner les quatre simultanément pour gagner du temps',
        'UI d\'abord (le plus visible), puis API, puis Auth, puis Temps réel',
        'Auth d\'abord (fondation), puis API (couche de données), puis UI et Temps réel (consommateurs)',
        'Ordre alphabétique : API, Auth, Temps réel, UI',
      ],
      correctIndex: 2,
      explanation: "Fusionne dans l'ordre des dépendances : Auth d'abord (les autres dépendent des types de session), puis API (produit les données pour les consommateurs), puis UI et Temps réel (consommateurs). Après chaque fusion, lance une vérification TypeScript pour attraper les problèmes d'intégration avant qu'ils ne s'accumulent.",
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
      type: 'multiple-choice',
      question: 'Tu vois des conflits de fusion dans le code source (pas juste les fichiers de config). Qu\'est-ce que ça indique ?',
      options: [
        'Du développement parallèle normal — résous les conflits manuellement',
        'Un agent a violé sa frontière de propriété de fichiers — vérifie le journal de violations',
        'Les contrats étaient mal définis et doivent être réécrits',
        'Tu aurais dû utiliser rebase au lieu de merge',
      ],
      correctIndex: 1,
      explanation: "Si les contrats ont été respectés, les conflits devraient être minimaux — principalement dans les fichiers de configuration partagés (package.json, tsconfig). Si tu vois des conflits dans le code source, un agent a violé sa frontière. Vérifie le journal de violations de frontières de ton moniteur pour identifier quel agent a dépassé son répertoire assigné.",
    },
    {
      type: 'checkpoint',
      xp: 15,
      message: 'Phase 7 complétée. Les quatre branches sont fusionnées. Le produit est assemblé.',
    },

    // === PHASE 8: SHIP ===
    {
      type: 'multiple-choice',
      question: 'Le code est fusionné. Quelle est la séquence de vérification finale correcte avant de livrer ?',
      options: [
        'Juste lancer le build — si ça passe, livre',
        'Vérification TypeScript, lint, build et test de fumée manuel des parcours utilisateur clés',
        'Lancer les tests seulement — TypeScript et lint sont optionnels pour la livraison',
        'Pousser sur main d\'abord, puis vérifier si le déploiement réussit',
      ],
      correctIndex: 1,
      explanation: "Lance la suite complète de vérification : vérification TypeScript (les types compilent), lint (cohérence de style), build (bundle de production), et test de fumée manuel des parcours utilisateur clés. Ne pousse sur main qu'après que tout passe. Tu viens de livrer un produit construit par une flotte d'agents coordonnés.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète cette séquence de livraison finale. Remplis les commandes de vérification qui doivent toutes passer avant de pousser.',
      language: 'bash',
      filename: 'scripts/ship.sh',
      template: `#!/bin/bash
# Final verification and ship
set -e  # Exit on any error

echo "=== Final Verification ==="

# 1. TypeScript — full project type check
echo "Running TypeScript check..."
{{tsc_check}}
echo "  TypeScript: PASS"

# 2. Lint — code style consistency
echo "Running linter..."
{{lint_command}}
echo "  Lint: PASS"

# 3. Build — production bundle
echo "Running production build..."
npm run build
echo "  Build: PASS"

echo "=== All Checks Passed ==="

# 4. Ship it
echo "Pushing to main..."
{{push_command}}

echo "Deployed. Team Dashboard built by 4 coordinated agents."`,
      blanks: [
        { id: 'tsc_check', answer: 'npx tsc --noEmit', alternatives: ['npx tsc --noEmit', 'tsc --noEmit'], placeholder: 'commande de vérification TypeScript', hint: 'Lance le compilateur TypeScript en mode vérification seule (pas de sortie de fichiers)' },
        { id: 'lint_command', answer: 'npm run lint', alternatives: ['npm run lint', 'npx eslint .'], placeholder: 'commande de lint', hint: 'Lance le linter du projet via les scripts npm' },
        { id: 'push_command', answer: 'git push origin main', alternatives: ['git push origin main', 'git push'], placeholder: 'commande de push', hint: 'Pousse la branche main vers le remote origin' },
      ],
      explanation: "La procédure complète de livraison. Le build vérifie que tous les modules compilent ensemble. Le lint attrape les problèmes de style. Le push déclenche ton pipeline de déploiement. C'est le moment de vérité.",
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
      type: 'multiple-choice',
      question: 'Quel est le nombre total de phases dans un sprint de flotte complet ?',
      options: [
        '4 phases : planifier, construire, tester, livrer',
        '6 phases : décomposer, spécifications, lancer, surveiller, fusionner, livrer',
        '8 phases : décomposer, worktrees, spécifications, lancer, surveiller, vérifier, fusionner, livrer',
        '10 phases : plus il y a de phases, meilleur est le processus',
      ],
      correctIndex: 2,
      explanation: "Tu as exécuté les 8 phases : (1) Décomposer en tâches, (2) Configurer les worktrees, (3) Écrire contrats et spécifications, (4) Lancer la flotte, (5) Surveiller la progression, (6) Vérifier la compatibilité inter-agents, (7) Fusionner dans l'ordre des dépendances, (8) Vérification finale et livraison. C'est la maîtrise de l'orchestration.",
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
