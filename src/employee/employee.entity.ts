import { Entity, Unique, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Role } from './role.enum';

@Entity()
@Unique(['username'])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  role: Role;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  async validatePassowrd(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
