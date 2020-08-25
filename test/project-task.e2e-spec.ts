import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TaskRepository } from '../src/database/repository';
import { Role, TaskStatus } from '../src/database/enum';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  ProjectTaskListDTO,
  ProjectTaskEntityDTO,
  ProjectTaskListEntityDTO,
} from '../src/project-task/dto';
import { AuthHelper, TestHelper, RepoHelper } from './helper';

describe('ProjectTaskController (e2e)', () => {
  let app: INestApplication;
  let taskRepo: TaskRepository;
  let auth: AuthHelper;
  let test: TestHelper;
  let repo: RepoHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    taskRepo = moduleRef.get<TaskRepository>(TaskRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    repo = new RepoHelper(app, auth);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('test /project/:projectId/task (GET) specs', async () => {
    const [token, employee] = await auth.signUp({ role: Role.MANAGER });

    const project = await repo.createAProject(employee);
    const task = await repo.createATask(project, employee);

    const endpoint = `/project/${project.id}/task`;
    const endpoint404 = `/project/99/task`;

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token });

    await test.unauthorized('GET', endpoint);
    await test.notfound(token, 'GET', endpoint404);

    const expected: ProjectTaskListDTO = {
      permission: { create: true },
      data: [
        {
          id: task.id,
          title: task.title,
          body: task.body,
          status: TaskStatus.IN_PROGRESS,
          staff: { id: task.staff.id, username: task.staff.username },
        },
      ],
    };
    expect(res.body).toEqual(expected);
  });

  it('test /project/:projectId/task (POST) specs', async () => {
    const [token, manager] = await auth.signUp({ role: Role.MANAGER });
    const [, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);

    const endpoint = `/project/${project.id}/task`;
    const endpoint404 = `/project/99/task`;

    const createDto: CreateTaskDTO = {
      title: 'New Task',
      body: 'task body',
      employeeId: staff.id,
    };

    await test.unauthorized('POST', endpoint);
    await test.notfound(token, 'POST', endpoint404, createDto);

    const res = await request(app.getHttpServer())
      .post(endpoint)
      .send(createDto)
      .set({ Authorization: token })
      .expect(201);

    const expected: ProjectTaskListEntityDTO = {
      data: {
        id: res.body.data.id,
        title: createDto.title,
        body: createDto.body,
        status: TaskStatus.IN_PROGRESS,
        staff: { id: staff.id, username: staff.username },
      },
    };
    expect(res.body).toEqual(expected);
  });

  it('test /project/:projectId/task/:taskId (GET) specs', async () => {
    const [token, employee] = await auth.signUp({ role: Role.ADMIN });

    const project = await repo.createAProject(employee);
    const task = await repo.createATask(project, employee);

    const endpoint = `/project/${project.id}/task/${task.id}`;

    await test.unauthorized('GET', endpoint);
    await test.notfound(token, 'GET', endpoint + '99');

    const res = await request(app.getHttpServer())
      .get(endpoint)
      .set({ Authorization: token })
      .expect(200);

    const expected: ProjectTaskEntityDTO = {
      permission: { update: true, delete: true },
      data: {
        id: task.id,
        title: task.title,
        body: task.body,
        status: TaskStatus.IN_PROGRESS,
        staff: { id: task.staff.id, username: task.staff.username },
      },
    };
    expect(res.body).toEqual(expected);
  });

  it('test /project/:projectId/task/:taskId (PUT) specs', async () => {
    const [token, manager] = await auth.signUp({ role: Role.MANAGER });
    const [token2] = await auth.signUp({ role: Role.MANAGER });
    const [, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);

    const endpoint = `/project/${project.id}/task/${task.id}`;

    const updateTask: UpdateTaskDTO = {
      title: 'Updated Task',
      body: 'updated task body',
      employeeId: task.staff.id,
    };

    await test.unauthorized('PUT', endpoint);
    await test.notfound(token, 'PUT', endpoint + '99', updateTask);

    //return 403 Forbidden if current employee not the task project manager
    await request(app.getHttpServer())
      .put(`/project/${project.id}/task/${task.id}`)
      .send(updateTask)
      .set({ Authorization: token2 })
      .expect(403);

    const res = await request(app.getHttpServer())
      .put(endpoint)
      .send(updateTask)
      .set({ Authorization: token })
      .expect(200);

    const expected: ProjectTaskListEntityDTO = {
      data: {
        id: res.body.data.id,
        title: updateTask.title,
        body: updateTask.body,
        status: TaskStatus.IN_PROGRESS,
        staff: { id: staff.id, username: staff.username },
      },
    };
    expect(res.body).toEqual(expected);
  });

  it('test /project/:projectId/task/:taskId (DELETE) specs', async () => {
    const [token, manager] = await auth.signUp({ role: Role.MANAGER });
    const [token2] = await auth.signUp({ role: Role.MANAGER });
    const [, staff] = await auth.signUp({ role: Role.STAFF });

    const project = await repo.createAProject(manager);
    const task = await repo.createATask(project, staff);

    const endpooint = `/project/${project.id}/task/${task.id}`;

    await test.unauthorized('DELETE', endpooint);
    await test.notfound(token, 'DELETE', endpooint + '99');

    // return 403 Forbidden if current employee not the task project manager
    await request(app.getHttpServer())
      .delete(`/project/${project.id}/task/${task.id}`)
      .set({ Authorization: token2 })
      .expect(403);

    await request(app.getHttpServer())
      .delete(endpooint)
      .set({ Authorization: token })
      .expect(200);

    expect(await taskRepo.findOne(task.id)).toBeUndefined();
  });
});
