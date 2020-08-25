import { EntityResponseDTO } from '../../../shared/dto';
import { EmployeeDTO } from './employee.dto';
import { Type } from 'class-transformer';

export class EmployeeListEntityDTO extends EntityResponseDTO<EmployeeDTO> {
  @Type(() => EmployeeDTO)
  data: EmployeeDTO;
}
