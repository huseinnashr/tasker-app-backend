import { ArtifactUpdateResponseDTO } from './artifact-update-response.dto';
import { Type } from 'class-transformer';
import { EntityResponseDTO } from '../../shared/dto';

export class ArtifactUpdateEntityResponseDTO extends EntityResponseDTO<
  ArtifactUpdateResponseDTO
> {
  @Type(() => ArtifactUpdateResponseDTO)
  data: ArtifactUpdateResponseDTO;
}
