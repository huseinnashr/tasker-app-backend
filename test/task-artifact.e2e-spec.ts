import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ArtifactRepository } from '../src/database/repository';
import { Role } from '../src/database/enum';
import { AuthHelper, TestHelper, RepoHelper } from './helper';
import { CreateArtifactDTO } from '../src/task-artifact/dto';

describe('ProjectTaskController (e2e)', () => {
  let app: INestApplication;
  let artifactRepo: ArtifactRepository;
  let auth: AuthHelper;
  let test: TestHelper;
  let repo: RepoHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    artifactRepo = moduleRef.get<ArtifactRepository>(ArtifactRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    repo = new RepoHelper(app, auth);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test /task/:taskId/artifact (POST) specs', async () => {
    const [mgtok, manager] = await auth.signUp({ role: Role.MANAGER });
    const [mgtok2] = await auth.signUp({ role: Role.MANAGER });
    const [, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);

    const endpoint = `/task/${task.id}/artifact`;

    const createDto: CreateArtifactDTO = {
      description: 'New Artifact',
    };

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send(createDto)
      .set({ Authorization: mgtok });

    // A.1. Return 201 Created on correct create an artifact request
    expect(res.status).toEqual(201);

    const expected = {
      id: res.body.id,
      description: createDto.description,
    };

    // A.2. Return the newly created artifact, and the update can be found in db
    expect(res.body).toEqual(expected);
    expect(await artifactRepo.findOne(res.body.id)).toMatchObject(expected);

    await test.forbidden(mgtok2, 'POST', endpoint, createDto);
  });
});
