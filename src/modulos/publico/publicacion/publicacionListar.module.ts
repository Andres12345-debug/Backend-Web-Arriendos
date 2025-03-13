import { Module } from '@nestjs/common';
import { PublicacionListarService } from './publicacionListar.service';
import { PublicacionListarController } from './publicacionListar.controller';
import { PublicacionesService } from '../../privado/publicaciones/publicaciones.service';

@Module({
  controllers: [PublicacionListarController],
  providers: [PublicacionListarService, PublicacionesService],
})
export class PublicacionListarModule {}