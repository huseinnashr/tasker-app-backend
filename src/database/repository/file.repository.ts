import { EntityRepository } from 'typeorm';
import { FileEntity } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(FileEntity)
export class FileRepository extends AppRepository<FileEntity> {
  constructor() {
    super('File');
  }
}
