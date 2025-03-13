import { Injectable } from '@nestjs/common';
import { PublicacionesService } from '../../privado/publicaciones/publicaciones.service';

@Injectable()
export class PublicacionListarService {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  public listarTodas(): any {
    return this.publicacionesService.consultar();
  }
}