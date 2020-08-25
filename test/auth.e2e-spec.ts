import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DoSignInDTO, CurrentUserEntityDTO } from '../src/auth/dto';
import { AppModule } from '../src/app.module';
import { Role } from '../src/database/enum';
import { AuthHelper, convertTo } from './helper';
import { CurrentUserDTO } from '../src/auth/dto/response/current-user.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let auth: AuthHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/signin (POST)', () => {
    it('returns employee and access token', async () => {
      const password = 'password';
      const [, admin] = await auth.signUp({ role: Role.ADMIN, password });

      const signInDto: DoSignInDTO = {
        username: admin.username,
        password: password,
      };

      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(200);

      const expected = convertTo(CurrentUserDTO, admin);

      const { accessToken, ...employee } = res.body.data;
      expect(accessToken).toBeDefined();
      expect(employee).toEqual(expected);
    });

    it('returns 401 Unauthorized when account was not found / wrong password', async () => {
      const unknownEmployeeDTO: DoSignInDTO = {
        username: 'test',
        password: 'Test1234',
      };

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(unknownEmployeeDTO)
        .expect(401);

      const password = 'password';
      const [, admin] = await auth.signUp({ role: Role.STAFF, password });

      const wrongPasswordDTO: DoSignInDTO = {
        username: admin.username,
        password: 'wrong_password',
      };

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(wrongPasswordDTO)
        .expect(401);
    });
  });

  describe('/auth/current (GET)', () => {
    it('returns current user', async () => {
      const [token, admin] = await auth.signUp({ role: Role.ADMIN });

      const res = await request(app.getHttpServer())
        .get('/auth/current')
        .set({ Authorization: token })
        .expect(200);

      const expected = convertTo(CurrentUserEntityDTO, {
        data: admin,
      });

      expect(res.body).toEqual(expected);
    });

    it('returns 401 when not logged in', async () => {
      await request(app.getHttpServer())
        .get('/auth/current')
        .expect(401);
    });
  });
});
