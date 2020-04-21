import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User, CustomerData } from '../model/user.model';

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
    id: 501
  };
  accessToken = null;
  vendorInfo = null;

  constructor(public http: HttpClient, public route: Router) {}
  getHeader(userId: number = 0, roleId: number = 0): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('userID', userId.toString())
      .set('roleId', roleId.toString());

    return headers;
  }

  getUserInfo() {
    return JSON.parse(localStorage.getItem('admin-user'));
  }

  setUserInfo(userInfo) {
    localStorage.setItem('admin-user', JSON.stringify(userInfo));
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
    localStorage.removeItem('admin-3d-token');
    this.route.navigateByUrl('/login');
  }

  isLoggedIn() {
    return !!localStorage.getItem('admin-3d-token');
  }

  getTokenData(): {
    accessToken: string;
    tokenType: string;
    generatedIn: string;
    expiryDate: string;
  } {
    const tokenData = JSON.parse(localStorage.getItem('admin-3d-token'));
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

  saveTokenData(tokenData: { accessToken: string; tokenType: string; generatedIn: string; expiryDate: string }) {
    const tokenInfo = {
      ...tokenData
    };
    this.accessToken = tokenInfo.accessToken;
    tokenInfo.accessToken = crypto.AES.encrypt(JSON.stringify(tokenInfo.accessToken), environment.encryptionKey);
    tokenInfo.generatedIn = crypto.AES.encrypt(JSON.stringify(tokenInfo.generatedIn), environment.encryptionKey);
    tokenInfo.expiryDate = crypto.AES.encrypt(JSON.stringify(tokenInfo.expiryDate), environment.encryptionKey);

    localStorage.setItem('admin-3d-token', JSON.stringify(tokenInfo));
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
    localStorage.setItem('admin-vendor', JSON.stringify(vendorInfo));
    this.vendorInfo = vendorInfo;
  }

  getVendorInfo() {
    return JSON.parse(localStorage.getItem('admin-vendor'));
  }

  setVendorContract(vendorId, addOns, subscription) {
    const url = `${environment.apiBaseUrl}/admin/contract`;
    return this.http.post<any>(url, {
      vendorId,
      addOnsIds: addOns,
      subscriptionType: {
        id: subscription
      }
    });
  }

  getVendorContract(vendorId): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/contract?vendor-id=${vendorId}`;
    return this.http.get<any>(url);
  }

  updateVendorContract(contractId, addOns, subscription) {
    const url = `${environment.apiBaseUrl}/admin/contract/${contractId}`;
    return this.http.put<any>(url, {
      addOnsIds: addOns,
      subscriptionType: {
        id: subscription
      }
    });
  }

  deleteVendorContract(contractId) {
    const url = `${environment.apiBaseUrl}/admin/contract/${contractId}`;
    return this.http.delete<any>(url);
  }

  setCustomerContract(customerId, addOns, subscription) {
    const url = `${environment.apiBaseUrl}/admin/contract`;
    return this.http.post<any>(url, {
      customerId,
      addOnsIds: addOns,
      subscriptionType: {
        id: subscription
      }
    });
  }

  getCustomerContract(customerId): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/contract/customer?customer-id=${customerId}`;
    return this.http.get<any>(url);
  }

  updateCustomerContract(contractId, addOns, subscription) {
    const url = `${environment.apiBaseUrl}/admin/contract/${contractId}`;
    return this.http.put<any>(url, {
      addOnsIds: addOns,
      subscriptionType: {
        id: subscription
      }
    });
  }

  deleteCustomerContract(contractId) {
    const url = `${environment.apiBaseUrl}/admin/contract/${contractId}`;
    return this.http.delete<any>(url);
  }

  getRegisterUserInfo() {
    return JSON.parse(localStorage.getItem('admin-RegisterUser'));
  }

  setRegisterUserInfo(user) {
    localStorage.setItem('admin-RegisterUser', JSON.stringify(user));
  }

  getRegisterVendorInfo() {
    return JSON.parse(localStorage.getItem('admin-RegisterVendor'));
  }

  setRegisterVendorInfo(vendor) {
    localStorage.setItem('admin-RegisterVendor', JSON.stringify(vendor));
  }

  getRegisterMachineInfo() {
    return JSON.parse(localStorage.getItem('admin-RegisterMachines'));
  }

  setRegisterMachineInfo(machines) {
    localStorage.setItem('admin-RegisterMachines', JSON.stringify(machines));
  }

  registerUser(user) {
    const url = `${environment.managementBaseUrl}/users/signup`;
    return this.http.post(url, user);
  }

  resetRegisterInfo() {
    localStorage.removeItem('admin-RegisterUser');
    localStorage.removeItem('admin-RegisterVendor');
    localStorage.removeItem('admin-RegisterMachines');
  }

  getAllUsers(page, size, filter) {
    const url = `${environment.managementBaseUrl}/users/all/search?page=${page}&size=${size}`;
    return this.http.post<any>(url, filter);
  }

  approveUsers(ids) {
    const url = `${environment.managementBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.patch<any>(
      url,
      {
        approved: true,
        vendorIds: ids,
        comment: 'Approved at ' + new Date().toISOString()
      },
      {
        headers
      }
    );
  }

  declineUsers(ids, comment = '') {
    const url = `${environment.managementBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.patch<any>(
      url,
      {
        approved: false,
        vendorIds: ids,
        comment
      },
      {
        headers
      }
    );
  }

  approveUser(id) {
    const url = `${environment.managementBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.patch<any>(
      url,
      {
        approved: true,
        vendorIds: [Number(id)],
        comment: 'Approved at ' + new Date().toISOString()
      },
      {
        headers
      }
    );
  }

  declineUser(id, declineMessage = '') {
    const url = `${environment.managementBaseUrl}/vendors/approve`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.patch<any>(
      url,
      {
        approved: false,
        vendorIds: [Number(id)],
        comment: declineMessage
      },
      {
        headers
      }
    );
  }

  getUserDetails(id) {
    const url = `${environment.managementBaseUrl}/users/${id}`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(url, {
      headers
    });
  }

  setUserFormStatus(id) {
    localStorage.setItem('admin-validInUserForm', String(id));
  }

  getUserFormStatus() {
    return Number(localStorage.getItem('admin-validInUserForm'));
  }

  setVendorFormStatus(id) {
    localStorage.setItem('admin-validInVendorForm', String(id));
  }

  getVendorFormStatus() {
    return Number(localStorage.getItem('admin-validInVendorForm'));
  }

  getCustomer(customerId: number): Observable<CustomerData> {
    const url = `${environment.procurementApiBaseUrl}/customer/${customerId}`;
    return this.http.get<CustomerData>(url);
  }

  getFilterColumns(): Observable<any[]> {
    const url = `${environment.managementBaseUrl}/users/user-filter-columns`;
    return this.http.get<any[]>(url);
  }
}
