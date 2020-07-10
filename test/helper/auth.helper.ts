import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { EmployeeRepository } from '../../src/database/repository';
import { Role } from '../../src/database/enum';
import { Employee } from '../../src/database/entity';

interface SignUpDTO {
  username?: string;
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

  signUp = async (data: SignUpDTO): Promise<[string, Employee]> => {
    this.employeeCounter += 1;
    let { username } = data;
    if (!username) {
      username = 'employee' + this.employeeCounter;
    }
    const employee = this.empRepo.create({ ...data, username });
    employee.password = 'SecretPassword1234';
    await this.empRepo.save(employee);
    const accessToken = this.jwtService.sign({ username: employee.username });

    return [`Bearer ${accessToken}`, employee];
  };
}

export { SignUpDTO, AuthHelper };
