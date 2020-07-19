import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { EmployeeEntity } from '.';
import { MimeType } from '../enum';
import { UpdateEntity } from './update.entity';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mime: MimeType;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @ManyToOne(
    () => EmployeeEntity,
    employee => employee.files,
    { eager: true, onDelete: 'CASCADE' },
  )
  owner: EmployeeEntity;

  @ManyToOne(
    () => UpdateEntity,
    update => update.files,
    { nullable: true, onDelete: 'CASCADE' },
  )
  update: UpdateEntity;

  isOwner(employee: EmployeeEntity): boolean {
    return this.owner.id === employee.id;
  }
}
