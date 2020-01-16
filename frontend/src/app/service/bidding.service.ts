import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ConfirmSubOrderRelease, ConfirmSubOrderReleaseResponse } from '../model/confirm.sub-order.release';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BiddingService {

  constructor(public http: HttpClient) { }

  biddingConfirmation(bidding: ConfirmSubOrderRelease): Observable<ConfirmSubOrderReleaseResponse> {
    return this.http.post<ConfirmSubOrderReleaseResponse>(`${environment.apiBaseUrl}/admin/bidding/confirm`, bidding);
  }

}
