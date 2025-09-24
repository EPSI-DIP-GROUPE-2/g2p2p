import { Effect } from 'effect'
import { Server } from 'http'
import { Server as SocketIOServer } from 'socket.io'

import { logger } from '@src/utils'
import { SocketHandler } from '@src/handlers'

export let websocket: SocketIOServer

export const emit = <T>(channel: string, data: T) =>
	Effect.try({
		try: () => websocket.emit(channel, data),
		catch: error => new SocketHandler.SocketEmitError(error),
	}).pipe(
		Effect.catchAll(error => {
			logger.error(`${error.title}, ${error.message}`)
			return Effect.fail(error)
		})
	)

export const register = (httpServer: Server) =>
	Effect.try({
		try: () => {
			logger.info('WebSocket registered')
			return new SocketIOServer(httpServer)
		},
		catch: (error: unknown) => new SocketHandler.SocketRegisterError(error),
	}).pipe(
		Effect.tap(server => (websocket = server)),
		Effect.catchAll(error => {
			logger.error(`${error.title}, ${error.message}`)
			process.exit(1)
			return Effect.fail(error)
		}),
		Effect.runPromise
	)
