import { IsNumberString } from 'class-validator';

export class ManagerProjectRPar {
  @IsNumberString()
  managerId: number;
}
