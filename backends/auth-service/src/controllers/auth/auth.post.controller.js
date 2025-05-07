const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const nodemailer = require('nodemailer');
const { parseJwtExpiration } = require('../../utils/jwtUtils'); 
const { getMailContent } = require("../../utils/mailContent");
const logger = require('../../utils/logger');


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

const iniciarSesionController = async (req, res) => {
    logger.info('Iniciando sesión...');
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

        const { user_id, role  } = parsedResult;
        
        const [rowsUsuario] = await pool.query('CALL ObtenerUsuarioPorId(?)', [user_id]);

        const resultadoUsuario = rowsUsuario[0][0]?.resultado;
        const usuarioEmail = resultadoUsuario.usuario.email;
        const usuarioNombre = resultadoUsuario.usuario.username;
        const status = resultadoUsuario.usuario.status;
        
        const token = jwt.sign(
            { user_id, role, username: usuarioNombre, email: usuarioEmail, status },
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
            // httpOnly: false,
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
        logger.error(`Error al iniciar sesión: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al iniciar sesión en el servidor.'
        });
    }
};

const registrarVerificacionEmail = async (req, res) => {
    logger.info('Registrando verificación de correo...');
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

        if (parsedResult.status !== 'success') {
            return res.status(400).json(parsedResult);
        }

        const [rowsUsuario] = await pool.query('CALL ObtenerUsuarioPorId(?)', [user_id]);
        
        const resultadoUsuario = rowsUsuario[0][0]?.resultado;

        const usuarioEmail = resultadoUsuario.usuario.email;
        const usuarioNombre = resultadoUsuario.usuario.username;
        const url = `${process.env.FRONTEND_URL}/auth/confirm-email/${token}?usr=${user_id}`;


        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });


        const mailOptions = {
            from: '"swaptify" <noreply@swaptify.com>',
            to: usuarioEmail,
            subject: `Bienvenido ${usuarioNombre} a Swaptify!`,
            html: getMailContent(url, usuarioNombre)
          };
          
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al enviar el correo de verificación.'
                });
            }
            return res.status(201).json(parsedResult);
        });
    } catch (error) {
        logger.error(`Error al registrar la verificación de correo: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al registrar la verificación de correo.'
        });
    }
};


const verificarCorreo = async (req, res) => {
    logger.info('Verificando correo...');
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
        logger.error(`Error al verificar el correo: ${error.message}`);
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al verificar el correo.'
        });
    }
};

module.exports = { iniciarSesionController, registrarVerificacionEmail, verificarCorreo};
