import { EntityRepository } from 'typeorm';
import { ProjectEntity, EmployeeEntity } from '../entity';
import { AppRepository } from '../../core/app.repository';
import { ManagerProjectStatsDTO } from '../../manager/dto';
import { TaskStatus } from '../enum';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends AppRepository<ProjectEntity> {
  constructor() {
    super('Project');
  }

  async getStats(manager: EmployeeEntity): Promise<ManagerProjectStatsDTO> {
    return this.createQueryBuilder('project')
      .select('COUNT(*)', 'total')
      .addSelect(
        `SUM(CASE WHEN status = '${TaskStatus.DONE}' THEN 1 ELSE 0 END)`,
        'completed',
      )
      .where('managerId = :managerId', { managerId: manager.id })
      .getRawOne<ManagerProjectStatsDTO>();
  }
}
