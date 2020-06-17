import { Part } from './part.model';
import { BidOrderStatusType } from './confirm.sub-order.release';
import { PaymentStatusType } from './billing.model';
import { Contract } from './subscription.model';

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
    contract: Contract;
  }[];
  customerSelectedSuppliers: {
    vendor: string;
    vendorName: string;
    city: string;
    status: string;
    vendorId: number;
    state: string;
    contract: Contract;
  }[];
  customerInvitedSuppliers: {
    id: number;
    name: string;
    contactName: string;
    email: string;
    phoneNo: string;
    isRegistered: boolean;
    invitedByUserId: number;
  }[];
}

export class ConnectOrder {
  amount: number;
  createdDate: string;
  customerId: number;
  customerName: string;
  isArchived: boolean;
  isReleaseToSingleSupplier: boolean;
  minimumProdexSuppliers: number;
  notes: string;
  orderStatusType: BidOrderStatusType;
  paymentStatusType: PaymentStatusType;
  preferredVendors: number[];
  requestProdexDirectBid: boolean;
  subContractorsAllowed: boolean;
  vendorOrderId: null;
  bidOrderStatus: string;

  orderId: number;
  partIds: number[];
  prodexPartIds: number[];
  prodexRFQIds: number[];
  totalRowCount: number;
}
