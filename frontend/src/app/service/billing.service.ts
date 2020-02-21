import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Payment, PaymentDetails } from '../model/billing.model';
import { FilterOption } from '../model/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(public http: HttpClient) { }


  getPaymentStatusType() {
    return this.http.get(environment.apiBaseUrl + '/metadata/payment_status_type');
  }

  getPaymentInfo(orderId: string): Observable<PaymentDetails> {
    return this.http.get<PaymentDetails>(environment.apiBaseUrl + '/admin/billing/orders/' + orderId);
  }

  addNote(note: string, orderId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/admin/purchase-order/orders/${orderId}/notes`, { note });
  }


  getPaymentList(body: Payment, filter: FilterOption = null): Observable<Payment[]> {
    const params = new HttpParams()
      .set("page", filter.page.toString())
      .set("size", filter.size.toString())
      .set("sort", filter.sort);

    return this.http.post<Payment[]>(`${environment.apiBaseUrl}/admin/billing/search`, body, { params });
  }

  approveOrder(body) {
    return this.http.put<any>(`${environment.apiBaseUrl}/admin/billing/orders/${body.orderId}/approve`, body);
  }

  rejectOrder(body) {
    return this.http.put<any>(`${environment.apiBaseUrl}/admin/billing/orders/${body.orderId}/reject`, body);
  }
}
