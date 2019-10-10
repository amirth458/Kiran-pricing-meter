import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preference, VendorPreference } from '../model/preferences.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor(
    public http: HttpClient
  ) { }

  getPreference(id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/preferences/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get<any>(url, { headers });
  }

  getPreferenceByVendorId(id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/preferences`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get<any>(url, { headers });
  }

  createPreference(preference: VendorPreference): Observable<any> {
    const url = `${environment.apiBaseUrl}/preferences`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.post<any>(url, preference, { headers });
  }

  updatePreference(preference: Preference): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${preference.vendorId}/preferences`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.put<any>(url, preference, { headers });
  }
}
