const pool = require('../../config/db');
const { callService } = require('../../utils/axiosHelper');
const logger = require('../../utils/logger');

const agregarFavorito = async (req, res) => {
    logger.info('Agregando producto a favoritos...');
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y product_id son obligatorios.'
        });
    }

    try {
        const { AUTH_SERVICE_URL, PRODUCT_SERVICE_URL } = process.env;

        // Verificar usuario
        const userCheck = await callService({
            baseUrl: AUTH_SERVICE_URL,
            endpoint: `/api/user/obtener-usuario-por-id/${user_id}`,
            method: 'GET'
        });

        if (!userCheck.success) {
            return res.status(404).json({
                status: 'error',
                message: 'El usuario no existe.'
            });
        }

        // Verificar producto
        const productCheck = await callService({
            baseUrl: PRODUCT_SERVICE_URL,
            endpoint: `/api/product/obtener-producto-por-id/${product_id}`,
            method: 'GET'
        });

        if (!productCheck.success) {
            return res.status(404).json({
                status: 'error',
                message: 'El producto no existe.'
            });
        }

        // Ejecutar procedimiento
        const [rows] = await pool.query(
            'CALL AgregarFavorito(?, ?)',
            [user_id, product_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        logger.error('Error al agregar producto a favoritos:', error);
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al agregar producto a favoritos.'
        });
    }
};

module.exports = {
    agregarFavorito
};
