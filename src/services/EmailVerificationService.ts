import { Inject, Injectable } from '@nestjs/common';
import ServiceType from './ServiceType';
import { IEmailService } from './EmailService';
import { IRedisService, RedisTimeUnit } from './RedisService';
import { IUserService } from './UserService';
import UtilType from '../utils/UtilType';
import { IBcryptHashUtils } from '../utils/BcriptHashUtils';
import { generateRandomNumbersString } from '../helpers/generateRandomNumbersString';

interface ISendVerificationCodeParams {
  email: string;
  userName: string;
}

interface IVerifyEmailParams {
  verificationCode: string;
}

export interface IEmailVerificationService {
  sendVerificationCode(params: ISendVerificationCodeParams, userId: string): Promise<void>,
  verifyEmail(params: IVerifyEmailParams, userId: string): Promise<void>,
}

const EMAIL_VERIFICATION_CODE_LENGTH = 5;

@Injectable()
export class EmailVerificationService implements IEmailVerificationService {
  constructor(
    @Inject(ServiceType.EmailService) private readonly emailService: IEmailService,
    @Inject(ServiceType.RedisService) private readonly redisService: IRedisService,
    @Inject(ServiceType.UserService) private readonly userService: IUserService,
    @Inject(UtilType.BcriptHashUtils) private readonly bcriptHashUtils: IBcryptHashUtils,
  ){}

  public async sendVerificationCode(params: ISendVerificationCodeParams, userId: string): Promise<void> {
    const verificationCode = generateRandomNumbersString(EMAIL_VERIFICATION_CODE_LENGTH);

    const verificationHash = await this.bcriptHashUtils.hash(verificationCode);

    await this.redisService.set(
      userId,
      verificationHash,
      { timeUnit: RedisTimeUnit.Seconds, timeValue: 600 }
    );

    await this.emailService.send({ 
      to: params.email,
      subject: 'Email Verification',
      text: this.getVerificationEmail(params.userName, verificationCode),
    });
  }

  public async verifyEmail(params: IVerifyEmailParams, userId: string): Promise<void> {
    const verificationHash = await this.redisService.getOne(userId);

    const compare = await this.bcriptHashUtils.compare(params.verificationCode, verificationHash);

    if (compare) {
      await this.userService.update(userId, { isEmailVerified: true });
    }
  }

  private getVerificationEmail (userName: string, verificationCode: string): string {
    const verificationLink = `http://localhost:5123/web-api/emailVerification?verificationCode=${verificationCode}`;

    return `Hi, ${ userName }\r\nTo verify your email follow the link bellow:\r\n\r\n${ verificationLink }\r\n\r\nOr input ${ verificationCode } manual.`;
  }
}
