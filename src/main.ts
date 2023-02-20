import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: process.env.CORS_URL,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      // 'X-Page-Count',
      // 'X-Total-Count',
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
  const url = await app.getUrl();
  console.log('🚀 ~ application running on url', url);
}
bootstrap();
