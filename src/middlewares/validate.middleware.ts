import { Effect } from 'effect'
import { Request, Response, NextFunction } from 'express'
import { UnexpectedErrorResponse } from '../types/response.type'
import { AnyZodObject, ZodError } from 'zod'
import { ValidateHandler } from '@src/handlers'

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) =>
	Effect.gen(function* () {
		const { body, query, params } = yield* Effect.try({
			try: () =>
				schema.parse({
					body: req.body,
					query: req.query,
					params: req.params,
				}),
			catch: error => new ValidateHandler.ValidationError(error as ZodError),
		})

		req.body = body
		req.query = query
		req.params = params

		return yield* Effect.succeed(true)
	}).pipe(
		Effect.catchTags({
			Validation: error => Effect.succeed(error.response),
		}),

		Effect.catchAll(() => Effect.succeed(UnexpectedErrorResponse)),
		Effect.andThen(response => {
			if (typeof response === 'boolean') {
				return next()
			}

			return res.status(response.status).json(response)
		}),
		Effect.runPromise
	)
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
