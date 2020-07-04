import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { JwtService } from '@nestjs/jwt';
import { signUp } from './helper';
import { Role } from '../src/employee/role.enum';

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

  it('/employee (GET)', async () => {
    const [auth] = await signUp(empRepo, jwtService, {
      username: 'test',
      role: Role.ADMIN,
    });

    await request(app.getHttpServer())
      .get('/employee')
      .set({ Authorization: auth })
      .expect(200);
  });
});
