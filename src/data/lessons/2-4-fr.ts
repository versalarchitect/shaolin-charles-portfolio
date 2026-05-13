import type { LessonContent } from './types'

const content: LessonContent = {
  lessonId: '2-4',
  steps: [
    // === INTRODUCTION ===
    {
      type: 'info',
      title: 'Les agents sont rapides en SQL et mauvais en modélisation de données',
      body: "Claude Code va générer un CREATE TABLE en quelques secondes. Il va normaliser, dénormaliser, ajouter des index et créer des migrations. Mais la modélisation de données est une affaire de jugement — est-ce un one-to-many ou un many-to-many ? Est-ce que ça devrait être une table séparée ou une colonne enum ? Est-ce qu'on fait un cascade delete ou un set null ? Les agents optimisent pour « ça marche maintenant » pas « ça marchera dans 6 mois ». Votre travail est de détecter les décisions structurelles qui vont vous hanter plus tard.",
    },
    {
      type: 'info',
      title: 'Pourquoi c\'est plus important que la qualité du code',
      body: "Vous pouvez refactorer du mauvais code à bon marché. Vous ne pouvez pas refactorer un mauvais schéma à bon marché. Une fois qu'une table est en production avec des données, changer sa structure signifie écrire des migrations, remplir rétroactivement les données, gérer les cas limites et coordonner les déploiements. Une table de jonction manquante découverte 3 mois plus tard signifie réécrire les requêtes dans tout votre codebase. Attrapez-le maintenant, lors de la révision de migration, avant que des données n'existent.",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Les décisions de schéma sont des décisions permanentes.',
    },

    // === SPECCING A DATABASE ===
    {
      type: 'multiple-choice',
      question: 'Quel element est LE PLUS important a inclure dans une spec de base de donnees pour un agent IA ?',
      options: [
        'Le theme de couleurs pour le panneau d\'admin de la base de donnees',
        'Les types de relations explicites (one-to-many, many-to-many) et les contraintes (NOT NULL, UNIQUE, FK)',
        'Le dialecte SQL exact que la base de donnees utilisera',
        'Une liste de tous les endpoints API qui interrogeront la base de donnees',
      ],
      correctIndex: 1,
      explanation: 'Une bonne spec de BD couvre : les entites, les relations (one-to-many, many-to-many), les contraintes (NOT NULL, UNIQUE, CHECK, cles etrangeres), les index, les enums et les champs d\'audit. Plus vous etes explicite sur les relations et contraintes, moins l\'agent fait de suppositions. Sans elles, l\'agent va deviner — et deviner faux.',
    },
    {
      type: 'code-fill',
      instruction: 'Completez cette spec de base de donnees en remplissant les types de relations et contraintes :',
      language: 'markdown',
      filename: 'database-spec.md',
      template: '## Database Spec: Project Management App\n\n### Relationships\n- users <-> workspaces: {{user_workspace_rel}} (junction: workspace_members)\n- workspace -> projects: {{workspace_project_rel}}\n- project -> tasks: one-to-many\n\n### Constraints\n- workspace_members: {{unique_constraint}}(user_id, workspace_id)\n- tasks.status: {{check_type}} (status IN (\'todo\',\'in_progress\',\'done\'))\n- tasks.title: NOT NULL, max 200 chars',
      blanks: [
        { id: 'user_workspace_rel', answer: 'many-to-many', alternatives: ['M:N', 'm2m'], placeholder: 'type de relation ?', hint: 'Les utilisateurs appartiennent a plusieurs workspaces, les workspaces ont plusieurs utilisateurs' },
        { id: 'workspace_project_rel', answer: 'one-to-many', alternatives: ['1:N', '1:many', 'one to many'], placeholder: 'type de relation ?', hint: 'Un projet appartient a exactement un workspace' },
        { id: 'unique_constraint', answer: 'UNIQUE', alternatives: ['unique'], placeholder: 'contrainte ?', hint: 'Un utilisateur ne peut etre membre d\'un workspace qu\'une seule fois' },
        { id: 'check_type', answer: 'CHECK', alternatives: ['check'], placeholder: 'type de contrainte ?', hint: 'Restreint les valeurs de colonne a un ensemble specifique' },
      ],
      explanation: 'Les types de relations explicites disent a l\'agent s\'il faut creer des tables de jonction (many-to-many) ou de simples cles etrangeres (one-to-many). UNIQUE empeche les doublons, CHECK restreint les valeurs aux options valides. Sans ceux-ci, l\'agent devine.',
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Structure de spec claire !',
    },

    // === DIRECTING SCHEMA GENERATION ===
    {
      type: 'multiple-choice',
      question: 'Quelle est la meilleure approche pour demander a un agent de generer des migrations de base de donnees ?',
      options: [
        'Demander le schema entier dans un seul fichier de migration',
        'Decouper en groupes logiques (utilisateurs d\'abord, puis projets, puis commentaires) pour que les FK referencent des tables existantes',
        'Laisser l\'agent decider de l\'ordre — il sait mieux',
        'Generer toutes les tables sans FK, puis ajouter les FK dans une migration separee',
      ],
      correctIndex: 1,
      explanation: 'Decoupez les migrations en groupes logiques. Les migrations suivantes referencent les tables precedentes via les cles etrangeres, donc l\'ordre compte. Des migrations plus petites sont aussi plus faciles a reviser — auditer un fichier de 50 lignes est beaucoup plus facile qu\'un de 200 lignes. Ce sequencage previent les erreurs de reference FK et vous donne des points de controle.',
    },
    {
      type: 'terminal',
      instruction: 'Créez un nouveau fichier de migration Supabase pour les tables utilisateurs et espaces de travail :',
      expectedCommand: 'supabase migration new add_users_and_workspaces',
      hint: 'Utilisez supabase migration new suivi d\'un nom descriptif en snake_case',
    },
    {
      type: 'code-fill',
      instruction: 'Completez cette migration pour creer une table de jonction workspace_members correctement contrainte :',
      language: 'sql',
      filename: 'supabase/migrations/001_add_workspaces.sql',
      template: "-- Table de jonction : membres de workspace\nCREATE TABLE workspace_members (\n  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE {{ws_cascade}},\n  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,\n  role workspace_role NOT NULL DEFAULT '{{default_role}}',\n  joined_at TIMESTAMPTZ NOT NULL DEFAULT {{default_time}},\n  PRIMARY KEY (workspace_id, {{pk_col}})\n);\n\n-- Index pour la requete 'mes workspaces'\nCREATE INDEX idx_workspace_members_user ON workspace_members({{index_col}});",
      blanks: [
        { id: 'ws_cascade', answer: 'CASCADE', alternatives: ['cascade'], placeholder: 'comportement de suppression ?', hint: 'Quand le workspace est supprime, supprimer ses membres' },
        { id: 'default_role', answer: 'member', placeholder: 'role par defaut ?', hint: 'Les nouveaux utilisateurs rejoignent avec le role le plus bas' },
        { id: 'default_time', answer: 'now()', alternatives: ['NOW()'], placeholder: 'valeur par defaut ?', hint: 'Fonction Postgres pour le timestamp actuel' },
        { id: 'pk_col', answer: 'user_id', placeholder: 'deuxieme colonne PK ?', hint: 'La PK composite empeche les adhesions en double' },
        { id: 'index_col', answer: 'user_id', placeholder: 'quelle colonne ?', hint: 'Necessaire pour la requete "mes workspaces"' },
      ],
      explanation: 'Une table de jonction necessite : CASCADE sur les deux FK (l\'adhesion n\'a pas de sens sans les deux enregistrements parents), une PRIMARY KEY composite pour empecher les doublons, un role par defaut raisonnable, et un index sur user_id pour le pattern de requete "afficher mes workspaces".',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Génération de schéma dirigée !',
    },

    // === REVIEWING MIGRATIONS ===
    {
      type: 'multiple-choice',
      question: 'Quelle est l\'erreur LA PLUS courante des agents dans les migrations generees ?',
      options: [
        'Utiliser le mauvais dialecte SQL',
        'Laisser les colonnes nullable par defaut quand elles devraient etre NOT NULL, et oublier les index sur les colonnes FK',
        'Creer trop de tables a la fois',
        'Utiliser des noms de colonnes incorrects',
      ],
      correctIndex: 1,
      explanation: 'Les agents de maniere recurrente : (1) laissent les colonnes nullable quand elles devraient etre NOT NULL, (2) oublient les index sur les colonnes FK (Postgres N\'indexe PAS automatiquement les FK), (3) utilisent CASCADE par defaut quand SET NULL ou RESTRICT serait plus sur, (4) oublient les triggers updated_at, (5) utilisent VARCHAR(255) au lieu de TEXT avec CHECK, (6) oublient les contraintes UNIQUE sur les cles naturelles. Revisez toujours pour ces patterns.',
    },
    {
      type: 'code-fill',
      instruction: 'L\'agent a genere une table tasks cassee. Remplissez les contraintes manquantes pour la corriger :',
      language: 'sql',
      filename: 'supabase/migrations/002_add_tasks.sql',
      template: "CREATE TABLE tasks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  title TEXT {{title_constraint}},\n  description TEXT,\n  status TEXT NOT NULL {{status_check}},\n  project_id UUID NOT NULL REFERENCES {{fk_table}}(id),\n  assigned_to UUID REFERENCES profiles(id),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  {{update_col}} TIMESTAMPTZ NOT NULL DEFAULT now()\n);",
      blanks: [
        { id: 'title_constraint', answer: 'NOT NULL', alternatives: ['not null'], placeholder: 'contrainte ?', hint: 'Chaque tache doit avoir un titre' },
        { id: 'status_check', answer: "CHECK (status IN ('todo','in_progress','done'))", alternatives: ["check (status in ('todo','in_progress','done'))"], placeholder: 'validation ?', hint: 'Restreindre le statut aux valeurs valides uniquement' },
        { id: 'fk_table', answer: 'projects', placeholder: 'table parent ?', hint: 'Les taches appartiennent a quelle entite ?' },
        { id: 'update_col', answer: 'updated_at', alternatives: ['updatedAt'], placeholder: 'colonne manquante ?', hint: 'Suivre quand la ligne a ete modifiee pour la derniere fois' },
      ],
      explanation: 'Chaque colonne obligatoire necessite NOT NULL. Les colonnes de statut necessitent des contraintes CHECK pour empecher les valeurs invalides. Les colonnes FK necessitent des REFERENCES appropriees. Et chaque table a besoin d\'une colonne updated_at avec un trigger pour suivre les modifications.',
    },
    {
      type: 'multiple-choice',
      question: 'Pourquoi un index manquant sur une colonne de clé étrangère est-il un problème sérieux ?',
      options: [
        'Ça empêche la contrainte FK d\'être appliquée',
        'Ça oblige les requêtes JOIN et les suppressions en cascade à scanner la table entière',
        'Postgres va rejeter la migration sans index',
        'Ça cause de la corruption de données sur les écritures concurrentes',
      ],
      correctIndex: 1,
      explanation: 'Sans index sur la colonne FK, chaque JOIN, chaque clause WHERE filtrant par cette FK, et chaque suppression en cascade doit faire un scan séquentiel de la table entière. Sur une table de 100K+ lignes, ça transforme des requêtes en millisecondes en secondes.',
    },

    // === COMMON DATA MODELING MISTAKES ===
    {
      type: 'compare',
      title: 'Modelisation denormalisee vs normalisee',
      body: 'Les agents denormalisent souvent la ou la normalisation est necessaire. Repérez la difference structurelle.',
      question: 'Quelle approche gere correctement les tags pour une plateforme de blog ?',
      correctSide: 'right',
      left: {
        label: 'Defaut de l\'agent (denormalise)',
        content: "CREATE TABLE posts (\n  id UUID PRIMARY KEY,\n  title TEXT NOT NULL,\n  tags TEXT[],  -- Tableau de chaines\n  -- Problemes :\n  -- Pas d'integrite referentielle\n  -- Impossible de stocker des metadonnees de tag\n  -- Interroger 'tous les posts avec tag X'\n  --   necessite de scanner chaque ligne\n  -- Pas de liste canonique de tags\n);",
        language: 'sql',
      },
      right: {
        label: 'Correctement normalise',
        content: "CREATE TABLE tags (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL UNIQUE,\n  color TEXT,\n  created_by UUID REFERENCES profiles(id)\n);\nCREATE TABLE post_tags (\n  post_id UUID REFERENCES posts(id)\n    ON DELETE CASCADE,\n  tag_id UUID REFERENCES tags(id)\n    ON DELETE CASCADE,\n  PRIMARY KEY (post_id, tag_id)\n);",
        language: 'sql',
      },
      explanation: 'Les colonnes array ne peuvent pas garantir que les valeurs de tags existent dans une liste canonique (pas de FK). Vous ne pouvez pas stocker de metadonnees sur un tag (couleur, description, created_by). Interroger "tous les posts avec le tag X" necessite de scanner chaque ligne. Une table tags + table de jonction post_tags resout tous ces problemes. Les agents preferent les arrays parce qu\'ils semblent plus simples.',
    },
    {
      type: 'multiple-choice',
      question: 'Un agent stocke les tags comme colonne TEXT[] array dans la table posts. Pourquoi cela pourrait-il être une erreur ?',
      options: [
        'Postgres ne supporte pas les colonnes array',
        'Vous ne pouvez pas interroger les intersections d\'arrays efficacement, et vous perdez l\'intégrité référentielle et les métadonnées de tag',
        'Les arrays sont plus lents à lire que les colonnes TEXT',
        'Ça utilise trop d\'espace disque',
      ],
      correctIndex: 1,
      explanation: 'Les colonnes array ne peuvent pas garantir que les valeurs de tags existent dans une liste canonique (pas de FK). Vous ne pouvez pas stocker de métadonnées sur un tag (couleur, description, created_by). Interroger « tous les posts avec le tag X » nécessite de scanner chaque ligne. Une table tags + table de jonction post_tags résout tous ces problèmes.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Instincts de révision de schéma aiguisés !',
    },

    // === EXERCICES INTERACTIFS BASE DE DONNEES ===
    {
      type: 'compare',
      title: 'Migration generee par agent : reperer les problemes',
      body: 'Les agents generent du SQL techniquement valide qui manque souvent de garde-fous structurels.',
      question: 'Quelle migration est plus sure a executer en production ?',
      correctSide: 'right',
      left: {
        label: 'Garde-fous manquants',
        content: 'CREATE TABLE tasks (\n  id SERIAL PRIMARY KEY,\n  title TEXT,\n  project_id INTEGER,\n  status TEXT,\n  assigned_to TEXT\n);\n\n-- Pas de contraintes NOT NULL\n-- Pas de FK vers la table projects\n-- Pas d\'index sur project_id\n-- status est du texte libre, pas un enum',
        language: 'sql',
      },
      right: {
        label: 'Pret pour la production',
        content: 'CREATE TABLE tasks (\n  id SERIAL PRIMARY KEY,\n  title TEXT NOT NULL,\n  project_id INTEGER NOT NULL\n    REFERENCES projects(id) ON DELETE CASCADE,\n  status TEXT NOT NULL\n    CHECK (status IN (\'todo\',\'doing\',\'done\')),\n  assigned_to UUID REFERENCES auth.users(id)\n);\nCREATE INDEX idx_tasks_project\n  ON tasks(project_id);',
        language: 'sql',
      },
      explanation: 'La version production ajoute : NOT NULL pour empecher les donnees vides, contrainte FK pour l\'integrite referentielle, contrainte CHECK pour les statuts valides, type UUID correct pour les references utilisateur, et un index pour la performance des requetes.',
    },
    {
      type: 'code-fill',
      instruction: 'Corrigez cette migration en ajoutant les contraintes manquantes :',
      language: 'sql',
      filename: 'supabase/migrations/002_fix_tasks.sql',
      template: 'ALTER TABLE tasks\n  ALTER COLUMN title SET {{not_null}},\n  ADD CONSTRAINT fk_project\n    FOREIGN KEY (project_id) REFERENCES {{ref_table}}(id)\n    ON DELETE {{cascade_action}};',
      blanks: [
        { id: 'not_null', answer: 'NOT NULL', alternatives: ['not null'], placeholder: 'contrainte ?', hint: 'Empecher les valeurs vides' },
        { id: 'ref_table', answer: 'projects', placeholder: 'quelle table ?', hint: 'La table parent des taches' },
        { id: 'cascade_action', answer: 'CASCADE', alternatives: ['cascade'], placeholder: 'comportement de suppression ?', hint: 'Quand le projet est supprime, supprimer ses taches aussi' },
      ],
      explanation: 'NOT NULL empeche les donnees vides. FOREIGN KEY garantit que chaque tache appartient a un vrai projet. ON DELETE CASCADE supprime automatiquement les taches orphelines quand un projet est supprime.',
    },
    {
      type: 'match',
      instruction: 'Associez chaque comportement ON DELETE a la bonne relation :',
      leftItems: ['CASCADE', 'SET NULL', 'RESTRICT'],
      rightItems: ['L\'enfant n\'a pas de sens sans le parent (tache sans projet)', 'L\'enfant peut exister independamment (commentaire sans auteur)', 'La suppression devrait etre bloquee si des enfants existent (utilisateur avec commandes actives)'],
      correctPairs: { 0: 0, 1: 1, 2: 2 },
      explanation: 'CASCADE supprime les enfants automatiquement. SET NULL garde les enfants mais supprime le lien. RESTRICT empeche la suppression entierement. Choisissez en fonction de la relation reelle entre les donnees.',
    },

    // === WORKFLOW DIAGRAM ===
    {
      type: 'interactive-diagram',
      title: 'Raffinement Iteratif du Schema',
      body: 'Votre flux de travail est une boucle de revision. Vous n\'acceptez jamais le premier jet — vous revisez, corrigez et verifiez avant de migrer.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Votre Spec', sublabel: 'Entites + Regles', shape: 'rounded' },
          { id: 'generate', label: 'L\'Agent Genere', sublabel: 'Migration SQL', shape: 'rect' },
          { id: 'review', label: 'Vous Revisez', sublabel: 'Verif. Contraintes', shape: 'diamond', highlight: true },
          { id: 'fix', label: 'Corriger', sublabel: 'Diriger l\'Agent', shape: 'rect' },
          { id: 'migrate', label: 'Migrer', sublabel: 'supabase db push', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'generate', label: 'prompt' },
          { from: 'generate', to: 'review', label: 'resultat' },
          { from: 'review', to: 'fix', label: 'problemes trouves' },
          { from: 'fix', to: 'generate', label: 'iterer', dashed: true },
          { from: 'review', to: 'migrate', label: 'approuve' },
        ],
      },
      stages: [
        {
          highlightNodes: ['spec', 'generate'],
          highlightEdges: [{ from: 'spec', to: 'generate' }],
          explanation: 'Vous commencez par ecrire une spec detaillee — entites, relations, contraintes, index. L\'agent l\'utilise pour generer un fichier de migration SQL.',
        },
        {
          highlightNodes: ['generate', 'review'],
          highlightEdges: [{ from: 'generate', to: 'review' }],
          explanation: 'L\'agent produit du SQL. Vous le revisez contre votre checklist : NOT NULL sur les champs requis, index sur les FK, comportement CASCADE correct, contraintes CHECK sur les enums.',
        },
        {
          highlightNodes: ['review', 'fix'],
          highlightEdges: [{ from: 'review', to: 'fix' }],
          explanation: 'Des problemes trouves ? Donnez des corrections chirurgicales : "Ajoute NOT NULL a tasks.title. Ajoute un index sur project_id." Des corrections specifiques, pas des reecritures completes.',
        },
        {
          highlightNodes: ['fix', 'generate'],
          highlightEdges: [{ from: 'fix', to: 'generate' }],
          explanation: 'L\'agent regenere seulement les parties que vous avez signalees. Cette boucle se repete jusqu\'a ce que la migration passe votre revision. La plupart des schemas necessitent 2-3 iterations.',
        },
        {
          highlightNodes: ['review', 'migrate'],
          highlightEdges: [{ from: 'review', to: 'migrate' }],
          explanation: 'Une fois que la migration passe la revision, appliquez-la avec supabase db push. Le schema est maintenant verrouille — le changer plus tard necessite une nouvelle migration et un backfill de donnees.',
        },
      ],
    },

    // === ITERATIVE REFINEMENT ===
    {
      type: 'multiple-choice',
      question: 'Vous trouvez 3 problemes dans une migration generee par un agent. Quelle est la meilleure approche de correction ?',
      options: [
        'Demander a l\'agent de regenerer la migration entiere depuis zero',
        'Lister les corrections exactes : "Ajoute NOT NULL a tasks.title, ajoute CHECK sur status, ajoute index sur project_id"',
        'Ecrire la migration corrigee vous-meme sans l\'agent',
        'L\'accepter tel quel et corriger les problemes plus tard quand ils causeront des soucis',
      ],
      correctIndex: 1,
      explanation: 'Les corrections chirurgicales preservent ce que l\'agent a bien fait et ne corrigent que ce qu\'il a rate. Regenerer depuis zero gaspille du contexte et peut introduire de nouveaux problemes. Dire a l\'agent exactement quoi corriger — colonne par colonne, contrainte par contrainte — produit le resultat le plus rapide et fiable.',
    },
    {
      type: 'code-input',
      instruction: 'Écrivez le SQL pour ajouter un index manquant sur la colonne tasks.project_id :',
      placeholder: 'CREATE INDEX ...',
      answer: 'CREATE INDEX idx_tasks_project_id ON tasks(project_id);',
      hint: 'Utilisez CREATE INDEX avec un nom descriptif, ON la table, avec la colonne entre parenthèses',
    },

    // === MIGRATION WORKFLOW ===
    {
      type: 'terminal',
      instruction: 'Poussez vos migrations vers la base de données Supabase locale pour les tester :',
      expectedCommand: 'supabase db push',
      hint: 'La commande CLI Supabase qui applique les migrations en attente à votre base de données liée',
    },
    {
      type: 'code-fill',
      instruction: 'Choisissez le bon comportement ON DELETE pour chaque relation de cle etrangere :',
      language: 'sql',
      filename: 'cascade-examples.sql',
      template: "-- Les donnees enfant n'ont pas de sens sans le parent\nCREATE TABLE posts (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL REFERENCES profiles(id)\n    ON DELETE {{posts_cascade}}\n);\n\n-- L'enfant peut exister independamment\nCREATE TABLE projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  workspace_id UUID REFERENCES workspaces(id)\n    ON DELETE {{projects_cascade}}\n);\n\n-- La suppression devrait etre bloquee si des enfants existent\nCREATE TABLE tasks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  project_id UUID NOT NULL REFERENCES projects(id)\n    ON DELETE {{tasks_cascade}}\n);",
      blanks: [
        { id: 'posts_cascade', answer: 'CASCADE', alternatives: ['cascade'], placeholder: 'comportement ?', hint: 'Les posts n\'ont pas de sens sans leur auteur' },
        { id: 'projects_cascade', answer: 'SET NULL', alternatives: ['set null', 'SET null'], placeholder: 'comportement ?', hint: 'Garder les projets vivants mais effacer le lien workspace' },
        { id: 'tasks_cascade', answer: 'RESTRICT', alternatives: ['restrict'], placeholder: 'comportement ?', hint: 'Empecher la suppression d\'un projet qui a encore des taches' },
      ],
      explanation: 'CASCADE supprime les enfants automatiquement (les posts sans auteur sont inutiles). SET NULL garde les enfants mais supprime le lien (les projets peuvent exister sans workspace). RESTRICT empeche la suppression entierement (impossible de supprimer un projet avec des taches actives). Choisissez deliberement — l\'agent mettra CASCADE par defaut pour tout.',
    },
    {
      type: 'multiple-choice',
      question: 'Un utilisateur supprime son compte. Ses commentaires référencent les posts d\'autres utilisateurs. Quel comportement CASCADE est approprié pour la FK comment.user_id ?',
      options: [
        'CASCADE — supprimer tous ses commentaires',
        'SET NULL — garder les commentaires mais retirer la référence auteur',
        'RESTRICT — empêcher la suppression du compte s\'il a des commentaires',
        'Pas de FK — juste laisser des enregistrements orphelins',
      ],
      correctIndex: 1,
      explanation: 'SET NULL est généralement le meilleur choix pour les commentaires. Le contenu du commentaire reste précieux dans son contexte (les autres utilisateurs peuvent voir le fil de discussion). Vous perdez l\'attribution de l\'auteur mais préservez la discussion. CASCADE supprimerait du contenu sur lequel d\'autres comptent. RESTRICT piégerait les utilisateurs dans le système.',
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Flux de révision de migration maîtrisé !',
    },

    // === ORDER EXERCISE ===
    {
      type: 'order',
      instruction: 'Ordonnez les étapes d\'une révision de migration du début à la fin :',
      items: [
        'Vérifier le comportement CASCADE sur toutes les FK',
        'Vérifier que toutes les colonnes ont le NULL/NOT NULL approprié',
        'Exécuter supabase db push pour tester',
        'Confirmer que les index existent sur les colonnes FK et les patterns de requête',
        'Lire le fichier de migration complet du début à la fin',
        'Vérifier les enums/contraintes CHECK sur les colonnes de status',
      ],
      correctOrder: [4, 1, 5, 3, 0, 2],
    },

    // === FINAL CHECKLIST ===
    {
      type: 'checklist',
      title: 'Liste de vérification de révision de migration :',
      items: [
        'Chaque colonne obligatoire est NOT NULL avec un DEFAULT là où approprié',
        'Chaque colonne FK a un index',
        'CASCADE/SET NULL/RESTRICT est choisi délibérément, pas par défaut',
        'Les colonnes status/type utilisent des contraintes CHECK ou enums, pas du TEXT non vérifié',
        'Les relations many-to-many utilisent des tables de jonction, pas des arrays',
        'Toutes les tables ont created_at et updated_at avec trigger',
        'UUIDs utilisés pour les clés primaires (pas SERIAL) dans les systèmes multi-tenant',
        'Contraintes UNIQUE sur les clés naturelles (email, slug, etc.)',
        'La migration s\'exécute proprement sur supabase db reset',
      ],
    },
    {
      type: 'checkpoint',
      xp: 7,
      message: 'Diriger la Conception de BD & Vérifier les Migrations terminé ! Vos schémas résisteront à l\'épreuve du temps.',
    },
  ],
}

export default content
