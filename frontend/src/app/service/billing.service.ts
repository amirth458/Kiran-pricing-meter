import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';
import { MetaData } from '../model/metadata.model';
import { Payment, PaymentDetails } from '../model/billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  constructor(public http: HttpClient) {}

  getPaymentStatusType(): Observable<MetaData[]> {
    return this.http
      .get<any>(environment.apiBaseUrl + '/admin/metadata/payment_status_type')
      .pipe(map(res => res.metadataList));
  }

  getPaymentInfo(orderId: string): Observable<PaymentDetails> {
    return this.http.get<PaymentDetails>(environment.apiBaseUrl + '/admin/billing/orders/' + orderId);
  }

  addNote(note: string, orderId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/admin/purchase-order/orders/${orderId}/notes`, { note });
  }

  getPaymentList(body: Payment, filter: FilterOption = null): Observable<Payment[]> {
    const params = new HttpParams()
      .set('page', filter.page.toString())
      .set('size', filter.size.toString())
      .set('sort', filter.sort);
    return this.http.post<Payment[]>(`${environment.apiBaseUrl}/admin/billing/search`, body, { params });
  }

  approve(orderId: number) {
    return this.http.put<any>(`${environment.apiBaseUrl}/admin/billing/orders/${orderId}/approve`, null);
  }

  reject(orderId: number) {
    return this.http.put<any>(`${environment.apiBaseUrl}/admin/billing/orders/${orderId}/reject`, null);
  }
}
