import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DatabaseModule } from '../../database/database.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionGuard } from '../permissions/permission.guard';

@Module({
  imports: [DatabaseModule, PermissionsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PermissionGuard],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
