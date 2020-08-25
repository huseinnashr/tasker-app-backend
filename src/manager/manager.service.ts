import { Injectable } from '@nestjs/common';
import { EmployeeRepository, ProjectRepository } from '../database/repository';
import { AppService } from '../core/app.service';
import { ManagerParamDTO, ManagerEntityDTO } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../database/enum';

@Injectable()
export class ManagerService extends AppService {
  constructor(
    @InjectRepository(EmployeeRepository)
    private empRepo: EmployeeRepository,
    @InjectRepository(ProjectRepository)
    private proRepo: ProjectRepository,
  ) {
    super();
  }

  async get(param: ManagerParamDTO): Promise<ManagerEntityDTO> {
    const managerWhere = { id: param.managerId, role: Role.MANAGER };
    const manager = await this.empRepo.findOneOrException(managerWhere);

    const stats = await this.proRepo.getStats(manager);

    return this.transform(ManagerEntityDTO, {
      data: { ...manager, projectStats: stats },
    });
  }
}
