import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🧹 Validaciones globales de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina propiedades no incluidas en el DTO
      transform: true,            // convierte payloads en instancias DTO
      forbidNonWhitelisted: true, // lanza error si llegan props extra
    }),
  );


  // 📘 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('🐉 DragonKeep API')
    .setDescription('API para la adopción y gestión de dragones 🐲')
    .setVersion('1.0')
    .addBearerAuth() // habilita el token JWT en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 DragonKeep API is running on: http://localhost:${port}`);
  console.log(`📘 Swagger docs available at: http://localhost:${port}/api`);
}

bootstrap();
