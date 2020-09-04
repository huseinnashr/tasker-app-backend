import { IsNumberString } from 'class-validator';
import { ManagerProjectRPar } from './manager-project-r.par';

export class ManagerProjectEPar extends ManagerProjectRPar {
  @IsNumberString()
  projectId: number;
}
