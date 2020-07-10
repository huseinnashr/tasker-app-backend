import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { CommentRepository } from '../src/database/repository';
import { Role } from '../src/database/enum';
import { AuthHelper, TestHelper, RepoHelper } from './helper';
import { CreateCommentDTO, UpdateCommentDTO } from '../src/update-comment/dto';

describe('ProjectTaskController (e2e)', () => {
  let app: INestApplication;
  let commRepo: CommentRepository;
  let auth: AuthHelper;
  let test: TestHelper;
  let repo: RepoHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    commRepo = moduleRef.get<CommentRepository>(CommentRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    repo = new RepoHelper(app, auth);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test /update/:updateId/comment (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update, staff);

    const res = await request(app.getHttpServer())
      .get(`/update/${update.id}/comment`)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get comments request
    expect(res.status).toEqual(200);

    const expected = {
      id: comment.id,
      body: comment.body,
      creator: { id: staff.id, username: staff.username },
    };

    // A.2. Return correct list of all comments in an update
    expect(res.body[0]).toEqual(expected);

    // B. Return 404 Not Found when update was not found
    await test.notfound(Role.STAFF, 'GET', '/update/999999/comment');

    // C. Return 401 Unauthorized when not logged in
    await test.unauthorized('GET', '/update/1/comment');
  });

  it('test /update/:updateId/task (POST) specs', async () => {
    const [token2, manager] = await auth.signUp({ role: Role.MANAGER });
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);
    const update = await repo.createAnUpdate(task);

    const createDto: CreateCommentDTO = {
      body: 'update body',
    };

    const res = await request(app.getHttpServer())
      .post(`/update/${update.id}/comment`)
      .send(createDto)
      .set({ Authorization: token });

    // A.1. Return 201 Created on correct create request as task staff
    expect(res.status).toEqual(201);

    const expected = {
      id: res.body.id,
      body: createDto.body,
      creator: { id: staff.id, username: staff.username },
    };

    // A.2. Return the newly created comment, and the updates can be found in db
    expect(res.body).toEqual(expected);
    expect(await commRepo.findOne(res.body.id)).toMatchObject(expected);

    const res2 = await request(app.getHttpServer())
      .post(`/update/${update.id}/comment`)
      .send(createDto)
      .set({ Authorization: token2 });

    // B. Return 201 Created on correct create request as the project manager
    expect(res2.status).toEqual(201);
    expect(await commRepo.findOne(res2.body.id)).toBeDefined();

    // C. Return 404 Not Found when update was not found
    await test.notfound(Role.STAFF, 'POST', `/update/99999/comment`, createDto);

    // D. returns 401 Unauthorized when not logged in
    await test.unauthorized('POST', `/update/${update.id}/comment`);
  });

  it('test /update/:updateId/comment/:commentId (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update, staff);

    const res = await request(app.getHttpServer())
      .get(`/update/${update.id}/comment/${comment.id}`)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get a comment request
    expect(res.status).toEqual(200);

    const expected = {
      id: comment.id,
      body: comment.body,
      creator: { id: staff.id, username: staff.username },
    };

    // A.2. Returns the correct comment with given id.
    expect(res.body).toEqual(expected);

    // B. Returns 404 when comment with given id was not found
    await test.notfound(token, 'GET', `/update/${update.id}/comment/999999`);

    // C. returns 401 Unauthorized when not logged in
    await test.unauthorized(
      'GET',
      `/update/${update.id}/comment/${comment.id}`,
    );
  });

  it('test /update/:updateId/comment/:commentId (PUT) specs', async () => {
    const [token2, manager] = await auth.signUp({ role: Role.MANAGER });
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update);

    const updateDto: UpdateCommentDTO = {
      body: 'updated comment body',
    };

    const res = await request(app.getHttpServer())
      .put(`/update/${update.id}/comment/${comment.id}`)
      .send(updateDto)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct update a comment request
    expect(res.status).toEqual(200);

    const expected = {
      id: res.body.id,
      body: updateDto.body,
      creator: { id: staff.id, username: staff.username },
    };

    // A.2. Return the updated comment, and the updates reflected in db
    expect(res.body).toEqual(expected);
    expect(await commRepo.findOne(comment.id)).toMatchObject(expected);

    const forbiddenRes = await request(app.getHttpServer())
      .put(`/update/${update.id}/comment/${comment.id}`)
      .send(updateDto)
      .set({ Authorization: token2 });

    // B. Return 403 Forbidden when the authorized employee is not the comment owner,
    // despite being the project manager
    expect(forbiddenRes.status).toEqual(403);

    // C. Return 404 Not Found when comment was not found
    const notFoundUrl = `/update/${update.id}/comment/999999`;
    await test.notfound(token, 'PUT', notFoundUrl, updateDto);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized(
      'PUT',
      `/update/${update.id}/comment/${comment.id}`,
    );
  });

  it('test /update/:updateId/comment/:commentId (DELETE) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update, staff);

    const res = await request(app.getHttpServer())
      .delete(`/update/${update.id}/comment/${comment.id}`)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct delete request
    expect(res.status).toEqual(200);

    const comment2 = await repo.createAComment(update);
    const [token2] = await auth.signUp({ role: Role.STAFF });
    const forbiddenRes = await request(app.getHttpServer())
      .delete(`/update/${update.id}/comment/${comment2.id}`)
      .set({ Authorization: token2 });

    // B. Return 403 Forbidden when the requester is not the comment owner
    expect(forbiddenRes.status).toEqual(403);

    // C. Return 404 Not Found when comment was not found
    const notFoundUrl = `/update/${update.id}/comment/999999`;
    await test.notfound(token, 'DELETE', notFoundUrl);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized(
      'DELETE',
      `/update/${update.id}/comment/${comment.id}`,
    );
  });
});
