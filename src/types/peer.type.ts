import { ContactModel } from '@src/models'

export interface Peer {
	path: string
	identifier: ContactModel['identifier']
	publicKey: string
}
