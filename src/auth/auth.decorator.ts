import {
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Employee } from '../employee/employee.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Role } from '../employee/role.enum';

export const CurrentEmployee = createParamDecorator(
  (_, ctx: ExecutionContext): Employee => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export function Auth(...roles: Role[]): any {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(), RolesGuard),
  );
}
