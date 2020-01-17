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
