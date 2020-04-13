import { ProcessProfile } from './part.model';
import { BidProcessStatusType } from './confirm.sub-order.release';
import { MetaData } from './metadata.model';

export interface BiddingOrderDetail {
  bidProcessTimeLeft: string;
  acceptedOrderDetails: Array<GetAllCustomerPartView>;
  matchingSuppliersProfilesView: Array<VendorOrderDetail>;
  bidOrderStatus?: MetaData;
}

export interface VendorOrderDetail {
  id?: number;
  vendorName: string;
  processProfileViews: Array<ProcessProfile>;
  bidProcessStatus: BidProcessStatusType;
  counterOfferPrice: number;
  bidOfferPrice: number;
  bidProcessId: number;
}

export interface GetAllCustomerPartView {
  partId: number;
  bidOrderItemId: number;
  customerOrder: number;
  priceAccepted: number;
  materialPropertyType: string;
  materialPropertyValues: Array<string>;
  equipmentPropertyType: string;
  equipmentPropertyValues: Array<string>;
  customerName: string;
  quantity: number;
  postProcessTypeNames: string;
  shippedDate: Date;
  deliveryDate: Date;
  partStatusType: string;
  fileName: string;
  connectorServiceId: number;
  filePath: string;
  nda: string;
  postProcessTypeIds: Array<number>;
  partStatusTypeId: number;
  rfqMediaId: number;
  surfaceRoughness: string;
  tolerance: Array<string>;
  x: ValueUnit;
  y: ValueUnit;
  z: ValueUnit;
  volume: ValueUnit;
  surfaceArea: ValueUnit;
  thumbnail100Location: string;
  thumbnail200Location: string;
  thumbnail400Location: string;
  shippingAddress: string;
}

export interface ValueUnit {
  value: number;
  valueInDefaultUnit: number;
  unitId: number;
}
