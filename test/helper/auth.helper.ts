import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { EmployeeRepository } from '../../src/database/repository';
import { Role } from '../../src/database/enum';
import { Employee } from '../../src/database/entity';

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

  signUp = async (data: SignUpDTO): Promise<[string, Employee]> => {
    const employee = this.empRepo.create(data);
    employee.password = 'SecretPassword1234';
    await this.empRepo.save(employee);
    const accessToken = this.jwtService.sign({ username: employee.username });

    return [`Bearer ${accessToken}`, employee];
  };
}

export { SignUpDTO, AuthHelper };
