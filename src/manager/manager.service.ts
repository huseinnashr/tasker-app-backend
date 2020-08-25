import { Injectable } from '@nestjs/common';
import { EmployeeRepository, ProjectRepository } from '../database/repository';
import { AppService } from '../core/app.service';
import { ManagerParamDTO, ManagerEntityDTO } from './dto';
import { EmployeeEntity } from '../database/entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  async get(
    param: ManagerParamDTO,
    emp: EmployeeEntity,
  ): Promise<ManagerEntityDTO> {
    const manager = await this.empRepo.findOneOrException({
      id: param.managerId,
    });

    return this.transform(ManagerEntityDTO, {
      data: manager,
    });
  }
}
