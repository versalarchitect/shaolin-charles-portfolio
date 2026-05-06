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
      type: 'info',
      title: 'Quoi inclure dans une spec de base de données',
      body: "Une bonne spec de base de données pour l'agent couvre : les entités (quels sont les noms dans votre système), les relations (comment les entités se connectent — one-to-many, many-to-many), les contraintes (NOT NULL, UNIQUE, CHECK, clés étrangères), les index (quelles colonnes seront requêtées/filtrées/jointes), les enums (ensembles fixes de valeurs comme status ou role), et les champs d'audit (created_at, updated_at, deleted_at si soft-deletes). Plus vous êtes explicite, moins l'agent fait de suppositions.",
    },
    {
      type: 'code-demo',
      title: 'Exemple de prompt de spec de base de données',
      body: 'Structurez votre spec comme ceci avant de diriger l\'agent. Remarquez les types de relations et contraintes explicites.',
      language: 'markdown',
      filename: 'database-spec.md',
      code: "## Database Spec: Project Management App\n\n### Entities\n- users (from auth.users, extended with profiles)\n- workspaces (multi-tenant, users belong to many)\n- projects (belong to one workspace)\n- tasks (belong to one project, assigned to one user)\n- comments (belong to one task, authored by one user)\n\n### Relationships\n- users <-> workspaces: many-to-many (junction: workspace_members)\n- workspace -> projects: one-to-many\n- project -> tasks: one-to-many\n- task -> comments: one-to-many\n- user -> tasks: one-to-many (assignee)\n\n### Constraints\n- workspace_members: UNIQUE(user_id, workspace_id)\n- tasks.status: CHECK (status IN ('todo','in_progress','done'))\n- tasks.title: NOT NULL, max 200 chars\n- projects.slug: UNIQUE per workspace\n\n### Indexes\n- tasks: (project_id, status) for filtered lists\n- comments: (task_id, created_at) for chronological loading\n- workspace_members: (user_id) for \"my workspaces\" query\n\n### Audit\n- All tables: created_at DEFAULT now(), updated_at via trigger",
    },
    {
      type: 'checkpoint',
      xp: 2,
      message: 'Structure de spec claire !',
    },

    // === DIRECTING SCHEMA GENERATION ===
    {
      type: 'info',
      title: 'Diriger l\'agent pour générer le schéma',
      body: "Donnez la spec à l'agent et demandez-lui de générer un fichier de migration. Ne demandez pas « toute la base de données » d'un coup — divisez en groupes logiques. D'abord : utilisateurs et espaces de travail. Ensuite : projets et tâches. Troisièmement : commentaires et activité. Ce séquençage compte parce que les migrations ultérieures référencent les tables précédentes via les clés étrangères. Ça facilite aussi la révision — des migrations plus petites sont plus faciles à auditer qu'un seul fichier de 200 lignes.",
    },
    {
      type: 'terminal',
      instruction: 'Créez un nouveau fichier de migration Supabase pour les tables utilisateurs et espaces de travail :',
      expectedCommand: 'supabase migration new add_users_and_workspaces',
      hint: 'Utilisez supabase migration new suivi d\'un nom descriptif en snake_case',
    },
    {
      type: 'code-demo',
      title: 'Résultat de migration bien structuré',
      body: 'Voici à quoi ressemble une migration correctement contrainte. Comparez ce que l\'agent génère par rapport à ce standard.',
      language: 'sql',
      filename: 'supabase/migrations/001_add_users_and_workspaces.sql',
      code: "-- Create enum for workspace roles\nCREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');\n\n-- Profiles table (extends auth.users)\nCREATE TABLE profiles (\n  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,\n  display_name TEXT NOT NULL,\n  avatar_url TEXT,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\n-- Workspaces\nCREATE TABLE workspaces (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  slug TEXT NOT NULL UNIQUE,\n  created_by UUID NOT NULL REFERENCES profiles(id),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\n-- Junction table: workspace members\nCREATE TABLE workspace_members (\n  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,\n  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,\n  role workspace_role NOT NULL DEFAULT 'member',\n  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),\n  PRIMARY KEY (workspace_id, user_id)\n);\n\n-- Indexes\nCREATE INDEX idx_workspace_members_user ON workspace_members(user_id);\nCREATE INDEX idx_workspaces_slug ON workspaces(slug);\n\n-- Updated_at trigger function\nCREATE OR REPLACE FUNCTION update_updated_at()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = now();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER profiles_updated_at\n  BEFORE UPDATE ON profiles\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at();\n\nCREATE TRIGGER workspaces_updated_at\n  BEFORE UPDATE ON workspaces\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at();",
    },
    {
      type: 'checkpoint',
      xp: 3,
      message: 'Génération de schéma dirigée !',
    },

    // === REVIEWING MIGRATIONS ===
    {
      type: 'info',
      title: 'Réviser les migrations : ce que les agents ratent',
      body: "Voici votre checklist de révision pour chaque migration générée par un agent : (1) NOT NULL manquant — les agents laissent les colonnes nullable par défaut quand elles devraient être obligatoires. (2) Index manquants sur les colonnes de clé étrangère — Postgres N'indexe PAS automatiquement les FK, et les index manquants détruisent la performance des jointures. (3) Mauvais comportement CASCADE — CASCADE sur delete signifie que supprimer un utilisateur supprime toutes ses données. Parfois vous voulez SET NULL ou RESTRICT à la place. (4) Pas de trigger updated_at. (5) VARCHAR(255) partout au lieu de TEXT avec contraintes CHECK. (6) Contraintes UNIQUE manquantes sur les clés naturelles (email, slug, etc.).",
    },
    {
      type: 'code-demo',
      title: 'Repérez les problèmes dans ce résultat d\'agent',
      body: 'L\'agent a généré cette migration. Comptez les problèmes avant de lire l\'explication ci-dessous.',
      language: 'sql',
      filename: 'supabase/migrations/002_add_tasks.sql',
      code: "-- Agent-generated (has problems!)\nCREATE TABLE tasks (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(255),          -- Problem 1: should be NOT NULL\n  description TEXT,\n  status TEXT,                  -- Problem 2: no CHECK constraint\n  project_id INTEGER,           -- Problem 3: no FK, no NOT NULL\n  assigned_to UUID,             -- Problem 4: no FK reference\n  created_at TIMESTAMP          -- Problem 5: no DEFAULT, no NOT NULL\n);                              -- Problem 6: no index on project_id\n                                -- Problem 7: no updated_at column",
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
      type: 'info',
      title: 'Erreurs de modélisation de données courantes des agents',
      body: "Au-delà des problèmes de contraintes, les agents font des erreurs de modélisation structurelle : (1) Dénormalisation là où la normalisation est nécessaire — stocker les tags comme chaîne séparée par des virgules au lieu d'une table de jonction. (2) Tables de jonction manquantes pour le many-to-many — utiliser des tableaux d'IDs au lieu de jointures relationnelles appropriées. (3) Utiliser VARCHAR(255) partout — une habitude MySQL sans bénéfice dans Postgres (utilisez TEXT avec CHECK). (4) Pas de timestamps d'audit — created_at/updated_at manquants sur chaque table. (5) IDs entiers au lieu d'UUIDs — rend les systèmes multi-tenant et la fusion de données pénibles.",
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

    // === WORKFLOW DIAGRAM ===
    {
      type: 'diagram',
      title: 'Raffinement Itératif du Schéma',
      body: 'Votre flux de travail est une boucle de révision. Vous n\'acceptez jamais le premier jet — vous révisez, corrigez et vérifiez avant de migrer.',
      diagram: {
        direction: 'LR',
        nodes: [
          { id: 'spec', label: 'Votre Spec', sublabel: 'Entités + Règles', shape: 'rounded' },
          { id: 'generate', label: 'L\'Agent Génère', sublabel: 'Migration SQL', shape: 'rect' },
          { id: 'review', label: 'Vous Révisez', sublabel: 'Vérif. Contraintes', shape: 'diamond', highlight: true },
          { id: 'fix', label: 'Corriger', sublabel: 'Diriger l\'Agent', shape: 'rect' },
          { id: 'migrate', label: 'Migrer', sublabel: 'supabase db push', shape: 'pill', highlight: true },
        ],
        edges: [
          { from: 'spec', to: 'generate', label: 'prompt' },
          { from: 'generate', to: 'review', label: 'résultat' },
          { from: 'review', to: 'fix', label: 'problèmes trouvés' },
          { from: 'fix', to: 'generate', label: 'itérer', dashed: true },
          { from: 'review', to: 'migrate', label: 'approuvé' },
        ],
      },
    },

    // === ITERATIVE REFINEMENT ===
    {
      type: 'info',
      title: 'Raffinement itératif sans repartir de zéro',
      body: "Quand vous trouvez des problèmes dans une migration, ne demandez pas à l'agent de régénérer depuis le début. Ça gaspille du contexte et peut introduire de nouveaux problèmes. Au lieu de ça, dites-lui exactement quoi corriger : « Ajoute NOT NULL à tasks.title et tasks.project_id. Ajoute une contrainte CHECK sur status. Ajoute un index sur project_id. Ajoute les références FK vers projects(id) et profiles(id). Ajoute created_at et updated_at avec les valeurs par défaut. » Des corrections chirurgicales, pas des réécritures.",
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
      type: 'code-demo',
      title: 'Clé étrangère avec cascade appropriée',
      body: 'Choisissez le comportement CASCADE délibérément. Cet exemple montre les trois options et quand utiliser chacune.',
      language: 'sql',
      filename: 'cascade-examples.sql',
      code: "-- CASCADE: Delete user → delete all their posts\n-- Use when: child data is meaningless without parent\nCREATE TABLE posts (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE\n);\n\n-- SET NULL: Delete workspace → keep projects, clear workspace_id\n-- Use when: child can exist independently\nCREATE TABLE projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL\n);\n\n-- RESTRICT: Cannot delete a project that still has tasks\n-- Use when: deletion should be blocked if children exist\nCREATE TABLE tasks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT\n);",
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
