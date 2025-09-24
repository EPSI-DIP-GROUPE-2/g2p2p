import { Effect } from 'effect'
import { MessageModel } from '@src/models'
import { logger } from '@src/utils'
import { DatabaseHandler } from '@src/handlers'

export const create = (o: {
	from: MessageModel['from']
	to: MessageModel['to']
	content: MessageModel['content']
}) =>
	Effect.gen(function* () {
		const { from, to, content } = o

		return yield* Effect.tryPromise({
			try: () => {
				logger.debug('Creating message')
				return MessageModel.create({
					from,
					to,
					content,
				})
			},
			catch: (error: unknown) => new DatabaseHandler.QueryError(error),
		})
	})
