/**
 * Represents the lifecycle status of a message in the system.
 */
export enum MessageStatus {
	/**
	 * The message is stored in the local database but not yet distributed.
	 */
	STORED = 'STORED',

	/**
	 * The message has been distributed across the P2P cluster but not yet sent to the end user.
	 */
	DISTRIBUTED = 'DISTRIBUTED',

	/**
	 * The message has been successfully sent to the target user/device.
	 */
	SENT = 'SENT',

	/**
	 * The message has been read/viewed by the recipient.
	 */
	VIEWED = 'VIEWED',
}

export interface PeerMessage {
	from: string
	to: string
	content: string
	signature: string
	timestamp: string
}
