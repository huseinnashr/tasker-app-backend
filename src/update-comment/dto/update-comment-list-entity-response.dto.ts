import { UpdateCommentResponseDTO } from './update-comment-response.dto';
import { Type } from 'class-transformer';
import { EntityResponseDTO } from '../../shared/dto';

export class UpdateCommentListEntityResponseDTO extends EntityResponseDTO<
  UpdateCommentResponseDTO
> {
  @Type(() => UpdateCommentResponseDTO)
  data: UpdateCommentResponseDTO;
}
