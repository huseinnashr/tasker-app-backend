import { Role } from '../../src/database/enum';
import { INestApplication } from '@nestjs/common';
import { SupertestHelper, HTTPMethod } from './supertest.helper';
import { AuthHelper, SignUpDTO } from './auth.helper';
import { Employee } from '../../src/database/entity';

class TestHelper {
  private auth: AuthHelper;
  private supertest: SupertestHelper;

  constructor(app: INestApplication) {
    this.auth = new AuthHelper(app);
    this.supertest = new SupertestHelper(app);
  }

  /** Create new employee account */
  signUp = async (data: SignUpDTO): Promise<[string, Employee]> => {
    return await this.auth.signUp(data);
  };

  unauthorized = async (method: HTTPMethod, url: string) => {
    await this.supertest.request(method, url).expect(401);
  };

  /** Create new employee with role R and test if endpoint forbid role R employee.*/
  async forbidden(role: Role, method: HTTPMethod, url: string);

  /** Use token with role R to test if endpoint forbid role R employee.*/
  async forbidden(token: string, method: HTTPMethod, url: string);

  async forbidden(arg1: Role | string, method: HTTPMethod, url: string) {
    let token: string;
    if (Object.values(<any>Role).includes(arg1)) {
      token = (await this.signUp({ role: <Role>arg1 }))[0];
    } else {
      token = arg1;
    }

    await this.supertest
      .request(method, url)
      .set({ Authorization: token })
      .expect(403);
  }

  /** Create new employee with correct role and test if endpoint returns not found.*/
  async notfound(role: Role, method: HTTPMethod, url: string, data?: any);

  /** Use token  with correct role to test if endpoint returns not found.*/
  async notfound(token: string, method: HTTPMethod, url: string, data?: any);

  async notfound(
    arg1: Role | string,
    method: HTTPMethod,
    url: string,
    data?: any,
  ): Promise<void> {
    let token: string;
    if (Object.values(<any>Role).includes(arg1)) {
      const signUpDTO = { username: 'testnotfound', role: <Role>arg1 };
      token = (await this.signUp(signUpDTO))[0];
    } else {
      token = arg1;
    }

    await this.supertest
      .request(method, url)
      .send(data)
      .set({ Authorization: token })
      .expect(404);
  }
}

export { TestHelper };
