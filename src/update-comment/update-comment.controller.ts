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
  PutCommentDTO,
  UpdateCommentEntityDTO,
  UpdateCommentListEntityDTO,
  UpdateCommentListDTO,
  UpdateCommentEPar,
  UpdateCommentRPar,
} from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('project/:projectId/task/:taskId/update/:updateId/comment')
@ApiTags('Project.Task.Update.Comment')
export class UpdateCommentController {
  constructor(private updateCommService: UpdateCommentService) {}

  @Get('/')
  @Auth()
  async getAll(
    @Param() param: UpdateCommentRPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<UpdateCommentListDTO> {
    return this.updateCommService.getAll(param, employee);
  }

  @Post('/')
  @Auth()
  async create(
    @Param() param: UpdateCommentRPar,
    @Body() createDto: CreateCommentDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<UpdateCommentListEntityDTO> {
    return this.updateCommService.create(param, createDto, employee);
  }

  @Get('/:commentId')
  @Auth()
  async get(
    @Param() param: UpdateCommentEPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<UpdateCommentEntityDTO> {
    return this.updateCommService.get(param, employee);
  }

  @Put('/:commentId')
  @Auth()
  async update(
    @Param() param: UpdateCommentEPar,
    @Body() commentDto: PutCommentDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<UpdateCommentListEntityDTO> {
    return this.updateCommService.update(param, commentDto, employee);
  }

  @Delete('/:commentId')
  @Auth()
  async delete(
    @Param() param: UpdateCommentEPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.updateCommService.delete(param, employee);
  }
}
