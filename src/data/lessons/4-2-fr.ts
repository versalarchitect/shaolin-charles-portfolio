import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '4-2',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'CLAUDE.md n\'est pas de la documentation',
      body: "Arrêtez de considérer CLAUDE.md comme un README. Un README explique le projet à des humains qui vont explorer, poser des questions et construire du contexte au fil du temps. CLAUDE.md est un protocole de coordination — il dit à chaque agent qui entre dans la codebase exactement comment se comporter, quels patrons suivre, quoi éviter et où trouver les choses. C'est la différence entre « voici notre projet » et « voici vos ordres. » Chaque session d'agent commence par lire ce fichier. S'il est faux, vague ou manquant, chaque session d'agent commence confuse.",
    },
    {
      type: 'info',
      title: 'Le problème de coordination qu\'il résout',
      body: "Sans CLAUDE.md, chaque agent prend des décisions indépendantes. L'Agent A utilise le camelCase pour les noms de fichiers. L'Agent B utilise le kebab-case. L'Agent C crée un répertoire utils/. L'Agent D met le même code dans helpers/. L'Agent E écrit les tests dans __tests__/, l'Agent F les colocalise. Après 10 sessions d'agents, votre codebase est un fouillis incohérent — pas parce qu'un seul agent a fait quelque chose de mal, mais parce qu'il n'y avait pas de protocole partagé. CLAUDE.md est la source unique de vérité à laquelle chaque agent s'aligne.",
    },
    {
      type: 'diagram',
      title: 'Avec vs sans CLAUDE.md',
      body: 'CLAUDE.md agit comme la couche de coordination qui garde tous les agents produisant une sortie cohérente.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'claude', label: 'CLAUDE.md', sublabel: 'Protocole de coordination', shape: 'rounded', highlight: true },
          { id: 'a1', label: 'Agent A', shape: 'rect' },
          { id: 'a2', label: 'Agent B', shape: 'rect' },
          { id: 'a3', label: 'Agent C', shape: 'rect' },
          { id: 'consistent', label: 'Sortie cohérente', sublabel: 'Mêmes patrons, même style', shape: 'pill', highlight: true },
          { id: 'no_claude', label: 'Pas de CLAUDE.md', sublabel: 'Pas de coordination', shape: 'rounded' },
          { id: 'a4', label: 'Agent D', shape: 'rect' },
          { id: 'a5', label: 'Agent E', shape: 'rect' },
          { id: 'chaos', label: 'Chaos incohérent', sublabel: 'Patrons conflictuels', shape: 'pill' },
        ],
        edges: [
          { from: 'claude', to: 'a1' },
          { from: 'claude', to: 'a2' },
          { from: 'claude', to: 'a3' },
          { from: 'a1', to: 'consistent' },
          { from: 'a2', to: 'consistent' },
          { from: 'a3', to: 'consistent' },
          { from: 'no_claude', to: 'a4' },
          { from: 'no_claude', to: 'a5' },
          { from: 'a4', to: 'chaos' },
          { from: 'a5', to: 'chaos' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Problème compris !',
    },

    // === WHAT TO INCLUDE ===
    {
      type: 'info',
      title: 'Section 1 : Conventions',
      body: "Les conventions sont les patrons que chaque agent DOIT suivre. Conventions de nommage (fichiers, variables, fonctions, composants). Règles de structure de répertoires (où vont les nouvelles fonctionnalités, où vivent les tests). Ordre des imports. Patrons de gestion d'erreurs. Standards de format de réponse. Ce ne sont pas des suggestions — ce sont des lois. Écrivez-les comme des impératifs : « Tous les fichiers handler utilisent le nommage [domaine].handler.ts. » Pas « On préfère... » ou « Considérez utiliser... » Les agents interprètent le langage doux comme optionnel.",
    },
    {
      type: 'info',
      title: 'Section 2 : Contraintes',
      body: "Les contraintes sont les frontières qui empêchent les agents de dévier du script. Choix technologiques (quelles bibliothèques sont approuvées, lesquelles sont bannies). Budgets de performance (pas de lectures de fichiers synchrones, pas de requêtes N+1). Règles de sécurité (ne jamais logger des données personnelles, toujours valider l'entrée). Limites de taille de fichier (aucun fichier de plus de 300 lignes). Elles vous protègent d'agents bien intentionnés qui autrement « amélioreraient » les choses en introduisant de nouvelles dépendances, des optimisations astucieuses ou des architectures que vous n'avez pas autorisées.",
    },
    {
      type: 'info',
      title: 'Section 3 : Patrons (avec exemples)',
      body: "Montrez, ne vous contentez pas de dire. Pour chaque patron que vous exigez, incluez un court exemple de code de la bonne façon ET de la mauvaise. Les agents apprennent mieux par les exemples que par des règles abstraites. Si vous dites « utilisez les server actions pour les mutations », incluez un exemple de 5 lignes d'une server action correcte. Si vous dites « pas de barrel exports », montrez à quoi ressemble un barrel export pour que l'agent le reconnaisse. La section d'exemples est ce qui transforme CLAUDE.md de politique en savoir exécutable.",
    },
    {
      type: 'info',
      title: 'Section 4 : Anti-patrons interdits',
      body: "Listez explicitement les choses que les agents tendent à faire et que vous NE voulez PAS. C'est différent des contraintes — les contraintes disent ce qui EST permis. Les anti-patrons disent ce qui ne doit JAMAIS arriver même si ça semble raisonnable. Exemples courants : « Ne jamais créer un fichier shared/utils.ts — les utilitaires appartiennent à leur module de fonctionnalité. » « Ne jamais ajouter une dépendance sans qu'on le demande. » « Ne jamais refactorer du code qui n'est pas lié à la tâche en cours. » « Ne jamais créer de barrel exports index.ts. » Ça empêche l'agent d'être « utile » de façons qui créent de la dette.",
    },
    {
      type: 'code-demo',
      title: 'Une vraie section de conventions CLAUDE.md',
      body: 'Notez le langage impératif, les exemples concrets et les anti-patrons explicites. Rien n\'est vague.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# Project: Invoice Platform\n\n## Conventions\n\n### File Naming\n- Feature files: `[domain].[role].ts` (e.g., `invoices.handler.ts`)\n- Test files: `[domain].test.ts` (collocated in same directory)\n- Types: `[domain].types.ts`\n- NEVER use generic names: `utils.ts`, `helpers.ts`, `common.ts`\n\n### Directory Structure\n- New features: `src/features/[domain-name]/`\n- Each feature exports via `index.ts`\n- Tests live next to the code they test\n- Infrastructure code: `src/infrastructure/`\n\n### Error Handling\n```typescript\n// CORRECT: Use AppError with domain context\nthrow new AppError('INVOICE_NOT_FOUND', { invoiceId })\n\n// WRONG: Generic errors with no context\nthrow new Error('Not found')\n```\n\n### Imports\n- Feature imports use the index: `import { createInvoice } from '@/features/invoices'`\n- NEVER import internal files: `import { x } from '@/features/invoices/invoices.service'`",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Sections de contenu maîtrisées !',
    },

    // === CONSTRAINTS SECTION ===
    {
      type: 'code-demo',
      title: 'Une vraie section de contraintes CLAUDE.md',
      body: 'Les contraintes empêchent les décisions non autorisées. Chacune bloque un mode de défaillance spécifique.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "## Constraints\n\n### Technology\n- Runtime: Node.js 20+ with ESM\n- Database: PostgreSQL via Drizzle ORM (no raw SQL)\n- Validation: Zod schemas (not joi, not yup)\n- Testing: Vitest (not Jest)\n- DO NOT add new dependencies without explicit approval\n\n### Performance\n- No synchronous file operations\n- No N+1 database queries (use eager loading or joins)\n- No file larger than 300 lines (split at that threshold)\n- API responses under 200ms p95 for reads\n\n### Security\n- Never log PII (email, name, address, payment info)\n- All user input validated through Zod schema before processing\n- No dynamic SQL construction (use parameterized queries only)\n- No secrets in code — all from environment variables\n\n### Style\n- No comments that restate the code (\"increment counter\")\n- Comments explain WHY, never WHAT\n- No TODO comments — create an issue instead\n- No console.log in production code (use structured logger)",
    },
    {
      type: 'multiple-choice',
      question: 'Votre CLAUDE.md dit « Considérez utiliser Zod pour la validation. » Un agent utilise Joi à la place. À qui la faute ?',
      options: [
        'L\'agent a ignoré l\'instruction',
        'La vôtre — « considérez » est un langage consultatif. L\'agent l\'a interprété comme optionnel, ce qui est techniquement correct.',
        'L\'agent aurait dû demander des clarifications',
        'Ça dépend de la qualité du modèle de l\'agent',
      ],
      correctIndex: 1,
      explanation: 'Le langage doux (« considérez », « préférez », « essayez de ») donne la permission aux agents de dévier. Utilisez un langage impératif et sans ambiguïté : « Utilisez Zod pour toute validation. Aucune autre bibliothèque de validation n\'est permise. » Si vous le pensez, dites-le comme un ordre.',
    },

    // === LAYERING ===
    {
      type: 'info',
      title: 'Superposition : CLAUDE.md racine + au niveau du répertoire',
      body: "Un seul CLAUDE.md à la racine du projet fonctionne pour les petits projets. Pour les codebases plus grandes, utilisez la superposition. Le CLAUDE.md racine contient les conventions à l'échelle du projet (nommage, stack technique, anti-patrons). Les fichiers CLAUDE.md au niveau des répertoires contiennent des règles spécifiques au module. Par exemple, src/features/payments/CLAUDE.md pourrait dire : « Toutes les valeurs monétaires utilisent les centimes (entiers). Ne jamais utiliser de virgule flottante pour l'argent. Le handler de paiement doit valider la clé d'idempotence. » L'agent lit les deux — la racine fournit le contexte, le répertoire fournit les spécificités.",
    },
    {
      type: 'code-demo',
      title: 'Exemple de CLAUDE.md superposé',
      body: 'Les règles de niveau racine s\'appliquent partout. Les règles de niveau répertoire s\'appliquent à ce module seulement.',
      language: 'markdown',
      filename: 'src/features/payments/CLAUDE.md',
      code: "# Payments Module\n\n## Module-Specific Rules\n- All monetary values in cents (integer). NEVER use floats for money.\n- Every mutation requires an idempotency key in the request header.\n- Payment state machine: draft → pending → completed | failed | refunded.\n- State transitions are the ONLY way to change payment status.\n- Never delete a payment record — use soft-delete (status: 'cancelled').\n\n## Testing Requirements\n- Every state transition must have a dedicated test case.\n- Test both successful transitions and invalid transition attempts.\n- Mock the payment gateway — never hit real APIs in tests.\n\n## Dependencies\n- This module depends on: features/users (for customer lookup)\n- This module is depended on by: features/orders, features/invoices\n- NEVER introduce a dependency on features/notifications from here\n  (payments emit events; notifications subscribes to them).",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Stratégie de superposition assimilée !',
    },

    // === TESTING YOUR CLAUDE.MD ===
    {
      type: 'info',
      title: 'Tester votre CLAUDE.md : le test de l\'agent frais',
      body: "Voici comment savoir si votre CLAUDE.md fonctionne. Démarrez une session d'agent fraîche. Donnez-lui une tâche réelle — ajouter une fonctionnalité, corriger un bug, écrire un test. Ne donnez AUCUN contexte supplémentaire au-delà de la tâche elle-même. Laissez l'agent travailler. Puis évaluez : A-t-il suivi vos conventions de nommage ? A-t-il mis les fichiers au bon endroit ? A-t-il utilisé les bons patrons ? A-t-il évité les anti-patrons ? Si oui sur tous les points, votre CLAUDE.md est efficace. Si non, les points de défaillance vous disent exactement quoi ajouter ou clarifier.",
    },
    {
      type: 'info',
      title: 'La boucle de rétroaction',
      body: "Chaque fois qu'un agent dévie de vos attentes, demandez-vous : « Est-ce documenté dans CLAUDE.md ? » Si non — ajoutez-le. Vous venez de découvrir une lacune. Si oui mais l'agent a quand même dévié — la formulation est trop douce, trop enfouie ou contredite ailleurs. Réécrivez-la plus clairement ou déplacez-la plus haut dans le fichier. Si oui et la formulation est claire — c'est peut-être trop bas. Les agents accordent plus d'attention au contenu près du haut de CLAUDE.md. Les règles critiques viennent en premier.",
    },

    // === ANTI-PATTERNS ===
    {
      type: 'info',
      title: 'Anti-patron CLAUDE.md : trop long',
      body: "Un CLAUDE.md de 2000 lignes va à l'encontre de son objectif. Les agents ont des fenêtres de contexte finies. Si votre protocole est énorme, l'agent va prêter attention à certaines sections et effectivement ignorer les autres — généralement les sections du bas. Gardez-le sous 500 lignes pour le fichier racine. Si vous avez besoin de plus, superposez-le dans des fichiers au niveau des répertoires. L'agent ne lit le CLAUDE.md du répertoire que quand il travaille dans ce répertoire, donc vous obtenez de la spécificité sans surcharger le contexte racine.",
    },
    {
      type: 'info',
      title: 'Anti-patron CLAUDE.md : trop vague',
      body: "« Écrivez du code propre. » « Suivez les bonnes pratiques. » « Gardez ça simple. » Ce sont des phrases vides de sens. Chaque agent essaie déjà d'écrire ce qu'il considère comme du code propre. Votre CLAUDE.md doit définir VOTRE version de propre. Qu'est-ce que « simple » veut dire dans VOTRE projet ? Peut-être que ça veut dire pas d'abstractions avec moins de 3 consommateurs. Peut-être que ça veut dire pas d'héritage de classes. Soyez assez précis pour que deux agents différents prennent la MÊME décision face à la même ambiguïté.",
    },
    {
      type: 'info',
      title: 'Anti-patron CLAUDE.md : contradictions',
      body: "La section des conventions dit « utilisez les server actions pour les mutations. » Une section ultérieure dit « créez des routes API pour tous les endpoints. » Laquelle gagne ? L'agent en choisit une — probablement celle qu'il rencontre en deuxième. Vous ne le remarquerez pas avant que l'incohérence se manifeste sous forme de code incohérent. Relisez votre CLAUDE.md spécifiquement pour les contradictions. Une heuristique utile : si deux règles pourraient un jour entrer en conflit, ajoutez une déclaration de priorité explicite (« En cas de doute, préférez X plutôt que Y »).",
    },
    {
      type: 'multiple-choice',
      question: 'Votre CLAUDE.md fait 1800 lignes et les agents ignorent systématiquement les règles de la moitié inférieure. Quelle est la meilleure solution ?',
      options: [
        'Ajouter le préfixe « IMPORTANT : » aux règles ignorées',
        'Déplacer les règles ignorées en haut du fichier',
        'Restructurer : garder les règles critiques dans un court CLAUDE.md racine, déplacer les détails spécifiques aux modules dans des fichiers CLAUDE.md au niveau des répertoires',
        'Répéter les règles importantes plusieurs fois dans le fichier',
      ],
      correctIndex: 2,
      explanation: 'Le fichier racine est trop long. Les agents prêtent plus attention au contenu près du haut, et les fichiers extrêmement longs diluent l\'attention. La superposition dans des fichiers au niveau des répertoires permet au fichier racine de rester court et concentré, tandis que les règles spécifiques aux modules sont livrées précisément quand l\'agent travaille dans ce contexte.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Anti-patrons reconnus !',
    },

    // === PRACTICAL EXERCISE ===
    {
      type: 'info',
      title: 'Construire un CLAUDE.md à partir de zéro',
      body: "Commencez par quatre questions. (1) Quels patrons de nommage chaque fichier doit-il suivre ? (2) Quelles décisions technologiques sont finales et non négociables ? (3) Qu'est-ce qu'un agent a mal fait dans le passé que vous voulez prévenir ? (4) Quels patrons un nouveau contributeur doit-il suivre dès le premier jour ? Les réponses à ces quatre questions vous donnent 80% d'un CLAUDE.md efficace. Écrivez les réponses en impératifs, ajoutez des exemples de code pour chacune, et vous avez un protocole de coordination fonctionnel.",
    },
    {
      type: 'order',
      instruction: 'Ordonnez ces sections de CLAUDE.md de la plus critique (haut du fichier) à la moins critique (bas) :',
      items: [
        'Commandes de développement (comment exécuter, tester, builder)',
        'Anti-patrons interdits (quoi ne jamais faire)',
        'Conventions de nommage (nommage des fichiers et variables)',
        'Vue d\'ensemble de l\'architecture (structure de répertoires)',
        'Directives d\'optimisation de performance',
      ],
      correctOrder: [3, 2, 1, 0, 4],
    },
    {
      type: 'code-demo',
      title: 'Template CLAUDE.md minimal et efficace',
      body: 'Commencez avec cette structure. Elle couvre l\'essentiel sans surplus. Étendez seulement quand les agents dévient.',
      language: 'markdown',
      filename: 'CLAUDE.md',
      code: "# [Project Name]\n\n## Architecture\n- Feature modules: `src/features/[domain]/`\n- Each module: handler, service, schema, test, index.ts\n- Infrastructure: `src/infrastructure/` (DB, cache, queue)\n\n## Conventions\n- Files: `[domain].[role].ts` (e.g., `payments.handler.ts`)\n- Tests: collocated, named `[domain].test.ts`\n- Imports: always from feature index, never internal files\n- Errors: use `AppError` class with domain error codes\n\n## Constraints\n- Stack: [your stack]\n- No new dependencies without approval\n- No file over 300 lines\n- No raw SQL — use ORM query builder\n- No console.log — use structured logger\n\n## Anti-Patterns (NEVER do these)\n- Never create utils.ts / helpers.ts / common.ts\n- Never add barrel exports (index.ts that re-exports everything)\n- Never modify code outside the current task scope\n- Never use `any` type — use `unknown` and narrow\n\n## Development\n- Dev: `npm run dev`\n- Test: `npm test`\n- Lint: `npm run lint`\n- Build: `npm run build`",
    },

    // === SYNTHESIS ===
    {
      type: 'multiple-choice',
      question: 'Quelle est la différence principale entre un README et un CLAUDE.md ?',
      options: [
        'Un README est pour les dépôts publics, CLAUDE.md est pour les dépôts privés',
        'Un README explique le projet aux explorateurs ; CLAUDE.md donne des ordres d\'exécution aux agents qui doivent produire une sortie cohérente',
        'Un README est écrit en anglais, CLAUDE.md utilise une syntaxe spéciale',
        'Ils servent le même objectif — CLAUDE.md est juste le format plus récent',
      ],
      correctIndex: 1,
      explanation: 'Un README aide les humains à construire une compréhension au fil du temps. Un CLAUDE.md est un protocole d\'exécution — il dit aux agents exactement quoi faire et ne pas faire pour que chaque session produise une sortie cohérente avec vos décisions d\'architecture. Il est prescriptif, pas descriptif.',
    },
    {
      type: 'checklist',
      title: 'Liste de vérification du protocole de coordination CLAUDE.md :',
      items: [
        'Je comprends CLAUDE.md comme un protocole de coordination, pas de la documentation',
        'J\'inclus des conventions, des contraintes, des patrons et des anti-patrons',
        'J\'écris en langage impératif — pas de suggestions douces',
        'J\'inclus des exemples de code pour chaque patron que j\'exige',
        'J\'utilise la superposition pour les gros projets (racine + niveau répertoire)',
        'Je teste mon CLAUDE.md avec des sessions d\'agents frais',
        'Je garde le fichier racine sous 500 lignes',
        'Je vérifie les contradictions et le langage vague',
      ],
    },
    {
      type: 'checkpoint',
      xp: 16,
      message: 'Maîtrise de CLAUDE.md atteinte ! Vous pouvez maintenant écrire des protocoles de coordination qui gardent les flottes d\'agents alignées.',
    },
  ],
}

export default content
