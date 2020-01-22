import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { FilterOption } from "./../model/vendor.model";
import { environment } from "./../../environments/environment";
import { Part, PartDimension } from "../model/part.model";
import { Pageable } from "./../model/pageable.model";
import { map } from "rxjs/operators";
import {
  RfqData,
  PricingProfileDetailedView,
  PricingProfile,
  PartQuote
} from "./../model/part.model";
import { Observable } from "rxjs";

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
      params = params.append("page", filterOption.page.toString());
      params = params.append("size", filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem("dms-auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    const body = {
      statusIds: [2],
      isManual: false,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, { headers, params });
  }

  getQueuedManualPricing(
    filterOption: FilterOption = null
  ): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append("page", filterOption.page.toString());
      params = params.append("size", filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem("dms-auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    const body = {
      statusIds: [2, 5], // auto quoted
      isManual: true,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, { headers, params });
  }

  getManuallyPriced(
    filterOption: FilterOption = null
  ): Observable<Pageable<Part>> {
    const url = `${environment.procurementApiBaseUrl}/part/search`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append("page", filterOption.page.toString());
      params = params.append("size", filterOption.size.toString());
    }
    const data = JSON.parse(localStorage.getItem("dms-auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    const body = {
      statusIds: [3], // manual qu4ote
      isManual: true,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, { headers, params });
  }

  getPricingProfileDetail(id: number[]): Observable<PricingProfile[]> {
    // if (environment.isTestDataEnabled) {
    //   // test data
    //   partId = 44;
    //   id = 136;
    //   customerId = 105;
    // }

    const url = `${
      environment.managementBaseUrl
    }/process-pricing-profile/process-profile?ids=${id.join(",")}`;

    return this.http.get<PricingProfile[]>(url);
  }

  getPartDetail(id: number, generateSignedUrl = true): Observable<Part> {
    const url = `${environment.procurementApiBaseUrl}/part/${id}?generateSignedUrl=${generateSignedUrl}`;

    return this.http.get<Part>(url);
  }

  createPartQuoteDetail(quoteDetail) {
    const url = `${environment.procurementApiBaseUrl}/part-quote-detail`;
    const data = JSON.parse(localStorage.getItem("dms-auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    return this.http.post(url, quoteDetail, { headers });
  }

  getRfqDetail(id: number): Observable<RfqData> {
    const url = `${environment.procurementApiBaseUrl}/rfq/${id}`;
    const data = JSON.parse(localStorage.getItem("dms-auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    return this.http.get<RfqData>(url, { headers });
  }

  getPricingProfiles(partId: number): Observable<PricingProfileDetailedView[]> {
    // if (environment.isTestDataEnabled) {
    //   // test data
    //   partId = 178;
    // }

    const url = `${environment.procurementApiBaseUrl}/process-pricing-profile/matched-profiles/${partId}`;

    return this.http.get<PricingProfileDetailedView[]>(url);
  }

  getPartQuote(partId: number): Observable<PartQuote> {
    const url = `${environment.procurementApiBaseUrl}/part-quote/parts/${partId}`;
    const data = JSON.parse(localStorage.getItem("dms-auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
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
}
