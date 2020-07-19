import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TaskStatus } from '../enum/task-status.enum';
import { EmployeeEntity } from './employee.entity';
import { ProjectEntity } from './project.entity';
import { UpdateEntity } from './update.entity';
import { ArtifactEntity } from '.';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    () => EmployeeEntity,
    employee => employee.managedProject,
    { eager: true, onDelete: 'CASCADE' },
  )
  staff: EmployeeEntity;

  @ManyToOne(
    () => ProjectEntity,
    project => project.tasks,
    { onDelete: 'CASCADE' },
  )
  project: ProjectEntity;

  @OneToMany(
    () => UpdateEntity,
    update => update.task,
  )
  updates: UpdateEntity[];

  @OneToMany(
    () => ArtifactEntity,
    artifact => artifact.task,
  )
  artifacts: ArtifactEntity[];

  isStaff(employee: EmployeeEntity): boolean {
    return this.staff.id === employee.id;
  }
}
