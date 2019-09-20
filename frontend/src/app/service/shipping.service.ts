import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.get<any>(url, { params });
  }

  getShipping(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider/${id}`;

    return this.http.get(url);
  }

  createShipping(vendorId: number, shipping: Shipping): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider`;

    return this.http.post(url, shipping);
  }

  updateShipping(vendorId: number, id: number, shipping: Shipping): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider/${id}`;
    return this.http.put(url, shipping);
  }

  deleteShipping(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/vendor-shipping-provider/${id}`;
    return this.http.delete(url);
  }
}
