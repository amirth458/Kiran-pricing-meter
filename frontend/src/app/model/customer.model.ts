export class Customer {
  userId: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userLocked: boolean;
  userActive: boolean;
  customerId: number;
  customerName: string;
  customerPhoneNo: string;
  customerActive: boolean;
  customerDivision: string;
  customerCountry: string;
  customerIndustries: string;
}

export class CustomerDetails {
  id: number;
  name: string;
  division: string;
  phoneNo: string;
  industries: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  isActive: boolean;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    department: string;
    phoneNo: string;
    vendor: string;
    machines: string;
    roles: Array<string>;
    zoomUserEmail: string;
    locked: boolean;
    is_admin: boolean;
  };
  contractId: number;
}
