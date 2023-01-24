import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Types } from 'mongoose'
import { genSalt, hash } from 'bcryptjs'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { UserModel } from '@app/user/user.model'
import { UpdateUserDto } from '@app/user/dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async findOne(_id: Types.ObjectId): Promise<DocumentType<UserModel>> {
		const user = await this.UserModel.findById(_id, '-password -__v').exec()

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	async findAll(searchTerm?: string): Promise<DocumentType<UserModel>[]> {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.UserModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async update(_id: Types.ObjectId | string, dto: UpdateUserDto): Promise<DocumentType<UserModel>> {
		const user = await this.UserModel.findById(_id)
		if (!user) throw new NotFoundException('User not found')

		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && String(_id) !== String(isSameUser._id))
			throw new NotFoundException('Email is busy')

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email
		user.name = dto.name
		user.description = dto.description
		user.location = dto.location
		user.bannerPath = dto.bannerPath
		user.avatarPath = dto.avatarPath

		if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

		return await user.save()
	}

	async delete(_id: Types.ObjectId): Promise<DocumentType<UserModel> | null> {
		return this.UserModel.findByIdAndDelete(_id).exec()
	}

	async getMostPopular(): Promise<DocumentType<UserModel>[]> {
		return await this.UserModel.find(
			{ subscribersCount: { $gt: 0 } },
			'-password -__v'
		)
			.sort({
				subscribersCount: -1
			})
			.exec()
	}
}
