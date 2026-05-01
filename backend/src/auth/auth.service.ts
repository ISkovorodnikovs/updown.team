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
import { v4 as uuidv4 } from 'uuid';

function nanoid() { return uuidv4().replace(/-/g,'').substring(0,8).toUpperCase(); }

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

  async register(email: string, code: string, password: string, refCode?: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    await this.verifyCode(email, code, CodeType.REGISTRATION);

    const passwordHash = await bcrypt.hash(password, 12);

    // Генерируем уникальный реферальный код
    let referralCode: string;
    let codeExists = true;
    while (codeExists) {
      referralCode = nanoid();
      codeExists = !!(await this.userRepo.findOne({ where: { referralCode } }));
    }

    // Находим реферера если есть код
    let referredBy: string | null = null;
    if (refCode) {
      const referrer = await this.userRepo.findOne({ where: { referralCode: refCode } });
      if (referrer) referredBy = referrer.id;
    }

    const user = this.userRepo.create({
      email,
      passwordHash,
      emailVerified: true,
      role: UserRole.USER,
      referralCode,
      referredBy,
    });

    await this.userRepo.save(user);
    await this.telegramService.sendMessage(`🆕 Новая регистрация\n📧 ${email}${referredBy ? '\n🔗 Реферал' : ''}`);
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

  async sendPasswordResetCode(email: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) return { message: 'If this email exists, a reset code has been sent' };
    const code = await this.saveCode(email, CodeType.PASSWORD_RESET);
    await this.mailService.sendPasswordResetCode(email, code);
    return { message: 'If this email exists, a reset code has been sent' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new BadRequestException('Invalid request');
    await this.verifyCode(email, code, CodeType.PASSWORD_RESET);
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(user.id, { passwordHash });
    return { message: 'Password updated successfully' };
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