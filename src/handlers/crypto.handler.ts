import { Data } from 'effect'

export class HashError extends Data.TaggedError('Hash') {
	public readonly title = 'Could not hash string'
	public readonly value: unknown
	public readonly error: unknown
	public readonly message: string
	constructor(value: unknown, error: unknown) {
		super()
		this.value = value
		this.error = error
		this.message = this.parse()
	}

	private parse() {
		let message = 'Unexpected Error.'
		if (this.error instanceof Error) {
			message = this.error.message
		}

		return message
	}
}
