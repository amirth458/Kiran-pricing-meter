import { Part } from './part.model';
import { BidOrderStatusType } from './confirm.sub-order.release';
import { PaymentStatusType } from './billing.model';

export enum BidProcessStatusEnum {
  AWAITING_VENDOR_RESPONSE = 'AWAITING VENDOR RESPONSE',
  VENDOR_RECEIVED = 'VENDOR RECEIVED',
  VENDOR_ACCEPTED = 'VENDOR ACCEPTED',
  VENDOR_REJECTED = 'VENDOR REJECTED',
  AWAITING_CUSTOMER_RESPONSE = 'AWAITING CUSTOMER RESPONSE',
  CUSTOMER_DECLINED = 'CUSTOMER DECLINED',
  CUSTOMER_ACCEPTED = 'CUSTOMER ACCEPTED'
}

export class ConnectProject {
  minimumProdexSuppliers: number;
  customerOrderId: number;
  partIds: number[];
  parts?: Part[];
  prodexSuppliers: {
    vendor: string;
    vendorName: string;
    city: string;
    status: string;
    vendorId: number;
    state: string;
  }[];
  customerSelectedSuppliers: {
    vendor: string;
    vendorName: string;
    city: string;
    status: string;
    vendorId: number;
    state: string;
  }[];
}

export class ConnectOrder {
  amount: number;
  createdDate: string;
  customerId: number;
  customerName: string;
  id: number;
  isArchived: false;
  isReleaseToSingleSupplier: true;
  minimumProdexSuppliers: number;
  notes: string;
  orderStatusType: BidOrderStatusType;
  partList: Part[];
  paymentStatusType: PaymentStatusType;
  preferredVendors: number[];
  requestProdexDirectBid: false;
  subContractorsAllowed: false;
  vendorOrderId: null;
}
