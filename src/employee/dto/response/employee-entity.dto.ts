import { EntityPermissionResponseDTO } from '../../../shared/dto';
import { EmployeeDTO } from './employee.dto';
import { Type } from 'class-transformer';

export class EmployeeEntityDTO extends EntityPermissionResponseDTO<
  EmployeeDTO
> {
  @Type(() => EmployeeDTO)
  data: EmployeeDTO;
}
