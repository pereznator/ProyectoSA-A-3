// src/controllers/user/get.js

const pool = require('../../config/db');

const obtenerReportesUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL ObtenerReportesUsuarios()');

        const resultado = rows[0][0]?.resultado;

        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener los reportes de usuarios.'
        });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query('CALL ObtenerUsuarioPorId(?)', [user_id]);

        const resultado = rows[0][0]?.resultado;

        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener la información del usuario.'
        });
    }
};

const obtenerUsuariosNoAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL ObtenerUsuariosNoAdmin()');

        const resultado = rows[0][0]?.resultado;

        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener los usuarios.'
        });
    }
};

module.exports = {
    obtenerReportesUsuarios, obtenerUsuarioPorId, obtenerUsuariosNoAdmin
};
