import { BidOrder } from './confirm.sub-order.release';

export interface BiddingOrder {
  bidOrder: BidOrder;
  subOrderCount: number;
  offerPrice: number;
  quantity: number;
  material: string;
  process: string;
  postProcess: string;
  deliveryDate: string;
}

export enum BiddingStatus {
  QUEUED_FOR_LATER = 'QUEUED_FOR_LATER',
  NO_RESPONSE = 'NO_RESPONSE',
  COUNTER_OFFER = 'COUNTER_OFFER',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
