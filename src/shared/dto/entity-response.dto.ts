import { Expose, Type } from 'class-transformer';
import { EntityPermissionResponseDTO } from './entity-permission-response.dto';

export abstract class EntityResponseDTO<T> {
  abstract data: T;

  @Expose()
  @Type(() => EntityPermissionResponseDTO)
  permission: EntityPermissionResponseDTO;
}
