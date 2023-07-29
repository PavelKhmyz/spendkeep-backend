import { Inject, Injectable } from '@nestjs/common';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';
import UtilType from '../utils/UtilType';
import { ILogger } from '../utils/Logger';
import ConfigType from '../config/ConfigType';

type EmailOptions = Omit<SendMailOptions, 'from'>;

const SUCCESS_CONNECTION_MESSAGE = 'Nodemailer connection is successfully established';

export interface IEmailClient {
  send(options: EmailOptions): Promise<void>;
}

@Injectable()
export default class EmailClient implements IEmailClient {
  protected transporter: Transporter;

  constructor(
    @Inject(UtilType.Logger) private readonly logger: ILogger,
    @Inject(ConfigType.EmailPassword) private readonly password: string,
    @Inject(ConfigType.EmailUser) private readonly user: string,
    @Inject(ConfigType.EmailPort) private readonly port: number,
    @Inject(ConfigType.EmailHost) private readonly host: string,
  ) {
    this.transporter = this.createConnection();

    this.verifyConnection();
  }

  protected createConnection() {
    return createTransport({
      host: this.host,
      port: this.port,
      secure: false,
      auth: {
        user: this.user,
        pass: this.password,
      },
    }, {
      from: this.user,
    });
  }

  protected verifyConnection() {
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(error.message);
      } else {
        this.logger.info(SUCCESS_CONNECTION_MESSAGE);
      }
    });
  }

  public async send(options: EmailOptions): Promise<void> {
    return this.transporter.sendMail(options, this.sendMailCallback);
  }

  private sendMailCallback(error) {
    if (error) {
      this.logger.error(error.message);
    }
  }
}
