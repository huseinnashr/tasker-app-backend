import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from '../core/app.service';
import { CommentEntity, EmployeeEntity } from '../database/entity';
import { CreateCommentDTO, UpdateCommentDTO } from './dto';
import { UpdateRepository, CommentRepository } from '../database/repository';
import { UpdateCommentParamDTO, TaskUpdateParamDTO } from '../shared/dto';

@Injectable()
export class UpdateCommentService extends AppService {
  constructor(
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
    @InjectRepository(CommentRepository) private commentRepo: CommentRepository,
  ) {
    super();
  }

  async getAll(param: TaskUpdateParamDTO): Promise<CommentEntity[]> {
    const update = await this.updateRepo.findOneOrException(param.updateId);
    return this.commentRepo.find({ where: { update } });
  }

  async create(
    param: TaskUpdateParamDTO,
    createDto: CreateCommentDTO,
    employee: EmployeeEntity,
  ): Promise<CommentEntity> {
    const update = await this.updateRepo.findOneOrException(param.updateId, {
      relations: ['task', 'task.project'],
    });

    const can =
      update.task.isStaff(employee) || update.task.project.isManager(employee);
    this.canManage(can, 'Update');

    const comment = new CommentEntity();
    comment.body = createDto.body;
    comment.update = update;
    comment.creator = employee;

    return this.commentRepo.save(comment);
  }

  async get(param: UpdateCommentParamDTO): Promise<CommentEntity> {
    return this.commentRepo.findOneOrException({
      id: param.commentId,
      update: { id: param.updateId },
    });
  }

  async update(
    param: UpdateCommentParamDTO,
    commentDto: UpdateCommentDTO,
    employee: EmployeeEntity,
  ): Promise<CommentEntity> {
    const where = { id: param.commentId, update: { id: param.updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(comment.isCreator(employee), 'Comment');

    comment.body = commentDto.body;

    return this.commentRepo.save(comment);
  }

  async delete(
    param: UpdateCommentParamDTO,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: param.commentId, update: { id: param.updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(comment.isCreator(employee), 'Comment');

    await this.commentRepo.delete({ id: comment.id });
  }
}
