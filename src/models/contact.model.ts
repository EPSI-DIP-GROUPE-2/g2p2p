import {
	AutoIncrement,
	BeforeCreate,
	BeforeUpdate,
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
	Unique,
} from 'sequelize-typescript'
import { crypto } from '@src/utils'
import { Effect } from 'effect/index'

export type ContactInput = {
	username: string
	public_key: string
	identifier: string
}

@Table({
	tableName: 'contacts',
	modelName: 'contact',
	timestamps: true,
})
export class ContactModel extends Model<ContactModel, ContactInput> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number

	@Unique
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	username!: string

	@Unique
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	public_key!: string

	@Unique
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	identifier!: string

	@BeforeCreate
	@BeforeUpdate
	static hashKey(instance: ContactModel) {
		if (instance.public_key) {
			instance.identifier = Effect.runSync(crypto.hashString(instance.public_key))
		}
	}
}
