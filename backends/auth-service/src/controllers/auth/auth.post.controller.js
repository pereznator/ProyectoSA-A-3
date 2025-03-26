const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const { parseJwtExpiration } = require('../../utils/jwtUtils'); 

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

const iniciarSesionController = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Faltan campos por llenar' 
        });
    }

    try {
        const [rows] = await pool.query(`CALL IniciarSesion(?, ?)`, [login, password]);
        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status !== 'success') {
            return res.status(400).json(parsedResult);
        }

        const { user_id, role } = parsedResult;

        const token = jwt.sign(
            { user_id, role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        const expirationMs = parseJwtExpiration(JWT_EXPIRATION);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expirationMs);

        await pool.query('CALL GuardarSesionUsuario(?, ?, ?, ?, ?)', [
            user_id,
            token,
            req.ip || req.connection.remoteAddress,
            req.headers['user-agent'] || 'Desconocido',
            expiresAt
        ]);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            expires: expiresAt
        });

        return res.status(200).json({
            status: 'success',
            message: 'Inicio de sesión exitoso.',
            user_id,
            role
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al iniciar sesión en el servidor.'
        });
    }
};

const registrarVerificacionEmail = async (req, res) => {
    const { user_id, token } = req.body;

    if (!user_id || !token) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y token son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL RegistrarVerificacionEmail(?, ?)',
            [user_id, token]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(201).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al registrar la verificación de correo.'
        });
    }
};


const verificarCorreo = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            status: 'error',
            message: 'El campo token es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query('CALL VerificarCorreo(?)', [token]);

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
            message: 'Error al verificar el correo.'
        });
    }
};

module.exports = { iniciarSesionController, registrarVerificacionEmail, verificarCorreo};
