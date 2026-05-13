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
      type: 'multiple-choice',
      question: 'L\'agent a construit quelque chose qui ne correspond pas a votre spec. Que devez-vous faire EN PREMIER ?',
      options: [
        'Dire a l\'agent "c\'est tout faux, recommence"',
        'Parcourir chaque critere d\'acceptation et identifier specifiquement ou l\'agent a devie',
        'Supprimer tout le code genere et l\'ecrire vous-meme',
        'Accepter le resultat tel quel et contourner les differences',
      ],
      correctIndex: 1,
      explanation: 'Avant de reagir, soyez precis. Parcourez chaque critere d\'acceptation. Lesquels sont satisfaits ? Lesquels ne le sont pas ? Ou exactement l\'agent a-t-il devie ? "L\'agent a construit la mauvaise chose" n\'est pas actionnable. "L\'agent a utilise du routing cote client au lieu de redirections cote serveur comme specifie au critere 3" est actionnable.',
    },
    {
      type: 'interactive-diagram',
      title: 'Arbre de Decision de Recuperation',
      body: 'Utilisez ce flux pour decider la bonne action de recuperation selon l\'ampleur de la divergence de l\'agent.',
      diagram: {
        direction: 'TB',
        nodes: [
          { id: 'detect', label: 'Detecter la Divergence', sublabel: 'Resultat != spec', shape: 'rounded', highlight: true },
          { id: 'assess', label: 'Evaluer la Portee', sublabel: 'Combien est faux ?', shape: 'diamond' },
          { id: 'minor', label: 'Divergence Mineure', sublabel: '1-2 criteres rates', shape: 'rect' },
          { id: 'major', label: 'Divergence Majeure', sublabel: 'Architecture fausse', shape: 'rect' },
          { id: 'redirect', label: 'Redirection Ciblee', sublabel: 'Corriger des fichiers precis', shape: 'rounded' },
          { id: 'restart', label: 'Nouvelle Session', sublabel: 'Meilleure spec', shape: 'rounded' },
          { id: 'rollback', label: 'Git Rollback', sublabel: 'Revenir au bon etat', shape: 'pill' },
        ],
        edges: [
          { from: 'detect', to: 'assess' },
          { from: 'assess', to: 'minor', label: 'peu de problemes' },
          { from: 'assess', to: 'major', label: 'fondamental' },
          { from: 'minor', to: 'redirect' },
          { from: 'major', to: 'rollback' },
          { from: 'rollback', to: 'restart' },
        ],
      },
      stages: [
        {
          highlightNodes: ['detect'],
          highlightEdges: [],
          explanation: 'Vous remarquez que le resultat ne correspond pas a votre spec. Ne reagissez pas emotionnellement — passez a l\'evaluation.',
        },
        {
          highlightNodes: ['assess'],
          highlightEdges: [{ from: 'detect', to: 'assess' }],
          explanation: 'Comptez combien de criteres d\'acceptation sont faux. Est-ce 1-2 problemes specifiques, ou toute l\'approche est differente ?',
        },
        {
          highlightNodes: ['minor', 'redirect'],
          highlightEdges: [{ from: 'assess', to: 'minor' }, { from: 'minor', to: 'redirect' }],
          explanation: 'Divergence mineure (1-2 criteres rates) : donnez une correction ciblee — fichier specifique, changement specifique, approche specifique. Ajoutez "ne modifier que ce fichier" pour empecher la cascade.',
        },
        {
          highlightNodes: ['major', 'rollback'],
          highlightEdges: [{ from: 'assess', to: 'major' }, { from: 'major', to: 'rollback' }],
          explanation: 'Divergence majeure (mauvaise architecture) : toute l\'approche est differente. Sauvez le travail sur une branche avec git, puis revenez a un etat correct connu.',
        },
        {
          highlightNodes: ['rollback', 'restart'],
          highlightEdges: [{ from: 'rollback', to: 'restart' }],
          explanation: 'Apres le rollback, ameliorez votre spec pour empecher la meme mauvaise interpretation. Commencez une session fraiche avec la spec clarifiee. L\'erreur devient de la documentation.',
        },
      ],
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
      type: 'multiple-choice',
      question: 'L\'agent a utilise la navigation cote client au lieu de redirections cote serveur. Quel prompt de correction est le meilleur ?',
      options: [
        '"Le flux de checkout est faux. Corrige."',
        '"Ce n\'est pas du tout ce que j\'ai demande !"',
        '"Dans src/lib/checkout.ts, change createCheckout pour utiliser redirect() de next/navigation au lieu de retourner une URL. Ne modifier que ce fichier."',
        '"Reessaie et cette fois fais-le correctement."',
      ],
      correctIndex: 2,
      explanation: 'Les corrections ciblees disent a l\'agent exactement ce qui ne va pas, exactement ou, et exactement quoi faire a la place. Les corrections vagues ("corrige") poussent l\'agent a reecrire plus que necessaire, introduisant potentiellement une nouvelle divergence. La cle est la specificite : fichier, fonction, comportement actuel, comportement desire, et contrainte de perimetre.',
    },
    {
      type: 'compare',
      title: 'Correction vague vs correction ciblee',
      body: 'La precision de votre correction determine si l\'agent corrige le probleme ou en cree de nouveaux.',
      question: 'Quel prompt de correction produira le meilleur resultat ?',
      correctSide: 'right',
      left: {
        label: 'Vague (cause cascade)',
        content: '"Le flux de checkout est faux. Corrige."\n\nReponse de l\'agent :\n- Reecrit 5 fichiers\n- Change des choses qui etaient correctes\n- Introduit une nouvelle divergence\n- Casse des chemins d\'import fonctionnels\n- Vous avez maintenant PLUS a corriger',
        language: 'text',
      },
      right: {
        label: 'Ciblee (correction chirurgicale)',
        content: '"Dans src/lib/checkout.ts, la fonction\ncreateCheckout retourne actuellement une URL.\nChange-la pour utiliser redirect() de\nnext/navigation pour une redirection cote\nserveur. Ne modifier que ce fichier."\n\nReponse de l\'agent :\n- Change exactement un fichier\n- Preserve tout le reste\n- Un diff propre a reviser',
        language: 'text',
      },
      explanation: 'Les corrections ciblees nomment : (1) le fichier specifique, (2) la fonction specifique, (3) ce qu\'elle fait actuellement de faux, (4) ce qu\'elle devrait faire a la place, et (5) la contrainte de perimetre ("ne modifier que ce fichier"). Ca empeche l\'agent de propager des changements inutiles.',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi devez-vous ajouter "Ne modifier que ce fichier" aux prompts de correction ?',
      options: [
        'Ca fait travailler l\'agent plus vite',
        'Sans contrainte de perimetre, l\'agent peut propager des changements dans tout le codebase — mettant a jour les imports, refactorant les appelants, changeant les tests — creant des modifications en cascade non revisees',
        'L\'agent refusera de travailler sans permissions de fichiers explicites',
        'C\'est requis par l\'API Claude Code',
      ],
      correctIndex: 1,
      explanation: 'Sans la contrainte "ne modifier que", l\'agent peut propager les changements dans tout le codebase — mettant a jour les imports, refactorant les appelants, changeant les tests. Ca cree une cascade de modifications que vous n\'avez pas revisees, introduisant potentiellement une nouvelle divergence. Reduisez toujours le perimetre des corrections autant que possible.',
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
      type: 'multiple-choice',
      question: 'L\'agent a utilise le mauvais pattern de gestion d\'etat et ca touche 6 fichiers. Quelle est la recuperation la plus efficace ?',
      options: [
        'Donner des corrections ciblees a chacun des 6 fichiers un par un',
        'Dire a l\'agent de refactorer les 6 fichiers d\'un coup',
        'Sauver le travail sur une branche, identifier pourquoi la spec etait ambigue, l\'ameliorer, et commencer une session fraiche',
        'Accepter le mauvais pattern et contourner',
      ],
      correctIndex: 2,
      explanation: 'Si corriger la divergence necessite de changer plus de 3-4 fichiers, recommencer est moins cher. Le protocole de redemarrage : (1) sauver le travail sur une branche, (2) identifier pourquoi l\'agent a diverge (ambiguite de la spec ?), (3) reecrire la spec pour eliminer l\'ambiguite, (4) repartir a neuf. L\'erreur devient de la documentation montrant ou votre spec n\'etait pas claire.',
    },
    {
      type: 'multiple-choice',
      question: 'Apres avoir sauve le travail divergent sur une branche, que devez-vous faire AVANT de commencer une session fraiche ?',
      options: [
        'Supprimer la branche pour eviter la confusion',
        'Copier-coller les bonnes parties dans la nouvelle session',
        'Identifier pourquoi l\'agent a diverge et reecrire la spec pour eliminer l\'ambiguite qui l\'a cause',
        'Demander a un autre modele IA de reviser le code divergent',
      ],
      correctIndex: 2,
      explanation: 'L\'etape cle entre sauver et redemarrer est ameliorer votre spec. La divergence vous dit exactement ce qui etait ambigu. Ajoutez des contraintes explicites qui empechent la meme mauvaise interpretation. L\'erreur devient de la documentation — elle montre ou votre spec n\'etait pas claire.',
    },
    {
      type: 'terminal',
      instruction: 'Avant de redémarrer, sauvez le travail divergent sur une branche pour pouvoir le référencer plus tard si nécessaire.',
      expectedCommand: 'git checkout -b divergent-attempt-1 && git add -A && git commit -m "save: divergent implementation for reference"',
      hint: 'Créez une branche, stagez tous les fichiers, et commitez l\'état actuel',
    },
    {
      type: 'code-fill',
      instruction: 'Completez cette spec revisee qui empeche la meme divergence de se reproduire :',
      language: 'markdown',
      filename: 'specs/checkout-v2.md',
      template: '# Flux Checkout — Spec Revisee\n\n## Ce qui a mal tourne la derniere fois\nL\'agent a construit une {{wrong_approach}} vers Stripe. J\'ai besoin d\'une redirection cote serveur.\n\n## Contraintes (AJOUTEES apres la premiere tentative)\n- Redirection cote serveur via next/navigation {{redirect_fn}}() — PAS de navigation client\n- Aucune URL de checkout retournee au client — la redirection se fait dans une {{action_type}}\n- La page de succes doit fonctionner SANS {{no_js}} (SSR seulement)\n\n## Ce que je veux GARDER de la premiere tentative\n- La config Stripe SDK dans src/lib/stripe.ts (correcte)\n- Le schema produit dans src/db/schema.ts (correct)',
      blanks: [
        { id: 'wrong_approach', answer: 'navigation cote client', alternatives: ['client-side navigation', 'navigation client', 'navigation côté client'], placeholder: 'qu\'est-ce qui a mal tourne ?', hint: 'L\'agent a navigue cote client au lieu du serveur' },
        { id: 'redirect_fn', answer: 'redirect', alternatives: ['Redirect'], placeholder: 'quelle fonction ?', hint: 'La fonction Next.js pour les redirections cote serveur' },
        { id: 'action_type', answer: 'server action', alternatives: ['Server Action', 'server actions', 'Server Actions'], placeholder: 'ou se fait la redirection ?', hint: 'Le pattern Next.js pour les mutations cote serveur' },
        { id: 'no_js', answer: 'JavaScript', alternatives: ['javascript', 'JS', 'js'], placeholder: 'sans quoi ?', hint: 'SSR signifie que la page fonctionne meme si ceci est desactive' },
      ],
      explanation: 'La spec revisee documente ce qui a mal tourne, ajoute des contraintes explicites qui empechent la recurrence, et liste ce qu\'il faut garder de la premiere tentative. Ca transforme chaque divergence en une meilleure spec pour la prochaine session.',
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
      type: 'multiple-choice',
      question: 'Qu\'est-ce qui determine si la recuperation prend des minutes ou des heures ?',
      options: [
        'La taille du codebase',
        'A quelle vitesse vous pouvez taper les prompts de correction',
        'La precision a l\'etape d\'evaluation — identifier correctement si la divergence est de surface ou architecturale',
        'Si vous utilisez git ou non',
      ],
      correctIndex: 2,
      explanation: 'Le flux complet est : Detecter, Evaluer, Decider, Agir. La vitesse vient de la precision a l\'etape d\'Evaluation. Identifier correctement la divergence de surface vs architecturale signifie que vous choisissez la bonne action de recuperation (correction ciblee vs redemarrage) du premier coup. Mal evaluer la portee gaspille du temps sur des corrections qui cascadent en plus de problemes.',
    },
    {
      type: 'terminal',
      instruction: 'Utilisez git diff pour identifier précisément ce que l\'agent a changé, afin d\'évaluer la portée de la divergence.',
      expectedCommand: 'git diff --stat',
      hint: 'git diff --stat montre un résumé de tous les fichiers modifiés et le nombre de lignes',
    },
    {
      type: 'code-fill',
      instruction: 'Completez ce template de prompt de recuperation avec les bonnes sections :',
      language: 'text',
      filename: 'recovery-template.txt',
      template: "Je dois corriger l'implementation dans [zone specifique].\n\n## Ce qui est {{section_1}}\n[Decrire la divergence de la spec precisement]\n\n## Ou c'est faux\n[Lister les {{location_type}} et fonctions specifiques]\n\n## Quoi faire {{section_3}}\n[Decrire l'approche correcte]\n\n## Ne pas {{constraint}}\n[Lister les fichiers/zones correctes qui ne doivent pas etre touches]",
      blanks: [
        { id: 'section_1', answer: 'faux', alternatives: ['Faux', 'incorrect', 'wrong'], placeholder: 'quelle section ?', hint: 'Decrire le probleme' },
        { id: 'location_type', answer: 'fichiers', alternatives: ['Fichiers', 'files', 'chemins de fichiers'], placeholder: 'lister quoi ?', hint: 'Les emplacements exacts dans le codebase' },
        { id: 'section_3', answer: 'a la place', alternatives: ['A la place', 'instead', 'differemment'], placeholder: 'quelle section ?', hint: 'L\'approche alternative' },
        { id: 'constraint', answer: 'changer', alternatives: ['Changer', 'modifier', 'toucher'], placeholder: 'contrainte ?', hint: 'Proteger le code fonctionnel des modifications inutiles' },
      ],
      explanation: 'Un prompt de recuperation a 4 parties : ce qui est faux (divergence precise), ou (fichiers specifiques), quoi faire a la place (approche correcte), et quoi NE PAS changer (contrainte de perimetre). Cette structure donne a l\'agent un maximum de clarte avec un minimum de risque de cascade.',
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
      type: 'multiple-choice',
      question: 'L\'agent utilise toujours REST quand vous voulez GraphQL a travers differents projets. Quelle est la solution a long terme ?',
      options: [
        'Passer a un modele IA different qui utilise GraphQL par defaut',
        'Toujours corriger l\'agent apres qu\'il construit des endpoints REST',
        'Construire une bibliotheque de contraintes de spec que vous incluez toujours — "Style API : GraphQL avec un seul endpoint /graphql" devient un defaut dans vos specs',
        'Abandonner GraphQL et accepter REST',
      ],
      correctIndex: 2,
      explanation: 'Chaque divergence vous apprend quelque chose sur votre spec. "L\'agent a utilise REST" signifie que votre spec doit mentionner le style d\'API explicitement. Avec le temps, vous construisez une bibliotheque personnelle de contraintes que vous incluez toujours. Les meilleures specs viennent de gens qui ont recupere de divergences de nombreuses fois et codifie les lecons.',
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
