import { IsNumberString } from 'class-validator';
import { TaskUpdateRPar } from './task-update-r.par';

export class TaskUpdateEPar extends TaskUpdateRPar {
  @IsNumberString()
  updateId: number;
}
