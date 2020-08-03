import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ProjectRepository } from '../src/database/repository';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatusDTO,
  ProjectEntityResponseDTO,
  ProjectListEntityResponseDTO,
  ProjectListResponseDTO,
} from '../src/project/dto';
import { Role, ProjectStatus } from '../src/database/enum';
import { AuthHelper, TestHelper, RepoHelper } from './helper';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let proRepo: ProjectRepository;
  let auth: AuthHelper;
  let test: TestHelper;
  let repo: RepoHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    proRepo = moduleRef.get<ProjectRepository>(ProjectRepository);
    app = moduleRef.createNestApplication();

    auth = new AuthHelper(app);
    test = new TestHelper(app, auth);
    repo = new RepoHelper(app, auth);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/project (GET)', () => {
    it('returns list of project', async () => {
      const [token, manager] = await auth.signUp({ role: Role.MANAGER });

      const project = await repo.createAProject(manager);

      const res = await request(app.getHttpServer())
        .get('/project')
        .set({ Authorization: token })
        .expect(200);

      const expected: ProjectListResponseDTO = {
        data: [
          {
            id: project.id,
            title: project.title,
            body: project.body,
            status: project.status,
            manager: {
              id: project.manager.id,
              username: project.manager.username,
            },
          },
        ],
        permission: { create: true },
      };
      expect(res.body).toEqual(expected);
    });

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project'));
  });

  describe('/project (POST)', () => {
    it('creates new project & returns it', async () => {
      const [token, manager] = await auth.signUp({ role: Role.MANAGER });

      const createDto: CreateProjectDTO = {
        title: 'New Project',
        body: 'project body',
      };
      const res = await request(app.getHttpServer())
        .post('/project')
        .send(createDto)
        .set({ Authorization: token })
        .expect(201);

      const expected: ProjectListEntityResponseDTO = {
        data: {
          id: res.body.data.id,
          title: createDto.title,
          body: createDto.body,
          status: ProjectStatus.IN_PROGRESS,
          manager: {
            id: manager.id,
            username: manager.username,
          },
        },
      };

      expect(res.body).toEqual(expected);

      const [projects, count] = await proRepo.findAndCount();
      expect(projects[0]).toMatchObject(expected.data);
      expect(count).toBe(1);
    });

    it('returns 403 Forbidden when not manager', async () =>
      test.forbidden(Role.STAFF, 'POST', '/project'));
  });

  describe('/project/:id (GET)', () => {
    it('returns a project with given id', async () => {
      const [token] = await auth.signUp({ role: Role.STAFF });

      const project = await repo.createAProject();

      const res = await request(app.getHttpServer())
        .get('/project/' + project.id)
        .set({ Authorization: token })
        .expect(200);

      const expected: ProjectEntityResponseDTO = {
        data: {
          id: project.id,
          title: project.title,
          body: project.body,
          status: project.status,
          manager: {
            id: project.manager.id,
            username: project.manager.username,
          },
        },
        permission: { update: false, delete: false },
      };
      expect(res.body).toEqual(expected);
    });

    it('returns 404 Not found when the project does not exist', async () =>
      test.notfound(Role.STAFF, 'GET', '/project/999999'));

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project/1'));
  });

  describe('/project/:id (PUT)', () => {
    it('update the project with given id', async () => {
      const [token] = await auth.signUp({ role: Role.MANAGER });

      const project = await repo.createAProject();

      const updateDto: UpdateProjectDTO = {
        title: 'Project v2',
        body: 'updated project body',
      };
      const res = await request(app.getHttpServer())
        .put('/project/' + project.id)
        .send(updateDto)
        .set({ Authorization: token })
        .expect(200);

      const expected: ProjectListEntityResponseDTO = {
        data: {
          id: project.id,
          title: updateDto.title,
          body: updateDto.body,
          status: project.status,
          manager: {
            id: project.manager.id,
            username: project.manager.username,
          },
        },
      };
      expect(res.body).toEqual(expected);
    });

    it('returns 404 Not found when the project does not exist', async () =>
      test.notfound(Role.MANAGER, 'PUT', '/project/999999', {
        title: 'Project v2',
        body: 'updated project body',
      }));

    it('returns 403 Forbidden when not manager', async () =>
      test.forbidden(Role.STAFF, 'PUT', '/project/1'));
  });

  describe('/project/:id/status (PUT)', () => {
    it('update the project status and returns updated project', async () => {
      const [token] = await auth.signUp({ role: Role.MANAGER });

      const project = await repo.createAProject();

      const statusDto: ProjectStatusDTO = {
        status: ProjectStatus.DONE,
      };
      const res = await request(app.getHttpServer())
        .put('/project/' + project.id + '/status')
        .send(statusDto)
        .set({ Authorization: token })
        .expect(200);

      const expected: ProjectListEntityResponseDTO = {
        data: {
          id: project.id,
          title: project.title,
          body: project.body,
          status: statusDto.status,
          manager: {
            id: project.manager.id,
            username: project.manager.username,
          },
        },
      };
      expect(res.body).toEqual(expected);
    });

    it('returns 404 Not found when the project does not exist', async () =>
      test.notfound(Role.MANAGER, 'PUT', '/project/999999/status', {
        status: ProjectStatus.DONE,
      }));

    it('returns 403 Forbidden when not manager', async () =>
      test.forbidden(Role.STAFF, 'PUT', '/project/1'));
  });

  describe('/project/:id (DELETE)', () => {
    it('deletes the project', async () => {
      const [token] = await auth.signUp({ role: Role.MANAGER });

      const project = await repo.createAProject();

      await request(app.getHttpServer())
        .delete('/project/' + project.id)
        .set({ Authorization: token })
        .expect(200);

      const deletedProject = await proRepo.findOne(project.id);
      expect(deletedProject).toBeUndefined();
    });

    it('returns 404 Not found when the project does not exist', async () =>
      test.notfound(Role.MANAGER, 'DELETE', '/project/999999'));

    it('returns 403 Forbidden when not admin', async () =>
      test.forbidden(Role.STAFF, 'DELETE', '/project/1'));
  });
});
