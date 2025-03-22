import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicoModule } from '../publico/publico.module';
import { RolesModule } from './roles/roles.module';
import { Publicacion } from 'src/modelos/publicacion/publicacion';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { ImagenesModule } from './imagenes/imagenes.module';

const routes: Routes = [
    {
      path: 'privado',
      children: [UsuariosModule, PublicoModule, RolesModule, PublicacionesModule, ImagenesModule],
    },
  ];

@Module({
    imports: [
        UsuariosModule,
        PublicoModule,
        RolesModule,
        RouterModule.register(routes),
        PublicacionesModule,
        ImagenesModule       
        ],
      exports: [RouterModule],
})
export class PrivadoModule {}
