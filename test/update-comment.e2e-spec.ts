import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { CommentRepository } from '../src/database/repository';
import { Role } from '../src/database/enum';
import { AuthHelper, TestHelper, RepoHelper } from './helper';
import {
  CreateCommentDTO,
  UpdateCommentDTO,
  UpdateCommentListResponseDTO,
  UpdateCommentEntityResponseDTO,
  UpdateCommentListEntityResponseDTO,
} from '../src/update-comment/dto';

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

  it('test /project/:projectId/task/:taskId/update/:updateId/comment (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update, staff);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update/${update.id}/comment`;

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get comments request
    expect(res.status).toEqual(200);

    const expected: UpdateCommentListResponseDTO = {
      permission: { create: true },
      data: [
        {
          id: comment.id,
          body: comment.body,
          creator: { id: staff.id, username: staff.username },
        },
      ],
    };

    // A.2. Return correct list of all comments in an update
    expect(res.body).toEqual(expected);

    // B. Return 404 Not Found when update was not found
    const endpoint404 = `/project/${task.project.id}/task/${task.id}/update/9999/comment`;
    await test.notfound(Role.STAFF, 'GET', endpoint404);

    // C. Return 401 Unauthorized when not logged in
    await test.unauthorized('GET', endpoint);
  });

  it('test /project/:projectId/task/:taskId/update/:updateId/task (POST) specs', async () => {
    const [token2, manager] = await auth.signUp({ role: Role.MANAGER });
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);
    const update = await repo.createAnUpdate(task);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update/${update.id}/comment`;

    const createDto: CreateCommentDTO = {
      body: 'update body',
    };

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send(createDto)
      .set({ Authorization: token });

    // A.1. Return 201 Created on correct create request as task staff
    expect(res.status).toEqual(201);

    const expected: UpdateCommentListEntityResponseDTO = {
      data: {
        id: res.body.data.id,
        body: createDto.body,
        creator: { id: staff.id, username: staff.username },
      },
    };

    // A.2. Return the newly created comment, and the updates can be found in db
    expect(res.body).toEqual(expected);
    expect(await commRepo.findOne(res.body.data.id)).toMatchObject(
      expected.data,
    );

    const res2 = await request(app.getHttpServer())
      .post(endpoint)
      .send(createDto)
      .set({ Authorization: token2 });

    // B. Return 201 Created on correct create request as the project manager
    expect(res2.status).toEqual(201);
    expect(await commRepo.findOne(res2.body.id)).toBeDefined();

    // C. Return 404 Not Found when update was not found
    const endpoint404 = `/project/${task.project.id}/task/${task.id}/update/9999/comment`;
    await test.notfound(Role.STAFF, 'POST', endpoint404, createDto);

    // D. returns 401 Unauthorized when not logged in
    await test.unauthorized('POST', endpoint);
  });

  it('test /project/:projectId/task/:taskId/update/:updateId/comment/:commentId (GET) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update, staff);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update/${update.id}/comment/${comment.id}`;

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct get a comment request
    expect(res.status).toEqual(200);

    const expected: UpdateCommentEntityResponseDTO = {
      permission: { update: true, delete: true },
      data: {
        id: comment.id,
        body: comment.body,
        creator: { id: staff.id, username: staff.username },
      },
    };

    // A.2. Returns the correct comment with given id.
    expect(res.body).toEqual(expected);

    // B. Returns 404 when comment with given id was not found
    const endpoint404 = `/project/${task.project.id}/task/${task.id}/update/${update.id}/comment/${comment.id}/9999`;
    await test.notfound(token, 'GET', endpoint404);

    // C. returns 401 Unauthorized when not logged in
    await test.unauthorized('GET', endpoint);
  });

  it('test /project/:projectId/task/:taskId/update/:updateId/comment/:commentId (PUT) specs', async () => {
    const [token2, manager] = await auth.signUp({ role: Role.MANAGER });
    const [token, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update);

    const endpoint = `/project/${project.id}/task/${task.id}/update/${update.id}/comment/${comment.id}`;

    const updateDto: UpdateCommentDTO = {
      body: 'updated comment body',
    };

    const res = await request(app.getHttpServer())
      .put(endpoint)
      .send(updateDto)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct update a comment request
    expect(res.status).toEqual(200);

    const expected: UpdateCommentListEntityResponseDTO = {
      data: {
        id: res.body.data.id,
        body: updateDto.body,
        creator: { id: staff.id, username: staff.username },
      },
    };

    // A.2. Return the updated comment, and the updates reflected in db
    expect(res.body).toEqual(expected);
    expect(await commRepo.findOne(comment.id)).toMatchObject(expected.data);

    await test.forbidden(token2, 'PUT', endpoint, updateDto);

    // C. Return 404 Not Found when comment was not found
    const endpoint404 = `/project/${project.id}/task/${task.id}/update/${update.id}/comment/9999`;
    await test.notfound(token, 'PUT', endpoint404, updateDto);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized('PUT', endpoint);
  });

  it('test /project/:projectId/task/:taskId/update/:updateId/comment/:commentId (DELETE) specs', async () => {
    const [token, staff] = await auth.signUp({ role: Role.STAFF });
    const [token2] = await auth.signUp({ role: Role.STAFF });

    const task = await repo.createATask(null, staff);
    const update = await repo.createAnUpdate(task);
    const comment = await repo.createAComment(update, staff);

    const endpoint = `/project/${task.project.id}/task/${task.id}/update/${update.id}/comment/${comment.id}`;

    await test.forbidden(token2, 'DELETE', endpoint);

    const res = await request(app.getHttpServer())
      .delete(endpoint)
      .set({ Authorization: token });

    // A.1. Return 200 OK on correct delete request
    expect(res.status).toEqual(200);

    // C. Return 404 Not Found when comment was not found
    const endpoint404 = `/project/${task.project.id}/task/${task.id}/update/${update.id}/comment/9999`;
    await test.notfound(token, 'DELETE', endpoint404);

    // D. Return 401 Unauthorized when not logged in
    await test.unauthorized('DELETE', endpoint);
  });
});
