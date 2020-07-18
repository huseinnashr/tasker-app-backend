import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProjectStatus } from '../enum/project-status.enum';
import { EmployeeEntity } from './employee.entity';
import { TaskEntity } from './task.entity';

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: ProjectStatus;

  @ManyToOne(
    () => EmployeeEntity,
    employee => employee.managedProject,
    { eager: true, onDelete: 'CASCADE' },
  )
  manager: EmployeeEntity;

  @OneToMany(
    () => TaskEntity,
    task => task.project,
  )
  tasks: TaskEntity[];

  isManager(employee: EmployeeEntity): boolean {
    return this.manager.id === employee.id;
  }
}
