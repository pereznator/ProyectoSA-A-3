const pool = require('../../config/db');

const actualizarPromocion = async (req, res) => {
    const {
        id,
        name,
        description,
        discount_percentage,
        start_date,
        end_date,
        is_active
    } = req.body;

    // Validación de campos obligatorios
    if (!id || !name || !discount_percentage || !start_date || !end_date || typeof is_active !== 'number') {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan campos obligatorios: id, name, discount_percentage, start_date, end_date, is_active.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ActualizarPromocion(?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                name,
                description || null,
                discount_percentage,
                start_date,
                end_date,
                is_active
            ]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar la promoción.'
        });
    }
};

module.exports = {
    actualizarPromocion
};
