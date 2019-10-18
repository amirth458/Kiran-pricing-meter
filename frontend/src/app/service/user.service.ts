import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

import * as crypto from 'crypto-js';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
@Injectable({
  providedIn: 'root'
})

export class UserService {

  userInfo = {
    id: 501,
  };
  accessToken = null;
  vendorInfo = null;

  constructor(public http: HttpClient, public route: Router) { }
  getHeader(userId: number = 0, roleId: number = 0): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('userID', userId.toString())
      .set('roleId', roleId.toString());

    return headers;
  }

  getUserInfo() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUserInfo(userInfo) {
    localStorage.setItem('user', JSON.stringify(userInfo));
    this.userInfo = userInfo;
  }

  login(data: User) {
    return this.http.post(environment.apiBaseUrl + '/auth/signin', {
      usernameOrEmail: data.username,
      password: data.password
    });
  }

  signup(userData: User) {
    return this.http.post(environment.apiBaseUrl + '/auth/signup', {
      ...userData
    });
  }

  logout() {
    localStorage.removeItem('3d-token');
    this.route.navigateByUrl('/login');
  }

  isLoggedIn() {
    return !!localStorage.getItem('3d-token');
  }

  getTokenData(): {
    accessToken: string,
    tokenType: string,
    generatedIn: string,
    expiryDate: string
  } {
    const tokenData = JSON.parse(localStorage.getItem('3d-token'));
    if (tokenData == null) {
      return null;
    }
    this.accessToken = crypto.AES.decrypt(tokenData.accessToken.toString(), environment.encryptionKey);
    return {
      ...tokenData,
      accessToken: this.accessToken,
      generatedIn: crypto.AES.decrypt(tokenData.generatedIn.toString(), environment.encryptionKey),
      expiryDate: crypto.AES.decrypt(tokenData.expiryDate.toString(), environment.encryptionKey)
    };
  }

  saveTokenData(tokenData: {
    accessToken: string,
    tokenType: string,
    generatedIn: string,
    expiryDate: string
  }) {
    const tokenInfo = {
      ...tokenData
    };
    this.accessToken = tokenInfo.accessToken;
    tokenInfo.accessToken = crypto.AES.encrypt(JSON.stringify(tokenInfo.accessToken), environment.encryptionKey);
    tokenInfo.generatedIn = crypto.AES.encrypt(JSON.stringify(tokenInfo.generatedIn), environment.encryptionKey);
    tokenInfo.expiryDate = crypto.AES.encrypt(JSON.stringify(tokenInfo.expiryDate), environment.encryptionKey);

    localStorage.setItem('3d-token', JSON.stringify(tokenInfo));
  }

  tokenNeedsRefresh(): boolean {
    const tokenData = this.getTokenData();
    const expDate = new Date(crypto.AES.decrypt(tokenData.expiryDate.toString(), environment.encryptionKey));
    const dateNow = new Date(Date.now());

    if (expDate.getFullYear() >= dateNow.getFullYear()) {
      if (expDate.getMonth() >= dateNow.getMonth()) {
        if (expDate.getDate() >= dateNow.getDate()) {
          if (expDate.getTime() > dateNow.getTime()) {
            return false;
          }
        }
      }
    }
    return true;
  }

  // TODO: Do an encryption and decryption
  setVendorInfo(vendorInfo) {
    localStorage.setItem('vendor', JSON.stringify(vendorInfo));
    this.vendorInfo = vendorInfo;
  }

  getVendorInfo() {
    return JSON.parse(localStorage.getItem('vendor'));
  }

  getRegisterUserInfo() {
    return JSON.parse(localStorage.getItem('RegisterUser'));
  }

  setRegisterUserInfo(user) {
    localStorage.setItem('RegisterUser', JSON.stringify(user));
  }

  getRegisterVendorInfo() {
    return JSON.parse(localStorage.getItem('RegisterVendor'));
  }

  setRegisterVendorInfo(vendor) {
    localStorage.setItem('RegisterVendor', JSON.stringify(vendor));
  }

  getRegisterMachineInfo() {
    return JSON.parse(localStorage.getItem('RegisterMachines'));
  }

  setRegisterMachineInfo(machines) {
    localStorage.setItem('RegisterMachines', JSON.stringify(machines));
  }

  registerUser(user) {
    const url = `${environment.apiBaseUrl}/users/signup`;
    return this.http.post(url, user);
  }

  resetRegisterInfo() {
    localStorage.removeItem('RegisterUser');
    localStorage.removeItem('RegisterVendor');
    localStorage.removeItem('RegisterMachines');
  }

  getAllUsers() {
    const url = `${environment.apiBaseUrl}/users/all`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(url, {
      headers
    });
  }

  approveUsers(ids) {
    const url = `${environment.apiBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.patch<any>(url, {
        approved: true,
        vendorIds: ids,
        comment: 'Approved at ' + new Date().toISOString()
      },
      {
        headers
      });
  }

  declineUsers(ids, comment = '') {
    const url = `${environment.apiBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.patch<any>(url, {
        approved: false,
        vendorIds: ids,
        comment
      },
      {
        headers
      });
  }

  approveUser(id) {
    const url = `${environment.apiBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.patch<any>(url, {
        approved: true,
        vendorIds: [Number(id)],
        comment: 'Approved at ' + new Date().toISOString()
      },
      {
        headers
      });
  }

  declineUser(id, declineMessage = '') {
    const url = `${environment.apiBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.patch<any>(url, {
        approved: false,
        vendorIds: [Number(id)],
        comment: declineMessage
      },
      {
        headers
      });
  }

  getUserDetails(id) {
    const url = `${environment.apiBaseUrl}/users/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(url,
      {
        headers
      });
  }

  setUserFormStatus(id) {
    localStorage.setItem('validInUserForm', String(id));
  }

  getUserFormStatus() {
    return Number(localStorage.getItem('validInUserForm'));
  }

  setVendorFormStatus(id) {
    localStorage.setItem('validInVendorForm', String(id));
  }

  getVendorFormStatus() {
    return Number(localStorage.getItem('validInVendorForm'));
  }
}
