import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Publicacion } from 'src/modelos/publicacion/publicacion';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PublicacionesService {
  private publicacionesRepository: Repository<Publicacion>;

  constructor(private poolConexion: DataSource) {
    this.publicacionesRepository = poolConexion.getRepository(Publicacion);
  }

  public async consultar(): Promise<any> {
    try {
      return this.publicacionesRepository.find();
    } catch (error) {
      throw new HttpException(
        'Fallo al consultar las publicaciones',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async verificar(nombre: string): Promise<boolean> {
    const existe = await this.publicacionesRepository.findBy({ tituloPublicacion: nombre });
    return existe.length > 0;
  }

  public async registrar(objPubli: Publicacion, imagenUrl: string): Promise<any> {
    try {
      // Normalizar el título de la publicación
      objPubli.tituloPublicacion = objPubli.tituloPublicacion.trim().toLowerCase();

      // Verificar si la publicación ya existe
      if (await this.verificar(objPubli.tituloPublicacion)) {
        throw new HttpException('La publicación ya existe', HttpStatus.BAD_REQUEST);
      }

      // Asociar la URL de la imagen al objeto
      objPubli.imagenUrl = imagenUrl;

      // Guardar la publicación
      const publicacionGuardada = await this.publicacionesRepository.save(objPubli);

      return {
        success: true,
        message: 'La publicación fue registrada correctamente.',
        data: publicacionGuardada,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Fallo al registrar la publicación.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async consultarUno(codigo: number): Promise<any> {
    try {
      return this.publicacionesRepository.findBy({ codPublicacion: codigo });
    } catch (error) {
      throw new HttpException('Fallo al consultar la publicación', HttpStatus.BAD_REQUEST);
    }
  }

  public async actualizar(objPubli: Publicacion, codigo: number, imagenUrl?: string): Promise<any> {
    try {
      // Obtener la publicación existente
      const publicacionExistente = await this.publicacionesRepository.findOneBy({ codPublicacion: codigo });
  
      if (!publicacionExistente) {
        throw new HttpException("La publicación no existe", HttpStatus.NOT_FOUND);
      }
  
      // Crear un objeto de actualización con solo los campos que se van a modificar
      const datosActualizacion: Partial<Publicacion> = {};
      
      if (objPubli.tituloPublicacion) datosActualizacion.tituloPublicacion = objPubli.tituloPublicacion;
      if (objPubli.parqueadero) datosActualizacion.parqueadero = objPubli.parqueadero;
      if (objPubli.estrato) datosActualizacion.estrato = objPubli.estrato;
      if (objPubli.servicios) datosActualizacion.servicios = objPubli.servicios;
      if (objPubli.administracion) datosActualizacion.administracion = objPubli.administracion;
      if (objPubli.metros) datosActualizacion.metros = objPubli.metros;
      if (objPubli.habitaciones) datosActualizacion.habitaciones = objPubli.habitaciones;
      if (objPubli.banios) datosActualizacion.banios = objPubli.banios;


      if (objPubli.contenidoPublicacion) datosActualizacion.contenidoPublicacion = objPubli.contenidoPublicacion;
      if (imagenUrl) datosActualizacion.imagenUrl = imagenUrl;
  
      const resultado = await this.publicacionesRepository.update(
        { codPublicacion: codigo }, 
        datosActualizacion
      );
  
      if (resultado.affected && resultado.affected > 0) {
        const publicacionActualizada = await this.publicacionesRepository.findOneBy({ codPublicacion: codigo });
        return { 
          mensaje: "Publicacion actualizada", 
          objeto: publicacionActualizada 
        };
      } else {
        throw new HttpException("No se pudo actualizar la publicación", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        error.message || "Fallo al actualizar la publicación",
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async eliminar(codigo: number): Promise<any> {
    try {
        return this.publicacionesRepository.delete({ codPublicacion: codigo });
    } catch (error) {
        throw new HttpException("Fallo al eliminar la publicacion", HttpStatus.BAD_REQUEST);
    }
}

}
