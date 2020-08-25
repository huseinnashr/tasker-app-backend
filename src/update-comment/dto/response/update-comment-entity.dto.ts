import { UpdateCommentDTO } from './update-comment.dto';
import { EntityPermissionResponseDTO } from '../../../shared/dto';
import { Type } from 'class-transformer';

export class UpdateCommentEntityDTO extends EntityPermissionResponseDTO<
  UpdateCommentDTO
> {
  @Type(() => UpdateCommentDTO)
  data: UpdateCommentDTO;
}
