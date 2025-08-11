import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ImagenesPublicaciones } from 'src/modelos/imagenes_publicacion/ImagenesPublicacion';
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
    const publicaciones = await this.publicacionesRepository.find({
      relations: ['imagenes'], // Asegúrate de usar el nombre real de la relación
    });

    return publicaciones.map(publi => ({
      ...publi,
      imagenesUrls: publi.imagenes?.map(img => img.urlImagen) || [],
      imagenUrl: publi.imagenes?.[0]?.urlImagen || null,
    }));
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


public async registrar(objPubli: Publicacion, imagenesUrls: string | string[]): Promise<any> {
  const urls = Array.isArray(imagenesUrls) ? imagenesUrls : [imagenesUrls];
  try {
    objPubli.tituloPublicacion = objPubli.tituloPublicacion.trim().toLowerCase();

    if (await this.verificar(objPubli.tituloPublicacion)) {
      throw new HttpException('La publicación ya existe', HttpStatus.BAD_REQUEST);
    }

    // Fecha de creación
    objPubli.fechaCreacionPublicacion = new Date();

    // Guardar publicación base
    const publicacionGuardada = await this.publicacionesRepository.save(objPubli);

    // Guardar imágenes relacionadas
    if (urls && urls.length > 0) {
      const imagenesRepo = this.poolConexion.getRepository(ImagenesPublicaciones);
      const imagenesEntities = urls.map(url => {
        const img = new ImagenesPublicaciones();
        img.urlImagen = url;
        img.publicacion = publicacionGuardada;
        return img;
      });
      await imagenesRepo.save(imagenesEntities);
    }

    return {
      success: true,
      message: 'La publicación fue registrada correctamente.',
      data: publicacionGuardada,
    };
  } catch (error) {
    throw new HttpException(
      { success: false, message: error.message || 'Fallo al registrar la publicación.' },
      HttpStatus.BAD_REQUEST,
    );
  }
}

  public async consultarUno(codigo: number): Promise<any> {
  try {
    const publi = await this.publicacionesRepository.findOne({
      where: { codPublicacion: codigo },
      relations: ['imagenes'], // Asegúrate de que 'imagenes' es el nombre de la relación en tu entidad
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
    throw new HttpException(
      'Fallo al consultar la publicación',
      HttpStatus.BAD_REQUEST
    );
  }
}


  

  public async actualizar(objPubli: Publicacion, codigo: number, imagenesUrls?: string[]): Promise<any> {
  try {
    const publicacionExistente = await this.publicacionesRepository.findOne({
      where: { codPublicacion: codigo },
      relations: ['imagenes'],
    });

    if (!publicacionExistente) {
      throw new HttpException("La publicación no existe", HttpStatus.NOT_FOUND);
    }

    // Actualizar datos básicos
    await this.publicacionesRepository.update({ codPublicacion: codigo }, objPubli);

    // Si hay nuevas imágenes, agregarlas
    if (imagenesUrls && imagenesUrls.length > 0) {
      const imagenesRepo = this.poolConexion.getRepository(ImagenesPublicaciones);
      const nuevasImagenes = imagenesUrls.map(url => {
        const img = new ImagenesPublicaciones();
        img.urlImagen = url;
        img.publicacion = publicacionExistente;
        return img;
      });
      await imagenesRepo.save(nuevasImagenes);
    }

    const actualizada = await this.publicacionesRepository.findOne({
      where: { codPublicacion: codigo },
      relations: ['imagenes'],
    });

    return { mensaje: "Publicación actualizada", objeto: actualizada };
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
