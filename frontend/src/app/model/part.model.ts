import { VendorProfile } from './vendorProfile.model';
import { UserSummary } from './user.model';

export interface Type {
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
  volume: PartDimensionValue;
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
  invoiceItemId: number;
  unit: number;
  unitPrice: number;
  value: number;
  partQuoteId: number;
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
  partQuoteInvoiceLineItemDetails: PartQuoteInvoiceLineItem;
}

export interface PartQuote {
  id: number;
  partId: number;
  isExpired: boolean;
  expiredAt: string;
  totalCost: number;
  partQuoteInvoiceItemDetails: PartQuoteInvoiceItem[];
  partQuoteDetails: Array<AutoPriceView>;
}

export interface AutoPriceView {
  partQuoteId: number;
  invoiceItemId: number;
  value: number;
  unit: number;
  unitPrice: number;
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
  partStatusType: PartStatusType;
  order: PartOrder;
  postProcessTypeIds: number[];
  partCustomParameterList: PartCustomParameter[];
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

export interface Country {
  id: number;
  name: string;
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
}
