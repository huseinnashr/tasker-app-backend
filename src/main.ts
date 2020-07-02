import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env from 'ts-get-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.get('number', 'PORT', 3000));
}
bootstrap();
