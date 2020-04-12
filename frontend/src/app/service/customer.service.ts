import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Customer } from '../model/customer.model';
import { FilterOption } from '../model/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(public http: HttpClient) {}

  getCustomer(filterOption: FilterOption): Observable<Customer[]> {
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }

    const url = `${environment.apiBaseUrl}/admin/customer`;
    return this.http.get<Customer[]>(url, { params });
  }

  activateCustomer(customerId) {
    const url = `${environment.apiBaseUrl}/admin/customer/${customerId}/user-active`;
    return this.http.put<Customer[]>(url, {});
  }

  deactivateCustomer(customerId) {
    const url = `${environment.apiBaseUrl}/admin/customer/${customerId}/user-deactive`;
    return this.http.put<Customer[]>(url, {});
  }

  unlockCustomer(customerId) {
    const url = `${environment.apiBaseUrl}/admin/customer/${customerId}/user-unlock`;
    return this.http.put<Customer[]>(url, {});
  }

  getUserById(userId) {
    const url = `${environment.apiBaseUrl}/admin/customer/user/${userId}`;
    return this.http.get(url);
  }

  getCustomerById(customerId) {
    const url = `${environment.apiBaseUrl}/admin/customer/${customerId}`;
    return this.http.get(url);
  }

  getShippingInfo(userId) {
    const url = `${environment.apiBaseUrl}/admin/customer/user/${userId}/shipping-address`;
    return this.http.get(url);
  }
}
