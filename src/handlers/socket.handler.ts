import { Data } from 'effect'

export class SocketRegisterError extends Data.TaggedError('SocketRegister') {
	public readonly title = 'Could not register websocket server'
	public readonly error: unknown
	public readonly message: string
	constructor(error: unknown) {
		super()
		this.error = error
		this.message = 'Unexpected Error.'
		if (
			error &&
			typeof error === 'object' &&
			'message' in error &&
			typeof error.message === 'string'
		)
			this.message = error.message
	}
}

export class SocketEmitError extends Data.TaggedError('SocketEmit') {
	public readonly title = 'Could not emit through websocket server'
	public readonly error: unknown
	public readonly message: string
	constructor(error: unknown) {
		super()
		this.error = error
		this.message = 'Unexpected Error.'
		if (
			error &&
			typeof error === 'object' &&
			'message' in error &&
			typeof error.message === 'string'
		)
			this.message = error.message
	}
}
