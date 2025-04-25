const pool = require('../../config/db');

const eliminarProductoCarrito = async (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y product_id son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL EliminarProductoCarrito(?, ?)',
            [user_id, product_id]
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
            message: 'Error al eliminar el producto del carrito.'
        });
    }
};

const limpiarCarritoUsuario = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            status: 'error',
            message: 'El campo user_id es obligatorio.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL LimpiarCarritoUsuario(?)',
            [user_id]
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
            message: 'Error al limpiar el carrito del usuario.'
        });
    }
};

module.exports = {
    eliminarProductoCarrito,
    limpiarCarritoUsuario
};
