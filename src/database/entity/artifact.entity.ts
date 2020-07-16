import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { UpdateEntity } from './';
import { TaskEntity } from './task.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ArtifactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @ManyToOne(
    () => TaskEntity,
    task => task.artifacts,
  )
  @Exclude()
  task: TaskEntity;

  @OneToOne(
    () => UpdateEntity,
    update => update.artifact,
  )
  update?: UpdateEntity;
}
