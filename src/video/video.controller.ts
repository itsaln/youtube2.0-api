import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { User } from '@app/user/decorators/user.decorator'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { VideoService } from '@app/video/video.service'
import { VideoDto } from '@app/video/video.dto'

@Controller('videos')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Get('most-popular')
	async getMostPopularByViews() {
		return this.videoService.getMostPopularByViews()
	}

	@Get('by-user-private')
	@Auth()
	async findAllByUserIdPrivate(@User('_id') _id: Types.ObjectId) {
		return this.videoService.findAllByUserId(_id, true)
	}

	@Get('by-user/:userId')
	async findAllByUserId(
		@Param('userId', IdValidationPipe) userId: Types.ObjectId
	) {
		return this.videoService.findAllByUserId(userId)
	}

	@Get('get-private/:id')
	@Auth()
	async findOnePrivate(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.videoService.findOne(id, false)
	}

	@Get(':id')
	async findOne(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.videoService.findOne(id)
	}

	@Get()
	async findAll(@Query('searchTerm') searchTerm?: string) {
		return this.videoService.findAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@User('_id') _id: Types.ObjectId) {
		return this.videoService.create(_id)
	}

	@HttpCode(200)
	@Put('update-views/:videoId')
	async updateCountViews(@Param('videoId', IdValidationPipe) videoId: string) {
		return this.videoService.updateCountViews(videoId)
	}

	@HttpCode(200)
	@Put('update-likes/:videoId')
	@Auth()
	async updateReaction(@Param('videoId', IdValidationPipe) videoId: string) {
		return this.videoService.updateReaction(videoId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: VideoDto
	) {
		return this.videoService.update(id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.videoService.delete(id)
	}
}
