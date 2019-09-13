import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FilterOption } from '../model/vendor.model';
import { Facilities } from '../model/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(
    private http: HttpClient
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

  createFacilities(facility: Facilities): Observable<any> {
    const url = `/api/v1/facilities`;
    return this.http.post(url, facility);
  }

  updateFacilities(id: number, facility: Facilities): Observable<any> {
    const url = `/api/v1/facilities/${id}`;
    return this.http.put(url, facility);
  }

  deleteFacilities(id: number): Observable<any> {
    const url = `/api/v1/facilities/${id}`;
    return this.http.delete(url);
  }
}
