import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ProjectRepository } from '../src/project/project.repository';
import { AuthHelper } from './helper';
import { Role } from '../src/employee/role.enum';
import { CreateProjectDTO } from '../src/project/project.dto';
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
      auth.signUpTestForbidden('POST', '/project'));
  });
});
