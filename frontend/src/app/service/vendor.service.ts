import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vendor, FilterOption, VendorMetaData } from '../model/vendor.model';
import { environment } from 'src/environments/environment';
import { VendorMetaDataTypes } from '../mockData/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    public http: HttpClient
  ) { }

  getVendorMetaData(type: string): Observable<VendorMetaData[]> {
    const url = `${environment.apiBaseUrl}/vendor-metadata/${type}`;
    if (type === VendorMetaDataTypes.ShippingPrivider) {
      return this.http.get<any>(url).pipe(
        map(res => res)
      );
    } else {
      return this.http.get<any>(url).pipe(
        map(res => res.metadataList)
      );
    }
  }

  getVendorDetail(id: number): Observable<Vendor> {
    const url = `${environment.apiBaseUrl}/vendors/${id}`;
    return this.http.get<Vendor>(url);
  }

  createVendorProfile(profile: Vendor) {
    const url = `${environment.apiBaseUrl}/vendors/`;
    return this.http.post(url, profile);
  }

  updateVendorProfile(profile: Vendor) {
    const url = `${environment.apiBaseUrl}/vendors/${profile.id}`;
    return this.http.put<Vendor>(url, profile);
  }

}
