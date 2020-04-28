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

export enum BiddingOrderStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  CONFIRMATION_RECEIVED = 'CONFIRMATION_RECEIVED',
  RELEASED = 'RELEASED',
  RELEASED_WITH_FAILURE = 'RELEASED_WITH_FAILURE',
  COMPLETED_WITH_NO_RESPONSE = 'COMPLETED_WITH_NO_RESPONSE',
  WAITING_FOR_RELEASE = 'WAITING_FOR_RELEASE'
}
