import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Role } from '../database/enum';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListDTO,
  EmployeeListEntityDTO,
  EmployeeEntityDTO,
  ProfilePictureUploadDTO,
  ProfilePictureEntityDTO,
} from './dto';
import { Auth, CurrentEmployee } from '../core/decorator';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { EmployeeEntity } from '../database/entity';
import { MulterFile } from '../core/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureMulter } from './config';

@Controller('employee')
@ApiTags('Administration')
export class EmployeeController {
  constructor(private empService: EmployeeService) {}

  @Get('/')
  @Auth(Role.ADMIN)
  async getAll(
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<EmployeeListDTO> {
    return this.empService.getAll(employee);
  }

  @Post('/')
  @Auth(Role.ADMIN)
  async create(
    @Body() createDto: CreateEmployeeDTO,
  ): Promise<EmployeeListEntityDTO> {
    return this.empService.create(createDto);
  }

  @Get('/:id')
  @Auth(Role.ADMIN)
  async get(
    @Param('id') id: number,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<EmployeeEntityDTO> {
    return this.empService.get(id, employee);
  }

  @Put('/:id')
  @Auth(Role.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() employee: UpdateEmployeeDTO,
  ): Promise<EmployeeListEntityDTO> {
    return this.empService.update(id, employee);
  }

  @Delete('/:id')
  @Auth(Role.ADMIN)
  async delete(@Param('id') id: number): Promise<void> {
    return this.empService.delete(id);
  }

  @Post('/profile-picture')
  @Auth()
  @UseInterceptors(FileInterceptor('profilePicture', ProfilePictureMulter))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ProfilePictureUploadDTO })
  uploadProfilePicture(
    @UploadedFile() uploadedFile: MulterFile,
  ): ProfilePictureEntityDTO {
    return this.empService.uploadProfilePicture(uploadedFile);
  }
}
