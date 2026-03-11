import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { type Application } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);
let appPromise: Promise<Application> | undefined;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);

  // CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Global exception filter — handles DB errors, FK violations, etc.
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('C15 Tour API')
    .setDescription("API pour l'application C15 Tour")
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
