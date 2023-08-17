import * as bcrypt from 'bcrypt';

export interface IBcryptHashUtils {
  hash(password: string): Promise<string>,
  compare(password: string, hash: string): Promise<boolean>,
}

export default class BcriptHashUtils implements IBcryptHashUtils {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
