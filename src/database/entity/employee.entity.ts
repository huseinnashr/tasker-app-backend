import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enum/role.enum';
import { ProjectEntity } from './project.entity';
import { TaskEntity } from './task.entity';
import { CommentEntity } from './comment.entity';
import { FileEntity } from './file.entity';

@Entity()
@Unique(['username', 'email'])
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  role: Role;

  @Column()
  email: string;

  @Column({ name: 'profile-picture' })
  profilePicture: string;

  @OneToMany(
    () => ProjectEntity,
    project => project.manager,
  )
  managedProject: ProjectEntity[];

  @OneToMany(
    () => TaskEntity,
    task => task.staff,
  )
  assignedTask: TaskEntity[];

  @OneToMany(
    () => CommentEntity,
    comment => comment.creator,
  )
  comments: CommentEntity[];

  @OneToMany(
    () => FileEntity,
    file => file.owner,
  )
  files: FileEntity[];

  @Column()
  password: string;

  @Column()
  salt: string;

  async validatePassowrd(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
