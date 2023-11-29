# Postgrate 🐘

A simple, intuitive postgres migration tool for
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

Once that's done, you can run the following command:

```bash
$ postgrate init
```

**\*Note:** in the current release of this package, this command is somewhat
trivial as running the first migration will perform initialization steps if they
haven't already been completed. Note that in all cases, you must run the `run`
command at least once before running the `rollback` command, otherwise you will
encounter an error. The `init` command has been included to accomodate future
plans to support a configuration file.\*

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

## Things to Note

This package will create a table in your database called `migrations`. While we
hope to make this configurable in the future, for now this package will confilct
with any concurrently used package that follows a similar strategy.

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
