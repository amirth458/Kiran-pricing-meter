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
}

export class ConferenceRequest {
  hostUserId: number;
  participantUserId: number;

  partId: number;
  bidOrderId: number;
  customerOrderId: number;
  vendorOrderId: number;

  conferenceTopic: string;
  conferencePassword: string;
  startTimeInUTC: string;
  duration: number;
}

export enum ZoomTypeEnum {
  PART = 'PART',
  BID_OFFER = 'BID_OFFER',
  VENDOR_ORDER = 'VENDOR_ORDER',
  CUSTOMER_ORDER = 'CUSTOMER_ORDER'
}

export enum ZoomParticipantEnum {
  ADMIN = 'ADMIN',
  VENDOR = 'VENDOR',
  CUSTOMER = 'CUSTOMER'
}
