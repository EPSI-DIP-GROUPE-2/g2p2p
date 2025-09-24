import { Data } from 'effect'
import { GeneratePairOptions } from '@src/types/crypto.type'

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

export class GenerateKeyError extends Data.TaggedError('GenerateKey') {
	public readonly title = 'Could not generate key pair'
	public readonly options: GeneratePairOptions
	public readonly message: string
	public readonly error: unknown
	constructor(options: GeneratePairOptions, error: unknown) {
		super()
		this.options = options
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
