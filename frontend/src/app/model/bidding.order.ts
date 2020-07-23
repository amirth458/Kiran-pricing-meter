import { BidOrder } from './confirm.sub-order.release';

export interface BiddingOrder {
  bidOrder: BidOrder;
  subOrderCount: number;
  offerPrice: number;
  quantity: number;
  material: string;
  process: string;
  postProcess: string;
  deliveryDate: Array<string>;
  equipmentIds: Array<number>;
  equipmentPropertyType: Array<string>;
  equipmentPropertyValues: Array<string>;
  materialIds: Array<number>;
  materialPropertyType: Array<string>;
  materialPropertyValues: Array<string>;
  partIds: Array<number>;
}

export enum BiddingStatus {
  QUEUED_FOR_LATER = 'QUEUED_FOR_LATER',
  NO_RESPONSE = 'NO_RESPONSE',
  COUNTER_OFFER = 'COUNTER_OFFER',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum BiddingStatusEnum {
  QUEUED_FOR_LATER = 1,
  NO_RESPONSE = 2,
  COUNTER_OFFER = 3,
  ACCEPTED = 4,
  REJECTED = 5
}

export enum BiddingOrderStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  CONFIRMATION_RECEIVED = 'CONFIRMATION_RECEIVED',
  RELEASED = 'RELEASED',
  RELEASED_WITH_FAILURE = 'RELEASED_WITH_FAILURE',
  COMPLETED_WITH_NO_RESPONSE = 'COMPLETED_WITH_NO_RESPONSE',
  WAITING_FOR_RELEASE = 'WAITING_FOR_RELEASE'
}

// TODO:
// This is obviously the full list
export enum BidConnectStatus {
  RELEASED_TO_CUSTOMER = 'RELEASED_TO_CUSTOMER',
  COMPLETE = 'COMPLETE'
}

export enum BidConnectStatusEnum {
  RELEASED_TO_CUSTOMER = 3,
  COMPLETE = 4
}

export interface PmProjectReleaseQueue {
  bidPmProjectId: number;
  customerName: Array<string>;
  userName: Array<string>;
  orderIds: Array<number>;
  partIds: Array<number>;
  rfqIds: Array<number>;
  bidPmProjectStatus: string;
  totalRowCount: number;
}

export interface PmProjectRequest {
  bidPmProjectStatusIds: string;
  searchValue: string;
  beginDate: Date;
  endDate: Date;
  showTestAccount: boolean;
}

export enum PmProjectStatusType {
  RELEASE_QUEUE = 'RELEASE_QUEUE',
  PROPOSAL_ISSUED = 'PROPOSAL_ISSUED',
  CUSTOMER_ACCEPTED = 'CUSTOMER_ACCEPTED'
}

export enum PmProjectBidStatusType {
  NOT_STARTED = 'NOT_STARTED',
  NOT_RELEASED_TO_VENDOR = 'NOT_RELEASED_TO_VENDOR',
  RELEASED_TO_VENDOR = 'RELEASED_TO_VENDOR',
  WAITING_FOR_PROPOSAL = 'WAITING_FOR_PROPOSAL',
  PROPOSAL_RECEIVED = 'PROPOSAL_RECEIVED',
  PARTIALLY_RELEASED_TO_CUSTOMER = 'PARTIALLY_RELEASED_TO_CUSTOMER',
  RELEASED_TO_CUSTOMER = 'RELEASED_TO_CUSTOMER',
  COMPLETE = 'COMPLETE'
}

export enum PmProjectStatusEnum {
  IN_PROGRESS = 1,
  NOT_RELEASED_TO_VENDOR = 2,
  RELEASED_TO_VENDOR = 3,
  PARTIALLY_RELEASED_TO_CUSTOMER = 4,
  RELEASED_TO_CUSTOMER = 5,
  COMPLETE = 6,
  NOT_STARTED = 7
}

export interface VendorConfirmationResponse {
  vendorId: number;
  vendorUserId: number;
  vendorName: string;
  vendorEmail: string;
  bidPmProjectProcessId: number;
  bidPmProjectProcessStatus: string;
  meetingTime: Date;
  numberOfProcessProfile: number;
  totalProposalAmount: number;
  proposalDeliveryDate: Date;
  proposalExpiryDate: Date;

  rowNumber?: number;
  selected?: boolean;
}

export interface MinimumProposalInfo {
  vendorId: number;
  offerId: number;
  proposalPartIds: Array<number>;
}

export interface AdminProposalRequest {
  part: ProposalPart;
  partQuote: ProposalPartQuote;
  partDimensionUpdated: boolean;
  referenceMedias: Array<ProposalReferenceMedia>;
}

export interface ProposalReferenceMedia {
  name: string;
  uploadedAt: Date;
  location: string;
}

interface DimensionUnit {
  value: number;
  unitId: number;
}

export interface ProposalPartDimension {
  x: DimensionUnit;
  y: DimensionUnit;
  z: DimensionUnit;
  volume: DimensionUnit;
  surfaceArea: DimensionUnit;
  thumbnail100Location: string;
  thumbnail200Location: string;
  thumbnail400Location: string;
}

export interface ProposalMedia {
  connectorServiceId: number;
  uploadedAt: Date;
  location: string;
  name: string;
  partDimension: ProposalPartDimension;
}

export interface ProposalPartRfqMedia {
  media: ProposalMedia;
}

export interface ProposalPart {
  materialPropertyType: string;
  materialPropertyValues: Array<string>;
  equipmentPropertyType: string;
  equipmentPropertyValues: Array<string>;
  cuttingBondingAllowed: boolean;
  quantity: number;
  targetDeliveryDate: Date;
  manualPricingAllowed: boolean;
  parentPartId: number;
  comments: string;
  rfqMedia: ProposalPartRfqMedia;
  postProcessTypeIds: Array<number>;
}

export interface ProposalQuoteDetails {
  extendedCost: number;
  invoiceCost: number;
  invoiceItemId: number;
  invoiceLineItemId: number;
  partQuoteId: number;
  processPricingConditionTypeId: number;
  unit: number;
  unitPrice: number;
}

export interface ProposalPartQuote {
  isAdminQuote: boolean;
  expiredAt: Date;
  isManualPricing: boolean;
  isGlobalRule: boolean;
  isAutoQuoteOverride: boolean;
  globalRuleReason: Array<number>;
  partQuoteDetailList: Array<ProposalQuoteDetails>;
  totalCost: number;
  adminMargin: number;
  vendorId: number;
}

export enum ProposalTypeEnum {
  VENDOR_PROPOSAL_TYPE = 'VENDOR_PROPOSAL_TYPE',
  ADMIN_PROPOSAL_TYPE = 'ADMIN_PROPOSAL_TYPE'
}
