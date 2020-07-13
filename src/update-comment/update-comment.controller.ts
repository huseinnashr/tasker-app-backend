import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UpdateCommentService } from './update-comment.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { CommentEntity, EmployeeEntity } from '../database/entity';
import { CreateCommentDTO, UpdateCommentDTO } from './dto';

@Controller('update/:updateId/comment')
export class UpdateCommentController {
  constructor(private updateCommService: UpdateCommentService) {}

  @Get('/')
  @Auth()
  async getAll(@Param('updateId') updateId: number): Promise<CommentEntity[]> {
    return this.updateCommService.getAll(updateId);
  }

  @Post('/')
  @Auth()
  async create(
    @Param('updateId') updateId: number,
    @Body() createDto: CreateCommentDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<CommentEntity> {
    return this.updateCommService.create(updateId, createDto, employee);
  }

  @Get('/:commentId')
  @Auth()
  async get(
    @Param('updateId') updateId: number,
    @Param('commentId') commentId: number,
  ): Promise<CommentEntity> {
    return this.updateCommService.get(updateId, commentId);
  }

  @Put('/:commentId')
  @Auth()
  async update(
    @Param('updateId') updateId: number,
    @Param('commentId') commentId: number,
    @Body() commentDto: UpdateCommentDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<CommentEntity> {
    return this.updateCommService.update(
      updateId,
      commentId,
      commentDto,
      employee,
    );
  }

  @Delete('/:commentId')
  @Auth()
  async delete(
    @Param('updateId') updateId: number,
    @Param('commentId') commentId: number,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.updateCommService.delete(updateId, commentId, employee);
  }
}
