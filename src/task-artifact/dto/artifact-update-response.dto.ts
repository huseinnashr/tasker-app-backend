import { Expose } from 'class-transformer';

export class ArtifactUpdateResponseDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;
}
