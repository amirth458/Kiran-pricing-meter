import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { FilterOption } from "./../model/vendor.model";
import { environment } from "./../../environments/environment";
import { Part } from "../model/part.model";
import { Pageable } from "./../model/pageable.model";
import { map } from "rxjs/operators";
import {
  RfqData,
  PricingProfileDetailedView,
  PricingProfile
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

  getFullfillmentSettings(): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/fulfillment-setting`;
    return this.http.get(url);
  }

  setFullfillmentSetting(data): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/fulfillment-setting`;
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
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    const body = {
      statusId: 2,
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
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    const body = {
      statusId: 2, // auto quoted
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
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    const body = {
      statusId: 3, // manual qu4ote
      isManual: true,
      partId: null
    };
    return this.http.post<Pageable<Part>>(url, body, { headers, params });
  }

  getPricingProfileDetail(
    id: number,
    partId: number,
    customerId: number
  ): Observable<PricingProfile> {
    if (environment.isTestDataEnabled) {
      // test data
      partId = 44;
      id = 136;
      customerId = 105;
    }

    const url = `${environment.procurementApiBaseUrl}/process-pricing-profile/${id}`;
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    const body = {
      partId,
      customerId
    };

    return this.http
      .post<PricingProfile[]>(url, body, { headers })
      .pipe(map(itemArray => itemArray[0] || null));
  }

  getPartDetail(id: number): Observable<Part> {
    const url = `${environment.procurementApiBaseUrl}/part/${id}`;
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    return this.http.get<Part>(url, { headers });
  }

  createPartQuoteDetail(quoteDetail) {
    const url = `${environment.procurementApiBaseUrl}/part-quote-detail`;
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    return this.http.post(url, quoteDetail, { headers });
  }

  getRfqDetail(id: number): Observable<RfqData> {
    const url = `${environment.procurementApiBaseUrl}/rfq/${id}`;
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    return this.http.get<RfqData>(url, { headers });
  }

  getPricingProfiles(partId: number): Observable<PricingProfileDetailedView[]> {
    if (environment.isTestDataEnabled) {
      // test data
      partId = 178;
    }

    const url = `${environment.procurementApiBaseUrl}/process-pricing-profile/matched-profiles/${partId}`;
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    return this.http.get<PricingProfileDetailedView[]>(url, { headers });
  }
}
