import { EntityPermissionResponseDTO } from '../../shared/dto';
import { EmployeeResponseDTO } from './employee-response.dto';
import { Type } from 'class-transformer';

export class EmployeeEntityResponseDTO extends EntityPermissionResponseDTO<
  EmployeeResponseDTO
> {
  @Type(() => EmployeeResponseDTO)
  data: EmployeeResponseDTO;
}
