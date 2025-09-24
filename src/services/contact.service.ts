import { Effect } from 'effect'
import { logger } from '@src/utils'
import { ContactModel } from '@src/models'
import { DatabaseHandler } from '@src/handlers'

export const findAll = () =>
	Effect.tryPromise({
		try: () => {
			logger.debug('Find all contacts')
			return ContactModel.findAll()
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	})
