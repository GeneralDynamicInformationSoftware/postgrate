import fs from 'fs';

export default (): IConfig => {
  let config = {
    rootDirectory: 'db',
    migrationsDirectory: 'migrations',
    rollbacksDirectory: 'rollbacks',
    autoCreateRollbacks: true,
    migrationsTableName: 'migrations',
  };

  if (fs.existsSync('.postgraterc')) {
    const file = fs.readFileSync('.postgraterc', 'utf8');
    const parsed = JSON.parse(file);

    config = { ...config, ...parsed };
  }

  return config;
};

export interface IConfig {
  rootDirectory: string;
  migrationsDirectory: string;
  rollbacksDirectory: string;
  autoCreateRollbacks: boolean;
  migrationsTableName: string;
}
