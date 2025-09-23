import dotenv from 'dotenv'
dotenv.config({ quiet: true }) // Load environment

import 'config'
import { assignRoutes } from './routes'
import { logger, config, database, jwt } from '@src/utils'

import { UserService } from '@src/services'
import { Interceptors } from '@src/interceptors'

import express from 'express'

export async function bootstrap() {
	const app = express()

	await jwt.loadJWTKeys()
	await database.connect()
	await UserService.initializeUser()

	// Assign Interceptors
	Interceptors.forEach(interceptor => interceptor(app))

	assignRoutes(app)

	return app
}

/* istanbul ignore next */ // Ignore this block in test coverage
if (require.main === module)
	bootstrap()
		.then(app => {
			const port = config.getSync<string>('http.port')
			app.listen(port, () => logger.info(`HTTP server started on 0.0.0.0:${port}`))
		})
		.catch(err => {
			throw err
		})
