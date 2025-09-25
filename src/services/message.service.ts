import { Effect } from 'effect'
import { ContactModel, MessageModel } from '@src/models'
import { logger } from '@src/utils'
import { DatabaseHandler, MessageHandler } from '@src/handlers'
import { socket, peer, crypto } from '@src/utils'
import { ContactService } from '.'
import { identifier } from '@src/utils/crypto.util'

export const create = ({
	from,
	to,
	content,
}: {
	from: ContactModel['identifier']
	to: ContactModel['identifier']
	content: MessageModel['content']
}) =>
	Effect.tryPromise({
		try: () => {
			logger.debug('Creating message')
			return MessageModel.create({
				from,
				to,
				content,
			})
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	}).pipe(
		Effect.tap(({ to, from, content, timestamp, status }) =>
			socket.emit('messages:append', { to, from, content, timestamp, status })
		)
	)

export const findAll = () =>
	Effect.tryPromise({
		try: () => {
			logger.debug('Listing messages')
			return MessageModel.findAll({ order: [['timestamp', 'DESC']] })
		},
		catch: (error: unknown) => new DatabaseHandler.QueryError(error),
	})

export const send = (message: MessageModel) =>
	ContactService.findOne(message.to).pipe(
		Effect.flatMap(contact =>
			Effect.gen(function* () {
				const encryptedMessage = crypto.encryptString(contact.public_key, message.content)
				const signature = yield* crypto.keys.pipe(
					Effect.map(({ privateKey }) => privateKey),
					Effect.map(key => crypto.signString(key, encryptedMessage))
				)

				return yield* Effect.succeed({
					encryptedMessage,
					signature,
					identifier: contact.identifier,
				})
			})
		),
		Effect.flatMap(pool =>
			Effect.gen(function* () {
				const p = peer.peers.find(p => p.identifier === pool.identifier)
				if (!p) return yield* Effect.fail(new MessageHandler.UnknownReceiverError(message.to))

				yield* Effect.tryPromise({
					try: () => fetch(`${p.path}/health`),
					catch: () => new MessageHandler.UnreachableError(),
				})

				return { ...pool, peer: p }
			}).pipe(
				Effect.matchEffect({
					onSuccess: pool =>
						Effect.tryPromise({
							try: () =>
								fetch(`${pool.peer.path}/api/messages/receive`, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										from: message.from,
										to: pool.identifier,
										content: pool.encryptedMessage,
										signature: pool.signature,
										timestamp: message.timestamp,
									}),
								}),
							catch: () => new MessageHandler.UnreachableError(),
						}),
					onFailure: error => {
						return Effect.fail(error)
					},
				})
			)
		)
	)
