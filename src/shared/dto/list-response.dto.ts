import { Expose } from 'class-transformer';

export abstract class ListResponseDTO<T> {
  @Expose()
  abstract data: T[];
}
