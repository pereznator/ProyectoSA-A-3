const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Configuración del transporte para los logs rotativos
const transport = new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d' // Guarda los últimos 14 días
});

// Configuración de Winston
const logger = winston.createLogger({
    level: 'info', // Niveles: error, warn, info, http, verbose, debug, silly
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        transport,
        new winston.transports.Console()
    ]
});

// Captura errores no controlados
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
});

module.exports = logger;
