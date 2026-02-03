import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import path from 'path';
import serverless from 'serverless-http';
import { AppModule } from '../src/app.module';

let cachedServer: any;

async function bootstrap() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter);

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('C15 Tour API')
    .setDescription("API pour l'application C15 Tour")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api', app as any, document);

  // CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Static files
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
