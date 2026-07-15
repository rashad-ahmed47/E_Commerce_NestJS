import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { UserRepo } from '../Repo/user.repo';
import { OTP } from '../../DB/enums/user.enum';

@Injectable()
export class EmailService {
  constructor(private readonly userRepo: UserRepo) {}
  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string | string[];
    subject: string;
    html: string;
  }) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: 'Example Team" <team@example.com>',
        to,
        subject,
        text: 'Hello world?',
        html,
      });

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error('Error while sending mail:', err);
    }
  }
  generateOTP() {
    return Math.ceil(Math.random() * 900000 + 100000);
  }
  async sendRegisterOtp(email: string) {
    const otp = this.generateOTP();
    await this.userRepo.updateOne(
      { email },
      {
        OTP: {
          code: String(otp),
          expires: new Date(Date.now() + 5 * 60 * 1000),
          type: OTP.Register,
        },
      },
    );
    await this.sendEmail({
      to: email,
      subject: 'Confirm your email',
      html: `<h2>Your otp ${otp}</h2>`,
    });
  }
}
