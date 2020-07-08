import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { TestHelper } from './helper/test.helper';
import { Role } from '../src/employee/role.enum';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from '../src/employee/dto';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let empRepo: EmployeeRepository;
  let test: TestHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    empRepo = moduleRef.get<EmployeeRepository>(EmployeeRepository);
    app = moduleRef.createNestApplication();
    test = new TestHelper(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 401 Unauthorized when not logged in', async () =>
    test.unauthorized('GET', '/employee'));

  describe('/employee (GET)', () => {
    it('returns list of employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await test.signUp(signUpDTO);

      await request(app.getHttpServer())
        .get('/employee')
        .set({ Authorization: token })
        .expect(200);
    });

    it('returns 403 Forbidden when not admin', async () =>
      test.forbidden(Role.STAFF, 'GET', '/employee'));
  });

  describe('/employee (POST)', () => {
    it('create new employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await test.signUp(signUpDTO);

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
      test.forbidden(Role.STAFF, 'POST', '/employee'));
  });

  describe('/employee/:id (PUT)', () => {
    it('updates the employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await test.signUp(signUpDTO);
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

    it('return 404 NotFound when the employee does not exist', async () =>
      test.notfound(Role.ADMIN, 'PUT', '/employee/99999', {
        username: 'Jane',
        role: Role.STAFF,
        password: 'Test1234',
      }));

    it('returns 403 Forbidden when not admin', async () =>
      test.forbidden(Role.STAFF, 'PUT', '/employee/999999'));
  });

  describe('/employee/:id (DELETE)', () => {
    it('deletes the employee', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await test.signUp(signUpDTO);

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

    it('return 404 NotFound when the employee does not exist', async () =>
      test.notfound(Role.ADMIN, 'DELETE', '/employee/99999'));

    it('returns 403 Forbidden when not admin', async () =>
      test.forbidden(Role.STAFF, 'DELETE', '/employee/999999'));
  });
});
