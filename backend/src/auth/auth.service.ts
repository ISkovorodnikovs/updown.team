import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../database/entities/user.entity';
import {
  VerificationCode,
  CodeType,
} from '../database/entities/verification-code.entity';
import { MailService } from '../mail/mail.service';
import { TelegramMainService } from '../telegram/telegram-main.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(VerificationCode)
    private codeRepo: Repository<VerificationCode>,
    private jwtService: JwtService,
    private mailService: MailService,
    private config: ConfigService,
    private telegramService: TelegramMainService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getExpiry(): Date {
    const minutes = parseInt(this.config.get('CODE_TTL_MINUTES', '10'));
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  private async saveCode(
    email: string,
    type: CodeType,
    meta?: string,
  ): Promise<string> {
    // Invalidate previous codes of same type
    await this.codeRepo.update(
      { email, type, used: false },
      { used: true },
    );

    const code = this.generateCode();
    const hash = await bcrypt.hash(code, 10);

    await this.codeRepo.save({
      email,
      code: hash,
      type,
      meta,
      expiresAt: this.getExpiry(),
    });

    return code;
  }

  private async verifyCode(
    email: string,
    code: string,
    type: CodeType,
  ): Promise<VerificationCode> {
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

  async sendRegistrationCode(email: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const code = await this.saveCode(email, CodeType.REGISTRATION);
    await this.mailService.sendVerificationCode(email, code);
    return { message: 'Verification code sent' };
  }

  async register(email: string, code: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    await this.verifyCode(email, code, CodeType.REGISTRATION);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({
      email,
      passwordHash,
      emailVerified: true,
      role: UserRole.USER,
    });

    await this.userRepo.save(user);
    // Уведомление в Telegram
    await this.telegramService.sendMessage(`🆕 Новая регистрация\n📧 ${email}`);
    return this.issueToken(user);
  }

  async loginWithPassword(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.twoFaEnabled) {
      const code = await this.saveCode(email, CodeType.LOGIN_2FA);
      await this.mailService.sendLoginCode(email, code);
      return { requires2FA: true };
    }

    // Уведомление в Telegram
    await this.telegramService.sendMessage(`✅ Авторизация\n📧 ${email}`);
    return this.issueToken(user);
  }

  async verifyLoginCode(email: string, code: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new UnauthorizedException();

    await this.verifyCode(email, code, CodeType.LOGIN_2FA);
    // Уведомление в Telegram (вход по коду)
    await this.telegramService.sendMessage(`✅ Авторизация (код)\n📧 ${email}`);
    return this.issueToken(user);
  }

  async sendLoginCode(email: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new NotFoundException('User not found');

    const code = await this.saveCode(email, CodeType.LOGIN_2FA);
    await this.mailService.sendLoginCode(email, code);
    return { message: 'Code sent' };
  }

  private issueToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        twoFaEnabled: user.twoFaEnabled,
      },
    };
  }
}