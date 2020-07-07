import { Role } from '../../src/employee/role.enum';
import { INestApplication } from '@nestjs/common';
import { SupertestHelper, HTTPMethod } from './supertest.helper';
import { AuthHelper, SignUpDTO } from './auth.helper';

class TestHelper {
  private auth: AuthHelper;
  private supertest: SupertestHelper;

  constructor(app: INestApplication) {
    this.auth = new AuthHelper(app);
    this.supertest = new SupertestHelper(app);
  }

  /** Create new employee account */
  signUp = async (data: SignUpDTO) => {
    return this.auth.signUp(data);
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

  notfound = async (
    role: Role,
    method: HTTPMethod,
    url: string,
    data?: any,
  ) => {
    const signUpDTO = { username: 'testnotfound', role };
    const [token] = await this.signUp(signUpDTO);

    await this.supertest
      .request(method, url)
      .send(data)
      .set({ Authorization: token })
      .expect(404);
  };
}

export { TestHelper };
