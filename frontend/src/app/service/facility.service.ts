import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FilterOption } from '../model/vendor.model';
import { Facility } from '../model/facility.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(
    public http: HttpClient
  ) { }

  getFacilities(id: number, filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/facilities`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
      params = params.append('q', filterOption.q.toString());
    }
    return this.http.get<any>(url, { params });
  }

  getFacility(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities/${id}`;

    return this.http.get(url);
  }

  createFacility(vendorId: number, facility: Facility): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities`;

    return this.http.post(url, facility);
  }

  updateFacility(vendorId: number, id: number, facility: Facility): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities/${id}`;
    return this.http.put(url, facility);
  }

  deleteFacility(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities/${id}`;
    return this.http.delete(url);
  }
}
