import config from 'config'
import { logger } from './logger.util'
import { Effect } from 'effect'
import { ConfigError } from '@src/handlers'

export const get = <T extends string | number>(key: string) =>
	Effect.gen(function* () {
		return yield* Effect.try({
			try: () => config.get<T>(key),
			catch: error => {
				logger.error((error as Error).message)
				return new ConfigError((error as Error).message)
			},
		})
	})

export const getSync = <T extends string | number>(key: string) =>
	get<T>(key).pipe(
		Effect.catchAll(error => {
			process.exit(1)
			return error
		}),
		Effect.runSync
	)
