const pool = require('../../config/db');
const logger = require('../../utils/logger');

const obtenerProductos = async (req, res) => {
    logger.info('Obteniendo productos...');
    try {
        const [rows] = await pool.query('CALL ObtenerProductos()');

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        logger.error('Error al obtener productos:', error);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener los productos.'
        });
    }
};
const obtenerProducto = async (req, res) => {
    logger.info('Obteniendo producto por id...');
    try {
        const { product_id } = req.params;

        if (!product_id) {
            return res.status(400).json({
                status: 'error',
                message: 'El parámetro product_id es obligatorio.'
            });
        }
        const [rows] = await pool.query('CALL ObtenerProductoPorId(?)', [product_id]);

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        logger.error('Error al obtener producto por id:', error);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener producto por id.'
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProducto
};
