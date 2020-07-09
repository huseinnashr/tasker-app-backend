import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProjectStatus } from '../enum/project-status.enum';
import { Employee } from './employee.entity';
import { Task } from './task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: ProjectStatus;

  @ManyToOne(
    () => Employee,
    employee => employee.managedProject,
    { eager: true },
  )
  manager: Employee;

  @OneToMany(
    () => Task,
    task => task.project,
  )
  tasks: Task;

  isManager(employee: Employee): boolean {
    return this.manager.id === employee.id;
  }
}
