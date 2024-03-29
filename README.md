# Postgrate 🐘

Welcome to Postgrate! This documentation provides a guide to using Postgrate, a
simple, intuitive postgres migration tool for
[node-postgres](https://node-postgres.com/)!

SQL is awesome. There are a lot of great ORMs out there, but this package is for
those who prefer raw SQL!

`Postgrate` provides utility commands to generate raw `.sql` migration files and
corresponding rollback files. Migrations are executed transactionally. The goal
is to enable developers to more efficiently create and manage migrations written
in `.sql`.

## Installation

```bash
$ yarn add postgrate
```

## Basic Usage

After insallation, make sure that you have a `.env` file that looks like this:

```Bash
PG_DATABASE_URL=<your postgres connection url>
```

After installation, run the following command to initialize Postgrate in your
project directory and create necessary configuration files:

```bash
$ postgrate init
```

**\*Note:** in the current release of this package, this command is somewhat
trivial as running the first migration will perform initialization steps if they
haven't already been completed. Note that in all cases, you must run the `run`
command at least once before running the `rollback` command, otherwise you will
encounter an error. Running the `init` command will create a `.postgraterc` file
with the same defaults as though the `init` command were never run.\*

To create a migration, run:

```bash
$ postgrate make <your-migration-name>
```

In the root of your project directory, you should now see the following:

```bash
db
 |_migrations
    |_<timestamp>-<your-migration-name>.sql
 |_rollbacks
     |_rb-<timestamp>-<your-migration-name>.sql
```

After you write your migration in the `.sql` migration file, run:

```bash
$ postgrate run
```

You should see the following output:

```bash
     Migration <timestamp>-<your-migration-name>.sql [id: 1] has been executed 🚀
```

## Configuration

As of version `1.1.0`, **Postgrate** supports the use of a configuration file!
In the current release, a `.postgraterc` file in the root of your project
directory written in `JSON` is the supported format.

Here is an example configuration file with the package defaults:

```json
{
  "rootDirectory": "db",
  "migrationsDirectory": "migrations",
  "rollbackDirectory": "rollbacks",
  "autoCreateRollbacks": true,
  "migrationsTableName": "migrations"
}
```

Although detailed, option names have been chosen to facilitate intuitive
understanding of what each parameter does. That said, for completeness' sake,
here are some details about each config option:

## Configuration Options

- rootDirectory: Override the default directory name.
- migrationsDirectory: Override the default migrations directory name.
- rollbackDirectory: Override the default rollbacks directory name.
- autoCreateRollbacks: Set to true to automatically create rollback files.
- migrationsTableName: Name of the table created in your database.

#

### `rootDirectory`

The `rootDirectory` option allows you to override the default `db` directory
name that **Postgrate** creates at the root of your project.

**E.g.**

```json
"rootDirectory": "database" // then run `$ postgrate make <your-migration-name>`
```

Output:

```bash
database
 |_migrations
    |_<timestamp>-<your-migration-name>.sql
 |_rollbacks
     |_rb-<timestamp>-<your-migration-name>.sql
```

#

### `migrationsDirectory`

The `migrationsDirectory` option allows you to override the default `migrations`
directory name that **Postgrate** creates in the `db` (or specified as above)
directory.

**E.g.**

```json
"migrationsDirectory": "mg"
```

Output:

```bash
db
 |_mg
    |_<timestamp>-<your-migration-name>.sql
 |_rollbacks
     |_rb-<timestamp>-<your-migration-name>.sql
```

#

### `rollbacksDirectory`

The `rollbacksDirectory` option allows you to override the default `rollbacks`
directory name that **Postgrate** creates in the `db` (or specified as above)
directory.

**E.g.**

```json
"rollbacksDirectory": "rb"
```

Output:

```bash
db
 |_migrations
    |_<timestamp>-<your-migration-name>.sql
 |_rb
     |_rb-<timestamp>-<your-migration-name>.sql
```

#

### `autoCreateRollbacks`

The `autoCreateRollbacks` option can either be `true` or `false`. When set to
`false` a `rollbacks` directory will not be created, regardless of whether the
`rollbacksDirectory` option is set to a custom value.

Note that in this case, should you wish to create a rollback and use the
rollback command, rollback files will have to be created manually following the
formula shown in the above examples, repeated here for convenience:

```
rb_<migration-timestamp>-<migration-name>.sql
```

Essentially, you will need to do the following:

- create a `db/rollbacks` directory: name it `rollbacks` or whatever value you
  assigned to the `rollbacksDirectory` config parameter
- create a rollback file within the directory and name it `rb_` plus the name of
  the migration file you wish to rollback

#

### `migrationsTableName`

The `migrationsTableName` option allows you to set a cusom table name in which
to store migration records. Make sure that this name does not conflict with
other tables in your database. Once set, there is currently no way to update
this configuration option within a project.

## Commands

To view a list of commands, run:

```bash
$ postgrate help
```

You should get the following output:

```bash
📖 Postgrate CLI 📖
Usage: postgrate <command> [options]

Commands:
  -h,  help      Show help
  -i,  init      Initialize postgrate
  -l,  list      List all migrations
  -m,  make      Create a migration file
  -r,  run       Run all pending migrations
  -rb, rollback  Rollback a migration

Examples:
  $ postgrate -h
  $ postgrate -i
  $ postgrate -l
  $ postgrate -m create-users-table
  $ postgrate -r
  $ postgrate -rb 1
```
