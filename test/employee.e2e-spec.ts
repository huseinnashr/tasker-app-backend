import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from './helper';
import { Role } from '../src/employee/role.enum';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from '../src/employee/employee.dto';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let empRepo: EmployeeRepository;
  let jwtService: JwtService;
  let auth: AuthHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    empRepo = moduleRef.get<EmployeeRepository>(EmployeeRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
    app = moduleRef.createNestApplication();
    await app.init();

    auth = new AuthHelper(empRepo, jwtService, app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 401 Unauthorized when not logged in', async () =>
    auth.testUnauthorized('GET', '/employee'));

  describe('/employee (GET)', () => {
    it('returns list of employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      await request(app.getHttpServer())
        .get('/employee')
        .set({ Authorization: token })
        .expect(200);
    });

    it('returns 403 Forbidden when not admin', async () =>
      auth.signUpTestForbidden('GET', '/employee'));
  });

  describe('/employee (POST)', () => {
    it('create new employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      const createDTO: CreateEmployeeDTO = {
        username: 'John',
        password: 'Test1234',
        role: Role.STAFF,
      };
      await request(app.getHttpServer())
        .post('/employee')
        .send(createDTO)
        .set({ Authorization: token })
        .expect(201);

      const [employees, count] = await empRepo.findAndCount();
      expect(employees[count - 1].username).toBe(createDTO.username);
      expect(count).toBe(2);
    });

    it('returns 403 Forbidden when not admin', async () =>
      auth.signUpTestForbidden('POST', '/employee'));
  });

  describe('/employee/:id (PATCH)', () => {
    it('create new employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      const createDTO: CreateEmployeeDTO = {
        username: 'John',
        password: 'Test1234',
        role: Role.STAFF,
      };
      const employee = await empRepo.createAndSave(createDTO);
      const updateDto: UpdateEmployeeDTO = { ...createDTO, username: 'Jane' };
      await request(app.getHttpServer())
        .put('/employee/' + employee.id)
        .send(updateDto)
        .set({ Authorization: token })
        .expect(200);

      const updatedEmployee = await empRepo.findOne(employee.id);
      expect(updatedEmployee.username).toBe(updateDto.username);
    });

    it('return 404 NotFound when the employee does not exist', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      const updateDto: UpdateEmployeeDTO = {
        username: 'Jane',
        role: Role.STAFF,
        password: 'Test1234',
      };
      await request(app.getHttpServer())
        .put('/employee/999999')
        .send(updateDto)
        .set({ Authorization: token })
        .expect(404);
    });

    it('returns 403 Forbidden when not admin', async () =>
      auth.signUpTestForbidden('PUT', '/employee/999999'));
  });
});
