import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/$/, '');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendUrls = process.env['FRONTEND_URL'] ?? 'http://localhost:4200,https://mariajose-portfolio.vercel.app';
  const allowedOrigins = frontendUrls
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const normalizedOrigin = origin ? normalizeOrigin(origin) : undefined;
      const isAllowedVercelPreview =
        normalizedOrigin?.endsWith('.vercel.app') && normalizedOrigin.includes('mariajose-portfolio');

      if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin) || isAllowedVercelPreview) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(process.env['PORT'] ?? 3000);
  await app.listen(port);
}

void bootstrap();
