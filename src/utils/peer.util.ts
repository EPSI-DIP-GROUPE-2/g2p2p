import { Data, Effect } from 'effect'
import { Server } from 'http'
import Gun, { IGunInstance } from 'gun'
import { Peer } from '@src/types/peer.type'
import { config, crypto, logger } from '@src/utils'
import { PeerMessage } from '@src/types/message.type'
import { MessageService } from '@src/services'

export let db: IGunInstance
export const peers: Peer[] = []

export class PeerInitializationError extends Data.TaggedError('PeerInitialization') {}

const wait = Effect.tryPromise({
	try: () =>
		new Promise(resolve => {
			setTimeout(resolve, 1000)
		}),
	catch: () => new PeerInitializationError(),
})

export const registerDeamon = (http: Server) =>
	Effect.try({
		try: () =>
			Gun({
				web: http,
			}),
		catch: () => new PeerInitializationError(),
	}).pipe(
		Effect.flatMap(gun =>
			Effect.gen(function* () {
				db = gun
				gun.on('hi', peer => console.log('Peer connected:', peer.url))

				const me = yield* config.get<string>('peer.path')
				logger.info(`Reaching peers as ${me}`)

				const publicKey = yield* crypto.keys.pipe(
					Effect.map(({ publicKey }) => publicKey),
					Effect.map(crypto.trimKey)
				)
				const identifier = yield* crypto.identifier

				gun.get('peers').set({
					path: me,
					identifier,
					publicKey,
				} as Peer)

				yield* wait

				gun
					.get('peers')
					.map()
					.on(peer => {
						let p: Peer = peer as Peer
						if (!peers.find(e => e.identifier === p.identifier) && p.identifier !== identifier) {
							gun.opt({ peers: [p.path] })
							peers.push({
								path: p.path,
								identifier: p.identifier,
								publicKey: crypto.trimKey(p.publicKey),
							})
							logger.info(`Reached ${p.identifier} at ${p.path}`)
						}
					})

				gun
					.get('messages')
					.map()
					.on((m, id) => {
						if (!m) return
						const message: PeerMessage = m as PeerMessage
						if (message.to === identifier) {
							MessageService.receive(message).pipe(
								Effect.tap(() => {
									gun.get('messages').get(id).put(null)
								}),
								Effect.runPromise
							)
						}
					})
			})
		),
		Effect.runPromise
	)
