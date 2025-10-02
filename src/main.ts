import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Permitir propriedades extras
    transform: true,
  }));

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
