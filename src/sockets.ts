import { SocketUser } from './types/token.type'
import { Server } from 'socket.io'

import { logger } from '@src/utils'
import { AuthMiddleware } from '@src/middlewares'

export const assignSockets = (io: Server) => {
	io.use(AuthMiddleware.socket)
	io.on('connection', s => {
		const socket = s as SocketUser
		logger.info(`${socket.user.username} connected via socket.`)
		socket.on('ping', () => io.to(socket.id).emit('pong', socket.user.username))
	})
}
