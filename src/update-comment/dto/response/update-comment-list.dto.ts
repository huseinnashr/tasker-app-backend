import { UpdateCommentDTO } from './update-comment.dto';
import { ListPermissionResponseDTO } from '../../../shared/dto';
import { Type } from 'class-transformer';

export class UpdateCommentListDTO extends ListPermissionResponseDTO<
  UpdateCommentDTO
> {
  @Type(() => UpdateCommentDTO)
  data: UpdateCommentDTO[];
}
