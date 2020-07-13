import { EntityRepository } from 'typeorm';
import { CommentEntity } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(CommentEntity)
export class CommentRepository extends AppRepository<CommentEntity> {
  constructor() {
    super('Comment');
  }
}
