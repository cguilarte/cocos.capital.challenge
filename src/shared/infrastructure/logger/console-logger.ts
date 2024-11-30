import path from 'path';
import fs from 'fs';
import winston from 'winston';
import { config } from '../config';

// Crear directorio de logs en la raíz del proyecto
const pathLog = path.join(process.cwd(), 'logs');
if (!fs.existsSync(pathLog)) {
  fs.mkdirSync(pathLog, { recursive: true });
}

// Configuración de variables del entorno
const { LOGGER = false, APPLICATION_NAME = 'app' } = config.server;
const LOG_LEVEL_CONSOLE = LOGGER ? 'error' : 'debug';
const LOG_LEVEL_FILE = 'info';

// Formato Reutilizable para el Logger
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp }) =>
    `[${level.toUpperCase()}]: ${timestamp} - ${message}`
  )
);

// Crear instancia del Logger
const logger = winston.createLogger({
  transports: [
    // Transporte de Consola
    new winston.transports.Console({
      level: LOG_LEVEL_CONSOLE,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // Transporte de Archivo
    new winston.transports.File({
      level: LOG_LEVEL_FILE,
      handleExceptions: true,
      format: logFormat,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      filename: path.join(pathLog, `${APPLICATION_NAME}.log`), // Usa path.join para asegurar compatibilidad
    }),
  ],
  exitOnError: false, // Evita que el proceso termine en excepciones
});

// Exporta el logger
export default logger;
