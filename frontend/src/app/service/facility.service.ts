import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get<any>(url, { params, headers });
  }

  getFacility(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get(url, {
      headers
    });
  }

  createFacility(vendorId: number, facility: Facility): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.post(url, facility, { headers });
  }

  updateFacility(vendorId: number, id: number, facility: Facility): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.put(url, facility, { headers });
  }

  deleteFacility(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/facilities/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.delete(url, { headers });
  }
}
