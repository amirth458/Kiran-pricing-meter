import { NumberFilter } from 'ag-grid-community';

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