import { Injectable, NestMiddleware } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log(
      `${new Date(Date.now()).toISOString()} :: request on ${req.path} with method ${req.method}`,
    );
    next();
  }
}
