export interface RfqStatusType {
  id: number;
  name: string;
}

export interface ProjectRfq {
  id: number;
  name: string;
  rfqStatusType: string;
  projectProfile: string;
  isArchived: boolean;
  partList: Part[];
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
  volumn: PartDimensionValue;
  surfaceArea: PartDimensionValue;
  thumbnail100Location: string;
  thumbnail200Location: string;
  thumbnail400Location: string;
  partDimensionStatusType: PartDimensionStatusType;
}

export interface PartStatusType {
  id: number;
  name: string;
  description: string;
  displayName: string;
  display: boolean;
}

export interface PartOrder {
  id: number;
  customerId: number;
  vendorOrderId: number;
  orderStatusType: any;
  isArchived: boolean;
  partList: Part[];
}

export interface PartQuoteDetail {
  id: number;
  invoiceItemTypeName: string;
  unitCount: number;
  unitPrice: number;
  extendedPrice: number;
  partQuoteId: number;
}

export interface PartQuote {
  partQuoteDetailList: PartQuoteDetail[];
  id: number;
  pricingProfileId: number;
  partId: number;
  quoteStatusTypeId: number;
  matchedProfileIds: number[];
  expiredAt: string;
  totalCost: number;
  isManualPricing: boolean;
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
}

export interface Part {
  id: number;
  name: string;
  rfqMedia: RfqMedia;
  processTypeId: number;
  processTypeName: string;
  materialId: number;
  materialName: string;
  cuttingBondingAllowed: boolean;
  quantity: number;
  targetDeliveryDate: string;
  shippingCost: number;
  shippedAt: string;
  manualPricingAllowed: boolean;
  shippingAddress: string;
  partStatusType: PartStatusType;
  order: PartOrder;
  postProcessTypeIds: number[];
  partCustomParameterList: PartCustomParameter[];
  partQuoteList: PartQuote[];
}

export interface ProjectProfile {
  id: number;
  name: string;
  ndaId: number;
  customerId: number;
  countryIds: number[];
  vendorCertIds: number[];
  facilityCertIds: number[];
  antiMatchCertIds: number[];
}

export interface RfqData {
  id: number;
  name: string;
  rfqStatusType: RfqStatusType;
  projectProfile: ProjectProfile;
  isArchived: boolean;
  partList: Part[];
}
