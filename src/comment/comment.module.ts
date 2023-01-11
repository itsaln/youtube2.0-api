import { Module } from '@nestjs/common'
import { CommentService } from '@app/comment/comment.service'
import { CommentController } from '@app/comment/comment.controller'

@Module({
	controllers: [CommentController],
	providers: [CommentService]
})
export class CommentModule {
}
