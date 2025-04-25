const axios = require('axios');

const callService = async ({ baseUrl, endpoint, method = 'GET', data = null }) => {
    try {
        const url = `${baseUrl}${endpoint}`;
        console.log('Llamando a URL:', url);

        const response = await axios({ method, url, data });

        const result = response.data;

        if (result.status === 'success') {
            return {
                success: true,
                data: result
            };
        } else {
            return {
                success: false,
                data: result
            };
        }

    } catch (error) {
        if (error.response) {
            // El servicio respondió con un código de error (404, 500, etc.)
            return {
                success: false,
                data: {
                    status: 'error',
                    message: error.response.data?.message || 'Respuesta de error del servicio externo.',
                    code: error.response.status
                }
            };
        } else {
            // Error de red, conexión, timeout, etc.
            return {
                success: false,
                data: {
                    status: 'error',
                    message: 'No se pudo establecer conexión con el servicio externo.'
                }
            };
        }
    }
};

module.exports = { callService };
