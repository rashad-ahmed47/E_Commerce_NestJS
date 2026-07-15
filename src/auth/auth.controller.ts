import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { CustomValidatePipe } from './pipes/validation.pipe';
import { User } from '../DB/schema/user.schema';
import { authGuard, type IAuthReq } from '../common/guards/auth.guard';
import { Role } from '../DB/enums/user.enum';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
authGuard;
@Controller('auth')
@SetMetadata('roles', [Role.User])
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
  @UseGuards(authGuard, AuthorizationGuard)
  @SetMetadata('roles', [Role.Admin])
  profile(@Req() req: IAuthReq) {
    return { data: req.user };
  }
}
