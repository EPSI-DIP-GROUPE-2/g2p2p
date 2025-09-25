import { object, string, TypeOf } from 'zod'

export const receive = object({
	body: object({
		from: string({
			description: 'sender identifier',
			required_error: 'Sender identifier is required.',
		}),
		to: string({
			description: 'receiver identifier',
			required_error: 'Receiver identifier is required.',
		}),
		signature: string({
			description: 'receiver signature',
			required_error: 'Receiver signature is required.',
		}),
		timestamp: string({
			description: 'message timestamp',
			required_error: 'Message timestamp is required.',
		}),
		content: string({
			description: 'Message content',
			required_error: 'Message content is required.',
		}),
	}),
})

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
export type Receive = TypeOf<typeof receive>
