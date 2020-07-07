import { Role } from '../../src/employee/role.enum';
import { INestApplication } from '@nestjs/common';
import { SupertestHelper, HTTPMethod } from './supertest.helper';
import { AuthHelper, SignUpDTO } from './auth.helper';
import { Employee } from '../../src/employee/employee.entity';

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
  forbidden = async (role: Role, method: HTTPMethod, url: string) => {
    const signUpDTO = { username: 'testforbidden', role };
    const [auth] = await this.signUp(signUpDTO);

    await this.supertest
      .request(method, url)
      .set({ Authorization: auth })
      .expect(403);
  };

  /** Create new employee with role R and test if endpoint returns not found.*/
  async notfound(role: Role, method: HTTPMethod, url: string, data?: any);

  /** Use token to test if endpoint returns not found.*/
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
