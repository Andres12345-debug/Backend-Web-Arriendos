import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from 'src/modelos/usuario/usuario';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuarioService : UsuariosService){}
    @Get('/todos')
    public obtenerProductos(): any{
        return this.usuarioService.consultar();
    }
    @Post("/agregar")
    public registrarProducto(@Body() objUsu: Usuario): any{
        return this.usuarioService.registrar(objUsu);
    }
    @Get("/one/:cod_usuario")
    public consultarUnProducto(@Param() parametro: any): any{
        const codigoCate : number = Number(parametro.cod_usuario);
        if(!isNaN(codigoCate)){
            return this.usuarioService.consultarUno(codigoCate);
        }else{
            return new HttpException('El codigo del usuario no es valido', HttpStatus.NOT_ACCEPTABLE);

        }        
    }
    @Put("/update/:cod_usuario")
    public actualizar(@Body() objActualizar: Usuario, @Param() parametros: any): any{
        const codigo: number = Number(parametros.cod_usuario);
        if(!isNaN(codigo)){
            return this.usuarioService.actualizar(objActualizar, codigo)
        }else{
            return new HttpException("Fallo al actualizar el usuario", HttpStatus.BAD_REQUEST)
        }
    }
    @Delete("/delete/:cod_usuario")
    public borrarProducto(@Body() objBorrar: Usuario, @Param() parametros: any): any{
        const codigo: number = Number(parametros.cod_usuario);
        if(!isNaN(codigo)){
            return this.usuarioService.eliminar(objBorrar, codigo);
        }else{
            return new HttpException("fallo al borrar el usuario", HttpStatus.BAD_REQUEST)
        }
    }

}
