import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PermissionsModule } from '../../permissions/permissions.module';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';

@Module({
  imports: [AuthModule, PermissionsModule],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
