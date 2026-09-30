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
import { randomBytes } from 'crypto';
import { FreeAccessService } from '../free-access/free-access.service';
import { normalizeLang } from '../mail/templates';

const SOURCE_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer', 'landing', 'first_visit', 'intent'];

/** Оставляем только известные поля источника, строки до 200 символов. */
function cleanSource(src?: Record<string, any>): Record<string, string> | null {
  if (!src || typeof src !== 'object') return null;
  const out: Record<string, string> = {};
  for (const k of SOURCE_KEYS) {
    const v = src[k];
    if (v !== undefined && v !== null && String(v).trim()) out[k] = String(v).trim().slice(0, 200);
  }
  return Object.keys(out).length ? out : null;
}

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
    private freeAccess: FreeAccessService,
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

  async sendRegistrationCode(email: string, lang?: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const code = await this.saveCode(email, CodeType.REGISTRATION);
    await this.mailService.sendCode(email, 'registration', code, lang);
    return { message: 'Verification code sent' };
  }

  async register(email: string, code: string, password?: string, refCode?: string, lang?: string, source?: Record<string, any>) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    await this.verifyCode(email, code, CodeType.REGISTRATION);

    // Без пароля: ставим случайный хэш, вход — по коду; пароль можно задать в профиле
    const hasPassword = !!password;
    const passwordHash = await bcrypt.hash(password || randomBytes(32).toString('hex'), 12);
    const signupSource = cleanSource(source);

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
      hasPassword,
      lang: normalizeLang(lang),
      signupSource,
    });

    await this.userRepo.save(user);
    const src = signupSource?.utm_source
      ? `\n📣 Источник: ${[signupSource.utm_source, signupSource.utm_medium, signupSource.utm_campaign].filter(Boolean).join(' / ')}`
      : signupSource?.referrer ? `\n📣 Переход с: ${signupSource.referrer}` : '';
    await this.telegramService.sendMessage(`🆕 Новая регистрация\n📧 ${email}${referredBy ? '\n🔗 Реферал' : ''}${src}`);

    // Бесплатный доступ: Digest навсегда + FREE на 7 дней, приветственное письмо
    await this.freeAccess.onSignup(user.id);
    return this.issueToken(user);
  }

  async loginWithPassword(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Аккаунт зарегистрирован по коду и пароль ещё не задан
    if (user.hasPassword === false) throw new UnauthorizedException('PASSWORD_NOT_SET');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.twoFaEnabled) {
      const code = await this.saveCode(email, CodeType.LOGIN_2FA);
      await this.mailService.sendCode(email, 'login', code, user.lang);
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

  async sendLoginCode(email: string, lang?: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new NotFoundException('User not found');

    const code = await this.saveCode(email, CodeType.LOGIN_2FA);
    await this.mailService.sendCode(email, 'login', code, user.lang || lang);
    return { message: 'Code sent' };
  }

  async sendPasswordResetCode(email: string, lang?: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) return { message: 'If this email exists, a reset code has been sent' };
    const code = await this.saveCode(email, CodeType.PASSWORD_RESET);
    await this.mailService.sendCode(email, 'reset', code, user.lang || lang);
    return { message: 'If this email exists, a reset code has been sent' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new BadRequestException('Invalid request');
    await this.verifyCode(email, code, CodeType.PASSWORD_RESET);
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(user.id, { passwordHash, hasPassword: true });
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
        hasPassword: user.hasPassword !== false,
      },
    };
  }
}