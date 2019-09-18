import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor() { }

  getHeader(userId: number = 0, roleId: number = 0): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('userID', userId.toString())
      .set('roleId', roleId.toString());

    return headers;
  }

  getUserInfo() {
    const userInfo = {
      id: 502,
      name: 'Mike',
      email: 'mike-test@gmail.com',
      phone: '3434343',
      street1: 'fdfdf',
      street2: 'dfdfdfdfd',
      city: 'cdscsdcsd',
      state: 'dfdfd',
      zipCode: '323454',
      country: {
        id: 1,
        name: 'Afghanistan'
      },
      confidentiality: {
        id: 1,
        name: 'No'
      },
      vendorType: {
        id: 1,
        name: 'retail'
      },
      vendorCertificates: [
        {
          id: 2,
          name: 'FDA Certified'
        },
        {
          id: 1,
          name: 'ITAR Certified'
        }
      ]
    };
    return userInfo;
  }
}
