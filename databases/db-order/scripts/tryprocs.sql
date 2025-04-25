CALL ObtenerDescuentoExclusivo(3);
CALL AplicarDescuentoExclusivo(3);
CALL CrearOrdenDesdeCarrito(3);
CALL ObtenerHistorialOrdenes(3, '30d');
CALL ObtenerDetalleOrden(1);
CALL ObtenerMontoTotalAcumulado(3, '30d');
CALL AgregarFavorito(3, 5);
CALL EliminarFavorito(3, 5);
CALL ObtenerFavoritosUsuario(3);
CALL RegistrarPago(1, 'tarjeta_credito', 3797.98);
CALL ObtenerEstadoPago(1);
CALL ActualizarSeguimientoPedido(1, 'en camino', 'En ruta a zona 7');
CALL ActualizarSeguimientoPedido(1, 'entregado', 'Entregado al cliente');
CALL ObtenerSeguimientoPedido(1);


