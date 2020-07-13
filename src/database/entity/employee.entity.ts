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
import { Comment } from './comment.entity';
import { File } from './file.entity';

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
  @Exclude()
  managedProject: Project[];

  @OneToMany(
    () => Task,
    task => task.staff,
  )
  @Exclude()
  assignedTask: Task[];

  @OneToMany(
    () => Comment,
    comment => comment.creator,
  )
  @Exclude()
  comments: Comment[];

  @OneToMany(
    () => File,
    file => file.owner,
  )
  @Exclude()
  files: File[];

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
