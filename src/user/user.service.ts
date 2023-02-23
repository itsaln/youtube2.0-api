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

	async findOneWithVideos(_id: Types.ObjectId) {
		return this.UserModel.aggregate()
			.match({ _id })
			.lookup({
				from: 'Video',
				foreignField: 'user',
				localField: '_id',
				as: 'videos'
			})
			.addFields({ videosCount: { $size: '$videos' } })
			.project({ __v: 0, password: 0, videos: 0 })
			.exec()
			.then(data => data[0])
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
			.select('-password -__v')
			.sort({ subscribersCount: -1 })
			.exec()
	}

	async update(
		_id: Types.ObjectId | string,
		dto: UpdateUserDto
	): Promise<DocumentType<UserModel>> {
		const user = await this.UserModel.findById(_id, '-__v')
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
