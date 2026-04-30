import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsOptional,
  Length,
} from 'class-validator';

class UpdateProfileDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
}

class ChangePasswordDto {
  @IsString() currentPassword: string;
  @IsString() @MinLength(8) @MaxLength(64) newPassword: string;
}

class InitiateEmailChangeDto {
  @IsEmail() newEmail: string;
}

class ConfirmEmailChangeDto {
  @Length(6, 6) code: string;
}

class Toggle2FADto {
  @IsBoolean() enabled: boolean;
}

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Put('me')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('me/change-password')
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Post('me/change-email')
  initiateEmailChange(
    @CurrentUser() user: any,
    @Body() dto: InitiateEmailChangeDto,
  ) {
    return this.usersService.initiateEmailChange(user.id, dto.newEmail);
  }

  @Post('me/confirm-email')
  confirmEmailChange(
    @CurrentUser() user: any,
    @Body() dto: ConfirmEmailChangeDto,
  ) {
    return this.usersService.confirmEmailChange(user.id, dto.code);
  }

  @Put('me/2fa')
  toggle2FA(@CurrentUser() user: any, @Body() dto: Toggle2FADto) {
    return this.usersService.toggle2FA(user.id, dto.enabled);
  }
}
