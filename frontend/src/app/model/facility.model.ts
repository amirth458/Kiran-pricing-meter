import { VendorMetaData } from './vendor.model';

export interface Facility {
  id: string;
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
  createdBy: string;
  createdDate: string;
  updatedDate: string;
}
