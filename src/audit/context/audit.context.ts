import { AsyncLocalStorage } from 'async_hooks';

interface AuditStore {
  userId: string;
}

export const auditStorage = new AsyncLocalStorage<AuditStore>();

export function setAuditUser(userId: string) {
  auditStorage.enterWith({ userId });
}

export function getAuditUser(): string | null {
  const store = auditStorage.getStore();
  return store?.userId ?? null;
}
