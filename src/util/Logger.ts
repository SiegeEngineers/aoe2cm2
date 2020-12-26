import winston from "winston";

export const logger = (typeof window === 'undefined') ? winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'aoe2cm.log', maxsize: 10485760}),
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
