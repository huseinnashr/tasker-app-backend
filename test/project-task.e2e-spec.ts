import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestHelper } from './helper/test.helper';
import { TaskRepository } from '../src/database/repository';
import { Role, TaskStatus } from '../src/database/enum';
import { CreateTaskDTO, UpdateTaskDTO } from '../src/project-task/dto';
import { RepoHelper } from './helper/repo.helper';

describe('ProjectTaskController (e2e)', () => {
  let app: INestApplication;
  let taskRepo: TaskRepository;
  let test: TestHelper;
  let repo: RepoHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    taskRepo = moduleRef.get<TaskRepository>(TaskRepository);
    app = moduleRef.createNestApplication();
    test = new TestHelper(app);
    repo = new RepoHelper(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/project/:projectId/task (GET)', () => {
    it('returns list of all task in a project given project id', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token, employee] = await test.signUp(signUpDTO);

      const project = await repo.createAProject(employee);
      const task = await repo.createATask(project, employee);

      const res = await request(app.getHttpServer())
        .get(`/project/${project.id}/task`)
        .set({ Authorization: token })
        .expect(200);

      expect(res.body[0]).toEqual({
        id: task.id,
        title: task.title,
        body: task.body,
        status: TaskStatus.IN_PROGRESS,
        staff: { id: task.staff.id, username: task.staff.username },
      });
    });

    it('returns 404 Not Found when the project with given id was not found', async () =>
      test.notfound(Role.MANAGER, 'GET', '/project/999999/task'));

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project/1/task'));
  });

  describe('/project/:projectId/task (POST)', () => {
    it('returns list of all task in a project given project id', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token, manager] = await test.signUp(signUpDTO);

      const signUpDTO2 = { username: 'staff', role: Role.STAFF };
      const [, staff] = await test.signUp(signUpDTO2);

      const project = await repo.createAProject(manager);

      const createDto: CreateTaskDTO = {
        title: 'New Task',
        body: 'task body',
        employeeId: staff.id,
      };
      const res = await request(app.getHttpServer())
        .post(`/project/${project.id}/task`)
        .send(createDto)
        .set({ Authorization: token })
        .expect(201);

      expect(res.body).toEqual({
        id: res.body.id,
        title: createDto.title,
        body: createDto.body,
        status: TaskStatus.IN_PROGRESS,
        staff: { id: staff.id, username: staff.username },
      });
    });

    it('returns 404 Not Found when the project with given id was not found', async () =>
      await test.notfound(Role.MANAGER, 'POST', `/project/99999/task`, {
        title: 'New Task',
        body: 'task body',
        employeeId: 1,
      }));

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('POST', '/project/1/task'));
  });

  describe('/project/:projectId/task/:taskId (GET)', () => {
    it('returns a task within a project', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token, employee] = await test.signUp(signUpDTO);

      const project = await repo.createAProject(employee);
      const task = await repo.createATask(project, employee);

      const res = await request(app.getHttpServer())
        .get(`/project/${project.id}/task/${task.id}`)
        .set({ Authorization: token })
        .expect(200);

      expect(res.body).toEqual({
        id: task.id,
        title: task.title,
        body: task.body,
        status: TaskStatus.IN_PROGRESS,
        staff: { id: task.staff.id, username: task.staff.username },
      });
    });

    it('returns 404 Not Found when the task with given id was not found', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token, employee] = await test.signUp(signUpDTO);

      const project = await repo.createAProject(employee);

      await test.notfound(token, 'GET', `/project/${project.id}/task/999999`);
    });

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project/1/task/1'));
  });

  describe('/project/:projectId/task/:taskId (PUT)', () => {
    it('update the task and return it', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token, manager] = await test.signUp(signUpDTO);

      const signUpDTO2 = { username: 'staff', role: Role.STAFF };
      const [, staff] = await test.signUp(signUpDTO2);

      const project = await repo.createAProject(manager);
      const task = await repo.createATask(project, staff);

      const updateTask: UpdateTaskDTO = {
        title: 'Updated Task',
        body: 'updated task body',
        employeeId: task.staff.id,
      };
      const res = await request(app.getHttpServer())
        .put(`/project/${project.id}/task/${task.id}`)
        .send(updateTask)
        .set({ Authorization: token })
        .expect(200);

      expect(res.body).toEqual({
        id: res.body.id,
        title: updateTask.title,
        body: updateTask.body,
        status: TaskStatus.IN_PROGRESS,
        staff: { id: staff.id, username: staff.username },
      });
    });

    it('return 403 Forbidden if current employee not the task project manager', async () => {
      const signUpDTO1 = { username: 'manager1', role: Role.MANAGER };
      const [, manager1] = await test.signUp(signUpDTO1);

      const signUpDTO2 = { username: 'manager2', role: Role.MANAGER };
      const [token2] = await test.signUp(signUpDTO2);

      const signUpDTO3 = { username: 'staff', role: Role.STAFF };
      const [, staff] = await test.signUp(signUpDTO3);

      const project = await repo.createAProject(manager1);
      const task = await repo.createATask(project, staff);

      const updateTask: UpdateTaskDTO = {
        title: 'Updated Task',
        body: 'updated task body',
        employeeId: task.staff.id,
      };
      await request(app.getHttpServer())
        .put(`/project/${project.id}/task/${task.id}`)
        .send(updateTask)
        .set({ Authorization: token2 })
        .expect(403);
    });

    it('returns 404 Not Found when the task with given id was not found', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token, employee] = await test.signUp(signUpDTO);

      const project = await repo.createAProject(employee);

      await test.notfound(token, 'PUT', `/project/${project.id}/task/999999`, {
        title: 'New Task',
        body: 'task body',
        employeeId: 1,
      });
    });

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('PUT', '/project/1/task/1'));
  });

  describe('/project/:projectId/task/:taskId (DELETE)', () => {
    it('delete the task', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token, manager] = await test.signUp(signUpDTO);

      const signUpDTO2 = { username: 'staff', role: Role.STAFF };
      const [, staff] = await test.signUp(signUpDTO2);

      const project = await repo.createAProject(manager);
      const task = await repo.createATask(project, staff);

      await request(app.getHttpServer())
        .delete(`/project/${project.id}/task/${task.id}`)
        .set({ Authorization: token })
        .expect(200);

      expect(await taskRepo.findOne(task.id)).toBeUndefined();
    });

    it('return 403 Forbidden if current employee not the task project manager', async () => {
      const signUpDTO1 = { username: 'manager1', role: Role.MANAGER };
      const [, manager1] = await test.signUp(signUpDTO1);

      const signUpDTO2 = { username: 'manager2', role: Role.MANAGER };
      const [token2] = await test.signUp(signUpDTO2);

      const signUpDTO3 = { username: 'staff', role: Role.STAFF };
      const [, staff] = await test.signUp(signUpDTO3);

      const project = await repo.createAProject(manager1);
      const task = await repo.createATask(project, staff);

      await request(app.getHttpServer())
        .delete(`/project/${project.id}/task/${task.id}`)
        .set({ Authorization: token2 })
        .expect(403);
    });

    it('returns 404 Not Found when the task with given id was not found', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token, employee] = await test.signUp(signUpDTO);

      const project = await repo.createAProject(employee);

      await test.notfound(
        token,
        'DELETE',
        `/project/${project.id}/task/999999`,
      );
    });

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('DELETE', '/project/1/task/1'));
  });
});
