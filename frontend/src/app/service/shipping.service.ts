import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FilterOption } from '../model/vendor.model';
import { Shipping } from '../model/shipping.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(
    public http: HttpClient
  ) { }

  getShippings(vendorId: number, filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider`;
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

  getShipping(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get(url, { headers });
  }

  createShipping(vendorId: number, shipping: Shipping): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.post(url, shipping, { headers });
  }

  updateShipping(vendorId: number, id: number, shipping: Shipping): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.put(url, shipping, { headers });
  }

  deleteShipping(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.delete(url, { headers });
  }
}
