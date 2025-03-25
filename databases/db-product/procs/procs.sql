
create
    definer = root@`%` procedure AgregarReviewProducto(IN p_product_id int, IN p_user_id int, IN p_rating int, IN p_review text)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_exists INT;
    DECLARE v_review_id INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', v_error_message
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Validar que el producto exista
    SELECT COUNT(*) INTO v_exists FROM products WHERE id = p_product_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Producto no encontrado.';
    END IF;

    -- Validar que la calificación esté entre 1 y 5
    IF p_rating < 1 OR p_rating > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La calificación debe estar entre 1 y 5.';
    END IF;

    -- Insertar review
    INSERT INTO product_reviews (
        product_id, user_id, rating, review
    ) VALUES (
        p_product_id, p_user_id, p_rating, p_review
    );

    SET v_review_id = LAST_INSERT_ID();

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Reseña registrada correctamente.',
        'review_id', v_review_id
    ) AS resultado;
END;

create
    definer = root@`%` procedure CrearProducto(IN p_name varchar(150), IN p_description text, IN p_price decimal(10, 2),
                                               IN p_stock_quantity int, IN p_code varchar(50),
                                               IN p_main_image_url varchar(255), IN p_value decimal(10, 2),
                                               IN p_category_name varchar(100), IN p_marcas_json json,
                                               IN p_regiones_json json, IN p_imagenes_json json)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_product_id INT;
    DECLARE v_category_id INT;
    DECLARE v_brand_id INT;
    DECLARE v_region_id INT;
    DECLARE v_exists INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', v_error_message
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar o insertar categoría principal
    SELECT id INTO v_category_id FROM categories WHERE name = p_category_name LIMIT 1;

    IF v_category_id IS NULL THEN
        INSERT INTO categories(name) VALUES (p_category_name);
        SET v_category_id = LAST_INSERT_ID();
    END IF;

    -- Insertar producto
    INSERT INTO products (
        name, description, price, stock_quantity, category_id,
        main_image_url, code, value, status
    ) VALUES (
        p_name, p_description, p_price, p_stock_quantity, v_category_id,
        p_main_image_url, p_code, p_value, 'available'
    );

    SET v_product_id = LAST_INSERT_ID();

    -- Marcas: verificar o insertar y asociar
    SET @i = 0;
    SET @total = JSON_LENGTH(p_marcas_json);
    WHILE @i < @total DO
        SET @brand_name = JSON_UNQUOTE(JSON_EXTRACT(p_marcas_json, CONCAT('$[', @i, ']')));
    
        -- Verificar si existe la marca
        SELECT COUNT(*) INTO v_exists FROM brands WHERE name = @brand_name;
    
        IF v_exists = 0 THEN
            INSERT INTO brands(name) VALUES (@brand_name);
            SET v_brand_id = LAST_INSERT_ID();
        ELSE
            SELECT id INTO v_brand_id FROM brands WHERE name = @brand_name LIMIT 1;
        END IF;
    
        -- Asociar con el producto si no está ya asociada
        SELECT COUNT(*) INTO v_exists
        FROM product_brands
        WHERE product_id = v_product_id AND brand_id = v_brand_id;
    
        IF v_exists = 0 THEN
            INSERT INTO product_brands(product_id, brand_id)
            VALUES (v_product_id, v_brand_id);
        END IF;
    
        SET @i = @i + 1;
    END WHILE;


    -- Regiones restringidas
    SET @k = 0;
    SET @total_reg = JSON_LENGTH(p_regiones_json);
    WHILE @k < @total_reg DO
        SET @region_name = JSON_UNQUOTE(JSON_EXTRACT(p_regiones_json, CONCAT('$[', @k, ']')));
    
        -- Verificar si existe la región
        SELECT COUNT(*) INTO v_exists FROM regions WHERE name = @region_name;
    
        IF v_exists = 0 THEN
            INSERT INTO regions(name) VALUES (@region_name);
            SET v_region_id = LAST_INSERT_ID();
        ELSE
            SELECT id INTO v_region_id FROM regions WHERE name = @region_name LIMIT 1;
        END IF;
    
        -- Asociar con el producto si no está ya asociada
        SELECT COUNT(*) INTO v_exists
        FROM product_restricted_regions
        WHERE product_id = v_product_id AND region_id = v_region_id;
    
        IF v_exists = 0 THEN
            INSERT INTO product_restricted_regions(product_id, region_id)
            VALUES (v_product_id, v_region_id);
        END IF;
    
        SET @k = @k + 1;
    END WHILE;


    -- Imágenes adicionales
    SET @m = 0;
    SET @total_img = JSON_LENGTH(p_imagenes_json);
    WHILE @m < @total_img DO
        SET @img_url = JSON_UNQUOTE(JSON_EXTRACT(p_imagenes_json, CONCAT('$[', @m, ']')));
        INSERT INTO product_images(product_id, image_url, is_main_image)
        VALUES (v_product_id, @img_url, FALSE);
        SET @m = @m + 1;
    END WHILE;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Producto creado correctamente.',
        'product_id', v_product_id
    ) AS resultado;
END;

create
    definer = root@`%` procedure ObtenerProductos()
BEGIN
    DECLARE v_error_message VARCHAR(255);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', v_error_message
        ) AS resultado;
    END;

    -- Obtener productos con todo su detalle y rating promedio
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Productos obtenidos correctamente.',
        'productos', JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', p.id,
                'name', p.name,
                'description', p.description,
                'price', p.price,
                'stock_quantity', p.stock_quantity,
                'code', p.code,
                'value', p.value,
                'status', p.status,
                'main_image_url', p.main_image_url,
                'category', c.name,
                'rating', (
                    SELECT ROUND(AVG(r.rating), 1)
                    FROM product_reviews r
                    WHERE r.product_id = p.id
                ),
                'brands', (
                    SELECT JSON_ARRAYAGG(b.name)
                    FROM product_brands pb
                    JOIN brands b ON b.id = pb.brand_id
                    WHERE pb.product_id = p.id
                ),
                'restricted_regions', (
                    SELECT JSON_ARRAYAGG(r.name)
                    FROM product_restricted_regions pr
                    JOIN regions r ON r.id = pr.region_id
                    WHERE pr.product_id = p.id
                ),
                'images', (
                    SELECT JSON_ARRAYAGG(pi.image_url)
                    FROM product_images pi
                    WHERE pi.product_id = p.id AND pi.is_main_image = FALSE
                )
            )
        )
    ) AS resultado
    FROM products p
    JOIN categories c ON c.id = p.category_id;
END;