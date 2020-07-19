import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { EmployeeRepository } from '../../src/database/repository';
import { Role } from '../../src/database/enum';
import { EmployeeEntity } from '../../src/database/entity';

interface SignUpDTO {
  username?: string;
  password?: string;
  role: Role;
}

class AuthHelper {
  private empRepo: EmployeeRepository;
  private jwtService: JwtService;

  private employeeCounter = 0;

  /** Employee creation helper. This helper uses increment username to avoid conflict.
   * Please keep this to only an instance per db truncate
   */
  constructor(app: INestApplication) {
    this.empRepo = app.get(EmployeeRepository);
    this.jwtService = app.get(JwtService);
  }

  signUp = async (data: SignUpDTO): Promise<[string, EmployeeEntity]> => {
    this.employeeCounter += 1;
    let { username, password } = data;

    username = username ? username : 'employee' + this.employeeCounter;
    password = password ? password : 'SecretPassword1234';

    const employee = this.empRepo.create({ ...data, username, password });

    await this.empRepo.save(employee);
    const accessToken = this.jwtService.sign({ username: employee.username });

    return [`Bearer ${accessToken}`, employee];
  };
}

export { SignUpDTO, AuthHelper };
