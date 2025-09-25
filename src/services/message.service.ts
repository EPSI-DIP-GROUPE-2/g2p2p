import { Effect } from 'effect'
import { MessageModel } from '@src/models'
import { logger } from '@src/utils'
import { DatabaseHandler } from '@src/handlers'
import { socket } from '@src/utils'

export const create = ({
	from,
	to,
	content,
}: {
	from: MessageModel['from']
	to: MessageModel['to']
	content: MessageModel['content']
}) =>
	Effect.tryPromise({
		try: () => {
			logger.debug('Creating message')
			return MessageModel.create({
				from,
				to,
				content,
			})
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	}).pipe(
		Effect.tap(({ to, from, content, timestamp, status }) =>
			socket.emit('messages:append', { to, from, content, timestamp, status })
		)
	)

export const findAll = () =>
	Effect.tryPromise({
		try: () => {
			logger.debug('Listing messages')
			return MessageModel.findAll({ order: [['timestamp', 'DESC']] })
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	})
