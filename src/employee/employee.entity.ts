import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { Role } from './role.enum';
import { ProjectMember } from '../project/project-member.entity';

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
    () => ProjectMember,
    projectMember => projectMember.employee,
  )
  projectMember: ProjectMember[];

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
