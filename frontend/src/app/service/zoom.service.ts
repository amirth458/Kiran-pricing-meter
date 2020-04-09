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

  getConferenceByPartId(partId: string, hostUserId: number, participantUserId: number): Observable<Conference> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Conference>(
      environment.procurementApiBaseUrl +
        `/conference/part/${partId}?hostUserId=${hostUserId}&participantUserId=${participantUserId}`
    );
  }

  getConferenceByVendorOrderId(
    vendorOrderId: string,
    hostUserId: number,
    participantUserId: number
  ): Observable<Conference> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Conference>(
      environment.procurementApiBaseUrl +
        `/conference/vendor-order/${vendorOrderId}?hostUserId=${hostUserId}&participantUserId=${participantUserId}`
    );
  }

  getConferenceByCustomerOrderId(
    customerOrderId: string,
    hostUserId: number,
    participantUserId: number
  ): Observable<Conference> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Conference>(
      environment.procurementApiBaseUrl +
        `/conference/customer-order/${customerOrderId}?hostUserId=${hostUserId}&participantUserId=${participantUserId}`
    );
  }

  getConferenceByBidOrderId(bidOrderId: string, hostUserId: number, participantUserId: number): Observable<Conference> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Conference>(
      environment.procurementApiBaseUrl +
        `/conference/bid-order/${bidOrderId}?hostUserId=${hostUserId}&participantUserId=${participantUserId}`
    );
  }
}
