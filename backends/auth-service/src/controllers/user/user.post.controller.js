const pool = require('../../config/db');

const crearUsuario = async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        username,
        password,
        phone,
        dob,
        gender,
        role,
        profile_picture,
        addresses
    } = req.body;

    // Validación de campos obligatorios
    if (
        !first_name || !last_name || !email || !username || !password ||
        !phone || !dob || !gender || !role || !Array.isArray(addresses)
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan campos obligatorios o addresses no es un array válido.'
        });
    }

    try {
        const addressesJson = JSON.stringify(addresses);

        const [rows] = await pool.query(
            'CALL CrearUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                first_name,
                last_name,
                email,
                username,
                password,
                phone,
                dob,
                gender,
                role,
                profile_picture || null,
                addressesJson
            ]
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
            message: 'Error al registrar el usuario.'
        });
    }
};

const reportarUsuario = async (req, res) => {
    const { reported_user_id, reporter_user_id, reason } = req.body;

    if (!reported_user_id || !reason) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos reported_user_id y reason son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ReportarUsuario(?, ?, ?)',
            [reported_user_id, reporter_user_id || null, reason]
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
            message: 'Error al registrar el reporte.'
        });
    }
};


module.exports = {
    crearUsuario, reportarUsuario
};
