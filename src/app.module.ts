import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from '@app/config/mongo.config'
import { AppController } from '@app/app.controller'
import { AppService } from '@app/app.service'
import { AuthModule } from '@app/auth/auth.module'
import { UserModule } from '@app/user/user.module'
import { VideoModule } from '@app/video/video.module'
import { CommentModule } from '@app/comment/comment.module'
import { MediaModule } from '@app/media/media.module'

@Module({
	controllers: [AppController],
	providers: [AppService],
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig
		}),
		AuthModule,
		UserModule,
		VideoModule,
		CommentModule,
		MediaModule
	]
})
export class AppModule {}
