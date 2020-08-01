import { Expose, Type } from 'class-transformer';
import { ListPermissionResponseDTO } from './list-permission-response.dto';

export abstract class ListResponseDTO<T> {
  abstract data: T[];

  @Expose()
  @Type(() => ListPermissionResponseDTO)
  permission: ListPermissionResponseDTO;
}
