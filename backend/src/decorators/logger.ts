import { NextFunction, Response } from "express";
import { Logger } from "../../lib/logger";
import { AdvancedRequest } from "../interfaces/AdvancedRequest";

const logger = new Logger();

export function logMe(logMessage: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const req: AdvancedRequest = args[0];
      const res: Response = args[1];
      const next: NextFunction = args[2];

      // Eval method to process template literals in logMessage
      const evalLogMessage = (message: string, req: AdvancedRequest): string => {
        return message.replace(/\${(.*?)}/g, (_, g) => eval(g));
      };

      // Logging the message
      logger.log('info', evalLogMessage(logMessage, req));

      return originalMethod.apply(this, args);
    };
  };
}