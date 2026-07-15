import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../../DB/schema/user.schema';
import { UserRepo } from '../Repo/user.repo';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  providers: [TokenService, UserRepo],
  exports: [TokenService],
})
export class TokenModule {}

