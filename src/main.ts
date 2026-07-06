import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const Port = parseInt(String(process.env.PORT), 10) || 3000;
  await app.listen(Port ?? 3000);
  console.log(`app running on port ${Port}`);
}
bootstrap();
