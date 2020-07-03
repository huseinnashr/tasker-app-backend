import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../employee/employee.repository';
import { SignInDTO } from './auth.dto';
import { Employee } from '../employee/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
  ) {}

  async signIn(signInDto: SignInDTO): Promise<Employee> {
    const { username, password } = signInDto;
    const employee = await this.employeeRepository.findOne({ username });

    if (!employee || !(await employee.validatePassowrd(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return employee;
  }
}
