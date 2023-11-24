export default function (): void {
  console.log(`
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
`);
}
