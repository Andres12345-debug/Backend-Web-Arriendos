import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesService } from '../../privado/publicaciones/publicaciones.service';
import { DataSource, Repository } from 'typeorm';
import { Publicacion, TipoVivienda } from 'src/modelos/publicacion/publicacion';

@Injectable()
export class PublicacionListarService {
    private publicacionesRepository: Repository<Publicacion>;
  
  constructor(private readonly publicacionesService: PublicacionesService, private poolConexion: DataSource) {
    this.publicacionesRepository = poolConexion.getRepository(Publicacion);

  }

  public listarTodas(): any {
    return this.publicacionesService.consultar();
  }
  
  public async consultarUno(codigo: number): Promise<any> {
  try {
    const publi = await this.publicacionesRepository.findOne({
      where: { codPublicacion: codigo },
      relations: ['imagenes'],
    });

    if (!publi) {
      throw new HttpException('Publicación no encontrada', HttpStatus.NOT_FOUND);
    }

    return {
      ...publi,
      imagenesUrls: publi.imagenes?.map(img => img.urlImagen) || [],
      imagenUrl: publi.imagenes?.[0]?.urlImagen || null
    };
  } catch (error) {
    throw new HttpException('Fallo al consultar la publicación', HttpStatus.BAD_REQUEST);
  }
}


  //Consultar tipo casa
 async consultarPorTipo(tipoVivienda?: string): Promise<any[]> {
  if (!tipoVivienda) return [];

  tipoVivienda = tipoVivienda.trim();

  try {
    const publicaciones = await this.publicacionesRepository.find({
      where: { tipo: tipoVivienda as TipoVivienda },
      relations: ['imagenes'],
    });

    return publicaciones.map(publi => ({
      ...publi,
      imagenesUrls: publi.imagenes?.map(img => img.urlImagen) || [],
      imagenUrl: publi.imagenes?.[0]?.urlImagen || null,
    }));
  } catch (error) {
    throw new HttpException(
      'Fallo al consultar publicaciones por tipo',
      HttpStatus.BAD_REQUEST
    );
  }
}

  
 

}