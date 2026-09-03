import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser, Public, Roles } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators/current-user.decorator';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Admin')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login with email and password' })
  login(@Body() dto: AdminLoginDto, @Req() req: Request) {
    return this.adminAuthService.login(dto, this.metaFromRequest(req));
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MODERATOR')
  @ApiOperation({ summary: 'Get the current authenticated admin user' })
  me(@CurrentUser() user: AuthUserPayload) {
    return this.adminAuthService.me(user.sub);
  }

  private metaFromRequest(req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const ipFromForwarded = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded?.split(',')[0]?.trim();

    return {
      userAgent: req.headers['user-agent'],
      ipAddress: ipFromForwarded || req.ip,
    };
  }
}
