import { IsEmail, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email: string

	password?: string

	isAdmin?: boolean

	@IsString()
	name: string

	@IsString()
	description: string

	@IsString()
	location: string

	@IsString()
	bannerPath: string

	@IsString()
	avatarPath: string
}
