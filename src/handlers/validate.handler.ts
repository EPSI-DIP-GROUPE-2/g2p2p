import { Data } from 'effect'
import { Json } from '@src/types/response.type'
import { ZodError } from 'zod'

export class ValidationError extends Data.TaggedClass('Validation') {
	public readonly errors: object[] = []
	public readonly response: Json
	constructor(error: ZodError) {
		super()
		this.errors = error.errors
		this.response = {
			status: 400,
			message: 'Bad Request.',
			type: 'validation',
			errors: this.errors,
		}
	}
}
