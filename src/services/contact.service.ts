import { Effect } from 'effect'
import { logger, crypto, socket } from '@src/utils'
import { ContactModel } from '@src/models'
import { DatabaseHandler } from '@src/handlers'
import { ContactSchema } from '@src/schemas'

export const findAll = () =>
	Effect.tryPromise({
		try: () => {
			logger.debug('Find all contacts')
			return ContactModel.findAll()
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	})

export const create = ({ username, public_key }: ContactSchema.Create['body']) =>
	crypto.hashString(public_key).pipe(
		Effect.tap(() => logger.info('Create contact')),
		Effect.flatMap(identifier =>
			Effect.tryPromise({
				try: () =>
					ContactModel.create({
						username,
						public_key,
						identifier,
					}),
				catch: (error: unknown) => new DatabaseHandler.QueryError(error),
			})
		),
		Effect.tap(contact => socket.emit('contacts:append', contact))
	)
