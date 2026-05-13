import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '3-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Quand les changements des agents IA se chevauchent',
      body: "Deux agents ont touché des fichiers connexes. Peut-être que les deux ont modifié la configuration du routeur. Peut-être qu'ils ont importé des versions différentes d'un utilitaire partagé. La fusion a des conflits — pas parce que quelqu'un a échoué, mais parce que le travail parallèle crée inévitablement des zones de chevauchement. Cette leçon t'apprend à résoudre ces conflits en comprenant l'intention, pas juste les lignes du diff.",
    },
    {
      type: 'info',
      title: 'Les conflits sont du feedback, pas des échecs',
      body: "Un conflit de fusion ne veut pas dire que ta décomposition était mauvaise. Ça veut dire que t'as trouvé un cas limite dans tes frontières de propriété de fichiers. Chaque conflit t'apprend où tracer des lignes plus nettes la prochaine fois. L'objectif c'est pas zéro conflit — c'est une résolution rapide et confiante quand ils surviennent.",
    },

    // === DIAGRAM 1: How Conflicts Arise ===
    {
      type: 'diagram',
      title: 'Comment les conflits apparaissent dans le travail de flotte',
      body: "L'Agent A et l'Agent B partent tous les deux de la même base. Chacun modifie des fichiers dans son propre domaine. Mais quand des fichiers partagés (configs, routeurs, définitions de types) sont touchés par les deux, la fusion produit des conflits. La clé c'est de comprendre CE QUE chaque agent voulait faire.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'base', label: 'Base', sublabel: 'branche main', shape: 'rounded' },
          { id: 'a', label: 'Agent A', sublabel: 'feat/auth', shape: 'rect' },
          { id: 'b', label: 'Agent B', sublabel: 'feat/api', shape: 'rect' },
          { id: 'conflict', label: 'Conflit !', sublabel: 'Fichier partagé modifié', shape: 'diamond', highlight: true },
          { id: 'resolve', label: 'Résolution', sublabel: 'Comprendre l\'intention', shape: 'rect' },
          { id: 'merged', label: 'Fusionné', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'base', to: 'a', label: 'branche' },
          { from: 'base', to: 'b', label: 'branche' },
          { from: 'a', to: 'conflict', label: 'modifie le routeur' },
          { from: 'b', to: 'conflict', label: 'modifie le routeur' },
          { from: 'conflict', to: 'resolve' },
          { from: 'resolve', to: 'merged' },
        ],
      },
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Tu comprends comment le travail parallèle crée des conflits de fusion.',
    },

    // === UNDERSTANDING INTENT ===
    {
      type: 'info',
      title: 'Comprendre l\'intention : au-delà du diff',
      body: "Un diff git te montre CE QUI a changé. Il te dit pas POURQUOI. Quand tu résous des conflits d'agents, tu dois comprendre l'intention de chaque agent : qu'est-ce qu'il essayait d'accomplir ? Une ligne qui semble incorrecte isolément peut être critique pour la fonctionnalité d'un agent. Lis le cahier des charges de la tâche, pas juste le diff.",
    },
    {
      type: 'code-demo',
      title: 'Un vrai conflit de fusion entre deux agents',
      body: "L'Agent A a ajouté des routes d'authentification. L'Agent B a ajouté des routes d'API. Les deux ont modifié le fichier principal du routeur. Git te montre ce conflit — mais quelles lignes tu gardes ?",
      language: 'typescript',
      filename: 'src/routes/index.ts',
      code: `import { Hono } from 'hono'

const app = new Hono()

<<<<<<< feat/auth
// Auth agent added these
import { authRoutes } from '../auth/routes'
app.route('/auth', authRoutes)
app.use('/api/*', authMiddleware)
=======
// API agent added these
import { taskRoutes } from '../api/routes/tasks'
import { healthRoutes } from '../api/routes/health'
app.route('/api/tasks', taskRoutes)
app.route('/api/health', healthRoutes)
>>>>>>> feat/api

export default app`,
    },
    {
      type: 'multiple-choice',
      question: 'En regardant ce conflit, quelle est la bonne résolution ?',
      options: [
        'Garder seulement les changements de l\'agent d\'auth (il était premier)',
        'Garder seulement les changements de l\'agent d\'API (ils sont plus importants)',
        'Garder LES DEUX — ils sont additifs, pas contradictoires',
        'Réécrire le fichier à partir de zéro',
      ],
      correctIndex: 2,
      explanation: "Ces changements sont additifs — les deux agents ont ajouté des routes au même fichier. La résolution est de garder les deux ensembles d'imports et d'enregistrements de routes. Le conflit existe parce que git peut pas dire que les deux changements sont complémentaires, pas contradictoires. Comprendre l'intention révèle ça immédiatement.",
    },
    {
      type: 'code-demo',
      title: 'La bonne résolution',
      body: "Les intentions des deux agents sont préservées. Routes d'auth, middleware, routes d'API, et routes de santé coexistent. L'ordre compte : le middleware avant les routes qu'il protège.",
      language: 'typescript',
      filename: 'src/routes/index.ts',
      code: `import { Hono } from 'hono'
import { authRoutes } from '../auth/routes'
import { authMiddleware } from '../auth/middleware'
import { taskRoutes } from '../api/routes/tasks'
import { healthRoutes } from '../api/routes/health'

const app = new Hono()

// Auth routes (public)
app.route('/auth', authRoutes)

// Protected API routes
app.use('/api/*', authMiddleware)
app.route('/api/tasks', taskRoutes)
app.route('/api/health', healthRoutes)

export default app`,
    },
    {
      type: 'code-diff',
      title: 'Résoudre un conflit de fusion',
      body: 'Voici une vraie résolution de conflit. L\'agent de gauche a ajouté la gestion d\'erreurs, l\'agent de droite a ajouté la journalisation. La résolution conserve les deux changements dans un ordre logique.',
      language: 'typescript',
      filename: 'src/api/handler.ts',
      before: 'export async function handleRequest(req: Request) {\n  const data = await fetchData(req.url)\n  return new Response(JSON.stringify(data))\n}',
      after: 'export async function handleRequest(req: Request) {\n  try {\n    console.log(`[API] Processing ${req.url}`)\n    const data = await fetchData(req.url)\n    console.log(`[API] Success: ${data.length} items`)\n    return new Response(JSON.stringify(data))\n  } catch (error) {\n    console.error(`[API] Failed: ${error.message}`)\n    return new Response(JSON.stringify({ error: error.message }), { status: 500 })\n  }\n}',
    },
    // === COMPARE: RÉSOLUTION MANUELLE vs STRUCTURÉE ===
    {
      type: 'compare',
      title: 'Résolution manuelle vs structurée',
      body: "Deux approches pour le même conflit de fusion. La résolution manuelle lit les diffs ligne par ligne. La résolution structurée commence par comprendre l'intention de chaque agent avant de toucher au code.",
      question: 'Quelle approche produit moins de régressions dans le résultat fusionné ?',
      correctSide: 'right',
      left: {
        label: 'Manuelle (Ligne par ligne)',
        content: "1. Ouvrir le fichier en conflit\n2. Lire les marqueurs <<<<<<< et >>>>>>>\n3. Examiner les deux versions à l'oeil\n4. Choisir les lignes qui « semblent correctes »\n5. Supprimer les marqueurs de conflit\n6. Espérer que rien ne casse\n\nRisques :\n- Rater l'intention subtile derrière un changement\n- Supprimer accidentellement un import nécessaire\n- Erreurs d'ordre (middleware après les routes)\n- Aucune vérification systématique",
      },
      right: {
        label: 'Structurée (Intention d\'abord)',
        content: "1. Lire le cahier des charges de l'Agent A : que voulait-il faire ?\n2. Lire le cahier des charges de l'Agent B : que voulait-il faire ?\n3. Classifier : additif, contradictoire ou structurel ?\n4. Fusionner en combinant les intentions, pas juste les lignes\n5. Vérifier : le résultat satisfait-il LES DEUX cahiers ?\n6. Tester le code fusionné\n\nAvantages :\n- La fusion consciente de l'intention détecte les dépendances cachées\n- L'ordre reflète le flux d'exécution réel\n- Vérification systématique contre les cahiers des charges",
      },
      explanation: "La résolution manuelle traite les conflits comme un problème de texte. La résolution structurée les traite comme un problème d'intention. Quand tu comprends POURQUOI chaque agent a fait ses changements, tu peux fusionner sémantiquement — en gardant la logique correcte, pas juste la syntaxe.",
    },

    // === MATCH: TYPES DE CONFLITS → STRATÉGIES ===
    {
      type: 'match',
      instruction: 'Associe chaque type de conflit à la meilleure stratégie de résolution :',
      leftItems: [
        'Même ligne éditée différemment',
        'Nouvelle fonction ajoutée par les deux agents',
        'Conflits d\'imports',
        'Différences de style/formatage',
      ],
      rightItems: [
        'Garder les deux fonctions, renommer si collision de noms',
        'Choisir la version sémantiquement correcte selon l\'intention',
        'Fusionner les listes d\'imports (union des deux)',
        'Appliquer les conventions du projet depuis le CLAUDE.md',
      ],
      correctPairs: { 0: 1, 1: 0, 2: 2, 3: 3 },
      explanation: "Les éditions de la même ligne nécessitent de comprendre l'intention pour choisir la bonne version. Les fonctions en double sont généralement additives — garde les deux. Les conflits d'imports se résolvent presque toujours en fusionnant les listes. Les différences de style doivent suivre les conventions du projet, pas les préférences individuelles de chaque agent.",
    },

    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu résous les conflits en comprenant l\'intention, pas en choisissant un camp.',
    },

    // === RESOLUTION STRATEGIES ===
    {
      type: 'info',
      title: 'Trois stratégies de résolution',
      body: "Pas tous les conflits sont pareils. Les conflits additifs (les deux agents ont ajouté des choses) sont faciles — garde les deux. Les conflits contradictoires (les agents ont pris des décisions opposées) demandent du jugement. Les conflits structurels (les agents ont réorganisé le même fichier différemment) peuvent nécessiter une troisième approche entièrement.",
    },
    {
      type: 'code-demo',
      title: 'Stratégie 1 : Fusion manuelle (conflits additifs)',
      body: "Quand les deux changements sont des ajouts au même fichier, combine-les manuellement. C'est le cas le plus courant dans un travail de flotte bien décomposé.",
      language: 'bash',
      filename: 'terminal',
      code: `# See what conflicts exist
git status

# Open the conflicted file and combine both sides
# (keep both agents' additions, fix ordering)

# Mark resolved
git add src/routes/index.ts
git commit -m "merge: combine auth and api routes"`,
    },
    {
      type: 'code-demo',
      title: 'Stratégie 2 : Fusion assistée par agent (conflits complexes)',
      body: "Pour les conflits complexes où tu as besoin de comprendre un contexte profond, utilise un agent pour t'aider. Donne-lui les versions des deux branches et le cahier des charges de chaque agent. Il peut raisonner sur la bonne combinaison.",
      language: 'markdown',
      filename: 'merge-assist-prompt.md',
      code: `# Merge Assistance Task

## Context
Two agents modified src/lib/database.ts. I need help resolving.

## Agent A's Intent (from its task spec)
Add connection pooling with a max of 10 connections.
Add a query timeout of 30 seconds.

## Agent B's Intent (from its task spec)
Add transaction support with automatic rollback on error.
Add query logging for debugging.

## Agent A's Version
[paste Agent A's full file]

## Agent B's Version
[paste Agent B's full file]

## Task
Combine both agents' changes into a single coherent file
that satisfies BOTH specs. If there's a true contradiction
(not just an overlap), flag it for me to decide.`,
    },
    {
      type: 'code-demo',
      title: 'Stratégie 3 : Relancer avec de meilleures frontières (conflits structurels)',
      body: "Quand le conflit est profond — deux agents ont fondamentalement réorganisé le même code différemment — la correction la plus rapide est d'améliorer les frontières et de relancer un agent. Le coût de résoudre un conflit structurel profond dépasse souvent le coût d'une relance.",
      language: 'bash',
      filename: 'terminal',
      code: `# Abort the problematic merge
git merge --abort

# Update CLAUDE.md with better file ownership boundaries
# Agent A owns: src/lib/database-pool.ts (new file)
# Agent B owns: src/lib/database-transactions.ts (new file)
# Shared: src/lib/database.ts imports from both (orchestrator writes)

# Re-run the affected agent with the updated spec
# Now each agent has exclusive ownership — no conflict possible`,
    },
    {
      type: 'multiple-choice',
      question: 'Deux agents ont tous les deux refactorisé la même fonction utilitaire différemment. L\'un l\'a rendue async, l\'autre l\'a divisée en deux fonctions. Quelle stratégie ?',
      options: [
        'Fusion manuelle — combiner les deux refactorisations',
        'Assistée par agent — laisser un agent s\'en occuper',
        'Relancer avec de meilleures frontières — le conflit est structurel',
        'Garder celui des agents qui a fini en premier',
      ],
      correctIndex: 2,
      explanation: "C'est un conflit structurel — deux réorganisations incompatibles du même code. Tu peux pas combiner 'rendre async' avec 'diviser en deux fonctions' sans comprendre quelle approche sert mieux le projet. Mieux vaut clarifier la propriété et relancer un agent avec la bonne approche spécifiée.",
    },
    {
      type: 'checkpoint',
      xp: 5,
      message: 'Tu connais trois stratégies de résolution et quand utiliser chacune.',
    },

    // === PREVENTION ===
    {
      type: 'info',
      title: 'Prévention : réduire les conflits futurs',
      body: "Chaque conflit est une leçon. Après avoir résolu, demande-toi : pourquoi deux agents ont touché le même fichier ? La réponse te dit comment améliorer ta décomposition. Corrections courantes : extraire un fichier partagé que seul l'orchestrateur écrit, diviser un gros fichier en morceaux appartenant à chaque agent, ou ajouter une règle dans le CLAUDE.md qui assigne explicitement le fichier contesté.",
    },
    {
      type: 'code-demo',
      title: 'Patterns de conflits courants et prévention',
      body: "Voici le top 5 des zones chaudes de conflits dans le travail de flotte et comment éliminer chacune avant que les agents commencent.",
      language: 'markdown',
      filename: 'conflict-prevention.md',
      code: `# Conflict Prevention Playbook

## 1. Router/App Configuration Files
Problem: Every agent adds its routes to the same file.
Fix: Each agent exports routes from its own directory.
     Orchestrator writes the top-level router that imports all.

## 2. Package.json / Dependencies
Problem: Multiple agents install different packages.
Fix: Orchestrator pre-installs all dependencies before dispatch.
     CLAUDE.md lists approved packages — agents don't add new ones.

## 3. Shared Type Definitions
Problem: Agents extend the same interface differently.
Fix: contracts.ts is read-only. Each agent defines local types
     that extend the shared ones in their own directories.

## 4. Environment Variables / Config
Problem: Agents add different .env variables to the same file.
Fix: Each agent documents needed env vars in its task output.
     Orchestrator consolidates after merge.

## 5. CSS / Global Styles
Problem: Agents add conflicting global styles.
Fix: Tailwind utility-first (no globals). Each component is
     self-contained. No agent modifies global.css.`,
    },
    {
      type: 'order',
      instruction: 'Après avoir résolu un conflit, classe ces actions de prévention de la PLUS efficace (haut) à la MOINS efficace :',
      items: [
        'Mettre à jour le CLAUDE.md avec la propriété explicite des fichiers pour la zone contestée',
        'Diviser le fichier contesté en morceaux appartenant à chaque agent',
        'Ajouter un commentaire dans le fichier disant « ne modifie pas ça »',
        'Dire verbalement aux agents d\'éviter ce fichier la prochaine fois',
      ],
      correctOrder: [1, 0, 2, 3],
    },

    // === HANDS-ON EXERCISE ===
    {
      type: 'info',
      title: 'Exercice : Résoudre un conflit de flotte',
      body: "T'as fusionné feat/auth dans main avec succès. Maintenant tu fusionnes feat/api et ça entre en conflit. Parcourons ensemble le processus de résolution.",
    },
    {
      type: 'terminal',
      instruction: 'Commence la fusion de la branche API et observe le conflit :',
      expectedCommand: 'git merge feat/api --no-ff',
      hint: 'Utilise git merge avec le drapeau --no-ff',
    },
    {
      type: 'terminal',
      instruction: 'Regarde quels fichiers ont des conflits :',
      expectedCommand: 'git diff --name-only --diff-filter=U',
      hint: 'git diff avec --name-only et --diff-filter=U montre seulement les fichiers en conflit (non fusionnés)',
    },
    {
      type: 'terminal',
      instruction: 'Après avoir résolu le conflit dans ton éditeur, marque-le comme résolu et complète la fusion :',
      expectedCommand: 'git add . && git commit --no-edit',
      hint: 'Stage les fichiers résolus et commit (--no-edit utilise le message de fusion par défaut)',
    },

    // === DIAGRAM 2: Resolution Decision Tree ===
    {
      type: 'diagram',
      title: 'Arbre de décision pour la résolution de conflits',
      body: "Utilise cet arbre de décision quand tu rencontres un conflit de fusion. La nature du conflit détermine la stratégie. Additif = combiner. Contradictoire = choisir ou re-spécifier. Structurel = relancer avec de meilleures frontières.",
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'conflict', label: 'Conflit', shape: 'rounded' },
          { id: 'nature', label: 'Nature ?', shape: 'diamond' },
          { id: 'additive', label: 'Additif', sublabel: 'Les deux ont ajouté', shape: 'rect' },
          { id: 'contra', label: 'Contradictoire', sublabel: 'Choix opposés', shape: 'rect' },
          { id: 'struct', label: 'Structurel', sublabel: 'Réorgs différentes', shape: 'rect' },
          { id: 'combine', label: 'Combiner les deux', shape: 'pill', highlight: true },
          { id: 'decide', label: 'Choisir + Maj cahier', shape: 'pill', highlight: true },
          { id: 'rerun', label: 'Relancer l\'agent', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'conflict', to: 'nature' },
          { from: 'nature', to: 'additive', label: 'les deux ajoutent' },
          { from: 'nature', to: 'contra', label: 'opposés' },
          { from: 'nature', to: 'struct', label: 'réorganisé' },
          { from: 'additive', to: 'combine' },
          { from: 'contra', to: 'decide' },
          { from: 'struct', to: 'rerun' },
        ],
      },
    },
    {
      type: 'checklist',
      title: 'Liste de vérification pour la résolution de conflits',
      items: [
        'Lire le cahier des charges de chaque agent avant de regarder le diff',
        'Classifier le conflit : additif, contradictoire ou structurel',
        'Additif : combiner les deux côtés, corriger l\'ordre',
        'Contradictoire : choisir selon les besoins du projet, mettre à jour le CLAUDE.md',
        'Structurel : annuler la fusion, améliorer les frontières, relancer l\'agent concerné',
        'Après résolution : mettre à jour le CLAUDE.md pour prévenir cette classe de conflit',
        'Documenter le pattern dans ton guide de prévention des conflits',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Résolution de conflits maîtrisée ! Les changements qui se chevauchent, c\'est normal et réparable.',
    },
  ],
}

export default content
