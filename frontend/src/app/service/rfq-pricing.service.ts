import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { FilterOption } from '../model/vendor.model';
import { Part, PartDimension, PartQuoteQueryDto, ProcessProfile } from '../model/part.model';
import { Pageable } from '../model/pageable.model';
import { PricingBreakdown, PricingBreakDown } from '../model/pricing.breakdown';
import { RfqData, PricingProfileDetailedView, PartQuote } from '../model/part.model';

@Injectable({
  providedIn: 'root'
})
export class RfqPricingService {
  constructor(private http: HttpClient) {}

  getPricingSettings(): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pricing-setting`;
    return this.http.get(url);
  }

  setPricingSetting(data): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/pricing-setting`;
    return this.http.put(url, data);
  }

  getRecentAutoPrices(filterOption: FilterOption = null): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    const body = {
      statusIds: [2],
      isManual: false,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, { headers, params });
  }

  getQueuedManualPricing(filterOption: FilterOption = null): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    // TODO:
    // Replace constant values bellow when part status type API is available
    const body = {
      statusIds: [2, 5], // auto quoted
      isManual: true,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, { headers, params });
  }

  getManuallyPriced(filterOption: FilterOption = null, isNoBid): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    // TODO:
    // Replace constant values bellow when part status type API is available
    const body = {
      statusIds: [isNoBid ? 14 : 3], // 3: manual quote, 14: No Quote
      isManual: true,
      partId: null,
      isNoBid
    };
    return this.http.post<Pageable<Part>>(url, body, { headers, params });
  }

  getPartDetail(id: number, generateSignedUrl = true): Observable<Part> {
    const url = `${environment.procurementApiBaseUrl}/part/${id}?generateSignedUrl=${generateSignedUrl}`;

    return this.http.get<Part>(url);
  }

  createPartQuoteDetail(quoteDetail) {
    const url = `${environment.procurementApiBaseUrl}/part-quote-detail`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.post(url, quoteDetail, { headers });
  }

  getRfqDetail(id: number): Observable<RfqData> {
    const url = `${environment.procurementApiBaseUrl}/rfq/${id}`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.get<RfqData>(url, { headers });
  }

  getPricingProfiles(partId: number): Observable<PricingProfileDetailedView[]> {
    const url = `${environment.procurementApiBaseUrl}/process-pricing-profile/matched-profiles/${partId}`;
    return this.http.get<PricingProfileDetailedView[]>(url);
  }

  getPartQuoteByPricingIds(partId: number, processPricingIds: string): Observable<PartQuoteQueryDto[]> {
    return this.http
      .post<PartQuoteQueryDto[]>(`${environment.apiBaseUrl}/part-quote-by-pricing-ids?is-global-rule=true`, {
        partId,
        processPricingIds
      })
      .pipe(
        map(arr =>
          (arr || []).reduce((acc: any, value: PartQuoteQueryDto) => {
            acc[value.processPricingId] = value;
            return acc;
          }, {})
        )
      );
  }

  getPartQuote(partId: number): Observable<PartQuote> {
    const url = `${environment.procurementApiBaseUrl}/part-quote/admin/parts/${partId}`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.get<PartQuote>(url, { headers });
  }

  getPartQuotes(partIds: number[]): Observable<PartQuote[]> {
    const url = `${environment.procurementApiBaseUrl}/part-quote/parts`;
    return this.http.post<PartQuote[]>(url, { partIds: partIds });
  }

  getPartDimension(partId: number): Observable<PartDimension> {
    const url = `${environment.procurementApiBaseUrl}/part/${partId}/dimension?generateSignedUrl=true`;
    return this.http.get<PartDimension>(url);
  }

  getPricingProfileDetail(profileIds: number[]): Observable<PricingProfileDetailedView[]> {
    const url = `${environment.managementBaseUrl}/process-pricing-profile/ids`;
    return this.http.post<PricingProfileDetailedView[]>(url, profileIds);
  }

  getProcessProfileDetail(profileIds: number[]): Observable<ProcessProfile[]> {
    const url = `${environment.managementBaseUrl}/process-profile/ids`;
    return this.http.post<ProcessProfile[]>(url, profileIds);
  }

  getProcessPricingDetail(profileId: number): Observable<any> {
    const url = `${environment.managementBaseUrl}/process-pricing-profile/${profileId}/price`;
    return this.http.post<any>(url, {});
  }

  getScreenPricingBreakdown(breakDown: PricingBreakDown): Observable<PricingBreakdown> {
    return this.http.post<PricingBreakdown>(`${environment.apiBaseUrl}/part-pricing-breakdown`, breakDown);
  }

  setNoBid(partId: string) {
    return this.http.patch(`${environment.apiBaseUrl}/admin/part/${partId}/no-bid`, {});
  }
}
