import * as fs from 'fs';
import * as path from 'path';

// Load .env file programmatically before bootstrap
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const delimiterIndex = trimmed.indexOf('=');
    if (delimiterIndex === -1) return;
    const key = trimmed.slice(0, delimiterIndex).trim();
    let val = trimmed.slice(delimiterIndex + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Trust proxy headers (e.g. X-Forwarded-For from Nginx, Cloudflare, etc.)
  app.set('trust proxy', true);
  const Port = parseInt(String(process.env.PORT), 10) || 3010;
  await app.listen(Port);
  console.log(`app running on port ${Port}`);
}
bootstrap();
