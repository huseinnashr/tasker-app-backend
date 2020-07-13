import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Employee } from '.';
import { MimeType } from '../enum';

@Entity()
export class File {
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
    () => Employee,
    employee => employee.files,
    { eager: true },
  )
  owner: Employee;

  isOwner(employee: Employee): boolean {
    return this.owner.id === employee.id;
  }
}
