import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-6',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Utiliser un agent IA pour vérifier le travail d\'un autre',
      body: "L'Agent A construit une fonctionnalité. Tu pourrais la réviser toi-même. Mais il y a un meilleur coup : envoyer l'Agent B vérifier systématiquement la sortie de l'Agent A par rapport au cahier des charges. C'est pas une revue de code — c'est de la vérification structurée. L'Agent B a un contexte frais, aucun biais d'investissement, et peut attraper ce que l'Agent A a manqué parce qu'il n'était pas émotionnellement attaché à l'implémentation.",
    },
    {
      type: 'info',
      title: 'Pourquoi les agents vérifient mieux que le constructeur',
      body: "Quand tu construis quelque chose, tu développes des angles morts. Tu sais ce que tu voulais faire, alors tu vois l'intention plutôt que ce qui est vraiment là. Un deuxième agent lit le code à froid — sans présupposés, sans contamination de contexte. Il évalue purement par rapport au cahier des charges. C'est le même principe que la revue de code, mais automatisé et systématique.",
    },

    // === DIAGRAM 1: Build → Verify → Decide (Interactif) ===
    {
      type: 'interactive-diagram',
      title: 'La boucle de vérification',
      body: "L'agent de construction produit une sortie. L'agent de vérification l'évalue par rapport au cahier des charges. Il retourne un verdict structuré : réussite, échec avec raisons, ou réussite partielle avec les écarts précis. Tu prends la décision finale.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Cahier des charges', sublabel: 'Exigences', shape: 'rounded' },
          { id: 'build', label: 'Agent constructeur', sublabel: 'Crée le code', shape: 'rect' },
          { id: 'output', label: 'Sortie', sublabel: 'Branche/PR', shape: 'rect' },
          { id: 'verify', label: 'Agent vérificateur', sublabel: 'Vérifie le cahier', shape: 'rect', highlight: true },
          { id: 'verdict', label: 'Verdict', sublabel: 'Réussite/Échec', shape: 'diamond' },
          { id: 'human', label: 'Toi', sublabel: 'Décision finale', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'build', label: 'implémente' },
          { from: 'build', to: 'output' },
          { from: 'spec', to: 'verify', label: 'vérifie contre' },
          { from: 'output', to: 'verify', label: 'évalue' },
          { from: 'verify', to: 'verdict' },
          { from: 'verdict', to: 'human' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec', 'build'],
          highlightEdges: [{ from: 'spec', to: 'build' }],
          explanation: 'L\'agent constructeur reçoit le cahier des charges et implémente la fonctionnalité. Il produit du code basé sur les exigences.',
        },
        {
          highlightNodes: ['build', 'output'],
          highlightEdges: [{ from: 'build', to: 'output' }],
          explanation: 'Le constructeur génère une sortie — une branche ou PR contenant l\'implémentation.',
        },
        {
          highlightNodes: ['spec', 'output', 'verify'],
          highlightEdges: [{ from: 'spec', to: 'verify' }, { from: 'output', to: 'verify' }],
          explanation: 'L\'agent vérificateur reçoit le cahier des charges ET la sortie. Il vérifie la sortie contre chaque exigence — aucun contexte partagé avec le constructeur.',
        },
        {
          highlightNodes: ['verify', 'verdict'],
          highlightEdges: [{ from: 'verify', to: 'verdict' }],
          explanation: 'Le vérificateur retourne un verdict structuré : RÉUSSITE, ÉCHEC (avec raisons), ou PARTIEL (avec les écarts précis). Aucune ambiguïté.',
        },
        {
          highlightNodes: ['verdict', 'human'],
          highlightEdges: [{ from: 'verdict', to: 'human' }],
          explanation: 'Tu prends la décision finale basée sur le verdict. Corrige les petits problèmes toi-même, envoie des corrections au constructeur, ou re-spécifie si le constructeur a fondamentalement mal compris.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu vois la boucle de vérification : construire, vérifier, décider.',
    },

    // === PROMPT LAB: Écrire un prompt de vérification ===
    {
      type: 'prompt-lab',
      instruction: 'Écris un prompt de vérification qui demande à un agent vérificateur de contrôler l\'implémentation d\'authentification de l\'agent constructeur.',
      scenario: 'Un agent constructeur vient d\'implémenter login/signup avec Supabase Auth. Tu as besoin d\'un second agent pour vérifier : politiques RLS correctes, aucune clé de service exposée, gestion de session correcte, et états d\'erreur.',
      starterPrompt: 'Check the auth code.',
      responses: [
        {
          triggerKeywords: ['rls', 'service', 'key', 'session'],
          response: 'Verification report for auth implementation:\n\n✅ RLS enabled on all user-facing tables\n✅ Service role key only used in server actions\n⚠️ Session refresh not implemented — tokens will expire\n❌ Missing error handling on signup — no duplicate email check\n\n2 issues found, 1 critical.',
          quality: 'excellent',
          feedback: 'Ton prompt a spécifié les domaines de vérification exacts : politiques RLS, exposition de clés, gestion de session, et états d\'erreur. L\'agent vérificateur savait exactement quoi vérifier.',
        },
        {
          triggerKeywords: ['auth', 'check', 'security'],
          response: 'I reviewed the auth code. It looks good overall. The login flow works and users can sign up. I\'d suggest adding some tests.\n\nVerdict: Approved.',
          quality: 'poor',
          feedback: 'Sans critères de vérification spécifiques, le vérificateur a juste survolé et approuvé. Spécifie exactement quoi vérifier : politiques RLS, patterns d\'exposition de clés, cycle de vie des sessions, et gestion d\'erreurs.',
        },
      ],
      fallbackResponse: {
        response: 'What specifically should I check? The auth system has many components.',
        feedback: 'Ton prompt était trop vague. Un bon prompt de vérification spécifie : (1) quels fichiers vérifier, (2) quelles propriétés de sécurité contrôler, (3) quels patterns chercher, et (4) ce qui constitue une réussite vs un échec.',
      },
    },

    // === WHAT VERIFICATION IS NOT ===
    {
      type: 'info',
      title: 'La vérification, ce N\'EST PAS une revue de code',
      body: "La revue de code demande : est-ce du bon code ? La vérification demande : est-ce que ça respecte le cahier des charges ? Une fonction peut avoir un code magnifique mais rater une exigence. Ou du code laid qui satisfait parfaitement chaque contrainte. La vérification évalue la complétude et l'exactitude par rapport à un standard défini — pas le style, pas l'élégance, pas l'astuce.",
    },
    {
      type: 'multiple-choice',
      question: 'Lequel est une préoccupation de vérification vs une préoccupation de revue de code ?',
      options: [
        'La fonction utilise var au lieu de const (revue de code)',
        'L\'endpoint de login ne retourne pas un JWT comme spécifié (vérification)',
        'Le composant a trop de props (revue de code)',
        'A et C sont de la revue de code ; B est de la vérification',
      ],
      correctIndex: 3,
      explanation: "La vérification contrôle par rapport au cahier des charges : est-ce que le login retourne un JWT ? C'est une exigence réussite/échec. Les questions de style (var vs const, nombre de props) relèvent de la revue de code — c'est important, mais c'est distinct de la conformité au cahier des charges.",
    },

    // === SETTING UP VERIFICATION ===
    {
      type: 'info',
      title: 'Configurer l\'agent vérificateur',
      body: "L'agent vérificateur a besoin d'exactement deux entrées : le cahier des charges (ce qui devait être construit) et la sortie (ce qui a été réellement construit). Il n'a PAS besoin de l'historique de conversation de l'agent constructeur — ça contaminerait sa perspective fraîche. Donne-lui la branche, donne-lui le cahier des charges, demande-lui de vérifier.",
    },
    {
      type: 'code-demo',
      title: 'Modèle de prompt de vérification',
      body: "C'est le prompt que tu donnes à l'agent de vérification. Il est structuré pour forcer une vérification systématique plutôt qu'un balayage impressionniste.",
      language: 'markdown',
      filename: 'VERIFY-PROMPT.md',
      code: `# Verification Task

## Your Role
You are a verification agent. Your job is to systematically check
whether the implementation meets every requirement in the spec.
You have NO knowledge of how or why it was built this way.
Evaluate only what exists against what was required.

## The Spec (what should exist)
[paste the original task spec here]

## The Output (what to verify)
Branch: feat/auth
Files to check: src/auth/*

## Verification Checklist
For each requirement in the spec, report:
- PASS: requirement fully met
- FAIL: requirement not met (explain what's missing)
- PARTIAL: partially met (explain the gap)

## Also Check
- Are there files outside the specified scope?
- Are shared contracts imported correctly?
- Do the types match the contracts.ts definitions?
- Are there any hardcoded values that should be configurable?

## Output Format
Return a structured verdict with pass/fail per requirement.`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu sais configurer un agent de vérification avec les bonnes entrées.',
    },

    // === VERIFICATION CRITERIA ===
    {
      type: 'info',
      title: 'Au-delà de "ça compile" : critères de vérification',
      body: "La compilation est la barre la plus basse. Un fichier peut compiler et être complètement faux. La vérification va plus loin : est-ce que ça répond aux exigences fonctionnelles ? Est-ce que ça gère les cas limites ? Est-ce que ça respecte les contraintes architecturales du CLAUDE.md ? Est-ce que ça s'intègre proprement avec le reste du système ?",
    },
    {
      type: 'code-demo',
      title: 'Critères de vérification structurés',
      body: "Donne ces catégories à vérifier à ton agent vérificateur. Chacune attrape une classe différente d'erreurs que les agents constructeurs font couramment.",
      language: 'markdown',
      filename: 'verification-criteria.md',
      code: `# Verification Criteria (ordered by severity)

## 1. Functional Completeness
- Every requirement in the spec has a corresponding implementation
- No spec item is missing or only partially implemented
- Edge cases mentioned in the spec are handled

## 2. Contract Compliance
- Types match src/types/contracts.ts exactly
- API responses use the correct wrapper format
- Function signatures match agreed interfaces

## 3. Architectural Compliance (CLAUDE.md)
- Uses specified libraries (not alternatives)
- Follows file naming conventions
- No forbidden patterns (any, barrel files, etc.)
- Imports from correct paths

## 4. Integration Readiness
- Exports are named correctly for consumers
- No implicit dependencies on unbuilt features
- Environment variables documented if new ones added

## 5. Testability
- Tests exist for each public function/endpoint
- Tests cover both happy path and error cases
- Tests are runnable in isolation (no external dependencies)`,
    },
    {
      type: 'order',
      instruction: 'Classe les critères de vérification du PLUS critique (haut) au MOINS critique :',
      items: [
        'Complétude fonctionnelle (tous les items du cahier des charges implémentés)',
        'Conformité des contrats (les types correspondent aux interfaces convenues)',
        'Le style de code suit les conventions du projet',
        'Préparation à l\'intégration (les exports fonctionnent pour les consommateurs)',
      ],
      correctOrder: [0, 1, 3, 2],
    },

    // === CATCHING INTEGRATION ISSUES ===
    {
      type: 'info',
      title: 'Détecter les problèmes d\'intégration entre sorties parallèles',
      body: "Le rôle le plus précieux de l'agent vérificateur : détecter les problèmes qui n'apparaissent que quand tu combines les sorties de plusieurs agents. L'Agent A exporte une fonction. L'Agent B l'importe avec des paramètres attendus différents. Aucun agent n'a tort individuellement — le décalage n'apparaît qu'à l'intégration. L'agent vérificateur contrôle ces coutures.",
    },
    {
      type: 'code-demo',
      title: 'Prompt de vérification d\'intégration',
      body: "Pour vérifier les points d'intégration, tu donnes à l'agent vérificateur les sorties des DEUX agents et tu lui demandes de vérifier les coutures — les endroits où la sortie d'un agent se connecte à celle de l'autre.",
      language: 'markdown',
      filename: 'VERIFY-INTEGRATION.md',
      code: `# Integration Verification

## Check These Seams

### Auth → API (middleware import)
- src/api/routes/tasks.ts imports from src/auth/middleware.ts
- Verify: does the import path exist? Does the middleware
  export match what the API expects?

### API → UI (response shapes)
- src/components/task-list.tsx consumes GET /tasks response
- Verify: does the component's type annotation match the
  actual API response shape?

### Auth → UI (token handling)
- src/components/login-form.tsx stores JWT from auth response
- Verify: does the login response shape match what the
  form component expects to receive?

## For Each Seam, Report:
- Exporter: what's actually exported (function signature, type)
- Consumer: what's expected by the importer
- Match: YES (compatible) or NO (explain the mismatch)`,
    },
    {
      type: 'multiple-choice',
      question: 'L\'Agent A exporte `getUser(id: string): Promise<User>`. L\'Agent B appelle `getUser(id: string, includeProfile: boolean)`. L\'agent vérificateur devrait :',
      options: [
        'Signaler l\'Agent B comme fautif — ça ne correspond pas à l\'export',
        'Signaler l\'Agent A comme fautif — il manque le paramètre',
        'Signaler un décalage de contrat — le cahier des charges doit clarifier l\'interface',
        'Ignorer — TypeScript va le détecter à la compilation',
      ],
      correctIndex: 2,
      explanation: "Aucun agent n'a individuellement tort — chacun a interprété l'exigence différemment. C'est un trou dans le contrat. L'agent vérificateur le signale pour que toi (l'orchestrateur) puisses décider : ajouter le paramètre au contrat, ou retirer l'hypothèse de l'Agent B. TypeScript VA le détecter, mais l'agent vérificateur le détecte plus tôt et avec le contexte du pourquoi.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu sais vérifier les coutures d\'intégration entre les sorties d\'agents parallèles.',
    },

    // === THE VERIFICATION LOOP IN PRACTICE ===
    {
      type: 'info',
      title: 'La boucle complète : Construire → Vérifier → Corriger → Vérifier',
      body: "Quand la vérification trouve des problèmes, tu as trois options : le corriger toi-même (petit problème), envoyer une correction à l'agent constructeur (problème moyen), ou relancer l'agent constructeur avec un cahier des charges mis à jour (incompréhension fondamentale). La plupart des problèmes sont petits — un gestionnaire d'erreur manquant, une annotation de type incorrecte. Ce sont des corrections rapides.",
    },
    {
      type: 'code-demo',
      title: 'Sortie réelle d\'une vérification',
      body: "Voici à quoi ressemble la sortie structurée d'un agent de vérification. Claire, actionnable, aucune ambiguïté sur ce qui doit être corrigé.",
      language: 'markdown',
      filename: 'verification-report.md',
      code: `# Verification Report: Auth Agent Output

## Functional Completeness
- [PASS] Login returns JWT on valid credentials
- [PASS] Signup creates user and returns JWT
- [FAIL] Middleware rejects expired tokens — no expiry check found
- [PARTIAL] Zod schemas — login schema exists, signup missing email format validation

## Contract Compliance
- [PASS] User type matches contracts.ts
- [PASS] ApiResponse wrapper used correctly
- [FAIL] JWT payload missing 'role' field (spec requires { userId, email, role })

## Architectural Compliance
- [PASS] Uses specified bcrypt library for hashing
- [PASS] Files named in kebab-case
- [PASS] Named exports only, no default exports

## Integration Readiness
- [PASS] Middleware exported correctly for API agent to import
- [FAIL] Token verification function not exported (API agent will need it)

## Summary
4 PASS | 3 FAIL | 1 PARTIAL
Blocking issues: expired token handling, JWT role field, token verify export`,
    },

    // === DIAGRAM 2: Multi-Agent Verify Pattern ===
    {
      type: 'diagram',
      title: 'Vérification croisée dans une flotte',
      body: "Dans une flotte de 4 agents, tu peux utiliser un seul agent de vérification dédié qui contrôle toutes les sorties séquentiellement. Ou tu peux faire de la vérification croisée : l'Agent 2 vérifie la sortie de l'Agent 1, l'Agent 3 vérifie celle de l'Agent 2, etc. Le vérificateur dédié est plus simple ; la vérification croisée est plus approfondie.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'b1', label: 'Build 1', sublabel: 'Auth', shape: 'rect' },
          { id: 'b2', label: 'Build 2', sublabel: 'API', shape: 'rect' },
          { id: 'b3', label: 'Build 3', sublabel: 'UI', shape: 'rect' },
          { id: 'v', label: 'Agent vérificateur', sublabel: 'Vérifie tout', shape: 'rect', highlight: true },
          { id: 'report', label: 'Rapport', sublabel: 'Réussite/Échec par agent', shape: 'rounded' },
          { id: 'you', label: 'Toi', sublabel: 'Agit sur le rapport', shape: 'rounded', highlight: true },
        ],
        edges: [
          { from: 'b1', to: 'v', label: 'sortie 1' },
          { from: 'b2', to: 'v', label: 'sortie 2' },
          { from: 'b3', to: 'v', label: 'sortie 3' },
          { from: 'v', to: 'report' },
          { from: 'report', to: 'you' },
        ],
      },
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercice : Écrire un prompt de vérification',
      body: "Tu as lancé une flotte. L'Agent 1 a construit un système d'authentification. Tu dois vérifier sa sortie avant de fusionner. Écris le prompt de vérification qu'un autre agent utilisera pour contrôler systématiquement le travail.",
    },
    {
      type: 'terminal',
      instruction: 'Vérifie ce que l\'agent d\'authentification a réellement produit (lister les fichiers) :',
      expectedCommand: 'find src/auth -type f -name "*.ts" | sort',
      hint: 'Utilise find pour lister tous les fichiers TypeScript dans le répertoire auth',
    },
    {
      type: 'code-input',
      instruction: 'Écris le premier critère de vérification. Il doit vérifier si l\'endpoint de login retourne ce que le cahier des charges exige :',
      placeholder: '- [?] Login endpoint returns ...',
      answer: '- [ ] Login endpoint returns ApiResponse<{ token: string }> on valid credentials',
      hint: 'Vérifie l\'exigence fonctionnelle : est-ce que le login retourne la bonne forme de réponse ?',
    },
    {
      type: 'multiple-choice',
      question: 'Tu reçois le rapport de vérification. 2 items sont ÉCHEC, 8 sont RÉUSSITE. Que fais-tu ?',
      options: [
        'Rejeter toute la sortie et relancer l\'agent constructeur',
        'Corriger les 2 échecs toi-même — c\'est probablement petit',
        'Envoyer les 2 échecs spécifiques à l\'agent constructeur pour correction, puis re-vérifier',
        'N\'importe laquelle de ces options selon la gravité des échecs',
      ],
      correctIndex: 3,
      explanation: "Le contexte compte. Si les échecs sont mineurs (un champ manquant, un oubli d'export), corrige-les toi-même ou envoie des corrections ciblées. S'ils sont fondamentaux (mauvaise approche, mauvaise compréhension du domaine), relance avec un cahier des charges plus clair. Y'a pas de réponse universelle.",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification inter-agents',
      items: [
        'L\'agent vérificateur reçoit le cahier des charges + la sortie, PAS la conversation de construction',
        'La vérification contrôle d\'abord la complétude fonctionnelle',
        'La conformité des contrats est vérifiée contre les types partagés',
        'Les règles architecturales du CLAUDE.md sont vérifiées',
        'Les coutures d\'intégration sont contrôlées entre les sorties des agents',
        'Verdict structuré avec RÉUSSITE/ÉCHEC par exigence',
        'L\'humain prend la décision finale de fusion/rejet basée sur le rapport',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Vérification maîtrisée ! Tu as maintenant de l\'IA qui vérifie de l\'IA. Fais confiance, mais vérifie.',
    },
  ],
}

export default content
