import { Controller, Param, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { CurrentEmployee, Auth } from '../core/decorator';
import { ManagerParamDTO, ManagerEntityDTO } from './dto';
import { EmployeeEntity } from '../database/entity';

@Controller('manager')
@ApiTags('Manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @Get('/:managerId')
  @Auth()
  async get(
    @Param() param: ManagerParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ManagerEntityDTO> {
    return this.managerService.get(param, employee);
  }
}
