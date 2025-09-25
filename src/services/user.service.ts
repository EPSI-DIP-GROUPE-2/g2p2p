import { Data, Effect } from 'effect'
import { logger, crypto } from '@src/utils'
import { UserInput, UserModel } from '@src/models'
import { DatabaseHandler } from '@src/handlers'
import { resolve4 } from 'dns'

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
	}).pipe(
		Effect.flatMap(result => {
			if (!result) return new DatabaseHandler.NotFound(DatabaseHandler.Models.USER)
			return Effect.succeed(result)
		})
	)

export const create = (input: UserInput) =>
	Effect.tryPromise({
		try: () => {
			logger.debug(`Create user ${input.username}`)
			return UserModel.create(input)
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	})

class Empty extends Data.TaggedError('Empty') {}

export const initializeUser = () =>
	getCount.pipe(
		Effect.andThen(count => {
			if (count === 0) return Effect.fail(new Empty())
			return findOne()
		}),
		Effect.catchTag('Empty', () =>
			crypto.keys.pipe(
				Effect.flatMap(({ publicKey }) => crypto.hashString(publicKey)),
				Effect.flatMap(identifier =>
					create({
						username: 'admin',
						password: 'admin',
						identifier,
					})
				)
			)
		),
		Effect.catchAll(error => {
			logger.error(`${error.title}, ${error.message}`)
			process.exit(1)
			return Effect.fail(error)
		}),
		Effect.runPromise
	)
