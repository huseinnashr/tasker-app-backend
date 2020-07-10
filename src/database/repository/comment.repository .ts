import { EntityRepository } from 'typeorm';
import { Comment } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(Comment)
export class CommentRepository extends AppRepository<Comment> {
  constructor() {
    super('Comment');
  }
}
