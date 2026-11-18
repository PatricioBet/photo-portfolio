import winston from 'winston'

const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

export function createLogger(service: string): winston.Logger {
  return winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'ISO8601' }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, service: svc, ...meta }) => {
        const base = `${timestamp} [${level.toUpperCase()}] ${svc || service}`
        return Object.keys(meta).length ? `${base} ${JSON.stringify(meta)}` : `${base} ${message}`
      })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  })
}
