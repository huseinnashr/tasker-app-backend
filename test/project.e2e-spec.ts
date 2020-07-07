import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ProjectRepository } from '../src/project/project.repository';
import { TestHelper } from './helper/test.helper';
import { Role } from '../src/employee/role.enum';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatusDTO,
} from '../src/project/project.dto';
import { Status } from '../src/project/status.enum';
import { ProjectMemberRole } from '../src/project/project-member-role.enum';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let proRepo: ProjectRepository;
  let test: TestHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    proRepo = moduleRef.get<ProjectRepository>(ProjectRepository);
    app = moduleRef.createNestApplication();
    test = new TestHelper(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/project (GET)', () => {
    it('returns list of project', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await test.signUp(signUpDTO);

      await request(app.getHttpServer())
        .get('/project')
        .set({ Authorization: token })
        .expect(200);
    });

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project'));
  });

  describe('/project (POST)', () => {
    it('creates new project & returns it', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token, employee] = await test.signUp(signUpDTO);

      const createDto: CreateProjectDTO = {
        title: 'New Project',
        body: 'project body',
      };
      await request(app.getHttpServer())
        .post('/project')
        .send(createDto)
        .set({ Authorization: token })
        .expect(201);

      const [projects, count] = await proRepo.findAndCount({
        relations: ['projectMember'],
      });
      expect(projects[0]).toMatchObject({
        ...createDto,
        status: Status.IN_PROGRESS,
        projectMember: [
          { employeeId: employee.id, role: ProjectMemberRole.MANAGER },
        ],
      });
      expect(count).toBe(1);
    });

    it('returns 403 Forbidden when not manager', async () =>
      test.forbidden(Role.STAFF, 'POST', '/project'));
  });

  describe('/project/:id (GET)', () => {
    it('returns a project with given id', async () => {
      const signUpDTO = { username: 'test', role: Role.STAFF };
      const [token] = await test.signUp(signUpDTO);

      const project = await proRepo.save(
        proRepo.create({
          title: 'New Project',
          body: 'project body',
          status: Status.IN_PROGRESS,
        }),
      );
      const res = await request(app.getHttpServer())
        .get('/project/' + project.id)
        .set({ Authorization: token })
        .expect(200);

      expect(res.body).toMatchObject(project);
    });

    it('returns 404 Not found when the project does not exist', async () =>
      test.notfound(Role.STAFF, 'GET', '/project/999999'));

    it('returns 401 Unauthorized when not logged in', async () =>
      test.unauthorized('GET', '/project/1'));
  });

  describe('/project/:id (PUT)', () => {
    it('update the project with given id', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token] = await test.signUp(signUpDTO);

      const project = await proRepo.save(
        proRepo.create({
          title: 'New Project',
          body: 'project body',
          status: Status.IN_PROGRESS,
        }),
      );
      const updateDto: UpdateProjectDTO = {
        title: 'Project v2',
        body: 'updated project body',
      };
      const res = await request(app.getHttpServer())
        .put('/project/' + project.id)
        .send(updateDto)
        .set({ Authorization: token })
        .expect(200);

      expect(res.body).toMatchObject(updateDto);
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
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token] = await test.signUp(signUpDTO);

      const project = await proRepo.save(
        proRepo.create({
          title: 'New Project',
          body: 'project body',
          status: Status.IN_PROGRESS,
        }),
      );
      const statusDto: ProjectStatusDTO = {
        status: Status.DONE,
      };
      const res = await request(app.getHttpServer())
        .put('/project/' + project.id + '/status')
        .send(statusDto)
        .set({ Authorization: token })
        .expect(200);

      expect(res.body).toMatchObject(statusDto);
    });

    it('returns 404 Not found when the project does not exist', async () =>
      test.notfound(Role.MANAGER, 'PUT', '/project/999999/status', {
        status: Status.DONE,
      }));

    it('returns 403 Forbidden when not manager', async () =>
      test.forbidden(Role.STAFF, 'PUT', '/project/1'));
  });

  describe('/project/:id (DELETE)', () => {
    it('deletes the project', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token] = await test.signUp(signUpDTO);

      const project = await proRepo.save({
        title: 'New Project',
        body: 'project body',
        status: Status.IN_PROGRESS,
      });
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