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
  messageNotes: Array<MessageNote>;
  vendorId: number;
  users?: Array<UserSummary>;
}

export interface MessageNote {
  id: number;
  chat?: Chat;
  message: string;
  senderId: number;
  createdDate: Date;
  lastModifiedDate: Date;
  user?: UserSummary;
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
  CUSTOMER_ORDER = 4
}
