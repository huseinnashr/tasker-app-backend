import { Controller, Param, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { Auth } from '../core/decorator';
import { ManagerParamDTO, ManagerEntityDTO } from './dto';

@Controller('manager')
@ApiTags('Manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @Get('/:managerId')
  @Auth()
  async get(@Param() param: ManagerParamDTO): Promise<ManagerEntityDTO> {
    return this.managerService.get(param);
  }
}
