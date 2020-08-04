import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInDTO, CurrentUserEntityResponseDTO } from '../src/auth/dto';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/database/repository';
import { CreateEmployeeDTO } from '../src/employee/dto';
import { Role } from '../src/database/enum';
import { AuthHelper } from './helper';
import { CurrentUserResponseDTO } from '../src/auth/dto/current-user-response.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let empRepo: EmployeeRepository;
  let auth: AuthHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    empRepo = moduleRef.get<EmployeeRepository>(EmployeeRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/signin (POST)', () => {
    it('returns employee and access token', async () => {
      const password = 'Secret1234@';
      const [, admin] = await auth.signUp({ password, role: Role.ADMIN });

      const signInDto: SignInDTO = {
        username: admin.username,
        password,
      };

      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(200);

      const expected: CurrentUserResponseDTO = {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      };

      const { accessToken, ...employee } = res.body.data;
      expect(accessToken).toBeDefined();
      expect(employee).toEqual(expected);
    });

    it('returns 401 Unauthorized when account was not found / wrong password', async () => {
      const signInDto: SignInDTO = { username: 'test', password: 'Test1234' };

      await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(401);

      const createEmployeeDto: CreateEmployeeDTO = {
        ...signInDto,
        role: Role.STAFF,
      };

      await empRepo.save(empRepo.create(createEmployeeDto));
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ ...signInDto, password: 'Wrong1234' })
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

      const expected: CurrentUserEntityResponseDTO = {
        data: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
        },
      };

      expect(res.body).toEqual(expected);
    });

    it('returns 401 when not logged in', async () => {
      await request(app.getHttpServer())
        .get('/auth/current')
        .expect(401);
    });
  });
});
