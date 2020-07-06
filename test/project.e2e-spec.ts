import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ProjectRepository } from '../src/project/project.repository';
import { AuthHelper } from './helper';
import { Role } from '../src/employee/role.enum';
import { CreateProjectDTO, UpdateProjectDTO } from '../src/project/project.dto';
import { Status } from '../src/project/status.enum';

describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let proRepo: ProjectRepository;
  let auth: AuthHelper;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    proRepo = moduleRef.get<ProjectRepository>(ProjectRepository);
    app = moduleRef.createNestApplication();
    auth = new AuthHelper(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/project (GET)', () => {
    it('returns list of project', async () => {
      const signUpDTO = { username: 'test', role: Role.ADMIN };
      const [token] = await auth.signUp(signUpDTO);

      await request(app.getHttpServer())
        .get('/project')
        .set({ Authorization: token })
        .expect(200);
    });

    it('returns 401 Unauthorized when not logged in', async () =>
      auth.testUnauthorized('GET', '/project'));
  });

  describe('/project (POST)', () => {
    it('creates new project & returns it', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token] = await auth.signUp(signUpDTO);

      const createDto: CreateProjectDTO = {
        title: 'New Project',
        body: 'project body',
      };
      await request(app.getHttpServer())
        .post('/project')
        .send(createDto)
        .set({ Authorization: token })
        .expect(201);

      const [projects, count] = await proRepo.findAndCount();
      expect(projects[0]).toMatchObject({
        ...createDto,
        status: Status.IN_PROGRESS,
      });
      expect(count).toBe(1);
    });

    it('returns 403 Forbidden when not manager', async () =>
      auth.testForbidden(Role.STAFF, 'POST', '/project'));
  });

  describe('/project/:id (GET)', () => {
    it('returns a project with given id', async () => {
      const signUpDTO = { username: 'test', role: Role.STAFF };
      const [token] = await auth.signUp(signUpDTO);

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

    it('returns 401 Unauthorized when not logged in', async () =>
      auth.testUnauthorized('GET', '/project/1'));
  });

  describe('/project/:id (PUT)', () => {
    it('returns a project with given id', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token] = await auth.signUp(signUpDTO);

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

    it('returns 403 Forbidden when not manager', async () =>
      auth.testForbidden(Role.STAFF, 'PUT', '/project/1'));
  });

  describe('/project/:id (DELETE)', () => {
    it('deletes the project', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token] = await auth.signUp(signUpDTO);

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

    it('return 404 NotFound when the project does not exist', async () => {
      const signUpDTO = { username: 'test', role: Role.MANAGER };
      const [token] = await auth.signUp(signUpDTO);

      await request(app.getHttpServer())
        .delete('/project/999999')
        .set({ Authorization: token })
        .expect(404);
    });

    it('returns 403 Forbidden when not admin', async () =>
      auth.testForbidden(Role.STAFF, 'DELETE', '/project/1'));
  });
});
