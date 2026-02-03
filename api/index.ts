import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import path from 'path';

let cachedServer: any;

async function bootstrap() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter);

  // CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Static files
  // Note: On Vercel, static files via express might be tricky, usually handled by Vercel output.
  // But keeping it for compatibility.
  const uploadRoot = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadRoot));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  return serverless(expressApp);
}

export default async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
};
