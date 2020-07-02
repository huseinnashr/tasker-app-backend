import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../employee/employee.repository';
import { SignInDto } from './dto/sign-in.dto';
import { Employee } from '../employee/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
  ) {}

  async signIn(signInDto: SignInDto): Promise<Employee> {
    const { username, password } = signInDto;
    const employee = await this.employeeRepository.findOne({ username });

    if (!employee || !(await employee.validatePassowrd(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return employee;
  }
}
