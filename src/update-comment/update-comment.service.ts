import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from '../core/app.service';
import { CommentEntity, EmployeeEntity } from '../database/entity';
import {
  CreateCommentDTO,
  PutCommentDTO,
  UpdateCommentListDTO,
  UpdateCommentListEntityDTO,
  UpdateCommentEntityDTO,
  UpdateCommentRPar,
  UpdateCommentEPar,
} from './dto';
import { UpdateRepository, CommentRepository } from '../database/repository';
import { CommentPermission } from '../shared/permission';

@Injectable()
export class UpdateCommentService extends AppService {
  constructor(
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
    @InjectRepository(CommentRepository) private commentRepo: CommentRepository,
    private commentPermission: CommentPermission,
  ) {
    super();
  }

  async getAll(
    param: UpdateCommentRPar,
    employee: EmployeeEntity,
  ): Promise<UpdateCommentListDTO> {
    const where = param.updateId;
    const options = { relations: ['task', 'task.project'] };
    const update = await this.updateRepo.findOneOrException(where, options);

    const comments = await this.commentRepo.find({ where: { update } });

    return this.transform(UpdateCommentListDTO, {
      data: comments,
      permission: this.commentPermission.getList(update, employee),
    });
  }

  async create(
    param: UpdateCommentRPar,
    createDto: CreateCommentDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateCommentListEntityDTO> {
    const where = param.updateId;
    const options = { relations: ['task', 'task.project'] };
    const update = await this.updateRepo.findOneOrException(where, options);

    const can = this.commentPermission.create(update, employee);
    this.canManage(can, 'Update');

    const comment = new CommentEntity();
    comment.body = createDto.body;
    comment.update = update;
    comment.creator = employee;

    await this.commentRepo.save(comment);

    return this.transform(UpdateCommentListEntityDTO, {
      data: comment,
    });
  }

  async get(
    param: UpdateCommentEPar,
    employee: EmployeeEntity,
  ): Promise<UpdateCommentEntityDTO> {
    const comment = await this.commentRepo.findOneOrException({
      id: param.commentId,
      update: { id: param.updateId },
    });

    return this.transform(UpdateCommentEntityDTO, {
      data: comment,
      permission: this.commentPermission.getEntity(comment, employee),
    });
  }

  async update(
    param: UpdateCommentEPar,
    commentDto: PutCommentDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateCommentListEntityDTO> {
    const where = { id: param.commentId, update: { id: param.updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(this.commentPermission.update(comment, employee), 'Comment');

    comment.body = commentDto.body;

    await this.commentRepo.save(comment);

    return this.transform(UpdateCommentListEntityDTO, {
      data: comment,
    });
  }

  async delete(
    param: UpdateCommentEPar,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: param.commentId, update: { id: param.updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(this.commentPermission.update(comment, employee), 'Comment');

    await this.commentRepo.remove(comment);
  }
}
