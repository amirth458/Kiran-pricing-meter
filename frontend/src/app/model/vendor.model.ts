export interface VendorMetaData {
  id: number;
  name: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
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
  certificateURLs: Array<string>;
}

export class FilterOption {
  size: number;
  page: number;
  sort: string;
  q: string;
}

export class Country {
  name: string;
  // tslint:disable-next-line: variable-name
  dial_code: string;
  code: string;
  flag: string;
}

export interface GetListResponse<T> {
  content: T[];
  pageable: any,
  totalElements: number;
  last: boolean;
  totalPages: number;
  first: boolean;
  sort: any;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}