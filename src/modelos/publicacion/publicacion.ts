import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Acceso } from '../acceso/acceso';
import { Usuario } from '../usuario/usuario';
import { ImagenesPublicaciones } from '../imagenes_publicacion/ImagenesPublicacion';

export enum TipoVivienda {
  CASA = 'Casa',
  APARTAMENTO = 'Apartamento',
  FINCA = 'Finca',
  HABITACION = 'Habitacion',
}

@Entity('publicaciones', { schema: 'public' })
export class Publicacion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'cod_publicacion' })
  public codPublicacion: number;

  @Column({ type: 'integer', nullable: false, name: 'cod_usuario' })
  public codUsuario: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    name: 'titulo_publicacion',
  })
  public tituloPublicacion: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    name: 'contenido_publicacion',
  })
  public contenidoPublicacion: string;


  @Column({ type: 'integer', name: 'parqueadero' })
  public parqueadero: number;

  @Column({ type: 'integer', name: 'periodoAlquiler', nullable: true })
  public periodoAlquiler: number;

  @Column({ type: 'integer', name: 'estrato' })
  public estrato: number;

  @Column({ type: 'integer', name: 'servicios', nullable: true })
  public servicios: number;

  @Column({ type: 'integer', name: 'administracion', nullable: true })
  public administracion: number;

  @Column({ type: 'varchar', length: 250, name: 'metros', nullable: true })
  public metros: string;

  @Column({ type: 'varchar', length: 250, name: 'direccion', nullable: true })
  public direccion: string;

  @Column({ type: 'integer', name: 'habitaciones', nullable: true })
  public habitaciones: number;

  @Column({ type: 'integer', name: 'banios' })
  public banios: number;

  @Column({ type: 'integer', name: 'precios', nullable: true })
  public precio: number;




  @Column({ type: 'date', nullable: false, name: 'fecha_creacion_publicacion' })
  public fechaCreacionPublicacion: Date;

  //Relacion con usuarios
  @ManyToOne(() => Usuario, (objUsuario: Usuario) => objUsuario.Publicaciones, {
    onUpdate: 'RESTRICT',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cod_usuario', referencedColumnName: 'codUsuario' })
  public codUsu?: Usuario;

  //Enum para tipo de vivienda
  @Column({ type: 'enum', enum: TipoVivienda, default: TipoVivienda.CASA })
  tipo: TipoVivienda;


  //Recibo de imagen
  // Relación con imágenes de publicaciones
  @OneToMany(() => ImagenesPublicaciones, (imagen) => imagen.publicacion)
  public imagenes?: ImagenesPublicaciones[];

}
