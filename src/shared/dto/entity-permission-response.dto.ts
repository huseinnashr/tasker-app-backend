import { Expose, Type } from 'class-transformer';
import { EntityResponseDTO } from './entity-response.dto';

class EntityPermissionDTO {
  @Expose()
  update: boolean;

  @Expose()
  delete: boolean;
}

export abstract class EntityPermissionResponseDTO<T> extends EntityResponseDTO<
  T
> {
  @Expose()
  @Type(() => EntityPermissionDTO)
  permission: EntityPermissionDTO;
}
