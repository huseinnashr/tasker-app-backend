import { Expose } from 'class-transformer';

export class ListPermissionResponseDTO {
  @Expose()
  create: boolean;
}
