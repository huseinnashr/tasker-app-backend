import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInDTO } from '../src/auth/auth.dto';
import { AppModule } from '../src/app.module';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { Employee } from '../src/employee/employee.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let empRepo: EmployeeRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    empRepo = moduleRef.get<EmployeeRepository>(EmployeeRepository);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/signin (POST)', async () => {
    const signInDto: SignInDTO = { username: 'test', password: 'Test1234' };

    const employee = new Employee();
    employee.username = signInDto.username;
    await employee.setPassword(signInDto.password);
    await empRepo.save(employee);

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send(signInDto)
      .expect(200);
  });

  it('another', async () => {
    const res = await empRepo.findAndCount();
    console.log(res);
  });
});
