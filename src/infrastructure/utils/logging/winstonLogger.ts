import path from 'path';
import winston, { createLogger, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import envConf from '../../config/env.conf';

const logDir = path.join(process.cwd(), 'logs');

// Define the log format
const logFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	format.simple(),
	format.metadata({
		fillExcept: ['message', 'level', 'timestamp', 'label']
	}),
	format.printf(
		({
			timestamp,
			level,
			message,
			metadata
		}: winston.Logform.TransformableInfo & {
			timestamp?: string;
			metadata?: { [key: string]: unknown };
		}) => {
			const filePath = metadata?.file;

			return `${timestamp} [${level}]: ${message} ${filePath ? `\n[File Location]: ${filePath}` : ''}`;
		}
	)
);

const Transports: winston.transport[] = [
	new DailyRotateFile({
		filename: `${logDir}/%DATE%-error.log`, // Log files will be placed in the "logs" directory
		datePattern: 'YYYY-MM-DD', // Daily log rotation
		level: 'error', // Log error messages and above to this file
		zippedArchive: true // Compress old log files
	}),
	new DailyRotateFile({
		filename: `${logDir}/%DATE%-combined.log`,
		datePattern: 'YYYY-MM-DD',
		level: 'info', // Log info messages and above to this file
		zippedArchive: true
	})
];

if (envConf.NODE_ENV === 'dev') {
	Transports.push(new winston.transports.Console());
}

// Define the logger
const logger = createLogger({
	level: 'info', // Set your desired log level
	format: logFormat,
	transports: Transports
});

export default logger;
