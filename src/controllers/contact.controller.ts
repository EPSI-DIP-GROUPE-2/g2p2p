import { Effect } from 'effect'
import { logger } from '@src/utils'
import { Json } from '@src/types/response.type'
import { ResponseHandler } from '@src/handlers'
import { ContactService } from '@src/services'
import { Request, Response } from 'express'

export const findAllHandler = (req: Request, res: Response) =>
	ContactService.findAll().pipe(
		Effect.matchEffect({
			onSuccess: contacts => {
				return Effect.succeed({
					status: 200,
					data: contacts,
				} as Json)
			},
			onFailure: error => {
				logger.error(`${error.title} ${error.message}`)

				return Effect.succeed({
					...ResponseHandler.UnexpectedErrorResponse,
					message: error.message,
				})
			},
		}),
		Effect.andThen(response => res.status(response.status).json(response)),
		Effect.runPromise
	)
