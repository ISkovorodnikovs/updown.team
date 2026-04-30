import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
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
