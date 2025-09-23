import { Data } from 'effect'

export class ConfigError extends Data.TaggedError('Config') {
	constructor(message: string) {
		super()
		this.message = message
	}
}
