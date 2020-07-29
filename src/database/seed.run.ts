import { DatabaseSeed } from './seed/database.seed';
import { ConnectionOptions, getConnectionManager } from 'typeorm';
import * as TypeOrmConfig from '../config/typeorm.config';

const seedRun = async () => {
  console.debug('Creating a DB connection...');
  const connManager = getConnectionManager();
  const connection = connManager.create(TypeOrmConfig as ConnectionOptions);
  await connection.connect();

  console.debug('Running the DB seeders...');
  const databaseSeeder = new DatabaseSeed();
  databaseSeeder.setConnection(connection);
  await databaseSeeder.run();

  console.debug('Seeding DONE!');
};

seedRun().then();