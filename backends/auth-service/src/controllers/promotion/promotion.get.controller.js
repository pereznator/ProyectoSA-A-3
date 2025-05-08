const pool = require('../../config/db');
const logger = require('../../utils/logger');

const obtenerPromocionesUsuario = async (req, res) => {
    logger.info('Obteniendo promociones del usuario...');
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerPromocionesUsuario(?)',
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
        logger.error(`Error al obtener las promociones del usuario: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener las promociones del usuario.'
        });
    }
};

const obtenerTodasPromociones = async (req, res) => {
    logger.info('Obteniendo todas las promociones...');
    try {
        const [rows] = await pool.query('CALL ObtenerTodasPromociones()');

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }
    } catch (error) {
        logger.error(`Error al obtener todas las promociones: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener todas las promociones.'
        });
    }
};

module.exports = {
    obtenerPromocionesUsuario,
    obtenerTodasPromociones
};
