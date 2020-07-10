import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UpdateRepository } from '../src/database/repository';
import { Role, UpdateType } from '../src/database/enum';
import { AuthHelper, TestHelper, RepoHelper } from './helper';
import { CreateUpdateDTO, UpdateUpdateDTO } from '../src/task-update/dto';

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

  it('test /task/:taskId/update (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);

    const res = await request(app.getHttpServer())
      .get(`/task/${task.id}/update`)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get updates request
    expect(res.status).toEqual(200);

    const expected = {
      id: update.id,
      title: update.title,
      body: update.body,
      type: update.type,
    };

    // A.2. Return correct list of all updates in a task
    expect(res.body[0]).toEqual(expected);

    // B. Return 404 Not Found when task was not found
    await test.notfound(Role.STAFF, 'GET', '/task/999999/update');

    // C. Return 401 Unauthorized when not logged in
    await test.unauthorized('GET', '/task/1/update');
  });

  it('test /task/:taskId/update (POST) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);

    const createDto: CreateUpdateDTO = {
      title: 'New Update',
      body: 'update body',
      type: UpdateType.PROGRESS,
    };

    const res = await request(app.getHttpServer())
      .post(`/task/${task.id}/update`)
      .send(createDto)
      .set({ Authorization: token });

    // A.1. Return 201 Created on correct create an update request
    expect(res.status).toEqual(201);

    const expected = {
      id: res.body.id,
      title: createDto.title,
      body: createDto.body,
      type: createDto.type,
    };

    // A.2. Return the newly created update, and the update can be found in db
    expect(res.body).toEqual(expected);
    expect(await updateRepo.findOne(res.body.id)).toMatchObject(expected);

    // B. Return 404 Not Found when task was not found
    await test.notfound(Role.STAFF, 'POST', `/task/99999/update`, createDto);

    // C. returns 401 Unauthorized when not logged in
    await test.unauthorized('POST', '/task/1/update');
  });

  it('test /task/:taskId/update/:updateId (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);

    const res = await request(app.getHttpServer())
      .get(`/task/${task.id}/update/${update.id}`)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get an update request
    expect(res.status).toEqual(200);

    const expected = {
      id: update.id,
      title: update.title,
      body: update.body,
      type: update.type,
    };

    // A.2. Returns the correct update with given id.
    expect(res.body).toEqual(expected);

    // B. Returns 404 when update with given id was not found
    await test.notfound(token, 'GET', `/task/${task.id}/update/999999`);

    // C. returns 401 Unauthorized when not logged in
    await test.unauthorized('GET', '/task/1/update/1');
  });

  it('test /task/:taskId/update/:updateId (PUT) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);

    const updateDto: UpdateUpdateDTO = {
      title: 'Updated update',
      body: 'updated update body',
      type: UpdateType.PROGRESS,
    };

    const res = await request(app.getHttpServer())
      .put(`/task/${task.id}/update/${update.id}`)
      .send(updateDto)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct update an update request
    expect(res.status).toEqual(200);

    const expected = {
      id: res.body.id,
      title: updateDto.title,
      body: updateDto.body,
      type: updateDto.type,
    };

    // A.2. Return the updated update, and the updates reflected in db
    expect(res.body).toEqual(expected);
    expect(await updateRepo.findOne(update.id)).toMatchObject(expected);

    const [token2] = await auth.signUp({ role: Role.STAFF });
    const forbiddenRes = await request(app.getHttpServer())
      .put(`/task/${task.id}/update/${update.id}`)
      .send(updateDto)
      .set({ Authorization: token2 });

    // B. Return 403 Forbidden when the authorized employee is not the task staff
    expect(forbiddenRes.status).toEqual(403);

    // C. Return 404 Not Found when update was not found
    const notFoundUrl = `/task/${task.id}/update/999999`;
    await test.notfound(token, 'PUT', notFoundUrl, updateDto);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized('PUT', `/task/${task.id}/update/${update.id}`);
  });

  it('test /task/:taskId/update/:updateId (DELETE) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);

    const res = await request(app.getHttpServer())
      .delete(`/task/${task.id}/update/${update.id}`)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct delete an update request
    expect(res.status).toEqual(200);

    const update2 = await repo.createAnUpdate(task);
    const [token2] = await auth.signUp({ role: Role.STAFF });
    const forbiddenRes = await request(app.getHttpServer())
      .delete(`/task/${task.id}/update/${update2.id}`)
      .set({ Authorization: token2 });

    // B. Return 403 Forbidden when the authorized employee is not the task staff
    expect(forbiddenRes.status).toEqual(403);

    // C. Return 404 Not Found when update was not found
    const notFoundUrl = `/task/${task.id}/update/999999`;
    await test.notfound(token, 'DELETE', notFoundUrl);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized('DELETE', `/task/${task.id}/update/${update.id}`);
  });
});
