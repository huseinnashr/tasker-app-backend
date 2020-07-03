import { JwtModuleOptions } from '@nestjs/jwt';
import env from 'ts-get-env';

export const JwtConfig: JwtModuleOptions = {
  secret: env.get('string', 'JWT_SECRET'),
  signOptions: {
    expiresIn: env.get('number', 'JWT_EXPIRES_IN'),
  },
};
