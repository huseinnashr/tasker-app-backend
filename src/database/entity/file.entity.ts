import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { EmployeeEntity } from '.';
import { MimeType } from '../enum';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mime: MimeType;

  @Column()
  filename: string;

  @Column()
  @Exclude()
  filepath: string;

  @ManyToOne(
    () => EmployeeEntity,
    employee => employee.files,
    { eager: true },
  )
  owner: EmployeeEntity;

  isOwner(employee: EmployeeEntity): boolean {
    return this.owner.id === employee.id;
  }
}
