import { Controller, Get } from '@nestjs/common';
import { PublicacionListarService } from './publicacionListar.service';

@Controller('publicaciones')
export class PublicacionListarController {
  constructor(private readonly publicacionListarService: PublicacionListarService) {}

  @Get('/publico')
  public listarTodas(): any {
    return this.publicacionListarService.listarTodas();
  }
}