import { Part } from './part.model';
import { BidOrderStatusType } from './confirm.sub-order.release';

export class Payment {
  id: number;
  customerName: string;
  orderId: number;
  paymentStatusType: PaymentStatusTypes;
  paymentType: PaymentType;
  poNumber: string;
  note: string;
}

export enum PaymentStatusTypes {
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  AWAITING_FOR_RESPONSE = 'AWAITING_FOR_RESPONSE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PaymentType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  CREDIT_CARD = 'CREDIT_CARD'
}

export class PurchaseOrderAgreement {
  id: number;
  poaNumber: string;
  purchaseAgreementNoteViewList: Array<any>;
  guid?: string;
  resourceUrl: string;
  fileName?: string;
  status: string;
}
export class BillingInfoView {
  id: number;
  orderId: number;
  userId: number;
  amount: number;
  guid?: string;
  status?: string;
  paymentType: PaymentType;
  paymentStatusType: PaymentStatusTypes;
  creditCard?: string;
  purchaseAgreement: PurchaseOrderAgreement;
}
export class CustomerOrder {
  id: number;
  customerId: number;
  customerName: string;
  vendorOrderId: null;
  orderStatusType: BidOrderStatusType;
  paymentStatusType: PaymentStatusType;
  isArchived: boolean;
  partList: Array<Part>;
  createdDate: string;
}
export class PaymentStatusType {
  id: number;
  name: string;
  description: string;
}
export class PaymentDetails {
  billingInfoView: BillingInfoView;
  customerOrder: CustomerOrder;
}
