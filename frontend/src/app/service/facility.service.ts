import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FilterOption } from '../model/vendor.model';
import { Facility } from '../model/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(
    public http: HttpClient
  ) { }

  getFacilities(id: number, filterOption: FilterOption = null): Observable<any> {
    const url = `/api/v1/vendors/facilities`;
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
    params = params.append('vendor_id', id.toString());
    return this.http.get<any>(url, {params});
  }

  getFacility(vendorId: number, id: number): Observable<any> {
    const url = `/api/v1/vendors/${vendorId}/facilities/${id}`;
    
    return this.http.get(url);
  }

  createFacility(vendorId: number, facility: Facility): Observable<any> {
    const url = `/api/v1/vendors/${vendorId}/facilities`;
    
    return this.http.post(url, facility);
  }

  updateFacility(vendorId: number, id: number, facility: Facility): Observable<any> {
    const url = `/api/v1/vendors/${vendorId}/facilities/${id}`;
    return this.http.put(url, facility);
  }

  deleteFacility(vendorId: number, id: number): Observable<any> {
    const url = `/api/v1/vendors/${vendorId}/facilities/${id}`;
    return this.http.delete(url);
  }
}
