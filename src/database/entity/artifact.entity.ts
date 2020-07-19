import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UpdateEntity } from './';
import { TaskEntity } from './task.entity';

@Entity()
export class ArtifactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @ManyToOne(
    () => TaskEntity,
    task => task.artifacts,
    { onDelete: 'CASCADE' },
  )
  task: TaskEntity;

  @OneToOne(
    () => UpdateEntity,
    update => update.artifact,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn()
  update?: UpdateEntity;
}
