import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preference, VendorPreference } from '../model/preferences.model';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor(
    public http: HttpClient
  ) { }

  getPreference(id: number): Observable<any> {
    const url = `/api/v1/preferences/${id}`;
    return this.http.get<any>(url);
  }

  getPreferenceByVendorId(id: number): Observable<any> {
    const url = `/api/v1/vendors/${id}/preferences`;
    return this.http.get<any>(url);
  }

  createPreference(preference: VendorPreference): Observable<any> {
    const url = `/api/v1/preferences`;
    return this.http.post<any>(url, preference);
  }

  updatePreference(preference: Preference): Observable<any> {
    const url = `/api/v1/vendors/${preference.vendorId}/preferences`;
    return this.http.put<any>(url, preference);
  }
}
