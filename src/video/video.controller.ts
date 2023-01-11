import { Controller } from '@nestjs/common'
import { VideoService } from '@app/video/video.service'

@Controller('video')
export class VideoController {
	constructor(private readonly videoService: VideoService) {
	}
}
