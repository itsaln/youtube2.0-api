import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop, Ref } from '@typegoose/typegoose'
import { CommentModel } from '@app/comment/comment.model'

export interface VideoModel extends Base {}

export class VideoModel extends TimeStamps {
	@prop()
	name: string

	@prop()
	isPublic: boolean

	@prop({ default: 0 })
	views?: number

	@prop({ default: 0 })
	like?: number

	@prop({ default: 0 })
	dislike?: number

	@prop()
	description: string

	@prop()
	videoPath: string

	@prop()
	thumbnailPath: string

	@prop({ ref: () => CommentModel })
	comments?: Ref<CommentModel>[]
}
