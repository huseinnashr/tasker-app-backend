import * as request from 'supertest';
import { EmployeeRepository } from '../src/employee/employee.repository';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../src/employee/role.enum';
import { INestApplication } from '@nestjs/common';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface signUpDto {
  username: string;
  role: Role;
}

const signUp = async (
  empRepo: EmployeeRepository,
  jwtService: JwtService,
  data: signUpDto,
) => {
  const employee = await empRepo.createAndSave({
    ...data,
    password: 'SecretPassword1234',
  });
  const accessToken = jwtService.sign({ username: data.username });

  return [`Bearer ${accessToken}`, employee];
};

const testUnauthorized = async (
  app: INestApplication,
  method: HTTPMethod,
  url: string,
) => {
  await getSupertestReq(app, method, url).expect(401);
};

const signUpTestForbidden = async (
  empRepo: EmployeeRepository,
  jwtService: JwtService,
  app: INestApplication,
  method: HTTPMethod,
  url: string,
) => {
  const signUpDTO = { username: 'testforbidden', role: Role.STAFF };
  const [auth] = await signUp(empRepo, jwtService, signUpDTO);

  await getSupertestReq(app, method, url)
    .set({ Authorization: auth })
    .expect(403);
};

const getSupertestReq = (
  app: INestApplication,
  method: HTTPMethod,
  url: string,
) => {
  const agent = request(app.getHttpServer());
  switch (method) {
    case 'GET':
      return agent.get(url);
    case 'POST':
      return agent.post(url);
    case 'PATCH':
      return agent.patch(url);
    case 'PUT':
      return agent.put(url);
    case 'DELETE':
      return agent.delete(url);
  }
};

export { signUp, testUnauthorized, signUpTestForbidden };
