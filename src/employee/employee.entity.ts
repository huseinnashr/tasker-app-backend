import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  private password: string;

  @Column()
  salt: string;

  async setPassword(password: string): Promise<void> {
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, this.salt);
  }

  async validatePassowrd(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
