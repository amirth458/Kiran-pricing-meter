import { RfqData } from './../model/part.model';
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { FilterOption } from "./../model/vendor.model";
import { environment } from "./../../environments/environment";
import { Part } from "../model/part.model";
import { Pageable } from './../model/pageable.model';

@Injectable({
  providedIn: "root"
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

  getRecentAutoPrices(
    filterOption: FilterOption = null
  ): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    const body = {
      statusId: 2,
      isManual: false,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, {headers, params});
  }

  getQueuedManualPricing(
    filterOption: FilterOption = null
  ): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    const body = {
      statusId: 2,  // auto quoted
      isManual: true,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, {headers, params});
  }

  getManuallyPriced(
    filterOption: FilterOption = null
  ): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    const body = {
      statusId: 3,  // manual quote
      isManual: true,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, {headers, params});
  }

  getPartDetail(id: number): Observable<Part> {
    const url = `${environment.procurementApiBaseUrl}/part/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.get<Part>(url, {headers});
  }

  createPartQuoteDetail(quoteDetail) {
    const url = `${environment.procurementApiBaseUrl}/part-quote-detail`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.post(url, quoteDetail, {headers});
  }

  getRfqDetail(id: number): Observable<RfqData> {
    const url = `${environment.procurementApiBaseUrl}/rfq/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });

    return this.http.get<RfqData>(url, {headers});
  }

  getPricingProfiles(filter: FilterOption): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          vendorName: "VendCo",
          pricingProfile: "Fast",
          material: "ABS M30",
          equipment: "Fortus 450",
          processProfile: "Fortus 450 BS M30",
          postProcess: "Electropolishing",
          machinesMatched: 2,
          totalCost: 1238,
          esitmatedDelivery: "10/12/2019",
          matchScore: 4.9
        }
      ]
    };
    return of(data);
  }
}
