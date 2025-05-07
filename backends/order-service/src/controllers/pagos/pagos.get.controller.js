const pool = require('../../config/db');
const logger = require('../../utils/logger');

const obtenerEstadoPago = async (req, res) => {
    logger.info('Obteniendo estado de pago...');
    const { order_id } = req.params;

    if (!order_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro order_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerEstadoPago(?)',
            [order_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        logger.error('Error al obtener estado de pago:', error);
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el estado del pago.'
        });
    }
};

module.exports = {
    obtenerEstadoPago
};
