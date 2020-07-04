import { SetMetadata } from '@nestjs/common';
import { Role } from '../employee/role.enum';

export const Roles = (...roles: Role[]): any => SetMetadata('roles', roles);
