import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const puerto =
    Number(process.env.PORT) ||
    Number(process.env.PUERTO_SERVIDOR) ||
    3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(puerto);
  console.log(`Servidor funcionando en puerto: ${puerto}`);
}
bootstrap();
