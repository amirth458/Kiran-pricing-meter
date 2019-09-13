import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Vendor, FilterOption, VendorMetaData } from '../model/vendor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    private http: HttpClient
  ) { }

  getVendorMetaData(type: string): Observable<VendorMetaData[]> {
    const url = `/api/v1/vendor-metadata/${type}`;
    return this.http.get<any>(url).pipe(
      map(res => res.metadataList)
    );
  }

  getVendorDetail(id: number): Observable<Vendor> {
    const url = `/api/v1/vendors/${id}`;
    return this.http.get<Vendor>(url);
  }

  createVendorProfile(profile: Vendor) {
    const url = `/api/v1/vendors`;
    return this.http.post(url, profile);
  }

  updateVendorProfile(profile: Vendor) {
    const url = `/api/v1/vendors`;
    return this.http.put(url, profile);
  }

  getFacilities(id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/facilities`;
    return this.http.get<any>(url);
  }

  getMachinery(id: number, filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/machinery`;
    let params = new HttpParams();
    if (filterOption) {
        params = params.append('offset', filterOption.offset.toString());
        params = params.append('pageNumber', filterOption.pageNumber.toString());
        params = params.append('pageSize', filterOption.pageSize.toString());
        params = params.append('paged', filterOption.paged.toString());
        params = params.append('sort.sorted', filterOption['sort.sorted'].toString());
        params = params.append('sort.unsorted', filterOption['sort.unsorted'].toString());
        params = params.append('unpaged', filterOption.unpaged.toString());
    }
    return this.http.get<any>(url, {params});
  }
}
