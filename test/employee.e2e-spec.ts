import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { JwtService } from '@nestjs/jwt';
import { signUp, signUpTestForbidden, testUnauthorized } from './helper';
import { Role } from '../src/employee/role.enum';
import { CreateEmployeeDTO } from '../src/employee/employee.dto';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let empRepo: EmployeeRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    empRepo = moduleRef.get<EmployeeRepository>(EmployeeRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 401 Unauthorized when not logged in', async () =>
    testUnauthorized(app, 'GET', '/employee'));

  describe('/employee (GET)', () => {
    it('returns list of employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [auth] = await signUp(empRepo, jwtService, signUpDTO);

      await request(app.getHttpServer())
        .get('/employee')
        .set({ Authorization: auth })
        .expect(200);
    });

    it('returns 403 Forbidden when not admin', async () =>
      signUpTestForbidden(empRepo, jwtService, app, 'GET', '/employee'));
  });

  describe('/employee (POST)', () => {
    it('create new employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [auth] = await signUp(empRepo, jwtService, signUpDTO);

      const createDTO: CreateEmployeeDTO = {
        username: 'John',
        password: 'Test1234',
        role: Role.STAFF,
      };
      await request(app.getHttpServer())
        .post('/employee')
        .send(createDTO)
        .set({ Authorization: auth })
        .expect(201);

      const [employees, count] = await empRepo.findAndCount();
      expect(employees[count - 1].username).toBe(createDTO.username);
      expect(count).toBe(2);
    });

    it('returns 403 Forbidden when not admin', async () =>
      signUpTestForbidden(empRepo, jwtService, app, 'POST', '/employee'));
  });
});
