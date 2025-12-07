import { Injectable, Logger } from '@nestjs/common';
// Minimal audit - you can persist into DB table 'audit_logs' in future
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  async log(action: string, meta: Record<string, any>) {
    this.logger.log(`${action} - ${JSON.stringify(meta)}`);
    // extend: write to DB table audit_logs
    return true;
  }
}
