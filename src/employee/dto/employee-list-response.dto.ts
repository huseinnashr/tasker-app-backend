import { ListPermissionResponseDTO } from '../../shared/dto';
import { EmployeeResponseDTO } from './employee-response.dto';
import { Type } from 'class-transformer';

export class EmployeeListResponseDTO extends ListPermissionResponseDTO<
  EmployeeResponseDTO
> {
  @Type(() => EmployeeResponseDTO)
  data: EmployeeResponseDTO[];
}
