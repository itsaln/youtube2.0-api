import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put, Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { User } from '@app/user/decorators/user.decorator'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { UserService } from '@app/user/user.service'
import { UpdateUserDto } from '@app/user/dto/update-user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('most-popular')
	getMostPopular() {
		return this.userService.getMostPopular()
	}

	@Get('profile')
	@Auth()
	getProfile(@User('_id') _id: Types.ObjectId) {
		return this.userService.findOne(_id)
	}

	@Get()
	@Auth('admin')
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.userService.findAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	findOne(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.userService.findOne(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile')
	@Auth()
	updateProfile(@User('_id') _id: Types.ObjectId, @Body() dto: UpdateUserDto) {
		return this.userService.update(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth('admin')
	update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	delete(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.userService.delete(id)
	}
}
