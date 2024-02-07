import { Inject, Injectable } from '@nestjs/common';
import ClientType from '../clients/ClientType';
import { IEmailClient } from '../clients/EmailClient';

interface ISendEmailParams {
  to: string;
  subject: string;
  text: string;
}

export interface IEmailService {
  send(params: ISendEmailParams): Promise<void>;
}

@Injectable()
export default class EmailService implements IEmailService {
  constructor(
    @Inject(ClientType.EmailClient) private readonly emailClient: IEmailClient,
  ) { }

  public async send(params: ISendEmailParams) {
    return this.emailClient.send(params);
  }
}
