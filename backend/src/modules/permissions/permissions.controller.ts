import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PermissionsService, AdminPermissions } from './permissions.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('permissions')
@UseGuards(SupabaseGuard, RolesGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  /**
   * GET /api/permissions/me
   * Get current user's permissions
   */
  @Get('me')
  async getMyPermissions(@Request() req: any) {
    const permissions = await this.permissionsService.getUserPermissions(req.user.id);
    return { permissions };
  }

  /**
   * GET /api/permissions/department/:department
   * Get all admin permissions for a department (Super Admin only)
   */
  @Get('department/:department')
  @Roles('super_admin')
  async getDepartmentPermissions(@Param('department') department: string) {
    const adminPermissions = await this.permissionsService.getDepartmentAdminPermissions(department);
    return { adminPermissions };
  }

  /**
   * PUT /api/permissions/department/:department
   * Update admin permissions for a department (Super Admin only)
   */
  @Put('department/:department')
  @Roles('super_admin')
  async updateDepartmentPermissions(
    @Param('department') department: string,
    @Body() body: { adminPermissions: AdminPermissions[] },
    @Request() req: any,
  ) {
    await this.permissionsService.updateDepartmentPermissions(
      department,
      body.adminPermissions,
      req.user,
    );
    return { message: `Permissions updated for ${department} department` };
  }
}
