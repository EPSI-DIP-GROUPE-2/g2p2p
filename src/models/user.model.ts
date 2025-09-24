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

export type UserInput = {
	username: string
	password: string
}

@Table({
	tableName: 'users',
	modelName: 'user',
	timestamps: true,
})
export class UserModel extends Model<UserModel, UserInput> {
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
	password!: string

	@BeforeCreate
	@BeforeUpdate
	static hashPassword(instance: UserModel) {
		if (instance.password) {
			instance.password = Effect.runSync(crypto.hashString(instance.password))
		}
	}
}
