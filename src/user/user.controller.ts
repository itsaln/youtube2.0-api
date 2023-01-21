import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { CurrentUser } from '@app/user/decorators/user.decorator'
import { UserService } from '@app/user/user.service'
import { UserDto } from '@app/user/user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

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

	@Get('most-popular')
	getMostPopular() {
		return this.userService.getMostPopular()
	}
}
