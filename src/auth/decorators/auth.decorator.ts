import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard'
import { OnlyAdminGuard } from '@app/auth/guards/admin.guard'
import { TypeRole } from '@app/auth/auth.interface'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, OnlyAdminGuard)
			: UseGuards(JwtAuthGuard)
	)
