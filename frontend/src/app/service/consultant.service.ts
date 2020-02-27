import { Observable, of } from 'rxjs';
import { FilterOption } from './../model/vendor.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {
  constructor(private http: HttpClient) {}

  getConsultations(filterOption: FilterOption = null): Observable<any> {
    let url = `${environment.marketApiBaseUrl}/consultation/search`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      '3d-application-token': environment.adminAPIToken,
      'device-info': navigator.userAgent
    });
    const body = {
      query: null
    };
    if (filterOption) {
      url +=
        '?page=' +
        filterOption.page.toString() +
        '&size=' +
        filterOption.size.toString();
      url += '&sort=' + filterOption.sort.toString();
      if (filterOption.q) {
        body.query = filterOption.q;
      }
    }
    return this.http.post<any>(url, body, { headers });
  }

  getConsultationById(id: number): Observable<any> {
    const url = `${environment.marketApiBaseUrl}/consultation/${id}/`;
    return this.http.get<any>(url);
  }

  createComment(id: number, comment: string): Observable<any> {
    const url = `${environment.marketApiBaseUrl}/consultation/${id}/comment/`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      '3d-application-token': environment.adminAPIToken
    });
    return this.http.post(url, { comment }, { headers });
  }
}
