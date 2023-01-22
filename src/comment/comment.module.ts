import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule } from '@nestjs/config'
import { CommentService } from '@app/comment/comment.service'
import { CommentController } from '@app/comment/comment.controller'
import { CommentModel } from '@app/comment/comment.model'

@Module({
	controllers: [CommentController],
	providers: [CommentService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CommentModel,
				schemaOptions: {
					collection: 'Comment'
				}
			}
		]),
		ConfigModule
	]
})
export class CommentModule {}
