import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { CommentModel } from '@app/comment/comment.model'
import { CommentDto } from '@app/comment/comment.dto'

@Injectable()
export class CommentService {
	constructor(
		@InjectModel(CommentModel)
		private readonly CommentModel: ModelType<CommentModel>
	) {}

	async findAllByVideoId(videoId: Types.ObjectId) {
		return await this.CommentModel.find({ video: videoId }, '-__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async create(userId: Types.ObjectId, dto: CommentDto) {
		return await this.CommentModel.create({ ...dto, user: userId })
	}
}
