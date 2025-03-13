import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AccesosModule } from './accesos/accesos.module';
import { RegistrosModule } from './registros/registros.module';
import { AccesosService } from './accesos/accesos.service';
import { AccesosController } from './accesos/accesos.controller';
import { RegistrosService } from './registros/registros.service';
import { RegistrosController } from './registros/registros.controller';
import { PublicacionListarModule } from './publicacion/publicacionListar.module';



const routes:Routes=[
    {
        path:"public",
        children:[
            AccesosModule,
            RegistrosModule,
            PublicacionListarModule
        ]
    }
]

@Module({
    imports:[
        PublicacionListarModule,
        RouterModule.register(routes), AccesosModule, RegistrosModule],
        exports: [RouterModule],
        providers: [AccesosService, RegistrosService],
        controllers: [AccesosController, RegistrosController]


})
export class PublicoModule {}
