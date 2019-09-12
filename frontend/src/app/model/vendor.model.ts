export class VendorDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  vendorType: string;
  city: string;
  state: string;
  country: string;
  street1: string;
  street2: string;
  zipCode: string;
  confidentiality: string;
  clientExclusionCondition: string;
  rfqExclusionCondition: string;
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
