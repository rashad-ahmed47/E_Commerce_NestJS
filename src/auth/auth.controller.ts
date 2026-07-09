import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from '../app.service';
import { AuthService } from './auth.service';
import { User } from '../DB/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}

  @Post('signup')
  async signUp(@Body() userData: User) {
    return await this.authService.signUp(userData);
  }
}
