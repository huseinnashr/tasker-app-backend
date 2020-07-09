import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '../enum/role.enum';
import { Project } from './project.entity';
import { Task } from './task.entity';

@Entity()
@Unique(['username'])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Expose({ groups: ['auth', 'employee'] })
  role: Role;

  @OneToMany(
    () => Project,
    project => project.manager,
  )
  managedProject: Project[];

  @OneToMany(
    () => Task,
    task => task.staff,
  )
  assignedTask: Task[];

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  async validatePassowrd(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
