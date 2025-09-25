import { Data, Effect } from 'effect'
import { Server } from 'http'
import Gun from 'gun'
import { Peer } from '@src/types/peer.type'
import { config, crypto, logger } from '@src/utils'

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
			})
		),
		Effect.runPromise
	)
