import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { AuthHelper } from './helper';
import { Role } from '../src/employee/role.enum';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
} from '../src/employee/employee.dto';

describe('EmployeeController (e2e)', () => {
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
      auth.testForbidden(Role.STAFF, 'GET', '/employee'));
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
      auth.testForbidden(Role.STAFF, 'POST', '/employee'));
  });

  describe('/employee/:id (PUT)', () => {
    it('updates the employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);
      const createDTO: CreateEmployeeDTO = {
        username: 'John',
        password: 'Test1234',
        role: Role.STAFF,
      };
      const employee = await empRepo.save(empRepo.create(createDTO));
      const updateDto: UpdateEmployeeDTO = {
        role: Role.MANAGER,
        username: 'Jane',
      };
      await request(app.getHttpServer())
        .put('/employee/' + employee.id)
        .send(updateDto)
        .set({ Authorization: token })
        .expect(200);

      const updatedEmployee = await empRepo.findOne(employee.id);
      expect(updatedEmployee).toMatchObject(updateDto);
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
      auth.testForbidden(Role.STAFF, 'PUT', '/employee/999999'));
  });

  describe('/employee/:id (DELETE)', () => {
    it('deletes the employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      const createDTO: CreateEmployeeDTO = {
        username: 'John',
        password: 'Test1234',
        role: Role.STAFF,
      };
      const employee = await empRepo.save(createDTO);
      await request(app.getHttpServer())
        .delete('/employee/' + employee.id)
        .set({ Authorization: token })
        .expect(200);

      const deletedEmployee = await empRepo.findOne(employee.id);
      expect(deletedEmployee).toBeUndefined();
    });

    it('return 404 NotFound when the employee does not exist', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      await request(app.getHttpServer())
        .delete('/employee/999999')
        .set({ Authorization: token })
        .expect(404);
    });

    it('returns 403 Forbidden when not admin', async () =>
      auth.testForbidden(Role.STAFF, 'DELETE', '/employee/999999'));
  });
});
