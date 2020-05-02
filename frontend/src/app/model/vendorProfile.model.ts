export class VendorProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  confidentiality: {
    id: number;
    name: string;
  };
}
