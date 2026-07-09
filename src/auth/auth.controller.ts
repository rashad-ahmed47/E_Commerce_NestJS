import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { CustomValidatePipe } from './pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }), CustomValidatePipe)
  async signUp(@Body() userData: CreateUserDTO) {
    return await this.authService.signUp(userData);
  }
}
