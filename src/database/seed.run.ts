import { DatabaseSeed } from './seed/database.seed';
import { ConnectionOptions, getConnectionManager } from 'typeorm';
import * as TypeOrmConfig from '../config/typeorm.config';

const seedRun = async () => {
  const connManager = getConnectionManager();
  const connection = connManager.create(TypeOrmConfig as ConnectionOptions);
  await connection.connect();

  const databaseSeeder = new DatabaseSeed();
  databaseSeeder.setConnection(connection);
  await databaseSeeder.run();
};

seedRun().then();
