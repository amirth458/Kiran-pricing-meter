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
}
