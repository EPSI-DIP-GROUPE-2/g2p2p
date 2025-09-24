import { object, string, TypeOf } from 'zod'

export const login = object({
	body: object({
		username: string({
			description: 'username',
			required_error: 'Username is required.',
		}),
		password: string({
			description: 'password',
			required_error: 'Password is required.',
		}),
	}),
})

export type Login = TypeOf<typeof login>
