import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EmployeeEntity } from '../../database/entity';
import { Role } from '../../database/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const employee: EmployeeEntity = request.user;
    const can = roles.includes(employee.role);

    if (!can) throw new ForbiddenException("You don't have the permission");

    return can;
  }
}
