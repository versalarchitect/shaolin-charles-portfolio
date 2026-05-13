import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-7',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Quand l\'agent construit la mauvaise chose',
      body: "Vous avez donné une spec claire. L'agent a construit quelque chose. Ça ressemble à du code. Ça s'exécute même. Mais ce n'est pas ce que vous avez demandé. Peut-être que le modèle de données est faux, le flux est inversé, ou il a résolu un problème complètement différent. Ça arrive à tout le monde. L'agent n'est pas cassé — il a interprété vos mots différemment de votre intention. La compétence n'est pas d'empêcher ça (vous ne pouvez pas entièrement), mais de récupérer efficacement quand ça arrive.",
    },
    {
      type: 'info',
      title: 'Divergence vs bugs',
      body: "Un bug, c'est quand l'agent a construit la bonne chose mais a fait une erreur (référence null, off-by-one, await manquant). La divergence, c'est quand l'agent a construit la mauvaise chose correctement. L'API fonctionne parfaitement — mais c'est une API REST alors que vous vouliez GraphQL. Le flux d'auth est propre — mais il utilise des sessions alors que vous avez spécifié des JWTs. Les bugs se corrigent avec « corrige cette erreur ». La divergence nécessite une approche différente parce que l'agent pense avoir réussi.",
    },

    // === IDENTIFYING DIVERGENCE ===
    {
      type: 'info',
      title: 'Étape 1 : Comparer le résultat avec votre spec',
      body: "Avant de réagir émotionnellement (« c'est tout faux ! »), soyez précis. Ouvrez votre spec. Ouvrez le code. Parcourez chaque critère d'acceptation. Lesquels sont satisfaits ? Lesquels ne le sont pas ? Où exactement l'agent a-t-il dévié ? « L'agent a construit la mauvaise chose » n'est pas actionnable. « L'agent a utilisé du routing côté client pour le flux de checkout au lieu de redirections côté serveur comme spécifié au critère 3 » est actionnable.",
    },
    {
      type: 'diagram',
      title: 'Arbre de Décision de Récupération',
      body: 'Utilisez ce flux pour décider la bonne action de récupération selon l\'ampleur de la divergence de l\'agent.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'detect', label: 'Détecter la Divergence', sublabel: 'Résultat != spec', shape: 'rounded', highlight: true },
          { id: 'assess', label: 'Évaluer la Portée', sublabel: 'Combien est faux ?', shape: 'diamond' },
          { id: 'minor', label: 'Divergence Mineure', sublabel: '1-2 critères ratés', shape: 'rect' },
          { id: 'major', label: 'Divergence Majeure', sublabel: 'Architecture fausse', shape: 'rect' },
          { id: 'redirect', label: 'Redirection Ciblée', sublabel: 'Corriger des fichiers précis', shape: 'rounded' },
          { id: 'restart', label: 'Nouvelle Session', sublabel: 'Meilleure spec', shape: 'rounded' },
          { id: 'rollback', label: 'Git Rollback', sublabel: 'Revenir au bon état', shape: 'pill' },
        ],
        edges: [
          { from: 'detect', to: 'assess' },
          { from: 'assess', to: 'minor', label: 'peu de problèmes' },
          { from: 'assess', to: 'major', label: 'fondamental' },
          { from: 'minor', to: 'redirect' },
          { from: 'major', to: 'rollback' },
          { from: 'rollback', to: 'restart' },
        ],
      },
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a construit une API REST fonctionnelle avec 6 endpoints, mais votre spec demandait GraphQL avec un seul endpoint /graphql. Qu\'est-ce que c\'est ?',
      options: [
        'Un bug — l\'agent a fait une erreur dans l\'implémentation',
        'Divergence mineure — changez juste la couche de routing',
        'Divergence majeure — toute l\'architecture est différente',
        'Pas un problème — REST et GraphQL servent le même but',
      ],
      correctIndex: 2,
      explanation: 'REST vs GraphQL est une divergence architecturale, pas une correction de surface. La structure des resolvers, le système de types, les patterns de récupération de données et le code client sont fondamentalement différents. Ça nécessite un rollback et un nouveau départ avec une spec plus claire, pas une correction rapide.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Identification de divergence maîtrisée !',
    },

    // === TARGETED CORRECTIONS ===
    {
      type: 'info',
      title: 'Corrections ciblées : l\'outil de précision',
      body: "Pour une divergence mineure, vous n'avez pas besoin de réécrire ou recommencer. Vous avez besoin d'un prompt de correction précis qui dit à l'agent exactement ce qui ne va pas, exactement où, et exactement quoi faire à la place. « Réessaie » gaspille du contexte. « La fonction checkout dans src/lib/checkout.ts devrait rediriger côté serveur en utilisant redirect() de next/navigation, pas retourner une URL pour que le client navigue. Garde tout le reste pareil. » C'est actionnable.",
    },
    {
      type: 'code-demo',
      title: 'Mauvaise correction vs bonne correction',
      body: 'Les corrections vagues poussent l\'agent à faire plus de changements que nécessaire, introduisant potentiellement une nouvelle divergence.',
      language: 'text',
      filename: 'correction-examples.txt',
      code: "# BAD: Vague correction\n\"The checkout flow is wrong. Fix it.\"\n# Agent response: rewrites 5 files, changes things that were correct\n\n# BAD: Emotional correction\n\"This isn't what I asked for at all. I said server-side!\"\n# Agent response: apologizes, rewrites broadly, may break working code\n\n# GOOD: Targeted correction\n\"In src/lib/checkout.ts, the createCheckout function currently\nreturns a URL string. Change it to use redirect() from\nnext/navigation to perform a server-side redirect to the\nStripe checkout URL. The function signature should become\nasync with no return value. Only modify this file.\"\n# Agent response: changes exactly what you specified",
    },
    {
      type: 'info',
      title: 'La contrainte « ne modifier que »',
      body: "Quand vous donnez des corrections, ajoutez « Ne modifier que [fichiers spécifiques] » ou « Ne pas changer [fichiers spécifiques] ». Sans cette contrainte, l'agent pourrait propager les changements dans tout le codebase — mettant à jour les imports, refactorant les appelants, changeant les tests — créant une cascade de modifications que vous n'avez pas révisées. Réduisez le périmètre de vos corrections autant que possible.",
    },
    {
      type: 'code-diff',
      title: 'Avant et après une redirection ciblée',
      body: 'L\'agent utilisait initialement un filtrage côté client. Après une redirection ciblée (« utilise une clause SQL WHERE pour le filtrage côté serveur »), il a corrigé l\'approche.',
      language: 'typescript',
      filename: 'src/hooks/useBookmarks.ts',
      before: 'export function useBookmarks(searchTerm: string) {\n  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])\n\n  useEffect(() => {\n    supabase.from("bookmarks").select("*").then(({ data }) => {\n      const filtered = data?.filter(b =>\n        b.title.toLowerCase().includes(searchTerm.toLowerCase())\n      ) || []\n      setBookmarks(filtered)\n    })\n  }, [searchTerm])\n\n  return bookmarks\n}',
      after: 'export function useBookmarks(searchTerm: string) {\n  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])\n\n  useEffect(() => {\n    const query = supabase.from("bookmarks").select("*")\n    if (searchTerm) {\n      query.ilike("title", `%${searchTerm}%`)\n    }\n    query.then(({ data }) => {\n      setBookmarks(data || [])\n    })\n  }, [searchTerm])\n\n  return bookmarks\n}',
      explanation: 'Le filtrage côté serveur avec SQL est plus efficace -- il évite de télécharger tous les enregistrements vers le client. Une redirection ciblée (spécifiant « utilise SQL WHERE ») donne à l\'agent une correction claire sans réécrire toute la spec.',
    },
    {
      type: 'code-input',
      instruction: 'Écrivez une correction ciblée pour ce problème : l\'agent a créé l\'authentification utilisateur en utilisant localStorage, mais votre spec dit d\'utiliser des cookies HTTP-only. Ciblez le fichier src/lib/auth.ts.',
      placeholder: 'In src/lib/auth.ts, change...',
      answer: 'In src/lib/auth.ts, change the token storage from localStorage to HTTP-only cookies. Use cookies() from next/headers to set and read the session token. Remove all localStorage references. Only modify this file.',
      hint: 'Soyez précis sur le fichier, quoi changer, quoi utiliser à la place, et le périmètre du changement',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Corrections ciblées maîtrisées !',
    },

    // === WHEN TO RESTART ===
    {
      type: 'info',
      title: 'Quand les corrections ne suffisent pas',
      body: "Parfois la divergence est architecturale. L'agent a choisi une approche fondamentalement différente — mauvais modèle de données, mauvaise stratégie de rendu, mauvais pattern de gestion d'état. Corriger un fichier créerait des incohérences avec tout le reste qu'il a construit. Essayer de patcher une erreur architecturale fichier par fichier prend plus de temps que de repartir à neuf. Le signal : si corriger la divergence nécessite de changer plus de 3-4 fichiers, c'est probablement moins cher de recommencer.",
    },
    {
      type: 'info',
      title: 'Le protocole de redémarrage',
      body: "Redémarrer ne signifie pas tout perdre. D'abord : git stash ou branchez le travail actuel (vous pourriez vouloir le référencer). Deuxièmement : identifiez pourquoi l'agent a divergé — la spec était-elle ambiguë ? Manquait-il une contrainte critique ? Troisièmement : réécrivez la spec pour éliminer l'ambiguïté. Quatrièmement : commencez une nouvelle session avec la spec améliorée. L'erreur devient de la documentation — elle montre où votre spec n'était pas claire.",
    },
    {
      type: 'terminal',
      instruction: 'Avant de redémarrer, sauvez le travail divergent sur une branche pour pouvoir le référencer plus tard si nécessaire.',
      expectedCommand: 'git checkout -b divergent-attempt-1 && git add -A && git commit -m "save: divergent implementation for reference"',
      hint: 'Créez une branche, stagez tous les fichiers, et commitez l\'état actuel',
    },
    {
      type: 'code-demo',
      title: 'Améliorer la spec après une divergence',
      body: 'La divergence vous dit ce qui était ambigu. Ajoutez des contraintes explicites qui empêchent la même mauvaise interprétation.',
      language: 'markdown',
      filename: 'specs/checkout-v2.md',
      code: "# Checkout Flow — Revised Spec\n\n## What went wrong last time\nAgent built client-side navigation to Stripe. I need server-side redirect.\n\n## Constraints (ADDED after first attempt)\n- Server-side redirect via next/navigation redirect() — NOT client navigation\n- No checkout URLs returned to the client — redirect happens in server action\n- Success page must work WITHOUT JavaScript (SSR only)\n\n## Architecture Decision: Server Actions\nThe checkout flow uses Next.js Server Actions exclusively.\nNo API routes, no client-side fetch calls for the payment flow.\nThe user clicks a button → server action runs → server redirects to Stripe.\n\n## What I want to KEEP from the first attempt\n- The Stripe SDK setup in src/lib/stripe.ts (correct)\n- The product schema in src/db/schema.ts (correct)\n- The webhook handler structure (correct)",
    },
    {
      type: 'multiple-choice',
      question: 'L\'agent a construit l\'authentification avec du hachage bcrypt de mots de passe, mais vous vouliez OAuth seulement (pas de mots de passe). L\'auth touche 8 fichiers. Que devriez-vous faire ?',
      options: [
        'Donner des corrections ciblées à chacun des 8 fichiers un par un',
        'Dire à l\'agent de « passer des mots de passe à OAuth »',
        'Sauver le travail sur une branche, améliorer la spec, repartir à neuf',
        'Supprimer les fichiers d\'auth et demander à l\'agent de reconstruire juste cette partie',
      ],
      correctIndex: 2,
      explanation: 'L\'auth par mot de passe vs OAuth est architectural — schéma de base de données différent (pas de colonne password), UI différente (pas de formulaire d\'inscription), gestion de session différente, middleware différent. Patcher 8 fichiers crée des incohérences. Sauvez le travail pour référence, clarifiez la spec, et laissez l\'agent construire OAuth depuis zéro dans une nouvelle session.',
    },
    {
      type: 'checkpoint',
      xp: 4,
      message: 'Protocole de redémarrage appris !',
    },

    // === RECOVERY WORKFLOW ===
    {
      type: 'info',
      title: 'Le flux de récupération complet',
      body: "Détecter -> Évaluer -> Décider -> Agir. Détecter : remarquer que le résultat ne correspond pas à l'intention. Évaluer : combien de critères sont ratés ? Est-ce en surface (renommer, restructurer) ou architectural (mauvaise approche) ? Décider : si surface, correction ciblée. Si architectural, redémarrer. Agir : exécuter la correction ou le redémarrage. Puis vérifier que la correction n'a pas introduit de nouvelle divergence. Ce flux devrait prendre des minutes, pas des heures. La vitesse vient de la précision à l'étape d'évaluation.",
    },
    {
      type: 'terminal',
      instruction: 'Utilisez git diff pour identifier précisément ce que l\'agent a changé, afin d\'évaluer la portée de la divergence.',
      expectedCommand: 'git diff --stat',
      hint: 'git diff --stat montre un résumé de tous les fichiers modifiés et le nombre de lignes',
    },
    {
      type: 'code-demo',
      title: 'Template de prompt de récupération',
      body: 'Quand vous redirigez en cours de session, structurez votre correction comme : ce qui ne va pas, où ça ne va pas, quoi faire à la place.',
      language: 'text',
      filename: 'recovery-template.txt',
      code: "I need to correct the implementation in [specific area].\n\n## What is wrong\n[Describe the divergence from spec precisely]\n\n## Where it is wrong\n[List specific files and functions]\n\n## What to do instead\n[Describe the correct approach]\n\n## Do not change\n[List files/areas that are correct and should stay untouched]\n\n## After the fix, verify\n[How to confirm the correction worked]",
    },
    {
      type: 'order',
      instruction: 'Ordonnez les étapes du flux de récupération :',
      items: [
        'Vérifier que la correction n\'a pas introduit de nouvelle divergence',
        'Détecter que le résultat diverge de l\'intention de la spec',
        'Décider : correction ciblée ou redémarrage à neuf',
        'Exécuter la correction ou redémarrer avec une spec améliorée',
        'Évaluer la portée : problème de surface ou désaccord architectural',
      ],
      correctOrder: [1, 4, 2, 3, 0],
    },

    // === PROMPT LAB : REDIRIGER UN AGENT ===
    {
      type: 'prompt-lab',
      instruction: 'L\'agent a utilisé du filtrage côté client au lieu du côté serveur. Écris un prompt de redirection pour corriger ce problème spécifique.',
      scenario: 'Tu as demandé à l\'agent d\'ajouter une recherche à une page de favoris. Il a récupéré TOUS les favoris depuis Supabase et les a filtrés en JavaScript avec .filter(). Ça fonctionne mais c\'est lent avec beaucoup de favoris. Tu veux qu\'il utilise .ilike() de Supabase pour du filtrage côté serveur à la place.',
      starterPrompt: 'C\'est faux. Corrige.',
      responses: [
        {
          triggerKeywords: ['ilike', 'server', 'supabase', 'filter'],
          response: 'Tu as raison — je devrais filtrer au niveau de la base de données plutôt que côté client. Je vais mettre à jour la requête pour utiliser la méthode `.ilike()` de Supabase sur la colonne title.\n\nChangement :\n```\nconst filtered = data.filter(b => b.title.includes(term))\n```\nVers :\n```\nquery.ilike("title", `%${term}%`)\n```\n\nCela déplace le filtrage vers PostgreSQL, là où il doit être.',
          quality: 'excellent',
          feedback: 'Spécifique, actionnable et ciblé. Tu as nommé la méthode exacte (.ilike), la raison (côté serveur), et la technologie (Supabase). L\'agent sait exactement quoi changer sans deviner.',
        },
        {
          triggerKeywords: ['server', 'database', 'query'],
          response: 'Je vais déplacer le filtrage côté serveur. Laisse-moi mettre à jour la requête de base de données pour gérer la recherche.\n\nVeux-tu que j\'utilise :\n1. PostgreSQL LIKE\n2. Recherche plein texte avec tsvector\n3. Un index de recherche comme Meilisearch ?\n\nDis-moi.',
          quality: 'good',
          feedback: 'Tu as identifié le problème (devrait être côté serveur) mais laissé l\'implémentation ouverte. L\'agent pose des questions de suivi au lieu d\'exécuter. Nomme la méthode spécifique (ilike, LIKE, etc.) pour éliminer le point de décision.',
        },
      ],
      fallbackResponse: {
        response: 'Je ne suis pas sûr de ce qui ne va pas. La recherche fonctionne — elle trouve les favoris correspondants. Pouvez-vous être plus précis sur ce qu\'il faut corriger ?',
        feedback: 'Ta redirection était trop vague. L\'agent ne sait pas ce qui ne va pas. Une bonne redirection nomme : (1) ce que l\'agent a fait de travers, (2) ce qu\'il devrait faire à la place, et (3) la méthode ou l\'approche spécifique à utiliser.',
      },
    },

    // === PREVENTION ===
    {
      type: 'info',
      title: 'Réduire la divergence dans les futures sessions',
      body: "Chaque divergence vous apprend quelque chose sur votre spec. Tenez un journal mental (ou écrit) : « L'agent a utilisé REST au lieu de GraphQL » signifie que votre spec devait mentionner le style d'API explicitement. « L'agent a utilisé le stockage côté client » signifie que votre spec avait besoin d'une contrainte de persistance de données. Avec le temps, vous construisez une bibliothèque de contraintes que vous incluez toujours. Les meilleures specs viennent de gens qui ont récupéré de divergences de nombreuses fois.",
    },
    {
      type: 'checklist',
      title: 'Habitudes du flux de récupération :',
      items: [
        'Je compare le résultat de l\'agent avec ma spec avant de réagir',
        'J\'évalue si la divergence est de surface ou architecturale',
        'Mes corrections sont ciblées : fichier spécifique, changement spécifique, approche spécifique',
        'J\'utilise les contraintes « ne modifier que » pour empêcher les cascades de correction',
        'Je sauve le travail divergent sur une branche avant de redémarrer',
        'J\'améliore ma spec après chaque divergence pour empêcher la récurrence',
        'Je vérifie que les corrections n\'ont pas introduit de nouveaux problèmes',
      ],
    },
    {
      type: 'checkpoint',
      xp: 13,
      message: 'Maîtrise de la récupération débloquée ! Vous pouvez efficacement rediriger n\'importe quel agent sur la bonne voie.',
    },
  ],
}

export default content
