import { Inject, Provider } from '@nestjs/common';
import * as winston from 'winston';
import { getWinstonConfig } from '../../config/logger.config';

export function createLoggerProvider(context: string): Provider {
  return {
    provide: `LOGGER_${context}`,
    useFactory: () => {
      return winston.createLogger(getWinstonConfig(context));
    },
  };
}

export const InjectLogger = (context: string) => Inject(`LOGGER_${context}`);