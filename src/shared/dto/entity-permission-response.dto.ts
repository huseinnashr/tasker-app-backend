import { Expose } from 'class-transformer';

export class EntityPermissionResponseDTO {
  @Expose()
  update: boolean;

  @Expose()
  delete: boolean;
}
