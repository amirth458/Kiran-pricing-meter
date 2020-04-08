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
