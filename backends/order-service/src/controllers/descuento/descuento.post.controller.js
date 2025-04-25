const pool = require('../../config/db');
const { callService } = require('../../utils/axiosHelper');

const generarDescuentoExclusivo = async (req, res) => {
    const { user_id, total_acumulado } = req.body;

    if (!user_id || !total_acumulado) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y total_acumulado son obligatorios.'
        });
    }

    try {
        const { AUTH_SERVICE_URL } = process.env;

        // Verificar si el usuario existe
        const userResponse = await callService({
            baseUrl: AUTH_SERVICE_URL,
            endpoint: `/api/user/obtener-usuario-por-id/${user_id}`,
            method: 'GET'
        });

        if (!userResponse.success) {
            return res.status(404).json(userResponse.data);
        }

        // Llamar al procedimiento para generar descuento
        const [rows] = await pool.query(
            'CALL GenerarDescuentoExclusivo(?, ?)',
            [user_id, total_acumulado]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al generar descuento exclusivo.'
        });
    }
};

module.exports = {
    generarDescuentoExclusivo
};
