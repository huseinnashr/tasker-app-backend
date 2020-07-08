import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestHelper } from './helper/test.helper';
import { Role } from '../src/employee/role.enum';
import { TaskRepository } from '../src/task/task.repository';
import { ProjectRepository } from '../src/project/project.repository';
import { ProjectStatus } from '../src/project/project-status.enum';
import { TaskStatus } from '../src/task/task-status.enum';
import { Project } from '../src/project/project.entity';
import { Employee } from '../src/employee/employee.entity';
import { Task } from '../src/task/task.entity';
import { CreateTaskDTO } from '../src/project-task/dto';

describe('ProjectTaskController (e2e)', () => {
  let app: INestApplication;
  let proRepo: ProjectRepository;
  let taskRepo: TaskRepository;
  let test: TestHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    proRepo = moduleRef.get<ProjectRepository>(ProjectRepository);
    taskRepo = moduleRef.get<TaskRepository>(TaskRepository);
    app = moduleRef.createNestApplication();
    test = new TestHelper(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const createAProject = async (manager: Employee): Promise<Project> => {
    return await proRepo.save(
      proRepo.create({
        title: 'New Project',
        body: 'project body',
        status: ProjectStatus.IN_PROGRESS,
        manager: manager,
      }),
    );
  };

  const createATask = async (
    project: Project,
    staff: Employee,
  ): Promise<Task> => {
    return await taskRepo.save(
      taskRepo.create({
        title: 'New Task',
        body: 'task body',
        status: TaskStatus.IN_PROGRESS,
        project: project,
        staff: staff,
      }),
    );
  };

  describe('/project/:projectId/task (GET)', () => {
    it('returns list of all task in a project given project id', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token, employee] = await test.signUp(signUpDTO);

      const project = await createAProject(employee);
      const task = await createATask(project, employee);

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

      const project = await createAProject(manager);

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

      const project = await createAProject(employee);
      const task = await createATask(project, employee);

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

      const project = await createAProject(employee);

      await test.notfound(token, 'GET', `/project/${project.id}/task/999999`);
    });

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project/1/task/1'));
  });
});
