import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepo } from '../common/Repo/user.repo';
import { SecurityService } from '../common/Security/security.service';
import { User, userSchema } from '../DB/schema/user.schema';
import { EmailService } from '../common/email/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepo, SecurityService, EmailService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
})
export class AuthModule {}
