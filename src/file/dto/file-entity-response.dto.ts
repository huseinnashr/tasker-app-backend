import { EntityResponseDTO } from '../../shared/dto';
import { FileResponseDTO } from './file-response.dto';
import { Type } from 'class-transformer';

export class FileEntityResponseDTO extends EntityResponseDTO<FileResponseDTO> {
  @Type(() => FileResponseDTO)
  data: FileResponseDTO;
}
