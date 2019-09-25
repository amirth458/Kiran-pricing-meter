import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  userInfo = {
    id: 501,
  };
  vendorInfo = null;
  constructor(public http: HttpClient) { }

  getHeader(userId: number = 0, roleId: number = 0): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('userID', userId.toString())
      .set('roleId', roleId.toString());

    return headers;
  }

  getProfile() {
    
  }

  setProfile() {

  }
  
  getUserInfo() {
    return this.userInfo;
  }

  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  setVendorInfo(vendorInfo) {
    this.vendorInfo = vendorInfo;
  }

  getVendorInfo() {
    return this.vendorInfo;
  }
}
