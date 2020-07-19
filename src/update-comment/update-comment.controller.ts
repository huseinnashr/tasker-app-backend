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
import { EmployeeEntity } from '../database/entity';
import {
  CreateCommentDTO,
  UpdateCommentDTO,
  UpdateCommentResponseDTO,
} from './dto';
import { UpdateCommentParamDTO, TaskUpdateParamDTO } from '../shared/dto';

@Controller('project/:projectId/task/:taskId/update/:updateId/comment')
export class UpdateCommentController {
  constructor(private updateCommService: UpdateCommentService) {}

  @Get('/')
  @Auth()
  async getAll(
    @Param() param: TaskUpdateParamDTO,
  ): Promise<UpdateCommentResponseDTO[]> {
    return this.updateCommService.getAll(param);
  }

  @Post('/')
  @Auth()
  async create(
    @Param() param: TaskUpdateParamDTO,
    @Body() createDto: CreateCommentDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<UpdateCommentResponseDTO> {
    return this.updateCommService.create(param, createDto, employee);
  }

  @Get('/:commentId')
  @Auth()
  async get(
    @Param() param: UpdateCommentParamDTO,
  ): Promise<UpdateCommentResponseDTO> {
    return this.updateCommService.get(param);
  }

  @Put('/:commentId')
  @Auth()
  async update(
    @Param() param: UpdateCommentParamDTO,
    @Body() commentDto: UpdateCommentDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<UpdateCommentResponseDTO> {
    return this.updateCommService.update(param, commentDto, employee);
  }

  @Delete('/:commentId')
  @Auth()
  async delete(
    @Param() param: UpdateCommentParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.updateCommService.delete(param, employee);
  }
}
