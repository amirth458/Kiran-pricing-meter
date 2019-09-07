export class User {
  constructor(
    public userName: string = "",
    public emailAddress: string = "",
    public firstName: string = "",
    public lastName: string = "",
    public suffix: string = "",
    public active:boolean = true,
    public token: string = "",
    public tokenExpiration:string = "",
    public avatar: string = "",
    public state: string = "",
    public address1: string = "",
    public address2: string = "",
    public country: string = "",
    public phoneNumber: string = "",
    public zipcode: string = "",
    public password: string = "",
    public middleName: string = "",
  ){
    this.userName = userName;
    this.emailAddress = emailAddress;
    this.firstName = firstName;
    this.lastName = lastName;
    this.suffix = suffix;
    this.active = active;
    this.token = token;
    this.tokenExpiration = tokenExpiration;
    this.avatar = avatar;
    this.state = state;
    this.address1 = address1;
    this.address2 = address2;
    this.country = country;
    this.phoneNumber = phoneNumber;
    this.zipcode = zipcode;
    this.password = password;
    this.middleName = middleName;
  }
}

