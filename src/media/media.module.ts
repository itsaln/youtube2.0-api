import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { MediaService } from '@app/media/media.service'
import { MediaController } from '@app/media/media.controller'

@Module({
	controllers: [MediaController],
	providers: [MediaService],
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		})
	]
})
export class MediaModule {}
