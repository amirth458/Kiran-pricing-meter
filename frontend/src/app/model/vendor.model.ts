export interface VendorMetaData {
  id: number;
  name: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  vendorType: VendorMetaData;
  city: string;
  state: string;
  country: VendorMetaData;
  street1: string;
  street2: string;
  zipCode: string;
  confidentiality: VendorMetaData;
  clientExclusionCondition: string;
  rfqExclusionCondition: string;
  vendorCertificates: VendorMetaData[];
}

export class FilterOption {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  'sort.sorted': boolean;
  'sort.unsorted': boolean;
  unpaged: boolean;
}
