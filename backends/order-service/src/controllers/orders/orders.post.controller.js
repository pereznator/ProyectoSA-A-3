const pool = require('../../config/db');

const crearOrdenDesdeCarrito = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El campo user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL CrearOrdenDesdeCarrito(?)',
            [user_id]
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
            message: 'Error al crear la orden desde el carrito.'
        });
    }
};

module.exports = {
    crearOrdenDesdeCarrito
};
