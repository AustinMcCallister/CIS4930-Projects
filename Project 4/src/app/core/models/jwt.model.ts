export class JWT {
  UserData: {
    userId: string,
    firstName: string,
    lastName: string,
    emailAddress: string
  };
  iat: Date;
  exp: Date;
  sub: string;

  constructor() {
    this.UserData = { userId: '', firstName: '', lastName: '', emailAddress: '' };
    this.iat = new Date();
    this.exp = new Date();
    this.sub = '';
  }
}
