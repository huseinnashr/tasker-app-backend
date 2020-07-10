import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UpdateType } from '../enum';
import { Task, Comment } from './';

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

  @OneToMany(
    () => Comment,
    comment => comment.update,
  )
  @Exclude()
  comments: Comment[];
}
