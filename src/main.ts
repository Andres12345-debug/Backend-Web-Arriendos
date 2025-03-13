import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

//despliegue import
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const puerto = Number(process.env.PUERTO_SERVIDOR);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Configurar servir archivos estáticos desde la carpeta uploads, MAQUINA LOCAL
  //app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  // prefix: '/uploads/'
  //});

  // Configurar archivos estáticos desde la carpeta uploads DESPLIEGUE
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  //en local
  //await app.listen(puerto, () => {
  // console.log(`Servidor funcionando puerto: ${puerto}`);
  // });

  //despliegue
  await app.init();
}
bootstrap();
