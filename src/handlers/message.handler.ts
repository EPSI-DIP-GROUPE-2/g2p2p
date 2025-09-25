import { Peer } from '@src/types/peer.type'
import { Data } from 'effect'

export class UnknownReceiverError extends Data.TaggedError('UnknownReceiver') {
	public readonly title = 'Could not find receiver'
	public readonly message = 'Could not find peer.'
	public readonly peer: string
	constructor(p: string) {
		super()
		this.peer = p
		console.error(this.peer)
	}
}
export class UnreachableError extends Data.TaggedError('Unreachable') {
	public readonly title = 'Could not reach receiver'
	public readonly message = 'Could not reach receiver instance path.'
}
