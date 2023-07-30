import { Inject, Injectable } from '@nestjs/common';
import ClientType from '../clients/ClientType';
import { IEmailClient } from '../clients/EmailClient';

interface ISendTestEmailParams {
  to: string;
  subject: string;
  text: string;
}

export interface IEmailService {
  sendTestEmail(params: ISendTestEmailParams): Promise<void>;
}

@Injectable()
export default class EmailService implements IEmailService {
  constructor(
    @Inject(ClientType.EmailClient) private readonly emailClient: IEmailClient,
  ) { }

  public async sendTestEmail(params: ISendTestEmailParams) {
    return this.emailClient.send(params);
  }
}
