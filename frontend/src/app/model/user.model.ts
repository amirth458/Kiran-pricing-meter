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
  ){
    this.userName = userName;
    this.emailAddress = emailAddress;
    this.firstName = firstName;
    this.lastName = lastName;
    this.suffix = suffix;
    this.active = active;
    this.token = token;
    this.tokenExpiration = tokenExpiration;

  }
}

