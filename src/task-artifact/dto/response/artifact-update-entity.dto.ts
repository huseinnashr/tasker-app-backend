import { ArtifactUpdateDTO } from './artifact-update.dto';
import { Type } from 'class-transformer';
import { EntityResponseDTO } from '../../../shared/dto';

export class ArtifactUpdateEntityDTO extends EntityResponseDTO<
  ArtifactUpdateDTO
> {
  @Type(() => ArtifactUpdateDTO)
  data: ArtifactUpdateDTO;
}
