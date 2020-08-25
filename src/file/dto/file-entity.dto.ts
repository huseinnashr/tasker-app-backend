import { EntityResponseDTO } from '../../shared/dto';
import { FileDTO } from './file.dto';
import { Type } from 'class-transformer';

export class FileEntityDTO extends EntityResponseDTO<FileDTO> {
  @Type(() => FileDTO)
  data: FileDTO;
}
