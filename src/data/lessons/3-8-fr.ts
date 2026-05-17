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
      type: 'compare',
      title: 'Vérification de types vs linting : différentes classes d\'erreurs',
      body: 'Les deux sont des barrières automatisées, mais elles attrapent des problèmes fondamentalement différents.',
      question: 'Quelle barrière attrape les décalages de contrats entre agents (ex: l\'Agent A retourne `{ data: User }` mais l\'Agent B s\'attend à `{ user: User }`) ?',
      correctSide: 'left',
      left: {
        label: 'Vérif. types (tsc)',
        content: '// Ce qu\'elle attrape :\n// - Décalages de forme import/export\n// - Mauvais types d\'arguments\n// - Champs requis manquants\n// - Accès undefined sur valeurs nullable\n\n// Agent A exporte :\nexport function getUser(): { data: User } { ... }\n\n// Agent B importe :\nconst { user } = getUser()\n//       ^^^^ ERREUR tsc: La propriété "user" n\'existe pas\n// Détecté en 2 secondes. Prévient 40 % des échecs d\'intégration.',
        language: 'typescript',
      },
      right: {
        label: 'Linting (eslint)',
        content: '// Ce qu\'il attrape :\n// - Violations de conventions (any, exports par défaut)\n// - Patterns interdits (fichiers barrel)\n// - Dérive de style du CLAUDE.md\n\n// L\'agent écrit :\nexport default function getUser() { ... }\n//     ^^^^^^^ ERREUR eslint: Utilise les exports nommés uniquement\n\nconst data: any = fetchData()\n//          ^^^ ERREUR eslint: no-explicit-any\n\nimport { getUser } from "./users/index"\n//                       ^^^^^^^^^^^^^^ ERREUR eslint: pas d\'imports barrel',
        language: 'typescript',
      },
      explanation: 'La vérification de types attrape les violations de contrat structurelles entre agents — l\'échec d\'intégration #1. Le linting attrape la dérive de conventions par rapport aux règles du CLAUDE.md. Les deux sont nécessaires : les types assurent la correction, le lint assure la cohérence.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète la configuration ESLint qui encode les patterns interdits du CLAUDE.md comme règles automatisées. Remplis les noms et valeurs des règles.',
      language: 'javascript',
      filename: 'eslint.config.js',
      template: `import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.strict,
  {
    rules: {
      // CLAUDE.md: "no any type"
      '___BLANK_1___': 'error',

      // CLAUDE.md: "no default exports"
      'no-restricted-syntax': ['error', {
        selector: '___BLANK_2___',
        message: 'Use named exports only (CLAUDE.md rule)',
      }],

      // CLAUDE.md: "no console.log in production"
      'no-console': ['error', { allow: ___BLANK_3___ }],
    },
  }
)`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: '@typescript-eslint/no-explicit-any',
          alternatives: ['"@typescript-eslint/no-explicit-any"'],
          hint: 'La règle TypeScript ESLint qui interdit le type `any`',
          placeholder: 'règle typescript-eslint pour any',
        },
        {
          id: 'BLANK_2',
          answer: 'ExportDefaultDeclaration',
          alternatives: ['"ExportDefaultDeclaration"'],
          hint: 'Le sélecteur AST qui correspond aux instructions `export default ...`',
          placeholder: 'sélecteur AST pour exports par défaut',
        },
        {
          id: 'BLANK_3',
          answer: "['warn', 'error']",
          alternatives: ["['warn', 'error']", '["warn", "error"]'],
          hint: 'Quelles méthodes console sont autorisées ? Seulement les avertissements et erreurs.',
          placeholder: 'méthodes console autorisées',
        },
      ],
      explanation: 'Chaque pattern interdit du CLAUDE.md devient une règle ESLint applicable par la machine. `no-explicit-any` empêche les échappatoires de types, `ExportDefaultDeclaration` impose les exports nommés, et n\'autoriser que `console.warn` et `console.error` empêche le logging de débogage en production.',
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
      type: 'multiple-choice',
      question: 'Quand les tests doivent-ils être créés pour le code construit par les agents ?',
      options: [
        'Après que l\'agent finit — ajouter les tests dans une PR séparée',
        'Dans le cahier des charges de l\'agent — les tests sont des livrables obligatoires avec le code',
        'Seulement pour les chemins critiques — sauter les tests pour le CRUD simple',
        'Laisser le pipeline CI auto-générer les tests à partir du code',
      ],
      correctIndex: 1,
      explanation: "Les tests doivent faire partie du cahier des charges de l'agent, pas une réflexion après coup. « Construis le système d'auth ET écris les tests pour. » L'agent produit le code et la vérification en un seul passage. Le pipeline exécute ces tests pour confirmer que la sortie fonctionne. Si les tests sont optionnels, les agents les sautent.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète le cahier des charges qui exige les tests comme livrables non optionnels. Remplis les chemins des fichiers de test et la commande de Définition de Terminé.',
      language: 'markdown',
      filename: 'TASK-AUTH.md',
      template: `# Task: Authentication System

## Required Files (code)
- src/auth/login.ts
- src/auth/signup.ts
- src/auth/middleware.ts

## Required Files (tests) -- NOT OPTIONAL
- src/auth/__tests__/___BLANK_1___
- src/auth/__tests__/___BLANK_2___
- src/auth/__tests__/middleware.test.ts

## Definition of Done
- [ ] All source files created
- [ ] All test files created
- [ ] \`___BLANK_3___\` passes with 0 failures`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'login.test.ts',
          alternatives: ['login.test.ts', 'login.spec.ts'],
          hint: 'Le fichier de test pour le module login — correspond au nom du fichier source',
          placeholder: 'nom du fichier de test login',
        },
        {
          id: 'BLANK_2',
          answer: 'signup.test.ts',
          alternatives: ['signup.test.ts', 'signup.spec.ts'],
          hint: 'Le fichier de test pour le module signup — correspond au nom du fichier source',
          placeholder: 'nom du fichier de test signup',
        },
        {
          id: 'BLANK_3',
          answer: 'bun test src/auth/',
          alternatives: ['bun test src/auth/', 'bun test src/auth', 'vitest src/auth/'],
          hint: 'Exécute le lanceur de tests limité au répertoire auth uniquement',
          placeholder: 'commande de test limitée à auth',
        },
      ],
      explanation: 'Les fichiers de test sont le miroir des fichiers source : login.ts -> login.test.ts, signup.ts -> signup.test.ts. La Définition de Terminé inclut `bun test src/auth/` qui passe avec 0 échec — l\'agent ne peut pas déclarer la tâche complète sans tests qui passent.',
    },
    {
      type: 'code-fill',
      instruction: 'Complète la configuration Vitest avec les seuils de couverture que les agents doivent atteindre. Remplis le fournisseur et les valeurs de seuil.',
      language: 'typescript',
      filename: 'vitest.config.ts',
      template: `import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    passWithNoTests: false,
    coverage: {
      provider: '___BLANK_1___',
      thresholds: {
        statements: ___BLANK_2___,
        branches: 75,
        functions: 80,
        lines: ___BLANK_3___,
      },
    },
    isolate: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'v8',
          alternatives: ['v8', "'v8'", '"v8"'],
          hint: 'Le fournisseur de couverture rapide et intégré à Node.js',
          placeholder: 'fournisseur de couverture',
        },
        {
          id: 'BLANK_2',
          answer: '80',
          alternatives: ['80'],
          hint: 'Seuil standard — 80 % de couverture des instructions est le minimum courant',
          placeholder: 'seuil d\'instructions',
        },
        {
          id: 'BLANK_3',
          answer: '80',
          alternatives: ['80'],
          hint: 'Le seuil de couverture des lignes — correspond au seuil des instructions',
          placeholder: 'seuil de lignes',
        },
      ],
      explanation: 'Le fournisseur de couverture v8 est rapide et intégré à Node.js. Les seuils de 80 % pour les instructions, fonctions et lignes (75 % pour les branches) garantissent que les agents écrivent des tests significatifs. Avec `isolate: true`, chaque test s\'exécute dans son propre environnement — pas de contamination croisée entre les sorties d\'agents.',
    },
    {
      type: 'terminal',
      instruction: 'Exécute les tests seulement pour la sortie de l\'agent d\'auth :',
      expectedCommand: 'bun test src/auth/',
      hint: 'Exécute bun test avec le chemin du répertoire auth pour limiter l\'exécution des tests',
    },

    // === CI CONFIGURATION ===
    {
      type: 'code-fill',
      instruction: 'Complète le workflow GitHub Actions qui vérifie automatiquement chaque branche d\'agent. Remplis le pattern de déclenchement et les étapes du pipeline.',
      language: 'yaml',
      filename: '.github/workflows/verify-agent.yml',
      template: `name: Verify Agent Output

on:
  push:
    branches: ['___BLANK_1___']

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

      - name: Stage 1 -- Type Check
        run: ___BLANK_2___

      - name: Stage 2 -- Lint
        run: bun run lint

      - name: Stage 3 -- Unit Tests
        run: ___BLANK_3___

      - name: Stage 4 -- Build (integration check)
        run: bun run build`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'feat/**',
          alternatives: ['feat/**', '"feat/**"'],
          hint: 'Les branches d\'agents utilisent le préfixe feat/ avec correspondance profonde',
          placeholder: 'pattern glob de branche',
        },
        {
          id: 'BLANK_2',
          answer: 'bunx tsc --noEmit',
          alternatives: ['bunx tsc --noEmit', 'npx tsc --noEmit'],
          hint: 'Exécute le compilateur TypeScript en mode vérification seule (pas de fichiers de sortie)',
          placeholder: 'commande de vérification de types',
        },
        {
          id: 'BLANK_3',
          answer: 'bun test --coverage',
          alternatives: ['bun test --coverage', 'bunx vitest --coverage'],
          hint: 'Exécute les tests avec le rapport de couverture activé',
          placeholder: 'commande de test avec couverture',
        },
      ],
      explanation: 'Le workflow se déclenche sur les branches feat/** (tes branches de flotte), exécute les quatre étapes dans l\'ordre, et bloque la fusion en cas d\'échec. Le pipeline donne un feedback rapide : erreurs de types en 2-5 secondes, lint en 5-10 secondes, tests en 30-60 secondes, build en 1-2 minutes.',
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu sais configurer le CI pour vérifier automatiquement chaque branche d\'agent.',
    },

    // === BRANCH PROTECTION ===
    {
      type: 'multiple-choice',
      question: 'Le CI exécute le pipeline, mais qu\'est-ce qui empêche mécaniquement de fusionner une branche qui a échoué ?',
      options: [
        'Un accord d\'équipe de ne pas fusionner les branches en échec',
        'Des règles de protection de branche qui exigent que le pipeline passe avant la fusion',
        'L\'approbation de révision de code d\'un autre développeur',
        'Un rollback automatique après la fusion si les tests échouent',
      ],
      correctIndex: 1,
      explanation: "Les règles de protection de branche rendent physiquement impossible la fusion d'une sortie d'agent qui n'a pas passé le pipeline. Configure GitHub pour exiger que le workflow « Verify Agent Output » passe avant que n'importe quelle PR puisse fusionner dans main. Ça rend la règle mécanique, pas juste sociale.",
    },
    {
      type: 'code-fill',
      instruction: 'Complète la commande GitHub CLI pour configurer la protection de branche. Remplis les paramètres API qui imposent le passage du pipeline avant la fusion.',
      language: 'bash',
      filename: 'terminal',
      template: `# Configure branch protection via GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection -X PUT \\
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": ___BLANK_1___,
    "contexts": ["___BLANK_2___"]
  },
  "___BLANK_3___": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF`,
      blanks: [
        {
          id: 'BLANK_1',
          answer: 'true',
          alternatives: ['true'],
          hint: 'La branche doit-elle être à jour avec main avant la fusion ?',
          placeholder: 'exiger branche à jour',
        },
        {
          id: 'BLANK_2',
          answer: 'verify',
          alternatives: ['verify', '"verify"'],
          hint: 'Le nom du job CI qui doit passer (depuis le fichier de workflow)',
          placeholder: 'nom du status check requis',
        },
        {
          id: 'BLANK_3',
          answer: 'enforce_admins',
          alternatives: ['enforce_admins', '"enforce_admins"'],
          hint: 'Les admins doivent-ils aussi être soumis à ces règles ? (pas d\'exceptions)',
          placeholder: 'flag d\'application admin',
        },
      ],
      explanation: 'Définir `strict: true` exige que les branches soient à jour avant la fusion. Le tableau `contexts` liste quels jobs CI doivent passer — « verify » correspond au nom du job dans le workflow. `enforce_admins: true` signifie que personne ne peut contourner les règles, pas même les propriétaires du dépôt.',
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
      type: 'interactive-diagram',
      title: 'De bout en bout : Flotte + Pipeline + Fusion',
      body: "Le flux complet du dispatch d'agents à la fusion en production. Chaque branche d'agent passe par le pipeline. Seules les branches qui passent sont fusionnées.",
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
      stages: [
        {
          highlightNodes: ['fleet', 'b1', 'b2', 'b3'],
          highlightEdges: [{ from: 'fleet', to: 'b1' }, { from: 'fleet', to: 'b2' }, { from: 'fleet', to: 'b3' }],
          explanation: 'La flotte dispatch les agents sur des branches séparées. Chaque agent travaille indépendamment dans son propre worktree, produisant du code en parallèle.',
        },
        {
          highlightNodes: ['b1', 'b2', 'b3', 'pipe'],
          highlightEdges: [{ from: 'b1', to: 'pipe' }, { from: 'b2', to: 'pipe' }, { from: 'b3', to: 'pipe' }],
          explanation: 'Quand un agent pousse, le pipeline se déclenche automatiquement. Les quatre étapes s\'exécutent : vérif. types, lint, tests, build. Chaque branche est vérifiée indépendamment.',
        },
        {
          highlightNodes: ['pipe', 'gate', 'merge'],
          highlightEdges: [{ from: 'pipe', to: 'gate' }, { from: 'gate', to: 'merge' }],
          explanation: 'Les branches qui passent les quatre étapes du pipeline sont approuvées pour la fusion. La protection de branche garantit que seul le code vérifié atteint main.',
        },
        {
          highlightNodes: ['gate', 'fix', 'pipe'],
          highlightEdges: [{ from: 'gate', to: 'fix' }, { from: 'fix', to: 'pipe' }],
          explanation: 'Les branches en échec sont corrigées et re-poussées. Le pipeline s\'exécute à nouveau. Cette boucle continue jusqu\'à ce que le code passe toutes les barrières ou soit abandonné.',
        },
      ],
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'multiple-choice',
      question: 'Tu es sur le point de câbler un vrai pipeline de vérification. Quel est le bon ordre de création des fichiers de configuration ?',
      options: [
        'Workflow CI d\'abord, puis tsconfig, puis eslint — le CI est la priorité',
        'tsconfig d\'abord, puis eslint.config, puis workflow CI — outils locaux avant le CI',
        'eslint d\'abord, puis tsconfig, puis CI — conventions avant types',
        'Tout en même temps — l\'ordre n\'a pas d\'importance',
      ],
      correctIndex: 1,
      explanation: "Crée les configs d'outils locaux d'abord (tsconfig, eslint) pour pouvoir exécuter le pipeline localement avant de configurer le CI. Le workflow CI référence ces configs — il exécute `tsc --noEmit` (nécessite tsconfig) et `bun run lint` (nécessite eslint.config). Toujours vérifier localement avant d'automatiser.",
    },
    {
      type: 'terminal',
      instruction: 'Crée le répertoire du workflow GitHub Actions :',
      expectedCommand: 'mkdir -p .github/workflows',
      hint: 'Utilise mkdir -p pour créer les répertoires imbriqués',
      platforms: { windows: { expectedCommand: 'mkdir .github\\workflows' } },
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
