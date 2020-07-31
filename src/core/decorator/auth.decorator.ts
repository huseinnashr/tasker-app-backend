import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guard/roles.guard';
import { Role } from '../../database/enum';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
  UnauthorizedResponseDTO,
  ForbiddenResponseDTO,
} from '../../shared/dto';

export function Auth(...roles: Role[]): any {
  const decorators = [
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ type: UnauthorizedResponseDTO }),
    SetMetadata('roles', roles),
  ];
  const guards: any[] = [AuthGuard()];

  if (roles.length > 0) {
    decorators.push(ApiForbiddenResponse({ type: ForbiddenResponseDTO }));
    guards.push(RolesGuard);
  }

  decorators.push(UseGuards(...guards));

  return applyDecorators(...decorators);
}
