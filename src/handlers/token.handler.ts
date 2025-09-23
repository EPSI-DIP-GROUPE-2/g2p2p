import { Data } from 'effect'

export class InvalidTokenError extends Data.TaggedError('InvalidToken') {
	public readonly title = 'Could not verify token'
	public readonly message: string
	constructor(error: unknown) {
		super()
		this.message = 'Unexpected Error.'

		if (error instanceof Error) {
			this.message = error.message
		}
	}
}

export class SigningTokenError extends Data.TaggedError('SigningToken') {
	public readonly title = 'Could not sign token'
	public readonly message: string
	constructor(error: unknown) {
		super()
		this.message = 'Unexpected Error.'

		if (error instanceof Error) {
			this.message = error.message
		}
	}
}
