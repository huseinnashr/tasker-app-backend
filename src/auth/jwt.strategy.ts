import env from 'ts-get-env';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { EmployeeRepository } from '../employee/employee.repository';
import { Employee } from '../employee/employee.entity';
import { JwtPayload } from './auth.dto';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(EmployeeRepository)
    private empRepo: EmployeeRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.get('string', 'JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<Employee> {
    const { username } = payload;
    const employee = await this.empRepo.findOne({ username });

    if (!employee) {
      throw new UnauthorizedException();
    }

    return employee;
  }
}
