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

After insallation, you can run the following command:

```bash
$ postgrate init
```

**\*Note:** in the current release of this package, this command is somewhat
trivial as other core commands will perform initialization steps if they haven't
been completed. The exception is the `rollback` command which will throw an
error if another initializing command has not been previously run. This command
has been included to accomodate future plans to support a configuration file.\*

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
```

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
