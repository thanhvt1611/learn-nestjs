import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany((type) => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  InsertUser() {
    console.log(`Inserted user with id:  ${this.id}`);
  }

  @AfterUpdate()
  UpdateUser() {
    console.log(`Updated user with id:  ${this.id}`);
  }

  @AfterRemove()
  RemoveUser() {
    console.log(`Removed user with id:  ${this.id}`);
  }
}
