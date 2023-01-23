import { IsString } from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'

export class CommentDto {
	@IsString()
	name: string

	@IsObjectId({
		message: 'videoId must be a mongodb ObjectId'
	})
	videoId: string
}
