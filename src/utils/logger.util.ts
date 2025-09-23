import config from 'config' // Actual config package instead of util preventing circular imports
import winston, { format } from 'winston'

export const logger = winston.createLogger({
	level: config.get<string>('logs.level'),
	transports: [
		new winston.transports.Console({
			format: format.combine(
				format(info => {
					info.level = info.level.toUpperCase()
					return info
				})(),
				format.colorize({ all: false, level: true }),
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				format.printf(({ level, message, timestamp }) => {
					return `[${timestamp as string}] ${level}: ${message as string}`
				})
			),
		}),
	],
})
