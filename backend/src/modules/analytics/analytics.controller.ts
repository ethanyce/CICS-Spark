import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PermissionGuard } from '../permissions/permission.guard';
import { RequirePermission } from '../permissions/require-permission.decorator';

@Controller('analytics')
@UseGuards(SupabaseGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET /api/analytics/usage
   * Admin/SuperAdmin only. Returns usage metrics for reports page.
   * Requires: reports.view permission
   */
  @Get('usage')
  @Roles('admin', 'super_admin')
  @UseGuards(PermissionGuard)
  @RequirePermission('reports.view')
  getUsageMetrics() {
    return this.analyticsService.getUsageMetrics();
  }
}
