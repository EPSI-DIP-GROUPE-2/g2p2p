import dotenv from 'dotenv'
dotenv.config({ quiet: true }) // Load environment

import 'config'
import { assignRoutes } from './/routes'
import { assignSockets } from './/sockets'
import { logger, config, database, jwt, crypto, socket } from '@src/utils'

import { UserService } from '@src/services'
import { Interceptors } from '@src/interceptors'

import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

export async function bootstrap() {
	const app = express()
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use(cookieParser())

	await crypto.loadEncryptionKeys()
	await jwt.loadJWTKeys()
	await database.connect()
	await UserService.initializeUser()

	// Assign Interceptors
	Interceptors.forEach(interceptor => interceptor(app))

	assignRoutes(app)

	const httpServer = createServer(app)

	const io = await socket.register(httpServer)
	assignSockets(io)

	return httpServer
}

/* istanbul ignore next */ // Ignore this block in test coverage
if (require.main === module)
	bootstrap()
		.then(httpServer => {
			const port = config.getSync<string>('http.port')
			httpServer.listen(port, () => logger.info(`HTTP server started on 0.0.0.0:${port}`))
		})
		.catch(err => {
			throw err
		})
