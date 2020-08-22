import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { EmployeeRepository } from '../../src/database/repository';
import { Role } from '../../src/database/enum';
import { EmployeeEntity } from '../../src/database/entity';
import { EmployeeFactory } from '../seeding/factory';

interface SignUpDTO {
  username?: string;
  password?: string;
  role: Role;
}

class AuthHelper {
  private empFactory: EmployeeFactory;
  private empRepo: EmployeeRepository;
  private jwtService: JwtService;

  /** Employee creation helper. This helper uses increment username to avoid conflict.
   * Please keep this to only an instance per db truncate
   */
  constructor(app: INestApplication) {
    this.empRepo = app.get(EmployeeRepository);
    this.jwtService = app.get(JwtService);
    this.empFactory = new EmployeeFactory();
  }

  signUp = async (data: SignUpDTO): Promise<[string, EmployeeEntity]> => {
    const employee = this.empFactory.makeOne(data);

    await this.empRepo.save(employee);
    const accessToken = this.jwtService.sign({ username: employee.username });

    return [`Bearer ${accessToken}`, employee];
  };
}

export { SignUpDTO, AuthHelper };
