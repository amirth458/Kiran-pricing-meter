import { NumberFilter } from 'ag-grid-community';
import { Vendor } from './vendor.model';

export interface User {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface RegisterUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  company: string;
  department: string;
}

export interface RegisterStatus {
  userDetails: number;
  vendorDetails: number;
  machineDetails: number;
}

export interface AuthData {
  accessToken: string;
  expiryDate: string;
  generatedIn: string;
  is_admin: boolean;
  roles: Array<string>;
  tokenType: string;
}

export interface CustomerIndustry {
  id: number;
  name: string;
}
export interface CustomerData {
  id: number;
  name: string;
  email: string;
  division: string;
  phoneNo: string;
  industries: CustomerIndustry[];
}

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  department: string;
  phoneNo: string;
  vendor: Vendor;
  machines: any[];
  roles: string[];
  is_admin: boolean;
}
