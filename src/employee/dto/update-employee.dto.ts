import { IsOptional } from 'class-validator';
import { ManageEmployeeDTO } from './manage-employee.dto';

export class UpdateEmployeeDTO extends ManageEmployeeDTO {
  @IsOptional()
  password?: string;
}
