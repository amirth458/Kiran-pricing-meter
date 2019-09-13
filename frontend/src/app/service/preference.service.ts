import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preference } from '../model/preferences.model';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor(
    private http: HttpClient
  ) { }

  getPreference(id: number): Observable<any> {
    const url = `/api/v1/preferences/${id}`;
    return this.http.get<any>(url);
  }

  createPreference(preference: Preference): Observable<any> {
    const url = `/api/v1/preferences`;
    return this.http.post<any>(url, preference);
  }

  updatePreference(id: number, preference: Preference): Observable<any> {
    const url = `/api/v1/preferences/${id}`;
    return this.http.put<any>(url, preference);
  }
}
