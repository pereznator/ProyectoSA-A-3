export interface Producto {
  id: number;
  portada: string;
  nombre: string;
  categoriaId: number;
  precio: number;
  costo: number;
  fecha: Date;
  descripcion: string;
  proveedorId: string;
  categoria?: string;
  proveedor?: string;
  enExistencia?: number;
}