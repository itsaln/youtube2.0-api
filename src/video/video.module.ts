import { Module } from '@nestjs/common'
import { VideoService } from '@app/video/video.service'
import { VideoController } from '@app/video/video.controller'

@Module({
	controllers: [VideoController],
	providers: [VideoService]
})
export class VideoModule {
}
