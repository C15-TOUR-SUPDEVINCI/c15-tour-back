import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

// Cache the express handler across warm invocations
let expressHandler: ReturnType<typeof Function.prototype.call> | undefined;

async function bootstrap() {
  // Let NestJS manage its own Express instance to avoid app.router compatibility issues
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('C15 Tour API')
    .setDescription("API pour l'application C15 Tour")
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'C15 Tour API',
    customCssUrl:
      'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-standalone-preset.js',
    ],
  });

  // Init without starting an HTTP server
  await app.init();

  // Return the underlying Express handler
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  if (!expressHandler) {
    expressHandler = await bootstrap();
  }
  expressHandler(req, res);
}
