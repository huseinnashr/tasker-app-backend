import { EntityRepository } from 'typeorm';
import { File } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(File)
export class FileRepository extends AppRepository<File> {
  constructor() {
    super('File');
  }
}
