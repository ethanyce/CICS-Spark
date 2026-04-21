import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from '../../database/database.module';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { EmailModule } from '../email/email.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionGuard } from '../permissions/permission.guard';

@Module({
  imports: [DatabaseModule, EmailModule, PermissionsModule],
  providers: [AdminService, SupabaseGuard, RolesGuard, PermissionGuard],
  controllers: [AdminController],
})
export class AdminModule {}
