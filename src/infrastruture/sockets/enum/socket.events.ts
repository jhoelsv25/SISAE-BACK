export enum SOCKET_EVENTS {
  // presence
  HEARTBEAT = 'heartbeat',
  ONLINE = 'online',
  OFFLINE = 'offline',

  // chat
  CHAT_SEND = 'chat:send',
  CHAT_NEW = 'chat:new',
  TYPING_START = 'typing:start',
  TYPING_STOP = 'typing:stop',

  // notifications
  NOTIFICATION_NEW = 'notification:new',
}
