create
    definer = root@`%` procedure ActivarUsuario(IN p_user_id int)
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
            'message', v_error_message
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia del usuario
    SELECT COUNT(*) INTO v_count FROM users WHERE id = p_user_id;
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado.';
    END IF;

    -- Activar cuenta
    UPDATE users
    SET status = 'active',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Usuario activado correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure ActualizarEstadoReporte(IN p_report_id int,
                                                         IN p_estado enum ('pending', 'reviewed', 'resolved', 'dismissed'))
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
            'message', v_error_message
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia del reporte
    SELECT COUNT(*) INTO v_exists FROM user_reports WHERE id = p_report_id;
    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El reporte no existe.';
    END IF;

    -- Actualizar estado y fecha
    UPDATE user_reports
    SET status = p_estado,
        reviewed_at = NOW()
    WHERE id = p_report_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Estado del reporte actualizado correctamente.',
        'report_id', p_report_id
    ) AS resultado;
END;

create
    definer = root@`%` procedure ActualizarPerfilUsuario(IN p_user_id int, IN p_email varchar(150),
                                                         IN p_phone varchar(20), IN p_addresses_json json)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_count INT;
    DECLARE v_primary_count INT;

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

    -- Validar que el usuario exista
    SELECT COUNT(*) INTO v_count FROM users WHERE id = p_user_id;
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado.';
    END IF;

    -- Validar que el nuevo correo no exista en otro usuario
    SELECT COUNT(*) INTO v_count FROM users WHERE email = p_email AND id <> p_user_id;
    IF v_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo ya está en uso por otro usuario.';
    END IF;

    -- Validar que solo una dirección sea principal
    SET v_primary_count = (
        SELECT COUNT(*)
        FROM JSON_TABLE(p_addresses_json, '$[*]' COLUMNS (
            is_primary BOOLEAN PATH '$.is_primary'
        )) AS jt
        WHERE jt.is_primary = TRUE
    );
    IF v_primary_count > 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo se permite una dirección principal.';
    END IF;

    -- Actualizar email y teléfono
    UPDATE users
    SET email = p_email,
        phone = p_phone,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;

    -- Eliminar direcciones anteriores
    DELETE FROM user_addresses WHERE user_id = p_user_id;

    -- Insertar nuevas direcciones
    SET @i = 0;
    SET @total = JSON_LENGTH(p_addresses_json);

    WHILE @i < @total DO
        SET @address = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].address')));
        SET @city = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].city')));
        SET @department = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].department')));
        SET @is_primary = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].is_primary')));

        INSERT INTO user_addresses (
            user_id, address, city, department, is_primary
        ) VALUES (
            p_user_id, @address, @city, @department, @is_primary
        );

        SET @i = @i + 1;
    END WHILE;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Perfil actualizado correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure CrearUsuario(IN p_first_name varchar(100), IN p_last_name varchar(100),
                                              IN p_email varchar(150), IN p_username varchar(100),
                                              IN p_password varchar(255), IN p_phone varchar(20), IN p_dob date,
                                              IN p_gender enum ('male', 'female'), IN p_role enum ('admin', 'user'),
                                              IN p_profile_picture varchar(255), IN p_addresses_json json)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_user_id INT;
    DECLARE v_primary_count INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al crear usuario: ', v_error_message)
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Validación: correo y username únicos
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email OR username = p_username) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Correo o username ya existe.';
    END IF;

    -- Insertar usuario
    INSERT INTO users (
        first_name, last_name, email, username, password,
        phone, dob, gender, profile_picture, role, status, created_at, updated_at
    ) VALUES (
        p_first_name, p_last_name, p_email, p_username, p_password,
        p_phone, p_dob, p_gender, p_profile_picture, p_role, 'inactive', NOW(), NOW()
    );

    SET v_user_id = LAST_INSERT_ID();

    -- Validación: solo una dirección principal
    SET v_primary_count = (
        SELECT COUNT(*)
        FROM JSON_TABLE(p_addresses_json, '$[*]' COLUMNS (
            is_primary BOOLEAN PATH '$.is_primary'
        )) AS jt
        WHERE jt.is_primary = TRUE
    );

    IF v_primary_count > 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Solo se permite una dirección primaria.';
    END IF;

    -- Recorrer e insertar direcciones
    SET @i = 0;
    SET @total = JSON_LENGTH(p_addresses_json);

    WHILE @i < @total DO
        SET @address = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].address')));
        SET @city = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].city')));
        SET @department = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].department')));
        SET @is_primary = JSON_UNQUOTE(JSON_EXTRACT(p_addresses_json, CONCAT('$[', @i, '].is_primary')));

        INSERT INTO user_addresses (
            user_id, address, city, department, is_primary, created_at, updated_at
        ) VALUES (
            v_user_id, @address, @city, @department, @is_primary, NOW(), NOW()
        );

        SET @i = @i + 1;
    END WHILE;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Usuario creado exitosamente.',
        'user_id', v_user_id
    ) AS resultado;
END;

create
    definer = root@`%` procedure DesactivarUsuario(IN p_user_id int)
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
            'message', v_error_message
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar existencia del usuario
    SELECT COUNT(*) INTO v_count FROM users WHERE id = p_user_id;
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado.';
    END IF;

    -- Desactivar cuenta
    UPDATE users
    SET status = 'inactive',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Usuario desactivado correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure IniciarSesion(IN p_login varchar(150), IN p_password varchar(255))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_user_id INT;
    DECLARE v_password VARCHAR(255);
    DECLARE v_role ENUM('admin', 'user');

    -- Manejo de errores general
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

    -- Intentar buscar por correo (si contiene @)
    IF p_login LIKE '%@%' THEN
        SELECT id, password, role INTO v_user_id, v_password, v_role
        FROM users
        WHERE email = p_login AND status = 'active';
    ELSE
        SELECT id, password, role INTO v_user_id, v_password, v_role
        FROM users
        WHERE username = p_login AND status = 'active';
    END IF;

    -- Validar existencia
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado o inactivo.';
    END IF;

    -- Validar contraseña
    IF v_password != p_password THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Contraseña incorrecta.';
    END IF;

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Inicio de sesión exitoso.',
        'user_id', v_user_id,
        'role', v_role
    ) AS resultado;
END;

create
    definer = root@`%` procedure ObtenerReportesUsuarios()
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_reportes_json JSON;

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

    -- Construir resultado con array de reportes
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Reportes obtenidos correctamente.',
        'reportes', JSON_ARRAYAGG(
            JSON_OBJECT(
                'report_id', r.id,
                'reported_user', JSON_OBJECT(
                    'id', ru.id,
                    'name', CONCAT(ru.first_name, ' ', ru.last_name)
                ),
                'reporter_user', IFNULL(JSON_OBJECT(
                    'id', ru2.id,
                    'name', CONCAT(ru2.first_name, ' ', ru2.last_name)
                ), NULL),
                'reason', r.reason,
                'status', r.status,
                'created_at', r.created_at,
                'reviewed_at', r.reviewed_at
            )
        )
    ) AS resultado
    FROM user_reports r
    JOIN users ru ON ru.id = r.reported_user_id
    LEFT JOIN users ru2 ON ru2.id = r.reporter_user_id;
END;

create
    definer = root@`%` procedure ObtenerUsuarioPorId(IN p_user_id int)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_count INT;
    DECLARE v_usuario_json JSON;

    -- Manejo centralizado de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', v_error_message,
            'usuario', NULL
        ) AS resultado;
    END;

    -- Verificar existencia del usuario
    SELECT COUNT(*) INTO v_count FROM users WHERE id = p_user_id;

    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado.';
    END IF;

    -- Construir JSON del usuario con direcciones
    SELECT JSON_OBJECT(
        'user_id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'email', u.email,
        'username', u.username,
        'phone', u.phone,
        'dob', u.dob,
        'gender', u.gender,
        'profile_picture', u.profile_picture,
        'status', u.status,
        'role', u.role,
        'created_at', u.created_at,
        'addresses', (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'address_id', a.id,
                    'address', a.address,
                    'city', a.city,
                    'department', a.department,
                    'is_primary', a.is_primary
                )
            )
            FROM user_addresses a
            WHERE a.user_id = u.id
        )
    )
    INTO v_usuario_json
    FROM users u
    WHERE u.id = p_user_id;

    -- Respuesta final
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Usuario obtenido correctamente.',
        'usuario', v_usuario_json
    ) AS resultado;
END;

create
    definer = root@`%` procedure ObtenerUsuariosNoAdmin()
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_usuarios_json JSON;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;

        IF v_error_message IS NULL THEN
            SET v_error_message = 'Error desconocido';
        END IF;

        SELECT JSON_OBJECT(
            'status', 'error',
            'message', CONCAT('Error al obtener usuarios: ', v_error_message)
        ) AS resultado;
    END;

    -- Obtener usuarios no admin en un JSON_ARRAY
    SELECT
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u.id,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'email', u.email,
                'username', u.username,
                'phone', u.phone,
                'dob', u.dob,
                'gender', u.gender,
                'profile_picture', u.profile_picture,
                'status', u.status,
                'role', u.role,
                'created_at', u.created_at
            )
        )
    INTO v_usuarios_json
    FROM users u
    WHERE u.role <> 'admin';

    -- Devolver JSON con el array y mensaje
    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Usuarios obtenidos correctamente.',
        'usuarios', v_usuarios_json
    ) AS resultado;
END;

create
    definer = root@`%` procedure RegistrarVerificacionEmail(IN p_user_id int, IN p_token varchar(255))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_user_exists INT;

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

    -- Verificar que el usuario exista
    SELECT COUNT(*) INTO v_user_exists FROM users WHERE id = p_user_id;
    IF v_user_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Usuario no encontrado.';
    END IF;

    -- (Opcional) Marcar verificaciones anteriores como usadas
    UPDATE email_verifications
    SET used = TRUE
    WHERE user_id = p_user_id AND used = FALSE;

    -- Insertar nuevo token
    INSERT INTO email_verifications (
        user_id, token, expires_at, used
    ) VALUES (
        p_user_id, p_token, NOW() + INTERVAL 2 MINUTE, FALSE
    );

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Verificación registrada correctamente.'
    ) AS resultado;
END;

create
    definer = root@`%` procedure ReportarUsuario(IN p_reported_user_id int, IN p_reporter_user_id int, IN p_reason text)
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_report_id INT;
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
            'message', v_error_message
        ) AS resultado;

        ROLLBACK;
    END;

    START TRANSACTION;

    -- Verificar que el usuario reportado exista
    SELECT COUNT(*) INTO v_count FROM users WHERE id = p_reported_user_id;
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario reportado no existe.';
    END IF;

    -- Insertar reporte
    INSERT INTO user_reports (
        reported_user_id, reporter_user_id, reason, status
    ) VALUES (
        p_reported_user_id, p_reporter_user_id, p_reason, 'pending'
    );

    SET v_report_id = LAST_INSERT_ID();

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Reporte registrado correctamente.',
        'report_id', v_report_id
    ) AS resultado;
END;

create
    definer = root@`%` procedure VerificarCorreo(IN p_token varchar(255))
BEGIN
    DECLARE v_error_message VARCHAR(255);
    DECLARE v_user_id INT;

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

    -- Validar token
    SELECT user_id INTO v_user_id
    FROM email_verifications
    WHERE token = p_token
      AND used = FALSE
      AND expires_at > NOW()
    LIMIT 1;

    -- Si no se encuentra, lanzar error
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El token es inválido, expiró o ya fue usado.';
    END IF;

    -- Marcar token como usado
    UPDATE email_verifications
    SET used = TRUE
    WHERE token = p_token;

    -- Activar cuenta si estaba inactiva
    UPDATE users
    SET status = 'active',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_user_id AND status <> 'active';

    COMMIT;

    SELECT JSON_OBJECT(
        'status', 'success',
        'message', 'Correo verificado correctamente.',
        'user_id', v_user_id
    ) AS resultado;
END;

