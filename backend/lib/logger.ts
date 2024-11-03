const { config } = require('../src/config/environments/' + process.env.ENV);
import { logger as expressLogger, errorLogger as expressErrorLogger } from 'express-winston';
import { createLogger, format, transports } from 'winston';
import path from 'path';

class Logger {
  private logger: any;
  constructor() {
    this.logger = createLogger({
      level: config.logLevel,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.simple(),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple(),
          ),
        }),
        new transports.File({ filename: path.join(__dirname, '../../logs/app.log'), level: 'info' }),
      ],
    });
  }

  public log(level?: string, ...msg: any[]) {
    this.logger.log(level, ...msg);
  }

  public getRequestLogger() {
    return expressLogger({
      transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(__dirname, '../../logs/app.log'), level: 'info' }),
      ],
      format: format.combine(
        format.colorize(),
        format.simple(),
      ),
      meta: process.env.ENV !== 'production',
      msg: 'HTTP {{req.method}} {{req.url}}',
      expressFormat: true,
      colorize: false,
      ignoreRoute(req, res) { return false; },
    });
  }

  public getRequestErrorLogger() {
    return expressErrorLogger({
      transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
      ],
      format: format.combine(
        format.colorize(),
        format.simple(),
      ),
    });
  }
}

export { Logger };
