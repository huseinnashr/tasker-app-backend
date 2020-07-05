import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInDTO } from '../src/auth/auth.dto';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { CreateEmployeeDTO } from '../src/employee/employee.dto';
import { Role } from '../src/employee/role.enum';
import { AuthHelper } from './helper';

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
      const signInDto: SignInDTO = { username: 'test', password: 'Test1234' };
      const createEmployeeDto: CreateEmployeeDTO = {
        ...signInDto,
        role: Role.STAFF,
      };

      await empRepo.createAndSave(createEmployeeDto);
      const loginRes = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto)
        .expect(200);

      expect(loginRes.body.accessToken).toBeDefined();
      expect(loginRes.body.employee).toBeDefined();
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

      await empRepo.createAndSave(createEmployeeDto);
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ ...signInDto, password: 'Wrong1234' })
        .expect(401);
    });
  });

  describe('/auth/current (GET)', () => {
    it('returns current user', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      const currentRes = await request(app.getHttpServer())
        .get('/auth/current')
        .set({ Authorization: token })
        .expect(200);

      expect(currentRes.body.username).toBe(signUpDTO.username);
    });

    it('returns 401 when not logged in', async () => {
      await request(app.getHttpServer())
        .get('/auth/current')
        .expect(401);
    });
  });
});
