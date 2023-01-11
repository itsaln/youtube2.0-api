import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop, Ref } from '@typegoose/typegoose'
import { UserModel } from '@app/user/user.model'
import { VideoModel } from '@app/video/video.model'

export interface CommentModel extends Base {}

export class CommentModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	user: Ref<UserModel>

	@prop({ ref: () => VideoModel })
	video: Ref<VideoModel>

	@prop()
	message: string
}
