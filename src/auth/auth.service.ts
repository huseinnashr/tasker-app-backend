import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from '../database/repository';
import { SignInDTO, SignInResponseDTO, JwtPayload } from './dto';
import { JwtService } from '@nestjs/jwt';
import { AppService } from '../core/app.service';

@Injectable()
export class AuthService extends AppService {
  constructor(
    @InjectRepository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
    private jwtService: JwtService,
  ) {
    super();
  }

  async signIn(signInDto: SignInDTO): Promise<SignInResponseDTO> {
    const { username, password } = signInDto;
    const employee = await this.employeeRepository.findOne({ username });

    if (!employee || !(await employee.validatePassowrd(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);

    return { ...employee, accessToken };
  }
}
