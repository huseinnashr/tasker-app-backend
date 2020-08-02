import { Expose, Type } from 'class-transformer';
import { ListResponseDTO } from './list-response.dto';

class ListPermissionDTO {
  @Expose()
  create: boolean;
}

export abstract class ListPermissionResponseDTO<T> extends ListResponseDTO<T> {
  @Expose()
  @Type(() => ListPermissionDTO)
  permission: ListPermissionDTO;
}
