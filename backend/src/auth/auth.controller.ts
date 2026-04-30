import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SendCodeDto, RegisterDto, LoginDto, VerifyCodeDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-code')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendRegistrationCode(dto.email);
  }

  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.code, dto.password);
  }

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  login(@Body() dto: LoginDto) {
    return this.authService.loginWithPassword(dto.email, dto.password);
  }

  @Post('login/code')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  sendLoginCode(@Body() dto: SendCodeDto) {
    return this.authService.sendLoginCode(dto.email);
  }

  @Post('login/verify')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  verifyLoginCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyLoginCode(dto.email, dto.code);
  }
}
