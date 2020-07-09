import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UpdateType } from '../enum';
import { Task } from './task.entity';

@Entity()
export class Update {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  type: UpdateType;

  @ManyToOne(
    () => Task,
    task => task.updates,
  )
  @Exclude()
  task: Task;
}
