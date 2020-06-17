import { Part } from './part.model';

export enum OrderStatusTypeId {
  ORDER_NOT_STARTED = 1,
  ORDER_IN_PROGRESS = 2,
  ORDER_COMPLETE = 3,
  ORDER_PENDING = 4,
  VENDOR_DOWNSELECTION = 5
}

export interface Order {
  id: number;
  totalJobs: number;
  totalAmount: number;
  ndaSigned: boolean;
  customerId: number;
  customerName: string;
  customerAddress: string;
  vendorId: number;
  vendor: VendorProfile;
  shippedBy: Date;
  expectedDeliveryBy: Date;
  diligentOrder: boolean;
  vendorSubOrders: Array<Part> | Array<number>;
  externalOrderNumber: string;
  facilityName: string;
  bidProcessId: number;
  orderQuantity: number;
  vendorOrderType: VendorOrderType;
  vendorOrderStatusType: VendorOrderStatusType;
  trackingNumber: string;
  bidOrderId: number;
  vendorCost: number;
  shippingProvider: ShippingProvider;

  orderId?: number;
  partId?: string;
  totalParts?: number;
  unitCount?: number;
  totalUnitCount?: number;
}

export interface VendorShippingProvider {
  id: number;
  vendorId: number;
  accountId: string;
  status: VendorShippingProviderStatus;
  shippingProvider: ShippingProvider;
}

export interface ShippingProvider {
  id: number;
  name: string;
}

export enum VendorShippingProviderStatus {
  ACTIVE,
  INACTIVE
}

export enum VendorOrderEnum {
  DILIGENT = 'DILIGENT',
  DILIGENT_PRODUCTION = 'DILIGENT_PRODUCTION',
  EXTERNAL = 'EXTERNAL',
  ONPREM = 'ONPREM'
}

export interface VendorOrderStatusType {
  id: number;
  name: string;
  description: string;
  displayName: string;
}

export interface VendorOrderType {
  id: number;
  name: string;
  description: string;
}

export interface VendorMetadata {
  id: number;
  name: string;
}

interface VendorProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;

  country: VendorMetadata;
  confidentiality: VendorMetadata;
  vendorType: VendorMetadata;
  vendorCertificates: Array<VendorMetadata>;
  vendorIndustries: Array<VendorMetadata>;
  user: UserSummary;
  certificateURLs: Array<string>;
  primaryContactFirstName: string;
  primaryContactLastName: string;
  approved: boolean;
  approvedBy: string;
  approvedAt: Date;
  comment: string;
}

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  department: string;
  phoneNo: string;
  vendor: VendorProfile;
  machines: Array<VendorMachineryView>;
}

export interface VendorMachineryView extends BaseViewAuditable {
  name: string;
  serialNumber: string;
  vendorId: number;
  equipment: EquipmentView;
  vendorFacility: VendorFacilityView;
  machineServingMaterialList: Array<MachineServingMaterialView>;
  vendorMachineryEquipmentFeatureList: Array<VendorMachineryEquipmentFeature>;
}

export interface VendorMachineryEquipmentFeature {
  id: number;
  value: number;
  equipmentFeatureType: any;
  unitType: any;
  vendorMachineryId: number;
}

export interface MachineServingMaterialView extends BaseViewAuditable {
  material: MaterialView;
}

export interface MaterialView {
  id: number;
  name: string;
  genericName: string;
  oemDescription: string;
  materialClassName: string;
  materialFamilyName: string;
  materialTypeName: string;
}

export interface VendorFacilityView extends BaseViewAuditable {
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
  vendorFacilityCertificationList: Array<VendorFacilityCertificationView>;
  certificateURLs: Array<string>;
  primaryContactFirstName: string;
  primaryContactLastName: string;
}

export interface VendorFacilityCertificationView extends BaseViewAuditable {
  facilityCertification: FacilityCertificationView;
}

export interface FacilityCertificationView {
  id: number;
  name: string;
}

export interface EquipmentView {
  id: number;
  name: string;
  oemDescription: string;
  brandedProcessName: string;
  genericProcessName: string;
  processFamily: any; // TODO use correct model
  processTypeName: string;
}

export interface BaseViewAuditable {
  id: number;
  createdBy: string;
  createdDate: Date;
  lastModifiedBy: string;
  lastModifiedDate: Date;
}

export interface Pageable<T> {
  number: number;
  content: T;
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  size: number;
  numberOfElements: number;
  empty: boolean;
}

export interface BidOrder {
  vendorId: number;
  bidOrderId: number;
  bidProcessId: number;
  bidOrderItemCount: number;
  bidOrderItemIds: Array<number>;
  bidOrderItemPartIds: Array<number>;
  bidAmount: number;
  processProfileIds: Array<number>;
  processProfilesNames: string;
  postProcessProfileIds: Array<number>;
  postProcessProfilesNames: string;
  shippingProfile: string;
  additional: string;
  confidentiality: string;
  zip: string;
  customerCountry: string;
  customerCity: string;
  customerZip: string;
  deliveredBy: Array<any>;
  status: {
    bidProcessStatusType: BidProcessStatusType;
    counteredOfferPrice: number;
  };
}

export interface BidProcessStatusType {
  id: number;
  name: string;
  description: string;
}

export class BidOrderDetails {
  bidItems: BidPart[];
  vendorOfferView: {
    bidOfferPrice: number;
    bidOrderItemIdList: number[];
    bidProcessId: number;
    bidProcessStatus: BidProcessStatusType;
    counterOfferPrice: number;
    processProfileViews: any;
    vendorName: string;
  };
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

export class SideMeasurement {
  value: number;
  valueInDefaultUnit: number;
  unitId: number;
}

export enum OrderStatusEnum {
  PRE_PRODUCTION = 'PRE_PRODUCTION',
  PRODUCTION = 'PRODUCTION',
  POST_PRODUCTION = 'POST_PRODUCTION',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED'
}

export class AcceptBidBody {
  acceptProcessProfileRequest: {
    bidOrderItemId: string;
    processProfileIds: number[];
  }[];
}

export enum BidStatusEnum {
  NO_RESPONSE = 'NO_RESPONSE',
  ACCEPTED = 'ACCEPTED',
  COUNTER_OFFER = 'COUNTER_OFFER'
}

export enum ProjectTypeEnum {
  CONNECT_PROJECT = 4,
  DESIGN_PROJECT = 2,
  PRODUCTION_PROJECT = 3,
  RFQ_PROJECT = 1
}

export enum VendorOrderTypeEnum {
  DILIGENT = 1,
  EXTERNAL = 2,
  ONPREM = 3,
  DILIGENT_PRODUCTION = 4,
  DILIGENT_CONNECT = 5
}

export interface SearchOpt {
  projectTypeId: number;
  startDate: Date;
  endDate: Date;
  searchQuery: string;
}

export interface ProjectSearchResult {
  partId: number;
  rfq_id: number;
  order_id: number;
  customer_name: string;
  same_vendor: boolean;
  totalRowCount: number;
}
