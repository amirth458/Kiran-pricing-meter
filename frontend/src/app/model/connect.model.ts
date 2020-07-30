import { Part } from './part.model';
import { BidOrderStatusType } from './confirm.sub-order.release';
import { PaymentStatusType } from './billing.model';
import { Contract } from './subscription.model';
import { Conference } from './conference.model';

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
  bidConnectStatusType: BidOrderStatusType;
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
  bidConnectId: number;
}

export class ClientProgress {
  isProposalIssued: boolean;
  proposalAmount: number;
  zoomMeeting: {
    numberOfZoomDiscussionsCompleted: number;
    lastZoomDiscussionCompleted: string;
    lastZoomDiscussionsCompleted: Conference[];
    nextZoomDiscussionScheduled: string;
  };
  partQuoteResponseViews: {
    partId: number;
    vendorId: number;
    b;
    partQuoteCustomerView: PartQuoteCustomerView;
  }[];
  messages: {
    numberOfCustomerAndVendorMessages: number;
    lastCustomerAndVendorMessageTime: string;
    messageNotes: {
      id: number;
      chat: string;
      message: string;
      senderId: number;
      createdDate: string;
      lastModifiedDate: string;
      messageNoteHistory: any;
    }[];
  };
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
  minimumOrderAmount: number;
  proposalPartQuantity: number;
  proposalDeliveryDate: Date;
  quoteCreatedBy: string;

  // For UI purpose
  marginCost?: number;
  adminMargin?: number;
}

export interface PartQuoteInvoiceLineItem {
  partQuoteDetailId: number;
  partQuoteId: number;
  invoiceLineItemId: number;
  invoiceLineItemCost: number;
  extendedCost: number;
  totalInvoiceLineItemCost: number;
  unit: number;
  unitPrice: number;
  processPricingConditionTypeId: number;
}

export interface PartQuoteInvoiceItem {
  invoiceItemId: number;
  invoiceItemCost: number;
  partQuoteInvoiceLineItemDetails: Array<PartQuoteInvoiceLineItem>;
  finalCost: number;
  unit: number;
  unitPrice: number;
}

export interface AdminPartQuote {
  id: number;
  partId: number;
  proposalPartId: number;
  vendorId: number;
  isExpired: boolean;
  expiredAt: Date;
  totalCost: number;
  minimumOrderAmount: number;
  marginCost: number;
  adminMargin: number;
  partQuoteInvoiceItemDetails: Array<PartQuoteInvoiceItem>;
  winningProcessPricingId: number;
  matchedProcessPricingIds: Array<number>;
}
