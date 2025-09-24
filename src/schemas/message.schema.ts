import { object, string, TypeOf } from 'zod'

export const create = object({
	body: object({
		to: string({
			description: 'receiver public key',
			required_error: 'Receiver public key is required.',
		}),
		content: string({
			description: 'Message content',
			required_error: 'Message content is required.',
		}),
	}),
})

export type Create = TypeOf<typeof create>
