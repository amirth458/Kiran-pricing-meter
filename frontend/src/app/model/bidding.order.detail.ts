import { ProcessProfile } from './part.model';
import { BidProcessStatusType } from './confirm.sub-order.release';

export interface BiddingOrderDetail {
  acceptedOrderDetails: Array<GetAllCustomerPartView>;
  matchingSuppliersProfilesView: Array<VendorOrderDetail>;
}

interface VendorOrderDetail {
  vendorName: string;
  processProfileViews: Array<ProcessProfile>;
  bidProcessStatus: BidProcessStatusType;
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
