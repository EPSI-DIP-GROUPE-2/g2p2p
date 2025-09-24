import { SocketUser } from './types/token.type'
import { Server, ExtendedError } from 'socket.io'

import { logger } from '@src/utils'
import { AuthMiddleware } from '@src/middlewares'

export let websocket: Server

export const assignSockets = (io: Server) => {
	websocket = io
	io.use(AuthMiddleware.socket)
	io.on('connection', s => {
		const socket = s as SocketUser
		logger.info(`${socket.user.username} connected via socket.`)
		socket.on('ping', () => {
			console.log('pong')
			io.send().to(socket.id)
		})
	})
}
