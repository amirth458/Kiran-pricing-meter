import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vendor, VendorMetaData } from '../model/vendor.model';
import { environment } from 'src/environments/environment';
import { VendorMetaDataTypes } from '../mockData/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    public http: HttpClient
  ) {}

  getVendorMetaData(type: string): Observable < VendorMetaData[] > {
    const url = `${environment.apiBaseUrl}/vendor-metadata/${type}`;
    if (type === VendorMetaDataTypes.ShippingPrivider) {
      return this.http.get < any > (url).pipe(
        map(res => res)
      );
    } else {
      return this.http.get < any > (url).pipe(
        map(res => res.metadataList)
      );
    }
  }

  getVendorDetail(id: number): Observable < Vendor > {
    const url = `${environment.apiBaseUrl}/vendors/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get < Vendor > (url, { headers });
  }

  createVendorProfile(profile: Vendor) {
    const url = `${environment.apiBaseUrl}/vendors/`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.post < Vendor > (url, profile, {
      headers
    });
  }

  updateVendorProfile(profile: Vendor) {
    const url = `${environment.apiBaseUrl}/vendors/${profile.id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });

    return this.http.put < Vendor > (url, profile, {
      headers
    });
  }

}
