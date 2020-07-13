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
import { ProjectEntity } from './project.entity';
import { TaskEntity } from './task.entity';
import { CommentEntity } from './comment.entity';
import { FileEntity } from './file.entity';

@Entity()
@Unique(['username'])
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Expose({ groups: ['auth', 'employee'] })
  role: Role;

  @OneToMany(
    () => ProjectEntity,
    project => project.manager,
  )
  @Exclude()
  managedProject: ProjectEntity[];

  @OneToMany(
    () => TaskEntity,
    task => task.staff,
  )
  @Exclude()
  assignedTask: TaskEntity[];

  @OneToMany(
    () => CommentEntity,
    comment => comment.creator,
  )
  @Exclude()
  comments: CommentEntity[];

  @OneToMany(
    () => FileEntity,
    file => file.owner,
  )
  @Exclude()
  files: FileEntity[];

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
