import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo = {
    id: 502,
  };
  constructor() { }

  getHeader(userId: number = 0, roleId: number = 0): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('userID', userId.toString())
      .set('roleId', roleId.toString());

    return headers;
  }

  getUserInfo() {
    return this.userInfo;
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }
}
