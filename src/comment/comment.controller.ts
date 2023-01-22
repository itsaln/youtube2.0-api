import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { CurrentUser } from '@app/user/decorators/user.decorator'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { CommentService } from '@app/comment/comment.service'
import { CommentDto } from '@app/comment/comment.dto'

@Controller('comments')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Get('by-video/:videoId')
	async findAllByVideoId(
		@Param('videoId', IdValidationPipe) videoId: Types.ObjectId
	) {
		return this.commentService.findAllByVideoId(videoId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(
		@CurrentUser('_id') _id: Types.ObjectId,
		@Body() dto: CommentDto
	) {
		return this.commentService.create(_id, dto)
	}
}
