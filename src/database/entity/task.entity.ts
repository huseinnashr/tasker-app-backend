import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from '../enum/task-status.enum';
import { Employee } from './employee.entity';
import { Project } from './project.entity';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  project: Project;
}
