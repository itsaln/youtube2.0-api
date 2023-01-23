import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { genSalt, hash } from 'bcryptjs'
import { UserModel } from '@app/user/user.model'
import { UserDto } from '@app/user/user.dto'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async findOne(_id: Types.ObjectId) {
		const user = await this.UserModel.findById(_id, '-password -__v')

		if (!user) throw new UnauthorizedException('User not found')

		return user
	}

	async updateProfile(_id: Types.ObjectId, dto: UserDto) {
		const user = await this.findOne(_id)

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

		return await user.save()
	}

	async getMostPopular() {
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
