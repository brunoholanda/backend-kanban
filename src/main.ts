import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Enable CORS
  const corsOrigin = configService.get('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Permitir propriedades extras
    transform: true,
  }));

  const port = configService.get('PORT') || 3345;
  const host = configService.get('HOST') || 'localhost';
  const appUrl = configService.get('APP_URL') || `http://${host}:${port}`;
  
  await app.listen(port, host);
  
  console.log(`🚀 Backend running on ${appUrl}`);
  console.log(`📡 Host: ${host}`);
  console.log(`🔌 Port: ${port}`);
  console.log(`🌐 CORS Origin: ${configService.get('CORS_ORIGIN')}`);
}
bootstrap();
