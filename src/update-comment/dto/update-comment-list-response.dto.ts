import { UpdateCommentResponseDTO } from './update-comment-response.dto';
import { ListPermissionResponseDTO } from '../../shared/dto';
import { Type } from 'class-transformer';

export class UpdateCommentListResponseDTO extends ListPermissionResponseDTO<
  UpdateCommentResponseDTO
> {
  @Type(() => UpdateCommentResponseDTO)
  data: UpdateCommentResponseDTO[];
}
