import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { CurrentUser } from '@app/user/decorators/user.decorator'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { UserService } from '@app/user/user.service'
import { UserDto } from '@app/user/user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('most-popular')
	getMostPopular() {
		return this.userService.getMostPopular()
	}

	@Get('profile')
	@Auth()
	getProfile(@CurrentUser('_id') _id: Types.ObjectId) {
		return this.userService.findOne(_id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile')
	@Auth()
	updateProfile(@CurrentUser('_id') _id: Types.ObjectId, @Body() dto: UserDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	update(
		@Param('id', IdValidationPipe) id: Types.ObjectId,
		@Body() dto: UserDto
	) {
		return this.userService.updateProfile(id, dto)
	}
}
