import { Data, Effect } from 'effect'
import { Request, Response, NextFunction } from 'express'
import type { Json } from '../types/response.type'
import { jwt } from '@src/utils'
import { ResponseHandler } from '@src/handlers'
import { AccessToken } from '@src/types/token.type'

export class AuthError extends Data.TaggedError('Auth') {}
export class RedirectError extends Data.TaggedError('Redirect') {}

export default (req: Request & { user?: AccessToken }, res: Response, next: NextFunction) =>
	Effect.gen(function* () {
		if (req.cookies['accessToken']) {
			const token = yield* jwt.verify(req.cookies['accessToken'] as string)

			req.user = token

			return yield* Effect.succeed(() => next())
		}

		return yield* Effect.fail(new AuthError())
	}).pipe(
		Effect.catchTags({
			InvalidToken: () =>
				Effect.succeed({
					status: 401,
					message: 'Invalid Token',
					type: 'unauthorized',
					errors: [],
				} as Json),
			Auth: () =>
				Effect.succeed({
					status: 401,
					message: 'Unauthorized Request',
					type: 'unauthorized',
					errors: [],
				} as Json),
		}),
		Effect.catchAll(() => Effect.succeed(ResponseHandler.UnexpectedErrorResponse)),
		Effect.andThen(response => {
			if (typeof response === 'function') {
				return response()
			}

			return res.status(response.status).json(response)
		}),
		Effect.runPromise
	)
