import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PublicacionesService } from './publicaciones.service';
import { Publicacion } from 'src/modelos/publicacion/publicacion';
import { Query } from '@nestjs/common';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionService: PublicacionesService) { }

  @Get('/todos')
  public obtenerProductos(): any {
    return this.publicacionService.consultar();
  }

  @Post('/agregar')
  @UseInterceptors(
    FilesInterceptor('imagenes', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async registrar(
    @Body() objPubli: Publicacion,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imagenesUrls = files.map(file => `/uploads/${file.filename}`);
    return this.publicacionService.registrar(objPubli, imagenesUrls);
  }


  public registrarProducto(
    @Body() objCate: Publicacion,
    @UploadedFile() file: Express.Multer.File,
  ): any {
    try {
      const imagenUrl = `/uploads/${file.filename}`;
      return this.publicacionService.registrar(objCate, imagenUrl);
    } catch (error) {
      throw new HttpException(
        'Fallo al registrar la publicación',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/one/:cod_publicacion')
  public consultarUnProducto(@Param() parametro: any): any {
    const codigoCate: number = Number(parametro.cod_publicacion);
    if (!isNaN(codigoCate)) {
      return this.publicacionService.consultarUno(codigoCate);
    } else {
      return new HttpException(
        'El código de la publicación no es válido',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Put('/update/:cod_publicacion')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  public actualizar(
    @Body() objActualizar: Publicacion,
    @Param() parametros: any,
    @UploadedFile() file?: Express.Multer.File,
  ): any {
    const codigo: number = Number(parametros.cod_publicacion);
    if (!isNaN(codigo)) {
      const imagenesUrls = file ? [`/uploads/${file.filename}`] : [];
      return this.publicacionService.actualizar(
        objActualizar,
        codigo,
        imagenesUrls,
      );
    } else {
      throw new HttpException(
        'Fallo al actualizar la publicación',
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Delete('/delete/:cod_publicacion')
  public borrarProducto(@Param() parametros: any): any {
    const codigo: number = Number(parametros.cod_publicacion);
    if (!isNaN(codigo)) {
      return this.publicacionService.eliminar(codigo);
    } else {
      return new HttpException('Fallo al borrar', HttpStatus.BAD_REQUEST);
    }
  }
}
