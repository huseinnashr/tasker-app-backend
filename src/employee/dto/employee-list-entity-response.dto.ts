import { EntityResponseDTO } from '../../shared/dto';
import { EmployeeResponseDTO } from './employee-response.dto';
import { Type } from 'class-transformer';

export class EmployeeListEntityResponseDTO extends EntityResponseDTO<
  EmployeeResponseDTO
> {
  @Type(() => EmployeeResponseDTO)
  data: EmployeeResponseDTO;
}
