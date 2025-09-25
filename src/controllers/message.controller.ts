import { Effect } from 'effect'
import { Request, Response } from 'express'
import { logger, crypto } from '@src/utils'
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
		const identifier = yield* crypto.identifier

		return yield* MessageService.create({
			from: identifier,
			to: req.body.to,
			content: req.body.content,
		})
	}).pipe(
		Effect.tap(MessageService.send),
		Effect.flatMap(message =>
			Effect.succeed({
				status: 200,
				data: {
					id: message.id,
					to: message.to,
					from: message.from,
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

export const listHandler = (_req: Request, res: Response) =>
	MessageService.findAll().pipe(
		Effect.flatMap(messages =>
			Effect.succeed({
				status: 200,
				data: messages.map(
					message =>
						({
							id: message.id,
							to: message.to,
							status: message.status,
							content: message.content,
							timestamp: message.timestamp,
						}) as Partial<MessageModel>
				),
			} as Json)
		),
		Effect.catchAll(error => {
			logger.error(`${error.title} ${error.message}`)

			return Effect.succeed({ ...ResponseHandler.UnexpectedErrorResponse, message: error.message })
		}),
		Effect.andThen(response => res.status(response.status).json(response)),
		Effect.runPromise
	)

export const receiveHandler = (
	{ body }: Request<unknown, unknown, MessageSchema.Receive['body']>,
	res: Response
) =>
	MessageService.receive({
		from: body.from,
		to: body.to,
		signature: body.signature,
		content: body.content,
		timestamp: body.timestamp,
	}).pipe(
		Effect.flatMap(message =>
			Effect.succeed({
				status: 200,
				data: {
					id: message.id,
					to: message.to,
					from: message.from,
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
