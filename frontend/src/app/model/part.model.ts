import { VendorProfile } from './vendorProfile.model';
import { UserSummary } from './user.model';
import { SideMeasurement } from './order.model';

export interface Type {
  id: number;
  name: string;
}

export interface ReferenceMedia {
  id: number;
  name: string;
  uploadedAt: Date;
  location: string;
  mediaId: number;
}

export interface Metadata {
  id: number;
  name: string;
}

export interface ProjectRfq {
  id: number;
  name: string;
  rfqStatusType: string | Metadata;
  projectProfile?: ProjectProfile;
  isArchived: boolean;
  rfqMediaList: Array<RfqMedia>;
  projectType: ProjectType;
}

export enum RfqTypeEnum {
  AUTO_RFQ = 'AUTO_RFQ',
  PM_RFQ = 'PM_RFQ',
  CONNECT_RFQ = 'CONNECT_RFQ',
  PM_PROGRAM_RFQ = 'PM_PROGRAM_RFQ',
  CONNECT_PROGRAM_RFQ = 'CONNECT_PROGRAM_RFQ'
}

export interface RfqFilter {
  projectTypeId: number;
  searchQuery: string;
  beginDate: Date;
  endDate: Date;
  showTestAccount: boolean;
}

export interface ProjectType {
  description?: string;
  displayName?: string;
  id: number;
  name: string;
}

export interface PartDimensionValue {
  value: number;
  valueInDefaultUnit: number;
  unitId: number;
}

export interface PartDimensionStatusType {
  id: number;
  name: string;
  description: string;
}

export interface FileType {
  id: number;
  name: string;
  description: string;
}

export interface PartDimensionMedia {
  id: number;
  name: string;
  uploadedAt: string;
  connectorServiceId: number;
  fileType: FileType;
  location: string;
  customerId: number;
  partDimension: PartDimension;
}

export interface PartDimension {
  id: number;
  name: string;
  x: PartDimensionValue;
  y: PartDimensionValue;
  z: PartDimensionValue;
  volume: PartDimensionValue;
  surfaceArea: PartDimensionValue;
  thumbnail100Location: string;
  thumbnail200Location: string;
  thumbnail400Location: string;
  partDimensionStatusType: PartDimensionStatusType;
}

export class PartStatusType {
  id: number;
  name: string;
  description: string;
  displayName: string;
  display: boolean;
}
export class PartType extends PartStatusType {}
export interface PartOrder {
  id: number;
  customerId: number;
  customerName: string;
  vendorOrderId: number;
  amount: number;
  orderStatusType: any;
  paymentStatusType: any;
  isArchived: boolean;
  isReleaseToSingleSupplier: boolean;
  subContractorsAllowed: boolean;
  requestProdexDirectBid: boolean;
  partList: Part[];
  createdDate: string;
  notes: string;
  minimumProdexSuppliers: number;
  preferredVendors: Array<number>;
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
  unit: number;
  unitPrice: number;
  value: number;
  finalCost: number;
  partQuoteInvoiceLineItemDetails: PartQuoteInvoiceLineItem[];
}

export interface PartQuote {
  id: number;
  partId: number;
  vendorId: number;
  isExpired: boolean;
  expiredAt: Date;
  totalCost: number;
  marginCost: number;
  partQuoteInvoiceItemDetails: PartQuoteInvoiceItem[];
  winningProcessPricingId: number;
  matchedProcessPricingIds: Array<number>;
  minimumOrderAmount: number;
}

export interface PartParameterType {
  id: number;
  name: string;
  description: string;
}

export interface ParameterTolerance {
  id: number;
  value: number;
  valueSignTypeID: number;
  unitTypeId: number;
  partcustomerParameterId: number;
}

export interface PartCustomParameter {
  id: number;
  targetValue: number;
  targetOperatorTypeId: number;
  targetUnitTypeId: number;
  partParameterType: PartParameterType;
  partId: number;
  parameterTolerance: ParameterTolerance;
}

export interface RfqMedia {
  id: number;
  projectRfqId: number;
  media: PartDimensionMedia;
  projectRfq: ProjectRfq;
  projectProfileName: string;
}

export interface Part {
  id: number;
  partId: number;
  name: string;
  customerName: string;
  rfqMedia: RfqMedia;
  processTypeId: number;
  processTypeName: string;
  materialPropertyType: string;
  materialIds: Array<number>;
  materialPropertyValues: Array<string>;
  equipmentPropertyType: string;
  equipmentPropertyValues: Array<string>;
  equipmentIds: Array<number>;
  cuttingBondingAllowed: boolean;
  quantity: number;
  targetDeliveryDate: string;
  shippingCost: number;
  shippedAt: string;
  manualPricingAllowed: boolean;
  shippingAddress: Address;
  partStatusType: PartStatusType | string;
  partType: PartType;
  order: PartOrder;
  postProcessTypeIds: number[];
  partCustomParameterList: PartCustomParameter[];
  isNoBid: boolean;
  partQuoteList: Array<any>;
  bidOrderStatus: string;
  comments?: string;

  rfqMediaId?: number;
  subContractorsAllowed?: boolean;
  requestProdexDirectBid?: boolean;
  isReleaseToSingleSupplier?: boolean;
  commets?: string;
  proposalPart?: boolean;
  parentPartId?: number;
}

export class BidPart {
  bidOrderItemId: number;
  bidprojectProcessStatus: string;
  connectorServiceId: number;
  customerCity: string;
  customerCountry: string;
  customerId: number;
  customerName: string;
  customerOrder: number;
  customerZip: string;
  deliveryDate: string;
  equipmentPropertyType: string;
  equipmentPropertyValues: string[];
  fileName: string;
  filePath: string;
  isReleaseToSingleSupplier: boolean;
  matchedProcessProfileIds: number[];
  materialPropertyType: string;
  materialPropertyValues: string[];
  meetingTime: string;
  nda: string | number;
  partId: number;
  partQuoteCustomerView: any;
  partStatusType: string;
  partStatusTypeId: number;
  postProcessTypeIds: number[];
  postProcessTypeNames: string;
  priceAccepted: number;
  projectRfqStatus: string;
  quantity: number;
  rfqMediaId: number;
  shippedDate: string;
  shippingAddress: string;
  surfaceRoughness: string;
  thumbnail100Location: string;
  thumbnail200Location: string;
  thumbnail400Location: string;
  tolerance: Array<any>;
  userId: number;
  volume: SideMeasurement;
  surfaceArea: SideMeasurement;
  x: SideMeasurement;
  y: SideMeasurement;
  z: SideMeasurement;
}

export interface Address {
  id: number;
  name: string;
  street1: string;
  street2: string;
  landmark: string;
  city: string;
  zipcode: string;
  state: string;
  customerId: number;
  country: Country;
}

export enum AddressDelimiter {
  HTML_LINE_BREAK = '<br/>',
  COMMA_SEPARATOR = ', '
}

export interface Country {
  id: number;
  name: string;
}

export interface GovernanceMedia {
  id: number;
  name: string;
  uploadedAt: Date;
  location: string;
  uploadedByUserId: number;
}

export interface ProjectProfile {
  id: number;
  name: string;
  ndaId: boolean;
  customerId: number;
  vendorCertIds?: Array<number>;
  countryIds: Array<number>;
  partCertIds: Array<number>;
  facilityCertIds: Array<number>;
  antiMatchCertIds: Array<number>;
  projectGovernanceMedias: Array<GovernanceMedia>;
  eligibleManufacturerTypeIds: Array<number>;
  eligibleManufacturerTypes: string;
  isArchive: boolean;
  countries: string;
  partCerts: string;
  facilityCerts: string;
  antiMatchCerts: string;
}

export interface RfqData {
  id: number;
  name: string;
  rfqStatusType: Type;
  projectProfile: ProjectProfile;
  isArchived: boolean;
  partList: Part[];
}

export interface Material {
  id: string;
  name: string;
  genericName: string;
  oemDescription: string;
  materialClassName: string;
  materialFamilyName: string;
  materialTypeName: string;
}

export interface ProcessFamily {
  id: number;
  name: string;
  processType: Type;
  processAction: any[];
}

export interface Equipment {
  id: number;
  name: string;
  oemDescription: string;
  brandedProcessName: string;
  genericProcessName: string;
  processFamily: ProcessFamily;
  processTypeName: string;
}

export interface VendorFacility {
  id: number;
  name: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  vendorId: number;
}

export interface VendorMachinery {
  id: number;
  name: string;
  serialName: string;
  vendorId: number;
  equipment: Equipment;
  vendorFacility: VendorFacility;
}

export interface MachineServingMaterial {
  id: number;
  material: Material;
  vendorMachinery: VendorMachinery;
}

export interface ProcessMachineServingMaterial {
  id: number;
  machineServingMaterial: MachineServingMaterial;
  processProfileId: number;
}

export interface InvoiceLineItem {
  id: number;
  name: string;
  invoiceItem: Type;
  processPricingParameterGroup: Type;
}

export interface Currency {
  id: number;
  name: string;
  symbol: string;
  code: string;
}

export interface ProcessParameter {}
export interface ProcessDimensionalProperty {}
export interface ProcessMaterialCharacteristic {}

export interface ProcessProfile {
  id: number;
  name: string;
  parameterNickName: string;
  vendorId: number;
  vendorName?: string;
  vendorEmailAddress?: string;
  processProfileType: Type;
  processAction: any;
  processMachineServingMaterialList: ProcessMachineServingMaterial[];
  processParameterList: ProcessParameter[];
  processDimensionalPropertyList: ProcessDimensionalProperty[];
  processMaterialCharacteristicList: ProcessMaterialCharacteristic[];
  processPricingList: ProcessPricing[];
}

export interface ProcessPricing {
  id: number;
  name: string;
  processPricingConditions: ProcessPricingCondition[];
}

export interface MultiplierProcessPricingParameter {
  id: number;
  quantity: number;
  price: number;
  multiplier: number;
  invoiceLineItem: InvoiceLineItem;
  currency: Currency;
  processPricing: Type;
  quantityUnitType: UnitType;
  processPricingConditionType: ProcessPricingConditionType;
  multiplierProcessPricingParameter: MultiplierProcessPricingParameter;
}

export interface ProcessPricingParameter {
  id: number;
  quantity: number;
  price: number;
  multiplier: number;
  invoiceLineItem: InvoiceLineItem;
  currency: Currency;
  processPricing: Type;
  quantityUnitType: UnitType;
  processPricingConditionType: ProcessPricingConditionType;
  multiplierProcessPricingParameter: MultiplierProcessPricingParameter;
}

export interface ProcessPricingConditionType {
  id: number;
  name: string;
  operandType: Type;
  measurementType: Type;
  processProfileType: Type;
}

export interface ValueSignType {
  id: number;
  name: string;
  symbol: string;
}

export interface OperatorType {
  id: number;
  name: string;
  symbol: string;
  operandType: Type;
}

export interface UnitType {
  id: 1;
  name: string;
  symbol: string;
  displayName: string;
  measurementType: Type;
  isDefault: boolean;
}

export interface ProcessPricingCondition {
  id: number;
  value: number;
  valueInDefaultUnit: number;
  processPricingConditionType: ProcessPricingConditionType;
  valueSignType: ValueSignType;
  operatorType: OperatorType;
  processPricing: Type;
  unitType: UnitType;
}

export interface SubOrderValue {
  value: number;
  measurementType: Type;
}

export interface PartPricingProfileView {
  invoiceGroup: string;
  processPricingParameters: MultiplierProcessPricingParameter;
  subOrderValue: SubOrderValue;
  invoiceItem: number;
  finalInvoiceItemCost: number;
}

export interface PricingProfileDetailedView {
  id: number;
  name: string;
  processProfileId: number;
  processProfile: ProcessProfile;
  vendorProfile: VendorProfile;
  processPricingParameterList?: ProcessPricingParameter[];
  processPricingConditionList?: ProcessPricingCondition[];
  partPricingProfileViews?: PartPricingProfileView[];
}

export interface PricingProfileDetails {
  processPricingId: number;
  processProfileId: number;
  processVendorName: string;
  pricingProfileName: string;
  material: string;
  equipment: string;
  processProfileName: string;
}

export interface InvoiceItemSummary {
  invoiceItem: Type;
  unitCost: {
    flatCharge: number;
    variableCharge: number;
  };
  extendedCost: number;
}

export interface PricingProfile {
  pricingProfileDetailedView: PricingProfileDetailedView;
  partCostInvoiceItemSummary: InvoiceItemSummary;
  toolCostInvoiceItemSummary: InvoiceItemSummary;
}

export interface ProcessProfileDetailedView {
  rfqMediaId: number;
  processProfileId: number;
  userId: number;
  processProfileView: ProcessProfile;
  processPricingViews: PricingProfileDetailedView[];
  vendorProfile: VendorProfile;
  userSummary2: UserSummary;
}

export interface PartQuoteQueryDto {
  processPricingId: number;
  partId: number;
  totalPartCost: number;
  totalToolCost: number;
  totalExtendedCost: number;
  totalCost: number;
  vendorMinimumOrderAmount: number;
}

export interface MatchedProcessProfile {
  rfqMediaId: number;
  partId: number;
  processProfileId: number;
  processProfileName: string;
  corporateName: string;
  vendorId: number;

  material: string;
  subscriptionId?: number;
  subscriptionType?: string;

  facilityName: string;
  equipment: string;
  city: string;
  confidentialityId: number;
  countryId: number;
  state: string;
  street1: string;
  street2: string;
  zipCode: string;
}

export enum AppPartStatus {
  // RFQ Created
  READY_FOR_QUOTING = 'READY_FOR_QUOTING',
  // RFQ In Progress
  AUTO_QUOTED = 'AUTO_QUOTED',
  MANUAL_QUOTE = 'MANUAL_QUOTE',
  QUOTE_EXPIRED = 'QUOTE_EXPIRED',
  AWAITING_QUOTE = 'AWAITING_QUOTE',
  NO_QUOTE = 'NO_QUOTE',
  // Order In Progress
  PLACING_ORDER = 'PLACING_ORDER',
  PRE_PRODUCTION = 'PRE_PRODUCTION',
  PRODUCTION = 'PRODUCTION',
  POST_PRODUCTION = 'POST_PRODUCTION',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  // Order Complete
  PART_COMPLETE = 'PART_COMPLETE',
  PAYMENT_PENDING = 'PAYMENT_PENDING'
}

export enum PartStatusTypeEnum {
  READY_FOR_QUOTING = 'READY_FOR_QUOTING',
  AUTO_QUOTED = 'AUTO_QUOTED',
  MANUAL_QUOTE = 'MANUAL_QUOTE',
  QUOTE_EXPIRED = 'QUOTE_EXPIRED',
  PLACING_ORDER = 'PLACING_ORDER',
  PRE_PRODUCTION = 'PRE_PRODUCTION',
  PRODUCTION = 'PRODUCTION',
  POST_PRODUCTION = 'POST_PRODUCTION',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  PART_COMPLETE = 'PART_COMPLETE',
  AWAITING_QUOTE = 'AWAITING_QUOTE',
  NO_QUOTE = 'NO_QUOTE',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PART_AWAITING_VENDORS = 'PART_AWAITING_VENDORS',
  MATCHED_SUPPLIER = 'MATCHED_SUPPLIER',
  NO_MATCHED_SUPPLIER = 'NO_MATCHED_SUPPLIER',
  PART_AWAITING_RELEASE = 'PART_AWAITING_RELEASE',
  QUOTE_ACCEPTED = 'QUOTE_ACCEPTED',
  VENDOR_CONFIRMED = 'VENDOR_CONFIRMED',
  VENDOR_MANUAL_QUOTED = 'VENDOR_MANUAL_QUOTED'
}

export enum AppPartStatusId {
  READY_FOR_QUOTING = 1,
  AUTO_QUOTED = 2,
  MANUAL_QUOTE = 3,
  QUOTE_EXPIRED = 4,
  AWAITING_QUOTE = 5,
  PLACING_ORDER = 6,
  PRE_PRODUCTION = 7,
  PRODUCTION = 8,
  POST_PRODUCTION = 9,
  SHIPPED = 10,
  DELIVERED = 11,
  PART_COMPLETE = 12,
  PAYMENT_PENDING = 13,
  NO_QUOTE = 14,
  PART_AWAITING_VENDORS = 15,
  MATCHED_SUPPLIER = 16,
  NO_MATCHED_SUPPLIER = 17,
  PART_AWAITING_RELEASE = 18,
  VENDOR_CONFIRMED = 19,
  QUOTE_ACCEPTED = 20,
  VENDOR_MANUAL_QUOTED = 21
}

export enum AppPartTypeEnum {
  CONNECT_PART = 'CONNECT_PART',
  CONNECT_PROPOSAL_PART = 'CONNECT_PROPOSAL_PART',
  PRODUCTION_PART = 'PRODUCTION_PART',
  PRODUCTION_PROPOSAL_PART = 'PRODUCTION_PROPOSAL_PART',
  RFQ_PART = 'RFQ_PART'
}

export enum AppPartTypeId {
  CONNECT_PART = 4,
  CONNECT_PROPOSAL_PART = 5,
  PRODUCTION_PART = 2,
  PRODUCTION_PROPOSAL_PART = 3,
  RFQ_PART = 1
}
export interface BidProjectProcess {
  id: number;
  vendorId: number;
  releasePriority: number;
  bidProjectId: number;
  bidProjectProcessStatusType: {
    id: number;
    name: string;
    description: string;
  };
  matchedProcessProfileIds: number[];
  vendorName: string;
}

export interface ReferenceFile {
  id: number;
  name: string;
  uploadedAt: string;
  location: string;
  mediaId: number;
}

export class PartStatusSequenced {
  displayName: string;
  partStatusTypeId: number;
  partStatusTypeName: string;
  projectTypeId: number;
  projectTypeName: string;
  sequence: number;
}

export enum GovernanceMediaEnum {
  PROJECT_PROFILE,
  PROPOSAL_PART,
  PART
}
