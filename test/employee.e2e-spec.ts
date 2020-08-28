import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/database/repository';
import { Role } from '../src/database/enum';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListDTO,
  EmployeeListEntityDTO,
  EmployeeEntityDTO,
} from '../src/employee/dto';
import { AuthHelper, TestHelper, convertTo } from './helper';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let empRepo: EmployeeRepository;
  let auth: AuthHelper;
  let test: TestHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    empRepo = moduleRef.get<EmployeeRepository>(EmployeeRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test /employee (GET) specs', async () => {
    const [token, admin] = await auth.signUp({ role: Role.ADMIN });

    const endpoint = '/employee';

    await test.unauthorized('GET', endpoint);

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token })
      .expect(200);

    const expected = convertTo(EmployeeListDTO, {
      permission: { create: true },
      data: [admin],
    });

    expect(res.body).toEqual(expected);

    await test.forbidden(Role.STAFF, 'GET', endpoint);
  });

  it('test /employee (POST) specs', async () => {
    const [token] = await auth.signUp({ role: Role.ADMIN });

    const endpoint = '/employee';

    await test.forbidden(Role.STAFF, 'POST', endpoint);

    const createDTO: CreateEmployeeDTO = {
      username: 'John',
      password: 'Test1234',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.STAFF,
      email: 'test@test.com',
      profilePicture: 'pp1.jpg',
    };
    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send(createDTO)
      .set({ Authorization: token })
      .expect(201);

    const expected = convertTo(EmployeeListEntityDTO, {
      data: {
        id: res.body.data.id,
        ...createDTO,
      },
    });

    expect(res.body).toEqual(expected);

    const [employees, count] = await empRepo.findAndCount();
    expect(employees[count - 1]).toMatchObject(expected.data);
    expect(count).toBe(3);
  });

  it('test /employee/:employeeId (GET) specs', async () => {
    const [token, admin] = await auth.signUp({ role: Role.ADMIN });

    const res = await request(app.getHttpServer())
      .get('/employee/' + admin.id)
      .set({ Authorization: token })
      .expect(200);

    const expected = convertTo(EmployeeEntityDTO, {
      permission: { update: true, delete: true },
      data: admin,
    });

    expect(res.body).toEqual(expected);
  });

  it('test /employee/:id (PUT) specs', async () => {
    const [token] = await auth.signUp({ role: Role.ADMIN });
    const [, employee] = await auth.signUp({ role: Role.STAFF });

    const endpoint = '/employee/' + employee.id;

    await test.forbidden(Role.STAFF, 'PUT', endpoint);

    const updateDto: UpdateEmployeeDTO = {
      role: Role.MANAGER,
      username: 'Jane',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'update@test.com',
      profilePicture: 'pp2.jpg',
    };

    await test.notfound(token, 'PUT', endpoint + 'NF', updateDto);

    await request(app.getHttpServer())
      .put(endpoint)
      .send(updateDto)
      .set({ Authorization: token })
      .expect(200);

    const updatedEmployee = await empRepo.findOne(employee.id);
    expect(updatedEmployee).toMatchObject(updateDto);
  });

  it('test /employee/:id (DELETE) specs', async () => {
    const [token] = await auth.signUp({ role: Role.ADMIN });
    const [, employee] = await auth.signUp({ role: Role.STAFF });

    const endpoint = '/employee/' + employee.id;

    await test.forbidden(Role.STAFF, 'DELETE', endpoint);
    await test.notfound(token, 'DELETE', endpoint + 'NF');

    await request(app.getHttpServer())
      .delete(endpoint)
      .set({ Authorization: token })
      .expect(200);

    const deletedEmployee = await empRepo.findOne(employee.id);
    expect(deletedEmployee).toBeUndefined();
  });
});
