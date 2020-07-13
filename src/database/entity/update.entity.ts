import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UpdateType } from '../enum';
import { TaskEntity, CommentEntity } from './';

@Entity()
export class UpdateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  type: UpdateType;

  @ManyToOne(
    () => TaskEntity,
    task => task.updates,
  )
  @Exclude()
  task: TaskEntity;

  @OneToMany(
    () => CommentEntity,
    comment => comment.update,
  )
  @Exclude()
  comments: CommentEntity[];
}
