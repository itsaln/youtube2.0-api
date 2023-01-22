import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule } from '@nestjs/config'
import { VideoService } from '@app/video/video.service'
import { VideoController } from '@app/video/video.controller'
import { VideoModel } from '@app/video/video.model'

@Module({
	controllers: [VideoController],
	providers: [VideoService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: VideoModel,
				schemaOptions: {
					collection: 'Video'
				}
			}
		]),
		ConfigModule
	]
})
export class VideoModule {}
