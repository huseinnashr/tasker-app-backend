import { Expose } from 'class-transformer';

export class TaskArtifactResponseDTO {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  update?: {
    id: number;
    title: string;
  };
}
