import { Expose } from 'class-transformer';

export class ArtifactUpdateDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;
}
