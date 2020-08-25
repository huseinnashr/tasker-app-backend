import { Expose, Type } from 'class-transformer';
import { ArtifactUpdateDTO } from './artifact-update.dto';

export class TaskArtifactDTO {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  @Type(() => ArtifactUpdateDTO)
  update: ArtifactUpdateDTO | null;
}
