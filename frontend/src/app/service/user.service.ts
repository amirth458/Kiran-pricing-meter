import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

import * as crypto from 'crypto-js';
import { Router } from '@angular/router';

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

  login(data: User) {
    return this.http.post(environment.apiBaseUrl + '/auth/signin',
      { usernameOrEmail: data.username, password: data.password });
  }

  signup(userData: User) {
    return this.http.post(environment.apiBaseUrl + '/auth/signup',
      { ...userData });
  }

  logout() {
    localStorage.removeItem('3d-token');
    this.route.navigateByUrl('/login');
  }

  isLoggedIn() {
    return !!localStorage.getItem('3d-token');
  }

  getTokenData(): { accessToken: string, tokenType: string, generatedIn: string, expiryDate: string } {
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

  saveTokenData(tokenData: { accessToken: string, tokenType: string, generatedIn: string, expiryDate: string }) {
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

  setVendorInfo(vendorInfo) {
    this.vendorInfo = vendorInfo;
  }

  getVendorInfo() {
    return this.vendorInfo;
  }
}
