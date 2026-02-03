import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);
let appPromise: Promise<any>;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);

  // CORS
  app.enableCors();

  // Global prefix
  // Note: If you use 'api' as global prefix, Swagger path should be 'api' relative to root or different.
  // With Vercel rewrites to /api/index, we might face path doubling issues.
  // However, consistent with typical storage, we keep it simple.
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('C15 Tour API')
    .setDescription('API documentation for C15 Tour Backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'C15 Tour API',
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-standalone-preset.js',
    ],
  });

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  const app = await appPromise;
  app(req, res);
}
