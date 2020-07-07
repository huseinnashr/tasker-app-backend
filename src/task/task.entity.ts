import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Employee } from '../employee/employee.entity';
import { Project } from '../project/project.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    () => Employee,
    employee => employee.managedProject,
    { eager: true },
  )
  staff: Employee;

  @ManyToOne(
    () => Project,
    project => project.tasks,
  )
  project: Project;
}
