import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProjectMemberRole } from './project-member-role.enum';
import { Project } from './project.entity';
import { Employee } from '../employee/employee.entity';

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @Column()
  employeeId: number;

  @Column()
  role: ProjectMemberRole;

  @ManyToOne(
    () => Project,
    project => project.projectMember,
  )
  project: Project;

  @ManyToOne(
    () => Employee,
    employee => employee.projectMember,
  )
  employee: Employee;
}
