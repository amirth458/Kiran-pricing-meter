export class Conference {
  id: number;
  videoConferenceLinkForHost: string;
  videoConferenceLinkForParticipant: string;
  startTime: string;
  duration: number;
  isExpired: boolean;
  participantUserId: number;
  hostUserId: number;

  partId: number;
  bidOrderId: number;
  customerOrderId: number;
  vendorOrderId: number;
  bidPmProjectProcessId?: number;
  createdTime: string;
}

export class ConferenceRequest {
  hostUserId: number;
  participantUserId: number;

  partId?: number;
  bidOrderId?: number;
  customerOrderId?: number;
  vendorOrderId?: number;
  bidPmProjectProcessId?: number;

  conferenceTopic: string;
  conferencePassword: string;
  startTimeInUTC: string;
  duration: number;
  isGlobal?: boolean;
}

export enum ZoomTypeEnum {
  PART = 'PART',
  BID_OFFER = 'BID_OFFER',
  VENDOR_ORDER = 'VENDOR_ORDER',
  CUSTOMER_ORDER = 'CUSTOMER_ORDER',
  BID_PM_PROJECT_PROCESS = 'BID_PM_PROJECT_PROCESS'
}

export enum ZoomParticipantEnum {
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  CUSTOMER = 'CUSTOMER'
}
