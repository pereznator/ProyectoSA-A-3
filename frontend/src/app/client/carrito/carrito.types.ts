export interface Carrito {
  id: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  carrito: {
    cliente_id: number;
    productos: {
      nombre_producto: string;
      producto_id: number;
      cantidad: number;
      precio_unidad: number;
    }[];
  }
}