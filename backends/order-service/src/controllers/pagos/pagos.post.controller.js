const pool = require('../../config/db');
const logger = require('../../utils/logger');

const registrarPago = async (req, res) => {
    logger.info('Registrando pago...');
    const { order_id, method, amount } = req.body;

    if (!order_id || !method || !amount) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos order_id, method y amount son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL RegistrarPago(?, ?, ?)',
            [order_id, method, amount]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        logger.error('Error al registrar el pago:', error);
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al registrar el pago.'
        });
    }
};

module.exports = {
    registrarPago
};
