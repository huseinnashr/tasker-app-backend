import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Status } from './status.enum';
import { Employee } from '../employee/employee.entity';
import { ProjectMember } from './project-member.entity';

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

  @OneToMany(
    type => ProjectMember,
    projectMember => projectMember.project,
  )
  projectMember: ProjectMember[];
}
