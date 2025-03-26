const pool = require('../../config/db');

const activarUsuario = async (req, res) => {
    const { user_id } = req.body;

    // Validar que venga el ID
    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El campo user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query('CALL ActivarUsuario(?)', [user_id]);

        const resultado = rows[0][0]?.resultado;

        // Si el procedimiento devolvió un JSON en string, lo parseamos
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        // Devolver según el status del resultado
        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al activar el usuario.'
        });
    }
};

const actualizarEstadoReporte = async (req, res) => {
    const { report_id, estado } = req.body;

    // Validación de campos obligatorios
    if (!report_id || !estado) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos report_id y estado son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query('CALL ActualizarEstadoReporte(?, ?)', [report_id, estado]);

        const resultado = rows[0][0]?.resultado;

        // Parsear el resultado si viene como string
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
            message: 'Error al actualizar el estado del reporte.'
        });
    }
};

const actualizarPerfilUsuario = async (req, res) => {
    const { user_id, email, phone, addresses } = req.body;

    // Validación de campos obligatorios
    if (!user_id || !email || !phone || !Array.isArray(addresses)) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id, email, phone y addresses (como array) son obligatorios.'
        });
    }

    try {
        const addressesJson = JSON.stringify(addresses);

        const [rows] = await pool.query(
            'CALL ActualizarPerfilUsuario(?, ?, ?, ?)',
            [user_id, email, phone, addressesJson]
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
            message: 'Error al actualizar el perfil del usuario.'
        });
    }
};

const desactivarUsuario = async (req, res) => {
    const { user_id } = req.body;

    // Validación de campo requerido
    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El campo user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query('CALL DesactivarUsuario(?)', [user_id]);

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
            message: 'Error al desactivar el usuario.'
        });
    }
};

module.exports = { activarUsuario, actualizarEstadoReporte, actualizarPerfilUsuario
, desactivarUsuario
 };