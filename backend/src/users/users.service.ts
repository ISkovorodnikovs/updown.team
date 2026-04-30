import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import {
  VerificationCode,
  CodeType,
} from '../database/entities/verification-code.entity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(VerificationCode)
    private codeRepo: Repository<VerificationCode>,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    const { passwordHash, ...profile } = user;
    return profile;
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string },
  ) {
    await this.userRepo.update(userId, data);
    return this.getProfile(userId);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const hash = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(userId, { passwordHash: hash });
    return { message: 'Password updated' };
  }

  async initiateEmailChange(userId: string, newEmail: string) {
    const existing = await this.userRepo.findOne({ where: { email: newEmail } });
    if (existing) throw new BadRequestException('Email already in use');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    const code = await this.generateCode(newEmail, CodeType.EMAIL_CHANGE);
    await this.userRepo.update(userId, { pendingEmail: newEmail });
    await this.mailService.sendEmailChangeCode(newEmail, code);
    return { message: 'Verification code sent to new email' };
  }

  async confirmEmailChange(userId: string, code: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user.pendingEmail) throw new BadRequestException('No pending email change');

    const record = await this.verifyCode(user.pendingEmail, code, CodeType.EMAIL_CHANGE);
    await this.userRepo.update(userId, {
      email: user.pendingEmail,
      pendingEmail: null,
    });
    return { message: 'Email updated' };
  }

  async toggle2FA(userId: string, enabled: boolean) {
    await this.userRepo.update(userId, { twoFaEnabled: enabled });
    return { twoFaEnabled: enabled };
  }

  private async generateCode(email: string, type: CodeType): Promise<string> {
    await this.codeRepo.update({ email, type, used: false }, { used: true });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = await bcrypt.hash(code, 10);
    const minutes = parseInt(this.config.get('CODE_TTL_MINUTES', '10'));
    await this.codeRepo.save({
      email,
      code: hash,
      type,
      expiresAt: new Date(Date.now() + minutes * 60 * 1000),
    });
    return code;
  }

  private async verifyCode(email: string, code: string, type: CodeType) {
    const records = await this.codeRepo.find({
      where: { email, type, used: false },
      order: { createdAt: 'DESC' },
    });
    for (const record of records) {
      if (new Date() > record.expiresAt) continue;
      const match = await bcrypt.compare(code, record.code);
      if (match) {
        record.used = true;
        await this.codeRepo.save(record);
        return record;
      }
    }
    throw new BadRequestException('Invalid or expired code');
  }
}
