import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Update, Employee } from './';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(
    () => Update,
    update => update.comments,
  )
  @Exclude()
  update: Update;

  @ManyToOne(
    () => Employee,
    employee => employee.comments,
    { eager: true },
  )
  creator: Employee;

  isCreator(employee: Employee): boolean {
    return this.creator.id === employee.id;
  }
}
