import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Status } from './status.enum';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  status: Status;
}
