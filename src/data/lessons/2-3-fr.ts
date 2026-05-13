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
      type: 'info',
      title: 'Spécifier un système d\'auth pour l\'agent',
      body: "Avant de dire à l'agent de construire l'auth, vous avez besoin d'une spec. Une bonne spec d'auth inclut : les providers supportés (email/mot de passe, OAuth avec Google/GitHub), les rôles utilisateur (anonyme, authentifié, admin), les routes protégées (quelles pages nécessitent un login), la gestion de session (durée du JWT, stratégie de rafraîchissement), et le contrat RLS (qui peut lire/écrire quelles tables). Plus votre spec est précise, moins l'agent laissera de trous.",
    },
    {
      type: 'code-demo',
      title: 'Exemple de prompt de spec d\'auth',
      body: 'Donnez à l\'agent une spec structurée comme celle-ci. Remarquez la mention explicite des exigences RLS par table — c\'est ce qui empêche l\'agent de sauter les politiques.',
      language: 'markdown',
      filename: 'auth-spec.md',
      code: "## Auth Requirements\n\n### Providers\n- Email/password with confirmation\n- OAuth: Google, GitHub\n\n### Roles\n- anonymous: can read public content\n- authenticated: can CRUD own data\n- admin: full access (checked via profiles.role)\n\n### Protected Routes\n- /dashboard/* → authenticated\n- /admin/* → admin role\n- /api/private/* → authenticated\n\n### RLS Contract\n- profiles: users read own, admins read all\n- posts: anyone reads published, owner CRUDs own\n- comments: authenticated creates, owner deletes\n\n### Session\n- JWT expiry: 1 hour\n- Refresh token: 7 days\n- Redirect after login: /dashboard",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Structure de spec d\'auth comprise !',
    },

    // === DIRECTING SUPABASE AUTH SETUP ===
    {
      type: 'info',
      title: 'Diriger l\'agent à travers l\'auth Supabase',
      body: "Avec votre spec en main, vous dirigez l'agent étape par étape. Premièrement : initialiser Supabase localement. Deuxièmement : configurer l'auth par email avec confirmation activée. Troisièmement : configurer les providers OAuth. Quatrièmement : créer la table profiles liée à auth.users. Cinquièmement : écrire les politiques RLS pour chaque table. La clé c'est le séquençage — si vous envoyez tout d'un coup, l'agent va sauter des étapes ou prendre des décisions contradictoires.",
    },
    {
      type: 'terminal',
      instruction: 'Initialisez un nouveau projet Supabase dans le répertoire courant :',
      expectedCommand: 'supabase init',
      hint: 'La commande du CLI Supabase pour scaffolder la config du projet local',
    },
    {
      type: 'code-demo',
      title: 'Configuration du client auth Supabase',
      body: 'L\'agent devrait générer quelque chose comme ceci pour l\'auth côté client. Vérifiez qu\'il utilise la clé ANON (pas la clé service role) et que les URLs de redirection sont correctes.',
      language: 'typescript',
      filename: 'src/lib/supabase.ts',
      code: "import { createClient } from '@supabase/supabase-js'\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL\nconst supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY\n\nexport const supabase = createClient(supabaseUrl, supabaseAnonKey, {\n  auth: {\n    autoRefreshToken: true,\n    persistSession: true,\n    detectSessionInUrl: true,\n  },\n})",
    },
    {
      type: 'code-demo',
      title: 'Fonctions de connexion OAuth',
      body: 'L\'agent génère des helpers OAuth. Vérifiez que le redirectTo correspond à votre app et que les scopes sont minimaux.',
      language: 'typescript',
      filename: 'src/lib/auth.ts',
      code: "import { supabase } from './supabase'\n\nexport async function signInWithGitHub() {\n  return supabase.auth.signInWithOAuth({\n    provider: 'github',\n    options: {\n      redirectTo: `${window.location.origin}/auth/callback`,\n      scopes: 'read:user user:email',\n    },\n  })\n}\n\nexport async function signInWithGoogle() {\n  return supabase.auth.signInWithOAuth({\n    provider: 'google',\n    options: {\n      redirectTo: `${window.location.origin}/auth/callback`,\n      queryParams: { access_type: 'offline', prompt: 'consent' },\n    },\n  })\n}\n\nexport async function signInWithEmail(email: string, password: string) {\n  return supabase.auth.signInWithPassword({ email, password })\n}",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Configuration auth dirigée avec succès !',
    },

    // === ROW-LEVEL SECURITY ===
    {
      type: 'info',
      title: 'Row-Level Security : la couche critique',
      body: "Le RLS est l'autorisation native de Postgres. Quand activé sur une table, chaque requête doit passer une vérification de politique — même si le code applicatif ne filtre pas. C'est de la défense en profondeur : même si votre API a un bug, le RLS empêche les accès non autorisés au niveau de la base de données. Le problème : les agents activent le RLS mais écrivent des politiques trop permissives, ou ils créent de nouvelles tables et oublient d'activer le RLS. Une table sans RLS est grande ouverte à quiconque a la clé anon.",
    },
    {
      type: 'code-demo',
      title: 'Politiques RLS correctes',
      body: 'Voici à quoi ressemble un RLS correct pour une table profiles. L\'agent devrait générer quelque chose d\'équivalent. Surveillez : auth.uid() utilisé correctement, des politiques SELECT/INSERT/UPDATE séparées, pas de USING (true) global.',
      language: 'sql',
      filename: 'supabase/migrations/002_rls_profiles.sql',
      code: "-- Enable RLS\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\n\n-- Users can read their own profile\nCREATE POLICY \"Users read own profile\"\n  ON profiles FOR SELECT\n  USING (auth.uid() = id);\n\n-- Admins can read all profiles\nCREATE POLICY \"Admins read all profiles\"\n  ON profiles FOR SELECT\n  USING (\n    EXISTS (\n      SELECT 1 FROM profiles\n      WHERE id = auth.uid() AND role = 'admin'\n    )\n  );\n\n-- Users can update their own profile\nCREATE POLICY \"Users update own profile\"\n  ON profiles FOR UPDATE\n  USING (auth.uid() = id)\n  WITH CHECK (auth.uid() = id);\n\n-- Only the trigger creates profiles (no direct INSERT for users)\nCREATE POLICY \"Service role inserts profiles\"\n  ON profiles FOR INSERT\n  WITH CHECK (auth.uid() = id);",
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
      type: 'diagram',
      title: 'Flux d\'Auth : du Login à l\'Accès aux Données',
      body: 'Chaque requête authentifiée passe par ce flux. La vérification RLS se fait au niveau de la base de données, pas dans votre code applicatif.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'login', label: 'Login', sublabel: 'Email/OAuth', shape: 'rounded' },
          { id: 'session', label: 'Session', sublabel: 'Token JWT', shape: 'rect' },
          { id: 'request', label: 'Requête API', sublabel: 'Bearer Token', shape: 'rect' },
          { id: 'rls', label: 'Vérif. RLS', sublabel: 'Éval. politique', shape: 'diamond', highlight: true },
          { id: 'data', label: 'Accès Données', sublabel: 'Lignes retournées', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'login', to: 'session', label: 'succès' },
          { from: 'session', to: 'request', label: 'attacher JWT' },
          { from: 'request', to: 'rls', label: 'requête' },
          { from: 'rls', to: 'data', label: 'pass' },
        ],
      },
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
      type: 'info',
      title: 'Méthodologie de vérification : tester chaque chemin',
      body: "Ne faites pas confiance au code de l'agent juste parce qu'il s'exécute sans erreurs. L'auth doit être testée depuis chaque perspective : non authentifié (pas de token), mauvais rôle (authentifié mais pas admin), bon rôle, et inter-utilisateur (utilisateur A accédant aux données de l'utilisateur B). Pour chaque ressource protégée, vous devez vérifier les quatre chemins. L'agent en a testé un. Vous testez les trois autres.",
    },
    {
      type: 'terminal',
      instruction: 'Réinitialisez votre base de données Supabase locale pour appliquer les migrations fraîches et repartir d\'un état propre :',
      expectedCommand: 'supabase db reset',
      hint: 'La commande CLI Supabase qui supprime et recrée votre base de données locale',
    },
    {
      type: 'code-demo',
      title: 'Tester le RLS depuis le terminal',
      body: 'Utilisez le CLI Supabase pour tester les requêtes avec différents rôles. Ça simule ce qu\'un attaquant verrait.',
      language: 'bash',
      filename: 'test-rls.sh',
      code: "# Test as anonymous (no auth) — should return empty or error\ncurl 'http://localhost:54321/rest/v1/profiles' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer YOUR_ANON_KEY'\n\n# Test as authenticated user — should see only own data\ncurl 'http://localhost:54321/rest/v1/profiles' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer USER_JWT_TOKEN'\n\n# Test cross-user access — user A trying to UPDATE user B's row\ncurl -X PATCH 'http://localhost:54321/rest/v1/profiles?id=eq.USER_B_ID' \\\n  -H 'apikey: YOUR_ANON_KEY' \\\n  -H 'Authorization: Bearer USER_A_JWT' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"display_name\": \"hacked\"}'",
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
      type: 'info',
      title: 'Failles de sécurité courantes des agents',
      body: "Après avoir révisé des centaines d'implémentations auth générées par des agents, voici les défaillances les plus fréquentes : (1) Nouvelles tables créées sans RLS activé. (2) Politiques qui utilisent USING (true) — autorisant tout accès. (3) Clé service role utilisée dans le code côté client (contourne tout le RLS). (4) WITH CHECK manquant sur les politiques INSERT/UPDATE. (5) Pas de séparation des politiques entre rôles — une politique fait tout. (6) URLs de redirection codées en dur qui cassent en production. (7) Exigence de confirmation par email manquante — comptes créés sans vérification.",
    },
    {
      type: 'code-demo',
      title: 'Trouvez la faille de sécurité',
      body: 'L\'agent a généré ce code. Pouvez-vous repérer la vulnérabilité critique ?',
      language: 'typescript',
      filename: 'src/lib/admin.ts',
      code: "import { createClient } from '@supabase/supabase-js'\n\n// DANGER: Agent used service role key in client code!\nconst supabase = createClient(\n  import.meta.env.VITE_SUPABASE_URL,\n  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY // <-- THIS BYPASSES ALL RLS\n)\n\nexport async function getUsers() {\n  const { data } = await supabase.from('profiles').select('*')\n  return data\n}",
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
      type: 'info',
      title: 'Feedback ciblé : dire à l\'agent ce qui ne va pas',
      body: "Quand vous trouvez une faille, ne dites pas « corrige l'auth ». C'est trop vague et l'agent fera une erreur différente. Soyez chirurgical : « La table profiles a le RLS activé mais la politique SELECT utilise USING (true) ce qui permet à tout utilisateur authentifié de lire tous les profils. Remplacez-la par USING (auth.uid() = id) pour que les utilisateurs ne puissent lire que leur propre profil. Les admins devraient avoir une politique séparée vérifiant profiles.role = 'admin'. » Spécifique, actionnable, testable.",
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
