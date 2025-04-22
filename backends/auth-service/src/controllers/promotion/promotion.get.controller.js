const pool = require('../../config/db');

const obtenerPromocionesUsuario = async (req, res) => {
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
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener las promociones del usuario.'
        });
    }
};

module.exports = {
    obtenerPromocionesUsuario
};
