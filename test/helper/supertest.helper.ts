import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

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

export { HTTPMethod, SupertestHelper };
