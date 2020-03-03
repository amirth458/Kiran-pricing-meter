export interface PartNoteView {
  users: Array<Participant>;
  messages: Array<PartNote>;
  participants: Array<number>;
}

export interface PartNote {
  id: number;
  message: string;
  userId: number;
  partId: number;
  readBy: Array<number>;
  createdDate: Date;
  user?: Participant;
}

export interface Participant {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  department: string;
  phoneNo: string;
  vendor: any;
  machines: any;
  roles: Array<string>;
  is_admin: boolean;
}
