import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UpdateRepository } from '../src/database/repository';
import { Role, UpdateType } from '../src/database/enum';
import { AuthHelper, TestHelper, RepoHelper } from './helper';
import {
  CreateUpdateDTO,
  UpdateUpdateDTO,
  TaskUpdateListDTO,
  TaskUpdateListEntityDTO,
  TaskUpdateEntityDTO,
} from '../src/task-update/dto';

describe('ProjectTaskController (e2e)', () => {
  let app: INestApplication;
  let updateRepo: UpdateRepository;
  let auth: AuthHelper;
  let test: TestHelper;
  let repo: RepoHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    updateRepo = moduleRef.get<UpdateRepository>(UpdateRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    repo = new RepoHelper(app, auth);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test project/:projectId/task/:taskId/update (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update`;

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get updates request
    expect(res.status).toEqual(200);

    const expected: TaskUpdateListDTO = {
      permission: { create: true },
      data: [
        {
          id: update.id,
          title: update.title,
          body: update.body,
          type: update.type,
          files: [],
        },
      ],
    };

    // A.2. Return correct list of all updates in a task
    expect(res.body).toEqual(expected);

    // B. Return 404 Not Found when task was not found
    const endpoint404 = `/project/${task.project.id}/task/99999/update`;
    await test.notfound(Role.STAFF, 'GET', endpoint404);

    // C. Return 401 Unauthorized when not logged in
    await test.unauthorized('GET', endpoint);
  });

  it('test project/:projectId/task/:taskId/update (POST) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const file = await repo.createAFile(staff);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update`;

    const createDto: CreateUpdateDTO = {
      title: 'New Update',
      body: 'update body',
      type: UpdateType.PROGRESS,
      files: [file.id],
    };

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send(createDto)
      .set({ Authorization: token });

    // A.1. Return 201 Created on correct create an update request
    expect(res.status).toEqual(201);

    const expected: TaskUpdateListEntityDTO = {
      data: {
        id: res.body.data.id,
        title: createDto.title,
        body: createDto.body,
        type: createDto.type,
        files: [{ id: file.id, filename: file.filename, mime: file.mime }],
      },
    };

    // A.2. Return the newly created update, and the update can be found in db
    expect(res.body).toEqual(expected);
    expect(await updateRepo.findOne(res.body.data.id)).toMatchObject(
      expected.data,
    );

    // B. Return 404 Not Found when task was not found
    const endpoint404 = `/project/${task.project.id}/task/99999/update`;
    await test.notfound(Role.STAFF, 'POST', endpoint404, createDto);

    // C. returns 401 Unauthorized when not logged in
    await test.unauthorized('POST', endpoint);
  });

  it('test project/:projectId/task/:taskId/update/:updateId (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update/${update.id}`;

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get an update request
    expect(res.status).toEqual(200);

    const expected: TaskUpdateEntityDTO = {
      permission: { update: true, delete: true },
      data: {
        id: update.id,
        title: update.title,
        body: update.body,
        type: update.type,
        files: [],
      },
    };

    // A.2. Returns the correct update with given id.
    expect(res.body).toEqual(expected);

    // B. Returns 404 when update with given id was not found
    const endpoint404 = `/project/${task.project.id}/task/${task.id}/update/99999`;
    await test.notfound(token, 'GET', endpoint404);

    // C. returns 401 Unauthorized when not logged in
    await test.unauthorized('GET', endpoint);
  });

  it('test project/:projectId/task/:taskId/update/:updateId (PUT) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);
    const file = await repo.createAFile(staff);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update/${update.id}`;

    const updateDto: UpdateUpdateDTO = {
      title: 'Updated update',
      body: 'updated update body',
      type: UpdateType.PROGRESS,
      files: [file.id],
    };

    const res = await request(app.getHttpServer())
      .put(endpoint)
      .send(updateDto)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct update an update request
    expect(res.status).toEqual(200);

    const expected: TaskUpdateListEntityDTO = {
      data: {
        id: res.body.data.id,
        title: updateDto.title,
        body: updateDto.body,
        type: updateDto.type,
        files: [{ id: file.id, filename: file.filename, mime: file.mime }],
      },
    };

    // A.2. Return the updated update, and the updates reflected in db
    expect(res.body).toEqual(expected);
    expect(await updateRepo.findOne(update.id)).toMatchObject(expected.data);

    const [token2] = await auth.signUp({ role: Role.STAFF });
    const forbiddenRes = await request(app.getHttpServer())
      .put(endpoint)
      .send(updateDto)
      .set({ Authorization: token2 });

    // B. Return 403 Forbidden when the authorized employee is not the task staff
    expect(forbiddenRes.status).toEqual(403);

    // C. Return 404 Not Found when update was not found
    const endpoint404 = `/project/${task.project.id}/task/${task.id}/update/9999`;
    await test.notfound(token, 'PUT', endpoint404, updateDto);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized('PUT', endpoint);
  });

  it('test project/:projectId/task/:taskId/update/:updateId (DELETE) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });
    const [sttok2] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update/${update.id}`;

    // B. Return 403 Forbidden when the authorized employee is not the task staff
    await test.forbidden(sttok2, 'DELETE', endpoint);

    const res = await request(app.getHttpServer())
      .delete(endpoint)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct delete an update request
    expect(res.status).toEqual(200);

    // C. Return 404 Not Found when update was not found
    const endpoint404 = `/project/${task.project.id}/task/${task.id}/update/9999`;
    await test.notfound(token, 'DELETE', endpoint404);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized('DELETE', endpoint);
  });
});
