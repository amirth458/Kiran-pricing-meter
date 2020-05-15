import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TrackingInfo } from '../model/shipping.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  constructor(public http: HttpClient) {}

  getTrackingInfo(trackingNumber: string, carrier: string): Observable<TrackingInfo> {
    let params = new HttpParams().append('tracking-number', trackingNumber).append('carrier', carrier);
    return this.http.get<TrackingInfo>(environment.apiBaseUrl + '/shipping/track', { params });
  }
}
