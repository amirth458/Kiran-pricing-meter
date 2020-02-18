import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(public http: HttpClient) { }


  getPaymentInfo(orderId: string): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/admin/billing/orders/' + orderId);
  }

  addNote(note: string, orderId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/admin/purchase-order/orders/${orderId}/notes`, { note });
  }

}
