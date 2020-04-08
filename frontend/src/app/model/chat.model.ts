export interface Chat {
  id: number;
  chatType: ChatType;
  participants: Array<number>;
  bidOrderId: number;
  vendorOrderId: number;
  partId: number;
  customerOrderId: number;
  chats: Array<MessageNote>;
  vendorId: number;
}

export interface MessageNote {
  id: number;
  chat?: Chat;
  message: string;
  senderId: number;
  createdDate: Date;
  lastModifiedDate: Date;
  unReadCount: number;
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
