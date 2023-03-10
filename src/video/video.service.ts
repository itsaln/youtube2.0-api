import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { VideoModel } from '@app/video/video.model'
import { VideoDto } from '@app/video/video.dto'

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(VideoModel) private readonly VideoModel: ModelType<VideoModel>
	) {}

	async findOne(_id: Types.ObjectId, isPublic = true) {
		// Check authUserId === video.userId
		const video = await this.VideoModel.findOne(
			isPublic ? { _id, isPublic: true } : { _id },
			'-__v'
		).populate('user', 'name location avatarPath isVerified subscribersCount')

		if (!video) throw new UnauthorizedException('Video not found')

		return video
	}

	async findAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return await this.VideoModel.find({ ...options, isPublic: true })
			.select('-__v')
			.sort({ createdAt: 'desc' })
			.populate('user', 'name avatarPath isVerified')
			.exec()
	}

	async findAllByUserId(userId: Types.ObjectId, isPrivate = false) {
		const userIdCheck = { user: userId }
		const options = isPrivate ? userIdCheck : { ...userIdCheck, isPublic: true }

		return await this.VideoModel.find(options, '-__v')
			.sort({ createdAt: 'desc' })
			.populate('user', 'name avatarPath isVerified')
			.exec()
	}

	async getMostPopularByViews() {
		return await this.VideoModel.find({ views: { $gt: 0 } }, '-__v')
			.sort({ views: -1 })
			.populate('user', 'name avatarPath isVerified')
			.exec()
	}

	async create(userId: Types.ObjectId) {
		const defaultValues: VideoDto = {
			name: '',
			user: String(userId),
			videoPath: '',
			description: '',
			thumbnailPath: ''
		}

		const video = await this.VideoModel.create(defaultValues)

		return video._id
	}

	async update(_id: string, dto: VideoDto) {
		const updateVideo = await this.VideoModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()

		if (!updateVideo) throw new NotFoundException('Video not found')

		return updateVideo
	}

	async updateCountViews(_id: string) {
		const updateVideo = await this.VideoModel.findByIdAndUpdate(
			_id,
			{ $inc: { views: 1 } },
			{ new: true }
		).exec()

		if (!updateVideo) throw new NotFoundException('Video not found')

		return updateVideo
	}

	async updateReaction(_id: string) {
		const updateVideo = await this.VideoModel.findByIdAndUpdate(
			_id,
			// TODO: like/dislike this user
			// { $inc: { likes: type === 'inc' ? 1 : -1 } },
			{ $inc: { likes: 1 } },
			{ new: true }
		).exec()

		if (!updateVideo) throw new NotFoundException('Video not found')

		return updateVideo
	}

	async delete(_id: string) {
		const deleteVideo = await this.VideoModel.findByIdAndDelete(_id).exec()

		if (!deleteVideo) throw new NotFoundException('Video not found')

		return deleteVideo
	}
}
