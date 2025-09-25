import { Data, Effect } from 'effect'
import { Request, Response, NextFunction } from 'express'
import type { Json } from '../types/response.type'
import { logger, jwt, config } from '@src/utils'
import { ResponseHandler } from '@src/handlers'
import { AccessToken, SocketUser } from '@src/types/token.type'
import { ExtendedError, Socket } from 'socket.io'
import { parse as parseCookies } from 'cookie'
import { resolve4 } from 'dns'

export class AuthError extends Data.TaggedError('Auth') {}
export class RedirectError extends Data.TaggedError('Redirect') {}

export const http = (req: Request & { user?: AccessToken }, res: Response, next: NextFunction) =>
	Effect.gen(function* () {
		const cookieName = yield* config.get<string>('jwt.cookie')
		if (req.cookies[cookieName]) {
			const token = yield* jwt.verify(req.cookies[cookieName] as string)

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

export const socket = (socket: Socket, next: (err?: ExtendedError) => void) =>
	Effect.gen(function* () {
		const cookieHeader = socket.request.headers.cookie
		if (!cookieHeader) {
			return yield* Effect.fail(new AuthError())
		}

		// Parse cookies
		const cookieName = yield* config.get<string>('jwt.cookie')
		const cookies = parseCookies(cookieHeader)
		const token = cookies[cookieName]
		if (!token) return yield* Effect.fail(new AuthError())

		const verified = yield* jwt.verify(token)

		;(socket as SocketUser).user = verified

		return yield* Effect.succeed(socket)
	}).pipe(
		Effect.matchEffect({
			onSuccess: socket => {
				next()
				return Effect.succeed(socket)
			},
			onFailure: error => {
				logger.error(`Authentification failed on socket, ${error.message}`)
				next(new Error('Forbidden.'))
				return Effect.succeed(socket)
			},
		}),
		Effect.runPromise
	)
