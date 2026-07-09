import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepo } from '../common/Repo/user.repo';
import { SecurityService } from '../common/Security/security.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly securityService: SecurityService,
    private readonly emailService: EmailService,
  ) {}
  async signUp(userData: CreateUserDTO) {
    const { email, password, age, gender, phone, username } = userData;
    const isEmailExist = await this.userRepo.findByEmail(email);
    const isUsernameUnique = await this.userRepo.findByUsername(username);
    if (isEmailExist) {
      throw new BadRequestException('email already exists');
    }
    if (isUsernameUnique) {
      throw new BadRequestException('choose another username');
    }
    const user = await this.userRepo.create({
      email,
      username,
      password: await this.securityService.createHash({ data: password }),
      age,
      gender,
      phone: await this.securityService.encryption({ data: phone }),
    });
    await this.emailService.sendRegisterOtp(email);
    return { data: { user } };
  }
}
