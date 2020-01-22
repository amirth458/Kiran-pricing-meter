import { ProcessProfile } from './part.model';
import { BidProcessStatusType } from './confirm.sub-order.release';

export interface BiddingOrderDetail {
  acceptedOrderDetails: Array<GetAllCustomerPartView>;
  matchingSuppliersProfilesView: Array<VendorOrderDetail>;
}

export interface VendorOrderDetail {
  id?: number;
  vendorName: string;
  processProfileViews: Array<ProcessProfile>;
  bidProcessStatus: BidProcessStatusType;
  counterOfferPrice: number;
  bidProcessId: number;
}

interface GetAllCustomerPartView {
  subOrder: number;
  customerOrder: number;
  priceAccepted: number;
  customerName: string;
  quantity: number;
  materialName: string;
  process: string;
  postProcessTypeNames: string;
  shippedDate: Date;
  deliveryDate: Date;
  partStatusType: any;
  fileName: string;
  nda: string;
  materialId: number;
  processTypeId: number;
  postProcessTypeIds: Array<number>;
  partStatusTypeId: number;
  rfqMediaId: number;
  totalCount: number;
}
