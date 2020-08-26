export class MetadataType {
  metadataType: string;
  metadataList: Array<{
    id: number;
    name: string;
    description: string;
  }>;
}

export enum CommunicationTypesEnum {
  Email = 1,
  SMS = 2,
  ON_SCREEN = 3
}

export class NotificationSetting {
  id: number;
  messageTypeId: number;
  communicationTypeId: number;
  userId: number;
  enableNotification: boolean;
}

export class Notification {
  id: number;
  messageTypeId: number;
  communicationTypeId: number;
  message: string;
  messageTypeDescription: string;
  messageTypeName: string;
  userId: number;
  isRead: boolean;
  readTime: string;
  description: string;
  createdDate: string;
  partDetails: Array<{
    deliveryDate: string;
    fileName: string;
    material: string;
    partId: number;
    technology: string;
  }>;
}

export enum MessageTypeEnum {
  PASSWORD_RESET = 1,
  OFFER_AVAILABLE = 2,
  COUNTER_OFFER_ACCEPTED = 3,
  POTENTIAL_OFFER = 4,
  OFFER_ACCEPTED = 5,
  OFFER_EXPIRED = 6,
  READY_FOR_QUOTING = 7,
  QUOTE_RECEIVED = 8,
  MANUAL_QUOTE = 9,
  AUTO_QUOTE_OVERRIDDEN = 10,
  PAYMENT_UPDATE = 11,
  ORDER_UPDATE = 12,
  BID_CONFIRMATION = 13,
  CUSTOMER_NOTIFICATION = 14,
  ADD_OR_UPDATE_QUOTE = 15,
  PENDING_PAYMENT = 16,
  CUSTOMER_WELCOME_LETTER = 17,
  VENDOR_WELCOME_LETTER = 18,
  VENDOR_APPROVAL_LETTER = 19,
  VENDOR_NOTIFICATION = 20,
  VENDOR_PROCURE_PROGRAM_INVITATION = 21,
  VENDOR_CONNECT_PROGRAM_INVITATION = 22,
  VENDOR_RELEASE_CONNECT_PROJECT = 23,
  VENDOR_RELEASE_PM_PROJECT = 24,
  VENDOR_CONNECT_PROJECT_ACCEPTANCE = 25,
  VENDOR_PROPOSAL = 26,
  CUSTOMER_PROPOSAL_ACCEPTANCE = 27,
  ACCOUNT_UPGRADE = 28,
  ACCOUNT_DOWNGRADE = 29,
  UPGRADE_TO_CONNECT = 30,
  ADMIN_NOTIFICATION = 31,
  ZOOM_MEETING_SET_UP = 32,
  ZOOM_MEETING_REMINDER = 33,
  VENDOR_PROPOSAL_UPDATED_TO_CUSTOMER = 34,
  VENDOR_PROPOSAL_UPDATED = 35,
  ZOOM_MEETING_TIME_CHANGE = 36,
  PM_VENDOR_PROPOSAL = 37,
  PM_ADMIN_PROPOSAL = 38,
  PM_VENDOR_PROPOSAL_UPDATED = 39,
  PM_ADMIN_PROPOSAL_UPDATED_TO_CUSTOMER = 40,
  ORDER_SHIPPED = 41,
  ORDER_DELIVERED = 42,
  ORDER_COMPLETION = 43,
  NOTIFICATION_ALL = 44
}
