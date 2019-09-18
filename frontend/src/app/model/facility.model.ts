import { VendorMetaData } from './vendor.model';

export class Facility {
    id: string;
    venderInfoId: string;
    facilityName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    certifications: string;
    createdBy: string;
    createdDate: string;
    updatedDate: string;
}

export interface Facilities {
  vendorId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  facilityCertificationList: VendorMetaData[];
  street1: string;
  street2: string;
  zipCode: string;
}
