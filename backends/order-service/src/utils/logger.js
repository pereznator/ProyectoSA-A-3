const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const Elasticsearch = require('winston-elasticsearch');
const path = require('path');

// Configuración del transporte para los logs rotativos
const transport = new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d' // Guarda los últimos 14 días
});

// ✅ Configuración del transporte para Elasticsearch
const esTransportOpts = {
    level: 'info', // Nivel de logs a enviar
    clientOpts: {
        node: 'https://elasticsearch.sa-app.svc.cluster.local:9200', // URL con HTTPS
        auth: {
            username: 'elastic',
            password: 'changeme'
        },
        ssl: {
            rejectUnauthorized: false // ⚠️ Permite conexiones sin un certificado verificado
        }
    },
    indexPrefix: 'sa-logs', // Prefijo del índice en Elasticsearch
    flushInterval: 2000,    // Intervalo para enviar los logs (2 segundos)
};

// Instancia de Elasticsearch como transporte
const esTransport = new Elasticsearch(esTransportOpts);

// ✅ Configuración del logger con Winston
const logger = winston.createLogger({
    level: 'info', // Niveles: error, warn, info, http, verbose, debug, silly
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // ✅ Enviar el log como JSON para Elasticsearch
    ),
    transports: [
        transport, // Logs en archivos rotativos
        esTransport, // Logs en Elasticsearch
        new winston.transports.Console() // Logs en consola
    ]
});

// ✅ Captura errores no controlados
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
});

module.exports = logger;
