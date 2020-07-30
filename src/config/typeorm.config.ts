import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from 'ts-get-env';

const TypeOrmConfig: TypeOrmModuleOptions = {
  type: env.get('string', 'TYPEORM_TYPE') as any,
  host: env.get('string', 'DB_HOST'),
  port: env.get('number', 'DB_PORT'),
  username: env.get('string', 'DB_USERNAME'),
  password: env.get('string', 'DB_PASSWORD'),
  database: env.get('string', 'DB_NAME'),
  entities: [__dirname + '/../database/entity/*.entity{.ts,.js}'],
  subscribers: [__dirname + '/../database/subscriber/*.subscriber{.ts,.js}'],
  synchronize: env.get('boolean', 'TYPEORM_SYNCHRONIZE', false),
};

export = TypeOrmConfig;
