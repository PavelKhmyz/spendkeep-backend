/* eslint-disable @typescript-eslint/naming-convention */
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    accountId: string;
  }
}
