const pool = require('../../config/db');
const logger = require('../../utils/logger');

const crearPromocion = async (req, res) => {
    logger.info('Creando promoción...');
    const {
        name,
        description,
        discount_percentage,
        start_date,
        end_date
    } = req.body;

    // Validación de campos obligatorios
    if (!name || !discount_percentage || !start_date || !end_date) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan campos obligatorios: name, discount_percentage, start_date, end_date.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL CrearPromocion(?, ?, ?, ?, ?)',
            [name, description || null, discount_percentage, start_date, end_date]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        logger.error(`Error al crear la promoción: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al crear la promoción.'
        });
    }
};

const asignarPromocion = async (req, res) => {
    logger.info('Asignando promoción a usuario...');
    const { user_id, promotion_id } = req.body;

    // Validación de campos obligatorios
    if (!user_id || !promotion_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y promotion_id son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL AsignarPromocionUsuario(?, ?)',
            [user_id, promotion_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        logger.error(`Error al asignar la promoción al usuario: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al asignar la promoción al usuario.'
        });
    }
};

const aplicarPromocion = async (req, res) => {
    logger.info('Aplicando promoción a usuario...');
    const { user_id, promotion_id } = req.body;

    // Validación de campos obligatorios
    if (!user_id || !promotion_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y promotion_id son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL AplicarPromocionUsuario(?, ?)',
            [user_id, promotion_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        logger.error(`Error al aplicar la promoción: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al aplicar la promoción.'
        });
    }
};


module.exports = {
    crearPromocion,
    asignarPromocion,
    aplicarPromocion
};
