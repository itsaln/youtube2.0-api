import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop, Ref } from '@typegoose/typegoose'
import { UserModel } from '@app/user/user.model'
import { CommentModel } from '@app/comment/comment.model'

export interface VideoModel extends Base {}

export class VideoModel extends TimeStamps {
	@prop()
	name: string

	@prop({ default: false })
	isPublic: boolean

	@prop({ default: 0 })
	views?: number

	@prop({ default: 0 })
	likes?: number

	@prop()
	description: string

	@prop()
	videoPath: string

	@prop()
	thumbnailPath: string

	@prop({ ref: () => UserModel })
	user: Ref<UserModel>

	// @prop({ ref: () => CommentModel })
	// comments?: Ref<CommentModel>[]
}
