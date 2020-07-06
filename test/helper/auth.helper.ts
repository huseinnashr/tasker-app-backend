import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { EmployeeRepository } from '../../src/employee/employee.repository';
import { Role } from '../../src/employee/role.enum';

interface SignUpDTO {
  username: string;
  role: Role;
}

class AuthHelper {
  private empRepo: EmployeeRepository;
  private jwtService: JwtService;

  constructor(app: INestApplication) {
    this.empRepo = app.get(EmployeeRepository);
    this.jwtService = app.get(JwtService);
  }

  signUp = async (data: SignUpDTO) => {
    const employee = this.empRepo.create(data);
    employee.password = 'SecretPassword1234';
    await this.empRepo.save(employee);
    const accessToken = this.jwtService.sign({ username: employee.username });

    return [`Bearer ${accessToken}`, employee];
  };
}

export { SignUpDTO, AuthHelper };
