import { UpdateCommentResponseDTO } from './update-comment-response.dto';
import { EntityPermissionResponseDTO } from '../../shared/dto';
import { Type } from 'class-transformer';

export class UpdateCommentEntityResponseDTO extends EntityPermissionResponseDTO<
  UpdateCommentResponseDTO
> {
  @Type(() => UpdateCommentResponseDTO)
  data: UpdateCommentResponseDTO;
}
