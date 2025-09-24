import { Effect } from 'effect'
import { logger, crypto } from '@src/utils'
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
	Effect.gen(function* () {
		const identifier = yield* crypto.hashString(public_key)

		return yield* Effect.tryPromise({
			try: () => {
				logger.info('Create contact')
				return ContactModel.create({
					username,
					public_key,
					identifier,
				})
			},
			catch: (error: unknown) => new DatabaseHandler.QueryError(error),
		})
	})
