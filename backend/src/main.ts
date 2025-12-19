import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation de la validation automatique des DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Retire les propriétés non décorées
    forbidNonWhitelisted: true, // Erreur si propriété inconnue
    transform: true, // Transforme les types (ex: string -> number)
  }));

  // Configuration CORS pour Angular (port 4200 par défaut)
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();