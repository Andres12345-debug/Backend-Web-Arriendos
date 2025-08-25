import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from 'src/modelos/usuario/usuario';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuarioService: UsuariosService) { }


    @Get('/todos')
    public obtenerProductos(): any {
        return this.usuarioService.consultar();
    }

    @Get('/perfil')
    public async obtenerMiPerfil(@Req() req: Request): Promise<any> {
        const datosUsuario = (req as any).datosUsuario;

        // Log para ver exactamente qué está llegando
        console.log("👉 Datos que llegan al controlador /perfil:", datosUsuario);

        return {
            mensaje: 'Perfil obtenido correctamente',
            usuario: datosUsuario, // Aquí sale la info del usuario
        };
    }




    @Post("/agregar")
    public registrarProducto(@Body() objUsu: Usuario): any {
        return this.usuarioService.registrar(objUsu);
    }
    @Get("/one/:cod_usuario")
    public consultarUnProducto(@Param() parametro: any): any {
        const codigoCate: number = Number(parametro.cod_usuario);
        if (!isNaN(codigoCate)) {
            return this.usuarioService.consultarUno(codigoCate);
        } else {
            return new HttpException('El codigo del usuario no es valido', HttpStatus.NOT_ACCEPTABLE);

        }
    }


    @Put("/actualizar")
    public async actualizarPerfil(
        @Req() req: Request,
        @Body() objActualizar: Usuario
    ): Promise<any> {
        const datosUsuario = (req as any).datosUsuario;
        const codigo = datosUsuario.codUsuario || datosUsuario.id || datosUsuario.userId;

        if (!codigo) {
            throw new HttpException("Usuario no válido en el token", HttpStatus.UNAUTHORIZED);
        }

        return this.usuarioService.actualizar(objActualizar, codigo);
    }






    @Delete("/delete/:cod_usuario")
    public borrarProducto(@Body() objBorrar: Usuario, @Param() parametros: any): any {
        const codigo: number = Number(parametros.cod_usuario);
        if (!isNaN(codigo)) {
            return this.usuarioService.eliminar(objBorrar, codigo);
        } else {
            return new HttpException("fallo al borrar el usuario", HttpStatus.BAD_REQUEST)
        }
    }

}
