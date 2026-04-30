import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum CodeType {
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  EMAIL_CHANGE = 'EMAIL_CHANGE',
  LOGIN_2FA = 'LOGIN_2FA',
  PASSWORD_RESET = 'PASSWORD_RESET',
  REGISTRATION = 'REGISTRATION',
}

@Entity('verification_codes')
export class VerificationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  email: string;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: CodeType })
  type: CodeType;

  @Column({ nullable: true })
  meta: string; // e.g. new email for EMAIL_CHANGE

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
