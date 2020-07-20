import { BidOrder } from './confirm.sub-order.release';

export interface BiddingOrder {
  bidOrder: BidOrder;
  subOrderCount: number;
  offerPrice: number;
  quantity: number;
  material: string;
  process: string;
  postProcess: string;
  deliveryDate: Array<string>;
  equipmentIds: Array<number>;
  equipmentPropertyType: Array<string>;
  equipmentPropertyValues: Array<string>;
  materialIds: Array<number>;
  materialPropertyType: Array<string>;
  materialPropertyValues: Array<string>;
  partIds: Array<number>;
}

export enum BiddingStatus {
  QUEUED_FOR_LATER = 'QUEUED_FOR_LATER',
  NO_RESPONSE = 'NO_RESPONSE',
  COUNTER_OFFER = 'COUNTER_OFFER',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum BiddingStatusEnum {
  QUEUED_FOR_LATER = 1,
  NO_RESPONSE = 2,
  COUNTER_OFFER = 3,
  ACCEPTED = 4,
  REJECTED = 5
}

export enum BiddingOrderStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  CONFIRMATION_RECEIVED = 'CONFIRMATION_RECEIVED',
  RELEASED = 'RELEASED',
  RELEASED_WITH_FAILURE = 'RELEASED_WITH_FAILURE',
  COMPLETED_WITH_NO_RESPONSE = 'COMPLETED_WITH_NO_RESPONSE',
  WAITING_FOR_RELEASE = 'WAITING_FOR_RELEASE'
}

// TODO:
// This is obviously the full list
export enum BidConnectStatus {
  RELEASED_TO_CUSTOMER = 'RELEASED_TO_CUSTOMER',
  COMPLETE = 'COMPLETE'
}

export enum BidConnectStatusEnum {
  RELEASED_TO_CUSTOMER = 3,
  COMPLETE = 4
}

export interface PmProjectReleaseQueue {
  bidPmProjectId: number;
  customerName: Array<string>;
  userName: Array<string>;
  orderIds: Array<number>;
  partIds: Array<number>;
  rfqIds: Array<number>;
  bidPmProjectStatus: string;
  totalRowCount: number;
}

export interface PmProjectRequest {
  bidPmProjectStatusIds: string;
  searchValue: string;
  beginDate: Date;
  endDate: Date;
}

export enum PmProjectStatusEnum {
  IN_PROGRESS = 1,
  NOT_RELEASED_TO_VENDOR = 2,
  RELEASED_TO_VENDOR = 3,
  PARTIALLY_RELEASED_TO_CUSTOMER = 4,
  RELEASED_TO_CUSTOMER = 5,
  COMPLETE = 6,
  NOT_STARTED = 7
}
