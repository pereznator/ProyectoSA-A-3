const pool = require('../../config/db');
const logger = require('../../utils/logger');

const obtenerCarritoUsuario = async (req, res) => {
    logger.info('Obteniendo carrito del usuario...');
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerCarritoUsuario(?)',
            [user_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        logger.error('Error al obtener carrito del usuario:', error);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el carrito del usuario.'
        });
    }
};

module.exports = {
    obtenerCarritoUsuario
};
