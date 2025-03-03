import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const puerto = Number(process.env.PUERTO_SERVIDOR);
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  
  // Configurar servir archivos estáticos desde la carpeta uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  });

  await app.listen(puerto, () => {
    console.log(`Servidor funcionando puerto: ${puerto}`);
  });
}
bootstrap();