import { Effect } from 'effect'
import jwt from 'jsonwebtoken'
import * as config from './config.util'
import { AccessToken } from '@src/types/token.type'

import { logger } from './logger.util'
import * as crypto from './crypto.util'
import * as file from './file.util'

import { TokenHandler, FileHandler } from '@src/handlers'

export const loadJWTKeys = () =>
	Effect.all([config.get<string>('jwt.keys.private'), config.get<string>('jwt.keys.public')]).pipe(
		Effect.flatMap(keys =>
			crypto.loadKeys(keys, {
				keySize: 4096,
				type: 'pkcs1',
				format: 'pem',
				algorithm: 'rsa',
			})
		),
		Effect.catchAll(error => {
			if (error instanceof FileHandler.AccessError) {
				console.log(error.operation)
			}
			logger.error(`${error.title}, ${error.message}`)
			process.exit(1)
			return Effect.fail(error)
		}),
		Effect.runPromise
	)

export const keys = Effect.gen(function* () {
	const privateKey = yield* config.get<string>('jwt.keys.private')
	const publicKey = yield* config.get<string>('jwt.keys.public')

	return { privateKey: yield* file.read(privateKey), publicKey: yield* file.read(publicKey) }
})

export const verify = (token: string) =>
	Effect.gen(function* () {
		const { publicKey } = yield* keys
		const decoded = yield* Effect.try({
			try: () => jwt.verify(token, publicKey) as unknown as AccessToken,
			catch: error => new TokenHandler.InvalidTokenError(error),
		})

		return decoded
	})

export const sign = (payload: object) =>
	Effect.gen(function* () {
		const { privateKey } = yield* keys

		return yield* Effect.try({
			try: () =>
				jwt.sign(payload, privateKey, {
					algorithm: 'RS256',
				}),
			catch: error => new TokenHandler.SigningTokenError(error),
		})
	})
