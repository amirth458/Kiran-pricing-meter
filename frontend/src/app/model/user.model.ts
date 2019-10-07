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

