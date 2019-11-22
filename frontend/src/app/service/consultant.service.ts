import { Observable, of } from "rxjs";
import { FilterOption } from "./../model/vendor.model";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "./../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ConsultantService {
  constructor(private http: HttpClient) {}

  getConsultations(filterOption: FilterOption = null): Observable<any> {
    let url = `${environment.apiBaseUrl}/consultation/search`;
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken
    });
    const body = {
      query: null
    };
    if (filterOption) {
      url +=
        "?page=" +
        filterOption.page.toString() +
        "&size=" +
        filterOption.size.toString();
      url += "&sort=" + filterOption.sort.toString();
      if (filterOption.q) {
        body.query = filterOption.q;
      }
    }
    return this.http.post<any>(url, body, { headers });
  }

  getConsultationById(id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/consultation/${id}/`;
    return this.http.get<any>(url);
  }

  createComment(id: number, comment: string): Observable<any> {
    const url = `${environment.apiBaseUrl}/consultation/${id}/comment/`;
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken
    });
    return this.http.post(url, { comment }, { headers });
  }
}
