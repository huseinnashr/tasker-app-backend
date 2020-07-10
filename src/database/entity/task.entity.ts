import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TaskStatus } from '../enum/task-status.enum';
import { Employee } from './employee.entity';
import { Project } from './project.entity';
import { Exclude } from 'class-transformer';
import { Update } from './update.entity';

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

  @OneToMany(
    () => Update,
    update => update.task,
  )
  @Exclude()
  updates: Update[];

  isStaff(employee: Employee): boolean {
    return this.staff.id === employee.id;
  }
}
