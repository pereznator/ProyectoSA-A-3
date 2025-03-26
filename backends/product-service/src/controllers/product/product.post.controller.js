const pool = require('../../config/db');
const axios = require('axios');

const crearProducto = async (req, res) => {
    const {
        name,
        description,
        price,
        stock_quantity,
        code,
        main_image_url,
        value,
        category_name,
        marcas,
        regiones,
        imagenes
    } = req.body;

    // Validación básica
    if (
        !name || !description || !price || !stock_quantity || !code ||
        !category_name || !Array.isArray(marcas) || !Array.isArray(regiones) || !Array.isArray(imagenes)
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan campos obligatorios o los arrays no son válidos.'
        });
    }

    try {
        const marcasJson = JSON.stringify(marcas);
        const regionesJson = JSON.stringify(regiones);
        const imagenesJson = JSON.stringify(imagenes);

        const [rows] = await pool.query(
            'CALL CrearProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                name,
                description,
                price,
                stock_quantity,
                code,
                main_image_url,
                value,
                category_name,
                marcasJson,
                regionesJson,
                imagenesJson
            ]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al crear el producto.'
        });
    }
};

const agregarReviewProducto = async (req, res) => {
    const { product_id, user_id, rating, review } = req.body;

    if (!product_id || !user_id || !rating) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos product_id, user_id y rating son obligatorios.'
        });
    }

    try {
        // 1. Verificar si el usuario existe en auth-service
        const authURL = `${process.env.AUTH_SERVICE_URL}/api/user/obtener-usuario-por-id/${user_id}`;

        const userResponse = await axios.get(authURL);

        if (
            userResponse.status !== 200 ||
            userResponse.data.status !== 'success' ||
            userResponse.data.usuario.status !== 'active'
        ) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado o inactivo.'
            });
        }

        // 2. Insertar review en la BD
        const [rows] = await pool.query(
            'CALL AgregarReviewProducto(?, ?, ?, ?)',
            [product_id, user_id, rating, review || null]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        console.error(error);

        if (error.response?.status === 404) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado en el auth-service.'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Error al registrar la reseña.'
        });
    }
};


module.exports = {
    crearProducto, agregarReviewProducto
};
