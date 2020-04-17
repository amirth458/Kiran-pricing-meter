import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { MetaData } from '../model/metadata.model';
import { SubscriptionType, Addon } from '../model/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  constructor(public http: HttpClient) {}

  getAdminMetaData(type: string): Observable<MetaData[]> {
    const url = `${environment.apiBaseUrl}/admin/metadata/${type}`;
    return this.http.get<MetaData[]>(url).pipe(map((res: any) => res.metadataList || []));
  }

  getMetaData(type: string): Observable<MetaData[]> {
    const url = `${environment.procurementApiBaseUrl}/metadata/${type}`;
    return this.http.get<any>(url).pipe(map(res => res.metadataList));
  }

  getProcessMetaData(type: string): Observable<MetaData[]> {
    const url = `${environment.managementBaseUrl}/process-metadata/${type}`;
    return this.http.get<any>(url).pipe(map(res => res.metadataList));
  }

  getVendorSubscriptionTypes(): Observable<SubscriptionType[]> {
    const url = `${environment.apiBaseUrl}/vendor-metadata/contract/subscription-type?product-type-id=1`;
    return this.http.get<SubscriptionType[]>(url);
  }

  getVendorAddons(): Observable<Addon[]> {
    const url = `${environment.apiBaseUrl}/vendor-metadata/contract/add-ons?product-type-id=1`;
    return this.http.get<Addon[]>(url);
  }

  getCustomerSubscriptionTypes(): Observable<SubscriptionType[]> {
    const url = `${environment.apiBaseUrl}/vendor-metadata/contract/subscription-type?product-type-id=2`;
    return this.http.get<SubscriptionType[]>(url);
  }

  getCustomerAddons(): Observable<Addon[]> {
    const url = `${environment.apiBaseUrl}/vendor-metadata/contract/add-ons?product-type-id=2`;
    return this.http.get<Addon[]>(url);
  }
}
