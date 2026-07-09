import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api')
  getHelloo(@Query() query: any): string {
    return 'hello';
  }
}
