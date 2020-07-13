import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EmployeeEntity } from '../../database/entity';

export const CurrentEmployee = createParamDecorator(
  (_, ctx: ExecutionContext): EmployeeEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
