import { Express } from 'express'

import morgan from 'morgan'
import { logger } from '@src/utils'

export const MorganInterceptor = (app: Express) =>
	app.use(
		morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', {
			stream: {
				write: message => logger.http(message.trim()),
			},
		})
	)
