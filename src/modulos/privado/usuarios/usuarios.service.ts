import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Usuario } from 'src/modelos/usuario/usuario';
import { DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
    private usuarioRepository: Repository<Usuario>
    
    constructor(private poolConexion: DataSource){
        this.usuarioRepository = poolConexion.getRepository(Usuario);
    }
    public async consultar(): Promise<any>{
        try {
                return this.usuarioRepository.find();
        } catch (error) {
            throw new HttpException(
                'fallo al consultar el usuario',
                HttpStatus.BAD_REQUEST,
            )            
        }
    }
    public async verficar(nombre: string): Promise<boolean>{
        const existe = await this.usuarioRepository.findBy({ nombreUsuario: nombre});
        return existe.length > 0;
    }
    public async registrar(objUsuario: Usuario): Promise<any> {
        try {
          // Verificar si el usuario ya existe
          if (await this.verificarUsuario(objUsuario.nombreUsuario)) {
            throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
          }  
          // Registrar el usuario
          const usuarioGuardado = await this.usuarioRepository.save(objUsuario);
          return {
            success: true,
            message: 'Usuario registrado correctamente',
            data: usuarioGuardado,
          };
        } catch (miError) {
          // Manejar errores
          throw new HttpException(
            {
              success: false,
              message: miError.message || 'Error interno al registrar el usuario',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    public async consultarUno(codigo: number): Promise<any>{
        try{
            return this.usuarioRepository.findBy({ codUsuario  : codigo});

        }catch(error){
            throw new HttpException('Fallo al consultar el usuario', HttpStatus.BAD_REQUEST);
        }
    }

    public async verificarUsuario(nombre: string): Promise<boolean> {
        try {
          const existe = await this.usuarioRepository.findBy({ nombreUsuario: nombre });
          return existe.length > 0;
        } catch (miError) {
          throw new HttpException(
            'Error al verificar si el usuario existe',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      public async actualizar(objUsu: Usuario, codigo: number): Promise<any> {
        try {
          // Obtener el rol existente
          const UsuExistente = await this.usuarioRepository.findOneBy({ codUsuario: codigo });
      
          if (!UsuExistente) {
            throw new HttpException("El usuario no existe", HttpStatus.NOT_FOUND);
          }
      
          // Verificar si el nombre de rol ha cambiado y si ya existe otro con ese nombre
          if (
            objUsu.nombreUsuario &&
            objUsu.nombreUsuario !== UsuExistente.nombreUsuario &&
            (await this.verificarUsuario(objUsu.nombreUsuario))
          ) {
            throw new HttpException("El nombre del rol ya existe", HttpStatus.BAD_REQUEST);
          }
      
          // Actualizar el rol
          const resultado = await this.usuarioRepository.update({ codUsuario: codigo }, objUsu);
      
          // Verificar si la actualización fue exitosa
          if (resultado.affected && resultado.affected > 0) {
            // Retornar éxito con el objeto actualizado
            const rolActualizado = await this.usuarioRepository.findOneBy({ codUsuario: codigo });
            return { mensaje: "Usuario actualizado", objeto: rolActualizado };
          } else {
            // Si no se afectó ningún registro
            throw new HttpException("No se pudo actualizar el usuario", HttpStatus.BAD_REQUEST);
          }
        } catch (miError) {
          throw new HttpException(
            miError.message || "Fallo al actualizar usuario",
            miError.status || HttpStatus.BAD_REQUEST,
          );
        }
      }
    public async eliminar(objUsu : Usuario, codigo : number): Promise<any>{
        try {
            return this.usuarioRepository.delete({codUsuario : codigo})
            
        } catch (error) {
            throw new HttpException("fallo al eliminar el usuario", HttpStatus.BAD_REQUEST)
        }
    }




}
