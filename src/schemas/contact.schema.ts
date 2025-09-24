import { object, string, TypeOf } from 'zod'

export const create = object({
	body: object({
		username: string({
			description: 'username',
			required_error: 'Username is required.',
		}),
		public_key: string({
			description: 'public key',
			required_error: 'Public key is required.',
		}),
	}),
})

export type Create = TypeOf<typeof create>
