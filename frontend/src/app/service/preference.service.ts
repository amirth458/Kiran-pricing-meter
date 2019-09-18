import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<any>(url);
  }

  getPreferenceByVendorId(id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/preferences`;
    return this.http.get<any>(url);
  }

  createPreference(preference: VendorPreference): Observable<any> {
    const url = `${environment.apiBaseUrl}/preferences`;
    return this.http.post<any>(url, preference);
  }

  updatePreference(preference: Preference): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${preference.vendorId}/preferences`;
    return this.http.put<any>(url, preference);
  }
}
