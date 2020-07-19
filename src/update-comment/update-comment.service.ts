import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from '../core/app.service';
import { CommentEntity, EmployeeEntity } from '../database/entity';
import {
  CreateCommentDTO,
  UpdateCommentDTO,
  UpdateCommentResponseDTO,
} from './dto';
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

  async getAll(param: TaskUpdateParamDTO): Promise<UpdateCommentResponseDTO[]> {
    const update = await this.updateRepo.findOneOrException(param.updateId);
    const comments = await this.commentRepo.find({ where: { update } });

    return this.transform(UpdateCommentResponseDTO, comments);
  }

  async create(
    param: TaskUpdateParamDTO,
    createDto: CreateCommentDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateCommentResponseDTO> {
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

    await this.commentRepo.save(comment);

    return this.transform(UpdateCommentResponseDTO, comment);
  }

  async get(param: UpdateCommentParamDTO): Promise<UpdateCommentResponseDTO> {
    const comment = await this.commentRepo.findOneOrException({
      id: param.commentId,
      update: { id: param.updateId },
    });

    return this.transform(UpdateCommentResponseDTO, comment);
  }

  async update(
    param: UpdateCommentParamDTO,
    commentDto: UpdateCommentDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateCommentResponseDTO> {
    const where = { id: param.commentId, update: { id: param.updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(comment.isCreator(employee), 'Comment');

    comment.body = commentDto.body;

    await this.commentRepo.save(comment);

    return this.transform(UpdateCommentResponseDTO, comment);
  }

  async delete(
    param: UpdateCommentParamDTO,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: param.commentId, update: { id: param.updateId } };
    const comment = await this.commentRepo.findOneOrException(where);

    this.canManage(comment.isCreator(employee), 'Comment');

    await this.commentRepo.remove(comment);
  }
}
