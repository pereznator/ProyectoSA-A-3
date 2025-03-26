const pool = require('../../config/db');

const cerrarSesion = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El campo user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query('CALL CerrarSesion(?)', [user_id]);

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
            message: 'Error al cerrar la sesión del usuario.'
        });
    }
};

const expirarSesiones = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL ExpirarSesiones()');

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
            message: 'Error al expirar las sesiones.'
        });
    }
};

module.exports = {
    cerrarSesion, expirarSesiones
};
