import { Injectable, NestMiddleware } from '@nestjs/common';
import { setAuditUser } from './audit.context';

@Injectable()
export class AuditContextMiddleware implements NestMiddleware {
  use(req, res, next) {
    const userId = req.user?.id;
    if (userId) {
      setAuditUser(userId);
    }
    next();
  }
}
