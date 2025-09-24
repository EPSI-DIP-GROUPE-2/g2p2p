import { createHash, generateKeyPairSync } from 'crypto'
import { Effect } from 'effect'
import { logger } from './logger.util'
import * as file from './file.util'
import * as config from './config.util'
import { CryptoHandler, FileHandler } from '@src/handlers'
import { GeneratePairOptions } from '@src/types/crypto.type'

export const hashString = (string: string | Buffer, algorithm = 'sha256') =>
	Effect.try({
		try: () => {
			if (typeof string !== 'string' && !(string instanceof Buffer)) {
				throw new Error('Input data must be a string or Buffer')
			}

			const hash = createHash(algorithm)
			hash.update(string)
			return hash.digest('hex')
		},
		catch: (error: unknown) => new CryptoHandler.HashError(string, error),
	})

export const generatePair = (o?: Partial<GeneratePairOptions>) =>
	Effect.gen(function* () {
		const options: GeneratePairOptions = {
			keySize: 4096,
			type: 'pkcs1',
			format: 'pem',
			algorithm: 'rsa',
			...(o ?? {}),
		}

		return yield* Effect.try({
			try: () =>
				generateKeyPairSync(options.algorithm, {
					modulusLength: options.keySize,
					publicKeyEncoding: {
						type: options.type,
						format: options.format,
					},
					privateKeyEncoding: {
						type: options.type,
						format: options.format,
					},
				}),
			catch: (error: unknown) => new CryptoHandler.GenerateKeyError(options, error),
		})
	})

export const loadKeys = (keys: [string, string], o?: GeneratePairOptions) =>
	Effect.all([file.checkFile(keys[0]), file.checkFile(keys[1])]).pipe(
		Effect.matchEffect({
			onSuccess: keys => {
				keys.forEach(key => logger.info(`Loaded ${key}`))
				return Effect.succeed(keys)
			},
			onFailure: error => {
				if (error instanceof FileHandler.AccessError && error.code === 'ENOENT') {
					logger.info('Generating JWT key pair.')
					return generatePair(o).pipe(
						Effect.flatMap(({ privateKey, publicKey }) =>
							Effect.all(
								keys.map((key, index) =>
									file
										.write(key, index === 0 ? privateKey : publicKey)
										.pipe(Effect.tap(() => logger.info(`Generated ${key}`)))
								)
							)
						)
					)
				}

				return Effect.fail(error)
			},
		})
	)

export const keys = Effect.gen(function* () {
	const privateKey = yield* config.get<string>('encryption.keys.private')
	const publicKey = yield* config.get<string>('encryption.keys.public')

	return { privateKey: yield* file.read(privateKey), publicKey: yield* file.read(publicKey) }
})

export const loadEncryptionKeys = () =>
	Effect.all([
		config.get<string>('encryption.keys.private'),
		config.get<string>('encryption.keys.public'),
	]).pipe(
		Effect.flatMap(keys =>
			loadKeys(keys, {
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
