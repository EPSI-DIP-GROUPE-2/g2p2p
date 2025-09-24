import { Socket } from 'socket.io'

export interface AccessToken {
	expire: number
	sub: number
	username: string
}

export type SocketUser = Socket & { user: AccessToken }
