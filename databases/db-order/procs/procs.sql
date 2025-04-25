
create
    definer = root@`%` procedure ActualizarSeguimientoPedido(IN p_order_id int,
                                                             IN p_status enum ('procesando', 'en camino', 'entregado'),
                                                             IN p_location varchar(255))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;
    DECLARE v_tracking_exists INT;

    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al actualizar el seguimiento del pedido: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Validar existencia de la orden
    SELECT COUNT(*) INTO v_exists FROM orders WHERE id = p_order_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La orden no existe.';
    END IF;

    -- Actualizar estado en tabla principal
    UPDATE orders
    SET status = CASE
                    WHEN p_status = 'en camino' THEN 'enviado'
                    WHEN p_status = 'entregado' THEN 'entregado'
                    ELSE status
                 END,
        updated_at = NOW()
    WHERE id = p_order_id;

    -- Verificar si ya existe tracking
    SELECT COUNT(*) INTO v_tracking_exists
    FROM order_tracking
    WHERE order_id = p_order_id;

    -- Insertar o actualizar seguimiento
    IF v_tracking_exists = 0 THEN
        INSERT INTO order_tracking (order_id, status, location)
        VALUES (p_order_id, p_status, p_location);
    ELSE
        UPDATE order_tracking
        SET status = p_status,
            location = p_location,
            updated_at = CURRENT_TIMESTAMP
        WHERE order_id = p_order_id;
    END IF;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Seguimiento actualizado correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure AgregarFavorito(IN p_user_id int, IN p_product_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al agregar favorito: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar si ya está en favoritos
    SELECT COUNT(*) INTO v_exists
    FROM favorites
    WHERE user_id = p_user_id AND product_id = p_product_id;

    IF v_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Este producto ya está en favoritos.';
    END IF;

    -- Insertar nuevo favorito
    INSERT INTO favorites (user_id, product_id)
    VALUES (p_user_id, p_product_id);

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Producto agregado a favoritos correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure AgregarProductoCarrito(IN p_user_id int, IN p_product_id int, IN p_quantity int,
                                                        IN p_unit_price decimal(10, 2))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_ya_agregado INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;
        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al agregar producto al carrito: ', v_error_message)
        ) AS resultado;
        ROLLBACK;
    END;

    START TRANSACTION;

    IF p_quantity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La cantidad debe ser mayor que 0.';
    END IF;

    SELECT COUNT(*) INTO v_ya_agregado
    FROM cart
    WHERE user_id = p_user_id AND product_id = p_product_id;

    IF v_ya_agregado = 0 THEN
        INSERT INTO cart (user_id, product_id, quantity, unit_price)
        VALUES (p_user_id, p_product_id, p_quantity, p_unit_price);
    ELSE
        UPDATE cart
        SET quantity = quantity + p_quantity,
            unit_price = p_unit_price,
            added_at = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id AND product_id = p_product_id;
    END IF;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Producto agregado al carrito correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure AplicarDescuentoExclusivo(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;
    DECLARE v_discount DECIMAL(5,2);
    DECLARE v_id INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al aplicar descuento exclusivo: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia de descuento activo
    SELECT COUNT(*) INTO v_exists
    FROM exclusive_discounts
    WHERE user_id = p_user_id AND used = 0 AND expires_at > NOW();

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no tiene un descuento exclusivo disponible.';
    END IF;

    -- Obtener ID y descuento
    SELECT id, discount_percentage INTO v_id, v_discount
    FROM exclusive_discounts
    WHERE user_id = p_user_id AND used = 0 AND expires_at > NOW()
    LIMIT 1;

    -- Marcar como usado
    UPDATE exclusive_discounts
    SET used = 1
    WHERE id = v_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Descuento exclusivo aplicado correctamente.',
        'descuento_aplicado', v_discount
    ) AS resultado;
END;

create
    definer = root@`%` procedure CrearOrdenDesdeCarrito(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_cart_count INT;
    DECLARE v_order_id INT;
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;
    DECLARE done INT DEFAULT 0;

    -- Cursor variables
    DECLARE v_product_id INT;
    DECLARE v_quantity INT;
    DECLARE v_unit_price DECIMAL(10,2);

    -- Cursor para recorrer carrito con precio
    DECLARE cur CURSOR FOR
        SELECT product_id, quantity, unit_price
        FROM cart
        WHERE user_id = p_user_id;

    -- Manejadores
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;
        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al crear orden: ', v_error_message)
        ) AS resultado;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Validar que haya productos en el carrito
    SELECT COUNT(*) INTO v_cart_count FROM cart WHERE user_id = p_user_id;
    IF v_cart_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El carrito del usuario está vacío.';
    END IF;

    -- Crear encabezado de orden
    INSERT INTO orders (user_id, total, status)
    VALUES (p_user_id, 0, 'pendiente');

    SET v_order_id = LAST_INSERT_ID();

    -- Procesar productos del carrito
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_product_id, v_quantity, v_unit_price;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET v_total = v_total + (v_unit_price * v_quantity);

        INSERT INTO order_items (
            order_id, product_id, quantity, unit_price
        ) VALUES (
            v_order_id, v_product_id, v_quantity, v_unit_price
        );
    END LOOP;
    CLOSE cur;

    -- Actualizar total final en la orden
    UPDATE orders SET total = v_total WHERE id = v_order_id;

    -- Limpiar carrito del usuario
    DELETE FROM cart WHERE user_id = p_user_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Orden creada correctamente.',
        'order_id', v_order_id,
        'total', v_total
    ) AS resultado;
END;

create
    definer = root@`%` procedure EliminarDescuentoExclusivo(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al eliminar el descuento exclusivo: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia de un descuento válido y no usado
    SELECT COUNT(*) INTO v_exists
    FROM exclusive_discounts
    WHERE user_id = p_user_id AND used = 0 AND expires_at > NOW();

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay descuento exclusivo activo para eliminar.';
    END IF;

    -- Eliminar el descuento válido
    DELETE FROM exclusive_discounts
    WHERE user_id = p_user_id AND used = 0 AND expires_at > NOW();

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Descuento exclusivo eliminado correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure EliminarFavorito(IN p_user_id int, IN p_product_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al eliminar favorito: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar que exista en favoritos
    SELECT COUNT(*) INTO v_exists
    FROM favorites
    WHERE user_id = p_user_id AND product_id = p_product_id;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no está en la lista de favoritos.';
    END IF;

    -- Eliminar de favoritos
    DELETE FROM favorites
    WHERE user_id = p_user_id AND product_id = p_product_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Producto eliminado de favoritos correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure EliminarProductoCarrito(IN p_user_id int, IN p_product_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al eliminar producto del carrito: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar si existe el producto en el carrito
    SELECT COUNT(*) INTO v_exists
    FROM cart
    WHERE user_id = p_user_id AND product_id = p_product_id;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no está en el carrito del usuario.';
    END IF;

    -- Eliminar el producto del carrito
    DELETE FROM cart
    WHERE user_id = p_user_id AND product_id = p_product_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Producto eliminado del carrito correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure GenerarDescuentoExclusivo(IN p_user_id int, IN p_total_acumulado decimal(10, 2))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;
    DECLARE v_level VARCHAR(20);
    DECLARE v_discount DECIMAL(5,2);
    DECLARE v_now DATETIME;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al generar descuento exclusivo: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    SET v_now = NOW();

    START TRANSACTION;

    -- Validar monto mínimo
    IF p_total_acumulado < 10000 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no cumple con el mínimo de Q10,000 para obtener un descuento.';
    END IF;

    -- Verificar si ya tiene un descuento activo o no usado
    SELECT COUNT(*) INTO v_exists
    FROM exclusive_discounts
    WHERE user_id = p_user_id AND used = 0 AND expires_at > v_now;

    IF v_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario ya tiene un descuento exclusivo activo.';
    END IF;

    -- Determinar nivel y porcentaje
    IF p_total_acumulado >= 10000 AND p_total_acumulado < 13000 THEN
        SET v_level = 'nivel1';
        SET v_discount = 5;
    ELSEIF p_total_acumulado >= 13000 AND p_total_acumulado < 17000 THEN
        SET v_level = 'nivel2';
        SET v_discount = 10;
    ELSE
        SET v_level = 'nivel3';
        SET v_discount = 20;
    END IF;

    -- Insertar descuento
    INSERT INTO exclusive_discounts (
        user_id, level, discount_percentage, expires_at, used
    ) VALUES (
        p_user_id, v_level, v_discount, DATE_ADD(v_now, INTERVAL 30 DAY), 0
    );

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', CONCAT('Descuento exclusivo de ', v_discount, '% asignado al usuario.'),
        'discount', v_discount,
        'nivel', v_level
    ) AS resultado;
END;

create
    definer = root@`%` procedure LimpiarCarritoUsuario(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_count INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al limpiar el carrito: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar si el carrito tiene productos
    SELECT COUNT(*) INTO v_count FROM cart WHERE user_id = p_user_id;

    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El carrito del usuario ya está vacío.';
    END IF;

    -- Eliminar todos los productos del carrito
    DELETE FROM cart WHERE user_id = p_user_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Carrito del usuario limpiado correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure ObtenerCarritoUsuario(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_count INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al obtener el carrito: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar si el usuario tiene productos en su carrito
    SELECT COUNT(*) INTO v_count FROM cart WHERE user_id = p_user_id;

    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El carrito del usuario está vacío.';
    END IF;

    -- Devolver contenido del carrito
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Carrito recuperado correctamente.',
        'carrito', JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', c.product_id,
                'quantity', c.quantity
            )
        )
    ) AS resultado
    FROM cart c
    WHERE c.user_id = p_user_id;

    COMMIT;
END;

create
    definer = root@`%` procedure ObtenerDescuentoExclusivo(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al obtener descuento exclusivo: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar si tiene un descuento activo
    SELECT COUNT(*) INTO v_exists
    FROM exclusive_discounts
    WHERE user_id = p_user_id AND used = 0 AND expires_at > NOW();

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no tiene un descuento exclusivo activo.';
    END IF;

    -- Devolver el descuento
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Descuento exclusivo encontrado.',
        'descuento', JSON_OBJECT(
            'user_id', user_id,
            'nivel', level,
            'porcentaje', discount_percentage,
            'vence_en', expires_at
        )
    ) AS resultado
    FROM exclusive_discounts
    WHERE user_id = p_user_id AND used = 0 AND expires_at > NOW()
    LIMIT 1;

    COMMIT;
END;

create
    definer = root@`%` procedure ObtenerDetalleOrden(IN p_order_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al obtener detalle de orden: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia de la orden
    SELECT COUNT(*) INTO v_exists FROM orders WHERE id = p_order_id;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La orden no existe.';
    END IF;

    -- Devolver detalle de productos
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Detalle de la orden obtenido correctamente.',
        'productos', JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', oi.product_id,
                'cantidad', oi.quantity,
                'precio_unitario', oi.unit_price,
                'subtotal', oi.quantity * oi.unit_price
            )
        )
    ) AS resultado
    FROM order_items oi
    WHERE oi.order_id = p_order_id;

    COMMIT;
END;

create
    definer = root@`%` procedure ObtenerEstadoPago(IN p_order_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;
    DECLARE v_status VARCHAR(20);
    DECLARE v_method VARCHAR(30);
    DECLARE v_amount DECIMAL(10,2);
    DECLARE v_paid_at DATETIME;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al consultar el estado del pago: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Validar existencia de la orden
    SELECT COUNT(*) INTO v_exists FROM orders WHERE id = p_order_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La orden no existe.';
    END IF;

    -- Obtener último pago
    SELECT method, amount, status, paid_at
    INTO v_method, v_amount, v_status, v_paid_at
    FROM payments
    WHERE order_id = p_order_id
    ORDER BY paid_at DESC
    LIMIT 1;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Estado del pago obtenido correctamente.',
        'pago', JSON_OBJECT(
            'estado', v_status,
            'monto', v_amount,
            'metodo', v_method,
            'fecha_pago', v_paid_at
        )
    ) AS resultado;
END;

create
    definer = root@`%` procedure ObtenerFavoritosUsuario(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_count INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al obtener favoritos: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar si tiene productos favoritos
    SELECT COUNT(*) INTO v_count
    FROM favorites
    WHERE user_id = p_user_id;

    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario no tiene productos en favoritos.';
    END IF;

    -- Devolver lista de favoritos
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Lista de productos favoritos obtenida correctamente.',
        'favoritos', JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', product_id,
                'agregado_el', added_at
            )
        )
    ) AS resultado
    FROM favorites
    WHERE user_id = p_user_id;

    COMMIT;
END;

create
    definer = root@`%` procedure ObtenerHistorialOrdenes(IN p_user_id int, IN p_rango_tiempo varchar(10))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_fecha_inicio DATETIME;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al obtener historial de órdenes: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Calcular fecha de inicio según rango
    IF p_rango_tiempo = '30d' THEN
        SET v_fecha_inicio = DATE_SUB(NOW(), INTERVAL 30 DAY);
    ELSEIF p_rango_tiempo = '6m' THEN
        SET v_fecha_inicio = DATE_SUB(NOW(), INTERVAL 6 MONTH);
    ELSEIF p_rango_tiempo = '12m' THEN
        SET v_fecha_inicio = DATE_SUB(NOW(), INTERVAL 12 MONTH);
    ELSEIF p_rango_tiempo = 'all' THEN
        SET v_fecha_inicio = '1900-01-01';
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rango de tiempo inválido. Usa: 30d, 6m, 12m o all.';
    END IF;

    -- Devolver historial de órdenes
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Órdenes recuperadas correctamente.',
        'ordenes', JSON_ARRAYAGG(
            JSON_OBJECT(
                'order_id', o.id,
                'fecha', o.created_at,
                'estado', o.status,
                'total', o.total
            )
        )
    ) AS resultado
    FROM orders o
    WHERE o.user_id = p_user_id AND o.created_at >= v_fecha_inicio;

    COMMIT;
END;

create
    definer = root@`%` procedure ObtenerMontoTotalAcumulado(IN p_user_id int, IN p_rango varchar(10))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_fecha_inicio DATETIME;
    DECLARE v_total DECIMAL(10,2);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al calcular total acumulado: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Determinar rango de fechas
    IF p_rango = '30d' THEN
        SET v_fecha_inicio = DATE_SUB(NOW(), INTERVAL 30 DAY);
    ELSEIF p_rango = '6m' THEN
        SET v_fecha_inicio = DATE_SUB(NOW(), INTERVAL 6 MONTH);
    ELSEIF p_rango = '12m' THEN
        SET v_fecha_inicio = DATE_SUB(NOW(), INTERVAL 12 MONTH);
    ELSEIF p_rango = 'all' THEN
        SET v_fecha_inicio = '1900-01-01';
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rango inválido. Usa 30d, 6m, 12m o all.';
    END IF;

    -- Calcular total gastado
    SELECT IFNULL(SUM(total), 0) INTO v_total
    FROM orders
    WHERE user_id = p_user_id AND created_at >= v_fecha_inicio;

    COMMIT;

    -- Devolver total en JSON
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Total acumulado calculado correctamente.',
        'total_gastado', v_total,
        'rango', p_rango
    ) AS resultado;
END;

create
    definer = root@`%` procedure ObtenerSeguimientoPedido(IN p_order_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;
    DECLARE v_tracking_status VARCHAR(50);
    DECLARE v_location VARCHAR(255);
    DECLARE v_updated_at DATETIME;

    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al obtener seguimiento del pedido: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia de la orden
    SELECT COUNT(*) INTO v_exists FROM orders WHERE id = p_order_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La orden no existe.';
    END IF;

    -- Verificar existencia de seguimiento
    SELECT COUNT(*) INTO v_exists FROM order_tracking WHERE order_id = p_order_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay información de seguimiento disponible para esta orden.';
    END IF;

    -- Obtener datos del tracking
    SELECT status, location, updated_at
    INTO v_tracking_status, v_location, v_updated_at
    FROM order_tracking
    WHERE order_id = p_order_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Seguimiento obtenido correctamente.',
        'tracking', JSON_OBJECT(
            'estado', v_tracking_status,
            'ubicacion', v_location,
            'ultima_actualizacion', v_updated_at
        )
    ) AS resultado;
END;

create
    definer = root@`%` procedure RegistrarPago(IN p_order_id int,
                                               IN p_method enum ('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo'),
                                               IN p_amount decimal(10, 2))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_pago_existente INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al registrar el pago: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia de la orden
    SELECT COUNT(*) INTO v_exists FROM orders WHERE id = p_order_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La orden no existe.';
    END IF;

    -- Verificar si ya existe un pago registrado
    SELECT COUNT(*) INTO v_pago_existente
    FROM payments
    WHERE order_id = p_order_id AND status = 'pagado';

    IF v_pago_existente > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe un pago registrado para esta orden.';
    END IF;

    -- Verificar monto correcto
    SELECT total INTO v_total FROM orders WHERE id = p_order_id;
    IF p_amount != v_total THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El monto del pago no coincide con el total de la orden.';
    END IF;

    -- Insertar el pago
    INSERT INTO payments (order_id, method, amount, status, paid_at)
    VALUES (p_order_id, p_method, p_amount, 'pagado', NOW());

    -- Cambiar estado de orden a 'procesando'
    UPDATE orders SET status = 'procesando' WHERE id = p_order_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Pago registrado correctamente.'
    ) AS resultado;
END;