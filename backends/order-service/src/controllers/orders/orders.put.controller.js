const pool = require('../../config/db');

const actualizarSeguimientoPedido = async (req, res) => {
    const { order_id, status, location } = req.body;

    if (!order_id || !status || !location) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos order_id, status y location son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ActualizarSeguimientoPedido(?, ?, ?)',
            [order_id, status, location]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(400).json(parsedResult);
        }

    } catch (error) {
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el seguimiento del pedido.'
        });
    }
};

module.exports = {
    actualizarSeguimientoPedido
};
