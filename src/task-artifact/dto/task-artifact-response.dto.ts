import { Expose, Type } from 'class-transformer';
import { ArtifactUpdateResponseDTO } from './artifact-update-response.dto';

export class TaskArtifactResponseDTO {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  @Type(() => ArtifactUpdateResponseDTO)
  update: ArtifactUpdateResponseDTO | null;
}
