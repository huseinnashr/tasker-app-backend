import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { FileRepository } from '../src/database/repository';
import { Role, MimeType } from '../src/database/enum';
import { AuthHelper, TestHelper, FileHelper, RepoHelper } from './helper';
import { FileEntityResponseDTO } from '../src/file/dto';

describe('FileController (e2e)', () => {
  let app: INestApplication;
  let fileRepo: FileRepository;
  let auth: AuthHelper;
  let test: TestHelper;
  let repo: RepoHelper;
  let file: FileHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    fileRepo = moduleRef.get(FileRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    repo = new RepoHelper(app, auth);
    file = new FileHelper();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test /file (POST, GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const testFile = {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
      filepath: './test/file/image.jpg',
    };
    const testFileStat = await file.stat(testFile.filepath);

    const res = await request(app.getHttpServer())
      .post(`/file`)
      .attach('file', testFile.filepath)
      .set({ Authorization: token });

    // A.1. Return 201 Created on correct create request as task staff
    expect(res.status).toEqual(201);

    const expected: FileEntityResponseDTO = {
      data: {
        id: res.body.data.id,
        mime: testFile.contentType as MimeType,
        filename: testFile.filename,
        owner: { id: staff.id, username: staff.username },
      },
    };

    // A.2. Return response contain expected file response payload;
    expect(res.body).toEqual(expected);

    // A.3. File entity is saved in the database
    const [files, count] = await fileRepo.findAndCount();
    expect(count).toEqual(1);
    expect(files[0]).toMatchObject(expected.data);

    const getRes = await request(app.getHttpServer())
      .get(`/file/${res.body.data.id}`)
      .set({ Authorization: token });

    // B. Return correct get file payload
    expect(getRes.status).toBe(200);
    expect(getRes.header['content-type']).toBe(testFile.contentType);
    expect(getRes.header['content-length']).toBe(testFileStat.size.toString());

    // C. returns 401 Unauthorized when not logged in
    await test.unauthorized('POST', `/file`);

    await file.emptyFolder('./upload', ['.gitignore']);
  });

  it('test /file permission control specs', async () => {
    const [token1, staff] = await auth.signUp({ role: Role.STAFF });
    const [token12, staff2] = await auth.signUp({ role: Role.STAFF });
    const [token13] = await auth.signUp({ role: Role.STAFF });
    const [token2, manager] = await auth.signUp({ role: Role.MANAGER });
    const [token22] = await auth.signUp({ role: Role.MANAGER });

    const filepath = './upload/test2.jpeg';
    const afile = await repo.createAFile(staff, await file.create(filepath));

    // OWner should be able to view
    await request(app.getHttpServer())
      .get(`/file/${afile.id}`)
      .set({ Authorization: token1 })
      .expect(200);

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);
    await repo.createATask(project, staff2);
    await repo.createAnUpdate(task, [afile]);

    // The Project Manager should be able to view the file
    await request(app.getHttpServer())
      .get(`/file/${afile.id}`)
      .set({ Authorization: token2 })
      .expect(200);

    // Other staffs in the project should be able to view the file
    await request(app.getHttpServer())
      .get(`/file/${afile.id}`)
      .set({ Authorization: token12 })
      .expect(200);

    // Stuffs on another project should NOT be able to view
    await request(app.getHttpServer())
      .get(`/file/${afile.id}`)
      .set({ Authorization: token13 })
      .expect(403);

    // Manager on another project should NOT be able to view
    await request(app.getHttpServer())
      .get(`/file/${afile.id}`)
      .set({ Authorization: token22 })
      .expect(403);

    file.emptyFolder('./upload', ['.gitignore']);
  });
});
