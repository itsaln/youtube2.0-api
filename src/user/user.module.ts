import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule } from '@nestjs/config'
import { UserService } from '@app/user/user.service'
import { UserController } from '@app/user/user.controller'
import { UserModel } from '@app/user/user.model'

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User'
				}
			}
		]),
		ConfigModule
	]
})
export class UserModule {}
