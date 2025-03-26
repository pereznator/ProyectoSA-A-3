const pool = require('../../config/db');

const obtenerProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('CALL ObtenerProductos()');

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
            message: 'Error al obtener los productos.'
        });
    }
};

module.exports = {
    obtenerProductos
};
