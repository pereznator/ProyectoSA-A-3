const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS correctamente
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Origen de la petición
    credentials: true, // Permitir el uso de cookies y JWT en el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
}));

// Routes
app.get('/', (req, res) => {
    res.json({ status: "success", message: 'API Working!' });
});

// Especificar rutas
app.use('/api', routes);

// Manejo de errores: Not Found
app.use((req, res) => {
    res.status(404).json({ status: "error", message: 'Not Found' });
});

// Manejo de errores general
app.use((err, req, res, next) => {
    res.status(500).json({ status: "error", message: err.message });
});

module.exports = app;