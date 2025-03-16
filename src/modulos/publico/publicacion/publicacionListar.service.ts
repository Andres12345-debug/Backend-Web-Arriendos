import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicacionesService } from '../../privado/publicaciones/publicaciones.service';
import { DataSource, Repository } from 'typeorm';
import { Publicacion } from 'src/modelos/publicacion/publicacion';

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
      return this.publicacionesRepository.findBy({ codPublicacion: codigo });
    } catch (error) {
      throw new HttpException('Fallo al consultar la publicación', HttpStatus.BAD_REQUEST);
    }
  }

  //Consultar tipo casa
  async consultarPorTipo(tipoVivienda?: string): Promise<Publicacion[]> {
    if (!tipoVivienda) return [];
  
    // Eliminar espacios en blanco y saltos de línea
    tipoVivienda = tipoVivienda.trim();
  
    const query = this.publicacionesRepository.createQueryBuilder('publicacion')
      .where("LOWER(publicacion.tipo::TEXT) = LOWER(:tipoVivienda)", { tipoVivienda });
  
    console.log('🔍 Consulta SQL generada:', query.getSql());
    console.log('🔍 Parámetro enviado:', tipoVivienda);
  
    const resultado = await query.getMany();
    console.log('🔍 Resultado de la consulta:', resultado);
  
    return resultado;
  }
  
 

}