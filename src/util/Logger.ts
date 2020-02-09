import winston from "winston";

export const logger = (typeof window === 'undefined') ? winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.json(),
        winston.format.timestamp(),
    ),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'aoe2cm.log'}),
        new winston.transports.Console(),
    ]
}) : {
    info: (...args: any[]) => {
        console.log(...args);
    },
    error: (...args: any[]) => {
        console.log(...args);
    },
    debug: (...args: any[]) => {
        console.log(...args);
    }
} as winston.Logger;
