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

class AuthHelper {
  private supertest: SupertestHelper;

  constructor(
    private empRepo: EmployeeRepository,
    private jwtService: JwtService,
    private app: INestApplication,
  ) {
    this.supertest = new SupertestHelper(app);
  }

  signUp = async (data: signUpDto) => {
    const employee = await this.empRepo.createAndSave({
      ...data,
      password: 'SecretPassword1234',
    });
    const accessToken = this.jwtService.sign({ username: data.username });

    return [`Bearer ${accessToken}`, employee];
  };

  testUnauthorized = async (method: HTTPMethod, url: string) => {
    await this.supertest.request(method, url).expect(401);
  };

  signUpTestForbidden = async (method: HTTPMethod, url: string) => {
    const signUpDTO = { username: 'testforbidden', role: Role.STAFF };
    const [auth] = await this.signUp(signUpDTO);

    await this.supertest
      .request(method, url)
      .set({ Authorization: auth })
      .expect(403);
  };
}

class SupertestHelper {
  constructor(private app: INestApplication) {}

  request = (method: HTTPMethod, url: string) => {
    const agent = request(this.app.getHttpServer());
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
}

export { AuthHelper };
