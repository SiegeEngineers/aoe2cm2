import winston from "winston";
import 'winston-daily-rotate-file';

export const logger = (typeof window === 'undefined') ? winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({filename: 'log/error.log', level: 'error'}),
        new winston.transports.DailyRotateFile({filename: 'log/aoe2cm-%DATE%.log',
            datePattern: 'YYYY-MM-DD', maxSize: '20m', zippedArchive: true}),
        new winston.transports.Console(),
    ]
}) : {
    info: (...args: any[]) => {
        console.log(...args);
    },
    error: (...args: any[]) => {
        console.log(...args);
    },
    warn: (...args: any[]) => {
        console.log(...args);
    },
    debug: (...args: any[]) => {
        console.log(...args);
    }
} as winston.Logger;
