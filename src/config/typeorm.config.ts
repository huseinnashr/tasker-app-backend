import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from 'ts-get-env';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: env.get('string', 'TYPEORM_TYPE') as any,
  host: env.get('string', 'DB_HOST'),
  port: env.get('number', 'DB_PORT'),
  username: env.get('string', 'DB_USERNAME'),
  password: env.get('string', 'DB_PASSWORD'),
  database: env.get('string', 'DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: env.get('boolean', 'TYPEORM_SYNCHRONIZE'),
};
