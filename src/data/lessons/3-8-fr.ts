import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-8',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Vérifications qualité automatisées pour le code généré par l\'IA',
      body: "Les agents produisent du code vite — une flotte de 5 peut générer des milliers de lignes en quelques minutes. Ta revue manuelle peut pas suivre le rythme. La solution : des pipelines de vérification automatisés qui valident chaque branche d'agent avant qu'elle touche à main. Vérification de types, linting, tests, vérifications d'intégration — tout automatisé, tout obligatoire.",
    },
    {
      type: 'info',
      title: 'La règle : aucune fusion non vérifiée',
      body: "C'est le principe non négociable : aucune sortie d'agent ne fusionne dans main sans passer le pipeline. Ça importe pas si l'agent dit que ça marche. Ça importe pas si ça a l'air correct. Si le pipeline échoue, le code ne fusionne pas. Cette seule règle prévient l'échec multi-agents le plus courant : livrer des intégrations cassées.",
    },

    // === DIAGRAM 1: The Pipeline (Interactif) ===
    {
      type: 'interactive-diagram',
      title: 'Étapes du pipeline de vérification',
      body: "Chaque étape attrape une classe différente d'erreurs. Elles s'exécutent dans l'ordre de vitesse — les vérifications les plus rapides en premier, les plus lentes en dernier. Si une étape précoce échoue, les suivantes ne s'exécutent pas. Ça donne du feedback rapide : tu sais en quelques secondes s'il y a une erreur de type, pas en minutes.",
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'push', label: 'Push de l\'agent', sublabel: 'Branche prête', shape: 'rounded' },
          { id: 'type', label: 'Vérif. types', sublabel: 'tsc --noEmit', shape: 'rect' },
          { id: 'lint', label: 'Lint', sublabel: 'eslint', shape: 'rect' },
          { id: 'unit', label: 'Tests unitaires', sublabel: 'vitest', shape: 'rect' },
          { id: 'int', label: 'Intégration', sublabel: 'vérif. e2e', shape: 'rect' },
          { id: 'pass', label: 'Réussi', sublabel: 'Prêt à fusionner', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'push', to: 'type' },
          { from: 'type', to: 'lint', label: 'réussi' },
          { from: 'lint', to: 'unit', label: 'réussi' },
          { from: 'unit', to: 'int', label: 'réussi' },
          { from: 'int', to: 'pass', label: 'réussi' },
        ],
      },
      stages: [
        {
          highlightNodes: ['push', 'type'],
          highlightEdges: [{ from: 'push', to: 'type' }],
          explanation: 'L\'agent pousse sa branche. Le pipeline commence par la vérification la plus rapide : le typage TypeScript (2-5 secondes). Ça détecte immédiatement les décalages de contrats entre les sorties des agents.',
        },
        {
          highlightNodes: ['type', 'lint'],
          highlightEdges: [{ from: 'type', to: 'lint' }],
          explanation: 'Si les types passent, le linting s\'exécute ensuite. Ça enforce les conventions du CLAUDE.md : pas de `any`, pas d\'exports par défaut, pas de fichiers barrel. Attraper la dérive de conventions avant qu\'elle ne s\'accumule.',
        },
        {
          highlightNodes: ['lint', 'unit'],
          highlightEdges: [{ from: 'lint', to: 'unit' }],
          explanation: 'Un lint propre signifie une structure de code propre. Maintenant les tests unitaires vérifient que l\'implémentation de l\'agent fonctionne vraiment — comportement correct, gestion d\'erreurs, cas limites.',
        },
        {
          highlightNodes: ['unit', 'int'],
          highlightEdges: [{ from: 'unit', to: 'int' }],
          explanation: 'Les tests unitaires passent individuellement. Les tests d\'intégration vérifient que la sortie de cet agent fonctionne avec le reste du système — les imports se résolvent, les APIs se connectent, le build réussit.',
        },
        {
          highlightNodes: ['int', 'pass'],
          highlightEdges: [{ from: 'int', to: 'pass' }],
          explanation: 'Les quatre portes sont passées. La branche est vérifiée et prête à fusionner. Pas besoin de revue humaine pour l\'exactitude mécanique — le pipeline la garantit.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu vois le pipeline : vérif. types, lint, tests, intégration — dans cet ordre.',
    },

    // === CODE-FILL: tsconfig mode strict ===
    {
      type: 'code-fill',
      instruction: 'Complète la configuration TypeScript stricte qui détecte les décalages de contrats entre les sorties des agents. Remplis les options clés du compilateur.',
      language: 'json',
      filename: 'tsconfig.json',
      template: `{
  "compilerOptions": {
    "___BLANK_1___": true,
    "noEmit": true,
    "___BLANK_2___": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "___BLANK_3___": true,
    "___BLANK_4___": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'strict',
          alternatives: ['"strict"'],
          hint: 'L\'interrupteur principal qui active toutes les options strictes de vérification de types',
          placeholder: 'flag du mode strict',
        },
        {
          id: 'BLANK_2',
          answer: 'noUncheckedIndexedAccess',
          alternatives: ['"noUncheckedIndexedAccess"'],
          hint: 'Ajoute undefined à tout accès indexé non vérifié (obj[key] pourrait être undefined)',
          placeholder: 'sécurité d\'accès indexé',
        },
        {
          id: 'BLANK_3',
          answer: 'exactOptionalPropertyTypes',
          alternatives: ['"exactOptionalPropertyTypes"'],
          hint: 'Distingue entre définir une propriété à undefined et ne pas la définir du tout',
          placeholder: 'rigueur des propriétés optionnelles',
        },
        {
          id: 'BLANK_4',
          answer: 'forceConsistentCasingInFileNames',
          alternatives: ['"forceConsistentCasingInFileNames"'],
          hint: 'Empêche les décalages de casse dans les chemins d\'import entre OS (macOS vs Linux CI)',
          placeholder: 'application de la casse des fichiers',
        },
      ],
      explanation: 'Ces options forment la config TypeScript la plus stricte pour le développement multi-agents. `strict` attrape les erreurs de types, `noUncheckedIndexedAccess` attrape les accès non sécurisés, `exactOptionalPropertyTypes` attrape l\'ambiguïté des contrats, et `forceConsistentCasingInFileNames` prévient les échecs CI sur Linux (sensible à la casse) en développant sur macOS.',
    },

    // === PIPELINE COMPONENTS ===
    {
      type: 'info',
      title: 'Étape 1 : La vérification de types attrape les violations de contrat',
      body: "La compilation TypeScript est ta première porte. Elle attrape l'erreur multi-agents la plus courante : les exports d'un agent qui correspondent pas aux imports d'un autre agent. Si l'Agent A retourne `{ data: User }` mais que l'Agent B s'attend à `{ user: User }`, tsc le détecte en 2 secondes. Ça seul prévient 40 % des échecs d'intégration.",
    },
    {
      type: 'code-demo',
      title: 'Configuration de la vérification de types',
      body: "Configuration TypeScript stricte qui détecte les décalages de contrats entre les sorties des agents.",
      language: 'json',
      filename: 'tsconfig.json',
      code: `{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}`,
    },
    {
      type: 'info',
      title: 'Étape 2 : Le linting attrape les violations de conventions',
      body: "Les agents dérivent parfois des conventions du CLAUDE.md — utiliser `any`, créer des fichiers barrel, utiliser des exports par défaut. Le linter encode ces règles comme des vérifications automatisées. Si le CLAUDE.md dit « pas d'exports par défaut », une règle eslint l'impose mécaniquement.",
    },
    {
      type: 'code-demo',
      title: 'Règles ESLint correspondant aux contraintes du CLAUDE.md',
      body: "Chaque « pattern interdit » du CLAUDE.md devient une règle ESLint. Ça transforme des directives lisibles par l'humain en barrières applicables par la machine.",
      language: 'javascript',
      filename: 'eslint.config.js',
      code: `import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.strict,
  {
    rules: {
      // CLAUDE.md: "no any type"
      '@typescript-eslint/no-explicit-any': 'error',

      // CLAUDE.md: "no default exports"
      'no-restricted-syntax': ['error', {
        selector: 'ExportDefaultDeclaration',
        message: 'Use named exports only (CLAUDE.md rule)',
      }],

      // CLAUDE.md: "no console.log in production"
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // CLAUDE.md: "no barrel files"
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/index'],
          message: 'Import directly from source file, not barrel (CLAUDE.md rule)',
        }],
      }],
    },
  }
)`,
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi exécuter le linter APRÈS la vérification de types, pas avant ?',
      options: [
        'Le linting est plus lent que la vérification de types',
        'Les erreurs de types peuvent causer de faux avertissements de lint ; corrige les types d\'abord',
        'C\'est une convention de toujours vérifier les types en premier',
        'Le linter dépend des informations de types de tsc',
      ],
      correctIndex: 1,
      explanation: "Les erreurs de types peuvent se propager en bruit de lint — des variables inutilisées qui semblent « inutilisées » seulement parce que leur consommateur a une erreur de type, par exemple. Exécuter tsc en premier fait que les résultats de lint sont propres et actionnables, pas pollués par des échecs au niveau des types.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu sais configurer la vérification de types et le linting comme barrières du pipeline.',
    },

    // === TESTING IN AGENT SPECS ===
    {
      type: 'info',
      title: 'Étape 3 : Les tests — l\'agent les écrit dans le cadre de la tâche',
      body: "Voici l'insight clé : traite pas les tests comme une réflexion après coup que t'ajoutes post-fusion. Intègre-les dans le cahier des charges de l'agent. « Construis le système d'auth ET écris les tests pour. » L'agent produit à la fois le code et la vérification en un seul passage. Le pipeline exécute ces tests pour confirmer que la sortie fonctionne vraiment.",
    },
    {
      type: 'code-demo',
      title: 'Cahier des charges incluant les tests comme livrables',
      body: "Remarque comment les tests sont listés comme fichiers requis, pas optionnels. La définition de « terminé » inclut la réussite des tests. L'agent peut pas déclarer la tâche complète sans eux.",
      language: 'markdown',
      filename: 'TASK-AUTH.md',
      code: `# Task: Authentication System

## Required Files (code)
- src/auth/login.ts
- src/auth/signup.ts
- src/auth/middleware.ts

## Required Files (tests) ← NOT OPTIONAL
- src/auth/__tests__/login.test.ts
- src/auth/__tests__/signup.test.ts
- src/auth/__tests__/middleware.test.ts

## Test Requirements
- Login: test valid credentials, invalid credentials, missing fields
- Signup: test new user, duplicate email, weak password
- Middleware: test valid token, expired token, missing token

## Definition of Done
- [ ] All source files created
- [ ] All test files created
- [ ] \`bun test src/auth/\` passes with 0 failures`,
    },
    {
      type: 'code-demo',
      title: 'Configuration Vitest pour les tests de flotte',
      body: "Configure Vitest pour exécuter les tests par répertoire afin de pouvoir vérifier la sortie de chaque agent indépendamment avant la fusion.",
      language: 'typescript',
      filename: 'vitest.config.ts',
      code: `import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Run tests that match the changed files (for CI)
    passWithNoTests: false,

    // Coverage thresholds — agents must hit these
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },

    // Isolate test environments (no cross-contamination)
    isolate: true,

    // Resolve aliases matching tsconfig paths
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
    },
    {
      type: 'terminal',
      instruction: 'Exécute les tests seulement pour la sortie de l\'agent d\'auth :',
      expectedCommand: 'bun test src/auth/',
      hint: 'Exécute bun test avec le chemin du répertoire auth pour limiter l\'exécution des tests',
    },

    // === CI CONFIGURATION ===
    {
      type: 'info',
      title: 'Étape 4 : Pipeline CI — automatisé à chaque push',
      body: "Le pipeline s'exécute automatiquement quand un agent pousse sur sa branche. GitHub Actions (ou ton CI au choix) se déclenche au push, exécute les quatre étapes, et bloque la fusion si une étape échoue. Ça veut dire que tu peux dispatcher 5 agents et faire confiance au pipeline pour attraper les problèmes avant même que tu regardes la sortie.",
    },
    {
      type: 'code-demo',
      title: 'Workflow GitHub Actions pour les branches d\'agents',
      body: "Ce workflow se déclenche sur tout push de branche correspondant au pattern feat/* (tes branches de flotte). Il exécute toutes les étapes du pipeline dans l'ordre. Si une étape échoue, tout le workflow échoue et la branche peut pas fusionner.",
      language: 'yaml',
      filename: '.github/workflows/verify-agent.yml',
      code: `name: Verify Agent Output

on:
  push:
    branches: ['feat/**']

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Stage 1 — Type Check
        run: bunx tsc --noEmit

      - name: Stage 2 — Lint
        run: bun run lint

      - name: Stage 3 — Unit Tests
        run: bun test --coverage

      - name: Stage 4 — Build (integration check)
        run: bun run build`,
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu sais configurer le CI pour vérifier automatiquement chaque branche d\'agent.',
    },

    // === BRANCH PROTECTION ===
    {
      type: 'info',
      title: 'Protection de branche : la garantie mécanique',
      body: "Le CI exécute le pipeline, mais qu'est-ce qui t'empêche de fusionner une branche qui a échoué quand même ? Les règles de protection de branche. Configure GitHub pour exiger que le workflow « Verify Agent Output » passe avant que n'importe quelle PR puisse fusionner dans main. Ça rend la règle mécanique, pas juste sociale.",
    },
    {
      type: 'code-demo',
      title: 'Configuration de la protection de branche',
      body: "Ces règles rendent physiquement impossible la fusion d'une sortie d'agent qui n'a pas passé le pipeline. Aucune exception, aucun contournement.",
      language: 'bash',
      filename: 'terminal',
      code: `# Configure branch protection via GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection -X PUT \\
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["verify"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF`,
    },
    {
      type: 'multiple-choice',
      question: 'La branche d\'un agent échoue au pipeline à l\'étape de lint. La vérification de types et les tests passent. Que fais-tu ?',
      options: [
        'Contourner la protection de branche et fusionner — les tests passent, le lint c\'est juste du style',
        'Corriger les problèmes de lint sur la branche et re-pousser pour relancer le pipeline',
        'Désactiver l\'étape de lint — ça bloque le vrai travail',
        'Dire à l\'agent de corriger ses propres erreurs de lint',
      ],
      correctIndex: 1,
      explanation: "Corrige les problèmes de lint et re-pousse. N'outrepasse jamais le pipeline — ça crée un précédent qui érode la confiance dans le système. Les règles de lint existent parce qu'elles encodent les contraintes du CLAUDE.md. Si la règle est mauvaise, corrige la règle. Si le code la viole, corrige le code.",
    },

    // === DIAGRAM 2: Full Flow ===
    {
      type: 'diagram',
      title: 'De bout en bout : Flotte + Pipeline + Fusion',
      body: "Le flux complet du dispatch d'agents à la fusion en production. Chaque branche d'agent passe par le pipeline. Seules les branches qui passent sont fusionnées. C'est le système qui te permet de passer à l'échelle avec 5, 10, 20 agents sans crainte.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'fleet', label: 'Flotte d\'agents', sublabel: '5 agents', shape: 'rounded', highlight: true },
          { id: 'b1', label: 'Branche 1', shape: 'rect' },
          { id: 'b2', label: 'Branche 2', shape: 'rect' },
          { id: 'b3', label: 'Branche 3', shape: 'rect' },
          { id: 'pipe', label: 'Pipeline', sublabel: 'Auto-vérif.', shape: 'rect', highlight: true },
          { id: 'gate', label: 'Réussi ?', shape: 'diamond' },
          { id: 'merge', label: 'Fusion dans main', shape: 'pill', highlight: true },
          { id: 'fix', label: 'Corriger + Re-pousser', shape: 'rect' },
        ],
        edges: [
          { from: 'fleet', to: 'b1' },
          { from: 'fleet', to: 'b2' },
          { from: 'fleet', to: 'b3' },
          { from: 'b1', to: 'pipe' },
          { from: 'b2', to: 'pipe' },
          { from: 'b3', to: 'pipe' },
          { from: 'pipe', to: 'gate' },
          { from: 'gate', to: 'merge', label: 'réussi' },
          { from: 'gate', to: 'fix', label: 'échoué' },
          { from: 'fix', to: 'pipe', dashed: true },
        ],
      },
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercice : Construire ton pipeline de vérification',
      body: "Câblons un vrai pipeline. Tu vas créer les fichiers de configuration qui automatisent la vérification pour les sorties de ta flotte.",
    },
    {
      type: 'terminal',
      instruction: 'Crée le répertoire du workflow GitHub Actions :',
      expectedCommand: 'mkdir -p .github/workflows',
      hint: 'Utilise mkdir -p pour créer les répertoires imbriqués',
    },
    {
      type: 'terminal',
      instruction: 'Exécute le vérificateur de types pour confirmer qu\'il n\'y a pas d\'erreurs de type :',
      expectedCommand: 'bunx tsc --noEmit',
      hint: 'Utilise bunx pour exécuter tsc avec le drapeau --noEmit (vérifie les types sans produire de sortie)',
    },
    {
      type: 'terminal',
      instruction: 'Exécute le pipeline complet localement pour vérifier qu\'il passe avant de pousser :',
      expectedCommand: 'bunx tsc --noEmit && bun run lint && bun test && bun run build',
      hint: 'Chaîne les quatre étapes avec && pour que ça s\'arrête au premier échec',
    },
    {
      type: 'code-input',
      instruction: 'Dans le YAML GitHub Actions, quel est le pattern de déclenchement pour exécuter sur toutes les branches de fonctionnalité d\'agents ?',
      placeholder: 'branches: [...]',
      answer: "branches: ['feat/**']",
      hint: 'Les branches d\'agents suivent le préfixe feat/ avec du pattern matching glob',
    },
    {
      type: 'multiple-choice',
      question: 'Tu veux un feedback plus rapide du pipeline. Quelle étape devrais-tu avancer (moins coûteuse à exécuter, attrape les erreurs courantes) ?',
      options: [
        'Les tests d\'intégration — ils attrapent le plus de bugs',
        'La vérification de types — c\'est la plus rapide et attrape les violations de contrat',
        'L\'étape de build — si ça compile pas, rien d\'autre compte',
        'La vérification de couverture — s\'assurer que les agents ont écrit assez de tests',
      ],
      correctIndex: 1,
      explanation: "La vérification de types est quasi instantanée (2-5 secondes) et attrape l'erreur multi-agents #1 : les décalages de contrat. Elle devrait toujours être en premier. Les tests d'intégration sont précieux mais lents. Mets les vérifications peu coûteuses en premier pour un feedback rapide.",
    },
    {
      type: 'checklist',
      title: 'Liste de vérification du pipeline',
      items: [
        'Vérification de types configurée en mode strict',
        'Les règles de lint encodent les patterns interdits du CLAUDE.md',
        'Les tests sont requis dans chaque cahier des charges d\'agent',
        'Le workflow CI se déclenche automatiquement sur les branches feat/**',
        'La protection de branche exige que le pipeline passe avant la fusion',
        'Le pipeline s\'exécute localement avec une seule commande pour les vérifications pré-push',
        'Aucun mécanisme de contournement — les échecs du pipeline bloquent toutes les fusions',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Pipeline de vérification construit ! Les vérifications automatisées s\'exécutent sur chaque branche IA avant sa mise en production.',
    },
  ],
}

export default content
