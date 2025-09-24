import { Data } from 'effect'

export class ConfigError extends Data.TaggedError('Config') {
	public readonly title = 'Could not load configuration'

	constructor(message: string) {
		super()
		this.message = message
	}
}
