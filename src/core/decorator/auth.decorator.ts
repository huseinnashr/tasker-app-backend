import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guard/roles.guard';
import { Role } from '../../database/enum';

export function Auth(...roles: Role[]): any {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(), RolesGuard),
  );
}
