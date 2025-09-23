import { Effect, pipe } from 'effect'
import { logger } from '@src/utils'
import { UserInput, UserModel } from '@src/models'
import { DatabaseHandler } from '@src/handlers'

export const getCount = Effect.tryPromise({
	try: () => {
		logger.debug('Count users')
		return UserModel.count()
	},
	catch: (error: unknown) => new DatabaseHandler.QueryError(error),
})

export const findOne = (
	idOrUsername: string | number | null = null,
	order: 'DESC' | 'ASC' = 'DESC'
) =>
	Effect.tryPromise({
		try: () => {
			logger.debug(idOrUsername ? `Find user ${idOrUsername}` : 'Find first user')
			return UserModel.findOne({
				order: [['id', order]],
				...(idOrUsername
					? {
							where: {
								...(typeof idOrUsername === 'number'
									? { id: idOrUsername }
									: { username: idOrUsername }),
							},
						}
					: {}),
			})
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	})

export const create = (input: UserInput) =>
	Effect.tryPromise({
		try: () => {
			logger.debug(`Create user ${input.username}`)
			return UserModel.create(input)
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	})

export const initializeUser = () =>
	getCount
		.pipe(
			Effect.flatMap(count => {
				if (count > 0) return findOne()
				return create({
					username: 'admin',
					password: 'admin',
				})
			})
		)
		.pipe(
			Effect.catchAll(error => {
				logger.error(`${error.title}, ${error.message}`)
				process.exit(1)
				return Effect.fail(error)
			}),
			Effect.runPromise
		)
