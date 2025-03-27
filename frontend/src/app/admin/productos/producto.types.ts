// export interface Producto {
//   id: number;
//   portada: string;
//   nombre: string;
//   categoriaId: number;
//   precio: number;
//   costo: number;
//   fecha: Date;
//   descripcion: string;
//   proveedorId: string;
//   categoria?: string;
//   proveedor?: string;
//   enExistencia?: number;
// }

export interface Producto {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  code: string;
  main_image_url: string;
  value: number;
  category_name: string;
  marcas: string[];
  regiones: string[];
  imagenes: string[];
  brands?: string[];
  status: string;
}
