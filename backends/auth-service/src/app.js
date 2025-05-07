const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const { generateUploadUrl } = require("./controllers/gcloud/generate-upload-url")
const logger = require('./utils/logger');


const app = express();

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar CORS correctamente
app.use(cors({
    origin: [process.env.CORS_ORIGIN, process.env.PRODUCT_SERVICE_URL],
    credentials: true, // Permitir el uso de cookies y JWT en el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
}));

// Routes
app.get('/', (req, res) => {
    logger.info('API Working!');
    res.json({ status: "success", message: 'API Working!' });
});

// Especificar rutas
app.use('/api', routes);
app.get("/generate-upload-url", generateUploadUrl);

// Manejo de errores: Not Found
app.use((req, res) => {
    logger.error(`Not Found: ${req.originalUrl}`);
    res.status(404).json({ status: "error", message: 'Not Found' });
});

// Manejo de errores general
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ status: "error", message: err.message });
});

module.exports = app;
