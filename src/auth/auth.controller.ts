import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { CustomValidatePipe } from './pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}
  @Post('register')
  @UsePipes(new ValidationPipe(), CustomValidatePipe)
  findOne(@Body() createUserDTO: CreateUserDTO) {
    return this.authservice.getUser(createUserDTO);
  }
}
