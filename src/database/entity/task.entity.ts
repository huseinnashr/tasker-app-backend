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
import { Exclude } from 'class-transformer';
import { UpdateEntity } from './update.entity';

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
    { eager: true },
  )
  staff: EmployeeEntity;

  @ManyToOne(
    () => ProjectEntity,
    project => project.tasks,
  )
  @Exclude()
  project: ProjectEntity;

  @OneToMany(
    () => UpdateEntity,
    update => update.task,
  )
  @Exclude()
  updates: UpdateEntity[];

  isStaff(employee: EmployeeEntity): boolean {
    return this.staff.id === employee.id;
  }
}
