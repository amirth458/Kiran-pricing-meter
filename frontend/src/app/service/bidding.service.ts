import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ConfirmSubOrderRelease, ConfirmSubOrderReleaseResponse } from '../model/confirm.sub-order.release';
import { environment } from '../../environments/environment';
import { FilterOption } from '../model/vendor.model';
import { LegacyBidHistory } from '../model/billing.model';
import { BidPart, Part } from '../model/part.model';
import { PmProjectReleaseQueue, PmProjectRequest, VendorConfirmationResponse } from '../model/bidding.order';
import { Util } from '../util/Util';

@Injectable({
  providedIn: 'root'
})
export class BiddingService {
  constructor(public http: HttpClient) {}

  biddingConfirmation(bidding: ConfirmSubOrderRelease): Observable<ConfirmSubOrderReleaseResponse> {
    return this.http.post<ConfirmSubOrderReleaseResponse>(`${environment.apiBaseUrl}/admin/bidding/confirm`, bidding);
  }

  confirmBidOrder(bidOrderId: number, winningBidProcessId: number, winningBidVendorId: number): Observable<any> {
    return this.http.patch<any>(
      `${environment.apiBaseUrl}/admin/bidding/${bidOrderId}/${winningBidProcessId}/${winningBidVendorId}/confirm-vendor-accepted-bid`,
      null
    );
  }

  getBidHistory(partId: number): Observable<LegacyBidHistory[]> {
    return this.http.post<LegacyBidHistory[]>(
      `${environment.apiBaseUrl}/admin/bid-part-cost-history?part-id=${partId}`,
      {}
    );
  }

  getPmProjectReleaseQueue(req: FilterOption, filter: PmProjectRequest): Observable<PmProjectReleaseQueue[]> {
    const url = `${environment.apiBaseUrl}/admin/pm-project/release-queue`;
    return this.http.post<any>(url, filter, { params: Util.buildParameters(req) });
  }

  getReleasedPmProjectBids(biddingId: number): Observable<VendorConfirmationResponse[]> {
    return this.http.get<VendorConfirmationResponse[]>(
      `${environment.apiBaseUrl}/admin/pm-project/vendor-confirmation/${biddingId}`
    );
  }

  getPartsByBidPmProjectId(bidPmProjectId: number): Observable<Part[]> {
    return this.http.get<Part[]>(
      `${environment.apiBaseUrl}/admin/pm-project/parts?bid-pm-project-id=${bidPmProjectId}`
    );
  }

  // get parts with proposal part info and quote
  getDetailedPartInfo(offerId: number, vendorId: number): Observable<BidPart[]> {
    return this.http.post<BidPart[]>(`${environment.apiBaseUrl}/admin/bidding/v2/pm-project/detail-view`, {
      offerId,
      vendorId
    });
  }

  restartBidding(bidOrderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/bidding/restart-bidding-process?bid-order-id=${bidOrderId}`;
    return this.http.put<any>(url, null);
  }
}
