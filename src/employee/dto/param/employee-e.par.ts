import { IsNumberString } from 'class-validator';

export class EmployeeEPar {
  @IsNumberString()
  employeeId: number;
}
