import { Expose } from 'class-transformer';

export abstract class EntityResponseDTO<T> {
  @Expose()
  abstract data: T;
}
