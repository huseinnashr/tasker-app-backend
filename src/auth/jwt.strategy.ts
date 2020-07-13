import env from 'ts-get-env';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { EmployeeRepository } from '../database/repository';
import { EmployeeEntity } from '../database/entity';
import { JwtPayload } from './dto';

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

  async validate(payload: JwtPayload): Promise<EmployeeEntity> {
    const { username } = payload;
    const employee = await this.empRepo.findOne({ username });

    if (!employee) {
      throw new UnauthorizedException('You are not logged in!');
    }

    return employee;
  }
}
