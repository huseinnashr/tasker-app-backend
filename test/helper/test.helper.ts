import { Role } from '../../src/database/enum';
import { INestApplication } from '@nestjs/common';
import { SupertestHelper, HTTPMethod } from './supertest.helper';
import { AuthHelper } from './auth.helper';
import { Response } from 'supertest';

class TestHelper {
  private auth: AuthHelper;
  private supertest: SupertestHelper;

  constructor(app: INestApplication, auth: AuthHelper) {
    this.auth = auth;
    this.supertest = new SupertestHelper(app);
  }

  unauthorized = async (method: HTTPMethod, url: string): Promise<void> => {
    const message = 'Expect 401 Unauthorized when not logged in';
    await this.should(401, message, '', method, url);
  };

  /** Create new employee with role R and test if endpoint forbid role R employee.*/
  async forbidden(role: Role, method: HTTPMethod, url: string): Promise<void> {
    const message = 'Expect 403 Forbidden for role: ' + role;

    const [token] = await this.auth.signUp({ role });

    await this.should(403, message, token, method, url);
  }

  /** Use token with correct role to test if endpoint returns not found.*/
  async notfound(
    token: string,
    method: HTTPMethod,
    url: string,
    data?: any,
  ): Promise<void> {
    const message = `Expect 404 Not Found on endpoint: ${url} (${method})`;

    await this.should(404, message, token, method, url, data);
  }

  async should(
    httpCode: number,
    message: string,
    token: string,
    method: HTTPMethod,
    url: string,
    data?: any,
  ): Promise<Response> {
    const res = await this.supertest
      .request(method, url)
      .send(data)
      .set({ Authorization: token });

    if (res.status != httpCode) {
      const returned =
        '. It returned ' +
        (res.error ? `${res.body.statusCode} ${res.body.message}` : '200 OK');
      fail(new Error(message + returned));
    }

    return res;
  }
}

export { TestHelper };
