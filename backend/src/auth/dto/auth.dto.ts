import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  email: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @Length(6, 6)
  code: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;

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
