import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Role } from '../src/database/enum';
import { AuthHelper, TestHelper, convertTo, RepoHelper } from './helper';
import { ManagerEntityDTO } from '../src/manager/dto';

describe('ManagerController (e2e)', () => {
  let app: INestApplication;
  let auth: AuthHelper;
  let test: TestHelper;
  let repo: RepoHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    repo = new RepoHelper(app, auth);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test /manager/:managerId (GET) specs', async () => {
    const [token, admin] = await auth.signUp({ role: Role.ADMIN });

    const endpoint = '/manager/' + admin.id;

    await test.unauthorized('GET', endpoint);

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token })
      .expect(200);

    const expected = convertTo(ManagerEntityDTO, {
      data: admin,
    });

    expect(res.body).toEqual(expected);
  });
});
