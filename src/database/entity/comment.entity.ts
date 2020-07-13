import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UpdateEntity, EmployeeEntity } from './';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(
    () => UpdateEntity,
    update => update.comments,
  )
  @Exclude()
  update: UpdateEntity;

  @ManyToOne(
    () => EmployeeEntity,
    employee => employee.comments,
    { eager: true },
  )
  creator: EmployeeEntity;

  isCreator(employee: EmployeeEntity): boolean {
    return this.creator.id === employee.id;
  }
}
