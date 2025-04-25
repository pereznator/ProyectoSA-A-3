const pool = require('../../config/db');
const { callService } = require('../../utils/axiosHelper');

const agregarProductoCarrito = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({
            status: 'error',
            message: 'Faltan campos obligatorios (user_id, product_id, quantity).'
        });
    }

    try {
        const { PRODUCT_SERVICE_URL, AUTH_SERVICE_URL } = process.env;

        // Verificar usuario
        const userResponse = await callService({
            baseUrl: AUTH_SERVICE_URL,
            endpoint: `/api/user/obtener-usuario-por-id/${user_id}`,
            method: 'GET'
        });

        if (!userResponse.success) {
            return res.status(404).json(userResponse.data);
        }

        // Verificar producto
        const productResponse = await callService({
            baseUrl: PRODUCT_SERVICE_URL,
            endpoint: `/api/product/obtener-producto-por-id/${product_id}`,
            method: 'GET'
        });

        if (!productResponse.success) {
            return res.status(404).json(productResponse.data);
        }

        const producto = productResponse.data.producto;

        // Verificar estado del producto
        if (producto.status !== 'available') {
            return res.status(400).json({
                status: 'error',
                message: 'Este producto no está disponible actualmente.'
            });
        }

        // Verificar stock disponible
        if (quantity > producto.stock_quantity) {
            return res.status(400).json({
                status: 'error',
                message: `La cantidad solicitada (${quantity}) excede el stock disponible (${producto.stock_quantity}).`
            });
        }
        
        const precio = producto.price;

        // Insertar al carrito
        const [rows] = await pool.query(
            'CALL AgregarProductoCarrito(?, ?, ?, ?)',
            [user_id, product_id, quantity, precio]
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
            message: 'Error al agregar producto al carrito.'
        });
    }
};

module.exports = {
    agregarProductoCarrito
};
