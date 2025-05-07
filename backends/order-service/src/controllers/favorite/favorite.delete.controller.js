const pool = require('../../config/db');
const logger = require('../../utils/logger');

const eliminarFavorito = async (req, res) => {
    logger.info('Eliminando producto de favoritos...');
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({
            status: 'error',
            message: 'Los campos user_id y product_id son obligatorios.'
        });
    }

    try {
        const [rows] = await pool.query(
            'CALL EliminarFavorito(?, ?)',
            [user_id, product_id]
        );

        const resultado = rows[0][0]?.resultado;
        const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;

        if (parsedResult.status === 'success') {
            return res.status(200).json(parsedResult);
        } else {
            return res.status(404).json(parsedResult);
        }

    } catch (error) {
        logger.error('Error al eliminar producto de favoritos:', error);
        console.error(error.message || error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar producto de favoritos.'
        });
    }
};

module.exports = {
    eliminarFavorito
};
