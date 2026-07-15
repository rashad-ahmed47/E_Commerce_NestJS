import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { CustomValidatePipe } from './pipes/validation.pipe';
import { User } from '../DB/schema/user.schema';
import { authGuard, type IAuthReq } from '../common/guards/auth.guard';
authGuard;
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }), CustomValidatePipe)
  async signUp(@Ip() ip: string, @Body() userData: CreateUserDTO) {
    return await this.authService.signUp(userData, ip);
  }

  @Post('login')
  async login(@Body() body: any) {
    return await this.authService.login(body);
  }

  @Get('profile')
  @UseGuards(authGuard)
  profile(@Req() req: IAuthReq) {
    return { data: req.user };
  }
}
