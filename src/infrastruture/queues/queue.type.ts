export const QUEUE = {
  NOTIFICATIONS: 'notifications',
  CHAT: 'chat',
  REPORTS: 'reports',
} as const;

export const JOBS = {
  SEND_NOTIFICATION: 'send_notification',
  PROCESS_CHAT_MESSAGE: 'process_chat_message',
  GENERATE_REPORT: 'generate_report',
} as const;
