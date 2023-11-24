export default function (): void {
  console.log(`
📖 Postgrate CLI 📖
Usage: postgrate <command> [options]

Commands:
  -i, init      Initialize postgrate
  -m, make      Create a migration file
  -r, run       Run all pending migrations
  -rb, rollback Rollback a migration
  -h, help      Show help

Examples:
  postgrate -i
  postgrate -m create_users_table
  postgrate -r
  postgrate -rb 1
  postgrate -h
`);
}
