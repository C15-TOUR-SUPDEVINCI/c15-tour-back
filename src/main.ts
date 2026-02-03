import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { MulterExceptionFilter } from './common/filters/multer-exception.filter';
// import { ProduitImportService } from './modules/catalogue/produits/produit-import.service';

import path from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Global prefix
  app.setGlobalPrefix('api');

  // Directory for static files
  const uploadRoot = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadRoot));

  // Global exception filter for Multer errors
  // app.useGlobalFilters(new MulterExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Documentation swagger
  const config = new DocumentBuilder()
    .setTitle('C15 Tour API')
    .setDescription("API pour l'application C15 Tour")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api', app as any, document);

  const port = process.env.PORT ?? 3000;
  app.enableCors();
  await app.listen(port);

  console.log(`Server is running on port ${port}`);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

void bootstrap();
