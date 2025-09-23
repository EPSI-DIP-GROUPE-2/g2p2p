import { createHash } from 'crypto'
import { Effect } from 'effect'
import { CryptoHandler } from '@src/handlers'

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
