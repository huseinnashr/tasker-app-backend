import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from '../core/app.service';
import { Comment, Employee } from '../database/entity';
import { CreateCommentDTO, UpdateCommentDTO } from './dto';
import { UpdateRepository, CommentRepository } from '../database/repository';

@Injectable()
export class UpdateCommentService extends AppService {
  constructor(
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
    @InjectRepository(CommentRepository) private commentRepo: CommentRepository,
  ) {
    super();
  }

  async getAll(updateId: number): Promise<Comment[]> {
    const update = await this.updateRepo.findOneOrException(updateId);
    return this.commentRepo.find({ where: { update } });
  }

  async create(
    updateId: number,
    createDto: CreateCommentDTO,
    employee: Employee,
  ): Promise<Comment> {
    const update = await this.updateRepo.findOneOrException(updateId, {
      relations: ['task', 'task.project'],
    });

    const can =
      update.task.isStaff(employee) || update.task.project.isManager(employee);
    this.canManage(can, 'Update');

    const comment = new Comment();
    comment.body = createDto.body;
    comment.update = update;
    comment.creator = employee;

    return this.commentRepo.save(comment);
  }

  async get(updateId: number, commentId: number): Promise<Comment> {
    return this.commentRepo.findOneOrException({
      id: commentId,
      update: { id: updateId },
    });
  }

  async update(
    updateId: number,
    commentId: number,
    commentDto: UpdateCommentDTO,
    employee: Employee,
  ): Promise<Comment> {
    const where = { id: commentId, update: { id: updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(comment.isCreator(employee), 'Comment');

    comment.body = commentDto.body;

    return this.commentRepo.save(comment);
  }

  async delete(
    updateId: number,
    commentId: number,
    employee: Employee,
  ): Promise<void> {
    const where = { id: commentId, update: { id: updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(comment.isCreator(employee), 'Comment');

    await this.commentRepo.delete(comment);
  }
}
