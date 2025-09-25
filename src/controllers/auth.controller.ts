import { Effect, Data } from 'effect'
import { Request, Response } from 'express'
import { AuthSchema } from '@src/schemas'
import { UserService } from '@src/services'
import { config, crypto, jwt, logger } from '@src/utils'
import { Json } from '@src/types/response.type'
import { AccessToken } from '@src/types/token.type'
import { ResponseHandler } from '@src/handlers'

class InvalidPasswordError extends Data.TaggedError('InvalidPassword') {}

export const loginHandler = (
	{ body }: Request<unknown, unknown, AuthSchema.Login['body']>,
	res: Response
) =>
	Effect.gen(function* () {
		const user = yield* UserService.findOne(body.username)

		const hashed = yield* crypto.hashString(body.password)
		if (hashed !== user.password) return yield* Effect.fail(new InvalidPasswordError())

		const token = yield* jwt.sign({
			expire: yield* config.get<number>('jwt.expire'),
			sub: user.id,
			username: user.username,
		} as AccessToken)

		const cookieName = yield* config.get<string>('jwt.cookie')

		res.cookie(cookieName, token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: yield* config.get<boolean>('jwt.secure'),
			expires: new Date(new Date().getTime() + (yield* config.get<number>('jwt.expire'))),
			path: '/',
		})

		return yield* Effect.succeed({
			status: 200,
		} as Json)
	}).pipe(
		Effect.catchTags({
			DatabaseNotFound: error => Effect.succeed(error.response),
			InvalidPassword: () =>
				Effect.succeed({
					status: 400,
					message: 'Invalid password.',
					type: 'validation',
					errors: [],
				} as Json),
		}),
		Effect.catchAll(error => {
			logger.error(`${error.title} ${error.message}`)

			return Effect.succeed({ ...ResponseHandler.UnexpectedErrorResponse, message: error.message })
		}),
		Effect.andThen(response => res.status(response.status).json(response)),
		Effect.runPromise
	)

export const meHandler = (req: Request, res: Response) =>
	UserService.findOne((req as Request & { user: AccessToken }).user.username).pipe(
		Effect.flatMap(({ id, identifier, createdAt, updatedAt }) => {
			return Effect.succeed({
				status: 200,
				data: {
					id,
					identifier,
					createdAt,
					updatedAt,
				},
			} as Json)
		}),
		Effect.catchAll(error => {
			logger.error(`${error.title} ${error.message}`)

			return Effect.succeed({ ...ResponseHandler.UnexpectedErrorResponse, message: error.message })
		}),
		Effect.andThen(response => res.status(response.status).json(response)),
		Effect.runPromise
	)
