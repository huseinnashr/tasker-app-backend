import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Employee } from '../employee/employee.entity';

export const CurrentEmployee = createParamDecorator(
  (_, ctx: ExecutionContext): Employee => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
