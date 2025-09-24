import {
	AutoIncrement,
	Column,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript'
import { NOW } from 'sequelize'
import { MessageStatus } from '@src/types/message.type'

export type MessageInput = {
	from: string
	to: string
	content: string
}

@Table({
	tableName: 'messages',
	modelName: 'message',
	timestamps: false,
})
export class MessageModel extends Model<MessageModel, MessageInput> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	from!: string

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	to!: string

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	content!: string

	@Default(MessageStatus.STORED)
	@Column({
		type: DataType.ENUM(...Object.values(MessageStatus)),
		allowNull: false,
	})
	status!: MessageStatus

	@Default(NOW)
	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	timestamp!: Date
}
