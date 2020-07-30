import { UserSummary } from './user.model';

export interface ChatView {
  chat: Chat;
  users: Array<UserSummary>;
}

export interface Chat {
  id: number;
  chatType: ChatType;
  participants: Array<number>;
  bidOrderId: number;
  vendorOrderId: number;
  partId: number;
  customerOrderId: number;
  bidPmProjectProcessId: number;
  messageNotes: Array<MessageNote>;
  vendorId: number;
  users?: Array<UserSummary>;
  createdDate?: string;
}

export interface MessageNote {
  id: number;
  chat?: Chat;
  message: string;
  senderId: number;
  createdDate: string;
  lastModifiedDate: string;
  user?: UserSummary;
  messageNoteHistory: Array<MessageNoteHistory>;
}

export interface MessageNoteHistory {
  id: number;
  receiveUserId: number;
  isRead: boolean;
}

export interface ChatType {
  id: number;
  name: string;
  description: string;
}

export enum ChatTypeEnum {
  PART_NOTE = 1,
  BID_OFFER = 2,
  VENDOR_ORDER = 3,
  CUSTOMER_ORDER = 4,
  BID_PM_PROJECT_PROCESS = 5
}

export interface ChatAttachmentView {
  attachments: Array<ChatAttachment>;
  users: Array<UserSummary>;
}

export interface ChatAttachment {
  id: number;
  name: string;
  userId: number;
  chatId: number;
  createdDate: string;
  lastModifiedDate: string;
  location: string;
}

export enum ChatParticipantEnum {
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  CUSTOMER = 'CUSTOMER'
}
