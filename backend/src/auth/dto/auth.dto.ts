import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
  IsOptional,
  Length,
  IsIn,
  IsObject,
} from 'class-validator';

const LANGS = ['en', 'de', 'es', 'it', 'pt', 'ru', 'uk', 'zh', 'ar'];

export class SendCodeDto {
  @IsEmail()
  email: string;

  // Язык интерфейса — на нём придёт письмо с кодом
  @IsOptional()
  @IsIn(LANGS)
  lang?: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @Length(6, 6)
  code: string;

  // Пароль необязателен: регистрация по коду из письма. Задать можно позже в профиле.
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password?: string;

  @IsOptional()
  @IsIn(LANGS)
  lang?: string;

  // Источник регистрации: utm_*, referrer, страница входа (санитизируется на сервере)
  @IsOptional()
  @IsObject()
  source?: Record<string, any>;

  // Реферальный код (опционально). Может прийти как поле тела или ?ref= в query.
  @IsOptional()
  @IsString()
  @MaxLength(32)
  refCode?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyCodeDto {
  @IsEmail()
  email: string;

  @Length(6, 6)
  code: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @Length(6, 6)
  code: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  newPassword: string;
}
