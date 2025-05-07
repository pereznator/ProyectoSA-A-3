const pool = require('../../config/db');
const logger = require('../../utils/logger');

const eliminarPromocion = async (req, res) => {
    logger.info('Eliminando promoción...');
    const { promotion_id } = req.params;

    if (!promotion_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro promotion_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL EliminarPromocion(?)',
            [promotion_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        logger.error(`Error al eliminar la promoción: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar la promoción.'
        });
    }
};

module.exports = {
    eliminarPromocion
};
