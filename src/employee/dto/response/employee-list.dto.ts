import { ListPermissionResponseDTO } from '../../../shared/dto';
import { EmployeeDTO } from './employee.dto';
import { Type } from 'class-transformer';

export class EmployeeListDTO extends ListPermissionResponseDTO<EmployeeDTO> {
  @Type(() => EmployeeDTO)
  data: EmployeeDTO[];
}
