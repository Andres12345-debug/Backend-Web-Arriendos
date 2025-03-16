import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PublicacionListarService } from './publicacionListar.service';

@Controller('publicaciones')
export class PublicacionListarController {
  constructor(
    private readonly publicacionListarService: PublicacionListarService,
  ) {}

  @Get('/publico')
  public listarTodas(): any {
    return this.publicacionListarService.listarTodas();
  }
  @Get('/one/:cod_publicacion')
  public consultarUnProducto(@Param() parametro: any): any {
    const codigoCate: number = Number(parametro.cod_publicacion);
    if (!isNaN(codigoCate)) {
      return this.publicacionListarService.consultarUno(codigoCate);
    } else {
      return new HttpException(
        'El código de la publicación no es válido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
  @Get('/tipoCasa/:tipoVivienda')
  public listarPublicaciones(
    @Param('tipoVivienda') tipoVivienda?: string,
  ): any {
    console.log('🔍 Tipo de vivienda recibido en la API:', tipoVivienda);
    return this.publicacionListarService.consultarPorTipo(tipoVivienda);
  }
}
