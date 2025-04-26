const pool = require('../../config/db');

const obtenerHistorialOrdenes = async (req, res) => {
    const { user_id, rango } = req.query;

    if (!user_id || !rango) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y rango son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerHistorialOrdenes(?, ?)',
            [user_id, rango]
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
            message: 'Error al obtener el historial de órdenes.'
        });
    }
};


const obtenerDetalleOrden = async (req, res) => {
    const { order_id } = req.params;

    if (!order_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro order_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerDetalleOrden(?)',
            [order_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el detalle de la orden.'
        });
    }
};

const obtenerMontoTotalAcumulado = async (req, res) => {
    const { user_id, rango } = req.query;

    if (!user_id || !rango) {
        return res.status(400).json({
            status: 'error',
            message: 'Los parámetros user_id y rango son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerMontoTotalAcumulado(?, ?)',
            [user_id, rango]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el monto total acumulado.'
        });
    }
};

const obtenerTodasLasOrdenes = async (req, res) => {
    let { estado } = req.query;

    if (!estado) {
        estado = '';
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerTodasOrdenes(?)',
            [estado]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el monto total acumulado.'
        });
    }
};

const obtenerSeguimientoPedido = async (req, res) => {
    const { order_id } = req.params;

    if (!order_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El parámetro order_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL ObtenerSeguimientoPedido(?)',
            [order_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener el seguimiento del pedido.'
        });
    }
};


module.exports = {
    obtenerHistorialOrdenes,
    obtenerDetalleOrden,
    obtenerMontoTotalAcumulado,
    obtenerSeguimientoPedido,
    obtenerTodasLasOrdenes
};
