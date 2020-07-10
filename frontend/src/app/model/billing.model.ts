import { Part } from './part.model';
import { BidOrderStatusType } from './confirm.sub-order.release';

export class Payment {
  id: number;
  customerName: string;
  orderId: number;
  paymentStatusType: PaymentStatusTypes;
  paymentType: PaymentType;
  projectType: ProjectType;
  poNumber: string;
  note: string;
}

export enum PaymentStatusTypes {
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  AWAITING_FOR_RESPONSE = 'AWAITING_FOR_RESPONSE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ProjectType {
  RFQ_PROJECT = 'AUTO',
  PRODUCTION_PROJECT = 'PM',
  DESIGN_PROJECT = 'Design Project',
  CONNECT_PROJECT = 'CONNECT',
  RFQ_PROJECT_PRODUCTION_PROJECT = 'PM PROGRAM',
  RFQ_PROJECT_CONNECT_PROJECT = 'CONNECT PROGRAM'
}

export enum PaymentType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  CREDIT_CARD = 'CREDIT_CARD',
  ZERO_DOLLAR_ORDER = 'ZERO_DOLLAR_ORDER'
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
  notes: string;
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

export class BidHistory {
  bidNumber: number;
  rfq: number;
  rfqName: string;
  vendor: string;
  fileName: string;
  proposedFinish: string;
  partsOnPlatform: number;
  proposedSpecsAndTolerances: number;
  newEquipmentNumber: number;
  newMaterialNumber: number;
  bulidBoxVolumeMm3: number;
  bulidBoxVolumeCm3: number;
  volumeMm3: number;
  volumeCm3: number;
  areaMm2: number;
  areaCm2: number;
  vendorTotalBidAmount: number;
  vendorLaborAndMaterial: number;
  impliedProductionAndDeliveryWindow: number;
  taxes: number;
  shipping: number;
  vendorYield: number;
  xmm: number;
  zmm: number;
  ymm: number;
}

export class LegacyBidHistory {
  vendor: string;
  rfqNumber: number;
  bidNumber: number;
  fileName: string;
  proposedFinish: string;
  specsAndTolerance: number;
  impliedProductionAndDeliveryWindow: number;
  target_delivery_date: number;
  partOnPlatform: number;
  x: number;
  y: number;
  z: number;
  volume: number;
  surfaceArea: number;
  vendorTotalBidAmount: number;
  vendorLaborAndMaterial: number;
  taxes: number;
  shipping: number;
  vendorYield: number;
  isLegacy: boolean;
}
