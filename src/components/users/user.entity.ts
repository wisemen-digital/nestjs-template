import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date;

  @Column({ type: 'varchar', unique: true })
  @Index({ unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
