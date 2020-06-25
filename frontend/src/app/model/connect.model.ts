import { Part } from './part.model';
import { BidOrderStatusType } from './confirm.sub-order.release';
import { PaymentStatusType } from './billing.model';
import { Contract } from './subscription.model';
import { Conference } from './conference.model';
import { Chat } from './chat.model';

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
  rfqIds: number[];
  totalRowCount: number;
  bidConnectStatusType?: string;
}

export class ClientProgress {
  numberOfCustomerAndVendorMessages: number;
  lastCustomerAndVendorMessageTime: string;
  isProposalIssued: boolean;
  proposalAmount: number;
  numberOfZoomDiscussionsCompleted: number;
  lastZoomDiscussionCompleted: string;
  lastZoomDiscussionsCompleted: Conference[];
  nextZoomDiscussionScheduled: string;
  partQuoteResponseViews: {
    partId: number;
    vendorId: number;
    partQuoteCustomerView: PartQuoteCustomerView;
  }[];
  chatDetails: any;
  // Fix this when Dipen fixes from his sides
  // chatDetails: Chat;
}

export class PartQuote {
  partQuoteId: number;
  invoiceItemId: number;
  value: number;
  unit: number;
  unitPrice: number;
}

export class PartQuoteCustomerView {
  id: number;
  partId: number;
  proposalPartId: number;
  vendorId: number;
  isExpired: boolean;
  expiredAt: string;
  totalCost: number;
  partQuoteDetails: PartQuote[];
  winningProcessPricingId: number;
  matchedProcessPricingIds: number[];
}
