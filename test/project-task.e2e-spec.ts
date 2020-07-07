import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TestHelper } from './helper/test.helper';
import { Role } from '../src/employee/role.enum';
import { TaskRepository } from '../src/task/task.repository';
import { ProjectRepository } from '../src/project/project.repository';
import { Status } from '../src/project/status.enum';
import { TaskStatus } from '../src/task/task-status.enum';

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

  describe('/project/:projectId/task (GET)', () => {
    it('returns list of all task in a project given project id', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token, employee] = await test.signUp(signUpDTO);

      const project = await proRepo.save(
        proRepo.create({
          title: 'New Project',
          body: 'project body',
          status: Status.IN_PROGRESS,
          manager: employee,
        }),
      );

      const task = await taskRepo.save(
        taskRepo.create({
          title: 'New Task',
          body: 'task body',
          status: TaskStatus.IN_PROGRESS,
          project: project,
          staff: employee,
        }),
      );
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

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project/1/task'));
  });
});
