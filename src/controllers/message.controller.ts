import { Effect } from 'effect'
import { Request, Response } from 'express'
import { logger, jwt } from '@src/utils'
import { Json } from '@src/types/response.type'
import { MessageModel } from '@src/models'
import { MessageService } from '@src/services'
import { MessageSchema } from '@src/schemas'
import { ResponseHandler } from '@src/handlers'

export const createHandler = (
	req: Request<unknown, unknown, MessageSchema.Create['body']>,
	res: Response
) =>
	Effect.gen(function* () {
		console.log(req.body)

		const { publicKey } = yield* jwt.keys

		return yield* MessageService.create({
			from: publicKey,
			to: req.body.to,
			content: req.body.content,
		})
	}).pipe(
		Effect.flatMap(message =>
			Effect.succeed({
				status: 200,
				data: {
					id: message.id,
					status: message.status,
					content: message.content,
					timestamp: message.timestamp,
				} as Partial<MessageModel>,
			} as Json)
		),

		Effect.catchAll(error => {
			logger.error(`${error.title} ${error.message}`)

			return Effect.succeed({ ...ResponseHandler.UnexpectedErrorResponse, message: error.message })
		}),
		Effect.andThen(response => res.status(response.status).json(response)),
		Effect.runPromise
	)
