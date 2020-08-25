import { UpdateCommentDTO } from './update-comment.dto';
import { Type } from 'class-transformer';
import { EntityResponseDTO } from '../../shared/dto';

export class UpdateCommentListEntityDTO extends EntityResponseDTO<
  UpdateCommentDTO
> {
  @Type(() => UpdateCommentDTO)
  data: UpdateCommentDTO;
}
