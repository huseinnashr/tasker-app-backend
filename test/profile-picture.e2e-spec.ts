import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Role } from '../src/database/enum';

import { AuthHelper, TestHelper, FileHelper } from './helper';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let auth: AuthHelper;
  let test: TestHelper;
  let file: FileHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    file = new FileHelper();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test /profile-picture (POST, GET)', async () => {
    const [token] = await auth.signUp({ role: Role.ADMIN });

    const endpoint = '/profile-picture';

    await test.unauthorized('POST', endpoint);

    const filepath = './test/file/image.jpg';
    const testFile = {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
      filepath,
      stat: await file.stat(filepath),
    };

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .attach('profilePicture', testFile.filepath)
      .set({ Authorization: token });
    expect(res.status).toEqual(201);
    expect(res.body.data.url).toBeDefined();

    await file.emptyFolder('./upload/profile-picture', file.DEFAULT_PP);
  });
});
