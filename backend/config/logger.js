import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { combine, timestamp, printf, colorize, json } = winston.format;

const logLevel = env.logLevel || (env.nodeEnv === 'production' ? 'info' : 'debug');

const devFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}]: ${message}${metaStr}`;
});

const prodFormat = combine(timestamp(), json());

const transports = [new winston.transports.Console()];

// Add file transports in production when logs dir exists or can be created
if (env.nodeEnv === 'production' && env.logDir) {
  const logsDir = path.isAbsolute(env.logDir) ? env.logDir : path.join(__dirname, '..', env.logDir);
  try {
    fs.mkdirSync(logsDir, { recursive: true });
    transports.push(new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }));
    transports.push(new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }));
  } catch (err) {
    // Fallback to console only if logs dir cannot be created
  }
}

const logger = winston.createLogger({
  level: logLevel,
  format: env.nodeEnv === 'production' ? prodFormat : combine(timestamp(), colorize(), devFormat),
  defaultMeta: { service: 'jade-collections-api' },
  transports,
});

// Create a stream for Morgan to write to Winston
export const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;
