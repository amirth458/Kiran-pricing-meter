import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConferenceRequest, Conference } from '../model/conference.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {
  constructor(public http: HttpClient) {}

  createConference(body: ConferenceRequest): Observable<Conference> {
    return this.http.post<Conference>(environment.procurementApiBaseUrl + '/conference', body);
  }

  getConferenceByPartId(partId: string, hostUserId: number, participantUserId: number = null): Observable<Conference> {
    let url = environment.procurementApiBaseUrl + `/conference/part/${partId}?hostUserId=${hostUserId}`;
    if (participantUserId) {
      url += `&participantUserId=${participantUserId}`;
    }
    return this.http.get<Conference>(url);
  }

  getConferenceByVendorOrderId(
    vendorOrderId: string,
    hostUserId: number,
    participantUserId: number = null
  ): Observable<Conference> {
    let url = environment.procurementApiBaseUrl + `/conference/vendor-order/${vendorOrderId}?hostUserId=${hostUserId}`;
    if (participantUserId) {
      url += `&participantUserId=${participantUserId}`;
    }
    return this.http.get<Conference>(url);
  }

  getConferenceByCustomerOrderId(
    customerOrderId: string,
    hostUserId: number,
    participantUserId: number = null
  ): Observable<Conference> {
    let url =
      environment.procurementApiBaseUrl + `/conference/customer-order/${customerOrderId}?hostUserId=${hostUserId}`;
    if (participantUserId) {
      url += `&participantUserId=${participantUserId}`;
    }
    return this.http.get<Conference>(url);
  }

  getConferenceByBidOrderId(
    bidOrderId: string,
    hostUserId: number,
    participantUserId: number = null
  ): Observable<Conference> {
    let url = environment.procurementApiBaseUrl + `/conference/bid-order/${bidOrderId}?hostUserId=${hostUserId}`;
    if (participantUserId) {
      url += `&participantUserId=${participantUserId}`;
    }
    return this.http.get<Conference>(url);
  }
}
