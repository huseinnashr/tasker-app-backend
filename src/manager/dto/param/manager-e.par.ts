import { IsNumberString } from 'class-validator';

export class ManagerEntityPar {
  @IsNumberString()
  managerId: number;
}
