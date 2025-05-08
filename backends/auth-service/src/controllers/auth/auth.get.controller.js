const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const { parseJwtExpiration } = require('../../utils/jwtUtils'); 
const logger = require('../../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;
const validarTokenController = async (req, res) => {
    logger.info('Validando token...');
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso no autorizado. No se encontró un token.'
        });
    }

    try {
        // Verificar que el token JWT sea válido
        const decoded = jwt.verify(token, JWT_SECRET);
        const user_id = decoded.user_id;

        // Consultar si el token está activo en la base
        const [rows] = await pool.query('CALL ValidarTokenUsuario(?)', [token]);

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json({
                status: 'success',
                message: 'Token válido.',
                user_id,
                expires_at: parsedResult.expires_at
            });
        } else {
            return res.status(403).json(parsedResult);
        }

    } catch (error) {
        logger.error(`Error al validar el token: ${error.message}`);
        console.error(error);
        return res.status(403).json({
            status: 'error',
            message: 'Token inválido o expirado. Debe iniciar sesión nuevamente.'
        });
    }
};

module.exports = {
    validarTokenController
};