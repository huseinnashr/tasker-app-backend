import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Status } from './status.enum';
import { Employee } from '../employee/employee.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: Status;

  @ManyToOne(
    () => Employee,
    employee => employee.managedProject,
    { eager: true },
  )
  manager: Employee;
}
