export interface VendorMetaData {
  id: number;
  name: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  vendorType: { id: number, name: string };
  vendorIndustries: Array<{ id: number, name: string }>;
  city: string;
  state: string;
  country: { id: number, name: string };
  street1: string;
  street2: string;
  zipCode: string;
  confidentiality: { id: number, name: string };
  clientExclusionCondition: string;
  rfqExclusionCondition: string;
  vendorCertificates: Array<{ id: number, name: string }>;
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
