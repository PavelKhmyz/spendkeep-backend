import winston, { createLogger, format, transports } from 'winston';

export interface ILogger {
  info(message: string | number): void;
  error(message: string | number): void;
  warn(message: string | number): void;
}

export default class Logger implements ILogger {
  private logsFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  private logger: winston.Logger = createLogger({
    level: 'info',
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      this.logsFormat,
    ),
    transports: [
      new transports.Console(),
    ],
  });

  public info(message: string | number): void {
    this.logger.info(message);
  }

  public error(message: string | number): void {
    this.logger.error(message);
  }

  public warn(message: string | number): void {
    this.logger.warn(message);
  }
}
