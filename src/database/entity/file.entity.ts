import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
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
  @Exclude()
  filepath: string;

  @ManyToOne(
    () => EmployeeEntity,
    employee => employee.files,
    { eager: true },
  )
  @Expose({ groups: ['file'] })
  owner: EmployeeEntity;

  @ManyToOne(
    () => UpdateEntity,
    update => update.files,
    { nullable: true },
  )
  @Exclude()
  update: UpdateEntity;

  isOwner(employee: EmployeeEntity): boolean {
    return this.owner.id === employee.id;
  }
}
