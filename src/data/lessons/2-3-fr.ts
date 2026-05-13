import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-3',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Votre travail est la vérification, pas l\'implémentation',
      body: "Claude Code peut scaffolder un système d'authentification complet en minutes — providers, middleware, politiques RLS, tout le kit. Mais les agents font des suppositions optimistes sur les accès. Ils supposent que si la requête fonctionne pour un admin, elle fonctionne pour tout le monde. Votre rôle n'est pas d'écrire des politiques RLS à la main. C'est de vérifier que l'agent n'a pas laissé de trous. Vous êtes l'auditeur de sécurité, pas l'ingénieur en sécurité.",
    },
    {
      type: 'info',
      title: 'Pourquoi les agents se trompent sur l\'auth',
      body: "Les agents génèrent du code qui fonctionne pour le chemin heureux. Ils testent avec la clé service role (qui contourne le RLS). Ils oublient que les nouvelles tables n'héritent d'aucune politique par défaut. Ils laissent des clés de service dans le code côté client parce que ça faisait fonctionner la fonction. L'auth est adversariale — vous devez penser à ce qu'un attaquant essaierait, pas juste à ce qu'un utilisateur ferait. Les agents ne pensent pas de manière adversariale à moins que vous ne les y forciez.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'État d\'esprit verrouillé : vous êtes l\'auditeur.',
    },

    // === SPECCING THE AUTH SYSTEM ===
    {
      type: 'multiple-choice',
      question: 'Avant de dire a l\'agent de construire l\'auth, vous avez besoin d\'une spec. Quelle section est la PLUS critique pour empecher l\'agent de laisser des trous de securite ?',
      options: [
        'Les providers OAuth supportes (Google, GitHub)',
        'La gestion de session (duree du JWT, strategie de rafraichissement)',
        'Le contrat RLS (qui peut lire/ecrire quelles tables)',
        'Le design de l\'interface de la page de connexion',
      ],
      correctIndex: 2,
      explanation: 'Le contrat RLS est la section la plus critique. Sans regles d\'acces explicites par table, l\'agent va soit ignorer le RLS entierement soit ecrire des politiques trop permissives. Les providers et la config de session comptent, mais les trous de securite viennent de politiques RLS manquantes ou incorrectes.',
    },
    {
      type: 'code-fill',
      instruction: 'Donnez a l\'agent une spec d\'auth structuree. Completez la section du contrat RLS — c\'est ce qui empeche l\'agent de sauter les politiques.',
      language: 'markdown',
      filename: 'auth-spec.md',
      template: '## Auth Requirements\n\n### Providers\n- Email/password with confirmation\n- OAuth: Google, GitHub\n\n### Roles\n- anonymous: can read public content\n- authenticated: can CRUD own data\n- admin: full access (checked via profiles.role)\n\n### Protected Routes\n- /dashboard/* → authenticated\n- /admin/* → admin role\n\n### RLS Contract\n- profiles: {{profiles_policy}}\n- posts: anyone reads published, {{posts_policy}}\n- comments: {{comments_policy}}\n\n### Session\n- JWT expiry: 1 hour\n- Refresh token: 7 days',
      blanks: [
        { id: 'profiles_policy', answer: 'users read own, admins read all', alternatives: ['users read own, admin reads all', 'user reads own, admins read all'], placeholder: 'qui lit les profils ?', hint: 'Les utilisateurs reguliers voient seulement le leur, les admins voient tout le monde' },
        { id: 'posts_policy', answer: 'owner CRUDs own', alternatives: ['owner CRUD own', 'owner creates/reads/updates/deletes own', 'owner manages own'], placeholder: 'qui gere les posts ?', hint: 'La personne qui a cree le post devrait avoir le controle total' },
        { id: 'comments_policy', answer: 'authenticated creates, owner deletes', alternatives: ['authenticated create, owner delete', 'authenticated inserts, owner deletes'], placeholder: 'qui gere les commentaires ?', hint: 'Tout utilisateur connecte peut creer, mais seul l\'auteur peut supprimer' },
      ],
      explanation: 'Chaque entree du contrat RLS specifie exactement qui peut faire quoi. Sans cela, l\'agent va deviner — et ses devinettes tendent vers des politiques permissives comme USING (true) qui exposent toutes les donnees.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Structure de spec d\'auth comprise !',
    },

    // === DIRECTING SUPABASE AUTH SETUP ===
    {
      type: 'order',
      instruction: 'Diriger l\'agent a travers l\'auth Supabase necessite un sequencage. Ordonnez ces etapes correctement — si vous envoyez tout d\'un coup, l\'agent va sauter des etapes ou prendre des decisions contradictoires :',
      items: [
        'Ecrire les politiques RLS pour chaque table',
        'Initialiser Supabase localement',
        'Creer la table profiles liee a auth.users',
        'Configurer l\'auth par email avec confirmation activee',
        'Configurer les providers OAuth',
      ],
      correctOrder: [1, 3, 4, 2, 0],
    },
    {
      type: 'terminal',
      instruction: 'Initialisez un nouveau projet Supabase dans le répertoire courant :',
      expectedCommand: 'supabase init',
      hint: 'La commande du CLI Supabase pour scaffolder la config du projet local',
    },
    {
      type: 'code-fill',
      instruction: 'L\'agent genere le client Supabase. Verifiez qu\'il utilise le bon type de cle — la MAUVAISE cle ici est une vulnerabilite critique.',
      language: 'typescript',
      filename: 'src/lib/supabase.ts',
      template: "import { createClient } from '@supabase/supabase-js'\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL\nconst supabaseKey = import.meta.env.{{env_key_name}}\n\nexport const supabase = createClient(supabaseUrl, supabaseKey, {\n  auth: {\n    autoRefreshToken: true,\n    {{session_option}}: true,\n    detectSessionInUrl: true,\n  },\n})",
      blanks: [
        { id: 'env_key_name', answer: 'VITE_SUPABASE_ANON_KEY', alternatives: ['VITE_SUPABASE_ANON_KEY'], placeholder: 'quelle var d\'env ?', hint: 'La cle PUBLIQUE qui respecte le RLS — PAS la cle service role' },
        { id: 'session_option', answer: 'persistSession', alternatives: ['persistSession'], placeholder: 'quelle option d\'auth ?', hint: 'Garde l\'utilisateur connecte entre les rafraichissements du navigateur' },
      ],
      explanation: 'Utiliser VITE_SUPABASE_ANON_KEY est critique. La cle anon respecte les politiques RLS. Utiliser la cle service role dans le code client contournerait TOUTE la securite et exposerait chaque ligne de chaque table.',
    },
    {
      type: 'code-fill',
      instruction: 'L\'agent genere des helpers OAuth. Completez les parties critiques — l\'URL de redirection doit utiliser une origine dynamique (pas codee en dur) et les scopes doivent etre minimaux.',
      language: 'typescript',
      filename: 'src/lib/auth.ts',
      template: "import { supabase } from './supabase'\n\nexport async function signInWithGitHub() {\n  const origin = {{origin_source}}\n  return supabase.auth.signInWithOAuth({\n    provider: 'github',\n    options: {\n      redirectTo: origin + '/auth/callback',\n      scopes: '{{github_scopes}}',\n    },\n  })\n}\n\nexport async function signInWithEmail(email: string, password: string) {\n  return supabase.auth.{{email_method}}({ email, password })\n}",
      blanks: [
        { id: 'origin_source', answer: 'window.location.origin', alternatives: ['window.location.origin'], placeholder: 'origine dynamique ?', hint: 'L\'API navigateur qui retourne le protocole + hote courant' },
        { id: 'github_scopes', answer: 'read:user user:email', alternatives: ['read:user user:email', 'user:email read:user'], placeholder: 'scopes GitHub minimaux ?', hint: 'Demandez seulement ce dont vous avez besoin : lire les infos utilisateur et l\'email' },
        { id: 'email_method', answer: 'signInWithPassword', alternatives: ['signInWithPassword'], placeholder: 'quelle methode Supabase ?', hint: 'La methode pour l\'authentification email + mot de passe' },
      ],
      explanation: 'Utiliser window.location.origin rend l\'URL de redirection fonctionnelle dans tous les environnements (dev local, preview, production). Les URLs codees en dur cassent en production. Les scopes minimaux suivent le principe du moindre privilege.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Configuration auth dirigée avec succès !',
    },

    // === ROW-LEVEL SECURITY ===
    {
      type: 'multiple-choice',
      question: 'Quel est le plus grand risque quand les agents creent de nouvelles tables de base de donnees ?',
      options: [
        'L\'agent pourrait utiliser des types de colonnes incorrects',
        'L\'agent pourrait oublier d\'ajouter des index pour la performance',
        'L\'agent pourrait oublier d\'activer le RLS entierement — laissant la table grande ouverte a quiconque a la cle anon',
        'L\'agent pourrait utiliser trop de cles etrangeres',
      ],
      correctIndex: 2,
      explanation: 'Le RLS est l\'autorisation native de Postgres. Quand active, chaque requete doit passer une verification de politique — meme si le code applicatif ne filtre pas. Le plus grand risque : les agents creent de nouvelles tables et oublient d\'activer le RLS. Une table sans RLS est grande ouverte. Defense en profondeur : meme si votre API a un bug, le RLS empeche les acces non autorises au niveau de la base de donnees.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez les politiques RLS pour une table profiles. Surveillez : auth.uid() utilise correctement, politiques separees par operation, pas de USING (true) global.',
      language: 'sql',
      filename: 'supabase/migrations/002_rls_profiles.sql',
      template: '-- Enable RLS\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\n\n-- Users can read their own profile\nCREATE POLICY "Users read own profile"\n  ON profiles FOR SELECT\n  USING ({{own_profile_check}});\n\n-- Admins can read all profiles\nCREATE POLICY "Admins read all profiles"\n  ON profiles FOR SELECT\n  USING (\n    EXISTS (\n      SELECT 1 FROM profiles\n      WHERE id = auth.uid() AND role = \'{{admin_role}}\'\n    )\n  );\n\n-- Users can update their own profile\nCREATE POLICY "Users update own profile"\n  ON profiles FOR {{update_op}}\n  USING (auth.uid() = id)\n  WITH CHECK (auth.uid() = id);',
      blanks: [
        { id: 'own_profile_check', answer: 'auth.uid() = id', alternatives: ['auth.uid() = id'], placeholder: 'verification de propriete ?', hint: 'Comparer l\'ID de l\'utilisateur authentifie a l\'ID de la ligne' },
        { id: 'admin_role', answer: 'admin', alternatives: ['admin'], placeholder: 'nom du role ?', hint: 'La chaine de role qui accorde l\'acces complet' },
        { id: 'update_op', answer: 'UPDATE', alternatives: ['update', 'UPDATE'], placeholder: 'quelle operation SQL ?', hint: 'L\'operation qui modifie des lignes existantes' },
      ],
      explanation: 'auth.uid() = id restreint les lignes a leur proprietaire. La politique admin utilise une sous-requete pour verifier la colonne role. Des politiques SELECT et UPDATE separees donnent un controle granulaire. N\'utilisez jamais USING (true) — ca autorise tout le monde a acceder a tout.',
    },
    {
      type: 'multiple-choice',
      question: 'Un agent crée une nouvelle table « comments » mais n\'ajoute aucune politique RLS. Que se passe-t-il quand un utilisateur connecté interroge cette table ?',
      options: [
        'Il voit seulement ses propres commentaires (comportement sécuritaire par défaut)',
        'Il voit tous les commentaires (le RLS est permissif par défaut s\'il n\'y a pas de politiques)',
        'Il ne voit aucune ligne (le RLS sans politiques bloque tout accès)',
        'La requête lance une erreur de permission',
      ],
      correctIndex: 2,
      explanation: 'Quand le RLS est activé mais qu\'aucune politique n\'est définie, Postgres refuse tout accès par défaut. C\'est en fait sécuritaire — mais si l\'agent a oublié d\'activer le RLS du tout, la table est grande ouverte. Vérifiez toujours que le RLS est activé ET a les bonnes politiques.',
    },

    // === AUTH FLOW DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Flux d\'Auth : du Login a l\'Acces aux Donnees',
      body: 'Chaque requete authentifiee passe par ce flux. La verification RLS se fait au niveau de la base de donnees, pas dans votre code applicatif. Parcourez chaque etape.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'login', label: 'Login', sublabel: 'Email/OAuth', shape: 'rounded' },
          { id: 'session', label: 'Session', sublabel: 'Token JWT', shape: 'rect' },
          { id: 'request', label: 'Requete API', sublabel: 'Bearer Token', shape: 'rect' },
          { id: 'rls', label: 'Verif. RLS', sublabel: 'Eval. politique', shape: 'diamond', highlight: true },
          { id: 'data', label: 'Acces Donnees', sublabel: 'Lignes retournees', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'login', to: 'session', label: 'succes' },
          { from: 'session', to: 'request', label: 'attacher JWT' },
          { from: 'request', to: 'rls', label: 'requete' },
          { from: 'rls', to: 'data', label: 'pass' },
        ],
      },
      stages: [
        {
          highlightNodes: ['login'],
          highlightEdges: [],
          explanation: 'L\'utilisateur s\'authentifie via email/mot de passe ou OAuth. Supabase gere le handshake du provider et retourne une session.',
        },
        {
          highlightNodes: ['login', 'session'],
          highlightEdges: [{ from: 'login', to: 'session' }],
          explanation: 'En cas de succes, Supabase emet un JWT contenant l\'ID utilisateur (auth.uid()). Ce token est stocke cote client et auto-rafraichi.',
        },
        {
          highlightNodes: ['session', 'request'],
          highlightEdges: [{ from: 'session', to: 'request' }],
          explanation: 'Chaque requete API inclut le JWT comme Bearer token. Le client Supabase fait cela automatiquement.',
        },
        {
          highlightNodes: ['request', 'rls'],
          highlightEdges: [{ from: 'request', to: 'rls' }],
          explanation: 'Postgres extrait auth.uid() du JWT et evalue les politiques RLS. Cela se passe au niveau de la base de donnees — votre code applicatif ne peut pas le contourner.',
        },
        {
          highlightNodes: ['rls', 'data'],
          highlightEdges: [{ from: 'rls', to: 'data' }],
          explanation: 'Seules les lignes qui passent la verification de politique sont retournees. Si l\'utilisateur essaie de lire les donnees d\'un autre, le RLS les filtre silencieusement — pas d\'erreur, juste des resultats vides.',
        },
      ],
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Fondamentaux RLS verrouillés !',
    },

    // === EXERCICES RLS INTERACTIFS ===
    {
      type: 'compare',
      title: 'Politique RLS dangereuse vs securisee',
      body: 'Les politiques Row-Level Security determinent qui peut acceder a quelles donnees. Une seule erreur expose tout.',
      question: 'Quelle politique restreint correctement l\'acces au proprietaire de la ligne ?',
      correctSide: 'right',
      left: {
        label: 'Dangereuse',
        content: 'CREATE POLICY "users_read"\n  ON profiles FOR SELECT\n  USING (true);\n\n-- Probleme : CHAQUE utilisateur peut lire\n-- les donnees de CHAQUE autre utilisateur',
        language: 'sql',
      },
      right: {
        label: 'Securisee',
        content: 'CREATE POLICY "users_read_own"\n  ON profiles FOR SELECT\n  USING (auth.uid() = id);\n\n-- Seul le proprietaire du profil\n-- peut lire ses propres donnees',
        language: 'sql',
      },
      explanation: 'USING (true) signifie « autoriser tout le monde » — c\'est l\'erreur RLS la plus courante des agents. Utilisez toujours auth.uid() = id pour restreindre les lignes a leur proprietaire.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez les politiques RLS pour une table comments. Les utilisateurs peuvent lire tous les commentaires, mais seulement inserer et supprimer les leurs.',
      language: 'sql',
      filename: 'supabase/migrations/003_rls_comments.sql',
      template: 'ALTER TABLE comments ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "anyone_can_read" ON comments\n  FOR {{read_op}}\n  USING ({{read_condition}});\n\nCREATE POLICY "own_comments_insert" ON comments\n  FOR INSERT\n  WITH CHECK ({{insert_check}});\n\nCREATE POLICY "own_comments_delete" ON comments\n  FOR DELETE\n  USING ({{delete_condition}});',
      blanks: [
        { id: 'read_op', answer: 'SELECT', alternatives: ['select'], placeholder: 'quelle operation ?', hint: 'Lire des donnees = quelle operation SQL ?' },
        { id: 'read_condition', answer: 'true', placeholder: 'autoriser qui ?', hint: 'Tout le monde peut lire — quelle valeur booleenne autorise tous ?' },
        { id: 'insert_check', answer: 'auth.uid() = user_id', alternatives: ['auth.uid() = author_id'], placeholder: 'verification de propriete ?', hint: 'Verifier que l\'utilisateur authentifie correspond au proprietaire de la ligne' },
        { id: 'delete_condition', answer: 'auth.uid() = user_id', alternatives: ['auth.uid() = author_id'], placeholder: 'verification de propriete ?', hint: 'Meme pattern que l\'insertion — supprimer seulement les siens' },
      ],
      explanation: 'SELECT utilise USING (true) car tous les commentaires sont publics. INSERT utilise WITH CHECK pour verifier la propriete a la creation. DELETE utilise USING pour verifier la propriete avant la suppression.',
    },
    {
      type: 'match',
      instruction: 'Associez chaque faille de securite a ce qu\'elle expose :',
      leftItems: ['RLS non active sur la table', 'Politique utilise USING (true)', 'WITH CHECK manquant sur INSERT', 'Cle service role dans le code client'],
      rightItems: ['N\'importe qui peut inserer des lignes en tant que n\'importe quel utilisateur', 'Toutes les lignes visibles par tous les utilisateurs', 'Contournement complet de la table — aucune securite', 'Acces admin complet depuis la console du navigateur'],
      correctPairs: { 0: 2, 1: 1, 2: 0, 3: 3 },
      explanation: 'Chaque faille a une severite differente. Pas de RLS est la pire — contournement complet. USING (true) fuit les lectures. WITH CHECK manquant permet l\'usurpation sur les ecritures. La cle de service dans le client donne un acces admin a tous.',
    },

    // === METHODOLOGIE DE VERIFICATION ===
    {
      type: 'multiple-choice',
      question: 'Le code d\'auth de l\'agent s\'execute sans erreurs. Combien de chemins d\'acces devez-vous tester pour chaque ressource protegee ?',
      options: [
        'Un — si ca fonctionne pour un utilisateur authentifie, ca fonctionne',
        'Deux — tester authentifie et non authentifie',
        'Trois — tester non authentifie, bon role et mauvais role',
        'Quatre — tester non authentifie, mauvais role, bon role et inter-utilisateur (utilisateur A accedant aux donnees de B)',
      ],
      correctIndex: 3,
      explanation: 'L\'auth doit etre testee depuis chaque perspective : (1) non authentifie/pas de token, (2) mauvais role/authentifie mais pas admin, (3) bon role, et (4) inter-utilisateur/utilisateur A accedant aux donnees de B. L\'agent a teste un chemin (bon role). Vous testez les trois autres. Ne faites pas confiance au code qui s\'execute simplement sans erreurs.',
    },
    {
      type: 'terminal',
      instruction: 'Réinitialisez votre base de données Supabase locale pour appliquer les migrations fraîches et repartir d\'un état propre :',
      expectedCommand: 'supabase db reset',
      hint: 'La commande CLI Supabase qui supprime et recrée votre base de données locale',
    },
    {
      type: 'code-fill',
      instruction: 'Testez le RLS depuis le terminal en simulant differents niveaux d\'acces. Completez les commandes curl qui verifient la securite du point de vue d\'un attaquant.',
      language: 'bash',
      filename: 'test-rls.sh',
      template: "# Test as anonymous (no auth) — should return empty or error\ncurl 'http://localhost:54321/rest/v1/profiles' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer YOUR_ANON_KEY'\n\n# Test cross-user access — user A trying to UPDATE user B's row\ncurl -X {{http_method}} 'http://localhost:54321/rest/v1/profiles?id=eq.USER_B_ID' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer {{whose_token}}' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"display_name\": \"hacked\"}'",
      blanks: [
        { id: 'http_method', answer: 'PATCH', alternatives: ['PATCH', 'patch'], placeholder: 'quelle methode HTTP ?', hint: 'La methode HTTP pour les mises a jour partielles' },
        { id: 'whose_token', answer: 'USER_A_JWT', alternatives: ['USER_A_JWT', 'USER_A_TOKEN'], placeholder: 'le JWT de qui ?', hint: 'L\'attaquant (utilisateur A) essaie de modifier la ligne de l\'utilisateur B' },
      ],
      explanation: 'PATCH est utilise pour les mises a jour partielles. Le test inter-utilisateur utilise le token de USER_A pour tenter de modifier la ligne de USER_B. Si le RLS est correct, cette requete echouera silencieusement (0 lignes affectees) ou retournera une erreur.',
    },
    {
      type: 'multiple-choice',
      question: 'Vous testez un endpoint protégé en étant déconnecté et il retourne des données. Quelle est la cause la plus probable ?',
      options: [
        'Le token JWT a expiré',
        'Le RLS n\'est pas activé sur la table',
        'Le provider OAuth est mal configuré',
        'Le cookie de session est périmé',
      ],
      correctIndex: 1,
      explanation: 'Si une requête non authentifiée retourne des données d\'une table censée être protégée, le RLS est soit non activé soit a une politique trop permissive (comme USING (true)). C\'est la faille de sécurité la plus courante introduite par les agents.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Méthodologie de vérification maîtrisée !',
    },

    // === COMMON AGENT SECURITY HOLES ===
    {
      type: 'order',
      instruction: 'Classez les failles de securite generees par les agents de la PLUS dangereuse (premiere) a la moins (derniere) :',
      items: [
        'Cle service role utilisee dans le code cote client (contourne tout le RLS)',
        'Nouvelles tables creees sans RLS active',
        'WITH CHECK manquant sur les politiques INSERT/UPDATE',
        'URLs de redirection codees en dur qui cassent en production',
        'Politiques qui utilisent USING (true) — autorisant tout acces',
      ],
      correctOrder: [0, 1, 4, 2, 3],
    },
    {
      type: 'code-diff',
      title: 'Trouvez la faille de securite',
      body: 'L\'agent a genere le code « avant ». Le code « apres » montre la correction. Pouvez-vous identifier la vulnerabilite critique ?',
      language: 'typescript',
      filename: 'src/lib/admin.ts',
      before: "import { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(\n  import.meta.env.VITE_SUPABASE_URL,\n  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY\n)\n\nexport async function getUsers() {\n  const { data } = await supabase.from('profiles').select('*')\n  return data\n}",
      after: "import { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(\n  import.meta.env.VITE_SUPABASE_URL,\n  import.meta.env.VITE_SUPABASE_ANON_KEY\n)\n\nexport async function getUsers() {\n  const { data } = await supabase.from('profiles').select('*')\n  return data\n}",
      question: 'Qu\'est-ce qui rend VITE_SUPABASE_SERVICE_ROLE_KEY dangereuse dans le code cote client ?',
      highlightLines: [4],
      explanation: 'La cle service role contourne TOUTES les verifications RLS. Toute variable d\'environnement prefixee VITE_ est incluse dans le JavaScript du navigateur. N\'importe qui peut l\'extraire du bundle et acceder a chaque ligne de chaque table. La correction : utiliser VITE_SUPABASE_ANON_KEY qui respecte les politiques RLS.',
    },
    {
      type: 'multiple-choice',
      question: 'Qu\'est-ce qui rend la clé service role dangereuse dans le code côté client ?',
      options: [
        'Elle expire plus vite que la clé anon',
        'Elle contourne toutes les politiques Row-Level Security',
        'Elle ne fonctionne que dans les environnements côté serveur',
        'Elle ne peut pas effectuer d\'opérations de lecture',
      ],
      correctIndex: 1,
      explanation: 'La clé service role contourne TOUTES les vérifications RLS. Si elle est exposée dans le code côté client (toute variable d\'environnement préfixée VITE_ est incluse dans le bundle navigateur), n\'importe quel utilisateur peut l\'extraire du bundle JavaScript et accéder à chaque ligne de chaque table sans restriction.',
    },

    // === TARGETED FEEDBACK ===
    {
      type: 'compare',
      title: 'Feedback vague vs chirurgical',
      body: 'Quand vous trouvez une faille de securite, la facon dont vous le dites a l\'agent compte. Une approche mene a une erreur differente. L\'autre la corrige.',
      question: 'Quel feedback va corriger la faille de securite de facon fiable ?',
      correctSide: 'right',
      left: {
        label: 'Trop vague',
        content: '« Corrige l\'auth. »\n\nResultat : L\'agent fait une erreur\nDIFFERENTE. Peut-etre qu\'il retire\nUSING (true) mais le remplace par\nune autre politique trop permissive.\n\nFlou + securite = desastre.',
        language: 'text',
      },
      right: {
        label: 'Chirurgical',
        content: '« La politique SELECT de la table\nprofiles utilise USING (true) —\nremplacez par USING (auth.uid() = id).\nAjoutez une politique admin separee\nverifiant profiles.role = \'admin\'. »\n\nSpecifique. Actionnable. Testable.',
        language: 'text',
      },
      explanation: 'Le feedback chirurgical nomme la table, la politique, le probleme et la correction. L\'agent peut verifier la correction mecaniquement. Le feedback vague comme « corrige l\'auth » donne a l\'agent la possibilite de faire une erreur differente — dangereux quand la securite est en jeu.',
    },
    {
      type: 'code-input',
      instruction: 'Écrivez une instruction de politique RLS pour l\'agent : la table posts permet à n\'importe quel utilisateur de DELETE n\'importe quel post. Corrigez-la pour que seul le propriétaire puisse supprimer.',
      placeholder: 'CREATE POLICY ...',
      answer: 'CREATE POLICY "Owner deletes own posts" ON posts FOR DELETE USING (auth.uid() = user_id);',
      hint: 'Utilisez CREATE POLICY avec FOR DELETE et une clause USING qui vérifie que auth.uid() correspond à la colonne propriétaire',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Compétences de feedback chirurgical acquises !',
    },

    // === HANDS-ON VERIFICATION ===
    {
      type: 'terminal',
      instruction: 'Listez toutes les tables qui N\'ONT PAS le RLS activé (une commande d\'audit rapide) :',
      expectedCommand: "supabase db lint",
      hint: 'Supabase a une commande de linting intégrée qui vérifie les problèmes de sécurité y compris le RLS manquant',
    },
    {
      type: 'order',
      instruction: 'Ordonnez les étapes de vérification d\'auth du début à la fin :',
      items: [
        'Tester l\'accès inter-utilisateur (utilisateur A accédant aux données de B)',
        'Vérifier que le RLS est activé sur toutes les tables',
        'Tester en tant que non authentifié (devrait être refusé)',
        'Vérifier qu\'il n\'y a pas de clés de service dans le code client',
        'Tester avec le bon rôle (devrait réussir)',
      ],
      correctOrder: [3, 1, 2, 4, 0],
    },

    // === FINAL CHECKLIST ===
    {
      type: 'checklist',
      title: 'Liste de vérification de sécurité auth :',
      items: [
        'Le RLS est activé sur chaque table contenant des données utilisateur',
        'Aucune politique n\'utilise USING (true) sans vérification de rôle',
        'La clé service role n\'est jamais dans le code côté client (pas de préfixe VITE_/NEXT_PUBLIC_)',
        'Chaque politique INSERT/UPDATE a une clause WITH CHECK',
        'Les utilisateurs non authentifiés ne peuvent pas accéder aux endpoints protégés',
        'Les utilisateurs ne peuvent pas lire ou modifier les données d\'autres utilisateurs',
        'Les URLs de redirection OAuth utilisent des variables d\'environnement, pas des chaînes codées en dur',
        'La confirmation par email est requise avant que le compte soit actif',
      ],
    },
    {
      type: 'checkpoint',
      xp: 9,
      message: 'Auth & Vérification de Sécurité Dirigée par Agent terminée ! Aucune faille laissée derrière.',
    },
  ],
}

export default content
