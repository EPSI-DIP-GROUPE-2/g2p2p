import { Json } from '@src/types/response.type'

export const UnexpectedErrorResponse: Json = {
	status: 500,
	message: 'Unexpected Error.',
	type: 'unexpected',
	errors: [],
}
